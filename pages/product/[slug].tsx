import { FC, useContext, useState } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from 'next';

import { CartContext } from "@/context";

import { ShopLayout } from "@/components/layouts";
import { ProductSlideshow, SizeSelector } from "@/components/products";
import { ItemCounter } from "@/components/ui";
import { dbProducts } from "@/database";

import { IProduct, ISize } from "@/interfaces";
import { ICartProduct } from "@/interfaces/cart";

import { Box, Button, Chip, Grid, Typography } from "@mui/material";

interface Props {
    product: IProduct;
}

const ProductPage: FC<Props> = ({ product }) => {
    const router = useRouter();
    const { addProductToCart } = useContext(CartContext);

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    });

    const onSelectedSize = (size: ISize) => {
        // Desestructuramos lo que ya esta en el estado.
        setTempCartProduct(currentProduct => ({
            ...currentProduct,
            size
        }));
    };

    const updatedQuantity = (quantity: number) => {
        setTempCartProduct(currentProduct => ({
            ...currentProduct,
            quantity
        }));
    };

    const onAddProduct = () => {
        if (!tempCartProduct.size) return;

        addProductToCart(tempCartProduct);
        router.push('/cart');
    };

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow images={product.images} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Box display="flex" flexDirection="column">
                        {/* Titulo */}
                        <Typography variant="h1" component="h1">{product.title}</Typography>
                        <Typography variant="subtitle1" component="h2">${product.price}</Typography>

                        {/* Cantidad */}
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2">Cantidad</Typography>
                            <ItemCounter
                                currentValue={tempCartProduct.quantity}
                                updatedQuantity={updatedQuantity}
                                maxValue={product.inStock > 10 ? 10 : product.inStock}
                            />
                            <SizeSelector
                                selectedSize={tempCartProduct.size}
                                sizes={product.sizes}
                                onSelectedSize={onSelectedSize}
                            />
                        </Box>

                        {/* Agregar al carrito */}
                        {
                            product.inStock > 0
                                ? (
                                    <Button
                                        color="secondary"
                                        className="circular-btn"
                                        onClick={onAddProduct}
                                    >
                                        {tempCartProduct.size
                                            ? "Agregar al carrito"
                                            : "Seleccione una talla"
                                        }
                                    </Button>
                                )
                                : <Chip label="No hay disponibles" color="error" variant="outlined" />

                        }

                        {/* Descripcion */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2">Descripción</Typography>
                            <Typography variant="body2">{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// No usamos esta forma porque lo queremos crear de forma estatica.
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//     const { slug = '' } = ctx.params as { slug: string };
//     // console.log(ctx);

//     const product = await dbProducts.getProductBySlug(slug);

//     if (!product)
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         };

//     return {
//         props: {
//             product
//         }
//     };
// };

// Primero vemos todos los slugs que necesitamos
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const slugs = await dbProducts.getAllProductSlugs();

    return {
        paths: slugs.map(({ slug }) => ( // Importante desestructurar.
            {
                params: { slug }
            }
        )),
        fallback: 'blocking'
        // Nota: si creo un nuevo producto, y no esta generada estaticamente, entonces
        // el fallback en blocking, va a generar estaticamente cuando se haga una peticion.
    };
};

// Aca creamos todos los staticos
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug = '' } = ctx.params as { slug: string };
    // console.log(ctx);

    const product = await dbProducts.getProductBySlug(slug);

    if (!product)
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };

    return {
        props: {
            product
        },
        revalidate: 84600 // 24 Hs
    };
};

export default ProductPage;
