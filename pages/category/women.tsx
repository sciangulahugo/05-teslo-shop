import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";

export default function WomenPage() {

    const { products, isLoading } = useProducts('/products?gender=women');
    return (
        <ShopLayout title={"Teslo Shop - Women"} pageDescription={"Los mejores productos para mujeres"}>
            <Typography variant="h1" component="h1">Mujeres</Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }
        </ShopLayout >
    );
}
