'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { Order, TableData } from '@/types';
import CircularProgress from '@mui/material/CircularProgress';
import { getCampers, updateCamper } from '@/lib/api';
import SnackBar from '@/components/common/SnackBar';
import EditCamper from '@/app/campers/elements/EditCamper';
import { EnhancedTableHead, EnhancedTableToolbar } from '@/app/campers/elements/EnhancedTable';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof TableData>(
  order: Order,
  orderBy: Key,
): (
  a: TableData,
  b: TableData,
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const Campers = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof TableData>('name');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [campers, setCampers] = React.useState<TableData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCamper, setEditingCamper] = useState<TableData | null>(null);

  const fetchCampers = async () => {
    try {
      setLoading(true);
      const data = await getCampers();
      setCampers(data);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to fetch campers. Please try again.',
        severity: 'error'
      });
      console.error(error);
    } finally {
      setLoading(false);
      setSelected([]);
    }
  };

  useEffect(() => {
    fetchCampers();
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = campers.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - campers.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...campers]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, campers],
  );

  const handleCloseNotification = () => {
      setNotification(prev => ({ ...prev, open: false }));
  };

  const handleEditClick = () => {
    if (selected.length === 1) {
      const camperToEdit = campers.find(camper => camper.id === selected[0]);
      setEditingCamper(camperToEdit || null);
      setEditModalOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingCamper(null);
  };

  const handleEditSave = async (id: string, data: TableData) => {
    try {
      setLoading(true);
      const response = await updateCamper(id, data);
 
      if (response.status === 200) {
        // Update the camper data locally
        setCampers(prevCampers => prevCampers.map(camper => 
          camper.id === parseInt(id) ? {
            ...camper,
            name: data.name || '',
            age: data.age || 0,
            gender: data.gender || '',
            contact_number: data.contact_number || '',
            payment: data.payment || 0,
            tshirt_paid: data.tshirt_paid || false,
            extra: data.extra || 0,
            remarks: data.remarks || '',
            dp_date: data.dp_date || new Date(),
            fp_date: data.fp_date || new Date(),
            status: data.status || ''
          } : camper
        ));

        setNotification({
          open: true,
          message: 'Camper updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `${error}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
    handleEditClose();
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
      <SnackBar notification={notification} handleCloseNotification={handleCloseNotification}/>
      <Paper sx={{ 
        mb: 2,
      }}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          selectedIds={selected.map(id => id.toString())} 
          setNotification={setNotification} 
          onDelete={fetchCampers}
          onEdit={handleEditClick}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={campers.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress size={25} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : campers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No campers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = selected.includes(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.age}</TableCell>
                      <TableCell align="right">{row.gender.charAt(0).toUpperCase() + row.gender.slice(1)}</TableCell>
                      <TableCell align="right">{row.contact_number}</TableCell>
                      <TableCell align="right" sx={{ color: row.status === 'FP' ? 'green' : 'red' }}>{row.payment}</TableCell>
                      <TableCell align="right" sx={{ color: row.tshirt_paid ? 'green' : 'red' }}>{row.tshirt_paid ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="right" sx={{ color: row.extra > 0 ? 'green' : '', fontWeight: 'bold' }}>{row.extra}</TableCell>
                      <TableCell align="right">{row.remarks}</TableCell>
                      <TableCell align="right">{row.dp_date ? new Date(row.dp_date).toLocaleDateString() : ''}</TableCell>
                      <TableCell align="right">{row.fp_date ? new Date(row.fp_date).toLocaleDateString() : ''}</TableCell>
                      <TableCell align="right" sx={{ color: row.status === 'FP' ? 'green' : 'red' }}>{row.status}</TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={campers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <EditCamper 
        editModalOpen={editModalOpen}
        handleEditClose={handleEditClose}
        editingCamper={editingCamper}
        setEditingCamper={setEditingCamper}
        handleEditSave={handleEditSave}
        loading={loading}
      />
    </Box>
  );
}

export default Campers;
