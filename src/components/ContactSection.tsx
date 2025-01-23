import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappGroupLink = "https://chat.whatsapp.com/BAkVeo0eNh89dtACBRwAlQ";

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-1">
            Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="royal-input"
              placeholder="Your name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="royal-input"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-purple-300 mb-1">
            Message
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="royal-input resize-none"
              placeholder="Your message..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`royal-button w-full flex items-center justify-center space-x-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Send className="h-4 w-4" />
          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
        </button>

        {submitStatus === 'success' && (
          <p className="text-green-400 text-sm text-center">Message sent successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-400 text-sm text-center">Failed to send message. Please try again.</p>
        )}
      </form>

      <div className="pt-6 border-t border-purple-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="mailto:rashulrajput@gmail.com"
            className="flex items-center space-x-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 group"
          >
            <Mail className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" />
            <span>rashulrajput@gmail.com</span>
          </a>
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 group"
          >
            <MessageSquare className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" />
            <span>Live Chat</span>
          </a>
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 group"
          >
            <Phone className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" />
            <span>Join WhatsApp Group</span>
          </a>
        </div>
      </div>
    </div>
  );
}