import { apiRequest } from "..";

export const getSteps = async () => {
    return await apiRequest({
        method: "GET",
        url: "/chatbot/steps",
    });
}

export const getAnswers = async () => {
    return await apiRequest({
        method: "GET",
        url: `/chatbot/answers`,
    });
}

export const getStepById = async (stepId: string) => {
    return await apiRequest({
        method: "GET",
        url: `/chatbot/steps/${stepId}`,
    });
}

export const getAnswerById = async (answerId: string) => {
    return await apiRequest({
        method: "GET",
        url: `/chatbot/answers/${answerId}`,
    });
}