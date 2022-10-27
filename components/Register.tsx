import { useForm } from 'react-hook-form'

export const Register = () => {
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
        <form onSubmit={handleFormSubmit}>
            <div className='flex flex-col'>
                <input type='text' {...register('firstname', { required: true })} placeholder='Prénom' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' />
                {errors.firstname && <span>This field is required</span>}
            </div>
            <div className='flex flex-col'>
                <input type='text' {...register('lastname', { required: true })} placeholder='Nom' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' />
                {errors.lastname && <span>This field is required</span>}
            </div>
            <div className='flex flex-col'>
                <input type='text' {...register('email', { required: true })} placeholder='Email' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' />
                {errors.email && <span>This field is required</span>}
            </div>
            <div className='flex flex-col'>
                <input type='password' {...register('password', { required: true })} placeholder='Mot de passe' className='w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none' />
                {errors.password && <span>This field is required</span>}
            </div>
            <button className='w-full h-10 my-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md justify-center items-center flex cursor-pointer'>
                S'incrire
            </button>
        </form>
    )
}