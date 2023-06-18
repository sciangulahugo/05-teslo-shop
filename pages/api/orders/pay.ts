import { db } from '@/database';
import { IPaypal } from '@/interfaces';
import { Order } from '@/models';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return payOrder(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' });
    }

}

// Obtenemos el beares token de paypal
const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    // Importante el utf-8
    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');

    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // En caso de que todo salga bien retornamos nuestro token.
        return data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error))
            console.log(error.response?.data);
        else console.log(error);
        return null;
    }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    // TODO: validad la sesion del usuario
    // TODO: validad mongoId

    const paypalBearerToken = await getPaypalBearerToken();

    if (!paypalBearerToken)
        return res.status(200).json({ message: 'Error, token not created' });

    // Si todo sale bien, consultamos la informacion de la orden
    const { orderId = '', transactionId = '' } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`,
        }
    });

    if (data.status !== 'COMPLETED')
        return res.status(401).json({ message: 'Order not found' });

    // Nos conectamos a la base de datos y buscamos la orden
    await db.connect();
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
        await db.disconnect();
        return res.status(400).json({ message: 'Order not found in database' });
    }

    // Corroboramos los precios
    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect();
        return res.status(400).json({ message: 'Error in amounts values paypal != database total' });
    }

    // Ahora si guardamos el transactionId
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();



    return res.status(200).json({ message: 'Paid order' });
};
