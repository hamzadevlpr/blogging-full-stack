import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import { POST_API_URL } from '../../config';
import Authar from './Authar';
import Newsletter from './Newslatter';
import ClipLoader from 'react-spinners/ClipLoader';
import Comments from './Comments';
``

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`${POST_API_URL}/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }); // Replace with your actual API endpoint
                if (response.status === 200) {
                    setPost(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching post details:', error.message);
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [slug]);

    if (!post) {
        return <div className="h-screen flex justify-center items-center border">
            <ClipLoader loading={loading} size={60} />
        </div>
    }

    return (
        <>
            <div className="container w-full md:max-w-6xl mx-auto pt-20 px-10">
                <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
                    {/* Title */}
                    <div className="font-sans">
                        <p className="text-base md:text-sm text-gray-500 font-bold">
                            &lt;{" "}
                            <NavLink
                                to="/blogs"
                                className="text-base md:text-sm text-gray-500 font-bold no-underline hover:underline"
                            >
                                BACK TO BLOG
                            </NavLink>
                        </p>
                        <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">
                            {post.title}
                        </h1>
                        <p className="text-sm md:text-base font-medium text-gray-600">
                            Published at {post.formattedCreatedAt}
                        </p>
                    </div>
                    {/* Post image */}
                    <div className="py-10">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full  object-contain rounded-lg border-gray-200"
                        />
                    </div>
                    {/* Post image */}

                    {/* Post Content */}
                    <div className="py-6 text-md">
                        {parse(post.content)}
                    </div>
                    {/* Post Content */}
                </div>

                {/* Author */}
                <hr className="border-b-2 border-gray-400 mx-4" />
                <Authar
                    avatarSrc={post.user.photo}
                    authorName={post.user.name}
                    authorDescription={post.user._id}
                    readMoreOnClick={() => { }}
                />
                <hr className="border-b-2 border-gray-400 mx-4" />
                {/* Author */}
                <Comments post={post} user_id={post.user._id} />
                {/* Subscribe */}
                <Newsletter />
            </div>
        </>
    );
};

export default PostDetail;
