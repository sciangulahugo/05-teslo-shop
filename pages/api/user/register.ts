import bcrypt from 'bcryptjs';
import { db } from '@/database';
import User from '@/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwt, validations } from '@/utils';

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
        case 'POST':
            return registerUser(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if (password.length < 5)
        return res.status(400).json({ message: 'Password must have more than 6 characters' });

    if (name.length < 2)
        return res.status(400).json({ message: 'Name must have more than 6 characters' });

    if (!validations.isValidEmail(email))
        return res.status(400).json({ message: 'Invalid email' });

    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
        await db.disconnect();
        return res.status(400).json({ message: 'User already exist' });
    }

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        await db.disconnect();
        return res.status(500).json({ message: 'Revisar logs del servidor' });
    }

    await db.disconnect();

    const { _id, role } = newUser;

    const token = jwt.singToken(_id, email);

    return res.status(200).json({
        token,
        user: {
            email,
            role,
            name
        }
    });

};
