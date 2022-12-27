import React, { Fragment } from "react"
import { motion } from "framer-motion"
import { ChatInput } from "../ChatInput"
import AminBot from '../../public/amin_bg.png'
import Image from "next/image"
import { StepProps, ChatBotProps, UserMessageProps, AnswerProps, MessageHistory } from "."
import { ChatMessage, ChatMessageOptions, IsTypingBuble } from "./ChatMessage"
import { getSteps } from "../../helpers/requests/chatbot"
import { BotAnswer } from "@prisma/client"

export const ChatBot = ({ botName, isOpen }: ChatBotProps) => {
    const [botIsTyping, setBotIsTyping] = React.useState<boolean>(false)
    const [currentStep, setCurrentStep] = React.useState<StepProps | undefined>(undefined)
    const [stepsList, setStepsList] = React.useState<StepProps[]>([])
    const [userMessages, setUserMessages] = React.useState<string>('')
    const [messageToDisplay, setMessageToDisplay] = React.useState<MessageHistory[]>([{ user: [], bot: [] }])

    const handleBotSubmit = React.useCallback(() => {
        setBotIsTyping(true)
        setTimeout(() => {
            setBotIsTyping(false)
        }, 1000)
    }
        , [currentStep])

    React.useEffect(() => {
        if (isOpen) {
            if (!currentStep) {
                return setCurrentStep(stepsList.find(step => step.isRoot))
            }
            if (currentStep?.isRoot) {
                setBotIsTyping(true)
                setTimeout(() => {
                    setBotIsTyping(false)
                    setMessageToDisplay([{ user: [], bot: [currentStep] }])
                }, 1000)
            }
        }
    }, [isOpen, currentStep])

    React.useEffect(() => {
        if (stepsList.length === 0) {
            getSteps().then(res => res.json()).then(data => setStepsList(data))
        }
    }, [stepsList.length])

    const handleCloseChat = React.useCallback(() => {
        setCurrentStep(undefined)
        setUserMessages('')
        setStepsList([])
        setMessageToDisplay([{ user: [], bot: [] }])
    }, [])

    return (
        <div className="text-gray-700 h-full rounded-lg bg-blue-50">
            <div className="flex flex-col space-y-2 h-full overflow-hidden px-3">
                <div className="flex justify-between">
                    <div className="space-x-3 mt-3 flex items-center ">
                        <Image src={AminBot} alt="bot" className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center" />
                        <h2 className="font-bold text-xl">{botName}</h2>
                    </div>
                    <div className="border p-2 rounded-md flex items-center mt-3 hover:bg-red-500 cursor-pointer hover:text-white border-gray-500 shadow-lg" onClick={handleCloseChat}>
                        Cloturer la conversation
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    {messageToDisplay.map((message: MessageHistory, index: number) => {
                        return (
                            <Fragment key={index}>
                                {message.bot.map((botMessage: StepProps, index: number) => {
                                    return (
                                        <Fragment key={index}>
                                            <ChatMessage
                                                message={botMessage}
                                                isBot
                                            />
                                            <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full">
                                                {botMessage.answers.map((answer: BotAnswer, index: number) => {
                                                    return (
                                                        <ChatMessageOptions
                                                            answer={answer}
                                                            setter={setCurrentStep}
                                                            setUserMessages={setUserMessages}
                                                            key={index}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </Fragment>
                                    )
                                })}
                                {message.user.map((userMessage: UserMessageProps, index: number) => {
                                    return (
                                        <ChatMessage
                                            message={userMessage}
                                            isBot={false}
                                            key={index}
                                        />
                                    )
                                })}
                            </Fragment>
                        )
                    })}
                </div>
                {botIsTyping && (
                    <IsTypingBuble isBot />
                )}
            </div>
        </div>
    )
}