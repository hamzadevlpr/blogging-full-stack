import { SearchIcon } from 'lucide-react'
import React from 'react'

function SearchButton() {
    return (
        <div className="-left-8  pt-2 relative mx-auto text-gray-600">
            <input
                className="sm:w-[26rem] w-72 border-2 border-gray-300 bg-white h-10 px-5  rounded-lg text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Search Products. . . "
            />
            <button type="submit" className="absolute right-0 -top-1 mt-5 mr-4">
                <SearchIcon />
            </button>
        </div>

    )
}

export default SearchButton