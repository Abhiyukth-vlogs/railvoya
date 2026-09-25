import React, { useState } from "react";
import { api } from "../services/api";
import { BRAND_CONFIG } from "../config/brand";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedConfirmation, setSavedConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedConfirmation(null);
    setLoading(true);

    try {
      const res = await api.submitContact({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });
      setSavedConfirmation(res.confirmation_message || "Your message was saved");
      setFullName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to submit message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-action-orange uppercase tracking-wider">Contact & Support</span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-primary tracking-tight">
            We’re Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Have questions regarding RailVoya, demo simulations, or feature suggestions? Send us a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Information Cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-5">
              <h3 className="text-base font-extrabold text-navy-primary">Direct Assistance</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-action-orange flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-primary">Support Email</p>
                    <p className="text-text-secondary">{BRAND_CONFIG.supportEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-action-orange flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-primary">Toll-Free Helpline</p>
                    <p className="text-text-secondary">{BRAND_CONFIG.supportPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-action-orange flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-primary">Location</p>
                    <p className="text-text-secondary">Bengaluru & New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-border-subtle text-xs text-text-secondary leading-relaxed">
              <b>Response Time:</b> Inquiries are typically reviewed within 24 hours. Messages submitted here are persisted securely to our database.
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-5">
            {savedConfirmation && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-status-success text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{savedConfirmation}</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-status-error text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Verma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vikram@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about Tatkal simulation"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Sending..." : "Submit Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
