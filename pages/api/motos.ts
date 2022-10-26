import type { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'querystring';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // const url = 'https://motorcycle-specs-database.p.rapidapi.com/article/2020/Yamaha';

    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': 'ee66dbb65emsh5c706f92ae5f6c7p1862f0jsnfb87383d4abd',
    //         'X-RapidAPI-Host': 'motorcycle-specs-database.p.rapidapi.com'
    //     }
    // };

    // const motos = async () => {
    //     const response = await fetch(url, options);
    //     const data = await response.json();
    //     return data;
    // }
    // console.log(motos(), 'test');

    res.status(200).json([{ name: 'moto1' }, { name: 'moto2' }]);
}
