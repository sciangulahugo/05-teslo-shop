import { FC } from "react";
import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
// import { initialData } from "@/database/products";
import { ProductList } from "@/components/products";
// import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { dbProducts } from "@/database";
import { IProduct } from "@/interfaces";

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

export const SearchPage: FC<Props> = ({ products, foundProducts, query }) => {
    // Podriamos usar el useRouter y ver la query, pero nos conviene verlo del lado del servidor
    // para asi leer las cookies, y en caso de que no exista el producto, le mandamos algo
    // relacionado a lo que tiene en las cookies.
    // const router = useRouter();
    // console.log(router.query);
    return (
        <ShopLayout title={"Teslo Shop - Search"} pageDescription={"Encuentra los mejores productos de teslo!"}>
            <Typography variant="h1" component="h1">Buscar Productos</Typography>
            {
                foundProducts
                    ? <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">Resultado: {query}</Typography>
                    : <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">No encontramos nada con: {query}</Typography>
            }
            {
                <ProductList products={products} />
            }
        </ShopLayout >
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    // Le estamos diciendo a los bost de www que no indexen este sitio
    if (!query.length)
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        };

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;
    if (!foundProducts) {
        products = await dbProducts.getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    };
};

export default SearchPage;