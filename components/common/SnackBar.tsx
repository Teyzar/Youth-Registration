import { Alert, Snackbar } from "@mui/material";

const SnackBar = ({notification, handleCloseNotification}: 
    {notification: {open: boolean, message: string, severity: 'success' | 'error'}, handleCloseNotification: () => void}) => {
    return (
    <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            variant="filled"
        >
            {notification.message}
        </Alert>
    </Snackbar>
    )
}

export default SnackBar;