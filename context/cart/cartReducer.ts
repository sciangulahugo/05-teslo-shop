import { ICartProduct } from '@/interfaces/cart';
import { CartState, ShippingAddress } from './';

type CartActionType =
    | { type: '[Cart] - Load Cart From Cookies | Storage', payload: ICartProduct[] }
    | { type: '[Cart] - Update Products In Car', payload: ICartProduct[] }
    | { type: '[Cart] - Change Cart Quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove Product In Car', payload: ICartProduct }
    | { type: '[Cart] - Load Address From Cookies', payload: ShippingAddress }
    | { type: '[Cart] - Update Address', payload: ShippingAddress }
    | {
        type: '[Cart] - Update Order Summary',
        payload: {
            numberOfItems: number;
            subTotal: number;
            tax: number;
            total: number;
        }
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    switch (action.type) {
        case '[Cart] - Load Cart From Cookies | Storage':
            return {
                ...state,
                isLoaded: true,
                cart: action.payload
            };

        case '[Cart] - Update Products In Car':
            return {
                ...state,
                cart: [...action.payload]
            };
        case '[Cart] - Change Cart Quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    // Vemos que sea el mismo id
                    if (product._id !== action.payload._id) return product;
                    // Vemos que sea el mismo tamaño
                    if (product.size !== action.payload.size) return product;

                    return action.payload;
                })
            };
        case '[Cart] - Remove Product In Car':
            return {
                ...state,
                cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
            };
        case '[Cart] - Update Order Summary':
            return {
                ...state,
                ...action.payload
            };
        case '[Cart] - Update Address':
        case '[Cart] - Load Address From Cookies':
            return {
                ...state,
                shippingAddress: action.payload
            };
        default:
            return state;
    }
};