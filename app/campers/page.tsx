'use client'

import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, Paper, Checkbox, FormControlLabel, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { Order, TableData } from '@/types';
import CircularProgress from '@mui/material/CircularProgress';
import { deleteCampers, getCampers, registerCamper } from '@/lib/api';
import SnackBar from '@/components/common/SnackBar';
import { EnhancedTableHead, EnhancedTableToolbar, AlertDialog, EditCamper } from '@/app/campers/elements';
import { isFullyPaid, fixPayment } from '@/lib/functions';

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
  const [tableState, setTableState] = React.useState({
    order: 'asc' as Order,
    orderBy: 'name' as keyof TableData,
    page: 0,
    rowsPerPage: 5,
    dense: false
  });
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [campers, setCampers] = React.useState<TableData[]>([]);
  const [loadingState, setLoadingState] = React.useState({
    table: false,
    delete: false,
    saveChanges: false
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [editState, setEditState] = useState({
    modalOpen: false,
    camper: null as TableData | null
  });

  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: '',
    message: ''
  });

  const visibleRows = React.useMemo(() => {
    const sortedData = [...campers].sort(getComparator(tableState.order, tableState.orderBy));
    return sortedData.slice(
      tableState.page * tableState.rowsPerPage,
      tableState.page * tableState.rowsPerPage + tableState.rowsPerPage
    );
  }, [campers, tableState]);

  const handleRequestSort = (property: keyof TableData) => {
    const isAsc = tableState.orderBy === property && tableState.order === 'asc';
    setTableState(prev => ({
      ...prev,
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    }));
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(campers.map(n => n.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: number) => {
    setSelected(prev => {
      const selectedIndex = prev.indexOf(id);
      if (selectedIndex === -1) return [...prev, id];
      return prev.filter(item => item !== id);
    });
  };

  // const handleEditClick = () => {

  // };

  const handleAction = async (action: string) => {

    switch (action) {
      case 'edit':
        if (selected.length === 1) {
          const camperToEdit = campers.find(camper => camper.id === selected[0]);
          setEditState({
            modalOpen: true,
            camper: camperToEdit || null
          });
        }
        break;
      case 'delete':
        try {
          setLoadingState(prev => ({ ...prev, delete: true }));
          const response = await deleteCampers(selected.map(String));
          if (response.status === 200) {
            setNotification({
              open: true,
              message: response.message,
              severity: 'success'
            });
            setCampers(prevCampers => prevCampers.filter(camper => !selected.includes(camper.id)));
          }
          setAlertDialog(prev => ({ ...prev, open: false }));
        } catch (error) {
          setNotification({
            open: true,
            message: `${error}`,
            severity: 'error'
          });
        } finally {
          setLoadingState(prev => ({ ...prev, delete: false }));
        }
        break;
      default:
        break;
    }
  }

  const fetchCampers = async () => {
    try {
      setLoadingState(prev => ({ ...prev, table: true }));
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
      setLoadingState(prev => ({ ...prev, table: false }));
      setSelected([]);
    }
  };

  useEffect(() => {
    fetchCampers();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setTableState(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableState(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableState(prev => ({ ...prev, dense: event.target.checked }));
  };

  const handleUpdateCampers = (data: TableData) => {
    const payment = isFullyPaid(data.payment) ? fixPayment : data.payment;
    
    setCampers(prevCampers => prevCampers.map(camper => 
      camper.id === data.id ? {
        ...camper,
        name: data.name || '',
        nickname: data.nickname || '',
        age: data.age || 0,
        gender: data.gender || '',
        role: data.role || '',
        contact_number: data.contact_number || '',
        payment: payment,
        tshirt_paid: data.tshirt_paid || false,
        extra: data.extra || 0,
        remarks: data.remarks || '',
        dp_date: data.dp_date,
        fp_date: data.fp_date,
        status: data.status || ''
      } : camper
    ));
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    tableState.page > 0 ? Math.max(0, (1 + tableState.page) * tableState.rowsPerPage - campers.length) : 0;

  const handleCloseNotification = () => {
      setNotification(prev => ({ ...prev, open: false }));
  };

  const handleEditSave = async (id: string, data: TableData) => {
    try {
      setLoadingState(prev => ({ ...prev, saveChanges: true }));
      const response = await registerCamper(data, 'PUT', `id=${id}`);
 
      if (response.status === 200) {
        // Update the camper data locally
        handleUpdateCampers(data);
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
      setLoadingState(prev => ({ ...prev, saveChanges: false }));
    }
    setEditState(prev => ({ ...prev, modalOpen: false, camper: null }));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'auto',
    }}>
      <SnackBar notification={notification} handleCloseNotification={handleCloseNotification}/>
      <Paper sx={{ 
        mb: 2,
        mx: 'auto',
      }}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          selectedIds={selected.map(String)} 
          setNotification={setNotification} 
          onDelete={() => setAlertDialog({ open: true, title: 'Delete Campers', message: 'Are you sure you want to delete the selected campers?' })}
          onEdit={() => handleAction('edit')}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750, width: '100%' }}
            aria-labelledby="tableTitle"
            size={tableState.dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={tableState.order}
              orderBy={tableState.orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={(event: React.MouseEvent<unknown>, property: keyof TableData) => handleRequestSort(property)}
              rowCount={campers.length}
            />
            <TableBody>
              {loadingState.table ? (
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
                      onClick={() => handleClick(row.id)}
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
                      <TableCell align="right">{row.nickname}</TableCell>
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
                      <TableCell align="right">{row.role}</TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (tableState.dense ? 33 : 53) * emptyRows,
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
          rowsPerPage={tableState.rowsPerPage}
          page={tableState.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={tableState.dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <EditCamper 
        editModalOpen={editState.modalOpen}
        handleEditClose={() => setEditState(prev => ({ ...prev, modalOpen: false, camper: null }))}
        editingCamper={editState.camper}
        setEditingCamper={(camper) => setEditState(prev => ({ ...prev, camper }))}
        handleEditSave={handleEditSave}
        loading={loadingState.saveChanges}
      />
      <AlertDialog 
        open={alertDialog.open}
        onClose={() => setAlertDialog(prev => ({ ...prev, open: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        buttons={[
          { title: 'Cancel', onClick: () => setAlertDialog(prev => ({ ...prev, open: false })), color: 'primary'},
          { title: 'Confirm', onClick: () => {handleAction('delete')}, color: 'error', startIcon: loadingState.delete ? <CircularProgress size={12} /> : null, disabled: loadingState.delete}
        ]}
      />
    </Box>
  );
}

export default Campers;
