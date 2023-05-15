import NextLink from 'next/link';
import { ShopLayout } from "@/components/layouts";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Button, Link, Typography } from "@mui/material";

const EmptyPage = () => {
    return (
        <ShopLayout title="Carrito vacío" pageDescription="No hay artículos en el carrito de compras">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="calc(100vh - 200px)"
                sx={
                    {
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }
                }>
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography>Su carríto esta vacio</Typography>
                    <Link component={NextLink} href='/'>
                        <Button color="primary">Regresar</Button>
                    </Link>
                </Box>
            </Box>
        </ShopLayout>
    );
};

export default EmptyPage;
