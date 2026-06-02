import React, { useState, useEffect } from "react";
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, TextField, Alert, Snackbar, Fade, Zoom, Slide,
  Divider, useTheme as useMuiTheme, CircularProgress, Chip,
  FormControl, InputLabel, Select, MenuItem, Avatar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

export default function AdminDashboard() {
  const { darkMode } = useTheme();
  const muiTheme = useMuiTheme();

  // الحالات الحقيقية للبيانات
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  // حالات الإدخال للقسم الرئيسي
  const [newCatName, setNewCatName] = useState("");
  const [newCatNameAr, setNewCatNameAr] = useState("");
  const [catDescription, setCatDescription] = useState("");

  // حالات الإدخال للقسم الفرعي 
  const [newSubCatName, setNewSubCatName] = useState("");
  const [newSubCatNameAr, setNewSubCatNameAr] = useState("");
  const [selectedParentCat, setSelectedParentCat] = useState("");

  // الحالات الجديدة لرفع ومعاينة الصور بحجم كبير
  const [mainCatImage, setMainCatImage] = useState(null);
  const [mainCatPreview, setMainCatPreview] = useState("");
  const [subCatImage, setSubCatImage] = useState(null);
  const [subCatPreview, setSubCatPreview] = useState("");

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      //-------------------------------------------------------------------------------- جلب الأقسام من السيرفر ---------------------------------------------------------------------------------
      try {
        const catRes = await axiosInstance.get("/categories");
        const categoriesData = catRes.data || catRes || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (catErr) {
        console.error("Error fetching categories:", catErr);
        setCategories([]);
      }

      // ---------------------------------------------------------------------------------جلب المستخدمين ---------------------------------------------------------------------------------
      try {
        const usersRes = await axiosInstance.get("/users/admin/all?page=1&limit=100");
        let usersData = [];
        if (usersRes && usersRes.data) usersData = usersRes.data;
        else if (Array.isArray(usersRes)) usersData = usersRes;
        else if (usersRes && typeof usersRes === 'object') usersData = usersRes.users || usersRes.results || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (userErr) {
        console.error("Error fetching users:", userErr);
        setUsers([]);
      }
    } catch (error) {
      showNotify(t("error_fetching_data"), "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (msg, sev = "success") => {
    setNotification({ open: true, message: msg, severity: sev });
  };

  const handleDeactivateUser = async (id) => {
    if (!window.confirm(t("confirm_delete_account"))) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      showNotify(t("account_deleted_successfully"), "success");
      setUsers(users.filter(user => (user.userId || user._id) !== id));
    } catch (error) {
      showNotify(t("failed_to_delete_account"), "error");
    }
  };

 
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName || !newCatNameAr) {
      showNotify("يرجى كتابة اسم القسم باللغتين", "warning");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newCatName);
      formData.append("nameAr", newCatNameAr);
      formData.append("description", catDescription || "قسم رئيسي جديد");
      
      if (mainCatImage) {
        formData.append("image", mainCatImage);
      }

      await axiosInstance.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotify("تم إضافة القسم الرئيسي بنجاح! 🎉");
      fetchDashboardData();
      
      // تصفير الحقول والصور
      setNewCatName("");
      setNewCatNameAr("");
      setCatDescription("");
      setMainCatImage(null);
      setMainCatPreview("");
    } catch (error) {
      showNotify(error.response?.data?.message || "حدث خطأ أثناء عمل القسم الرئيسي", "error");
    }
  };

 
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!newSubCatName || !newSubCatNameAr || !selectedParentCat) {
      showNotify("يرجى تعبئة الحقول واختيار القسم الرئيسي", "warning");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newSubCatName);
      formData.append("nameAr", newSubCatNameAr);
      formData.append("parentId", Number(selectedParentCat));
      formData.append("description", "قسم فرعي تابع");
      
      if (subCatImage) {
        formData.append("image", subCatImage);
      }

      await axiosInstance.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotify("تم إضافة القسم الفرعي بنجاح وربطه بالرئيسي! 🎉");
      fetchDashboardData();
      
      // ---------------------------------------------------------------------------------تصفير الحقول والصور ---------------------------------------------------------------------------------

      setNewSubCatName("");
      setNewSubCatNameAr("");
      setSelectedParentCat("");
      setSubCatImage(null);
      setSubCatPreview("");
    } catch (error) {
      showNotify(error.response?.data?.message || "فشلت إضافة القسم الفرعي", "error");
    }
  };

  //---------------------------------------------------------------------------------------- دالة حذف أي قسم (سواء رئيسي أو فرعي) ----------------------------------------------------------------------------------


  const handleDeleteCategory = async (id) => {
    if (!window.confirm(t("confirm_delete_category"))) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      showNotify(t("category_deleted_successfully"), "success");
      fetchDashboardData();
    } catch (error) {
      showNotify(t("failed_to_delete_category"), "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#0a1424" : "#f4f7fe",
        paddingTop: "100px",
        paddingBottom: "40px",
        transition: "all 0.3s ease"
      }}
    >
      <Container maxWidth="lg">
        {/*---------------------------------------------------------------------------------------------- الهيدر ----------------------------------------------------------------------------------*/}


        <Slide direction="down" in timeout={600}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <AdminPanelSettingsIcon sx={{ fontSize: 45, color: "#667eea" }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: darkMode ? "#fff" : "#0f2b66" }}>
                  {t("admin_dashboard_title")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t("admin_dashboard_subtitle")}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={fetchDashboardData}
              disabled={loading}
              sx={{ borderColor: "#667eea", color: "#667eea" }}
            >
              {loading ? <CircularProgress size={24} /> : t("refresh_data")}
            </Button>
          </Box>
        </Slide>

        {/* ----------------------------------------------------------------------------------------كروت الإحصائيات ---------------------------------------------------------------------------------*/}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ background: "linear-gradient(135deg, #0f2b66 0%, #1a3a7a 100%)", color: "white", borderRadius: 4 }}>
              <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>{t("registered_users")}</Typography>
                  <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>{users.length}</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: 4 }}>
              <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>{t("active_main_categories")}</Typography>
                  <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>{categories.length}</Typography>
                </Box>
                <ShoppingBagIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>

          {/* --------------------------------------------------------------------------------------جدول المستخدمين ------------------------------------------------------------------------------*/}

          <Grid item xs={12} md={4}>
            <Fade in timeout={900}>
              <Paper sx={{ p: 3, borderRadius: 4, background: darkMode ? "rgba(15, 26, 48, 0.95)" : "#ffffff" }}>
                <Typography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "#667eea" : "#0f2b66"}>{t("users_management")}</Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("user")}</TableCell>
                        <TableCell>{t("delete")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => {
                        const uid = user.userId || user._id;
                        return (
                          <TableRow key={uid} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">{user.username}</Typography>
                              <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                              <Typography variant="body2" color="textSecondary">{user.phoneNumber}</Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton color="error" onClick={() => handleDeactivateUser(uid)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Fade>
          </Grid>

        
          <Grid item xs={12} md={8}>

            {/* مربعات الإضافة المتوازية */}
            <Grid container spacing={2} mb={4}>

              {/*----------------------------------------------------------------------------------- نموذج إضافة قسم رئيسي ------------------------------------------------------------------------------------*/}

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 4, height: '100%', background: darkMode ? "rgba(67, 65, 97, 0.95)" : "#ffffff" }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={2} color="info">➕ {t("create_main_category")}</Typography>
                  <Box component="form" onSubmit={handleAddCategory} display="flex" flexDirection="column" gap={3} width={500}>
                    <TextField label={t("arabic_name")} size="small" required value={newCatNameAr} onChange={(e) => setNewCatNameAr(e.target.value)} />
                    <TextField label={t("english_name")} size="small" required value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                    
                    {/* -----------------------------------------------------------------------صندوق الرفع والمعاينة الكبير المريح للعين - قسم رئيسي ----------------------------------------------------------*/}
                    <Box
                      component="label"
                      sx={{
                        border: `2px dashed ${darkMode ? "#f88400" : "#cbd5e1"}`,
                        borderRadius: 3,
                        height: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: darkMode ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: "#ffffff",
                          backgroundColor: darkMode ? "rgba(105, 151, 224, 0.8)" : "#f1f5f9"
                        }
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setMainCatImage(file);
                            setMainCatPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {mainCatPreview ? (
                        <Box 
                          component="img" 
                          src={mainCatPreview} 
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <AddIcon sx={{ fontSize: 35, color: '#e99905', mb: 0.5 }} />
                          <Typography variant="body2" fontWeight="500">{t("upload_main_category_image")}</Typography>
                          <Typography variant="caption" color="textSecondary" display="block">{t("click_to_select_file")}</Typography>
                        </Box>
                      )}
                    </Box>

                    <Button type="submit" variant="contained" color="info" sx={{ mt: 1 }}>{t("save_main_category")}</Button>
                  </Box>
                </Paper>
              </Grid>

              {/* --------------------------------------------------------------نموذج إضافة قسم فرعي ---------------------------------------------------------------------*/}

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 4, height: '100%', background: darkMode ? "rgba(67, 65, 97, 0.95)" : "#ffffff" }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={2} color="info">➕ {t("create_sub_category")}</Typography>
                  <Box component="form" onSubmit={handleAddSubCategory} display="flex" flexDirection="column" gap={3} width={500}>
                    <FormControl size="small" required fullWidth>
                      <InputLabel>{t("select_parent_category")}</InputLabel>
                      <Select
                        value={selectedParentCat}
                        label={t("select_parent_category")}
                        color="primary"
                        onChange={(e) => {
                          if (e.target.value !== undefined) {
                            setSelectedParentCat(e.target.value);
                          }
                        }}
                      >
                        {categories.map((cat, idx) => {
                          const actualId = cat.id;
                          return (
                            <MenuItem
                              key={actualId || `cat-option-${idx}`}
                              value={actualId}
                              
                            >
                              {cat.name_ar || cat.name || "قسم بدون اسم"}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <Box display="flex" gap={1}>
                      <TextField label={t("arabic_name")} size="small" required fullWidth value={newSubCatNameAr} onChange={(e) => setNewSubCatNameAr(e.target.value)} />
                      <TextField label={t("english_name")} size="small" required fullWidth value={newSubCatName} onChange={(e) => setNewSubCatName(e.target.value)} />
                    </Box>

                    {/* ===================================================== صندوق الرفع والمعاينة الكبير المريح للعين - قسم فرعي ===================================================== */}
                    <Box
                      component="label"
                      sx={{
                        border: `2px dashed ${darkMode ? "#f88400" : "#cbd5e1"}`,
                        borderRadius: 3,
                        height: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: darkMode ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#ffffff',
                          backgroundColor: darkMode ? "rgba(105, 151, 224, 0.8)" : "#f1f5f9"
                        }
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSubCatImage(file);
                            setSubCatPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {subCatPreview ? (
                        <Box 
                          component="img" 
                          src={subCatPreview} 
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <AddIcon sx={{ fontSize: 35, color: '#e99905', mb: 0.5 }} />
                          <Typography variant="body2" fontWeight="500">{t("upload_sub_category_image")}</Typography>
                          <Typography variant="caption" color="text.primary" display="block">{t("click_to_select_file")}</Typography>
                        </Box>
                      )}
                    </Box>

                    <Button type="submit" variant="contained" color="info" sx={{ mt: 1 }}>{t("save_sub_category")}</Button>

                    {/* ===================================================== صندوق الرفع والمعاينة الكبير المريح للعين - قسم فرعي ===================================================== */}

                  </Box>
                </Paper>
              </Grid>
            </Grid>
            

            {/* --------------------------------------------جدول عرض الهيكل التنظيمي للأقسام -------------------------------------------- */}

            <Fade in timeout={1100}>
              <Paper sx={{ p: 3, borderRadius: 4, background: darkMode ? "rgba(67, 65, 97, 0.95)" : "#ffffff" }}>
                <Typography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "#667eea" : "#0f2b66"}>
                  {t("categories_structure")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '35%' }}>{t("main_category")}</TableCell>
                        <TableCell sx={{ width: '50%' }}>{t("sub_categories")}</TableCell>
                        <TableCell sx={{ width: '15%' }} align="center">{t("delete_main")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category, index) => {
                        const currentMainId = category.id;
                        const mainKey = currentMainId ? `main-${currentMainId}` : `main-index-${index}`;
                        const childSubs = category.subs || [];

                        return (
                          <TableRow key={mainKey} hover>
                            <TableCell>

                              {/* -------------------------------------------------عرض صورة القسم الرئيسي بجانب الاسم ------------------------------------------------*/}

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                           
                                <Box>
                                  <Typography variant="body2" fontWeight="bold" color="text.primary">
                                    {category.name_ar || category.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {category.name}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {childSubs && childSubs.length > 0 ? (
                                  childSubs.map((sub, subIndex) => {
                                    const currentSubId = sub.id;
                                    const subKey = currentSubId ? `sub-${currentSubId}` : `sub-index-${index}-${subIndex}`;

                                    return (
                                      <Chip
                                        key={subKey}
                                        label={sub.name_ar || sub.name || t("sub_category")}
                                        size="small"
                                        color="text.primary"
                                        variant="outlined"
                                        onDelete={() => handleDeleteCategory(currentSubId)}
                                        sx={{ borderRadius: 1 }}
                                      
                                      />
                                    );
                                  })
                                ) : (
                                null
                                )}
                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              <IconButton color="error" onClick={() => handleDeleteCategory(currentMainId)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Fade>

          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}