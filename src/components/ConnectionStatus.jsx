import { memo } from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { 
  Wifi as WifiIcon, 
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  SignalWifiConnectedNoInternet4 as ErrorIcon
} from '@mui/icons-material';

const ConnectionStatus = memo(({ 
  isConnected, 
  connectionError, 
  onReconnect,
  position = 'bottom-right' 
}) => {
  const theme = useTheme();

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return { top: 16, right: 16 };
      case 'top-left':
        return { top: 16, left: 16 };
      case 'bottom-left':
        return { bottom: 16, left: 16 };
      default: // bottom-right
        return { bottom: 16, right: 16 };
    }
  };

  if (isConnected) {
    return (
      <Box
        sx={{
          position: 'absolute',
          ...getPositionStyles(),
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          bgcolor: 'success.dark',
          color: 'success.contrastText',
          fontSize: '0.75rem',
          fontWeight: 500,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1000
        }}
      >
        <WifiIcon sx={{ fontSize: 14 }} />
        متصل
      </Box>
    );
  }

  if (connectionError) {
    return (
      <Box
        sx={{
          position: 'absolute',
          ...getPositionStyles(),
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          bgcolor: 'error.dark',
          color: 'error.contrastText',
          fontSize: '0.75rem',
          fontWeight: 500,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1000
        }}
      >
        <ErrorIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ flex: 1 }}>
          {connectionError.includes('timeout') ? 'انتهت مهلة الاتصال' : 
           connectionError.includes('network') ? 'مشكلة في الشبكة' : 
           'فشل الاتصال'}
        </Typography>
        <Tooltip title="إعادة المحاولة">
          <IconButton
            size="small"
            onClick={onReconnect}
            sx={{
              color: 'inherit',
              p: 0.25,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <RefreshIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        ...getPositionStyles(),
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        bgcolor: 'warning.dark',
        color: 'warning.contrastText',
        fontSize: '0.75rem',
        fontWeight: 500,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
        transition: 'all 0.3s ease-in-out',
        zIndex: 1000
      }}
    >
      <WifiOffIcon sx={{ fontSize: 14 }} />
      جاري الاتصال...
    </Box>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';

export default ConnectionStatus;
