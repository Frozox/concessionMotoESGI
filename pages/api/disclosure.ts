import { NextApiRequest, NextApiResponse } from "next";

export interface IDisclosure {
    id: number;
    title: string;
    description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const myDisclosures = [
        { id: 1, title: "Quand dois-je faire réviser ma MOTO ?", description: "Les premiers contrôles obligatoires doivent se faire aux 1000 kms et aux 6000 kms, ensuite à tous les 6000 kms de votre véhicule.\n Il est obligatoire d'effectuer un petit entretien avec un minimum (vidange, moteur et filtre) au sein du réseau CF Moto une fois par an pour le bon fonctionnement et le suivi de votre véhicule." },
        { id: 2, title: "De quoi ai-je besoin lors de la révision de mon véhicule ?", description: "Il est obligatoire d'apporter son carnet d'entretien et de le faire certifier par son concessionnaire afin d'assurer la prise en charge de la garantie du véhicule. Votre carte grise vous sera également demandée lors de la prise en charge de votre véhicule." },
        { id: 3, title: "Quels sont les tarifs de la révision de mon véhicule ?", description: "Les tarifs de la révision de votre véhicule sont disponibles sur notre site internet. Vous pouvez également les consulter auprès de votre concessionnaire." },
        { id: 4, title: "Quel entretien puis-je faire moi-même ?", description: "Vous pouvez vérifier la pression des pneus, la tension de la chaine, les niveaux de liquides, le filtre à air, les bougies et les différents serrages de la moto. Pour tous les autres entretiens, nous vous recommandons de vous rapprocher de votre concessionnaire." },
    ]

    try {
        res.status(200).json(myDisclosures);
    } catch (error) {
        res.status(500).json({ error });
    }
}