import bcrypt from 'bcryptjs';
import User from "@/models/User";
import { db } from ".";

export const checkUserEmailPassword = async (email: string, password: string) => {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user)
        return null;

    if (!bcrypt.compareSync(password, user.password!))
        return null;

    // Aca si retornamos los datos del usuario
    const { role, name, _id } = user;

    return {
        role,
        name,
        _id,
        email: email.toLocaleLowerCase()
    };
};

// Esta funcion verifica o crea un usuario de Oauth
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });
    if (user) {
        await db.disconnect();
        const { _id, name, role, email } = user;
        return { _id, name, role, email };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
    await newUser.save();
    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };
}; 