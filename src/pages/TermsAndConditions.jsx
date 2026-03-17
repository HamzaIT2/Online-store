import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  Gavel,
  CheckCircle,
  Block,
  Security,
  AccountCircle,
  ShoppingCart,
  CreditCard,
  Copyright,
  Warning,
  Assignment,
  MonetizationOn,
  SupportAgent,
  ExitToApp,
  Business,
  Email,
  Phone,
  LocationOn,
  Shield
} from '@mui/icons-material';
import { t } from '../i18n';
import { useNavigate } from 'react-router-dom';

export default function TermsAndConditions() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isRTL = theme.direction === 'rtl';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SectionCard = ({ title, subtitle, icon, children }) => (
    <Card
      sx={{
        mb: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(31, 38, 135, 0.25)'
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'linear-gradient(45deg, #0f2b66, #4ecdc4)',
              width: 56,
              height: 56,
              mr: isRTL ? 0 : 3,
              ml: isRTL ? 3 : 0
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f2b66', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ title, description, icon }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{
          bgcolor: 'rgba(78, 205, 196, 0.1)',
          p: 1,
          borderRadius: 2,
          mr: isRTL ? 0 : 2,
          ml: isRTL ? 2 : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { color: '#4ecdc4', fontSize: 20 } })}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', flex: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          lineHeight: 1.7,
          pl: isRTL ? 0 : 5,
          pr: isRTL ? 5 : 0
        }}
      >
        {description}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(15,43,102,0.9) 0%, rgba(78,205,196,0.8) 100%)',
        zIndex: 1
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in timeout={1000}>
          <Box>
            {/* Header Section */}
            <Paper
              sx={{
                p: 6,
                mb: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(31, 38, 135, 0.25)'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'linear-gradient(45deg, #0f2b66, #4ecdc4)',
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Gavel sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(45deg, #0f2b66, #4ecdc4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t('terms_title')}
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 2, maxWidth: 600, mx: 'auto' }}>
                {t('terms_subtitle')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
                {t('terms_updated')}
              </Typography>
            </Paper>

            {/* Introduction */}
            <SectionCard
              title={t('terms_intro')}
              subtitle=""
              icon={<Assignment />}
            >
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, fontSize: '1.1rem' }}>
                {t('terms_intro')}
              </Typography>
            </SectionCard>

            {/* Acceptance of Terms */}
            <SectionCard
              title={t('acceptance_title')}
              subtitle=""
              icon={<CheckCircle />}
            >
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                {t('acceptance_desc')}
              </Typography>
            </SectionCard>

            {/* Services Provided */}
            <SectionCard
              title={t('services_title')}
              subtitle=""
              icon={<Business />}
            >
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                {t('services_desc')}
              </Typography>
            </SectionCard>

            {/* User Account */}
            <SectionCard
              title={t('user_account_title')}
              subtitle={t('user_account_subtitle')}
              icon={<AccountCircle />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('registration')}
                    description={t('registration_desc')}
                    icon={<PersonAdd />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('account_security')}
                    description={t('account_security_desc')}
                    icon={<Security />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('account_responsibility')}
                    description={t('account_responsibility_desc')}
                    icon={<AssignmentInd />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Prohibited Activities */}
            <SectionCard
              title={t('prohibited_title')}
              subtitle={t('prohibited_subtitle')}
              icon={<Block />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('illegal_products')}
                    description={t('illegal_products_desc')}
                    icon={<Warning />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('false_info')}
                    description={t('false_info_desc')}
                    icon={<GppBad />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('fraud')}
                    description={t('fraud_desc')}
                    icon={<Report />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('spam')}
                    description={t('spam_desc')}
                    icon={<MarkEmailUnread />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem
                    title={t('violations')}
                    description={t('violations_desc')}
                    icon={<Copyright />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Product Terms */}
            <SectionCard
              title={t('products_title')}
              subtitle={t('products_subtitle')}
              icon={<ShoppingCart />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('product_description')}
                    description={t('product_description_desc')}
                    icon={<Description />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('product_images')}
                    description={t('product_images_desc')}
                    icon={<Image />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('pricing')}
                    description={t('pricing_desc')}
                    icon={<MonetizationOn />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('prohibited_products')}
                    description={t('prohibited_products_desc')}
                    icon={<Block />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Financial Transactions */}
            <SectionCard
              title={t('transactions_title')}
              subtitle={t('transactions_subtitle')}
              icon={<CreditCard />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('payment_methods')}
                    description={t('payment_methods_desc')}
                    icon={<Payment />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('fees')}
                    description={t('fees_desc')}
                    icon={<Receipt />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('refunds')}
                    description={t('refunds_desc')}
                    icon={<AssignmentReturn />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('disputes')}
                    description={t('disputes_desc')}
                    icon={<Handshake />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Intellectual Property */}
            <SectionCard
              title={t('intellectual_title')}
              subtitle={t('intellectual_subtitle')}
              icon={<Copyright />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('content_ownership')}
                    description={t('content_ownership_desc')}
                    icon={<AccountBalance />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('third_party')}
                    description={t('third_party_desc')}
                    icon={<Group />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('copyright_infringement')}
                    description={t('copyright_infringement_desc')}
                    icon={<Copyright />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Limitation of Liability */}
            <SectionCard
              title={t('liability_title')}
              subtitle={t('liability_subtitle')}
              icon={<Warning />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('platform_liability')}
                    description={t('platform_liability_desc')}
                    icon={<Business />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('user_liability')}
                    description={t('user_liability_desc')}
                    icon={<Person />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('limitation')}
                    description={t('limitation_desc')}
                    icon={<Shield />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Service Termination */}
            <SectionCard
              title={t('termination_title')}
              subtitle={t('termination_subtitle')}
              icon={<ExitToApp />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('user_termination')}
                    description={t('user_termination_desc')}
                    icon={<PersonRemove />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('platform_termination')}
                    description={t('platform_termination_desc')}
                    icon={<Block />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('effect_termination')}
                    description={t('effect_termination_desc')}
                    icon={<DeleteForever />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Contact */}
            <SectionCard
              title={t('contact_terms_title')}
              subtitle={t('contact_terms_subtitle')}
              icon={<SupportAgent />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                    <Avatar sx={{ bgcolor: '#4ecdc4', mx: 'auto', mb: 2 }}>
                      <Email />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {t('contact_terms_email')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      hmzhkymr4@gmail.com
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                    <Avatar sx={{ bgcolor: '#4ecdc4', mx: 'auto', mb: 2 }}>
                      <Phone />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {t('contact_terms_phone')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      +964 782 292 5016
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                    <Avatar sx={{ bgcolor: '#4ecdc4', mx: 'auto', mb: 2 }}>
                      <LocationOn />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {t('contact_address')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      العراق، بغداد
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(15, 43, 102, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#0f2b66', fontWeight: 500 }}>
                  {t('contact_terms_response')}
                </Typography>
              </Box>
            </SectionCard>

          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

// Additional icons that might be needed
import PersonAdd from '@mui/icons-material/PersonAdd';
import AssignmentInd from '@mui/icons-material/AssignmentInd';
import GppBad from '@mui/icons-material/GppBad';
import Report from '@mui/icons-material/Report';
import MarkEmailUnread from '@mui/icons-material/MarkEmailUnread';
import Description from '@mui/icons-material/Description';
import Image from '@mui/icons-material/Image';
import Payment from '@mui/icons-material/Payment';
import Receipt from '@mui/icons-material/Receipt';
import AssignmentReturn from '@mui/icons-material/AssignmentReturn';
import Handshake from '@mui/icons-material/Handshake';
import AccountBalance from '@mui/icons-material/AccountBalance';
import Group from '@mui/icons-material/Group';
import Person from '@mui/icons-material/Person';
import PersonRemove from '@mui/icons-material/PersonRemove';
import DeleteForever from '@mui/icons-material/DeleteForever';
