import { ArrowRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import CoverPage from './CoverPage';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { USER_API_URL } from '../../config';
import ClipLoader from "react-spinners/ClipLoader";

export function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [password, setPassword] = useState('');


    const handleGoogleSignIn = () => {
        setGoogleLoading(true);
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user)
                navigate('/');
                setGoogleLoading(false);
            })
            .catch((error) => {
                setGoogleLoading(false);
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                // Handle error appropriately
            });
    };

    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (email === "" || password === "") {
            toast.error("Fields Can't be Empty");
            setLoading(false);
        } else {
            try {
                const response = await axios.post(`${USER_API_URL}/login`, {
                    email: email,
                    password: password
                });
                if (response.status === 200) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    localStorage.setItem('token', JSON.stringify(response.data.token));
                    toast.success(response.data.message);
                    setUser(response.data);
                    navigate('/');
                    setLoading(false);
                } else if (response.status === 401) {
                    setLoading(false);
                    toast.error(response.data.error);
                } else {
                    setLoading(false);
                    toast.error("Internal Server Error");
                }
            } catch (err) {
                setLoading(false);
                if (err.response) {
                    if (err.response.status === 401) {
                        toast.error(err.response.data.error);
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
    }



    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* left side */}
                <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24 min-h-screen  overflow-hidden">
                    <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign In</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <NavLink
                                to="/signup"
                                title=""
                                className="font-semibold text-black transition-all duration-200 hover:underline"
                            >
                                Create a free account
                            </NavLink>
                        </p>
                        <form onSubmit={handleLogin} className="mt-8">
                            <div className="space-y-5">
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
                                        <a
                                            href="#"
                                            title=""
                                            className="text-sm font-semibold text-black hover:underline"
                                        > Forgot password?
                                        </a>
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
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                >
                                    {
                                        loading ?
                                            <ClipLoader color='#fff' size={23} /> :
                                            <>Sign in <ArrowRight className="ml-2" size={16} /></>
                                    }
                                </button>
                            </div>
                        </form>

                        <div>
                            <div className="flex items-center my-6 space-x-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <p className="text-sm font-semibold text-gray-400">Or continue with</p>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>
                            <div className="mt-3 space-y-3">
                                <button
                                    type="button"
                                    disabled={true}
                                    onClick={handleGoogleSignIn}
                                    title='Coming Soon'
                                    className="cursor-not-allowed relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
                                >
                                    {
                                        googleLoading ?
                                            <ClipLoader color='#000' size={23} /> :
                                            <>
                                                <span className="mr-2 inline-block">
                                                    <img src="https://img.icons8.com/color/20/000000/google-logo.png" />
                                                </span>
                                                Continue with Google
                                            </>
                                    }

                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                {/* right side */}
                <CoverPage />
            </div>
        </section >
    )
}
