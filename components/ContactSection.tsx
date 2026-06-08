"use client";

import { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

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

  // Handle typing - Typed for both Input and Textarea
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle clicking away from an input - Typed for both Input and Textarea
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
    <section className="text-white py-8 md:py-12 px-3 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
      {/* Left Column: Text Content */}
      <div className="flex flex-col max-w-lg">
        <h2 className="text-4xl font-medium tracking-tight mb-6 uppercase">
          Let&apos;s build something{" "}
          <span className="font-extrabold">meaningful</span>
        </h2>
        <p className="text-white/80 md:text-lg font-light mb-8 md:mb-16 max-w-125">
          {contactDescription ||
            "I'm always looking to connect with teams working on software, human-computer interaction, intelligence, or high-impact digital products."}
        </p>

        <div>
          <h3 className="text-xs font-medium text-white/70 mb-3">
            The Quick & Simple
          </h3>
          <p className="mb-1 text-white/90 text-sm md:text-base">
            Based in {location || "Auckland, New Zealand"}
          </p>
          <p className="text-white/90 text-sm md:text-base">
            Email me directly:{" "}
            <a
              href={`mailto:${email || "ryan.beckett.d@gmail.com"}?subject=Inquiry%20from%20Personal%20Site`}
              className="underline underline-offset-7 hover:text-white/70 transition-colors"
            >
              {email || "ryan.beckett.d@gmail.com"}
            </a>
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="relative w-full max-w-md mx-auto lg:ml-auto lg:mr-0 md:mt-8 lg:mt-0">
        {/* Status Badge */}
        <div className="absolute -top-3 right-4 bg-green-950/90 border border-green-800 text-white/90 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 z-20 shadow-lg backdrop-blur-md">
          {/* Pulsing Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-[105%] w-[105%] rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </span>
          Currently open for collaboration
        </div>

        {/* Form Card */}
        <div className="relative w-full min-h-120 flex flex-col justify-between">
          {/* Background SVG Wrapper */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg
              viewBox="0 0 457 409"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <g filter="url(#filter0_diif_104_1391)">
                <rect
                  x="4"
                  y="1"
                  width="calc(100% - 8px)"
                  height="calc(100% - 10px)"
                  rx="30"
                  fill="url(#paint0_linear_104_1391)"
                  shapeRendering="crispEdges"
                />
                <rect
                  x="4.5"
                  y="1.5"
                  width="calc(100% - 9px)"
                  height="calc(100% - 11px)"
                  rx="29.5"
                  stroke="#2C204C"
                  strokeOpacity="0.8"
                  shapeRendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_diif_104_1391"
                  x="0"
                  y="0"
                  width="457"
                  height="409"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_104_1391"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_104_1391"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="-0.5" dy="-0.8" />
                  <feGaussianBlur stdDeviation="0.25" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
                  />
                  <feBlend
                    mode="screen"
                    in2="shape"
                    result="effect2_innerShadow_104_1391"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="0.3" dy="0.8" />
                  <feGaussianBlur stdDeviation="0.25" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
                  />
                  <feBlend
                    mode="screen"
                    in2="effect2_innerShadow_104_1391"
                    result="effect3_innerShadow_104_1391"
                  />
                  <feGaussianBlur
                    stdDeviation="0.5"
                    result="effect4_foregroundBlur_104_1391"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_104_1391"
                  x1="419.424"
                  y1="6.86509"
                  x2="57.259"
                  y2="470.734"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D78EFF" />
                  <stop
                    offset="0.0384615"
                    stopColor="#B37AF0"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="0.336538"
                    stopColor="#253268"
                    stopOpacity="0.8"
                  />
                  <stop offset="0.721154" stopColor="#290046" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Form Elements */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative z-10 flex flex-col gap-8 h-full p-6 md:p-10 pt-12"
          >
            <div className="relative flex flex-col">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Name"
                className={`bg-transparent border-b pb-2 text-white placeholder:text-white/90 focus:outline-none transition-colors text-sm md:text-base ${errors.name ? "border-red-400 focus:border-red-400" : "border-white/30 focus:border-white"}`}
              />
              {errors.name && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="relative flex flex-col">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`bg-transparent border-b pb-2 text-white placeholder:text-white/90 focus:outline-none transition-colors text-sm md:text-base ${errors.email ? "border-red-400 focus:border-red-400" : "border-white/30 focus:border-white"}`}
              />
              {errors.email && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="relative flex flex-col">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Subject"
                className={`bg-transparent border-b pb-2 text-white placeholder:text-white/90 focus:outline-none transition-colors text-sm md:text-base ${errors.subject ? "border-red-400 focus:border-red-400" : "border-white/30 focus:border-white"}`}
              />
              {errors.subject && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="relative flex flex-col mt-2">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Message"
                rows={5}
                className={`bg-transparent border-b pb-2 text-white placeholder:text-white/90 focus:outline-none transition-colors resize-none text-sm md:text-base ${errors.message ? "border-red-400 focus:border-red-400" : "border-white/30 focus:border-white"}`}
              ></textarea>
              {errors.message && (
                <span className="absolute -bottom-5 left-0 text-[10px] text-red-400/90 tracking-wide">
                  {errors.message}
                </span>
              )}
            </div>

            <div className="mt-auto pt-2 md:pt-6 flex flex-col items-end gap-3">
              <Button
                type="submit"
                variant="rainbow"
                onPointerMove={onButtonPointerMove}
                iconRight={<Send />}
                // Disable the button if the form isn't perfectly valid or if it's currently sending
                disabled={!isFormValid || status === "Sending..."}
                className="disabled:cursor-not-allowed disabled:opacity-50 w-full md:w-fit py-5 px-10"
              >
                {status === "Sending..." ? "SENDING..." : "SUBMIT"}
              </Button>

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
      </div>
    </section>
  );
}
