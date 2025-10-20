import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Card, CardContent } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        setProfile(res.data);
      } catch (e) {
        setError("");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <Container sx={{ textAlign: 'center', mt: 6 }}><CircularProgress /></Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Typography color="error" align="center">{error}</Typography>
    </Container>
  );

  if (!profile) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{t('profile_title')}</Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
            <Typography>{t('profile_full_name')}: {profile.fullName}</Typography>
            <Typography>{t('profile_username')}: {profile.username}</Typography>
            <Typography>{t('profile_email')}: {profile.email}</Typography>
            <Typography>{t('profile_phone')}: {profile.phoneNumber}</Typography>
            <Typography>{t('profile_province')}: {profile.province?.nameAr || profile.province?.name || t('unknown')}</Typography>
            <Typography>{t('profile_total_sales')}: {profile.totalSales ?? 0}</Typography>
            <Typography>{t('profile_rating_avg')}: {profile.ratingAverage ?? 0}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

