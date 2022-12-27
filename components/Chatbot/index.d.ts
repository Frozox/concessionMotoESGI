import React from "react"

export interface Steps {
    id: number
    message: string
    options?: Options[]
    sendAt: Date
}

export interface Options {
    value: string
    label: string
    id: number
}

export interface UserMessages {
    anwserStep: number
    message: string
    sendAt: Date
}

export interface ChatBotProps {
    botName?: string
    isOpen: boolean
}

export interface MessageProps {
    user: UserMessages[],
    bot: Steps[],
}

export interface OptionsProps {
    options: Options
    action: (e: any) => void
    setteur: React.Dispatch<React.SetStateAction<string>>
}