import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { AuthContext, authReducer } from './';
import { useSession, signOut } from 'next-auth/react';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const { data, status } = useSession();
    const router = useRouter();

    // Si esta logueado, lo autenticamos con los datos de data
    useEffect(() => {
        if (status === 'authenticated') {
            // console.log(data.user);
            dispatch({ type: "[Auth] - Login", payload: data?.user as IUser });
        }
    }, [status, data]);

    // Autenticacion manual
    // useEffect(() => {
    //     checkToken();
    // }, []);

    // const checkToken = async (): Promise<boolean> => {
    //     if (!Cookies.get('token')) return false;
    //     try {
    //         const { data } = await tesloApi.get('/user/validate-token');
    //         const { token, user } = data;

    //         // Guardamos la cookie
    //         Cookies.set('token', token);

    //         dispatch({ type: '[Auth] - Login', payload: user });
    //         return true;
    //     } catch (error) {

    //         Cookies.remove('token');
    //         return false;
    //     }
    // };

    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

            // Guardamos la cookie
            Cookies.set('token', token);

            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            return false;
        }
    };
    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string }> => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            };
        } catch (error) {
            if (axios.isAxiosError(error))
                return {
                    hasError: true,
                    message: error.response?.data.message
                };
            return {
                hasError: true,
                message: 'No se pudo crear el usuario',
            };
        }
    };

    const logout = () => {
        Cookies.remove('cart');
        // Limpiamos los datos de domicilio
        Cookies.remove("firstName");
        Cookies.remove("lastName");
        Cookies.remove("address");
        Cookies.remove("addressConfirm");
        Cookies.remove("zip");
        Cookies.remove("city");
        Cookies.remove("country");
        Cookies.remove("phone");

        // Cerramos sesion con NextAuth
        signOut();
        // Recargamos para limpiar todo
        // Cookies.remove('token');
        // router.reload();
    };

    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};