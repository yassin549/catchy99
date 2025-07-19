import { useState } from 'react';
import { NextSeo } from 'next-seo';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast.success('Your message has been sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <NextSeo
        title="Contact Us - Catchy"
        description="Have a question or suggestion? Get in touch with us using the contact form."
      />
      <div className="bg-gray-50 dark:bg-gray-900 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Get in Touch</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              {/* Contact Information */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Fill up the form and our team will get back to you within 24 hours.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                      <span className="ml-4 text-lg text-gray-700 dark:text-gray-300">support@catchy.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                      <span className="ml-4 text-lg text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                      <span className="ml-4 text-lg text-gray-700 dark:text-gray-300">123 Creative Lane, Art City, USA</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-gray-500 dark:text-gray-400">
                  <p>Follow us on social media!</p>
                  {/* Social media icons can be added here */}
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input type="text" name="name" id="name" required placeholder="John Doe" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input type="email" name="email" id="email" required placeholder="you@example.com" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                    <textarea id="message" name="message" rows="5" required placeholder="Your message..." value={formData.message} onChange={handleInputChange} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"></textarea>
                  </div>
                  <div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 mr-2" />} 
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
