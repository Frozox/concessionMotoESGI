import React, { Fragment } from "react"
import { motion } from "framer-motion"
import { ChatInput } from "../ChatInput"
import AminBot from '../../public/amin_bg.png'
import Image from "next/image"
import { Steps, ChatBotProps, MessageProps } from "."
import { ChatMessage, ChatMessageOptions, IsTypingBuble } from "./ChatMessage"

export const ChatBot = ({ steps, botName, isOpen }: ChatBotProps) => {
    const [userIsTyping, setUserIsTyping] = React.useState<boolean>(false)
    const [userInput, setUserInput] = React.useState<string>('')
    const [botIsTyping, setBotIsTyping] = React.useState<boolean>(false)
    const [currentStep, setCurrentStep] = React.useState<number>(0)
    const [messageToDisplay, setMessageToDisplay] = React.useState<MessageProps[]>([{ user: [], bot: [] }])

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value)
    }

    const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setMessageToDisplay([...messageToDisplay, { user: [{ anwserStep: currentStep, message: userInput, sendAt: new Date() }], bot: [] }])
        setUserInput('')
        setUserIsTyping(false)
    }

    const handleBotSubmit = React.useCallback(() => {
        setBotIsTyping(true)
        setTimeout(() => {
            setBotIsTyping(false)
            if (!messageToDisplay.find(message => message.bot.find(botMessage => botMessage?.id === currentStep))) {
                setMessageToDisplay([...messageToDisplay, { user: [], bot: [steps.find(step => step.id === currentStep) as Steps] }])
            }
        }, 1000)
    }, [currentStep, steps])

    const handleNextStep = React.useCallback((step: number) => {
        setCurrentStep(step + 1)
        handleBotSubmit()
    }, [handleBotSubmit])

    const handleUserKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { // (3)
        if (e.key === 'Enter') {
            handleUserSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
            handleNextStep(currentStep) // (4)
        } else {
            setUserIsTyping(true)
        }
    }

    React.useEffect(() => { //executed when user open chatbot(1)
        if (isOpen) {
            if (currentStep === 0) {
                setCurrentStep(steps[0].id) // set step at 1
                handleBotSubmit()
            } else {
                handleBotSubmit()
            }
        }
    }, [isOpen, currentStep])

    const handleCloseChat = React.useCallback(() => {
        setCurrentStep(0)
        setMessageToDisplay([{ user: [], bot: [] }])
    }, [])

    const hadnleOptionClick = (e: React.FormEvent<HTMLFormElement>) => {
        setUserIsTyping(false)
        handleUserSubmit(e)
    }

    return (
        <div className="text-gray-700 h-full rounded-lg bg-blue-50">
            <div className="flex flex-col space-y-2 border h-5/6 overflow-y-scroll px-3">
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
                    {messageToDisplay.map((message, index) => {
                        return (
                            <React.Fragment key={index}>
                                {message.user.map((userMessage, index) => {
                                    return (
                                        <ChatMessage key={index} message={userMessage} isBot={false} />
                                    )
                                })}
                                {message.bot.map((botMessage, index) => {
                                    return (
                                        <Fragment>
                                            <ChatMessage key={index} message={botMessage} isBot />
                                            {botMessage?.options && (
                                                <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full">
                                                    {botMessage.options.map((option, index) => {
                                                        return (
                                                            <ChatMessageOptions
                                                                key={index}
                                                                options={option}
                                                                action={(e: React.FormEvent<HTMLFormElement>) => hadnleOptionClick(e)}
                                                                setteur={setUserInput}
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </Fragment>
                                    )
                                })
                                }
                            </React.Fragment>
                        )
                    })}
                </div>
                {userIsTyping && (
                    <IsTypingBuble isBot={false} />
                )}
                {botIsTyping && (
                    <IsTypingBuble isBot />
                )}
            </div>
            <div className="w-full flex justify-center items-center">
                <ChatInput
                    btnName="Envoyer"
                    placeholder="Ecrivez votre message ici"
                    value={userInput}
                    onChange={handleUserInput}
                    fullWith
                    onKeyPress={(e) => handleUserKeyPress(e)}
                    id="chat-input"
                    onSubmit={function (): void {
                        throw new Error("Function not implemented.")
                    }}
                    theme={"light"}
                />
            </div>
        </div>
    )
}
