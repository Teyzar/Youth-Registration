'use client'

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useState } from 'react';
import TableData from '@/types/table.interface';
import CircularProgress from '@mui/material/CircularProgress';
import { getCampers, deleteCampers, updateCamper } from '@/lib/api';
import SnackBar from '@/components/common/SnackBar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import RegistrationFormData from '@/types/register.types';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

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

interface HeadCell {
  disablePadding: boolean;
  id: keyof TableData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: 'Age',
  },
  {
    id: 'gender',
    numeric: true,
    disablePadding: false,
    label: 'Gender',
  },
  {
    id: 'contact_number',
    numeric: true,
    disablePadding: false,
    label: 'Contact #',
  },
  {
    id: 'payment',
    numeric: true,
    disablePadding: false,
    label: 'Payment',
  },
  {
    id: 'tshirt_paid',
    numeric: true,
    disablePadding: false,
    label: 'T-shirt Paid',
  },
  {
    id: 'extra',
    numeric: true,
    disablePadding: false,
    label: 'Extra',
  },
  {
    id: 'remarks',
    numeric: true,
    disablePadding: false,
    label: 'Remarks',
  },
  {
    id: 'dp_date',
    numeric: true,
    disablePadding: false,
    label: 'DP Date',
  },
  {
    id: 'fp_date',
    numeric: true,
    disablePadding: false,
    label: 'FP Date',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TableData) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedIds: string[];
  setNotification: (notification: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
  onDelete: () => void;
  onEdit: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selectedIds, setNotification, onDelete, onEdit } = props;
  
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Tooltip title="Edit">
            <IconButton 
              onClick={onEdit}
              disabled={numSelected !== 1}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={async () => {
              const response = await deleteCampers(selectedIds);
              if (response.status === 200) {
                setNotification({
                  open: true,
                  message: response.message,
                  severity: 'success'
                });
                onDelete();
              }
            }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Campers
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
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

  const handleEditSave = async (id: string, data: RegistrationFormData) => {
    // TODO: Implement your edit API call here
    try {
      const response = await updateCamper(id, data);
      if (response.status === 200) {
        setNotification({
          open: true,
          message: 'Camper updated successfully',
          severity: 'success'
        });
        fetchCampers();
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `sadsss`,
        severity: 'error'
      });
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

      <Dialog open={editModalOpen} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Camper</DialogTitle>
        <DialogContent>
          {editingCamper && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                required
                fullWidth
                value={editingCamper.name}
                onChange={(e) => setEditingCamper({ ...editingCamper, name: e.target.value })}
              />
              <TextField
                label="Age"
                required
                type="number"
                fullWidth
                value={editingCamper.age}
                onChange={(e) => setEditingCamper({ ...editingCamper, age: parseInt(e.target.value) })}
              />
              <TextField
                label="Gender"
                required
                select
                fullWidth
                value={editingCamper.gender}
                onChange={(e) => setEditingCamper({ ...editingCamper, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
              <TextField
                label="Contact Number"
                required
                fullWidth
                value={editingCamper.contact_number}
                onChange={(e) => setEditingCamper({ ...editingCamper, contact_number: e.target.value })}
              />
              <TextField
                label="Payment Status"
                required
                select
                fullWidth
                value={editingCamper.status}
                onChange={(e) => setEditingCamper({ ...editingCamper, status: e.target.value })}
              >
                <MenuItem value="DP">Downpayment</MenuItem>
                <MenuItem value="FP">Full Payment</MenuItem>
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingCamper.tshirt_paid}
                    onChange={(e) => setEditingCamper({ ...editingCamper, tshirt_paid: e.target.checked })}
                  />
                }
                label="T-Shirt Paid"
              />
              <TextField
                label="Extra Amount"
                type="number"
                fullWidth
                value={editingCamper.extra || 0}
                onChange={(e) => setEditingCamper({ ...editingCamper, extra: parseInt(e.target.value) })}
              />
              <TextField
                label="Remarks"
                fullWidth
                multiline
                rows={3}
                value={editingCamper.remarks}
                onChange={(e) => setEditingCamper({ ...editingCamper, remarks: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="error">Cancel</Button>
          <Button 
            onClick={() => {
              if (editingCamper?.id) {
                handleEditSave(editingCamper.id.toString(), editingCamper);
              }
            }}
            variant="contained" 
            color="success"
            startIcon={<SaveIcon />}
            disabled={!editingCamper?.id}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Campers;
