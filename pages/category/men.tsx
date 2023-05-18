import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";

export default function MenPage() {

    const { products, isLoading } = useProducts('/products?gender=men');
    return (
        <ShopLayout title={"Teslo Shop - Men"} pageDescription={"Los mejores productos para hombres"}>
            <Typography variant="h1" component="h1">Hombres</Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }
        </ShopLayout >
    );
}
