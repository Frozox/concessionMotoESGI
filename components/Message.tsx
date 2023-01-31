interface IComment {
    user: { firstName: string, lastName: string }
    createdAt: Date
    content: string
}
export const CommentComponent = ({ user, content, createdAt }: IComment) => {
    return (
        <div className="flex flex-col rounded-md p-2 drop-shadow-md shadow-lg bg-[#f2f2f2]">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-full border flex items-center justify-center">LC</div>
                <div className="flex flex-col ml-3">
                    <span className="text-sm">{user.firstName + ' ' + user.lastName}</span>
                    <span className="text-xs">{new Date(createdAt).toDateString()}</span>
                </div>
            </div>
            <div className="mt-3">
                {content}
            </div>
        </div>
    )
}

interface IMessage {
    owner: boolean
    message: string
    createdAt: Date
    user: { firstName: string, lastName: string }
    theme?: 'light' | 'dark'
}

export const MessageComponent = ({ owner, message, createdAt, user, theme }: IMessage) => {
    return (
        <div className="flex flex-col">
            <div className={`flex ${owner ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col ${owner ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center ${owner ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`h-10 w-10 rounded-full border flex items-center justify-center ${theme === "light" ? 'text-black' : 'text-white'}`}>{user.firstName[0]}{user.lastName[0]}</div>
                        <div className="flex flex-col ml-3">
                            <span className={`text-sm ${theme === "light" ? 'text-black' : 'text-white'}`}>{user.firstName} {user.lastName}</span>
                            <span className={`text-xs ${theme === "light" ? 'text-black' : 'text-white'}`}>{new Date(createdAt).toDateString()}</span>
                        </div>
                    </div>
                    <div className={`mt-3 p-3 border rounded-md drop-shadow-md shadow-md ${owner ? 'bg-slate-100' : 'bg-white'}`}>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}
