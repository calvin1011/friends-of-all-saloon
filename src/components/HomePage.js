import React from 'react';
import { Scissors, Star, Clock } from 'lucide-react';

const HomePage = ({ setActiveTab }) => {
    const features = [
        {
            icon: <Scissors className="w-8 h-8 text-rose-600" />,
            title: "Expert Styling",
            description: "Professional cuts and styles tailored to your unique personality"
        },
        {
            icon: <Star className="w-8 h-8 text-rose-600" />,
            title: "Premium Quality",
            description: "Using only the finest products for healthy, beautiful hair"
        },
        {
            icon: <Clock className="w-8 h-8 text-rose-600" />,
            title: "Flexible Hours",
            description: "Convenient scheduling to fit your busy lifestyle"
        }
    ];

    return (
        <div className="min-h-screen gradient-bg">
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 fade-in">
                    <h2 className="text-5xl font-bold text-gray-800 mb-6">
                        Welcome to Friends of All
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Professional hair styling services with a personal touch.
                        Where every client becomes family.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`card text-center p-8 fade-in animation-delay-${index * 75}`}
                        >
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="card p-8 text-center fade-in animation-delay-300">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        Ready for a New Look?
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Book your appointment today and experience the Friends of All difference
                    </p>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className="btn-primary inline-flex items-center space-x-2 px-8 py-3 text-lg"
                    >
                        <span>Contact Us</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;