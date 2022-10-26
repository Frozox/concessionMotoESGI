import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { UseModal } from '../helpers/hooks/useModal/modal';
import { AnimatePresence, motion } from 'framer-motion'

export const Modal = ({ isShowing, toggle, yesNo, yesNoAction, title, text, content }: UseModal) => isShowing ? ReactDOM.createPortal(
    <Fragment>
        <AnimatePresence>
            {isShowing && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={toggle}></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.01 }}
                            exit={{ opacity: 0, scale: 0.5, y: 100 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start w-full">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full flex flex-col">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            {title}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {text}
                                            </p>
                                        </div>
                                        <div className='w-full'>
                                            {content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {yesNo ? (
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    {
                                        yesNoAction && yesNoAction.map((btn) => (
                                            <button type="button" className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${btn.type === 'yes' ? 'bg-red-600' : 'bg-white'}  text-base font-medium ${btn.type === 'yes' ? 'text-white hover:bg-red-700' : 'text-gray-700 hover:bg-gray-50'}  focus:outline-none focus:ring-2 focus:ring-offset-2 ${btn.type === 'yes' ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:ml-3 sm:w-auto sm:text-sm`} onClick={btn.action}>
                                                {btn.text}
                                            </button>
                                        ))
                                    }
                                </div>
                            ) : null}
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    </Fragment >, document.body
) : null;
