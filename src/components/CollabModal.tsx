import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Check } from 'lucide-react';

interface CollabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : 'https://portfolio-likith.onrender.com';

export default function CollabModal({ isOpen, onClose }: CollabModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    country: '',
    state: '',
    collaboration_type: '',
    purpose: '',
    organization: '',
    timeline: '',
    email: '',
    budget_range: '',
    preferred_contact_method: 'Email',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ id: number; token: string } | null>(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      ...formData,
      organization: formData.organization || null,
      state: formData.state || null,
      budget_range: formData.budget_range || 'Not Specified',
      source: 'portfolio_contact_modal',
      utm_source: urlParams.get('utm_source') || null,
      utm_medium: urlParams.get('utm_medium') || null,
      utm_campaign: urlParams.get('utm_campaign') || null,
      utm_content: urlParams.get('utm_content') || null,
      utm_term: urlParams.get('utm_term') || null,
      referrer: document.referrer || 'Direct',
      landing_page: window.location.origin + window.location.pathname,
      hash_section: 'collab_modal',
    };

    try {
      const response = await fetch(`${API_BASE}/api/collab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitResult({ id: data.id, token: data.token });
      } else {
        alert('Submission failed: ' + (data.message || 'Server error.'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to SAKRA API. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-kanit">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] bg-[#0C0C0C] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl mx-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left Column - Information (Why Likith) */}
            <div className="w-full md:w-[40%] bg-gradient-to-br from-[#18011F] via-[#0C0C0C] to-[#BE4C00]/10 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B600A8] font-bold block mb-2">
                  Collaborate
                </span>
                <h2 className="hero-heading font-black text-3xl uppercase tracking-tight leading-none mb-6">
                  Collaborate With Likith
                </h2>
                <p className="text-[#D7E2EA]/70 text-sm leading-relaxed mb-8">
                  Tell me what you want to build, and let&apos;s explore how we can create something meaningful together. All requests are logged and reviewed carefully.
                </p>

                {/* Why Likith? */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                    Why Likith?
                  </h3>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#B600A8]/10 border border-[#B600A8]/30 flex-shrink-0 flex items-center justify-center">
                      <Sparkles size={14} className="text-[#B600A8]" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold uppercase tracking-wider">AI-First Mindset</h4>
                      <p className="text-xs text-[#D7E2EA]/60 leading-relaxed">Building systems that leverage local LLMs and RAG architecture.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#BE4C00]/10 border border-[#BE4C00]/30 flex-shrink-0 flex items-center justify-center">
                      <Sparkles size={14} className="text-[#BE4C00]" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Full Stack Mastery</h4>
                      <p className="text-xs text-[#D7E2EA]/60 leading-relaxed">End-to-end execution from architecture to premium UI/UX.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7621B0]/10 border border-[#7621B0]/30 flex-shrink-0 flex items-center justify-center">
                      <Sparkles size={14} className="text-[#7621B0]" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Founder Vision</h4>
                      <p className="text-xs text-[#D7E2EA]/60 leading-relaxed">Product-driven development with a focus on impact and scale.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-3 font-semibold">
                  Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {['GenAI Agents', 'ML Model Dev', 'Custom SaaS', 'Civic Tech', 'Music Tech'].map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#D7E2EA]/80 uppercase font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form Area */}
            <div className="w-full md:w-[60%] p-8 overflow-y-auto flex flex-col justify-center bg-[#080808]">
              <AnimatePresence mode="wait">
                {!submitResult ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Full Name *</label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                          placeholder="+1 (555) 000-0000"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Country *</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            placeholder="USA"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Collaboration Type *</label>
                        <select
                          name="collaboration_type"
                          value={formData.collaboration_type}
                          onChange={handleChange}
                          required
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B600A8]"
                        >
                          <option value="" disabled className="bg-[#0C0C0C]">Select Category</option>
                          <option value="AI Agent" className="bg-[#0C0C0C]">GenAI Agents</option>
                          <option value="ML Model" className="bg-[#0C0C0C]">ML Model Dev</option>
                          <option value="Fullstack" className="bg-[#0C0C0C]">Custom SaaS / Fullstack</option>
                          <option value="Civic Tech" className="bg-[#0C0C0C]">Civic Tech</option>
                          <option value="Music" className="bg-[#0C0C0C]">Music / Creative</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Preferred Contact</label>
                        <select
                          name="preferred_contact_method"
                          value={formData.preferred_contact_method}
                          onChange={handleChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B600A8]"
                        >
                          <option value="Email" className="bg-[#0C0C0C]">Email</option>
                          <option value="Phone" className="bg-[#0C0C0C]">Phone / Telegram</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Budget Range</label>
                        <select
                          name="budget_range"
                          value={formData.budget_range}
                          onChange={handleChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B600A8]"
                        >
                          <option value="" className="bg-[#0C0C0C]">Select Range (Optional)</option>
                          <option value="< $2,000" className="bg-[#0C0C0C]">&lt; $2,000</option>
                          <option value="$2,000 - $5,000" className="bg-[#0C0C0C]">$2,000 - $5,000</option>
                          <option value="$5,000 - $10,000" className="bg-[#0C0C0C]">$5,000 - $10,000</option>
                          <option value="$10,000+" className="bg-[#0C0C0C]">$10,000+</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Expected Timeline</label>
                        <input
                          type="text"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          placeholder="e.g. 2 months / Immediate"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Organization / Company</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="e.g. Acme Corp or Personal"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60">Project Purpose / Need *</label>
                      <textarea
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Describe your vision or the problem you're solving..."
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#B600A8] to-[#BE4C00] rounded-full text-white text-xs uppercase font-bold tracking-widest cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 border border-white/10 mt-2"
                    >
                      {isSubmitting ? (
                        'Transmitting Request...'
                      ) : (
                        <>
                          <Send size={12} />
                          Submit Collaboration Request
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-500">
                      <Check size={32} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-black text-2xl uppercase tracking-tight text-white">
                        Transmission Complete
                      </h3>
                      <p className="text-xs text-[#D7E2EA]/60 max-w-sm">
                        Your secure collaboration intake payload has been successfully saved to the Sakra Vision execution database.
                      </p>
                    </div>

                    <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 text-left font-mono text-xs flex flex-col gap-3">
                      <div className="flex justify-between">
                        <span className="text-[#D7E2EA]/40">REQUEST ID:</span>
                        <span className="text-white font-bold">#{submitResult.id}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                        <span className="text-[#D7E2EA]/40">VERIFICATION TOKEN (15M EXPIRY):</span>
                        <span className="text-white break-all font-semibold select-all bg-white/5 p-2 rounded border border-white/5 mt-1">{submitResult.token}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#D7E2EA]/40 max-w-xs">
                      A validation email has been triggered to your address. Please verify to confirm system handshake.
                    </p>

                    <button
                      onClick={() => {
                        setSubmitResult(null);
                        setFormData({
                          full_name: '',
                          phone_number: '',
                          country: '',
                          state: '',
                          collaboration_type: '',
                          purpose: '',
                          organization: '',
                          timeline: '',
                          email: '',
                          budget_range: '',
                          preferred_contact_method: 'Email',
                        });
                        onClose();
                      }}
                      className="px-8 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full cursor-pointer hover:bg-opacity-90 transition-colors"
                    >
                      Return to Portfolio
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
