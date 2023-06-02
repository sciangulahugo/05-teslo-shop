import { useContext, useState } from "react";
import NextLink from "next/link";
import { AuthLayout } from "@/components/layouts";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { validations } from "@/utils";
import { tesloApi } from "@/api";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "@/context";
import { useRouter } from "next/router";

type FormData = {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {
    const router = useRouter();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const onRegisterUser = async ({ name, email, password }: FormData) => {
        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);
        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => setShowError(false), 4000);
            return;
        }

        // Volvemos a la pagina en la que estaba
        const destination = router.query.page?.toString() || '/';
        router.replace(destination);
    };

    return (
        <AuthLayout title="Ingresar">
            <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Crear cuenta</Typography>
                            <Chip
                                sx={{ display: showError ? 'flex' : 'none' }}
                                label={errorMessage}
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    required: 'Nombre requerido',
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Email requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Password requerido',
                                    minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className="circular-btn"
                                size="large"
                                fullWidth
                            >
                                Registrame
                            </Button>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="end">
                            <Link
                                href={router.query.page ? `/auth/login?page=${router.query.page}` : `/auth/login`}
                                component={NextLink}
                                underline="always"
                            >
                                ¿Ya tienes cuenta?
                            </Link>
                        </Grid>
                    </Grid>

                </Box>
            </form>

        </AuthLayout>
    );
};

export default RegisterPage;
