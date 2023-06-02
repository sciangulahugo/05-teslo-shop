import { useContext, useEffect } from "react";
import { CartContext } from "@/context";
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { OrderSummary } from "@/components/cart";
import CartList from "@/components/cart/CartList";
import { ShopLayout } from "@/components/layouts";
import { useRouter } from "next/router";

const CartPage = () => {
    const { isLoaded, numberOfItems } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !numberOfItems)
            router.replace('/cart/empty');
    }, [isLoaded, numberOfItems, router]);

    // Para evitar que renderice cualquier cosa en el cliente
    if (!numberOfItems)
        return null;

    return (
        <ShopLayout title="Carrito - 3" pageDescription="Carrito de compras de la tienda" >
            <Typography variant="h1" component="h1">Carrito</Typography>

            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12} sm={7}>
                    <CartList editable />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Orden</Typography>
                            <Divider sx={{ my: 1 }} />
                            <OrderSummary />
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                    href="/checkout/address"
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default CartPage;
