import { IOrder } from '@/interfaces';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/database';
import { Product, Order } from '@/models';

type Data =
    | { message: string }
    | IOrder
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });

    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    // Obtenemos la sesioon del usuario

    // Aqui el problema con getSession
    // const session: any = await getSession({ req });

    // Otro forma de obtener el id del cliento con el getToken()
    // const session: any = await getToken({ req });

    // Forma en la que me funcion, con el getServerSession
    const session: any = await getServerSession(req, res, authOptions);
    if (!session)
        return res.status(403).json({ message: 'Unauthorized' });

    // Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map(product => product._id);
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });
    // console.log(dbProducts);
    try {
        const subTotal = orderItems.reduce((prev, current) => {
            // Aca trabajamos con los object id
            const currentPrice = dbProducts.find(prod => prod.id === current._id)!.price;
            if (!currentPrice)
                throw new Error('Product not found');
            return (currentPrice * current.quantity) + prev;
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal)
            throw new Error('Error'); // En caso de que haya modificado los datos en el front

        // Hasta aca llego todo bien
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        await newOrder.save();
        await db.disconnect();

        res.status(201).json(newOrder);
    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: error.message || 'Check logs'
        });
    }
};
