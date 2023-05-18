import { FC, useMemo, useState } from "react";
import NextLink from 'next/link';
import { Box, Card, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { IProduct } from "@/interfaces";

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const productImage = useMemo(() => {
        return isHovered
            ? `/products/${product.images[1]}`
            : `/products/${product.images[0]}`;
    }, [isHovered, product.images]);

    return (
        <Grid
            item
            xs={6}
            sm={4}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <Link component={NextLink} href="/product/slug" prefetch={false}>
                    <CardActionArea>
                        <CardMedia
                            className="fadeIn"
                            component="img"
                            image={productImage}
                            alt={product.title}
                            onLoad={() => setIsImageLoaded(true)}
                        />
                    </CardActionArea>
                </Link>
            </Card>
            <Box sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }} className="fadeIn">
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={400}>${product.price}</Typography>
            </Box>
        </Grid>
    );
};
