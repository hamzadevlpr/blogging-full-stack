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
        // Additional logic for submitting the form and updating the post
        console.log(data);

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
                <div className="flex justify-center items-center h-screen">
                    <ClipLoader color="#3B82F6" size={150} />
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
                                                <div className="mb-5">
                                                    {!watchFile && (
                                                        <input type="file" name="file" id="file" className="sr-only" onChange={handleFileChange} />
                                                    )}
                                                    <label
                                                        htmlFor="file"
                                                        className={`${watchFile ? 'cursor-not-allowed' : 'cursor-pointer'} relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-gray-400 p-12 text-center`}
                                                        title={`${watchFile ? 'Only one image allowed' : 'Select Featured Image  '}`}
                                                    >
                                                        <div>
                                                            <span className="mb-2 block text-xl font-semibold text-[#07074D]">Drop files here</span>
                                                            <span className="mb-2 block text-base font-medium text-[#6B7280]">Or</span>
                                                            <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                                                Browse
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
                                                    <div className="flex gap-3">
                                                        <div>
                                                            <img
                                                                src={blogs.featuredImage}
                                                                className="object-cover border w-20 h-20 mr-5"
                                                                alt="Selected file"
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <div className="flex items-center justify-between">
                                                                <button className="text-[#07074D]" onClick={() => setValue('file', null)}>
                                                                    <X />
                                                                </button>
                                                            </div>
                                                            <div className="flex justify-center items-center gap-3 mt-5">
                                                                <div className="relative h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                                                                    <div
                                                                        className="absolute left-0 right-0 h-full w-96 rounded-lg bg-[#6A64F1]"
                                                                        style={{
                                                                            width: `${uploadProgress}% `,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span>{Math.round(uploadProgress)}%</span>
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
                                                    {
                                                        loading ? (
                                                            <ClipLoader color="#ffffff" loading={loading} size={20} />
                                                        ) : (
                                                            'Publish'
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

export default EditPost;
