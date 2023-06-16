import { ShippingAddress } from '@/interfaces';
import { ICartProduct } from '@/interfaces/cart';
import { createContext } from 'react';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress

    // Methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void;

    // Orders
    createOrder: () => Promise<{ hasError: boolean; message: string; }>;
}

export const CartContext = createContext({} as ContextProps);