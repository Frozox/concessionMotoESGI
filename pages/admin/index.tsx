import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import React from "react"
import { SelectableItemTable } from "../../components/SelectableItemTable"

const AdminTableSlug: NextPage = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const channels = [
        { id: '1', title: "J'ai un probleme avec mon pot d'échapement", members: ['Loan', 'Tom', 'Raph'], capacity: 10, owner: { email: 'loan.cleris@gmail.com', firstName: 'Loan', lastName: 'Cleris' }, createdAt: '03/11/2022', status: true },
        { id: '2', title: "J'ai pas assez de vitesse que dois-je faire ? ", members: ['Loan', 'Tom', 'Raph'], capacity: 10, owner: { email: 'test@test.fr', firstName: 'Tom', lastName: 'Cuillandre' }, createdAt: '04/11/2022', status: false },
    ]

    return (
        <div className="w-full h-full px-10 space-y-2 flex justify-center items-center flex-col">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className={'space-x-1 p-2 bg-[#ffffff10] rounded-xl w-full'}>
                    <Tab className={`px-5 py-3 ${selectedIndex === 0 ? 'bg-white text-black' : 'bg-transparent hover:bg-[#fff]/20'} rounded-lg min-w-[7rem] text-white focus:outline-none`} tabIndex={0}>Forum - Channel</Tab>
                    <Tab className={`px-5 py-3 ${selectedIndex === 1 ? 'bg-white text-black' : 'bg-transparent hover:bg-[#fff]/20'} rounded-lg min-w-[7rem] text-white focus:outline-none`} tabIndex={1}>Demande assistance</Tab>
                    <Tab className={`px-5 py-3 ${selectedIndex === 2 ? 'bg-white text-black' : 'bg-transparent hover:bg-[#fff]/20'} rounded-lg min-w-[7rem] text-white focus:outline-none`} tabIndex={2}>Chatbot</Tab>
                </Tab.List>
                <Tab.Panels className={'bg-slate-200 rounded-xl h-[70vh] w-full text-black p-3'}>
                    <Tab.Panel className={`space-y-2`}>
                        {channels.map((channel, index) => (
                            <SelectableItemTable
                                {...channel}
                                key={index}
                            />
                        ))}
                    </Tab.Panel>
                    <Tab.Panel>Content 2</Tab.Panel>
                    <Tab.Panel>Content 3</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}

export default AdminTableSlug