import { Language } from "@mui/icons-material";

export const getLang = () => {
  if (typeof window === "undefined") return "ar";
  return localStorage.getItem("lang") || "ar";
};

export const toggleLang = () => {
  const order = ["ar", "en"];
  const current = getLang();
  const idx = order.indexOf(current);
  const next = order[(idx + 1) % order.length] || "ar";
  if (typeof window !== "undefined") {
    localStorage.setItem("lang", next);
    document.documentElement.lang = next;
    // Dispatch custom event to notify components about language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: next } }));
    window.location.reload();
  }
};

const dict = {
  ar: {
    site_name: "الدوّار",
    home: "الرئيسية",
    categories: "الأقسام",
    cart: "السلة",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    add_product: "أضف إعلان",
    add_product_title: "إضافة إعلان",
    my_products: "إعلاناتي",
    my_products_title: "إعلاناتي",
    profile: "الملف الشخصي",
    favorites: "المفضلة",
    favorites_empty: "لا توجد عناصر في المفضلة بعد.",
    categories_title: "الأقسام",
    cart_title: "عربة التسوق",
    cart_empty: "لا توجد منتجات في السلة بعد.",
    price_label: "السعر (IQD)",
    currency_iqd: "IQD",
    province: "المحافظة",
    city: "المدينة",
    all_provinces: "كل المحافظات",
    condition_any: "الكل",
    condition_new: "جديد",
    condition_like_new: "بحالة ممتازة",
    condition_good: "جيدة",
    condition_fair: "مقبولة",
    condition_poor: "سيئة",
    search_placeholder: "ابحث عن منتج...",
    show_more: "عرض المزيد",
    show_subs: "عرض الأقسام الفرعية",
    hide_subs: "إخفاء الأقسام الفرعية",
    no_subs: "لا توجد أقسام فرعية",
    field_title: "العنوان",
    field_category: "القسم",
    field_description: "الوصف",
    field_price: "السعر (IQD)",
    field_condition: "الحالة",
    field_province: "المحافظة",
    field_city: "المدينة",
    field_address: "العنوان",
    field_images_upload: "اختر الصور",
    submit_product: "نشر الإعلان",
    profile_title: "الملف الشخصي",
    profile_full_name: "الاسم الكامل",
    profile_username: "اسم المستخدم",
    profile_email: "البريد الإلكتروني",
    profile_phone: "رقم الهاتف",
    profile_province: "المحافظة",
    profile_total_sales: "إجمالي المبيعات",
    profile_rating_avg: "متوسط التقييم",
    unknown: "غير معروف",
    login_title: "تسجيل الدخول",
    login_email: "البريد الإلكتروني",
    login_password: "كلمة المرور",
    login_submit: "تسجيل الدخول",
    register_title: "إنشاء حساب",
    register_username: "اسم المستخدم",
    register_full_name: "الاسم الكامل",
    register_email: "البريد الإلكتروني",
    register_phone: "الهاتف",
    register_password: "كلمة المرور",
    register_avatar: "اضافة صوره",
    register_userType: "نوع الحساب",
    usertype_buyer: "مشتري",
    usertype_seller: "بائع",
    usertype_both: "كلاهما",
    no_files_selected: "لم يتم اختيار صور",
    view_details: "عرض التفاصيل",
    category: "القسم",
    condition: "الحالة",
    seller_info: "معلومات البائع",
    seller_name: "اسم البائع",
    seller_phone: "رقم البائع",
    contact_seller: "تواصل مع البائع",
    error_loading_product: "تعذر تحميل المنتج حالياً.",
    no_description: "لا يوجد وصف",
    language: "اللغة",
    theme: "المظهر",
    messages: "الرسائل",
    my_messages: "رسائلي",
    account_settings: "إعدادات الحساب",
    upload_photo: "صورة شخصية",
    sign_in_with_google:"تسجيل الدخول عبر كوكل ",
    sign_in_with_facebook:"تسجيل الدخول عبر فيس بوك",
    new_reg:"يمكنك هنا ",
    new_reg1:"التسجيل",
    new_reg3:"كلمة المرور؟",
    new_reg:"هل نسيت",
    elctronic:"الكترونيات",
    title_nav:"الدوار العراقي",
    sub_title_nav:"بيع واشتر كل شيء بسهوله وامان",
    send:"تواصل",
    footer_des: "وجهتك الأولى للتسوق الإلكتروني. نوفر لك أفضل المنتجات بأفضل الأسعار مع خدمة توصيل سريعة ومضمونة.",
    customer_service:"خدمة العملاء",
    quick_links:"روابط سريعة",
    newsletter:"النشرة الإخبارية",
    terms:"الشروط والأحكام",
    privacy:"الخصوصية",
    offers:"العروض",

    //-------------------------------------------------------------------------الخصوصية-----------------------------------------------------------------








    //-------------------------------------------------------------------------الخصوصية-----------------------------------------------------------------



    //--------------------------------------------------------------شروط الاحكام---------------------------------------------------------------









    //--------------------------------------------------------------شروط الاحكام---------------------------------------------------------------

  },
  en: {
    site_name: "Aldawaar",
    home: "Home",
    categories: "Categories",
    cart: "Cart",
    login: "Login",
    register: "Register",
    logout: "Logout",
    add_product: "Add Listing",
    add_product_title: "Add Listing",
    my_products: "My Listings",
    my_products_title: "My Listings",
    profile: "Profile",
    favorites: "Favorites",
    favorites_empty: "No favorites yet.",
    categories_title: "Categories",
    cart_title: "Shopping Cart",
    cart_empty: "No products in the cart yet.",
    price_label: "Price (IQD)",
    currency_iqd: "IQD",
    province: "Province",
    city: "City",
    all_provinces: "All Provinces",
    condition_any: "All",
    condition_new: "New",
    condition_like_new: "Like New",
    condition_good: "Good",
    condition_fair: "Fair",
    condition_poor: "Poor",
    search_placeholder: "Search for a product...",
    show_more: "Show More",
    show_subs: "Show Subcategories",
    hide_subs: "Hide Subcategories",
    no_subs: "No subcategories",
    field_title: "Title",
    field_category: "Category",
    field_description: "Description",
    field_price: "Price (IQD)",
    field_condition: "Condition",
    field_province: "Province",
    field_city: "City",
    field_address: "Address",
    field_images_upload: "Choose Images",
    submit_product: "Publish Listing",
    profile_title: "Profile",
    profile_full_name: "Full Name",
    profile_username: "Username",
    profile_email: "Email",
    profile_phone: "Phone Number",
    profile_province: "Province",
    profile_total_sales: "Total Sales",
    profile_rating_avg: "Average Rating",
    unknown: "Unknown",
    login_title: "Sign in",
    login_email: "Email",
    login_password: "Password",
    login_submit: "Sign In",
    register_title: "Create Account",
    register_username: "Username",
    register_full_name: "Full Name",
    register_email: "Email",
    register_phone: "Phone",
    register_password: "Password",
    register_avatar: "Add photo",
    register_userType: "User Type",
    usertype_buyer: "Buyer",
    usertype_seller: "Seller",
    usertype_both: "Both",
    no_files_selected: "No images selected",
    view_details: "View Details",
    category: "Category",
    condition: "Condition",
    seller_info: "Seller Info",
    seller_name: "Seller Name",
    seller_phone: "Seller Phone",
    contact_seller: "Contact Seller",
    error_loading_product: "Could not load product.",
    no_description: "No description",
    language: "Language",
    theme: "Theme",
    messages: "Messages",
    my_messages: "My Messages",
    account_settings: "Account settings",
    sign_in_with_google:"Sign In with Google ",
    sign_in_with_facebook:"Sign In with Facebook ",
    new_reg:"You can here",
    new_reg1:"Register",
    new_reg3:"Password ?",
    new_reg4:"Forgot your ",
    elctronic:"Electronics",
    title_nav:"Aldawaar Iraqi",
    sub_title_nav:"Buy and sell everything easily and securely",
    send:"Contact",
    footer_des:"Your first destination for online shopping. We provide you with the best products at the best prices with fast and guaranteed delivery service.",
    customer_service:"Customer Service",
    quick_links:"Quick Links",
    newsletter:"Newsletter",
    terms:"Terms and Conditions",
    privacy:"Privacy Policy",
    offers:"Offers"
   //----------------------------------------------------------------------Privacy---------------------------------------------------------------------------












  //--------------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------Terms-------------------------------------------------------------------------------


//----------------------------------------------------------------------Terms-------------------------------------------------------------------------------

  },

  // ku: {
  //   // Fallback to English for now
  //   site_name: 'Aldowar',
  //   home: 'Home',
  //   categories: 'Categories',
  //   cart: 'Cart',
  //   login: 'Login',
  //   register: 'Register',
  //   logout: 'Logout',
  //   add_product: 'Add Listing',
  //   add_product_title: 'Add Listing',
  //   my_products: 'My Listings',
  //   my_products_title: 'My Listings',
  //   profile: 'Profile',
  //   favorites: 'Favorites',
  //   favorites_empty: 'No favorites yet.',
  //   categories_title: 'Categories',
  //   cart_title: 'Shopping Cart',
  //   cart_empty: 'No products in the cart yet.',
  //   price_label: 'Price (IQD)',
  //   currency_iqd: 'IQD',
  //   province: 'Province',
  //   city: 'City',
  //   all_provinces: 'All Provinces',
  //   condition_any: 'All',
  //   condition_new: 'New',
  //   condition_like_new: 'Like New',
  //   condition_good: 'Good',
  //   condition_fair: 'Fair',
  //   condition_poor: 'Poor',
  //   search_placeholder: 'Search for a product...',
  //   show_more: 'Show More',
  //   show_subs: 'Show Subcategories',
  //   hide_subs: 'Hide Subcategories',
  //   no_subs: 'No subcategories',
  //   field_title: 'Title',
  //   field_category: 'Category',
  //   field_description: 'Description',
  //   field_price: 'Price (IQD)',
  //   field_condition: 'Condition',
  //   field_province: 'Province',
  //   field_city: 'City',
  //   field_address: 'Address',
  //   field_images_upload: 'Choose Images',
  //   submit_product: 'Publish Listing',
  //   profile_title: 'Profile',
  //   profile_full_name: 'Full Name',
  //   profile_username: 'Username',
  //   profile_email: 'Email',
  //   profile_phone: 'Phone Number',
  //   profile_province: 'Province',
  //   profile_total_sales: 'Total Sales',
  //   profile_rating_avg: 'Average Rating',
  //   unknown: 'Unknown',
  //   login_title: 'Login',
  //   login_email: 'Email',
  //   login_password: 'Password',
  //   login_submit: 'Login',
  //   register_title: 'Create Account',
  //   register_username: 'Username',
  //   register_full_name: 'Full Name',
  //   register_email: 'Email',
  //   register_phone: 'Phone',
  //   register_password: 'Password',
  //   register_avatar: 'Avatar URL',
  //   register_userType: 'User Type',
  //   usertype_buyer: 'Buyer',
  //   usertype_seller: 'Seller',
  //   usertype_both: 'Both',
  //   no_files_selected: 'No images selected',
  //   view_details: 'View Details',
  //   category: 'Category',
  //   condition: 'Condition',
  //   seller_info: 'Seller Info',
  //   seller_name: 'Seller Name',
  //   seller_phone: 'Seller Phone',
  //   contact_seller: 'Contact Seller',
  //   error_loading_product: 'Could not load product.',
  //   no_description: 'No description',
  // },
};

export const t = (key) => {
  const lang = getLang();
  return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
};
