import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import { storage } from '../Auth/firebase';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { POST_API_URL } from '../../config';
import ClipLoader from 'react-spinners/ClipLoader';
import { useParams } from 'react-router-dom';

function EditPost() {
    const [selectedFile, setSelectedFile] = useState(null);
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const watchFile = watch('file');
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const editorRef = useRef(null);
    const [blogs, setBlogs] = useState({});
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const { slug } = useParams();

    useEffect(() => {
        setLoading(true);
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${POST_API_URL}/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.status === 200) {
                    setBlogs(response.data);
                    setValue('title', response.data.title);
                    setValue('slug', response.data.slug);
                    setEditorContent(response.data.content);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts: ', error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [slug, user.token, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setValue('file', file);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const { title, slug, editorContent, file } = data;

        // Check if a new file is selected
        if (file) {
            try {
                // Upload the new file to Firebase Storage
                const storageRef = ref(storage, `images/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                // Update the upload progress
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                // Wait for the upload to complete
                await uploadTask;

                // Get the download URL of the uploaded file
                const downloadURL = await getDownloadURL(storageRef);

                // Update the featuredImage in the blogs state
                setBlogs((prevBlogs) => ({
                    ...prevBlogs,
                    featuredImage: downloadURL,
                }));
            } catch (error) {
                console.error('Error uploading image: ', error.message);
                setLoading(false);
                return;
            }
        }

        // Additional logic for submitting the form and updating the post
        try {
            const updatedPost = {
                title,
                slug,
                content: editorContent,
                featuredImage: blogs.featuredImage,
            };

            // Make an API request to update the post
            const response = await axios.put(`${POST_API_URL}/update/${slug}`, updatedPost, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                toast.success('Post updated successfully');
                setBlogs(response.data);
                setValue('title', response.data.title);
                setValue('slug', response.data.slug);
                setEditorContent(response.data.content);
                // Additional success handling if needed
            } else {
                toast.error('Failed to update post');
                // Additional error handling if needed
            }
        } catch (error) {
            console.error('Error updating post: ', error.message);
            // Handle error as needed
        }

        // Reset the form and loading state
        reset();
        setLoading(false);
    };

    const generateSlug = (input) => {
        return input.toLowerCase().replace(/\s+/g, '-');
    };

    const handleContentChange = (newContent) => {
        setEditorContent(newContent);
    };

    return (
        <div className="max-w-7xl mx-auto p-10">
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <ClipLoader size={60} />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10">
                        <div className="flex gap-4 flex-col">
                            <div>
                                <label htmlFor="title" className="text-base font-medium text-gray-900">
                                    Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="form-inputs"
                                        type="text"
                                        {...register('title', { required: 'Title is required' })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="slug" className="text-base font-medium text-gray-900">
                                    Slug
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="form-inputs"
                                        type="text"
                                        {...register('slug', { required: 'Slug is required' })}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="content" className="text-base font-medium text-gray-900">
                                    Content
                                </label>
                                <div className="mt-2">
                                    <Editor
                                        apiKey='YOUR_TINYMCE_API_KEY'
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | bold italic forecolor | ' +
                                                'alignleft aligncenter alignright alignjustify | ' +
                                                'bullist numlist outdent indent | removeformat | help',
                                            content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }'
                                        }}
                                        value={editorContent}
                                        onChange={(e) => handleContentChange(e.target.getContent())}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 flex-col">
                            <div>
                                <label htmlFor="file" className="text-base font-medium text-gray-900">
                                    Featured Image
                                </label>

                                <div className="mt-2">
                                    <div className="flex items-center justify-center">
                                        <div className="mx-auto w-full bg-white">
                                            <div className="mb-5">
                                                {blogs.featuredImage && (
                                                    <div className="mb-5">
                                                        {watchFile && (
                                                            <input type="file" name="file" id="file" className="sr-only" onChange={handleFileChange} />
                                                        )}
                                                        <label
                                                            htmlFor="file"
                                                            className={`${watchFile ? 'hidden' : 'cursor-pointer'} relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-gray-400 p-12 text-center`}
                                                            title='Only one image allowed'
                                                        >
                                                            <div>
                                                                <span className="mb-2 block text-xl font-semibold text-[#07074D]">Drop files here</span>
                                                                <span className="mb-2 block text-base font-medium text-[#6B7280]">Or</span>
                                                                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                                                    Browse
                                                                </span>
                                                            </div>
                                                        </label>
                                                    </div>)}

                                                {watchFile && (
                                                    <div className="flex gap-3 relative">
                                                        <div>
                                                            <img
                                                                src={watchFile ? (URL.createObjectURL(watchFile)) : (blogs.featuredImage)}
                                                                className="object-contain w-full mr-5"
                                                                alt="Selected file"
                                                            />
                                                        </div>
                                                        <button className="absolute right-3 top-3 bg-gray-700 text-white rounded-full p-2" onClick={() => setValue('file', null)}>
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ClipLoader color="#ffffff" loading={loading} size={20} />
                                    ) : (
                                        'Publish'
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            )}
        </div>
    );
}

export default EditPost;
