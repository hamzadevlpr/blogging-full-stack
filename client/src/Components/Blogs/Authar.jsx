import React from 'react';

function Authar(props) {
    const { avatarSrc, authorName, authorDescription, readMoreOnClick } = props;

    return (
        <>
            <div className="flex max-w-3xl mx-auto items-center font-sans px-4 py-12">
                <img
                    className="w-20 h-20 rounded-full mr-4"
                    src={avatarSrc}
                    alt="Avatar of Author"
                />
                <div className="flex-1 px-2">
                    <p className="font-bold text-base md:text-xl leading-none mb-2">
                        {authorName}
                    </p>
                    <p className="text-gray-600 text-xs md:text-base">
                        {authorDescription}
                    </p>
                </div>
                <div className="justify-end">
                    <button
                        className="bg-transparent border border-gray-500 hover:border-green-500 text-xs text-gray-500 hover:text-green-500 font-bold py-2 px-4 rounded-full"
                        onClick={readMoreOnClick}
                    >
                        Read More
                    </button>
                </div>
            </div>
        </>
    );
}

export default Authar;
