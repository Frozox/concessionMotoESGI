import { NextApiRequest, NextApiResponse } from "next";
import { workflow1, workflow2, workflow3, workflow4 } from './questions'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { workflowId } = req.query;
    let returnedQuestions: any[] = [];
    switch (workflowId) {
        case '1':
            returnedQuestions = workflow1;
            break;
        case '2':
            returnedQuestions = workflow2;
            break;
        case '3':
            returnedQuestions = workflow3;
            break;
        case '4':
            returnedQuestions = workflow4;
            break;
        default:
            returnedQuestions = [];
    }

    res.status(200).json({ returnedQuestions });
}