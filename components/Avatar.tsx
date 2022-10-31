import { Popover } from "@headlessui/react"
import Link from "next/link"
import { FiLogOut } from "react-icons/fi"
import { HiOutlineMail } from 'react-icons/hi'

interface IAvatar {
    indicator: number
    userLetters: string
}

export const Avatar = ({ indicator, userLetters }: IAvatar) => {
    return (
        <Popover className="relative">
            <Popover.Button className='flex justify-center items-center text-sm w-14 h-14 leading-none border rounded-full text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 cursor-pointer font-bold'>
                {userLetters}
            </Popover.Button>
            <div className='absolute top-0 right-0 -mt-1 -mr-1'>
                <div className='flex items-center justify-center h-5 w-5 bg-red-500 rounded-full'>
                    <span className='text-xs font-semibold leading-none text-white'>{indicator}</span>
                </div>
            </div>
            <Popover.Panel className="absolute z-10 bg-slate-200 top-16 right-0 rounded-xl shadow-xl">
                <div className="grid grid-cols-1 overflow-scroll p-2 w-52 h-32 gap-1">
                    <Link
                        href="/messages"
                        className="input-user-navbar"
                    >
                        {/* ou mettre l'indicator si notif */}
                        <HiOutlineMail className="mr-2" />
                        Messages
                    </Link>
                    <Link
                        href="/logout"
                        className="input-user-navbar hover:bg-red-500 hover:text-white"
                    >
                        <FiLogOut className="mr-2" />
                        Deconnexion
                    </Link>
                </div>
            </Popover.Panel>
        </Popover>

    )
}