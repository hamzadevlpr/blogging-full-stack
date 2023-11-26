import { Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, UserIcon, SettingsIcon, PlusIcon, LogOut, ChevronDownIcon, ChevronUpIcon, FileText } from 'lucide-react';
import { AuthContext } from '../Context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ProfileDropDown() {
    const { userImage } = useContext(AuthContext);
    const [user, setUserState] = useState(JSON.parse(localStorage.getItem('user')) || {});


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        setUserState(userData);
    }, [setUserState]);

    const navigate = useNavigate();
    const logOut = () => {
        navigate('/')
        window.location.reload();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserState(null);
        // setLogin(false);
    };

    return (
        <>
            {/* Profile dropdown */}
            <button
                type="button"
                className="relative rounded-full p-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
            </button>

            <Menu as="div" className="relative ml-3">
                <div className='flex justify-center items-center'>
                    <Menu.Button className="relative flex rounded-full text-sm">
                        <span className="absolute -inset-1.5" />
                        <img className="h-8 w-8 rounded-full object-cover" src={user.photo || userImage} alt="" />
                    </Menu.Button>

                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute -right-10 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                            {({ active }) => (
                                <NavLink
                                    to={`/profile/${user && user._id}`}
                                    className={classNames(active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex gap-5 items-center')}
                                >
                                    <UserIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                                    {user && user?.fullName}
                                </NavLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <NavLink to="/post/add"
                                    className={classNames(active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex gap-5 items-center')}
                                >
                                    <PlusIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                                    Create a blog
                                </NavLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <NavLink to="/posts"
                                    className={classNames(active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex gap-5 items-center')}
                                >
                                    <FileText className="ml-2 h-4 w-4" aria-hidden="true" />
                                    My Posts
                                </NavLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <NavLink
                                    className={classNames(active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex gap-5 items-center')}
                                >
                                    <SettingsIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                                    Settings
                                </NavLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <NavLink
                                    className={classNames(active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex gap-5 items-center')}
                                    onClick={logOut}
                                >
                                    <LogOut className="ml-2 h-4 w-4" aria-hidden="true" />
                                    Sign out
                                </NavLink>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}
