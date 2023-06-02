import jwt from 'jsonwebtoken';

export const singToken = (_id: string, email: string) => {
    if (!process.env.JWT_SECRET_SEED)
        throw new Error('No jwt seed - check the .env');

    // Ahora creamos nuestro jwt
    return jwt.sign(
        // Payload
        { _id, email },

        // Seed (semilla o la clave)
        process.env.JWT_SECRET_SEED,

        // Opcione
        { expiresIn: '30d' }
    );
};

export const isValidToken = (token: string): Promise<string> => {
    if (!process.env.JWT_SECRET_SEED)
        throw new Error('No jwt seed - check the .env');

    if (token.length <= 10)
        return Promise.reject('JWT no es valido');

    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT invalid');
                const { _id } = payload as { _id: string };
                resolve(_id);
            });
        } catch (error) {
            reject('JWT invalid');
        }
    });
};