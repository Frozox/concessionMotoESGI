
export const CommentComponent = () => {
    return (
        <div className="flex flex-col rounded-md p-2 drop-shadow-md shadow-lg bg-slate-100">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-full border flex items-center justify-center">LC</div>
                <div className="flex flex-col ml-3">
                    <span className="text-sm">Loan CLERIS</span>
                    <span className="text-xs">{new Date(Date.now()).toDateString()}</span>
                </div>
            </div>
            <div className="mt-3">
                Voila moi aussi j'ai eu le meme pb
            </div>
        </div>
    )
}

interface IMessage {
    owner: boolean
    message: string
    createdAt: Date
    user: { firstName: string, lastName: string }
}

export const MessageComponent = ({ owner, message, createdAt, user }: IMessage) => {
    return (
        <div className="flex flex-col">
            <div className={`flex ${owner ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col ${owner ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center ${owner ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="h-10 w-10 rounded-full border flex items-center justify-center">{user.firstName[0]}{user.lastName[0]}</div>
                        <div className="flex flex-col ml-3">
                            <span className="text-sm">{user.firstName} {user.lastName}</span>
                            <span className="text-xs">{createdAt.toDateString()}</span>
                        </div>
                    </div>
                    <div className={`mt-3 p-3 border rounded-md ${owner ? 'bg-slate-100' : 'bg-white'}`}>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}
