import { BotAnswer } from "@prisma/client"
import { motion } from "framer-motion"
import { UserMessageProps, StepProps, ChatMessageOptionsProps } from "."
import { getStepById } from "../../helpers/requests/chatbot"

export const IsTypingBuble = ({ isBot }: { isBot: boolean }) => {
    return (
        <motion.div
            className={`flex items-center  ${isBot ? 'justify-start ml-4' : 'justify-end mr-4'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex space-x-2 p-3 bg-slate-300 rounded-full">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
            </div>
        </motion.div>
    )
}

export const ChatMessage = ({ message, isBot }: { message: UserMessageProps | StepProps, isBot: boolean }) => {
    return (
        <motion.div
            className={`flex flex-col ${isBot ? 'justify-start items-start ml-4' : 'justify-end items-end mr-4'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`flex space-x-2 p-3 bg-slate-300 rounded-full ${isBot ? 'bg-blue-300' : 'bg-gray-300'}`}>
                <p className="text-sm">{isBot ? (message as StepProps)?.question : (message as UserMessageProps)?.message}</p>
            </div>
            <div className={`flex space-x-2 ${isBot ? 'ml-2' : 'mr-2'} mt-2`}>
                <p className="text-xs text-gray-500">{isBot ? 'Amin assitant virtuelle' : 'Vous'}</p>
                <p className="text-xs text-gray-500">{new Date(message?.createdAt).toLocaleTimeString()}</p>
            </div>
        </motion.div>
    )
}

export const ChatMessageOptions = ({ answer, setter, setUserMessages, disabled }: ChatMessageOptionsProps) => {
    const handleClick = (nextStep: BotAnswer | null) => {
        if (nextStep?.nextStepId) {
            setUserMessages(nextStep.answer)
            getStepById(nextStep.nextStepId as string).then(res => res.json()).then(data => { setter(data) })
        }
    }

    return (
        disabled ? null :
            <motion.div
                className="flex w-min-[3rem] border rounded-md shadow-sm px-4 py-2 cursor-pointer hover:bg-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => handleClick(answer)}
            >
                {answer.answer}
            </motion.div>

    )
}