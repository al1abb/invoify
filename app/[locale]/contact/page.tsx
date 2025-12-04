"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, MessageSquare, User, Building, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    queryType: "general",
  });

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      queryType: "general",
    });
  };

  const handleWhatsAppSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create WhatsApp message
    const whatsappMessage = `
*New Contact Form Submission*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}
*Company:* ${formData.company || 'Not provided'}
*Query Type:* ${formData.queryType}
*Subject:* ${formData.subject || 'Not provided'}

*Message:*
${formData.message}
    `.trim();

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = "919886395888"; // +91 98863 95888
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Reset form
    resetForm();
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Map query type to readable text
    const queryTypeMap: { [key: string]: string } = {
      general: "General Inquiry",
      invoice: "Invoice & Receipt Help",
      template: "Template Customization",
      enterprise: "Enterprise Solutions",
      support: "Technical Support",
      billing: "Billing & Pricing",
    };

    // Create email subject
    const emailSubject = formData.subject
      ? `[${queryTypeMap[formData.queryType]}] ${formData.subject}`
      : `[${queryTypeMap[formData.queryType]}] Contact Form Submission`;

    // Create email body
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Query Type: ${queryTypeMap[formData.queryType]}

Message:
${formData.message}
    `.trim();

    // Encode for mailto URL
    const mailtoUrl = `mailto:locustechnology@proton.me?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Open email client
    window.location.href = mailtoUrl;

    // Reset form
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Get in{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Have questions about receipts, invoices, or need help with our templates? We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 sm:p-10">
                <div className="mb-8">
                  <h2 className="text-base font-medium text-gray-900 mb-2">Send us a Message</h2>
                  <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you via WhatsApp or Email</p>
                </div>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company & Query Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="queryType" className="block text-sm font-medium text-gray-700 mb-2">
                        Query Type
                      </label>
                      <select
                        id="queryType"
                        name="queryType"
                        value={formData.queryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="invoice">Invoice & Receipt Help</option>
                        <option value="template">Template Customization</option>
                        <option value="enterprise">Enterprise Solutions</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing & Pricing</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none placeholder:text-gray-400"
                      placeholder="Tell us more about your requirements..."
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Send via WhatsApp
                    </Button>

                    <Button
                      type="button"
                      onClick={handleEmailSubmit}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Send via Email
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Choose your preferred method of contact - WhatsApp or Email
                  </p>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="text-base font-medium mb-6">Quick Contact</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Phone</p>
                      <a href="tel:+919886395888" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                        +91 98863 95888
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <a href="mailto:locustechnology@proton.me" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                        locustechnology@proton.me
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">WhatsApp</p>
                      <a
                        href="https://wa.me/919886395888"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm opacity-90 hover:opacity-100 transition-opacity"
                      >
                        Chat with us
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900">Business Hours</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monday - Friday</span>
                    <span className="text-sm font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Saturday</span>
                    <span className="text-sm font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sunday</span>
                    <span className="text-sm font-medium text-gray-900">Closed</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs text-green-800">
                    We typically respond within 24 hours during business days
                  </p>
                </div>
              </div>

              {/* Popular Queries */}
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">Popular Queries</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Receipt & Invoice Templates
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Custom Receipt Generation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Enterprise Plans & Bulk Processing
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Template Customization
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Technical Support & Troubleshooting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}