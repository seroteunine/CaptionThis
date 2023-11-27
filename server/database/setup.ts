import * as mongoDB from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'captionThisDB';
const client = new mongoDB.MongoClient(url);

async function connectToDB() {
    try {
        const conn = await client.connect();
        console.log("Connected successfully to MongoDB server");
        return conn.db(dbName);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default connectToDB;