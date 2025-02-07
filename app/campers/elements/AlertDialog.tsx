import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText,
    DialogActions,
    Button,
    Fade,
    ButtonProps,
} from '@mui/material';

interface AlertDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    severity?: 'info' | 'success' | 'warning' | 'error';
    confirmLabel?: string;
    onConfirm?: () => void;
    buttons?: ButtonProps[];
}

const AlertDialog = ({ 
    open, 
    onClose, 
    title, 
    message,
    onConfirm,
    buttons = []
}: AlertDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 3,
                    p: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                }
            }}
        >
            <DialogTitle 
                id="alert-dialog-title"
                sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <DialogContentText 
                    id="alert-dialog-description" 
                    sx={{  }}
                >
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {buttons.map((button, index) => (
                    <Button
                        key={index}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                opacity: 0.8,
                            }
                        }}
                        variant="outlined"
                        {...button}
                    >
                        {button.title}
                    </Button>
                ))}
                {onConfirm && (
                    <Button onClick={onClose} color="inherit">
                        Cancel
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;