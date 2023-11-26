import { ArrowRight } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import CoverPage from './CoverPage'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { USER_API_URL } from '../../config'
import { setLogLevel } from 'firebase/app';

export function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (fullName === "" || email === "" || password === "") {
            toast.error("Fields Can't be Empty");
        } else {
            try {
                const response = await axios.post(`${USER_API_URL}/signup`, {
                    fullName: fullName,
                    email: email,
                    password: password
                });
                toast.success(response.data.message);
                navigate('/login');
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401) {
                        toast.error("Email already exists");
                    } else if (err.response.status === 500) {
                        toast.error("Internal Server Error");
                    } else {
                        toast.error(`Error: ${err.response.data.error}`);
                    }
                } else if (err.request) {
                    toast.error("No response received from the server");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error(`Error: ${err.message}`);
                }
            }
        }
    };

    return (
        <>

            <section className='relative'>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* left side */}
                    <CoverPage />
                    {/* right side */}
                    <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24 min-h-screen">
                        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign Up</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Already have an account?{' '}
                                <NavLink
                                    to="/login"
                                    title=""
                                    className="account-link font-semibold text-black transition-all duration-200 hover:underline"
                                >
                                    Get into your account
                                </NavLink>
                            </p>
                            <form onSubmit={handleRegister} className="mt-8">
                                <div className="space-y-5">
                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900">
                                            Full Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="form-inputs"
                                                type="text"
                                                placeholder="Full Name"
                                                onChange={(e) => setFullName(e.target.value)}
                                            ></input>
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="form-inputs"
                                                type="email"
                                                placeholder="Email"
                                                onChange={(e) => setEmail(e.target.value)}
                                            ></input>
                                        </div>
                                    </div>
                                    {/* Password */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="" className="text-base font-medium text-gray-900">
                                                Password
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                className="form-inputs"
                                                type="password"
                                                placeholder="Password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            ></input>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="my-3 text-xs text-gray-600 text-center">
                                            You have agreed our Terms and Condition .
                                        </p>
                                        <button
                                            type="submit"
                                            className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                        >
                                            Get started <ArrowRight className="ml-2" size={16} />
                                        </button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}
