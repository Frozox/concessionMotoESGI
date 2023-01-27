import { BotAnswer, BotStep, BotUserMessage } from "@prisma/client"
import React from "react"

export interface ChatBotProps {
    botName?: string
    isOpen: boolean
}

export interface AnswerProps extends BotAnswer {
    nextStep: BotStep
}

export interface StepProps extends BotStep {
    answers: BotAnswer[]
}

export interface UserMessageProps extends BotUserMessage {
    step: BotStep
}

export interface MessageHistory {
    bot: StepProps[]
    user: { message: string, sentAt: Date }[]
}

export interface ChatMessageOptionsProps {
    answer: BotAnswer,
    setter: React.Dispatch<React.SetStateAction<StepProps | undefined>>,
    setUserMessages: React.Dispatch<React.SetStateAction<string>>,
    disabled: boolean
}