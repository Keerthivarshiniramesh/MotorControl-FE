import React from 'react'
import { useState, useContext } from 'react';
import { DContext } from '../Providers';
import logo from '../assests/logo.png'

const Register = () => {

    const { setIsAuth, BeURL } = useContext(DContext)

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [comparePassword, setComparePassword] = useState(true)

    const handleRegister = async () => {

        setComparePassword(password === confirmPassword)

        if (name !== "" || email !== "" || contact !== "" || password !== "") {
            if (password === confirmPassword) {
                fetch(`${BeURL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({ fullname: name, email, contact, password }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Signup successful
                            setIsAuth(true)

                            setName('')
                            setEmail('')
                            setContact('')
                            setPassword('')
                            setConfirmPassword('')
                            window.location.href = "/home"
                        } else {
                            alert(data.message)
                        }
                    })
                    .catch(err => {
                        alert('Trouble in connecting to the Server! Please try again later.')
                        console.log('Error in Register: ' + err)
                    })

            } else {
                alert('passwords not match!')
            }
        }
        else {
            alert("All fields are required!")
        }

    }


    return (
        <div className="flex flex-col md:flex-row justify-center items-center px-4 py-6 min-h-screen bg-gradient-to-br from-purple-300 via-red-400 to-orange-50">
            {/* Left Section - Logo & Welcome Text */}
            <div className="text-center md:text-left p-4 md:w-5/12">
                <img
                    className="mx-auto md:mx-0"
                    src={logo}
                    alt="register-illus"
                    style={{ height: "150px" }}
                />
                <h1 className="text-2xl md:text-3xl font-bold text-primary-500 my-3">
                    Create an Account!
                </h1>
                <p className="text-sm md:text-base text-slate-600">
                    <small>
                        Enter all the required details and verify your Email for creating a
                        new Account.
                    </small>
                </p>
            </div>

            {/* Right Section - Register Form */}
            <div className="bg-white text-slate-950 p-6 mt-6 md:mt-0 md:ml-6 w-full md:w-5/12 rounded-md border border-primary-500 shadow-md">
                <h2 className="text-center text-primary-500 font-bold text-xl mb-4">
                    Register
                </h2>
                <p className="text-center mb-4 text-sm">
                    Already have an account?{" "}
                    <a className="text-sky-600 hover:underline" href="/">
                        Click here
                    </a>
                </p>
                <form>
                    <div className="mb-4">
                        <label htmlFor="InputName" className="block text-sm font-medium text-gray-900">
                            Full Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            type="text"
                            id="InputName"
                            placeholder="Name"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="InputContact" className="block text-sm font-medium text-gray-900">
                            Contact
                        </label>
                        <input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            type="tel"
                            id="InputContact"
                            placeholder="+91 9876543210"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="InputEmail" className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            id="InputEmail"
                            placeholder="name@example.com"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="InputPassword" className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            id="InputPassword"
                            placeholder="••••••••"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="InputConfirmPassword" className="block text-sm font-medium text-gray-900">
                            Confirm Password
                        </label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            type="password"
                            id="InputConfirmPassword"
                            placeholder="••••••••"
                            className="p-2 border border-slate-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                    </div>
                    {!comparePassword && (
                        <p className="text-red-600 text-sm mb-3">Passwords do not match</p>
                    )}
                    <div className="text-center">
                        <button
                            onClick={handleRegister}
                            type="button"
                            className="rounded-full px-6 py-2 bg-primary-500 hover:bg-secondary-600 text-white text-md transition"
                        >
                            Register <i className="bi bi-door-open ml-2"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Register