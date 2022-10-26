import { Fragment, ReactNode } from "react"
import Link from "next/link"
import React from "react"
import { Modal } from "./Modal"
import useModal from "../helpers/hooks/useModal/useModal"
import { Login } from "./Login"
import { motion } from 'framer-motion'
import { Register } from "./Register"

export const Navbar = ({ children }: { children: JSX.Element }) => {
    const myLinks = [
        { href: "/", label: "Home" },
        { href: "/moto-models", label: "Modèles" },
        { href: "/pieces", label: "Pièces" },
    ]
    const { isShowing, toggle } = useModal()
    const { isShowing: isShowingRegister, toggle: toggleRegister } = useModal()
    return (
        <Fragment>
            <div className="h-screen flex flex-col">
                <div className="relative">
                    <nav className='w-full top-0 flex items-center justify-between flex-wrap bg-gray-800 p-6'>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className='flex items-center flex-shrink-0 text-white mr-6'
                        >
                            <img src='/favicon.ico' alt='Logo' className='w-8 h-8 mr-2' />
                            <span className='font-semibold text-xl tracking-tight'>Moto concession</span>
                        </motion.div>
                        <div className='block lg:hidden'>
                            <button className='flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white'>
                                <svg className='fill-current h-3 w-3' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                                    <title>Menu</title>
                                    <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
                                </svg>
                            </button>
                        </div>
                        <div className='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className='text-sm lg:flex-grow'>
                                {myLinks.map((link) => (
                                    <Link href={link.href} key={link.label} className='block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4'>
                                        {link.label}
                                    </Link>
                                ))}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <div className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 cursor-pointer' onClick={toggle}>
                                    Login
                                </div>

                                <div className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 cursor-pointer' onClick={toggleRegister}>
                                    Inscription

                                </div>

                            </motion.div>
                        </div>
                        <Modal
                            isShowing={isShowing}
                            toggle={toggle}
                            title="Login"
                            content={<Login />}
                        />
                        <Modal
                            isShowing={isShowingRegister}
                            toggle={toggleRegister}
                            title='Inscription'
                            content={<Register />}
                        />
                    </nav>
                </div>
                <div className="h-full w-full overflow-scroll bg-[#292929] text-white">
                    {children}
                </div>
            </div>
        </Fragment>
    )
}