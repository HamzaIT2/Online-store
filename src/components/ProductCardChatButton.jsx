import React from 'react';
import { Button } from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { findExistingChat, createOrGetChat } from '../api/messagesAPI';
import { toggleLang } from '../i18n';
//import { t} from 'i18next';
const ProductCardChatButton = ({ sellerId, productId, productName, className }) => {
  const navigate = useNavigate();


  const handleStartChat = async () => {
    // 1. جلب بيانات المستخدم (تم الإصلاح سابقاً)
    let currentUserId = null;
    const storedUser = localStorage.getItem('user');
    const directId = localStorage.getItem('userId');

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsed = JSON.parse(storedUser);
        currentUserId = parsed.id || parsed.userId || parsed._id;
      } catch (e) { console.error(e); }
    } else if (directId) {
      currentUserId = directId;
    }

    if (!currentUserId) {
      // توجيه لصفحة الدخول إذا لم يكن مسجلاً
      navigate('/login');
      return;
    }

    try {
      // 2. المحاولة الأولى: البحث عن شات موجود
      console.log(`Searching for chat: Buyer=${currentUserId}, Seller=${sellerId}, Product=${productId}`);
      const existingChatResponse = await findExistingChat(currentUserId, sellerId, productId);

      // إذا وجدنا شات، نذهب إليه
      if (existingChatResponse.data && (existingChatResponse.data.conversationId || existingChatResponse.data.id)) {
        const chatId = existingChatResponse.data.conversationId || existingChatResponse.data.id;
        navigate(`/chats?chatId=${chatId}`);
      }

    } catch (error) {
      // ---------------------------------------------------------
      // التعديل الجوهري هنا: التعامل مع خطأ 404 بذكاء
      // ---------------------------------------------------------

      // إذا كان الخطأ 404، هذا يعني "لا توجد محادثة"، إذن فلنقم بإنشائها
      if (error.response && error.response.status === 404) {
        console.log("Chat not found (404), creating a new one...");

        try {
          const newChatResponse = await createOrGetChat({ sellerId, productId });
          console.log("New chat created:", newChatResponse.data);

          const newChatId = newChatResponse.data.conversationId || newChatResponse.data.id || newChatResponse.data.chatId;

          if (newChatId) {
            navigate(`/chats?chatId=${newChatId}`);
          } else {
            console.error("Chat created but ID missing in response");
            navigate('/chats');
          }
        } catch (createError) {
          console.error("Failed to create new chat:", createError);
          alert("تعذر بدء المحادثة، يرجى المحاولة لاحقاً");
        }
      } else {
        // خطأ آخر غير 404 (مشكلة سيرفر، انترنت، الخ)
        console.error('Unexpected error finding chat:', error);
        navigate('/chats');
      }
    }
  };

  return (
    <Button

      variant="outlined"
      size="small"
    
      onClick={handleStartChat}
      className={className}
      sx={{
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          borderColor: 'primary.dark',
          backgroundColor: 'primary.50',
        },
      }}
    >
      <MessageIcon />

    </Button>
  );
};

export default ProductCardChatButton;