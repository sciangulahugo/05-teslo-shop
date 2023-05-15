import NextLink from "next/link";
import { ShopLayout } from "@/components/layouts";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";


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
                <Link href={`/orders/${params.row.id}`} component={NextLink} underline="always">Ver orden</Link>
            );
        }
    }

];

const rows = [
    { id: 1, paid: true, fullname: 'Hugo Sciangula' },
    { id: 2, paid: false, fullname: 'Cesar Ozuna' },
    { id: 3, paid: true, fullname: 'Alejandro Lopez' },
    { id: 4, paid: true, fullname: 'Catalina Ozuna' },
    { id: 5, paid: false, fullname: 'Esteban Lois' },
];

const HistoryPage = () => {
    return (
        <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
            <Typography variant="h1" component="h1">Historial de ordenes</Typography>
            {/* Tabla */}
            <Grid container>
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

export default HistoryPage;
