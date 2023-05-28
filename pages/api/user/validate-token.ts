import bcrypt from 'bcryptjs';
import { db } from '@/database';
import User from '@/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwt } from '@/utils';

type Data =
    | { message: string }
    | {
        token: string;
        user: {
            name: string;
            email: string;
            role: string;
        }
    }
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return checkJWT(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }

}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken(token);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    await db.connect();
    const user = await User.findById(userId).lean();
    await db.disconnect();

    if (!user)
        return res.status(400).json({ message: 'User not found' });

    const { _id, email, name, role } = user;

    setTimeout(() => {
        return res.status(200).json({
            token: jwt.singToken(_id, email),
            user: {
                email, role, name
            }
        });
    }, 1000);

};
