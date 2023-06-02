import { FC, useContext } from 'react';
import NextLink from 'next/link';
// import { initialData } from "@/database/products";
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { ItemCounter } from '../ui';
import { CartContext, cartReducer } from '@/context';
import { ICartProduct } from '@/interfaces/cart';

interface Props {
    editable?: boolean;
}

const CartList: FC<Props> = ({ editable = false }) => {
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product);
    };

    const onClickRemove = (product: ICartProduct) => {
        removeCartProduct(product);
    };

    return (
        <>
            {cart.map(product => (
                <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        {/* TODO: llevar a la pagina del producto */}
                        <Link href={`/product/${product.slug}`} component={NextLink}>
                            <CardActionArea>
                                <CardMedia
                                    image={`/products/${product.image}`}
                                    component='img'
                                    sx={{ borderRadius: 5 }}
                                />
                            </CardActionArea>
                        </Link>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">{product.title}</Typography>
                            <Typography variant="body1">Talla: <strong>{product.size}</strong></Typography>
                            {
                                editable
                                    ? <ItemCounter
                                        currentValue={product.quantity}
                                        updatedQuantity={(value) => { onNewCartQuantityValue(product, value); }}
                                        maxValue={10}
                                    />
                                    : <Typography variant="subtitle1">{product.quantity}</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
                        <Typography variant="subtitle1">${product.price}</Typography>
                        {
                            editable && (
                                <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={() => onClickRemove(product)}
                                >
                                    Remover
                                </Button>

                            )
                        }
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

export default CartList;
