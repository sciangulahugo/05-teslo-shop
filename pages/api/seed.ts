import { db, seedDatabase } from '@/database';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    // Analizamos si estamos en produccion
    if (process.env.NODE_ENV === 'production')
        return res.status(401).json({ message: 'No tiene acceso a este servicio' });

    // Nos conectamos a la base de datos.
    await db.connect();
    // Borramos todos los datos de la db.
    await Product.deleteMany();
    // Insertamos los seed.
    await Product.insertMany(seedDatabase.initialData.products);
    // Desconectamos de la db.
    await db.disconnect();

    res.status(200).json({ message: 'Proceso realizado correctamente' });
}
