import NextLink from 'next/link';
import { OrderSummary } from "@/components/cart";
import CartList from "@/components/cart/CartList";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";

const SummaryPage = () => {
    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden" >
            <Typography variant="h1" component="h1">Resumen de la orden</Typography>

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
                                <Button color="secondary" className="circular-btn" fullWidth>Confirmar orden</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout >
    );
};

export default SummaryPage;
