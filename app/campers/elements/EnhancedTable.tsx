import { TableCell, TableHead, TableRow, TableSortLabel, Toolbar, Typography, Box, Checkbox, IconButton, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TableData, Order } from '@/types';
import { deleteCampers } from '@/lib/api';
import { visuallyHidden } from '@mui/utils';

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


export function EnhancedTableHead(props: EnhancedTableProps) {
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
  
  export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
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