import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const choices = {
        id: 0,
        message: "Bonjour, que puis-je faire pour vous ?",
        options: [
            {
                id: 1,
                message: "Voulez vous vérifier l'entretien de votre véhicule ?",
            },
            {
                id: 2,
                message: "Souhaitez vous des informations sur votre véhicule ?",
            },
            {
                id: 3,
                message: "Voulez vous des plus d'informations afin de nous contacter ?",
            },
            {
                id: 4,
                message: "Fermer le chat",
            },
        ]
    }

    res.status(200).json({ choices });
}