import React from 'react'
import Banner from '../Blogs/Banner'
import ContactUs from './ContactUs'
import Hero from './Hero'

function Home() {
    return (
        <>
            <div className="w-full px-10 sm:p-0">
                <Hero />
                <hr className="mt-6" />
                <Banner />
                <hr className="mt-6" />
                <ContactUs />
            </div>
        </>
    )
}

export default Home