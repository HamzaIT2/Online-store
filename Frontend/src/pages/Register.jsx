import { useState } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import { registerUser } from "../api/authAPI";
import { t } from "../i18n";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    avatar: "",
    userType: "buyer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setError("");
      setSuccess(t('register_title'));
      try { localStorage.setItem('userType', formData.userType || 'buyer'); } catch {}
      setTimeout(() => (window.location.href = "/login"), 800);
    } catch (err) {
      setSuccess("");
      setError(t('error_loading_product'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, direction: "rtl" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {t('register_title')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label={t('register_username')} name="username" value={formData.username} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label={t('register_full_name')} name="fullName" value={formData.fullName} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label={t('register_email')} name="email" type="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label={t('register_phone')} name="phone" value={formData.phone} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label={t('register_password')} name="password" type="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label={t('register_avatar')} name="avatar" value={formData.avatar} onChange={handleChange} sx={{ mb: 2 }} />

        <TextField select fullWidth label={t('register_userType')} name="userType" value={formData.userType} onChange={handleChange} sx={{ mb: 3 }}>
          <MenuItem value="buyer">{t('usertype_buyer')}</MenuItem>
          <MenuItem value="seller">{t('usertype_seller')}</MenuItem>
          <MenuItem value="both">{t('usertype_both')}</MenuItem>
        </TextField>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}

        <Button type="submit" variant="contained" fullWidth>
          {t('register_title')}
        </Button>
      </Box>
    </Container>
  );
}

