import { useEffect, useState } from "react";
import { GetServerSideProps } from 'next';
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layouts";
import { useForm } from "react-hook-form";
// import { AuthContext } from "@/context";
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import { getSession, signIn, getProviders } from "next-auth/react";

type FormData = {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    // const { loginUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    // Estado para los providers
    const [providers, setProviders] = useState<any>({}); // Es un dolor de cabeza tiparlo

    useEffect(() => {
        getProviders().then(prov => {
            console.log(prov);
            setProviders(prov);
        });
    }, []);

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);



        // const isValidLogin = await loginUser(email, password);

        // if (!isValidLogin) {
        //     setShowError(true);
        //     setTimeout(() => setShowError(false), 4000);
        //     return;
        // }

        // // Volvemos a la pagina en la que estaba
        // const destination = router.query.page?.toString() || '/';
        // router.replace(destination);

        // Iniciamos sesion con NextAuth
        await signIn('credentials', { email, password });
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

                        <Grid item xs={12} display="flex" flexDirection="column" justifyContent="end">
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {
                                // Como es un objeto, no lo podemos reccorrer como un map
                                Object.values(providers)
                                    // Con este filter evitamos devolver html innecesario
                                    .filter((provider: any) => provider.id !== 'credentials')
                                    .map((provider: any) => {
                                        // if (provider.id === 'credentials') return (
                                        //     <div key={provider.id}></div>
                                        // );

                                        return (
                                            <Button
                                                key={provider.id}
                                                variant="outlined"
                                                fullWidth
                                                color="primary"
                                                sx={{ mb: 1 }}
                                                onClick={() => signIn(provider.id)}
                                            >
                                                {provider.name}
                                            </Button>
                                        );
                                    })
                            }
                        </Grid>

                    </Grid>

                </Box>
            </form>

        </AuthLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });  // your fetch function here

    const { page = '/' } = query;

    // Si ya tenemos una sesion lo mandamos al home
    if (session) {
        return {
            redirect: {
                destination: page.toString(),
                permanent: false
            }
        };
    }

    // En caso contrario lo dejamos aca
    return {
        props: {}
    };
};

export default LoginPage;
