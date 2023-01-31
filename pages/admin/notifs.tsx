import { RadioGroup } from "@headlessui/react";
import React, { Fragment } from "react";
import { AlertPopHover } from "../../components/AlertPopHover";
import { useAuth } from "../../helpers/context/User";
import { IAlertProps } from "../../helpers/hooks/Alert/alert";
import { useAlert } from "../../helpers/hooks/Alert/useAlert";
import { sendCommercialNotification } from "../../helpers/requests/notifs";
import LayoutAdmin from "./layout"

const AdminChatbot = () => {
    const [selected, setSelected] = React.useState('alert-info')
    const [message, setMessage] = React.useState('');
    const [alert, setAlert] = React.useState<IAlertProps>({ type: 'alert-info', message: '' })
    const { showAlert, setShowAlert, toggleAlert } = useAlert()
    const { token } = useAuth();

    const options = [
        { name: 'Information', value: 'alert-info' },
        { name: 'Alerte', value: 'alert-warning' },
        { name: 'Erreur', value: 'alert-error' },
    ]

    const handleAlert = (type: Omit<IAlertProps, 'message'>['type'], message: IAlertProps['message']) => {
        setAlert({ type: type, message: message })
        setShowAlert(true)
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
    }


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;
        sendCommercialNotification(token, { message, type: selected }).then((res) => {
            handleAlert('alert-success', 'Notification envoyée avec succès')
            setMessage('')
        }).catch((e) => {
            handleAlert('alert-error', 'La notification n\'a pas pu être envoyée');
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
                <form onSubmit={handleFormSubmit} className="flex w-full justify-center">
                    <label htmlFor="chat" className="sr-only">Mon message de notification</label>
                    <div className="w-3/4 flex flex-col items-center px-3 py-5 rounded-lg bg-gray-50 dark:bg-[#292929]">
                        <div className="flex items-center w-full">
                            <textarea id="chat" rows={1} className="h-[100px] block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#ffffff10] dark:border-[#292929] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mon message de notification..." value={message} onChange={(input: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(input.target.value)} />
                            <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                <span className="sr-only">Send message</span>
                            </button>
                        </div>
                        <div className="mx-4 p-2.5 py-1 w-full space-y-2 flex flex-col justify-center items-center">
                            <RadioGroup className='items-start flex space-x-2 rounded-xl p-2 w-full' defaultValue={selected} onChange={(value: string) => setSelected(value)}>
                                {
                                    options.map((option) => (
                                        <RadioGroup.Option key={option.value} value={option.value} className={({ active, checked }) => `${checked ? option.value : 'bg-slate-300 text-gray-700'} w-1/3 relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`}>
                                            {option.name}
                                        </RadioGroup.Option>
                                    ))
                                }
                            </RadioGroup>
                        </div>
                    </div>
                </form>
            </LayoutAdmin>
        </Fragment>
    )
}

export default AdminChatbot
