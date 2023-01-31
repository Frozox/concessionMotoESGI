import { Tab } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { Fragment } from "react"
import { useForm } from "react-hook-form"
import { Modal } from "../../components/Modal"
import { useAuth } from "../../helpers/context/User"
import useModal from "../../helpers/hooks/Modal/useModal"
import { createChannel } from "../../helpers/requests/forum"

const LayoutAdmin = ({ children }: { children: JSX.Element }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const headers = [
        { title: 'Channels', link: '/admin/channels' },
        { title: 'Demande assistance', link: '/admin/help' },
        { title: 'Notifications commerciales', link: '/admin/notifs' },
    ]
    const router = useRouter()
    const { toggle, isShowing } = useModal()
    const { isAdmin } = useAuth()

    React.useEffect(() => {
        if (!isAdmin) {
            router.push('/')
        }
    }, [isAdmin])

    return (
        <Fragment>
            <div className="w-full h-full px-10 space-y-2 flex justify-center items-center flex-col">
                <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                    <Tab.List className={'space-x-1 p-2 bg-[#ffffff10] rounded-xl w-full flex items-center justify-between'}>
                        <div className="space-x-2">
                            {headers.map((header, index) => (
                                <TableList
                                    key={index}
                                    title={header.title}
                                    link={header.link}
                                />
                            ))}
                        </div>
                        {headers[0].link === router.pathname ? (
                            <div className="w-52 relative flex items-center space-x-3 justify-between">
                                <div className="-ml-0.5 w-0.5 h-10 bg-white" />
                                <div className="w-fit bg-white/50 text-center p-2 items-center rounded-md cursor-pointer hover:bg-white/90 hover:text-green-500" onClick={toggle}>Ajouter {headers[0].title}</div>
                            </div>
                        ) : null}
                    </Tab.List>
                    <Tab.Panels className={'bg-slate-200 rounded-xl h-[70vh] w-full text-black p-3'}>
                        {children}
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <Modal
                isShowing={isShowing}
                toggle={toggle}
                title={'Ajouter un channel'}
                content={<FormAddChannel modalToggle={toggle} />}
            />
        </Fragment>
    )
}

const TableList = ({ title, link }: { title: string, link: string }) => {
    const router = useRouter()
    return (
        <Link href={link}>
            <Tab className={`px-5 py-3 ${router.pathname === link ? 'bg-white text-black' : 'bg-transparent hover:bg-[#fff]/20 text-white'} rounded-lg min-w-[7rem] text-black focus:outline-none`}>{title}</Tab>
        </Link>
    )
}

const FormAddChannel = ({ modalToggle }: { modalToggle: Function }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [formError, setFormError] = React.useState('');
    const { user, token } = useAuth()
    const onSubmit = (data: any) => {
        if (token && user) {
            createChannel(data, token, user.id).then(res => res.json().then(data => {
                if (res.ok) {
                    modalToggle()
                } else {
                    setFormError(data.message)
                }
            }))
        }
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(onSubmit)()
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div className='flex flex-col'>
                <input type='text' {...register('title', { required: true })} placeholder='Titre' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                {errors.firstname && <span>This field is required</span>}
            </div>
            <div className='flex flex-col'>
                <input type='number' {...register('capacity', { required: true })} placeholder='Capacité Max' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                {errors.lastname && <span>This field is required</span>}
            </div>
            <div className='hidden'>
                <input type='text' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' defaultValue={user?.firstName + ' ' + user?.lastName} />
            </div>
            {formError && <p className='text-red-500'>{formError}</p>}
            <button className='w-full h-10 my-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md justify-center items-center flex cursor-pointer'>
                Créer
            </button>
        </form>
    )
}

export default LayoutAdmin