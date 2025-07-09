import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { DarkModeToggle } from "./DarkModeToggle.jsx";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_FRONTEND_API_URL;
  console.log("[Signup] BASE_URL =", BASE_URL);

  const validate = () => {
    const errs = {};

    if (!formData.email.trim()) {
      errs.email = ["Email is required."];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = ["Invalid email address."];
    }

    if (!formData.password) {
      errs.password = ["Password is required."];
    }

    console.log("[Login] Validation errors:", errs);

    setErrors(errs);
    return Object.keys(errs).length === 0;
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
    setErrors({});
    setServerError("");

    console.log("[Login] Submitting login form with:", formData);

    if (!validate()) {
      console.log("[Login] Validation failed");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("[Login] Raw response:", response);

      const data = await response.json();

      console.log("[Login] Response JSON:", data);

      if (!response.ok) {
        if (data?.errors?.length > 0) {
          const newErrors = {};
          for (const err of data.errors) {
            const field = err.path || "server";
            if (!newErrors[field]) newErrors[field] = [];
            newErrors[field].push(err.msg);
          }
          console.log("[Login] Field-specific errors:", newErrors);
          setErrors(newErrors);
        } else {
          console.log("[Login] Server error:", data?.message);
          setServerError(data?.message || "Login failed. Please try again.");
        }
      } else {
        console.log("[Login] Login successful. Saving token to localStorage.");

        localStorage.setItem("authToken", data.token);

        console.log("[Login] Navigating to /notes");
        navigate("/notes", { replace: true });
      }
    } catch (error) {
      console.error("[Login] Login error:", error);
      setServerError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldErrors = (field) => {
    if (!errors[field]) return null;
    return errors[field].map((msg, i) => (
      <p key={i} className="text-red-600 dark:text-red-300 text-xs mt-1">
        {msg}
      </p>
    ));
  };

  return (
    <>
      <DarkModeToggle />

      <div
        className="
          min-h-screen
          flex items-center justify-center
          bg-gradient-to-br
          from-pink-100 via-white to-pink-50
          dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
          transition-colors duration-700
        "
      >
        <div className="relative w-full max-w-md transition-colors duration-700">
          {isLoading && (
            <div
              className="
                absolute inset-0 z-10 flex items-center justify-center
                rounded-xl
                backdrop-blur-sm
                bg-white/50 dark:bg-gray-800/50
                transition-all duration-700
              "
            >
              <div className="w-16 h-16 rounded-full animate-shimmer bg-gradient-to-r from-pink-300 via-blue-300 to-pink-300"></div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              relative z-20 w-auto p-8 rounded-xl shadow-2xl space-y-6
              transition-all duration-300
              bg-gradient-to-br
              from-white/70 via-pink-50 to-white/70
              dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
              backdrop-blur-md
              m-5
            "
          >
            <h2 className="text-3xl font-extrabold text-center text-blue-600 dark:text-blue-400">
              Login
            </h2>

            {serverError && (
              <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 text-sm p-3 rounded transition duration-300">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div
                className="
                  flex items-center
                  border border-gray-300 dark:border-gray-600
                  rounded px-3 py-2
                  focus-within:ring-2 focus-within:ring-blue-400
                  transition
                "
              >
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div
                className="
                  flex items-center
                  border border-gray-300 dark:border-gray-600
                  rounded px-3 py-2
                  focus-within:ring-2 focus-within:ring-blue-400
                  transition
                "
              >
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
              className="
                w-full
                bg-gradient-to-r from-blue-500 to-blue-700
                hover:from-blue-600 hover:to-blue-800
                text-white font-semibold py-2 rounded shadow
                transition duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transform hover:scale-105
              "
            >
              {!isLoading && "Login"}
            </button>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors duration-300"
              >
                Sign up
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
