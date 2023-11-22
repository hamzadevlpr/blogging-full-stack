import { Check } from 'lucide-react'
import React from 'react'

function CoverPage() {
    return (
        <>
            <div className="hidden relative md:flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24 min-h-screen">

                <div className="absolute inset-0">
                    <img
                        className="h-full w-full object-cover object-top"
                        src="https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTk0fHxkZXNpZ25lcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                        alt=""
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="relative">
                    <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
                        <h3 className="text-4xl font-bold text-white">
                            Now you dont have to rely on your designer to create a new page
                        </h3>
                        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                            <li className="flex items-center space-x-3">
                                <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                    <Check className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-lg font-medium text-white"> Commercial License </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                    <Check className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-lg font-medium text-white"> Unlimited Exports </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                    <Check className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-lg font-medium text-white"> 120+ Coded Blocks </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                    <Check className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-lg font-medium text-white"> Design Files Included </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoverPage