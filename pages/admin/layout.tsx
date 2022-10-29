import { Tab } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export const LayoutAdmin = ({ children }: { children: JSX.Element }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const headers = [
        { title: 'Channels', link: '/admin/channels' },
        { title: 'Demande assistance', link: '/admin/help' },
        { title: 'Chatbot', link: '/admin/chatbot' },
    ]
    return (
        <div className="w-full h-full px-10 space-y-2 flex justify-center items-center flex-col">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className={'space-x-1 p-2 bg-[#ffffff10] rounded-xl w-full'}>
                    {headers.map((header, index) => (
                        <TableList
                            key={index}
                            title={header.title}
                            link={header.link}
                        />
                    ))}
                </Tab.List>
                <Tab.Panels className={'bg-slate-200 rounded-xl h-[70vh] w-full text-black p-3'}>
                    {children}
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}

const TableList = ({ title, link }: { title: string, link: string }) => {
    const router = useRouter()
    return (
        <Link href={link}>
            <Tab className={`px-5 py-3 ${router.pathname === link ? 'bg-white text-black' : 'bg-transparent hover:bg-[#fff]/20'} rounded-lg min-w-[7rem] text-white focus:outline-none`}>{title}</Tab>
        </Link>
    )
}