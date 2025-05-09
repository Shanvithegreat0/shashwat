import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const FullscreenPrompt = ({ open, onClose, onProceed }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Fullscreen Mode</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          For the best quiz experience, we recommend entering fullscreen mode.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can exit fullscreen at any time by pressing ESC.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Continue Without Fullscreen
        </Button>
        <Button 
          onClick={onProceed} 
          variant="contained" 
          startIcon={<FullscreenIcon />}
          autoFocus
        >
          Enter Fullscreen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FullscreenPrompt; 