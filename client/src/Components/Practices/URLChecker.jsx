import React, { useState } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';

const App = () => {
    const [url, setUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkUrlValidity = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:4050/check-url?url=${url}`);
            const { isValid } = response.data;
            setIsUrlValid(isValid);
        } catch (error) {
            setIsUrlValid(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">URL Checker</h1>

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Enter URL"
                    className="border p-2 mr-2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={checkUrlValidity}
                    disabled={isLoading}
                >
                    Check URL
                </button>
            </div>

            {url && (
                <div className="text-lg">
                    {isLoading && <ClipLoader color='#000' className='ml-20' size={20} />}
                    {!isLoading && isUrlValid && <p className="text-green-500">URL is live and working!</p>}
                    {!isLoading && !isUrlValid && <p className="text-red-500">URL is not live or not working.</p>}
                </div>
            )}
        </div>
    );
};

export default App;
