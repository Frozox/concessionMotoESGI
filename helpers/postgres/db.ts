import { Pool } from 'pg'

let conn: any;

if (!conn) {
    console.log('Creating new connection');

    conn = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.PGSQL_HOST,
        port: 9000,
        database: process.env.POSTGRES_CON_STRING,
    });

    console.log('Connection created');

}

export default conn;