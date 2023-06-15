import { IOrder } from '@/interfaces';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });

    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    // const { orderItems, total } = req.body as IOrder;

    // Obtenemos la sesioon del usuario
    // const session: any = await getToken({ req });
    const session: any = await getServerSession(req, res, authOptions);

    // Aqui el problema con getSession
    // const session: any = await getSession({ req });
    return res.status(201).json(session);
};
