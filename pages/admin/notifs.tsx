import { RadioGroup } from "@headlessui/react";
import React from "react";
import { LayoutAdmin } from "./layout"

const AdminChatbot = () => {
    const [selected, setSelected] = React.useState('alert-info')
    const [message, setMessage] = React.useState('');

    const options = [
        { name: 'Information', value: 'alert-info' },
        { name: 'Erreur', value: 'alert-error' },
        { name: 'Warning', value: 'alert-warning' },
    ]

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("selected", selected, "message", message)
        // CALL API ICI 😉
    }

    return (
        <LayoutAdmin>
            <form onSubmit={handleFormSubmit} className='flex flex-col justify-between h-1/2'>
                <div className="space-y-2 flex flex-col justify-center items-center">
                    <input type='text' required={true} value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} placeholder='Mon message de notification' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                    <RadioGroup className={'space-x-2 w-full flex justify-center'} defaultValue={selected}
                        onChange={(value: string) => setSelected(value)}>
                        {
                            options.map((option) => (
                                <RadioGroup.Option
                                    key={option.value}
                                    value={option.value}
                                    className={({ active, checked }) =>
                                        `${checked ? 'bg-slate-700 text-white' : 'bg-slate-300 text-gray-700'}
                 relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                                    }
                                >
                                    {option.name}
                                </RadioGroup.Option>
                            ))
                        }
                    </RadioGroup>
                </div>
                <div className="flex w-full justify-end">
                    <button className="p-3 w-52 rounded-md shadow-lg bg-slate-100 hover:shadow-inner hover:shadow-black">Envoyer la notification</button>
                </div>
            </form>
        </LayoutAdmin >
    )
}

export default AdminChatbot
