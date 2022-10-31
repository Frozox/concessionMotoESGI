import { useRouter } from "next/router";
import React from "react"
import { useForm } from "react-hook-form";

export const Login = ({ modalToggle }: { modalToggle: () => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [formError, setFormError] = React.useState('');
    const router = useRouter()
    const onSubmit = (data: any) => {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    localStorage.setItem('token', data.token)
                    router.push('/')
                    modalToggle()
                })
            } else {
                setFormError('Votre identifiant ou mot de passe est incorrect')
            }
        })
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(onSubmit)()
    }
    return (
        <div className="w-full h-full flex justify-center items-center">
            <form className="w-full flex flex-col justify-center items-center" onClick={handleFormSubmit}>
                <input
                    type="text"
                    {...register("email", { required: true })}
                    placeholder="Email"
                    className="w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black"
                />
                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Mot de passe"
                    className="w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none text-black"
                />
                {formError && <p className="text-sm text-red-500">Identifiant ou mot de passe incorrect</p>}
                <button className="w-full h-10 my-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md">Connexion</button>
            </form>
        </div>
    )
}
