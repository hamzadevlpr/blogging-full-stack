import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { POST_API_URL } from '../../config';
import { AuthContext } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { NavLink } from 'react-router-dom';
import Error from '../ErrorPages/Error';
import { Pen, Trash2 } from 'lucide-react';

function Posts() {
    const [blogs, setBlogs] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${POST_API_URL}/myposts`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                // Axios automatically parses the JSON response
                if (response.status === 200) {
                    setBlogs(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.log('Error fetching posts: ' + error.message);
                setLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    return (
        <>
            {loading ? (
                <div className="h-screen flex justify-center items-center border">
                    <ClipLoader loading={loading} size={60} />
                </div>
            ) : (
                <div className="mx-auto max-w-6xl pt-12 sm:px-0 px-12">
                    {blogs.length > 0 ? (
                        <div className="mx-auto grid w-full sm:px-10 grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16 sm:grid-cols-2">
                            {blogs.map((blog) => (
                                <div className="flex flex-col gap-4 justify-between" key={blog._id}>
                                    <NavLink to={blog.slug}>
                                        <img
                                            src={blog.featuredImage}
                                            width={1200}
                                            height={630}
                                            alt="Featured image for Create Razor UI Landing Page using Tailwind CSS"
                                            className="aspect-video w-full rounded-xl border border-white object-cover shadow-solid transition-transform hover:-translate-y-2 hover:-rotate-1 hover:scale-105"
                                        />
                                    </NavLink>
                                    <NavLink to={blog.slug}>
                                        <h3 className="line-clamp-2 mt-4 font-display text-lg font-bold leading-6 text-black lg:mt-0 lg:text-xl">
                                            {blog.title}
                                        </h3>
                                    </NavLink>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {blog.user_id === user._id && (
                                            <div className="flex flex-wrap items-center gap-2">
                                                <NavLink
                                                    to={`/blog/edit/${blog.slug}`}
                                                    className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-0.5 text-[13px] font-medium text-gray-800 transition-colors hover:bg-green-200"
                                                >
                                                    <Pen size={10} /> <span>Edit</span>
                                                </NavLink>
                                                <NavLink
                                                    to={`/post/delete/${blog._id}`}
                                                    className="inline-flex items-center gap-3 rounded-full bg-red-100 px-3 py-0.5 text-[13px] font-medium text-gray-800 transition-colors hover:bg-red-200"
                                                >
                                                    <Trash2 size={10} /> <span>Delete</span>
                                                </NavLink>
                                            </div>
                                        )}
                                        {/* // fetch user photo and name */}

                                    </div>
                                    {/* // fetch user photo and name */}
                                    < div >
                                        <NavLink to={`/profile/${blog.user_id}`} className='flex items-center gap-3'>
                                            <img
                                                src={blog.user.photo}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-gray-500 text-sm">{blog.user.name}</span>
                                        </NavLink>
                                    </div>

                                </div>
                            ))}
                        </div >
                    ) : (
                        <Error title="You haven't created any posts" btnTitle="Create a Post" />
                    )
                    }
                </div >
            )}
        </>

    );
}

export default Posts;
