import { Container, Typography } from "@mui/material";

export default function Cart() {
  return (
    <Container sx={{ mt: 4, direction: 'rtl' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>سلة المشتريات</Typography>
      <Typography color="text.secondary">لم يتم إضافة منتجات إلى السلة بعد.</Typography>
    </Container>
  );
}

