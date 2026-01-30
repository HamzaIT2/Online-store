import { useEffect, useState, useRef } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { HeartIcon } from "./HeartIcon";
import { addFavorite, removeFavoriteByProduct, checkIsFavorited, getFavoriteCount } from "../api/favoritesAPI";
import { useNavigate } from "react-router-dom";

export default function FavoriteToggle({ productId, size = "medium" }) {
  const navigate = useNavigate();
  const heartIconRef = useRef();
  const [count, setCount] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const c = await getFavoriteCount(productId);
        if (!mounted) return;
        setCount(Number(c.data?.count ?? c.data ?? 0));
      } catch (_) {
        // ignore
      }
      if (hasToken) {
        try {
          const r = await checkIsFavorited(productId);
          if (!mounted) return;
          setIsFav(Boolean(r.data?.favorited ?? r.data));
        } catch (_) {
          // ignore
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [productId, hasToken]);

  const toggle = async () => {
    if (!hasToken) {
      navigate('/login');
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      if (isFav) {
        try {
          const r = await removeFavoriteByProduct(productId);
          console.log('removeFavoriteByProduct', productId, 'status=', r?.status);
        } catch (e) {
          console.error('removeFavoriteByProduct failed', productId, e?.response?.status, e?.response?.data || e?.message || e);
          throw e;
        }
        setIsFav(false);
        setCount((x) => Math.max(0, x - 1));
        try { window.dispatchEvent(new CustomEvent('favorites:updated', { detail: { productId, action: 'removed' } })); } catch { };
        // Trigger animation
        if (heartIconRef.current) {
          heartIconRef.current.startAnimation();
        }
      } else {
        try {
          const r = await addFavorite(productId);
          console.log('addFavorite response', productId, 'status=', r?.status);
        } catch (e) {
          console.error('addFavorite failed for', productId, e?.response?.status, e?.response?.data || e?.message || e);
          if (e?.response?.status === 401) {
            navigate('/login');
            return;
          }
          throw e;
        }
        setIsFav(true);
        setCount((x) => x + 1);
        try { window.dispatchEvent(new CustomEvent('favorites:updated', { detail: { productId, action: 'added' } })); } catch { };
        // Trigger animation
        if (heartIconRef.current) {
          heartIconRef.current.startAnimation();
        }
      }
    } catch (_) {
      // ignore errors for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Tooltip title={isFav ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}>
        <Box
          ref={heartIconRef}
          component="button"
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          disabled={loading}
          sx={{
            background: 'none',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: isFav ? '#f44336' : 'currentColor',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#f44336',
            }
          }}
        >
          <HeartIcon
            size={size === 'small' ? 20 : size === 'medium' ? 28 : 32}
            isFav={isFav}
          />
        </Box>
      </Tooltip>
      <Typography variant={size === 'small' ? 'body2' : 'body1'}>{count}</Typography>
    </Box>
  );
}

