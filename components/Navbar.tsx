import { Fragment } from "react"
import Link from "next/link"
import React from "react"
import { Modal } from "./Modal"
import useModal from "../helpers/hooks/Modal/useModal"
import { Login } from "./Login"
import { motion } from 'framer-motion'
import { Register } from "./Register"
import { AlertPopHover } from "./AlertPopHover"
import { useAlert } from "../helpers/hooks/Alert/useAlert"
import { Avatar } from "./Avatar"
import { getInitial } from "../helpers/helper"
import { useAuth } from "../helpers/context/User"
import { IAlertProps, useAlertProps } from "../helpers/hooks/Alert/alert"

export const Navbar = ({ children }: { children: JSX.Element }) => {
    const { isShowing, toggle } = useModal()
    const { isShowing: isShowingRegister, toggle: toggleRegister } = useModal()
    const { showAlert, toggleAlert, setShowAlert } = useAlert()
    const [show, setShow] = React.useState(false)
    const { token, isAdmin, user } = useAuth()
    const [isShowingMobile, setIsShowingMobile] = React.useState(false)
    const { socket } = useAuth()

    const myLinks = [
        { href: "/forum", label: "Forum", visible: true },
        { href: "/faq", label: "FAQ", visible: true },
        { href: "/admin", label: "Administration", visible: isAdmin },
    ]

    const [alertMessage, setAlertMessage] = React.useState<IAlertProps>({
        type: 'alert-info',
        message: 'Ceci est un pop alert !'
    })

    const [showMenu, setShowMenu] = React.useState(false)

    const handleAlert = ({ type, message }: IAlertProps) => {
        setAlertMessage({
            type: type,
            message: message
        })
        toggleAlert()
        setTimeout(() => {
            setShowAlert(false)
            setAlertMessage({ type: 'alert-info', message: '' })
        }, 5000)
    }

    React.useEffect(() => {
        if (!socket) return;
        // User notifications
        socket.removeListener('notifications');
        socket.on('notifications', (method: string, notif: IAlertProps) => {
            handleAlert({ type: notif.type, message: notif.message })
        });
        // Admin notifications
        socket.removeListener('admin_notifications');
        socket.on('admin_notifications', (method: string, notif: IAlertProps) => {
            handleAlert({ type: notif.type, message: notif.message })
        });
        // Commercial notifications
        socket.removeListener('commercial_notifications');
        socket.on('commercial_notifications', (method: string, notif: IAlertProps) => {
            handleAlert(notif)
        });
    }, [socket])

    React.useEffect(() => {
        if (token) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [token])

    return (
        <Fragment>
            <div className="h-screen flex flex-col">
                <div className='w-full relative flex justify-end z-50 top-24 right-5'>
                    <div className='w-fit absolute'>
                        <AlertPopHover
                            alert={{ type: alertMessage.type, message: alertMessage.message }}
                            showAlert={showAlert}
                            toggleAlert={toggleAlert}
                        />
                    </div>
                </div>
                <div className="relative">
                    <nav className='w-full top-0 flex items-center justify-between flex-wrap bg-[#292929]/50 p-6'>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className='flex items-center flex-shrink-0 text-white mr-6'
                        >
                            <img src='/suzuki-logo.ico' alt='Logo' className='w-8 h-8 mr-2' />
                            <Link href={'/'} className='font-semibold text-xl tracking-tight'>Suzuki</Link>
                        </motion.div>
                        <div className='block lg:hidden'>
                            <button className='flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white'>
                                <svg className='fill-current h-3 w-3' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                                    <title>Menu</title>
                                    <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
                                </svg>
                            </button>
                        </div>
                        <div className='w-full md:block flex-grow lg:flex lg:items-center lg:w-auto hidden'>
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className='text-sm lg:flex-grow'>
                                {myLinks.map((link, index) => {
                                    if (link.visible) {
                                        return (
                                            <Link href={link.href} key={index} className='block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4'>
                                                {link.label}
                                            </Link>
                                        )
                                    }
                                })}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className='space-x-2 flex justify-center items-center'
                            >
                                {!show ? (
                                    <Fragment>
                                        <div className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 cursor-pointer' onClick={toggle}>
                                            Login
                                        </div>

                                        <div className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 cursor-pointer' onClick={toggleRegister}>
                                            Inscription
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Avatar
                                        //indicator={2}
                                        userLetters={getInitial(user?.firstName + ' ' + user?.lastName)}
                                    />
                                )}
                            </motion.div>
                        </div>
                        <Modal
                            isShowing={isShowing}
                            toggle={toggle}
                            title="Login"
                            content={<Login modalToggle={toggle} />}
                        />
                        <Modal
                            isShowing={isShowingRegister}
                            toggle={toggleRegister}
                            title='Inscription'
                            content={<Register modalToggle={toggleRegister} />}
                        />
                    </nav>
                </div>
                <div className="h-full w-full overflow-scroll bg-[#292929] text-white scroll-smooth">
                    {/* <button onClick={toggleAlert}>Notif</button> */}
                    {children}
                </div>
            </div>
        </Fragment>
    )
}