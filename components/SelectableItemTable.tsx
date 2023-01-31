import { Fragment } from "react"
import useModal from "../helpers/hooks/Modal/useModal"
import { Modal } from "./Modal"
import { MdDeleteForever } from 'react-icons/md'
import { BiEdit } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import React from "react"
import { deleteChannel, updateChannel } from "../helpers/requests/forum"
import { useAuth } from "../helpers/context/User"
import { User } from "@prisma/client"
export interface IItemTableProps {
    title: string
    members: User[]
    capacity: number
    id: string
    owner: string
    createdAt: string
    status: boolean
}

interface IItemTablePropsUpdate extends IItemTableProps {
    toggle: () => void
}

export const SelectableItemTable = (
    { title, members, capacity, id, owner, status, createdAt }: IItemTableProps
) => {
    const { toggle, isShowing } = useModal()
    const { toggle: toggleDelete, isShowing: isShowingDelete } = useModal()
    const { user, token } = useAuth()

    const handleStatus = () => {
        if (!token) return;
        updateChannel({ open: !status }, token, id);
    }

    const handleRemove = () => {
        if (!token) return;
        deleteChannel(id, token)
            .then(res => res.json())
            .then(() => toggleDelete())
    }

    return (
        <Fragment>
            <div
                className="w-full p-3 rounded-lg shadow-lg hover:shadow-xl flex justify-between items-center bg-white text-black"
                key={id}
            >
                <div className="w-fit">{title}</div>
                <div className="space-x-20 flex justify-evenly items-center w-2/3">
                    <div className="w-fit min-w-[7rem]">{members.length}/{capacity}</div>
                    <div className="w-fit min-w-[7rem]">{owner}</div>
                    <div className="w-fit min-w-[7rem]">{createdAt}</div>
                    <div className="w-fit min-w-[7rem]">{status
                        ? (
                            <span className="text-green-500">Active</span>
                        ) :
                        (
                            <span className="text-red-500">Fermé</span>
                        )}
                    </div>
                    <div className="flex min-w-[7rem] items-center space-x-3">
                        <div className="w-fit p-2 rounded-lg shadow-md cursor-pointer" onClick={handleStatus}>
                            {status ? (
                                <AiOutlineEye className="hover:text-green-500" />
                            ) : (
                                <AiOutlineEyeInvisible className="hover:text-red-500" />
                            )}
                        </div>
                        <div className="w-fit p-2 rounded-lg shadow-md cursor-pointer" onClick={toggle}>
                            <BiEdit className="hover:text-blue-500" />
                        </div>
                        <div className="w-fit p-2 rounded-lg shadow-md cursor-pointer" onClick={toggleDelete}>
                            <MdDeleteForever className="hover:text-red-500" />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isShowing={isShowing}
                toggle={toggle}
                title={'Modification du cannal'}
                content={
                    <HandleFormUpdate
                        title={title}
                        members={members}
                        capacity={capacity}
                        id={id}
                        owner={user?.firstName + ' ' + user?.lastName}
                        status={status}
                        createdAt={createdAt}
                        toggle={toggle}
                    />
                }
            />
            <Modal
                isShowing={isShowingDelete}
                toggle={toggleDelete}
                title={`Suppression du cannal`}
                text='Êtes-vous sur de vouloir supprimer ce cannal de discution ?'
                yesNo
                yesNoAction={
                    [{
                        text: "Supprimer",
                        action: handleRemove,
                        type: 'yes'
                    },
                    {
                        text: "Annuler",
                        action: toggleDelete,
                        type: 'no'
                    }]
                }
            />
        </Fragment>
    )
}

export const HandleFormUpdate = ({ title, capacity, owner, id, toggle }: IItemTablePropsUpdate) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { token, user } = useAuth()

    const onSubmit = (data: any) => {
        if (token) {
            if (data.capacity) {
                data.capacity = parseInt(data.capacity)
            }
            updateChannel(data, token, id)
        }
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toggle();
        handleSubmit(onSubmit)();
    }
    return (
        <form onSubmit={handleFormSubmit} className='text-black'>
            <div className='flex flex-col'>
                <input type='text' {...register('title', { required: true })} placeholder='Prénom' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' defaultValue={title} />
                {errors.firstname && <span>This field is required</span>}
            </div>
            <div className='flex flex-col'>
                <input type='number' {...register('capacity', { required: true })} placeholder='Capacité' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' defaultValue={capacity} />
                {errors.lastname && <span>This field is required</span>}
            </div>
            <div className='hidden'>
                <input type='text' placeholder='Propriétaire' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' defaultValue={owner} />
                {errors.email && <span>This field is required</span>}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600  text-base font-medium text-white hover:bg-green-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">Enregister</button>
                <button type="button" onClick={() => toggle()} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white  text-base font-medium text-gray-700 hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Annuler</button>
            </div>
        </form>
    )
}