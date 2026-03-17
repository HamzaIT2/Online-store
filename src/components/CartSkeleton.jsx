import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid, Typography } from '@mui/material';

export default function CartSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                <Skeleton width="30%" height={40} />
            </Typography>
            
            <Grid container spacing={3}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                    {/* Product Image */}
                                    <Skeleton 
                                        variant="rectangular" 
                                        width={120} 
                                        height={120} 
                                        sx={{ borderRadius: 2 }}
                                    />
                                    
                                    {/* Product Details */}
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                                        <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                                        <Skeleton width="30%" height={28} />
                                    </Box>
                                    
                                    {/* Actions */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Skeleton variant="circular" width={40} height={40} />
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
                
                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ position: 'sticky', top: 20 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                <Skeleton width="50%" height={24} />
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Skeleton width="40%" height={20} />
                                <Skeleton width="30%" height={20} />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Skeleton width="40%" height={20} />
                                <Skeleton width="30%" height={20} />
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Skeleton width="40%" height={24} />
                                <Skeleton width="35%" height={24} />
                            </Box>
                            
                            <Skeleton 
                                variant="rectangular" 
                                width="100%" 
                                height={48} 
                                sx={{ borderRadius: 2 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
