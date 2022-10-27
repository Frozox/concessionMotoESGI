import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../helpers/postgres/db';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('Registering user');

        const { email, password, firstname, lastname } = req.body;
        const query = `INSERT INTO user(email, password, firstName, lastName, roles) VALUES('${email}', '${password}', '${firstname}', '${lastname}', '{"user"}' )`;
        const result = await conn.query(query);
        console.log(result, 'test');
        res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}