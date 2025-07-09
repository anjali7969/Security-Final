import React from "react";
import careerOrientedIcon from "../assets/icons/career_orientation.png"; // Add your career-oriented icon path
import creativeThinkingIcon from "../assets/icons/creative_thinking.png"; // Add your creative thinking icon path
import publicSpeakingIcon from "../assets/icons/public_speaking.png"; // Add your public speaking icon path
import imageLeft from "../assets/images/circle.png"; // Add path for your left image
import imageright from "../assets/images/right_circle.png";
import heroImage from "../assets/images/woman.png"; // Import your hero image

const Hero = () => {
    return (
        <div className="relative bg-white min-h-screen pt-14">
            {/* Hero Section */}
            <header className="relative z-10 py-16">
                <div className="container mx-auto px-12 flex flex-col md:flex-row items-center justify-between">
                    {/* Left side (Text) */}
                    <div className="md:w-1/2 text-center md:text-left relative mt-[-40px]">
                        <h1 className="text-6xl font-bold text-gray-800 leading-tight relative z-20">
                            <span className="block">Up Your <span className="text-blue-600">Skills</span></span>
                            <span className="block">To <span className="text-blue-600">Advance</span> Your</span>
                            <span className="block"><span className="text-blue-600">Career</span> Path</span>
                        </h1>
                        <p className="text-gray-600 mt-4">
                            Learn UI-UX Design skills with weekend UX. The latest online learning system and material that help your knowledge growing.
                        </p>
                        <div className="mt-6 flex justify-center md:justify-start space-x-4">
                            <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Get Started</a>
                            <a href="#" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white">Free trial</a>
                        </div>

                        {/* Add icons below buttons */}
                        <div className="mt-8 flex justify-center md:justify-start space-x-6">
                            {/* Public Speaking */}
                            <div className="flex items-center space-x-2 text-center">
                                <img src={publicSpeakingIcon} alt="Public Speaking" className="w-10 h-10" />
                                <p className="text-gray-600 text-sm">Public Speaking</p>
                            </div>

                            {/* Career-Oriented */}
                            <div className="flex items-center space-x-2 text-center">
                                <img src={careerOrientedIcon} alt="Career-Oriented" className="w-10 h-10" />
                                <p className="text-gray-600 text-sm">Career-Oriented</p>
                            </div>

                            {/* Creative Thinking */}
                            <div className="flex items-center space-x-2 text-center">
                                <img src={creativeThinkingIcon} alt="Creative Thinking" className="w-10 h-10" />
                                <p className="text-gray-600 text-sm">Creative Thinking</p>
                            </div>
                        </div>

                    </div>

                    {/* Right side (Woman Image) */}
                    <div className="md:w-1/2 mt-2 md:mt-0 flex justify-center items-center relative">
                        <div
                            className="bg-blue-600 rounded-full flex justify-center items-center z-10"
                            style={{
                                width: '500px', // Set a fixed size for the circle
                                height: '500px', // Match height to width for a perfect circle
                                overflow: 'hidden', // Ensures the image doesn't overflow
                            }}
                        >
                            <img
                                src={heroImage} // Path to the uploaded woman's image
                                alt="Hero"
                                className="object-cover w-full h-full"
                                style={{
                                    objectPosition: ' top center', // Centers the image
                                }}
                            />
                        </div>
                    </div>

                    {/* Left image behind text (background) */}
                    <img
                    src={imageLeft}
                    alt="Left Circle"
                    className="absolute left-0 top-0 w-80 md:w-96 opacity-100 z-0" // Increased the size of the image
                    />
                    
                    <img
                    src={imageright}
                    alt="Right Circle"
                    className="absolute right-0 top-40 w-80 md:w-96 opacity-100 z-0" // Increased the size and moved the right image further down
                    />
    
    

                </div>
            </header>

            {/* Statistics Section */}
            <section className="bg-gray-100 py-12">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <p className="text-3xl font-bold text-blue-600">2K+</p>
                        <p className="text-gray-600">Video Courses</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-blue-600">5K+</p>
                        <p className="text-gray-600">Online Courses</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-blue-600">250+</p>
                        <p className="text-gray-600">Tutors</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;
