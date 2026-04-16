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
    buy_now:"اشتر الآن",
    follow_us:"تابعنا",
    newsletter_desc:"اشترك معنا ليصلك كل جديد وعروض حصرية.",
    subscribe:"اشترك الآن",
    email_required:"البريد الإلكتروني مطلوب",
    email_invalid:"البريد الإلكتروني غير صحيح",
    newsletter_success:"تم الاشتراك بنجاح!",
    trust_badges:"نضمن لك الأمان",
    secure_payment:"دفع آمن",
    fast_delivery:"توصيل سريع",
    "24_7_support":"دعم 24/7",
    happy_customers:"عميل سعيد",
    products:"منتج",
    satisfaction:"نسبة الرضا",
    support:"دعم فني",
    payment_methods:"طرق الدفع المتاحة",
    copyright:"جميع الحقوق محفوظة.",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    uploading: "جاري الرفع...",
    upload_avatar: "رفع الصورة الشخصية",
    avatar_upload_failed: "فشل في رفع الصورة",
    unauthorized: "غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.",
    error_saving_profile: "فشل في حفظ الملف الشخصي",
    edit_product: "تعديل المنتج",
    product_title: "عنوان المنتج",
    current_price: "السعر الحالي",
    old_price: "السعر السابق",
    save_changes: "حفظ التغييرات",
    description: "الوصف",
    delete: "حذف",
    confirm_delete: "تأكيد الحذف",
    confirm_delete_text: "هل أنت متأكد من حذف هذا المنتج؟",
    remove: "إزالة",
    subcategories: "الاقسام الفرعية",
    no_subcategories: "لا توجد أقسام فرعية",
    
    
    // Empty State Translations
    no_favorites: "لا توجد عناصر مفضلة",
    no_favorites_description: "ابدأ بإضافة المنتجات التي تعجبك إلى المفضلة لتسهيل الوصول إليها لاحقاً",
    no_products: "لا توجد منتجات",
    no_products_description: "ابدأ بإضافة منتجاتك الأولى واعرضها للآلاف من المشترين",
    no_items: "لا توجد عناصر",
    no_items_description: "ابدأ بإضافة بعض العناصر لعرضها هنا",
    shop_now: "تسوق الآن",
    back_to_home: "العودة للرئيسية",
    cart_empty_description: "أضف بعض المنتجات الرائعة إلى سلتك وابدأ رحلة التسوق",
    
    //-------------------------------------------------------------------------الخصوصية-----------------------------------------------------------------

    privacy_title: "سياسة الخصوصية",
    privacy_subtitle: "نحن نقدر خصوصيتك ونلتزم بحماية بياناتك",
    privacy_updated: "آخر تحديث: 1 مارس 2026",
    privacy_intro: "في الدوّار، نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام ومعالجة معلوماتك عند استخدام منصتنا.",
    
    privacy_info_title: "المعلومات التي نجمعها",
    privacy_info_subtitle: "نحن نجمع أنواع مختلفة من المعلومات لتقديم أفضل خدمة لك",
    
    personal_info: "المعلومات الشخصية",
    personal_info_desc: "اسمك الكامل، البريد الإلكتروني، رقم الهاتف، العنوان، ومعلومات الدفع عند التسجيل أو إجراء عمليات شراء.",
    
    account_info: "معلومات الحساب", 
    account_info_desc: "اسم المستخدم، كلمة المرور (المشفرة)، صورة الملف الشخصي، وإعدادات التفضيلات.",
    
    usage_info: "معلومات الاستخدام",
    usage_info_desc: "الصفحات التي تزورها، المنتجات التي تستعرضها، عناصر البحث، والتفاعلات مع المنصة.",
    
    device_info: "معلومات الجهاز",
    device_info_desc: "نوع المتصفح، نظام التشغيل، عنوان IP، ومعلومات تقنية أخرى لتحسين الأداء.",
    
    data_usage_title: "كيف نستخدم بياناتك",
    data_usage_subtitle: "نحن نستخدم معلوماتك للأغراض التالية فقط",
    
    service_provision: "تقديم الخدمات",
    service_provision_desc: "لتشغيل المنصة، معالجة الطلبات، وتقديم تجربة تسوق سلسة.",
    
    personalization: "التخصيص",
    personalization_desc: "لتخصيص المحتوى، اقتراح منتجات ذات صلة، وتحسين واجهة المستخدم.",
    
    communication: "التواصل",
    communication_desc: "لإرسال إشعارات الطلبات، تحديثات الحساب، والعروض الترويجية (بموافقتك).",
    
    improvement: "تحسين المنصة",
    improvement_desc: "لتحليل استخدام المنصة، تحسين الميزات، وتطوير الخدمات الجديدة.",
    
    security_title: "حماية بياناتك",
    security_subtitle: "نتخذ إجراءات أمنية صارمة لحماية معلوماتك",
    
    encryption: "التشفير",
    encryption_desc: "جميع البيانات الحساسة مشفرة باستخدام بروتوكولات SSL/TLS.",
    
    access_control: "التحكم في الوصول",
    access_control_desc: "الوصول إلى البيانات محدود للموظفين المصرح لهم فقط.",
    
    regular_updates: "التحديثات المنتظمة",
    regular_updates_desc: "نقوم بتحديث إجراءات الأمان بانتظام لمواجهة التهديدات الجديدة.",
    
    compliance: "الامتثال",
    compliance_desc: "نحن نلتزم بالقوانين واللوائح المعمول بها لحماية البيانات.",
    
    rights_title: "حقوقك في الخصوصية",
    rights_subtitle: "لديك حقوق كاملة في التحكم في بياناتك",
    
    access_right: "حق الوصول",
    access_right_desc: "يمكنك طلب نسخة من جميع بياناتك الشخصية التي نحتفظ بها.",
    
    correction_right: "حق التصحيح",
    correction_right_desc: "يمكنك تحديث أو تصحيح معلوماتك الشخصية في أي وقت.",
    
    deletion_right: "حق الحذف",
    deletion_right_desc: "يمكنك طلب حذف حسابك وبياناتك الشخصية (باستثناء البيانات المطلوبة قانونياً).",
    
    consent_right: "حق الموافقة",
    consent_right_desc: "يمكنك سحب موافقتك في أي وقت لجمع ومعالجة بياناتك.",
    
    sharing_title: "مشاركة البيانات",
    sharing_subtitle: "نحن لا نبيع بياناتك لأطراف ثالثة",
    
    third_party_title: "أطراف ثالثة موثوقة",
    third_party_desc: "نشارك البيانات فقط مع مقدمي الخدمات الموثوقين (شركات الدفع، خدمات التوصيل) لتقديم الخدمات.",
    
    legal_requirements: "المتطلبات القانونية",
    legal_requirements_desc: "قد نشارك البيانات عند الضرورة للامتثال للقوانين أو حماية حقوقنا.",
    
    business_transfer: "نقل الأعمال",
    business_transfer_desc: "في حالة الاندماج أو البيع، سنبلغ المستخدمين ونضمن استمرار حماية البيانات.",
    
    cookies_title: "ملفات تعريف الارتباط (Cookies)",
    cookies_subtitle: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك",
    
    essential_cookies: "ملفات تعريف الارتباط الأساسية",
    essential_cookies_desc: "ضرورية لتشغيل المنصة وتسجيل الدخول والمحافظة على الأمان.",
    
    analytics_cookies: "ملفات تعريف الارتباط التحليلية",
    analytics_cookies_desc: "تساعدنا على فهم كيفية استخدام المنصة وتحسينها.",
    
    marketing_cookies: "ملفات تعريف الارتباط التسويقية",
    marketing_cookies_desc: "تستخدم لإظهار الإعلانات والعروض ذات الصلة (بموافقتك).",
    
    contact_title: "اتصل بنا",
    contact_subtitle: "إذا كان لديك أي أسئلة حول سياسة الخصوصية",
    contact_email: "البريد الإلكتروني:",
    contact_phone: "الهاتف:",
    contact_address: "العنوان:",
    contact_response: "نحن نلتزم بالرد على استفساراتك خلال 24 ساعة عمل.",
    
    changes_title: "تغييرات السياسة",
    changes_desc: "قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم إبلاغك بأي تغييرات مهمة عبر البريد الإلكتروني أو من خلال المنصة.",

    //-------------------------------------------------------------------------الخصوصية-----------------------------------------------------------------
    //--------------------------------------------------------------شروط الاحكام---------------------------------------------------------------

    terms_title: "الشروط والأحكام",
    terms_subtitle: "شروط استخدام منصة الدوّار",
    terms_updated: "آخر تحديث: 1 مارس 2026",
    terms_intro: "مرحباً بك في منصة الدوّار. باستخدامك لموقعنا، فإنك توافق على الشروط والأحكام التالية التي تنظم استخدامك لخدماتنا.",
    
    acceptance_title: "قبول الشروط",
    acceptance_desc: "باستخدامك لموقع الدوّار، فإنك تقر بأنك قرأت وفهمت وقبلت هذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام موقعنا.",
    
    services_title: "الخدمات المقدمة",
    services_desc: "الدوّار هو منصة إلكترونية تربط بين البائعين والمشترين لبيع وشراء المنتجات والخدمات المختلفة. نحن لا نملك المنتجات المعروضة ولا نشارك بشكل مباشر في المعاملات.",
    
    user_account_title: "حساب المستخدم",
    user_account_subtitle: "شروط إنشاء وإدارة الحسابات",
    
    registration: "التسجيل",
    registration_desc: "يجب على كل مستخدم إنشاء حساب لتتمكن من استخدام جميع ميزات المنصة. يجب أن تكون المعلومات المقدمة دقيقة وكاملة وحديثة.",
    
    account_security: "أمان الحساب",
    account_security_desc: "أنت مسؤول عن الحفاظ على سرية كلمة المرور وحسابك. نحن لسنا مسؤولين عن أي استخدام غير مصرح به لحسابك.",
    
    account_responsibility: "مسؤولية الحساب",
    account_responsibility_desc: "أنت المسؤول الوحيد عن جميع الأنشطة التي تتم من خلال حسابك. يرجى إبلاغنا فوراً بأي استخدام غير مصرح به.",
    
    prohibited_title: "الأنشطة المحظورة",
    prohibited_subtitle: "يحظر بشدة القيام بالأنشطة التالية",
    
    illegal_products: "منتجات غير قانونية",
    illegal_products_desc: "عرض أو بيع منتجات محظورة بموجب القوانين المحلية أو الدولية.",
    
    false_info: "معلومات كاذبة",
    false_info_desc: "تقديم معلومات كاذبة أو مضللة حول المنتجات أو الخدمات.",
    
    fraud: "الاحتيال",
    fraud_desc: "محاولة الاحتيال أو خداع المستخدمين الآخرين أو المنصة.",
    
    spam: "الرسائل المزعجة",
    spam_desc: "إرسال رسائل غير مرغوب فيها أو بريد مزعج إلى المستخدمين الآخرين.",
    
    violations: "انتهاك الحقوق",
    violations_desc: "انتهاك حقوق الملكية الفكرية أو حقوق النشر أو العلامات التجارية.",
    
    products_title: "شروط المنتجات",
    products_subtitle: "قواعد عرض وبيع المنتجات",
    
    product_description: "وصف المنتج",
    product_description_desc: "يجب أن يكون وصف المنتج دقيقاً وكاملاً ولا يحتوي على معلومات مضللة.",
    
    product_images: "صور المنتج",
    product_images_desc: "يجب أن تكون الصور حقيقية وتمثل المنتج الفعلي بدقة.",
    
    pricing: "التسعير",
    pricing_desc: "يجب أن تكون الأسعار واضحة وشفافة ولا تتضمن رسوم خفية.",
    
    prohibited_products: "المنتجات المحظورة",
    prohibited_products_desc: "يحظر عرض المنتجات غير القانونية أو الخطرة أو المحظورة بموجب القوانين.",
    
    transactions_title: "المعاملات المالية",
    transactions_subtitle: "قواعد إجراء المعاملات المالية",
    
    payment_methods: "طرق الدفع",
    payment_methods_desc: "نحن ندعم طرق دفع آمنة وموثوقة. جميع المعاملات مشفرة وآمنة.",
    
    fees: "الرسوم",
    fees_desc: "قد يتم تطبيق رسوم على بعض الخدمات. سيتم إبلاغك بأي رسوم قبل إتمام المعاملة.",
    
    refunds: "الاسترداد",
    refunds_desc: "يخضع استرداد الأموال لسياسة البائع والمنتج. يرجى مراجعة سياسة الاسترداد قبل الشراء.",
    
    disputes: "النزاعات",
    disputes_desc: "في حالة وجود نزاع، نسعى للتوسط بين الطرفين للوصول إلى حل مرضٍ.",
    
    intellectual_title: "الملكية الفكرية",
    intellectual_subtitle: "حقوق الملكية الفكرية والمحتوى",
    
    content_ownership: "ملكية المحتوى",
    content_ownership_desc: "تحتفظ أنت بملكية المحتوى الذي تنشره، ولكن تمنحنا حقاً في استخدامه على المنصة.",
    
    third_party: "حقوق الطرف الثالث",
    third_party_desc: "يحظر استخدام محتوى محمي بحقوق الطرف الثالث بدون إذن كتابي.",
    
    copyright_infringement: "انتهاك حقوق النشر",
    copyright_infringement_desc: "نحن نحذف أي محتوى ينتهك حقوق النشر عند الإبلاغ عنه.",
    
    liability_title: "تحديد المسؤولية",
    liability_subtitle: "نطاق مسؤوليتنا",
    
    platform_liability: "مسؤولية المنصة",
    platform_liability_desc: "نحن لسنا مسؤولين عن جودة المنتجات أو دقة المعلومات المقدمة من البائعين.",
    
    user_liability: "مسؤولية المستخدم",
    user_liability_desc: "أنت مسؤول عن التحقق من المنتجات والبائعين قبل إجراء أي معاملة.",
    
    limitation: "تحديد المسؤولية",
    limitation_desc: "لا تتجاوز مسؤوليتنا في أي حال من الأحوال المبلغ المدفوع للخدمات.",
    
    termination_title: "إنهاء الخدمة",
    termination_subtitle: "شروط إنهاء الحسابات والخدمات",
    
    user_termination: "إنهاء من قبل المستخدم",
    user_termination_desc: "يمكنك إغلاق حسابك في أي وقت من خلال إعدادات الحساب.",
    
    platform_termination: "إنهاء من قبل المنصة",
    platform_termination_desc: "نحتفظ بالحق في إغلاق أي حساب ينتهك هذه الشروط والأحكام.",
    
    effect_termination: "آثار الإنهاء",
    effect_termination_desc: "عند إنهاء الحساب، يتم حذف جميع البيانات باستثناء البيانات المطلوبة قانونياً.",
    
    contact_terms_title: "اتصال بنا",
    contact_terms_subtitle: "للاستفسارات حول الشروط والأحكام",
    contact_terms_email: "البريد الإلكتروني:",
    contact_terms_phone: "الهاتف:",
    contact_terms_response: "نحن نلتزم بالرد على استفساراتك خلال 24 ساعة عمل.",

    // الشروط والأحكام
    agree_to_terms: "أوافق على",
    terms_and_conditions: "الشروط والأحكام",
    privacy_policy: "سياسة الخصوصية",
    must_agree_to_terms: "يجب الموافقة على الشروط والأحكام للمتابعة",
    terms_acceptance_required: "الموافقة على الشروط والأحكام مطلوبة",
    terms_welcome_message: "مرحباً بك في موقعنا! قبل أن تتمكن من استخدام الموقع، يجب عليك الموافقة على الشروط والأحكام وسياسة الخصوصية.",
    terms_logout: "تسجيل خروج",
    terms_accept_continue: "موافق ومتابعة",

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
    offers:"Offers",
    buy_now:"Buy Now",
    follow_us:"Follow Us",
    newsletter_desc:"Subscribe to receive all new updates and exclusive offers.",
    subscribe:"Subscribe Now",
    email_required:"Email is required",
    email_invalid:"Invalid email address",
    newsletter_success:"Successfully subscribed!",
    trust_badges:"We guarantee your security",
    secure_payment:"Secure Payment",
    fast_delivery:"Fast Delivery",
    "24_7_support":"24/7 Support",
    happy_customers:"Happy Customer",
    products:"Product",
    satisfaction:"Satisfaction Rate",
    support:"Technical Support",
    payment_methods:"Available Payment Methods",
    copyright:"All rights reserved.",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    uploading: "Uploading...",
    upload_avatar: "Upload Avatar",
    avatar_upload_failed: "Avatar upload failed",
    unauthorized: "Unauthorized or forbidden. Please login again.",
    error_saving_profile: "Failed to save profile",
    edit_product: "Edit Product",
    product_title: "Product Title",
    current_price: "Current Price",
    old_price: "Old Price",
    save_changes: "Save Changes",
    description: "Description",
    delete: "Delete",
    confirm_delete: "Confirm Delete",
    confirm_delete_text: "Are you sure you want to delete this product?",
    remove: "Remove",
    subcategories: "Subcategories",
    no_subcategories: "No subcategories",
    
    
    // Empty State Translations
    no_favorites: "No favorites yet",
    no_favorites_description: "Start adding products you like to favorites for easy access later",
    no_products: "No products yet",
    no_products_description: "Start adding your first products and showcase them to thousands of potential buyers",
    no_items: "No items yet",
    no_items_description: "Start adding some items to display here",
    shop_now: "Shop Now",
    back_to_home: "Back to Home",
    cart_empty_description: "Add some great products to your cart and start your shopping journey",
   
   //----------------------------------------------------------------------Privacy---------------------------------------------------------------------------
   privacy_title: "Privacy Policy",
   privacy_subtitle: "We value your privacy and are committed to protecting your data",
   privacy_updated: "Last updated: March 1, 2026",
   privacy_intro: "At Aldawaar, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, and process your information when using our platform.",
   
   privacy_info_title: "Information We Collect",
   privacy_info_subtitle: "We collect different types of information to provide you with the best service",
   
   personal_info: "Personal Information",
   personal_info_desc: "Your full name, email, phone number, address, and payment information when registering or making purchases.",
   
   account_info: "Account Information", 
   account_info_desc: "Username, encrypted password, profile picture, and preference settings.",
   
   usage_info: "Usage Information",
   usage_info_desc: "Pages you visit, products you browse, search terms, and interactions with the platform.",
   
   device_info: "Device Information",
   device_info_desc: "Browser type, operating system, IP address, and other technical information to improve performance.",
   
   data_usage_title: "How We Use Your Data",
   data_usage_subtitle: "We use your information for the following purposes only",
   
   service_provision: "Service Provision",
   service_provision_desc: "To operate the platform, process orders, and provide a seamless shopping experience.",
   
   personalization: "Personalization",
   personalization_desc: "To customize content, suggest relevant products, and improve the user interface.",
   
   communication: "Communication",
   communication_desc: "To send order notifications, account updates, and promotional offers (with your consent).",
   
   improvement: "Platform Improvement",
   improvement_desc: "To analyze platform usage, improve features, and develop new services.",
   
   security_title: "Protecting Your Data",
   security_subtitle: "We take strict security measures to protect your information",
   
   encryption: "Encryption",
   encryption_desc: "All sensitive data is encrypted using SSL/TLS protocols.",
   
   access_control: "Access Control",
   access_control_desc: "Access to data is limited to authorized personnel only.",
   
   regular_updates: "Regular Updates",
   regular_updates_desc: "We regularly update security measures to address new threats.",
   
   compliance: "Compliance",
   compliance_desc: "We comply with applicable laws and regulations for data protection.",
   
   rights_title: "Your Privacy Rights",
   rights_subtitle: "You have full control over your data",
   
   access_right: "Right to Access",
   access_right_desc: "You can request a copy of all personal data we hold about you.",
   
   correction_right: "Right to Correction",
   correction_right_desc: "You can update or correct your personal information at any time.",
   
   deletion_right: "Right to Deletion",
   deletion_right_desc: "You can request deletion of your account and personal data (except legally required data).",
   
   consent_right: "Right to Consent",
   consent_right_desc: "You can withdraw your consent at any time for collection and processing of your data.",
   
   sharing_title: "Data Sharing",
   sharing_subtitle: "We do not sell your data to third parties",
   
   third_party_title: "Trusted Third Parties",
   third_party_desc: "We only share data with trusted service providers (payment companies, delivery services) to provide services.",
   
   legal_requirements: "Legal Requirements",
   legal_requirements_desc: "We may share data when necessary to comply with laws or protect our rights.",
   
   business_transfer: "Business Transfer",
   business_transfer_desc: "In case of merger or sale, we will notify users and ensure continued data protection.",
   
   cookies_title: "Cookies",
   cookies_subtitle: "We use cookies to enhance your experience",
   
   essential_cookies: "Essential Cookies",
   essential_cookies_desc: "Necessary for platform operation, login, and maintaining security.",
   
   analytics_cookies: "Analytics Cookies",
   analytics_cookies_desc: "Help us understand how the platform is used and improve it.",
   
   marketing_cookies: "Marketing Cookies",
   marketing_cookies_desc: "Used to show relevant ads and offers (with your consent).",
   
   contact_title: "Contact Us",
   contact_subtitle: "If you have any questions about our privacy policy",
   contact_email: "Email:",
   contact_phone: "Phone:",
   contact_address: "Address:",
   contact_response: "We are committed to responding to your inquiries within 24 business hours.",
   
   changes_title: "Policy Changes",
   changes_desc: "We may update this policy from time to time. We will notify you of any significant changes via email or through the platform.",

  //--------------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------Terms-------------------------------------------------------------------------------
  terms_title: "Terms and Conditions",
  terms_subtitle: "Terms of Use for Aldawaar Platform",
  terms_updated: "Last updated: March 1, 2026",
  terms_intro: "Welcome to Aldawaar platform. By using our website, you agree to the following terms and conditions that govern your use of our services.",
  
  acceptance_title: "Acceptance of Terms",
  acceptance_desc: "By using the Aldawaar website, you acknowledge that you have read, understood, and agree to these terms and conditions. If you do not agree to these terms, please do not use our website.",
  
  services_title: "Services Provided",
  services_desc: "Aldawaar is an online platform that connects sellers and buyers to sell and purchase various products and services. We do not own the listed products and do not directly participate in transactions.",
  
  user_account_title: "User Account",
  user_account_subtitle: "Rules for creating and managing accounts",
  
  registration: "Registration",
  registration_desc: "Every user must create an account to use all features of the platform. The information provided must be accurate, complete, and current.",
  
  account_security: "Account Security",
  account_security_desc: "You are responsible for maintaining the confidentiality of your password and account. We are not responsible for any unauthorized use of your account.",
  
  account_responsibility: "Account Responsibility",
  account_responsibility_desc: "You are solely responsible for all activities that occur through your account. Please notify us immediately of any unauthorized use.",
  
  prohibited_title: "Prohibited Activities",
  prohibited_subtitle: "The following activities are strictly prohibited",
  
  illegal_products: "Illegal Products",
  illegal_products_desc: "Listing or selling products prohibited by local or international laws.",
  
  false_info: "False Information",
  false_info_desc: "Providing false or misleading information about products or services.",
  
  fraud: "Fraud",
  fraud_desc: "Attempting to defraud or deceive other users or the platform.",
  
  spam: "Spam",
  spam_desc: "Sending unsolicited messages or spam to other users.",
  
  violations: "Rights Violations",
  violations_desc: "Infringing on intellectual property rights, copyrights, or trademarks.",
  
  products_title: "Product Terms",
  products_subtitle: "Rules for listing and selling products",
  
  product_description: "Product Description",
  product_description_desc: "Product descriptions must be accurate, complete, and free from misleading information.",
  
  product_images: "Product Images",
  product_images_desc: "Images must be authentic and accurately represent the actual product.",
  
  pricing: "Pricing",
  pricing_desc: "Prices must be clear, transparent, and not include hidden fees.",
  
  prohibited_products: "Prohibited Products",
  prohibited_products_desc: "Listing illegal, dangerous, or prohibited products is forbidden.",
  
  transactions_title: "Financial Transactions",
  transactions_subtitle: "Rules for conducting financial transactions",
  
  payment_methods: "Payment Methods",
  payment_methods_desc: "We support secure and reliable payment methods. All transactions are encrypted and secure.",
  
  fees: "Fees",
  fees_desc: "Fees may apply to certain services. You will be informed of any fees before completing a transaction.",
  
  refunds: "Refunds",
  refunds_desc: "Refunds are subject to the seller's and product's policy. Please review the refund policy before purchasing.",
  
  disputes: "Disputes",
  disputes_desc: "In case of a dispute, we mediate between parties to reach a satisfactory resolution.",
  
  intellectual_title: "Intellectual Property",
  intellectual_subtitle: "Intellectual property rights and content",
  
  content_ownership: "Content Ownership",
  content_ownership_desc: "You retain ownership of the content you publish, but grant us rights to use it on the platform.",
  
  third_party: "Third Party Rights",
  third_party_desc: "Using third-party protected content without written permission is prohibited.",
  
  copyright_infringement: "Copyright Infringement",
  copyright_infringement_desc: "We remove any content that infringes copyright when reported.",
  
  liability_title: "Limitation of Liability",
  liability_subtitle: "Scope of our responsibility",
  
  platform_liability: "Platform Liability",
  platform_liability_desc: "We are not responsible for product quality or accuracy of information provided by sellers.",
  
  user_liability: "User Liability",
  user_liability_desc: "You are responsible for verifying products and sellers before conducting any transaction.",
  
  limitation: "Limitation of Liability",
  limitation_desc: "Our liability shall not exceed the amount paid for services in any circumstance.",
  
  termination_title: "Service Termination",
  termination_subtitle: "Terms for account and service termination",
  
  user_termination: "User Termination",
  user_termination_desc: "You can close your account at any time through account settings.",
  
  platform_termination: "Platform Termination",
  platform_termination_desc: "We reserve the right to close any account that violates these terms and conditions.",
  
  effect_termination: "Effect of Termination",
  effect_termination_desc: "Upon account termination, all data is deleted except legally required data.",
  
  contact_terms_title: "Contact Us",
  contact_terms_subtitle: "For inquiries about terms and conditions",
  contact_terms_email: "Email:",
  contact_terms_phone: "Phone:",
  contact_terms_response: "We are committed to responding to your inquiries within 24 business hours.",

  // Terms and Conditions
  agree_to_terms: "I agree to the",
  terms_and_conditions: "Terms and Conditions",
  privacy_policy: "Privacy Policy",
  must_agree_to_terms: "You must agree to the Terms and Conditions to continue",
  terms_acceptance_required: "Terms and Conditions Acceptance Required",
  terms_welcome_message: "Welcome to our site! Before you can use the site, you must agree to the Terms and Conditions and Privacy Policy.",
  terms_logout: "Logout",
  terms_accept_continue: "Accept and Continue",

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

export const getCurrentLang = () => {
  return getLang();
};
