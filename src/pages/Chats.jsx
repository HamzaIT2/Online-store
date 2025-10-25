import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Divider, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ChatList from "../components/ChatList";
import ChatThread from "../components/ChatThread";
import { listChats, getChatMessages, sendMessage } from "../api/messagesAPI";
import axiosInstance from "../api/axiosInstance";

export default function Chats() {
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [errorChats, setErrorChats] = useState("");

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const unreadCountMap = useMemo(() => ({}), []);

  // Load current user id for alignment/context
  useEffect(() => {
    let mounted = true;
    const loadMe = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        const me = res?.data || {};
        if (mounted) setCurrentUserId(me.id || me.userId || me.uid || null);
      } catch (_) { if (mounted) setCurrentUserId(null); }
    };
    loadMe();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingChats(true);
      try {
        const res = await listChats();
        const data = res?.data ?? res;
        const rows = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.data) ? data.data : []));
        setChats(rows);
        // Try select by chatId from query string first
        if (rows.length) {
          const params = new URLSearchParams(location.search);
          const qId = params.get('chatId');
          const target = qId ? rows.find(r => String(r.id) === String(qId) || String(r.chatId) === String(qId)) : null;
          setCurrentChat(target || (!currentChat ? rows[0] : currentChat));
        }
      } catch (e) {
        setErrorChats('Failed to load chats');
      } finally {
        setLoadingChats(false);
      }
    };
    load();
  }, [location.search]);

  useEffect(() => {
    const loadMsgs = async () => {
      if (!currentChat?.id) return;
      setLoadingMsgs(true);
      try {
        const res = await getChatMessages(currentChat.id, { limit: 50 });
        const data = res?.data ?? res;
        const rows = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.data) ? data.data : []));
        setMessages(Array.isArray(rows) ? rows : []);
      } catch (e) {
        setErrorMsgs('Failed to load messages');
      } finally {
        setLoadingMsgs(false);
      }
    };
    loadMsgs();
  }, [currentChat?.id]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !currentChat?.id) return;
    setDraft("");
    try {
      const res = await sendMessage(currentChat.id, { type: 'text', text });
      const saved = (res?.data?.data ?? res?.data ?? res) || null;
      if (saved && typeof saved === 'object') setMessages((m) => [...m, saved]);
    } catch {
      // revert draft on failure
      setDraft(text);
    }
  };

  const handleSendLocation = async () => {
    if (!currentChat?.id) return;
    try {
      if (!('geolocation' in navigator)) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://maps.google.com/?q=${latitude},${longitude}`;
        try {
          const res = await sendMessage(currentChat.id, { type: 'text', text: url });
          const saved = (res?.data?.data ?? res?.data ?? res) || null; if (saved && typeof saved === 'object') setMessages((m) => [...m, saved]);
        } catch (_) {}
      });
    } catch (_) {}
  };

  const tryUpload = async (file) => {
    if (!currentChat?.id) throw new Error('no_chat');
    const ep = `/chats/${currentChat.id}/attachments`;
    const fd = new FormData();
    fd.append('file', file);
    const res = await axiosInstance.post(ep, fd);
    const data = res?.data || {};
    let path = data.url || data.imageUrl || data.path || data.filename || "";
    if (!path) throw new Error('upload_failed');
    if (!/^https?:\/\//i.test(path)) {
      const origin = new URL(axiosInstance.defaults.baseURL).origin;
      path = origin + (String(path).startsWith('/') ? path : `/${path}`);
    }
    return path;
  };

  const handlePickFile = async (e, asImage) => {
    const f = e.target.files && e.target.files[0];
    if (!f || !currentChat?.id) return;
    setUploading(true);
    try {
      const url = await tryUpload(f);
      const payload = asImage ? { type: 'image', imageUrl: url } : { type: 'text', text: url };
      const res = await sendMessage(currentChat.id, payload);
      const saved = (res?.data?.data ?? res?.data ?? res) || null;
      if (saved && typeof saved === 'object') setMessages((m) => [...m, saved]);
    } catch (_) {
      // noop for now
    } finally {
      setUploading(false);
      // reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 2, p: 2 }}>
      <Paper variant="outlined" sx={{ height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
        <ChatList chats={chats} loading={loadingChats} error={errorChats} selectedId={currentChat?.id} onSelect={setCurrentChat} unreadCountMap={unreadCountMap} />
      </Paper>
      <Paper variant="outlined" sx={{ display: 'grid', gridTemplateRows: '1fr auto', height: 'calc(100vh - 120px)' }}>
        <ChatThread messages={messages} loading={loadingMsgs} error={errorMsgs} currentUserId={currentUserId} />
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 1 }}>
          <input id="chat-image-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePickFile(e, true)} />
          <input id="chat-file-input" type="file" style={{ display: 'none' }} onChange={(e) => handlePickFile(e, false)} />
          <IconButton title="أرسل صورة" color="inherit" onClick={() => document.getElementById('chat-image-input')?.click()} disabled={uploading}>
            <ImageIcon />
          </IconButton>
          <IconButton title="أرفق ملف" color="inherit" onClick={() => document.getElementById('chat-file-input')?.click()} disabled={uploading}>
            <AttachFileIcon />
          </IconButton>
          <IconButton title="أرسل موقعي" color="inherit" onClick={handleSendLocation}>
            <MyLocationIcon />
          </IconButton>
          <TextField fullWidth size="small" placeholder="اكتب رسالة..." value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} />
          <IconButton color="primary" onClick={handleSend} disabled={uploading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
