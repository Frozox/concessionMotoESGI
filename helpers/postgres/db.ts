import { Pool } from 'pg'

let conn: any;

if (!conn) {
    console.log('Creating new connection');
    console.log(process.env.POSTGRES_CON_STRING);

    conn = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: 5432,
        database: process.env.POSTGRES_DB,
    });

    try {
        conn.connect();
        console.log('Connected to database');
    } catch {
        console.log('Error connecting to database');
    }

}

export default conn;