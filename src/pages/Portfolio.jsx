import React from "react";
import {motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import proj3 from "../assets/images/proj3.png";
import proj4 from "../assets/images/proj4.png";
import proj5 from "../assets/images/proj5.png";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";

const projects = [
    { 
        title: "Ecommerce Digital Products",
        des:"Losadkasdjalksdjlaskdjlaksdjasdl",
        devstack:"MongoDB, Express, React, Node.js",
        link:"#",
        git:"#",
        src:proj3,
        type:"fullstack",
    },
    { 
        title: "Interactice E-Learning Platform",
        des:"Losadkasdjalksdjlaskdjlaksdjasdl",
        devstack:"NextJs",
        link:"#",
        git:"#",
        src:proj4,
        type:"frontend",
    },
    { 
        title: "Portfolio Website",
        des:"Losadkasdjalksdjlaskdjlaksdjasdl",
        devstack:"React,Tailwind",
        link:"#",
        git:"#",
        src:proj5,
        type:"backend",
    },
];

export const Portfolio = () => {
    const [expandedIndex, setExpanedIndex] = useState(null);
    
    const toggleExpand = (index) => {
        setExpanedIndex(expandedIndex === index ? null : index);
        };

    return (
        <div className="text-white py-24 md:py-64" id="portfolio">
            <div className="container mx-auto px-4">
                <h2 className="text-[5rem] font-bold text-center mb-16">
                Selected <span className="text-emerald-300">Projects</span>
                </h2> 

                <div className="space-y-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div
                                classname="p-6 flex justify-between items-center cursor-pointer bg-black/20 border border-white/10"
                                onClick={() => toggleExpand(index)}
                            >
                                <h3 className="text-2xl font-semibold">{project.title}</h3>
                                <div className="flex items-center space-x-4 justify-end">
                                    <span className="text-2xl font-light text-emerald-300">
                                        0{index + 1}
                                    </span>
                                    <FiChevronDown
                                    className={`w-6 h-6 transform transition-transform ${
                                        expandedIndex === index ? "rotate-180" : ""
                                    }`}
                                    />
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0}}
                                        animate={{ height: "auto", opacity: 1}}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3}}
                                        className="px-6 pb-6 bg-black/20 border border-white/10"
                                    >
                                       <div className="flex flex-col md:flex-row gap-8">
                                            <img 
                                                src={project.src}
                                                alt={project.title}
                                                className="w-full md:w-1/2 h-64 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white/70 mb-4">{project.desc}</p>
                                                <p className="text-emerald-300 font-medium mb-2">
                                                    stack: {project.devstack}
                                                </p>
                                                <p className="text-emerald-400/60 font-medium mb-4 capitalize">
                                                    Type: {project.type}
                                                </p>
                                                <div className="flex justify-start items-center space-x-4">
                                                    <a 
                                                        href={project.link}
                                                        className="text-emerald-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <HiOutlineExternalLink />
                                                    </a>
                                                    <a 
                                                        href={project.git}
                                                        className="text-grey-400 hover:text-grey-300 transition-colors"
                                                    >
                                                        <FaGithub />
                                                    </a>
                                                </div>
                                            </div>
                                        </div> 

                                    </motion.div>
                                )}
                            </AnimatePresence>                    
                        </motion.div>
                    ))} 
                </div> 
            </div>
        
        </div>
    );
};