import React from "react";
import {
    AiFillGithub,
    AiOutlineTwitter,
    AiFillFacebook,
    AiFillInstagram,
} from "react-icons/ai";
import { FaTelegramPlane} from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="py-8" id="contact">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="flex items-center justify-between flex-col md:flex-row">
                    <div>
                        <h2 className="md:text-7x1 text-4xl font-bold mb-10 text-white/50">
                            Get in <span className="text-gray-400">touch</span>
                        </h2>
                        <a
                            className="md:text-7xl font-semibold text-white underline decoration-gray-400 decoration-2 underline-offset-4 hover:decoration-gray-200 transition duration-300"
                            href="mailto:evolvetech8@gmail.com"
                        >
                            evolvetech8@gmail.com
                        </a>
                    </div>
                    <div className="text-white/50 mt-12">
                        <div className="mb-8">
                            <p className="text-lg mb-1">Phone</p>
                            <a 
                                href="+840353600900"
                                className="text-2xl font-semibold underline decoration-gray-400 decoration-2 underline-offset-4 hover:decoration-gray-400 transition duration-300"
                                >
                                    +84 (0) 353 600 900
                                </a>
                        </div>

                        <div className="text-lg mb-8">
                            <p className="font-bold">Office</p>
                            <p>Street 51</p>
                            <p>Sai Gon</p>
                            <p>VietNam</p>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 text-center mt-8 py-12">
                        <h1 className="hidden md:block text-[10rem] md:text-[12rem] lg:text-[15rem] font-bold text-white opacity-10">
                            Frankie T
                        </h1>
                        <h1 className="md:hidden relative text-9xl md:text-[12rem] lg:text-[15rem] font-bold text-white opacity-10">
                            Frankie 
                            <br />
                            T
                        </h1>
                    </div>
                    <div className="relative mt-12 container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
                        <p className="text-gray-200 caption text-n-4 lg:block">
                        @ 2024. All rights reserved.
                        </p> 
                        <ul className="flex gap-5 flex-wrap">
                            <a
                                href="https://github.com"
                                aria-label="GitHub"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rouned-full">
                                <AiFillGithub size={30} />
                            </a>
                            <a
                                href="https://x.com"
                                aria-label="X (Twitter"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rouned-full">
                                <AiOutlineTwitter size={30} />
                            </a>
                            <a
                                href="https://facebook.com"
                                aria-label="Facebook"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rouned-full">
                                <AiFillFacebook size={30} />
                            </a><a
                                href="https://instagram.com"
                                aria-label="Instagram"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rouned-full">
                                <AiFillInstagram size={30} />
                            </a><a
                                href="https://telegram.org"
                                aria-label="Telegram"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rouned-full">
                                <FaTelegramPlane size={30} />
                            </a>
                        
                        </ul> 
                    </div>
                </div>    
        </footer>
    );
};