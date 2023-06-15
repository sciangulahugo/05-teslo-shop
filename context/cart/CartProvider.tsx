import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react';
import Cookies from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces/cart';
import { IOrder, ShippingAddress } from '@/interfaces';
import { tesloApi } from '@/api';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress
}



const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    // // Cargamos desde las cookies si recarga la pagina.
    // useEffect(() => {
    //     const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
    //     dispatch({ type: '[Cart] - Load Cart From Cookies | Storage', payload: cookieProducts });
    // }, []);

    // useEffect(() => {
    //     if (state.cart.length)
    //         Cookie.set('cart', JSON.stringify(state.cart));
    // }, [state.cart]);

    // Estado para saber si se monto el componente
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        try {
            if (!isMounted) {
                const cart = JSON.parse(Cookies.get("cart") ?? "[]");
                dispatch({
                    type: "[Cart] - Load Cart From Cookies | Storage",
                    payload: cart,
                });
                setIsMounted(true);
            }
        } catch (error) {
            dispatch({
                type: "[Cart] - Load Cart From Cookies | Storage",
                payload: [],
            });
        }
    }, [isMounted]);

    // Buscamos de las cookies los datos de direccion
    useEffect(() => {
        try {
            // Cargamos por primera vez el el addres de las cookies
            if (!isMounted) {
                if (Cookies.get("firstName")) {
                    dispatch({
                        type: "[Cart] - Load Address From Cookies",
                        payload: {
                            firstName: Cookies.get("firstName") || "",
                            lastName: Cookies.get("lastName") || "",
                            address: Cookies.get("address") || "",
                            addressConfirm: Cookies.get("addressConfirm"),
                            zip: Cookies.get("zip") || "",
                            city: Cookies.get("city") || "",
                            country: Cookies.get("country") || "",
                            phone: Cookies.get("phone") || "",
                        }
                    });
                    setIsMounted(true);
                }
            }
        } catch (error) {
            // En caso de que no este la cookie y de errors

        }
    }, [isMounted]);

    // Cada vez que se modifique el cart y este montado el componente, se guarda
    useEffect(() => {
        if (isMounted) Cookies.set("cart", JSON.stringify(state.cart));
    }, [state.cart, isMounted]);

    // Calculo de precios
    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0);
        // Impuestos
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const tax = subTotal * taxRate;

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax,
            total: subTotal + tax,
        };

        dispatch({ type: '[Cart] - Update Order Summary', payload: orderSummary });
    }, [state.cart, isMounted]);

    const addProductToCart = (product: ICartProduct) => {
        // Verificamos si existe un producto con el id
        const productInCart = state.cart.some(p => p._id === product._id); // Retorna un booleano
        // Si no existe aun el producto en el carrito, entonces lo agregamos
        if (!productInCart) return dispatch({ type: '[Cart] - Update Products In Car', payload: [...state.cart, product] }); // Hacemos una copia de todo lo que teniamos, y le mandamos el nuevo

        // Ahora analizamos si hay un producto con la misma talla
        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if (!productInCartButDifferentSize) return dispatch({ type: '[Cart] - Update Products In Car', payload: [...state.cart, product] });

        // Si llegamos aca, es porque encontramos el mismo producto y misma talla.
        // Entonces tenemos que acumular
        const updatedProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            // Actualizamos la cantidad.
            p.quantity += product.quantity;
            return p;
        });

        dispatch({ type: '[Cart] - Update Products In Car', payload: updatedProducts });
    };

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Change Cart Quantity', payload: product });
    };

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Remove Product In Car', payload: product });
    };

    const updateAddress = (address: ShippingAddress) => {
        Cookies.set("firstName", address.firstName);
        Cookies.set("lastName", address.lastName);
        Cookies.set("address", address.address);
        Cookies.set("addressConfirm", address.addressConfirm || '');
        Cookies.set("zip", address.zip);
        Cookies.set("city", address.city);
        Cookies.set("country", address.country);
        Cookies.set("phone", address.phone);
        dispatch({ type: '[Cart] - Update Address', payload: address });
    };

    const createOrder = async () => {
        // Analizamos la direccion
        if (!state.shippingAddress)
            throw new Error('Address is empty');

        const body: IOrder = {
            // Para este punto, el size del producto es obligatorio
            orderItems: state.cart.map((product) => ({
                ...product,
                size: product.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        };

        try {
            // Aca llamamos a nuestra api para cargar los datos
            const { data } = await tesloApi.post('/orders', body);
            console.log({ data });
        } catch (error) {

        }
    };

    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,

            // Orders
            createOrder,
        }}>
            {children}
        </CartContext.Provider>
    );
};