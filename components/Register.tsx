import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form'
import { useAlert } from '../helpers/hooks/Alert/useAlert';
import useModal from '../helpers/hooks/Modal/useModal';
import { registerRequest } from '../helpers/requests/authentication';
import { AlertPopHover } from './AlertPopHover';

export const Register = ({ modalToggle }: { modalToggle: () => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { showAlert, toggleAlert } = useAlert()
    const [formError, setFormError] = React.useState('');
    const onSubmit = (data: any) => {
        registerRequest(data).then(res => {
            if (res.ok) {
                toggleAlert()
                setTimeout(() => {
                    modalToggle()
                }, 2000)
            } else {
                setFormError('Something went wrong')
            }
        })
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(onSubmit)()
    }

    return (
        <Fragment>
            <div className='absolute top-5 right-10'>
                <AlertPopHover
                    alert={{ type: 'alert-success', message: 'Votre Compte à bien été crée !' }}
                    showAlert={showAlert}
                    toggleAlert={toggleAlert}
                />
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className='flex flex-col'>
                    <input type='text' {...register('firstName', { required: true })} placeholder='Prénom' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                    {errors.firstname && <span>This field is required</span>}
                </div>
                <div className='flex flex-col'>
                    <input type='text' {...register('lastName', { required: true })} placeholder='Nom' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                    {errors.lastname && <span>This field is required</span>}
                </div>
                <div className='flex flex-col'>
                    <input type='text' {...register('email', { required: true })} placeholder='Email' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                    {errors.email && <span>This field is required</span>}
                </div>
                <div className='flex flex-col'>
                    <input type='password' {...register('password', { required: true })} placeholder='Mot de passe' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black' />
                    {errors.password && <span>This field is required</span>}
                </div>
                {formError && <p className='text-red-500'>{formError}</p>}
                <button className='w-full h-10 my-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md justify-center items-center flex cursor-pointer'>
                    S&apos;incrire
                </button>
            </form>
        </Fragment>
    )
}