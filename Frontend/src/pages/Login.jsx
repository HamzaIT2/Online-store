import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { loginUser } from "../api/authAPI";
import { t } from "../i18n";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      if (!localStorage.getItem('userType')) {
        try { localStorage.setItem('userType', 'buyer'); } catch {}
      }
      window.location.href = "/";
    } catch (err) {
      setError(t('error_loading_product'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, direction: "rtl" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {t('login_title')}
      </Typography>
      <Box component="form" onSubmit={handleLogin}>
        <TextField
          fullWidth
          label={t('login_email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('login_password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth>
          {t('login_submit')}
        </Button>
      </Box>
    </Container>
  );
}

