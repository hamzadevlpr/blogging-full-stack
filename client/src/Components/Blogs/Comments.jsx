import React, { useContext, useState } from 'react';
import { COMMENTS_API_URL } from '../../config';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

function Comments({ post, user_id }) {
    const { user } = useContext(AuthContext);
    const [commentBody, setcommentBody] = useState('');
    const [comments, setComments] = useState([]);


    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        // Validate the comment, e.g., check if it's not empty
        if (commentBody.trim() === '') {
            // Handle validation error, e.g., show a message
            toast.error('Comment cannot be empty!');
            return;
        }

        // Create a new comment object
        const newComment = {
            user: user_id,
            comment: commentBody,
            post: post.slug
        };

        // Make a POST request to your API
        try {
            const response = await axios.post(COMMENTS_API_URL, newComment, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status !== 201) {
                // Handle non-successful response, e.g., show an error message
                console.error('Failed to submit comment');
                toast.error('Failed to submit comment');
                return;
            }

            // Assuming your API returns the created comment
            const createdComment = response.data.comment; // Adjust this based on your API response structure

            // Update the comments state with the new comment
            setComments([...comments, createdComment]);
            toast.success('Comment submitted successfully!');
            // Clear the textarea after submission
            setcommentBody('');
        } catch (error) {
            // Handle any network or other errors
            console.error('Error submitting comment:', error);
            toast.error('Error submitting comment:', error.message);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center mb-4 max-w-lg">
                <form onSubmit={handleCommentSubmit} className="w-full max-w-xl bg-white rounded-lg pt-2">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
                            Add a new comment
                        </h2>
                        <div className="w-full md:w-full px-3 mb-2 mt-2">
                            <textarea
                                className="bg- rounded-md border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700"
                                name="body"
                                placeholder="Type Your comment here..."
                                required=""
                                value={commentBody}
                                onChange={(e) => setcommentBody(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex items-start md:w-full px-3">
                            <div className="flex items-center w-full text-gray-700 px-2 mr-auto">
                                <p className="text-xs pt-px">Comment as : </p>
                                <p className="text-xs font-medium md:text-sm pt-px">{user.fullName}</p>
                            </div>
                            <div className="-mr-1">
                                <button type='submit' className='bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100'>Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Comments;
