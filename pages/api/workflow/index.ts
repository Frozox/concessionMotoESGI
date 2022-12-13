import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const choices = [
        {
            trigger: 1,
            message: "Voulez vous vérifier l'entretien de votre véhicule ?",
        },
        {
            trigger: 2,
            message: "Souhaitez vous des informations sur votre véhicule ?",
        },
        {
            trigger: 3,
            message: "Voulez vous des plus d'informations afin de nous contacter ?",
        },
        {
            trigger: 4,
            message: "Fermer le chat",
        },
    ]

    res.status(200).json({ choices });
}