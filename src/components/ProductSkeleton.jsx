import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

export default function ProductSkeleton({ count = 8 }) {
    return (
        <Grid container spacing={3}>
            {Array.from({ length: count }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* صورة المنتج */}
                            <Skeleton 
                                variant="rectangular" 
                                width="100%" 
                                height={200} 
                                sx={{ borderRadius: 2 }}
                            />
                            
                            {/* عنوان المنتج */}
                            <Skeleton 
                                variant="text" 
                                width="80%" 
                                height={24}
                                sx={{ mb: 1 }}
                            />
                            
                            {/* وصف قصير */}
                            <Skeleton 
                                variant="text" 
                                width="100%" 
                                height={16}
                            />
                            <Skeleton 
                                variant="text" 
                                width="60%" 
                                height={16}
                            />
                            
                            {/* الأسعار */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 'auto' }}>
                                <Skeleton 
                                    variant="text" 
                                    width={80} 
                                    height={28}
                                />
                                <Skeleton 
                                    variant="text" 
                                    width={60} 
                                    height={20}
                                />
                            </Box>
                            
                            {/* الأزرار */}
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Skeleton 
                                    variant="rectangular" 
                                    width="100%" 
                                    height={36}
                                    sx={{ borderRadius: 2 }}
                                />
                                <Skeleton 
                                    variant="circular" 
                                    width={36} 
                                    height={36}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
