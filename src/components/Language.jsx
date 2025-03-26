import { useState } from 'react';
import Logo from "../assets/bannarimage/logo.png";

const Language = () => {
    const [language, setLanguage] = useState('English'); // Default language is English
    const [hoverLanguage, setHoverLanguage] = useState(null); // Track hover state for language

    // Function to handle language change on click
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setHoverLanguage(null); // Reset hover when clicked
    };

    // Handle hover start
    const handleMouseEnter = (lang) => {
        setHoverLanguage(lang);
    };

    // Handle hover end
    const handleMouseLeave = () => {
        setHoverLanguage(null); // Reset hover when mouse leaves
    };

    // Determine what language to show based on hover or clicked state
    const displayLanguage = hoverLanguage || language;

    return (
        <dialog id="language_model" className="modal mt-[-4px] lg:mt-[-160px]">
            <div className="modal-box">
                <form method="dialog">
                    {/* Close button */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <img src={Logo} alt="" className='w-28 mx-auto' />

                {/* Conditional text based on hover or clicked language */}
                <h2 className='text-center my-6'>
                    {displayLanguage === 'English' ? 'Welcome to my Page' : 'Bienvenido a mi página'}
                </h2>

                <div className='flex justify-around '>
                    {/* Language buttons with hover and click effects */}
                    <button
                        className='btn btn-primary px-7 lg:px-20'
                        onClick={() => handleLanguageChange('English')}
                        onMouseEnter={() => handleMouseEnter('English')}
                        onMouseLeave={handleMouseLeave}
                    >
                        English
                    </button>
                    <button
                        className='btn btn-primary px-7 lg:px-20'
                        onClick={() => handleLanguageChange('Español')}
                        onMouseEnter={() => handleMouseEnter('Español')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Español
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default Language;
