import NextLink from 'next/link';
import { OrderSummary } from "@/components/cart";
import CartList from "@/components/cart/CartList";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
    return (
        <ShopLayout title="Resumen de la orden 5456545" pageDescription="Resumen de la orden" >
            <Typography variant="h1" component="h1">Orden: ABC123</Typography>

            <Chip
                sx={{ my: 2 }}
                label="Pendiente de pago"
                variant="outlined"
                color="error"
                icon={<CreditCardOffOutlined />}
            />

            <Chip
                sx={{ my: 2 }}
                label="Orden ya pagada"
                variant="outlined"
                color="success"
                icon={<CreditScoreOutlined />}
            />

            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen (3 Productos)</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1">Dirección de entrega</Typography>
                                <Link href="/checkout/address" component={NextLink} underline="always">Editar</Link>
                            </Box>
                            <Typography>Hugo Sciangula</Typography>
                            <Typography>Algun lugar</Typography>
                            <Typography>123 Lopez</Typography>
                            <Typography>Argentina</Typography>
                            <Typography>+54 12344</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="end">
                                <Link href="/cart" component={NextLink} underline="always">Editar</Link>
                            </Box>
                            <OrderSummary />
                            <Box sx={{ mt: 3 }}>
                                {/* TODO: Pagar */}
                                <h1>Pagar</h1>
                                <Chip
                                    sx={{ my: 2 }}
                                    label="Orden ya pagada"
                                    variant="outlined"
                                    color="success"
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout >
    );
};

export default OrderPage;
