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
  Security,
  Lock,
  Visibility,
  Settings,
  Storage,
  Cookie,
  Gavel,
  ContactSupport,
  Update,
  CheckCircle,
  Shield,
  PrivacyTip,
  Info,
  Person,
  Computer,
  ShoppingCart,
  Tune,
  Email,
  TrendingUp,
  Edit,
  Delete,
  Share,
  Business,
  SwapHoriz,
  BarChart,
  Campaign,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { t } from '../i18n';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
                <PrivacyTip sx={{ fontSize: 40 }} />
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
                {t('privacy_title')}
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 2, maxWidth: 600, mx: 'auto' }}>
                {t('privacy_subtitle')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
                {t('privacy_updated')}
              </Typography>
            </Paper>

            {/* Introduction */}
            <SectionCard
              title={t('privacy_intro')}
              subtitle=""
              icon={<Info />}
            >
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, fontSize: '1.1rem' }}>
                {t('privacy_intro')}
              </Typography>
            </SectionCard>

            {/* Information We Collect */}
            <SectionCard
              title={t('privacy_info_title')}
              subtitle={t('privacy_info_subtitle')}
              icon={<Storage />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('personal_info')}
                    description={t('personal_info_desc')}
                    icon={<Person />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('account_info')}
                    description={t('account_info_desc')}
                    icon={<Settings />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('usage_info')}
                    description={t('usage_info_desc')}
                    icon={<Visibility />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('device_info')}
                    description={t('device_info_desc')}
                    icon={<Computer />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* How We Use Your Data */}
            <SectionCard
              title={t('data_usage_title')}
              subtitle={t('data_usage_subtitle')}
              icon={<Settings />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('service_provision')}
                    description={t('service_provision_desc')}
                    icon={<ShoppingCart />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('personalization')}
                    description={t('personalization_desc')}
                    icon={<Tune />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('communication')}
                    description={t('communication_desc')}
                    icon={<Email />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('improvement')}
                    description={t('improvement_desc')}
                    icon={<TrendingUp />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Security Measures */}
            <SectionCard
              title={t('security_title')}
              subtitle={t('security_subtitle')}
              icon={<Shield />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('encryption')}
                    description={t('encryption_desc')}
                    icon={<Lock />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('access_control')}
                    description={t('access_control_desc')}
                    icon={<Security />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('regular_updates')}
                    description={t('regular_updates_desc')}
                    icon={<Update />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('compliance')}
                    description={t('compliance_desc')}
                    icon={<Gavel />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Your Rights */}
            <SectionCard
              title={t('rights_title')}
              subtitle={t('rights_subtitle')}
              icon={<Gavel />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('access_right')}
                    description={t('access_right_desc')}
                    icon={<Visibility />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('correction_right')}
                    description={t('correction_right_desc')}
                    icon={<Edit />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('deletion_right')}
                    description={t('deletion_right_desc')}
                    icon={<Delete />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('consent_right')}
                    description={t('consent_right_desc')}
                    icon={<CheckCircle />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Data Sharing */}
            <SectionCard
              title={t('sharing_title')}
              subtitle={t('sharing_subtitle')}
              icon={<Share />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('third_party_title')}
                    description={t('third_party_desc')}
                    icon={<Business />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    title={t('legal_requirements')}
                    description={t('legal_requirements_desc')}
                    icon={<Gavel />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem
                    title={t('business_transfer')}
                    description={t('business_transfer_desc')}
                    icon={<SwapHoriz />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Cookies */}
            <SectionCard
              title={t('cookies_title')}
              subtitle={t('cookies_subtitle')}
              icon={<Cookie />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('essential_cookies')}
                    description={t('essential_cookies_desc')}
                    icon={<Lock />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('analytics_cookies')}
                    description={t('analytics_cookies_desc')}
                    icon={<BarChart />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    title={t('marketing_cookies')}
                    description={t('marketing_cookies_desc')}
                    icon={<Campaign />}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Contact */}
            <SectionCard
              title={t('contact_title')}
              subtitle={t('contact_subtitle')}
              icon={<ContactSupport />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                    <Avatar sx={{ bgcolor: '#4ecdc4', mx: 'auto', mb: 2 }}>
                      <Email />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {t('contact_email')}
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
                      {t('contact_phone')}
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
                  {t('contact_response')}
                </Typography>
              </Box>
            </SectionCard>

            {/* Policy Changes */}
            <SectionCard
              title={t('changes_title')}
              subtitle=""
              icon={<Update />}
            >
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                {t('changes_desc')}
              </Typography>
            </SectionCard>

          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

