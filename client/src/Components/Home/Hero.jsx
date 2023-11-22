import React from 'react'

function Hero() {
    return (
        <>
            <div className="mx-auto w-full max-w-6xl items-center px-8 md:px-12 lg:px-16">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="max-w-2xl pt-12 md:w-1/2 lg:py-4 lg:pt-32">
                        <div className="text-center md:text-left">
                            <h1 className="font-display text-3xl font-extrabold text-black lg:text-5xl xl:text-6xl">
                                Create stunning websites with Tailwind CSS
                            </h1>
                            <p className="mt-4 max-w-2xl text-lg tracking-tight text-gray-500">
                                Learn how to create stunning landing pages and dashboards using
                                Tailwind with our fast-paced, easy-to-follow video collection. Start
                                building professional-quality websites today.
                            </p>
                        </div>
                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <a
                                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-black bg-black px-6 py-3 text-center font-medium text-white duration-200 hover:border-black hover:bg-transparent hover:text-black focus:outline-none focus-visible:outline-black focus-visible:ring-black lg:w-auto"
                                href="#blog"
                            >
                                Browse now
                            </a>
                        </div>
                    </div>
                    <div className="-mx-16 max-w-4xl pt-12 md:mx-0 md:w-1/2 lg:pt-24">
                        <img alt="hero" className="mx-auto sm:w-full w-[26rem]" src="https://www.tailwindcollections.com/img/hero.webp" />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Hero