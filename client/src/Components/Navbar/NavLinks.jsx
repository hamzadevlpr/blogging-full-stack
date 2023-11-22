import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

function NavLinks() {
    const { open } = useContext(AuthContext)
    return (
        <>
            <NavLink
                className="py-2 px-5 poppins-font font-medium text-sm sm:rounded hover:bg-gray-400 w-full"
                to="/blogs"
            >Blogs </NavLink>
            <NavLink
                className="py-2 px-5 poppins-font font-medium text-sm sm:rounded hover:bg-gray-400 w-full"
                to="/profile"
            >Updates </NavLink>
            <NavLink
                className="py-2 px-5 poppins-font font-medium text-sm sm:rounded hover:bg-gray-400 w-full"
                to="/contact"
            >Contact </NavLink>
            <NavLink
                className="py-2 px-5 poppins-font font-medium text-sm sm:rounded hover:bg-gray-400 w-full"
                to="/profile"
            >Profile </NavLink>
        </>
    )
}

export default NavLinks