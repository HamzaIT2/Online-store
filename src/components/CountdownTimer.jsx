import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

export default function CountdownTimer({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) return null; // انتهى الوقت

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer); // تنظيف عند الخروج
    }, [targetDate]);

    if (!timeLeft) return null; // لا تعرض شيئاً إذا انتهى الوقت

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1, 
            bgcolor: 'error.main', 
            color: 'white', 
            px: 0.5, 
            py: 0.5, 
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            mt: 0
        }}>
            <AccessTime fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                ينتهي خلال: 
                {timeLeft.days > 0 && ` ${timeLeft.days}يوم `}
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </Typography>
        </Box>
    );
}