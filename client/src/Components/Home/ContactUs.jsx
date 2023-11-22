import React from 'react'

function ContactUs() {
    return (
        <>
            <div className="mx-auto max-w-6xl items-center px-8 py-24 md:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-7xl items-center rounded-3xl border bg-black p-10 px-8 py-12 md:px-12 lg:px-16">
                    <div className="grid w-full grid-cols-1 items-center justify-between lg:grid-cols-3">
                        <div className="text-center lg:col-span-2 lg:text-left">
                            <p className="font-display text-3xl md:text-4xl font-extrabold text-white">
                                Ready to take your website to the next level?
                            </p>
                            <p className="mt-4 text-lg tracking-tight text-white">
                                Contact us today and let's discuss your goals and how we can help you
                                achieve them!
                            </p>
                        </div>
                        <div className="mt-6 lg:ml-auto lg:mt-0">
                            <a
                                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-white bg-white px-6 py-3 text-center font-medium text-black duration-200 hover:border-white hover:bg-transparent hover:text-white focus:outline-none focus-visible:outline-white focus-visible:ring-white lg:w-auto"
                                href="/contact"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ContactUs