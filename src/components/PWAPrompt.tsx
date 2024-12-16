import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Snackbar
      open={showPrompt}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 2 }}
    >
      <Alert
        severity="info"
        sx={{
          width: '100%',
          alignItems: 'center',
          bgcolor: 'background.paper',
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Instale nosso app para acesso rápido e offline
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleInstallClick}
            startIcon={<GetAppIcon />}
          >
            Instalar
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default PWAPrompt; 