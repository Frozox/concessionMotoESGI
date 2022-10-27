import React from "react";
import { FiX } from "react-icons/fi";
import { useAlertProps } from "../helpers/hooks/Alert/alert";
import { AnimatePresence, motion } from 'framer-motion'

export const AlertPopHover = ({ toggleAlert, showAlert, alert }: useAlertProps) => {
    return (
        <AnimatePresence>
            {
                showAlert && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className={`alert ${alert.type} shadow-lg`}
                    >
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="text-gray-700">{alert.message}</span>
                        </div>
                        <div>
                            <FiX onClick={toggleAlert} />
                        </div>
                    </motion.div>
                ) || null
            }
        </AnimatePresence>
    )
}

export const AlertMessage = () => {
    return (
        <div className="alert shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <h3 className="font-bold">New message!</h3>
                    <div className="text-xs">You have 1 unread message</div>
                </div>
            </div>
            <div className="flex-none">
                <button className="btn btn-sm">See</button>
            </div>
        </div>
    )
}