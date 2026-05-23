import React, { Component } from 'react';
import { Box, Container, Typography, Button, Paper, Alert } from '@mui/material';
import { Refresh as RefreshIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { t } from '../i18n';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Store error details for development display
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    // Reload the page to recover from the error
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            py: 4
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                bgcolor: 'white'
              }}
            >
              {/* Error Icon */}
              <Box sx={{ mb: 3 }}>
                <ErrorIcon
                  sx={{
                    fontSize: 80,
                    color: '#f44336'
                  }}
                />
              </Box>

              {/* Error Message */}
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('error_boundary_title') || 'عذراً، حدث خطأ غير متوقع'}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {t('error_boundary_message') || 'واجهنا مشكلة في تحميل الصفحة. يرجى المحاولة مرة أخرى.'}
              </Typography>

              {/* Development Mode Error Details */}
              {isDevelopment && this.state.error && (
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Error Details (Development Mode):
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ 
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                    bgcolor: '#ffebee',
                    p: 1,
                    borderRadius: 1
                  }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </Alert>
              )}

              {/* Reload Button */}
              <Button
                variant="contained"
                size="large"
                onClick={this.handleReload}
                startIcon={<RefreshIcon />}
                sx={{
                  bgcolor: '#667eea',
                  '&:hover': {
                    bgcolor: '#5a6fd8'
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                {t('error_boundary_reload') || 'إعادة تحميل الصفحة'}
              </Button>

              {/* Additional Help Text */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
                {t('error_boundary_help') || 'إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني'}
              </Typography>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
