import React from "react";
import aboutImage1 from "../assets/images/about-image.png"; // First image
import aboutImage2 from "../assets/images/about-image2.png"; // Second image
import Footer from "../components/Footer"; // Footer path
import Navbar from "../components/NavBar"; // Navbar path

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center relative">

          {/* Zigzag Design Left */}
          <div className="absolute left-0 top-0 w-20 h-20 md:w-32 md:h-32 bg-gray-200 opacity-50 transform rotate-45 -translate-y-12 -translate-x-12"></div>

          {/* Left Section - Text */}
          <div className="md:w-1/2 text-left z-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-lg text-gray-600 mb-4">
              GateWay Education is a leading e-learning platform that helps students develop skills in technology, design, business, and more.
              Our mission is to make high-quality education accessible to learners worldwide.
            </p>
            <p className="text-lg text-gray-600">
              We provide structured courses, live sessions, and hands-on projects, ensuring that students get practical knowledge for real-world applications.
            </p>
          </div>

          {/* Right Section - Images with Shadow and Overlay */}
          <div className="md:w-1/2 flex flex-col md:flex-row gap-6 relative z-10">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
              <img src={aboutImage1} alt="About Image 1" className="w-full rounded-lg shadow-md" />
            </div>
            <div className="relative w-full md:w-1/2 transform translate-y-20">
              <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
              <img src={aboutImage2} alt="About Image 2" className="w-full rounded-lg shadow-md" />
            </div>
          </div>

          {/* Zigzag Design Right */}
          <div className="absolute right-[-20px] bottom-[-40px] w-20 h-20 md:w-32 md:h-32 bg-gray-200 opacity-50 transform rotate-45 translate-y-12 translate-x-12"></div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Why Choose GateWay Education?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center ">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-900">Flexible Learning</h4>
              <p className="text-gray-600 mt-2">Study at your own pace with recorded and live sessions.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-900">Career Support</h4>
              <p className="text-gray-600 mt-2">Access job placements, resume building, and internship opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Join Our Learning Community Today!</h3>
        <p className="text-lg mb-6">Enhance your skills and career with top-notch courses.</p>
        <a href="/courses" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Explore Courses
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
