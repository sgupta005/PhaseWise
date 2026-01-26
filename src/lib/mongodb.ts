import { Db, MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Global cache for serverless - reuses connections between invocations
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

// Cache the connection promise globally
// This allows connection reuse between function invocations
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// Helper to get connected client
export async function getClient(): Promise<MongoClient> {
  return clientPromise;
}

// Helper to get database
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName || process.env.DB_NAME);
}

// Export for MongoDB adapter (Auth.js)
export default clientPromise.then((client) => client);
