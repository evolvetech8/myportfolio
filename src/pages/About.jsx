import React from "react";
import project1 from "../assets/images/proj1.png";
import project2 from "../assets/images/proj2.png";
export const About = () => {
    return (
    <section id="about" className="text-white p-8">
        <h2 className="text-6x1 font-bold mb-8">
            About <span className="text-emerald-300">Us</span>
        </h2> 
        <div className="grid gird-cols-1 md:grid:cols-3 gap-8">
            <div className="border border-white/20 round-1g p-6">
                <h3 className="text-2x1 font-bold mb-2">01. Background</h3>   
                <p className="text-white/50 mb-6">
                We're a prassionate full-stack developer with a strong foundation in computer science and a love for creating innovative app solutions. Our journey in teach started with a curiosity about how things work, Which led us to pursue a career in app development.
                </p>
            <div className="rounded-1g p-4 mb-4 border border-white/20">
                <code className="text-emerald-200/50">
                    const skills = [<br />
                    &nbsp;&nbsp; 'JavaScript',
                    <br />
                    &nbsp;&nbsp; 'React',
                    <br />
                    &nbsp;&nbsp; 'Node.js',
                    <br />
                    &nbsp;&nbsp; 'Python',
                    <br />
                    &nbsp;&nbsp; 'SQL',
                    <br />
                    &nbsp;&nbsp; 'AWS',
                    <br />
                    ];
                </code>
            </div>
        </div>
        <div className="border border-white/20 round-1g p-6">
                <h3 className="text-2x1 font-bold mb-2">02. Expertise</h3>   
                <p className="text-white/50">
                We specialize in building robust and scalable application using modern technologies. Our expertise span both front-end and back-end development, allowwing me to create seamless, end-to-end solution.
                </p>
                <div className="mt-4 relative border border-white/20 rounded-1g p-4 h-[220px] overflow-hidden">
                    <img
                        src={project1}
                        alt="Project 1"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
        </div>
        <div className="border border-white/20 round-1g p-6">
                <h3 className="text-2x1 font-bold mb-2">03. Skills</h3>   
                <p className="text-white/50 mb-4">
                We're proficient in a wide range of technologies and constalty expanding our skill set to stay at the forefront of app development.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/20 rouned-1g p-3">
                        <h4 className="text-emerald-300 font-medium mb-2">Frontend</h4>
                        <ul className="text-white/50 space-y-1 text-sm">
                            <li>React/Next.js</li>
                            <li>TypeScript</li>
                            <li>Tailwind CSS</li>
                            <li>Framer Motion</li>
                        </ul>
                    </div>
                    <div className="border border-white/20 rounded-1g p-3">
                        <h4 className="text-emerald-300 font-medium mb-2">Backend</h4>
                        <ul className="text-white/50 space-y-1 text-sm">
                            <li>Node.js</li>
                            <li>Python</li>
                            <li>PostgreSQL</li>
                            <li>AWS</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="border border-white/20 rounded-1g p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Front-end
                            </label>
                        <div className="w-full bg-white/10 rouned-full h-2">
                            <div className="bg-emerald-300 h-2 rouned-full"
                            style={{ width: "90%"}}>
                            </div>
                        </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Back-end
                            </label>
                        <div className="w-full bg-white/10 rouned-full h-2">
                            <div className="bg-emerald-300 h-2 rouned-full"
                            style={{ width: "95%"}}>
                            </div>
                        </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                DevOS
                            </label>
                        <div className="w-full bg-white/10 rouned-full h-2">
                            <div className="bg-emerald-300 h-2 rouned-full"
                            style={{ width: "75%"}}>
                            </div>
                        </div>
                        </div>
                    </div>
                    <h3 className="text-2x1 font-bold mt-4 mb-2">04. Approach</h3>
                    <p className="text-white/50">
                    We believe in wrtiting clean, maintainable code and following best practices. Our approach involves understanding client needs, planning thoroughly, and delivering high-quality solution on times.
                    </p>
            </div>
            <div className="border border-white/20 rounded-1g p-6 flex flex-col justify-between">
                <div className="relative border border-white/20 rouned-1g p-4 h-[200px] overflow-hidden">
                    <img
                        src={project2}
                        alt="Project 2"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-2x1 font-bold mb-2">05. Goals</h3>
                    <p className="text-white/50">
                    Our goal is to continue growing as a developer, tackiling challenging projects, and contributing to the tech community, I'm always excited to learn new technologies and push the boundaries of what's possible in app development.
                    </p>
                </div>
            </div>
        </div>
    </section>
    );
};