import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { DarkModeToggle } from "./DarkModeToggle.jsx";

const BASE_URL = import.meta.env.VITE_FRONTEND_API_URL;
console.log("[Signup] BASE_URL =", BASE_URL);

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = ["Name is required"];
    } else if (formData.name.length < 2) {
      newErrors.name = ["Name must be at least 2 characters"];
    } else if (formData.name.length > 50) {
      newErrors.name = ["Name cannot exceed 50 characters"];
    }

    if (!formData.email.trim()) {
      newErrors.email = ["Email is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = ["Please provide a valid email address"];
    }

    if (!formData.password) {
      newErrors.password = ["Password is required"];
    } else if (formData.password.length < 8) {
      newErrors.password = ["Password must be at least 8 characters"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: [],
    }));

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("[Signup] API response:", data);

      if (!response.ok) {
        if (data?.errors?.length > 0) {
          const backendErrors = {};
          for (const err of data.errors) {
            const field = err.path || "server";
            if (!backendErrors[field]) backendErrors[field] = [];
            backendErrors[field].push(err.msg);
          }
          setErrors(backendErrors);
        } else {
          setServerError(data?.message || "Signup failed. Please try again.");
        }
      } else {
        if (data?.token) {
          localStorage.setItem("authToken", data.token);
          navigate("/notes");
        } else {
          setServerError("Signup succeeded, but no token returned.");
        }
      }
    } catch (error) {
      console.error("[Signup] API error:", error);
      setServerError(
        error?.message || "Signup failed. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldErrors = (field) => {
    if (!errors[field] || errors[field].length === 0) return null;
    return errors[field].map((msg, i) => (
      <p key={i} className="text-red-600 dark:text-red-300 text-xs mt-1">
        {msg}
      </p>
    ));
  };

  return (
    <>
      <DarkModeToggle />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50 dark:bg-gray-900 transition-colors duration-700">
        <div className="relative w-full max-w-md">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
              <div className="w-16 h-16 rounded-full animate-shimmer bg-gradient-to-r from-pink-300 via-blue-300 to-pink-300"></div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              relative z-20
              w-full
              p-8
              rounded-xl
              shadow-2xl
              space-y-6
              transition-all
              duration-700
              bg-gradient-to-br
              from-white/70
              via-pink-50
              to-white/70
              dark:bg-gray-800
              backdrop-blur-md
            "
          >
            <h2 className="text-3xl font-extrabold text-center text-blue-600 dark:text-blue-400">
              Sign Up
            </h2>

            {serverError && (
              <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 text-sm p-3 rounded transition duration-300">
                {serverError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full outline-none bg-transparent dark:text-gray-100"
                  autoComplete="off"
                />
              </div>
              {renderFieldErrors("name")}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full outline-none bg-transparent dark:text-gray-100"
                  autoComplete="off"
                />
              </div>
              {renderFieldErrors("email")}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
                <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full outline-none bg-transparent dark:text-gray-100"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {renderFieldErrors("password")}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 rounded shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105"
            >
              {!isLoading && "Sign Up"}
            </button>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors duration-300"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 1.2s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};
