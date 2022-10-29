import { Fragment } from "react"
import useModal from "../helpers/hooks/Modal/useModal"
import { Modal } from "./Modal"
import { MdDeleteForever } from 'react-icons/md'
import { BiEdit } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import React from "react"
export interface IItemTableProps {
    title: string
    members: string[]
    capacity: number
    id: string
    owner: { email: string, firstName: string, lastName: string }
    createdAt: string
    status: boolean
}

export const SelectableItemTable = (
    { title, members, capacity, id, owner, status, createdAt }: IItemTableProps
) => {
    const { toggle, isShowing } = useModal()
    const { toggle: toggleDelete, isShowing: isShowingDelete } = useModal()
    const handleStatus = () => {
        console.log('status', !status);
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
                    <div className="w-fit min-w-[7rem]">{owner.firstName} {owner.lastName}</div>
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
                yesNo
                yesNoAction={
                    [{
                        text: "Enregistrer",
                        action: () => console.log("Update"),
                        type: 'yes'
                    },
                    {
                        text: "Annuler",
                        action: toggle,
                        type: 'no'
                    }]
                }
                content={
                    <HandleFormUpdate
                        title={title}
                        members={members}
                        capacity={capacity}
                        id={id}
                        owner={owner}
                        status={status}
                        createdAt={createdAt}
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
                        action: () => console.log("Supprimer"),
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

export const HandleFormUpdate = ({ title, capacity, owner }: IItemTableProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: any) => {
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            <div className='flex flex-col'>
                <input type='text' {...register('owner', { required: true })} placeholder='Propriétaire' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' defaultValue={owner.email} />
                {errors.email && <span>This field is required</span>}
            </div>
        </form>
    )
}