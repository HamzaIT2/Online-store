import { useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axiosInstance from "../api/axiosInstance";

export default function ChatThread({ messages, loading, error, currentUserId }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  if (!messages) messages = [];
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const senderGradient = isDark
    ? "linear-gradient(90deg, #0b1d39 0%, #0f2b66 50%, #143873 100%)"
    : "linear-gradient(90deg, #0f2b66 0%, #154384 50%, #1b4f99 100%)";
  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      {loading && <CircularProgress size={20} />}
      {error && <Typography color="error">{String(error)}</Typography>}
      {messages.map((m, idx) => {
        const isString = (typeof m === 'string');
        const msg = isString ? { text: m } : m || {};
        const nestedText = msg.message?.text ?? msg.content?.text ?? msg.body?.text ?? msg.data?.text ?? msg.payload?.text ?? msg.content?.message ?? msg.payload?.message;
        let msgText = (msg.text ?? msg.content ?? nestedText ?? msg.message ?? msg.body ?? msg.msg ?? "");
        const nestedImg = msg.message?.imageUrl ?? msg.message?.image_url ?? msg.content?.imageUrl ?? msg.content?.image_url ?? msg.data?.imageUrl ?? msg.data?.image_url;
        let imgUrl = (msg.imageUrl ?? msg.image_url ?? msg.image ?? msg.url ?? msg.fileUrl ?? msg.attachmentUrl ?? msg.mediaUrl ?? msg.attachment?.url ?? nestedImg ?? null);
        const ts = (msg.createdAt ?? msg.created_at ?? msg.timestamp ?? msg.date ?? Date.now());
        const sender = (msg.senderId ?? msg.sender_id ?? msg.fromUserId ?? msg.sender?.id);
        // If there's no explicit image field, but text contains a URL, extract it
        if (!imgUrl && typeof msgText === 'string') {
          const s = msgText.trim();
          const urlMatch = s.match(/(https?:\/\/[^\s]+|\/?uploads\/[^\s]+)/i);
          let candidate = urlMatch ? urlMatch[1] : null;
          if (candidate && !candidate.startsWith('http') && !candidate.startsWith('/')) candidate = '/' + candidate; // ensure leading slash for uploads
          if (candidate) {
            const looksLikeImg = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(candidate) || candidate.startsWith('/uploads/') || candidate.includes('/uploads/');
            if (looksLikeImg) imgUrl = candidate;
          }
        }

        if (!imgUrl && (!msgText || (typeof msgText !== 'string'))) {
          try {
            for (const [k, v] of Object.entries(msg)) {
              if (typeof v === 'string' && v.trim()) { msgText = v; break; }
              if (v && typeof v === 'object') {
                for (const [k2, v2] of Object.entries(v)) {
                  if (typeof v2 === 'string' && v2.trim()) { msgText = v2; break; }
                }
              }
              if (msgText) break;
            }
          } catch { }
        }

        // Normalize uploads path to absolute URL
        let finalImg = imgUrl;
        if (finalImg && !/^https?:\/\//i.test(finalImg)) {
          try {
            const origin = new URL(axiosInstance.defaults.baseURL).origin;
            finalImg = origin + (finalImg.startsWith('/') ? finalImg : `/${finalImg}`);
          } catch { }
        }
        // If not image, but text contains a URL, make it clickable
        let finalLink = null;
        if (!finalImg && typeof msgText === 'string') {
          const urlMatch = msgText.match(/(https?:\/\/[^\s]+|\/?uploads\/[^\s]+)/i);
          if (urlMatch) {
            finalLink = urlMatch[1];
            if (finalLink && !finalLink.startsWith('http') && !finalLink.startsWith('/')) finalLink = '/' + finalLink;
            if (!/^https?:\/\//i.test(finalLink)) {
              try {
                const origin = new URL(axiosInstance.defaults.baseURL).origin;
                finalLink = origin + (finalLink.startsWith('/') ? finalLink : `/${finalLink}`);
              } catch { }
            }
          }
        }
        return (
          <Box key={msg.id ?? `${msg.chatId || 'c'}-${msg.createdAt || msg.created_at || 't'}-${idx}`} sx={{
            display: 'flex', justifyContent: (sender === currentUserId ? 'flex-end' : 'flex-start'), mb: 1
          }}>
            <Box sx={{
              background: (sender === currentUserId ? senderGradient : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)')),
              color: (sender === currentUserId ? '#fff' : (isDark ? 'rgba(255,255,255,0.9)' : theme.palette.text.primary)),
              px: 1.4, py: 1,
              borderRadius: 3,
              borderTopLeftRadius: (sender === currentUserId ? 12 : 4),
              borderTopRightRadius: (sender === currentUserId ? 4 : 12),
              boxShadow: (sender === currentUserId ? '0 4px 10px rgba(20,56,115,0.25)' : '0 2px 8px rgba(0,0,0,0.08)'),
              maxWidth: '70%'
            }}>
              {(msg.type === 'image' || finalImg) ? (
                <img alt="attachment" src={finalImg} style={{ maxWidth: '100%', borderRadius: 8, pointerEvents: 'none' }} />
              ) : finalLink ? (
                <Typography variant="body2"><a href={finalLink} target="_blank" rel="noopener noreferrer">{finalLink}</a></Typography>
              ) : (
                <Typography variant="body2">{String(msgText)}</Typography>
              )}
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {new Date(ts).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <div ref={bottomRef} />
    </Box>
  );
}
