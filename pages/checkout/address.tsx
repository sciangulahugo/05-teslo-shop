import { useContext } from "react";
import { ShopLayout } from "@/components/layouts";
import { CartContext } from "@/context";
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { countries } from "@/utils";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    addressConfirm?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get("firstName") || "",
        lastName: Cookies.get("lastName") || "",
        address: Cookies.get("address") || "",
        addressConfirm: Cookies.get("addressConfirm") || "",
        zip: Cookies.get("zip") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || "",
        phone: Cookies.get("phone") || "",
    };
};

const AddressPage = () => {
    const router = useRouter();
    const { updateAddress } = useContext(CartContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    const onSubmitAddress = (data: FormData) => {
        // Actualizamos el addres en caso de que cambie
        updateAddress(data);
        router.push('/checkout/summary');
    };

    return (
        <ShopLayout title="Direccíon" pageDescription="Confirmar direccion de destinos">
            <form onSubmit={handleSubmit(onSubmitAddress)}>
                <Typography variant="h1" component="h1">Direccíon</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            {...register('firstName', {
                                required: 'Nombre requerido',
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apellido"
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Apellido requerido',
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Direccíon"
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Direccíon requerido',
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Direccíon 2"
                            variant="filled"
                            fullWidth
                            {...register('addressConfirm')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Código Postal"
                            variant="filled"
                            fullWidth
                            {...register('zip', {
                                required: 'Código postal requerido',
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'Ciudad requerido',
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant="filled"
                                label="País"
                                defaultValue={Cookies.get("country") || countries[0].code}
                                {...register('country', {
                                    required: 'Email requerido',
                                })}
                                error={!!errors.country}
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Teléfono"
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Teléfono requerido',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
                    <Button type="submit" color="secondary" className="circular-btn" size="large">
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//     const { token = "" } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken)
//         return {
//             redirect: {
//                 destination: '/auth/login?page=/checkout/address',
//                 permanent: false
//             }
//         };

//     return {
//         props: {

//         }
//     };
// };

export default AddressPage;
