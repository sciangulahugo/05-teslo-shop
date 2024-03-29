import { IProduct } from '@/interfaces';
import useSWR, { SWRConfiguration } from 'swr';
const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
    // const { data, error: isError, isLoading } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);
    const { data, error: isError, isLoading } = useSWR<IProduct[]>(`/api${url}`, config);

    return {
        products: data || [],
        isError,
        isLoading
    };
};