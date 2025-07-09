import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

const ContactUs = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            {/* <section className="py-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contact Us</h2>
                <p className="text-lg text-gray-600 mt-2">We'd love to hear from you. Get in touch with us!</p>
            </section> */}

            {/* Google Map Section */}
            <section className="relative w-full h-[400px] md:h-[500px]">
                <iframe
                    title="Google Map"
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.158009071997!2d85.32396057556183!3d27.711130276136874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1911689a0e0b%3A0x5e3b4d715c19f3f4!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1707580569135!5m2!1sen!2snp"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Floating Contact Info Box */}
                <div className="absolute bottom-8 left-8 md:bottom-24 md:left-12 bg-white p-6 rounded-lg shadow-xl max-w-sm border border-gray-300">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Contact Us</h3>
                    <p className="text-gray-600 mt-2"><strong>📍 Address:</strong> Kathmandu, Nepal</p>
                    <p className="text-gray-600 mt-2"><strong>📧 Email:</strong> support@gatewayeducation.com</p>
                    <p className="text-gray-600 mt-2"><strong>📞 Phone:</strong> +977 9800000000</p>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Send a Message</h3>
                        <form>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500 focus:text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500 focus:text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    placeholder="Your Message"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 h-32 bg-transparent text-gray-800 placeholder-gray-500 focus:text-black"
                                ></textarea>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Technical Support</h3>
                        <p className="text-gray-600 mt-2">📧 example@gmail.com</p>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-6">Land Line</h3>
                        <p className="text-gray-600">📞 0421 3643</p>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-6">Mobile</h3>
                        <p className="text-gray-600">📞 +977 9800000000</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactUs;
