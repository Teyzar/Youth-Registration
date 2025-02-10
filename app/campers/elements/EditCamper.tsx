import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, FormControlLabel, Switch } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { TableData } from '@/types';
import { calculateExtra, isFullyPaid } from '@/lib/functions';


const EditCamper = ({editModalOpen, handleEditClose, editingCamper, setEditingCamper, handleEditSave, loading} : {
    editModalOpen: boolean,
    handleEditClose: () => void,
    editingCamper: TableData | null,
    setEditingCamper: (camper: TableData) => void,
    handleEditSave: (id: string, camper: TableData) => void,
    loading: boolean
}) => {
    return (
        <Dialog open={editModalOpen} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Camper</DialogTitle>
        <DialogContent>
          {editingCamper && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                size="small"
                required
                fullWidth
                value={editingCamper.name}
                onChange={(e) => setEditingCamper({ ...editingCamper, name: e.target.value })}
              />

            <TextField
                fullWidth
                label="Age"
                type="number"
                variant="outlined"
                required
                size="small"
                value={editingCamper.age}
                onChange={(e) => setEditingCamper({ ...editingCamper, age: parseInt(e.target.value) })}
                sx={{ backgroundColor: 'background.paper' }}
            />
              <TextField
                label="Gender"
                size="small"
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
                size="small"
                required
                fullWidth
                value={editingCamper.contact_number}
                onChange={(e) => setEditingCamper({ ...editingCamper, contact_number: e.target.value })}
              />
              <TextField
                label="Payment"
                size="small"
                required
                fullWidth
                value={editingCamper.payment ?? 0}
                onChange={(e) => {
                    const value = e.target.value;
                    setEditingCamper({ 
                        ...editingCamper, 
                        payment: value ? parseInt(value) : 0 
                    });
                }}
              />
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
                label="Remarks"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={editingCamper.remarks ?? ''}
                onChange={(e) => setEditingCamper({ ...editingCamper, remarks: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="error" variant="outlined">Cancel</Button>
          <Button 
            loading={loading}
            loadingPosition="start"
            onClick={() => {
              if (editingCamper?.id) {
                editingCamper.extra = calculateExtra(editingCamper.payment);
                editingCamper.status = isFullyPaid(editingCamper.payment) ? 'FP' : 'DP';
                handleEditSave(editingCamper.id.toString(), editingCamper);
              }
            }}
            variant="outlined" 
            color="success"
            startIcon={<SaveIcon />}
            disabled={!editingCamper?.id}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default EditCamper;