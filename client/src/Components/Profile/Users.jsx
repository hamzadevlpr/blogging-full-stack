import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SendHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { storage } from '../Auth/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ClipLoader from 'react-spinners/ClipLoader';

import { USER_API_URL } from '../../config';
import { AuthContext } from '../Context/AuthContext';

const Users = () => {
    const { userImage, setUser } = useContext(AuthContext);
    const [user, setUserState] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [selectedFile, setSelectedFile] = useState(null);
    const [photo, setPhoto] = useState(user?.photo || '' || userImage);
    const inputRef = useRef(null);
    const [email, setEmail] = useState(user?.email || '');
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

    useEffect(() => {
        // Fetch user data from local storage or wherever it is stored
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        setUserState(userData);
        setUser(userData);
        // if (selectedFile) {
        //     URL.revokeObjectURL(URL.createObjectURL(selectedFile));
        // }
    }, []); // Empty dependency array to run this effect once on mount

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setIsPhotoUploaded(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let downloadURL = '';

            if (selectedFile) {
                const storageRef = ref(storage, `images/${selectedFile.name}`);
                await uploadBytes(storageRef, selectedFile);
                downloadURL = await getDownloadURL(storageRef);
                setPhoto(downloadURL);
                setIsPhotoUploaded(true);
            }

            const response = await axios.put(`${USER_API_URL}/${userId}`, {
                fullName: fullName,
                email: email,
                photo: downloadURL || user.photo || '',
            });

            setUserState(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            toast.success('User updated successfully!');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error updating user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {
                user ?
                    <div className="p-6 flex items-center justify-center mt-20">
                        <div className="container max-w-screen-lg mx-auto border py-20 shadow-md">
                            <form className="mt-10 px-10" onSubmit={handleSubmit}>
                                <div className="flex justify-center items-center relative -top-20">
                                    <img
                                        className="bg-white shadow-lg absolute border w-40 h-40 rounded-full object-contain"
                                        src={selectedFile ? URL.createObjectURL(selectedFile) : photo}
                                        alt="User"
                                    />
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleChange}
                                        ref={inputRef}
                                        accept=".jpg, .jpeg, .png"
                                    />
                                    <button
                                        type="button"
                                        className="relative top-28 px-4 py-1.5 bg-white border border-gray-300 rounded-md"
                                        onClick={() => inputRef.current.click()}
                                    >
                                        {isPhotoUploaded ?
                                            'Change Photo' :
                                            selectedFile ? selectedFile.name : 'Change Photo'}
                                    </button>
                                </div>
                                <div className="mt-10 space-y-5">
                                    <div className="flex flex-col gap-5 sm:flex sm:flex-row">
                                        {/* Full Name */}
                                        <div className="w-full">
                                            <label htmlFor="" className="text-base font-medium text-gray-900">
                                                Full Name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    className="form-inputs"
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {/* Email */}
                                        <div className="w-full">
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="" className="text-base font-medium text-gray-900">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    className="form-inputs"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ClipLoader color="white" size={24} />
                                        ) : (
                                            <>
                                                Update Profile
                                                <SendHorizontal className="ml-2" size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div> : 'User is not Logged in'
            }
        </>
    );
};

export default Users;
