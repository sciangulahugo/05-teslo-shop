import mongoose from "mongoose";

/**
 * 0 = disconected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnectiong
 */

const mongooConnection = {
    isConnected: 0
};

export const connect = async () => {
    try {
        if (mongooConnection.isConnected) {
            console.log('Estamos conectados');
            return;
        }
        if (mongoose.connections.length > 0) {
            mongooConnection.isConnected = mongoose.connections[0].readyState;
            if (mongooConnection.isConnected === 1) {
                console.log('Usando conexion anterior');
                return;
            }

            await mongoose.disconnect();
            mongooConnection.isConnected = 1;
        }

        await mongoose.connect(process.env.MONGO_URL || '');
        mongooConnection.isConnected = 1;
        console.log('Conectando a MongoDB');
    } catch (error) {
        console.log(error);
    }
};

export const disconnect = async () => {
    try {
        if (process.env.NODE_ENV === 'development') return;

        if (mongooConnection.isConnected === 0) return;
        await mongoose.disconnect();
        mongooConnection.isConnected = 0;
        console.log('Desconectado de MongoDB');
    } catch (error) {
        console.log(error);
    }
};