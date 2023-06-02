import { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layouts";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";

type FormData = {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const { loginUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);

        const isValidLogin = await loginUser(email, password);

        if (!isValidLogin) {
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
            return;
        }

        // Volvemos a la pagina en la que estaba
        const destination = router.query.page?.toString() || '/';
        router.replace(destination);
    };

    return (
        <AuthLayout title="Ingresar">
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Iniciar Sesion</Typography>

                            <Chip
                                sx={{ display: showError ? 'flex' : 'none' }}
                                label="No reconocemos ese email o password"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
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
                                disabled={(!!errors.email || !!errors.password)}
                                fullWidth>Ingresar</Button>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="end">
                            <Link href={router.query.page ? `/auth/register?page=${router.query.page}` : `/auth/register`} component={NextLink} underline="always">
                                Crear cuenta
                            </Link>
                        </Grid>
                    </Grid>

                </Box>
            </form>

        </AuthLayout>
    );
};

export default LoginPage;
