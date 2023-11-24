import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { POST_API_URL } from '../../config';
import { AuthContext } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { NavLink } from 'react-router-dom';
import Error from '../ErrorPages/Error';

function Posts() {
    const [blogs, setBlogs] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(POST_API_URL, {
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
                toast.error('Error fetching posts: ' + error.message);
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
                                <div key={blog._id} className="flex flex-col gap-4">
                                    <NavLink to={`/post/${blog.slug}`}>
                                        <img
                                            src={blog.featuredImage}
                                            width={1200}
                                            height={630}
                                            alt={blog.title}
                                            className="aspect-video w-full rounded-xl border border-white object-cover shadow-solid transition-transform hover:-translate-y-2 hover:-rotate-1 hover:scale-105"
                                        />
                                        <h3 className="mt-4 font-display text-lg font-bold leading-6 text-black lg:mt-0 lg:text-xl">
                                            {blog.title}
                                        </h3>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Error title="You haven't created any posts" btnTitle="Create a Post" />
                    )}
                </div>
            )}
        </>

    );
}

export default Posts;
