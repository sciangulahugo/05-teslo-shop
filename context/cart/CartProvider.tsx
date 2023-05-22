import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react';
import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces/cart';

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
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
                const cart = JSON.parse(Cookie.get("cart") ?? "[]");
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

    useEffect(() => {
        if (isMounted) Cookie.set("cart", JSON.stringify(state.cart));
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

    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct
        }}>
            {children}
        </CartContext.Provider>
    );
};