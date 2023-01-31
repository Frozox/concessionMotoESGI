import { User } from "@prisma/client"
import { getInitial } from "../helpers/helper"
import Link from "next/link";

type IUser = User & {
    authorOnDirectMessage?: {
        id: string
    }
}

export const ContactComponent = ({ user, isSelected = false }: { user: IUser, isSelected: Boolean }) => {
    return (
        <Link href={`/messages/${user.id}`} key={user.id} className={`w-full h-20 bg-transparent border rounded cursor-pointer text-black p-3 focus:outline-none hover:bg-stone-900 items-center flex space-x-2 ${isSelected ? 'bg-stone-900' : ''}`}>
            <div className='flex justify-center items-center text-sm w-14 h-14 leading-none border rounded-full text-white border-white cursor-pointer font-bold'>
                {getInitial(user.firstName + ' ' + user.lastName)}
            </div>
            <p className="text-white justify-center items-center">{user.firstName} {user.lastName}</p>
        </Link>
    )
}