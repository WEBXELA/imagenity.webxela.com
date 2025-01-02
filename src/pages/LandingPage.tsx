import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Image, Type, Download, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10" />
        
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-xl">TextBehind</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it works</a>
              <button 
                onClick={() => navigate('/editor')}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Try free
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Place Text Behind Image Subjects with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create stunning visuals by intelligently placing text behind image subjects. 
              Perfect for social media, marketing materials, and creative projects.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/editor')}
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Try it free <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Background Removal</h3>
              <p className="text-gray-600">Automatically detect and separate image subjects with advanced AI technology.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Type className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Text Editing</h3>
              <p className="text-gray-600">Customize fonts, colors, sizes, and add stunning effects to your text.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality Export</h3>
              <p className="text-gray-600">Download your creations in various sizes up to 4K resolution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Image</h3>
                  <p className="text-gray-600">Start by uploading any image you want to work with. Our AI will automatically process it.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Your Text</h3>
                  <p className="text-gray-600">Add and style your text with our powerful text editor. Position it exactly where you want it.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
                  <p className="text-gray-600">Export your creation in high quality and share it with the world.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-600" />
              <span className="font-semibold">TextBehind</span>
            </div>
            <p className="text-gray-600">© 2024 TextBehind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}