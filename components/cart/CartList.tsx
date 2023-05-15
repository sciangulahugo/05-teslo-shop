import { FC } from 'react';
import NextLink from 'next/link';
import { initialData } from "@/database/products";
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { ItemCounter } from '../ui';

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
];

interface Props {
    editable?: boolean;
}

const CartList: FC<Props> = ({ editable = false }) => {
    return (
        <>
            {productsInCart.map(product => (
                <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        {/* TODO: llevar a la pagina del producto */}
                        <Link href='/product/slug' component={NextLink}>
                            <CardActionArea>
                                <CardMedia
                                    image={`/products/${product.images[0]}`}
                                    component='img'
                                    sx={{ borderRadius: 5 }}
                                />
                            </CardActionArea>
                        </Link>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">{product.title}</Typography>
                            <Typography variant="body1">Talla: <strong>M</strong></Typography>
                            {
                                editable
                                    ? <ItemCounter />
                                    : <Typography variant="subtitle1">3</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
                        <Typography variant="subtitle1">${product.price}</Typography>
                        {
                            editable && (
                                <Button variant="text" color="secondary">
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
