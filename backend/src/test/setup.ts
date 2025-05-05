import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    await mongoose.connection.db?.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});
