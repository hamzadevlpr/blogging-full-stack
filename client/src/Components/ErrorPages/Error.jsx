import React from 'react';
import { useNavigate } from 'react-router-dom';

function Error(props) {
    const navigate = useNavigate();

    const isPostPage = location.pathname.startsWith('/post');

    const handleButtonClick = () => {
        if (isPostPage) {
            navigate('/post/add');
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
                <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                            <span className="sr-only">Error</span>404
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">{props.title}</p>
                        <p className="mt-4 mb-8 dark:text-gray-400">
                            But don't worry, you can find plenty of other things on our homepage.
                        </p>
                        <button
                            onClick={handleButtonClick}
                            className="w-full items-center justify-center rounded-xl border-2 border-black bg-black px-6 py-3 text-center font-medium text-white duration-200 hover:border-black hover:bg-transparent hover:text-black focus:outline-none focus-visible:outline-black focus-visible:ring-black lg:w-auto"
                        >
                            {props.btnTitle}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Error;
