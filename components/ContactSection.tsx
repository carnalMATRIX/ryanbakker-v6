"use client";

import { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
import { Button } from "./ui/button";
import { Send, MapPin, Mail } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

interface ContactSectionProps {
  contactDescription?: string | null;
  location?: string | null;
  email?: string | null;
}

export default function ContactSection({
  contactDescription,
  location,
  email,
}: ContactSectionProps) {
  const [status, setStatus] = useState("");

  const onButtonPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  };

  // Track the actual input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Track if a user has clicked into and out of a field
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  // Handle typing
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle clicking away from an input
  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Simple regex to check for a valid email structure
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Custom error messages
  const errors = {
    name:
      touched.name && !formData.name.trim()
        ? "I need to know who I'm talking to!"
        : "",
    email:
      touched.email && !formData.email.trim()
        ? "Where should I send my reply?"
        : touched.email && !isValidEmail(formData.email)
          ? "Hold up, that doesn't look like a real email."
          : "",
    subject:
      touched.subject && !formData.subject.trim()
        ? "What's this regarding?"
        : "",
    message:
      touched.message && !formData.message.trim()
        ? "Don't be shy, write something!"
        : "",
  };

  // The button is only valid if all fields have text AND the email is actually an email
  const isFormValid =
    formData.name.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.subject.trim() !== "" &&
    formData.message.trim() !== "";

  // Typed as a Form Submission Event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    const submitData = new FormData(e.currentTarget);
    const accessKey = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY;

    if (!accessKey) {
      console.error("Missing Web3Forms Access Key");
      setStatus("Configuration error.");
      return;
    }

    submitData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        // Reset everything
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTouched({
          name: false,
          email: false,
          subject: false,
          message: false,
        });

        // Reset the actual form DOM element
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("Error sending message.");
      console.error(error);
    }
  };

  return (
    <section className="text-white py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
      {/* Left Column: Text Content */}
      <AnimateOnScroll className="flex flex-col max-w-lg space-y-8" delay={0}>
        <div className="space-y-3">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#b492f4] block">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans leading-none">
            Let&apos;s build something{" "}
            <span className="text-[#b492f4]">meaningful</span>
          </h2>
        </div>

        <p className="text-zinc-300 md:text-lg font-light leading-relaxed max-w-125 font-inter">
          {contactDescription ||
            "I'm always looking to connect with teams working on software, human-computer interaction, intelligence, or high-impact digital products."}
        </p>

        {/* Detailed Info Cards */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            The Quick & Simple
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Location Card */}
            <div className="flex-1 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b492f4]">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Location
                </h4>
                <p className="text-sm text-zinc-200 font-medium">
                  {location || "Auckland, NZ"}
                </p>
              </div>
            </div>

            {/* Email Card */}
            <a
              href={`mailto:${email || "ryan.beckett.d@gmail.com"}?subject=Inquiry%20from%20Personal%20Site`}
              className="flex-1 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-[#b492f4]/30 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b492f4] group-hover:bg-[#b492f4] group-hover:text-black transition-colors duration-300">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Email
                </h4>
                <p className="text-sm text-zinc-200 font-medium group-hover:text-[#b492f4] transition-colors truncate">
                  {email || "ryan.beckett.d@gmail.com"}
                </p>
              </div>
            </a>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Right Column: Form Container */}
      <AnimateOnScroll
        className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mr-0"
        delay={200}
      >
        {/* Status Badge */}
        <div className="absolute -top-3.5 right-6 bg-zinc-950 border border-white/10 text-white/90 text-[10px] font-mono font-bold tracking-widest uppercase px-4 py-2 rounded-full flex items-center gap-2.5 z-20 shadow-xl backdrop-blur-md">
          {/* Pulsing Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-[105%] w-[105%] rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </span>
          Open for Collaboration
        </div>

        {/* Form Card (Responsive CSS Glassmorphism) */}
        <div className="relative w-full bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden p-6 sm:p-8 md:p-10 shadow-2xl hover:border-white/20 transition-all duration-500">
          {/* Card background glowing overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-indigo-900/5 to-transparent pointer-events-none z-0" />

          {/* Form Elements */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative z-10 flex flex-col gap-8 h-full"
          >
            <div className="relative flex flex-col pt-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Name"
                className={`bg-transparent border-b pb-2 text-white placeholder:text-zinc-500 focus:outline-none transition-all duration-300 text-sm md:text-base ${errors.name ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-[#b492f4]"}`}
              />
              {errors.name && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="relative flex flex-col pt-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`bg-transparent border-b pb-2 text-white placeholder:text-zinc-500 focus:outline-none transition-all duration-300 text-sm md:text-base ${errors.email ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-[#b492f4]"}`}
              />
              {errors.email && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="relative flex flex-col pt-2">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Subject"
                className={`bg-transparent border-b pb-2 text-white placeholder:text-zinc-500 focus:outline-none transition-all duration-300 text-sm md:text-base ${errors.subject ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-[#b492f4]"}`}
              />
              {errors.subject && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="relative flex flex-col pt-2">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Message"
                rows={4}
                className={`bg-transparent border-b pb-2 text-white placeholder:text-zinc-500 focus:outline-none transition-all duration-300 resize-none text-sm md:text-base ${errors.message ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-[#b492f4]"}`}
              ></textarea>
              {errors.message && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.message}
                </span>
              )}
            </div>

            <div className="pt-4 flex flex-col items-end gap-3">
              <button
                type="submit"
                disabled={!isFormValid || status === "Sending..."}
                className="group/btn flex items-center justify-center gap-3 bg-[#b492f4] hover:bg-[#c0a5f9] disabled:bg-zinc-800/80 disabled:text-zinc-600 disabled:opacity-50 text-black px-8 py-4 rounded-full transition-all duration-300 font-bold text-xs tracking-widest uppercase cursor-pointer w-full md:w-auto hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_20px_rgba(180,146,244,0.3)]"
              >
                <span>{status === "Sending..." ? "SENDING..." : "SUBMIT"}</span>
                <Send
                  size={14}
                  className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                />
              </button>

              {/* Status Message Feedback */}
              {status && status !== "Sending..." && (
                <span
                  className={`text-xs ${status.includes("successfully") ? "text-green-400" : "text-red-400"}`}
                >
                  {status}
                </span>
              )}
            </div>
          </form>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
