import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  TagIcon,
  CalendarDaysIcon,
  PencilIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { DarkModeToggle } from "../base/DarkModeToggle";
import { LogoutButton } from "../base/LogoutButton";

export const AddNote = () => {
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_FRONTEND_API_URL;
  console.log("[Signup] BASE_URL =", BASE_URL);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = ["Title is required."];
    }

    if (!formData.description.trim()) {
      newErrors.description = ["Description is required."];
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

    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setServerError("");

    try {
      const token = localStorage.getItem("authToken");
      console.log("[AddNote] token =", token);

      const response = await fetch(`${BASE_URL}/notes/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("[AddNote] API Response:", data);

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
          setServerError(data?.message || "Something went wrong.");
        }
      } else {
        navigate("/notes");
      }
    } catch (e) {
      console.error("[AddNote] Error:", e);
      setServerError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen dark:bg-gray-900 bg-gradient-to-br from-pink-100 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700 flex justify-center items-start p-8">
      <DarkModeToggle />
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-700">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/notes")}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:underline transition-colors duration-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          <LogoutButton />
        </div>

        <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <PlusIcon className="h-6 w-6" />
          Add Note
        </h2>

        {serverError && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 p-3 rounded mt-4 transition duration-300">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <PencilIcon className="h-4 w-4" />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            {renderFieldErrors("title")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <TagIcon className="h-4 w-4" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Comma separated"
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {renderFieldErrors("tags")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <PencilIcon className="h-4 w-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            ></textarea>
            {renderFieldErrors("description")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <CalendarDaysIcon className="h-4 w-4" />
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {renderFieldErrors("dueDate")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {renderFieldErrors("status")}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 rounded-full shadow transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Saving...
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add Note
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
