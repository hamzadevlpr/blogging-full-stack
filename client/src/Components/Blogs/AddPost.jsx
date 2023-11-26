import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import { storage } from '../Auth/firebase';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { POST_API_URL } from '../../config';
import ClipLoader from 'react-spinners/ClipLoader';
import { AuthContext } from '../Context/AuthContext';

function Article() {
    const [selectedFile, setSelectedFile] = useState(null);
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const watchFile = watch('file');
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { user } = useContext(AuthContext);
    const editorRef = useRef(null);

    const onSubmit = async (data) => {

        if (!user) {
            toast.error('Please login to create a post.');
            return;
        }
        setLoading(true);
        try {
            let downloadURL = '';



            if (selectedFile) {
                const storageRef = ref(storage, `postImages/${selectedFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, selectedFile);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setUploadProgress(progress);
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }

                    },
                    (error) => {
                        // Handle unsuccessful uploads
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                        });
                    }
                );

                await uploadTask;

                downloadURL = await getDownloadURL(storageRef);
                const response = await axios.post(`${POST_API_URL}/add`, {
                    title: data.title,
                    slug: data.slug,
                    content: editorContent,
                    featuredImage: downloadURL,
                }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }
                );
                toast.success(response.data.message);
                reset();
            } else if (response.status === 400) {
                toast.error(response.data.error);

            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Error creating post. Please try again.');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setValue('file', file);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setValue('title', newTitle);
        const newSlug = generateSlug(newTitle);
        setValue('slug', newSlug);
    };

    const generateSlug = (input) => {
        return input.toLowerCase().replace(/\s+/g, '-');
    };

    const handleContentChange = (newContent) => {
        setEditorContent(newContent);
    };

    return (
        <div className="max-w-7xl mx-auto p-10">
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
                                    placeholder="Title"
                                    {...register('title', { required: 'Title is required' })}
                                    onChange={handleTitleChange}
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
                                    placeholder="Slug"
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
                                    apiKey='riszckn153vr0fold8pqt389fc3fg05caav5pxxzzrc930sg'
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

                                            {watchFile && (
                                                <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
                                                    <div className="flex gap-3">
                                                        <div>
                                                            <img
                                                                src={(watchFile && URL.createObjectURL(watchFile)) || urlImage}
                                                                className="border w-20 h-20 mr-5"
                                                                alt="Selected file"
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <div className="flex items-center justify-between">
                                                                <span className="truncate text-base font-medium text-[#07074D]">
                                                                    {(watchFile && watchFile.name) || urlImage}
                                                                </span>
                                                                <button className="text-[#07074D]" onClick={() => setValue('file', null)}>
                                                                    <X />
                                                                </button>
                                                            </div>
                                                            <div className="flex justify-center items-center gap-3 mt-5">
                                                                <div className="relative h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                                                                    <div
                                                                        className="absolute left-0 right-0 h-full w-[${uploadProgress}%] rounded-lg bg-[#6A64F1]"
                                                                        style={{ width: `${uploadProgress}%` }}
                                                                    />
                                                                </div>
                                                                <span>{Math.round(uploadProgress)}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

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
            </form >

        </div >

    );
}

export default Article;
