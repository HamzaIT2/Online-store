import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Box } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const ParticlesBackground = () => {
    const { darkMode } = useTheme();
    const [init, setInit] = useState(false);

    // 1. تهيئة المحرك مرة واحدة عند تشغيل الموقع
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // 2. إذا لم ينتهِ التحميل، لا تعرض شيئاً
    if (!init) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1, // في الخلفية
                // الخلفية المتدرجة (Gradient) توضع هنا
                background: darkMode 
                    ? 'linear-gradient(180deg, #0a1424 0%, #0b1320 100%)' 
                    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <Particles
                id="tsparticles"
                options={{
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "grab", // جذب الخطوط للماوس
                            },
                        },
                        modes: {
                            grab: {
                                distance: 200,
                                line_linked: {
                                    opacity: 1,
                                },
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: darkMode ? "#ffffff" : "#2196f3",
                        },
                        links: {
                            color: darkMode ? "#ffffff" : "#2196f3",
                            distance: 150,
                            enable: true,
                            opacity: 0.4,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 2,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80, // عدد الجسيمات
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            />
        </Box>
    );
};

export default ParticlesBackground;