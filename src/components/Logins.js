import React, { useState, useContext } from 'react'
import { DContext } from '../Providers'
import logo from '../assests/logo.png'

const Logins = () => {

    const { setIsAuth, BeURL } = useContext(DContext)

    const [email, setEmail] = useState('')
    const [pwd, setPassword] = useState('')

    const HandleLogin = async (e) => {

        e.preventDefault()

        if (email !== "" && pwd !== "") {
            fetch(`${BeURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email, pwd
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setIsAuth(true)
                        setEmail('')
                        setPassword('')
                        window.location.href = "/home"
                    } else {
                        alert(data.message)
                    }
                })
                .catch(err => {
                    alert('Trouble in connecting to the Server! Please try again later.')
                    console.log('Error in Login:', err)
                })
        }
        else {
            alert("All fields are required!")
        }

    }


    return (
        <div className="flex flex-col md:flex-row h-[100vh] justify-center items-center px-4 py-6  bg-gradient-to-br from-purple-300 via-red-400 to-orange-50">
            {/* Left side - Welcome message */}
            <div className="text-center md:text-left p-4 md:w-5/12">
                <img className="mx-auto md:mx-0" src={logo} alt="signin-illus" style={{ height: '150px' }} />
                <h1 className="text-2xl md:text-3xl font-bold my-4 text-primary-400">Welcome to Motor Control System!</h1>
                <p className="text-sm md:text-base">
                    <small>Enter your registered Email and Password to access your user account.</small>
                </p>
            </div>

            {/* Right side - Login form */}
            <div className="bg-slate-100 text-slate-950 p-6 mt-6 md:mt-0 md:ml-6 w-full md:w-5/12 rounded-md shadow">
                <h2 className="text-center text-primary-400 text-xl mb-4 font-bold">Login</h2>
                <p className="mb-4 text-center">
                    Don't have an account? <a className="text-sky-500 hover:underline" href="/register">Click here</a>
                </p>
                <form onSubmit={HandleLogin}>
                    <div className="mb-4">
                        <label htmlFor="InputEmail" className="block text-sm font-medium text-gray-900">Email address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            id="InputEmail"
                            placeholder="name@mail.com"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="InputPassword" className="block text-sm font-medium text-gray-900">Password</label>
                        <input
                            value={pwd}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            id="InputPassword"
                            placeholder="••••••••"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="rounded-full px-6 py-2 bg-primary-500 hover:bg-secondary-600 text-white text-md transition"
                        >
                            Login <i className="bi bi-box-arrow-in-right ml-2"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Logins