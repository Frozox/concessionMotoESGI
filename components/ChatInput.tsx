import { ChangeEventHandler } from "react"
import { BiPaperPlane } from "react-icons/bi"

interface ChatInputProps {
    placeholder?: string
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onSubmit: () => void
    theme: "light" | "dark"
    btnName: string
    icon?: JSX.Element
    fullWith?: boolean
    id?: string
}

export const ChatInput = ({ placeholder, value, onChange, onKeyPress, onSubmit, theme = "light", btnName, icon, fullWith, id }: ChatInputProps) => {
    return (
        <div className={`flex items-center space-x-2 m-2 ${fullWith ? 'w-full' : ''}`}>
            <input
                type="text"
                className={`w-full p-3 bg-transparent border rounded-md focus:outline-none ${theme === "light" ? "text-black" : "text-white"}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyPress}
                id={id}
            />
            <div
                className={`p-3 bg-transparent border rounded-md focus:outline-none hover:bg-blue-500 hover:text-white items-center flex space-x-2 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`}
                onClick={onSubmit}
            >
                <span>{btnName}</span>
                {icon ? (icon) : (<BiPaperPlane className="inline-block" />)}
            </div>
        </div>
    )
}