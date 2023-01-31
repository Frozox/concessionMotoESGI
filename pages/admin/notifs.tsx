import { RadioGroup } from "@headlessui/react";
import React, { Fragment } from "react";
import { AlertPopHover } from "../../components/AlertPopHover";
import { IAlertProps } from "../../helpers/hooks/Alert/alert";
import { useAlert } from "../../helpers/hooks/Alert/useAlert";
import { postNotifs } from "../../helpers/requests/notifs";
import { LayoutAdmin } from "./layout"

const AdminChatbot = () => {
    const [selected, setSelected] = React.useState('alert-info')
    const [message, setMessage] = React.useState('');
    const [alert, setAlert] = React.useState<IAlertProps>({ type: 'alert-info', message: '' })
    const { showAlert, setShowAlert, toggleAlert } = useAlert()

    const options = [
        { name: 'Information', value: 'alert-info' },
        { name: 'Erreur', value: 'alert-error' },
        { name: 'Warning', value: 'alert-warning' },
    ]

    const handleAlert = (type: Omit<IAlertProps, 'message'>['type'], message: IAlertProps['message']) => {
        setAlert({ type: type, message: message })
        setShowAlert(true)
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
    }


    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await postNotifs(selected, message).then((res) => {
            res.json().then((data) => {
                if (res.status === 201) {
                    handleAlert('alert-success', 'Notification envoyée avec succès')
                    setMessage('')
                } else {
                    handleAlert('alert-error', data.message)
                }
            })
        })
    }

    return (
        <Fragment>
            <AlertPopHover
                showAlert={showAlert}
                toggleAlert={toggleAlert}
                alert={{
                    type: alert.type,
                    message: alert.message
                }}
            />
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
            </LayoutAdmin>
        </Fragment>
    )
}

export default AdminChatbot
