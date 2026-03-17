import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ShoppingBasket, Favorite, Inbox, AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { t } from '../i18n';

export default function EmptyState({
  type = 'favorites',
  title,
  description,
  actionText,
  actionLink
}) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case 'favorites':
        return <Favorite sx={{ fontSize: 80, color: '#ff6b6b', mb: 2 }} />;
      case 'cart':
        return <ShoppingBasket sx={{ fontSize: 80, color: '#4ecdc4', mb: 2 }} />;
      case 'products':
        return <Inbox sx={{ fontSize: 80, color: '#45b7d1', mb: 2 }} />;
      default:
        return <Inbox sx={{ fontSize: 80, color: '#999', mb: 2 }} />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'favorites':
        return {
          title: t('no_favorites'),
          description: t('no_favorites_description'),
          actionText: t('shop_now'),
          actionLink: '/'
        };
      case 'cart':
        return {
          title: t('cart_empty'),
          description: t('cart_empty_description'),
          actionText: t('shop_now'),
          actionLink: '/'
        };
      case 'products':
        return {
          title: t('no_products'),
          description: t('no_products_description') ,
          actionText: t('add_product'),
          actionLink: '/add-product'
        };
      default:
        return {
          title: t('no_items'),
          description: t('no_items_description') ,
          actionText: t('back_to_home'),
          actionLink: '/'
        };
    }
  };

  const content = title || description || actionText || actionLink
    ? { title, description, actionText, actionLink }
    : getDefaultContent();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 8
        }}
      >
        {getIcon()}

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#333',
            fontSize: { xs: '1.8rem', md: '2.5rem' }
          }}
        >
          {content.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: '#666',
            maxWidth: 500,
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', md: '1.1rem' }
          }}
        >
          {content.description}
        </Typography>

        {actionText && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCart />}
            onClick={() => navigate(content.actionLink)}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5252, #3db8b0)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
              }
            }}
          >
            {content.actionText}
          </Button>
        )}
      </Box>
    </Container>
  );
}
