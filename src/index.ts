import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';

import authRouter from './routes/auth.routes';
import { ILocation, IUserLocation } from './types/types';
import User from './models/User';

require('dotenv').config();

const PORT = Number(process.env.PORT) || 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth/', authRouter);
app.use('/static', express.static(path.join(__dirname, 'static')))

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});
const couriersNamespace = io.of('/couriers');
const adminNamespace = io.of('/admin');

let couriersLocations = new Map<string, IUserLocation>();

const emitLocationsBroadcast = () => {
    adminNamespace.emit('locations', Array.from(couriersLocations, ([name, value]) => value));
}

couriersNamespace.on('connection', async socket => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
        socket.disconnect();
    }

    socket.on('location', async (location: ILocation) => {
        if (!couriersLocations.get(userId)) {
            const user = await User.findById(userId);
            couriersLocations.set(userId, {...user.toObject(), ...location})
        }
        emitLocationsBroadcast();
    })

    socket.on('disconnect', () => {
        couriersLocations.delete(userId);
        emitLocationsBroadcast();
    });
});

adminNamespace.on('connection', socket => {
    console.log('Connect to admin namespace');
    emitLocationsBroadcast();
});


httpServer.listen(PORT);
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to Mongo DB');
});