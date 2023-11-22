
import { GanttChart, X, XIcon } from 'lucide-react'
import UserProfile from './ProfileDown';
import NavLinks from './NavLinks';
import logo from '../../assets/logo.svg'
import { useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const { setUser, user, open, setOpen } = useContext(AuthContext);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, [setUser]);


    const handleOpen = () => {
        setOpen((prev) => !prev)
    }
    const closeNavbarOnSmallDevices = () => {
        if (window.innerWidth <= 768) {
            setOpen(false);
        }
    };

    // Add an event listener to window resize
    window.addEventListener('resize', closeNavbarOnSmallDevices);

    return (
        <div className="bg-white sticky top-0 z-10">
            <hr />
            <div className="mx-auto px-8 sm:px-20 border">
                <div className="relative flex h-16 items-center justify-between">

                    <NavLink to="/" className="inline-flex items-center gap-3 text-black lg:pr-8">
                        <img src={logo} alt="AstroSaas" className="h-8 w-8" />
                        <span className="font-display text-lg font-extrabold tracking-wide">
                            Blogs
                        </span>
                    </NavLink>


                    <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                        <nav className={`${open
                            ? 'flex flex-col absolute w-full border top-16 -right-0 shadow-md bg-white'
                            : 'mx-5 hidden flex-col items-center md:flex md:flex-row'
                            }`}
                        >
                            <NavLinks />
                        </nav>

                        {
                            user
                                ?
                                <UserProfile />
                                :
                                <NavLink to={'/login'} title='Login to Create Amazing Blogs' className="w-full items-center justify-center rounded-xl border-2 border-black bg-black px-6 py-1 text-center font-medium text-white duration-200 hover:border-black hover:bg-transparent hover:text-black focus:outline-none focus-visible:outline-black focus-visible:ring-black lg:w-auto">
                                    Get Started
                                </NavLink>
                        }
                        <button
                            type="button"
                            onClick={handleOpen}
                            className="inline-flex items-center justify-center pl-5 text-gray-800 hover:text-black focus:text-black focus:outline-none md:hidden"
                        >
                            {open ? <XIcon /> : <GanttChart />}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}