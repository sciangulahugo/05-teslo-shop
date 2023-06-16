import NextLink from "next/link";
import { ShopLayout } from "@/components/layouts";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { getOrdersByUser } from "@/database/dbOrders";
import { IOrder } from "@/interfaces";


// Tipado de las columnas: 
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra informacion de la orden',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pagada" variant="outlined" />
                    : <Chip color="error" label="No pagada" variant="outlined" />
            );
        }
    },
    {
        field: 'order',
        headerName: 'Ver orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <Link href={`/orders/${params.row.orderId}`} component={NextLink} underline="always">Ver orden</Link>
            );
        }
    }

];

// const rows = [
//     { id: 1, paid: true, fullname: 'Hugo Sciangula' },
//     { id: 2, paid: false, fullname: 'Cesar Ozuna' },
//     { id: 3, paid: true, fullname: 'Alejandro Lopez' },
//     { id: 4, paid: true, fullname: 'Catalina Ozuna' },
//     { id: 5, paid: false, fullname: 'Esteban Lois' },
// ];

interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map((order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }));

    return (
        <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
            <Typography variant="h1" component="h1">Historial de ordenes</Typography>
            {/* Tabla */}
            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    // Traemos la session del usuario
    const session: any = await getSession({ req });

    if (!session)
        return {
            redirect: {
                destination: '/auth/login?page=/orders/history',
                permanent: false
            }
        };

    const orders = await getOrdersByUser(session.user._id);

    return {
        props: {
            orders
        }
    };
};

export default HistoryPage;
