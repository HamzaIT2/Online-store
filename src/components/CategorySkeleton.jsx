import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

export default function CategorySkeleton({ count = 8 }) {
    return (
        <Grid container spacing={3}>
            {Array.from({ length: count }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: 1, textAlign: 'center', py: 4 }}>
                            {/* أيقونة الفئة */}
                            <Skeleton 
                                variant="circular" 
                                width={80} 
                                height={80} 
                                sx={{ mx: 'auto', mb: 2 }}
                            />
                            
                            {/* عنوان الفئة */}
                            <Skeleton 
                                variant="text" 
                                width="70%" 
                                height={28}
                                sx={{ mx: 'auto', mb: 1 }}
                            />
                            
                            {/* عدد المنتجات */}
                            <Skeleton 
                                variant="text" 
                                width="40%" 
                                height={20}
                                sx={{ mx: 'auto' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
