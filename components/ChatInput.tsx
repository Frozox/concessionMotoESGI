import { BiPaperPlane } from "react-icons/bi"

interface ChatInputProps {
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onSubmit: () => void
    btnName: string
    icon?: JSX.Element
}

export const ChatInput = ({ placeholder, value, onChange, onKeyPress, onSubmit, btnName, icon }: ChatInputProps) => {
    return (
        <div className="flex items-center space-x-2 m-2">
            <input
                type="text"
                className="w-full p-3 bg-transparent border rounded-md focus:outline-none"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyPress}
            />
            <div
                className="p-3 bg-transparent border rounded-md focus:outline-none hover:bg-blue-500 hover:text-white items-center flex space-x-2 cursor-pointer"
                onClick={onSubmit}
            >
                <span>{btnName}</span>
                {icon ? (icon) : (<BiPaperPlane className="inline-block" />)}
            </div>
        </div>
    )
}