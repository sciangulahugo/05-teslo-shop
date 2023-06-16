import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context';
import { OrderSummary } from "@/components/cart";
import CartList from "@/components/cart/CartList";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { countries } from '@/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }
    }, [router]);

    // Cuando damos click en crear orden
    const onCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder(); //TODO: depende del resultado
        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }
        return router.replace(`/orders/${message}`); // Si sale bien, message retorna el id
    };

    if (!shippingAddress)
        return <></>;

    const { firstName, lastName, address, addressConfirm = "", city, country, phone, zip } = shippingAddress;
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
                            <Typography variant="h2">Resumen ({numberOfItems} {numberOfItems === 1 ? "producto" : "productos"})</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1">Dirección de entrega</Typography>
                                <Link href="/checkout/address" component={NextLink} underline="always">Editar</Link>
                            </Box>
                            <Typography>{firstName} {lastName}</Typography>
                            <Typography>{city} - {zip}</Typography>
                            <Typography>{address}</Typography>
                            <Typography>{addressConfirm}</Typography>
                            <Typography>
                                {countries.find((e) => e.code === country)?.name}
                            </Typography>
                            <Typography>{phone}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="end">
                                <Link href="/cart" component={NextLink} underline="always">Editar</Link>
                            </Box>
                            <OrderSummary />
                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                <Button
                                    disabled={isPosting}
                                    onClick={onCreateOrder}
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                >
                                    Confirmar orden
                                </Button>
                                <Chip
                                    color="error"
                                    label={errorMessage}
                                    sx={{ mt: 2, display: errorMessage ? "flex" : "none" }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout >
    );
};

export default SummaryPage;
