import React, { createContext, useEffect, useState } from "react";
import defaultImage from '../../assets/user.png';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // const [login, setLogin] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState(defaultImage);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ userImage, setUserImage, open, setOpen, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };