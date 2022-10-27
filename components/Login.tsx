import React from "react"

export const Login = () => {
    const [error, setError] = React.useState<string | null>(null)
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-10 my-2 border border-gray-300 rounded-md p-2 focus:outline-none"
                    required
                />
                {error && <p className="text-sm text-red-500">Identifiant ou mot de passe incorrect</p>}
                <button className="w-full h-10 my-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md">Connexion</button>
            </div>
        </div>
    )
}
