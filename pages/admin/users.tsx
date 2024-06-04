import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

const UsersPage = () => {
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data)
            setUsers(data);
    }, [data]);

    if (!data && !error) return null;

    const onRoleUpdated = async (userId: string, newRole: string) => {
        // En caso de erro guardamos el previous
        const previousUsers = users;

        const updatedUsers = users.map(user => ({
            ...user,
            // Buscamos al usuario por id, y le asignamos el nuevo rol
            role: userId === user._id ? newRole : user.role,
        }));

        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole });
        } catch (error) {
            // En caso de error revertimos los usuarios
            setUsers(previousUsers);
            alert(error);
        }
    };

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre Completo', width: 300 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Rol"
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                        <MenuItem value='super-user'>Super User</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                );
            }
        },
    ];

    const rows = users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout
            title="Usuarios"
            subTitle="Mantenimiento de usuarios"
            icon={<PeopleOutline />}
        >
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

        </AdminLayout>
    );
};

export default UsersPage;