import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // post request
    if (req.method === "POST") {
        const { message, type } = req.body;

    }

}