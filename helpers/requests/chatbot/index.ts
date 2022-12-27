import { apiRequest } from "..";

export const getWorkflows = async () => {
    return await apiRequest({
        method: "GET",
        url: "/workflow",
    });
}

export const postUserChoice = async (workflowId: string) => {
    return await apiRequest({
        method: "POST",
        url: `/workflow/${workflowId}`,
    });
}

