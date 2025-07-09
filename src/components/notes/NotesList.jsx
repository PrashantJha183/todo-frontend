import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "../base/DarkModeToggle";
import { LogoutButton } from "../base/LogoutButton";

import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    description: "",
    tags: "",
    dueDate: "",
    status: "pending",
  });

  const BASE_URL = import.meta.env.VITE_FRONTEND_API_URL;
  console.log("[Signup] BASE_URL =", BASE_URL);

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
    // OR sessionStorage.getItem("authToken");
  };

  const fetchNotes = async () => {
    console.log("[NotesList] Fetching notes...");

    try {
      const token = getAuthToken();
      console.log("[NotesList] token =", token);

      const response = await fetch(`${BASE_URL}/notes/task`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch notes.");
      }

      console.log("[NotesList] API response:", data);

      setNotes(data.notes || []);
    } catch (e) {
      console.error("[NotesList] Error:", e);
      setServerError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = (noteId) => {
    setConfirmModal({
      action: "delete",
      noteId,
      message: "Are you sure you want to delete this note?",
    });
  };

  const confirmDelete = async (noteId) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${BASE_URL}/notes/task/${noteId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete note.");
      }

      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setConfirmModal(null);
    } catch (e) {
      console.error("[NotesList] Delete error:", e);
      setServerError(e.message || "Failed to delete note.");
    }
  };

  const handleEditClick = (note) => {
    setEditData({
      _id: note._id,
      title: note.title || "",
      description: note.description || "",
      tags: note.tags || "",
      dueDate: note.dueDate
        ? new Date(note.dueDate).toISOString().slice(0, 16)
        : "",
      status: note.status || "pending",
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    setConfirmModal({
      action: "edit",
      noteId: editData._id,
      message: "Are you sure you want to update this note?",
    });
  };

  const confirmEdit = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${BASE_URL}/notes/task/${editData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update note.");
      }

      setNotes((prev) =>
        prev.map((note) =>
          note._id === editData._id ? { ...note, ...editData } : note
        )
      );

      setEditModalOpen(false);
      setConfirmModal(null);
    } catch (e) {
      console.error("[NotesList] Edit error:", e);
      setServerError(e.message || "Failed to update note.");
      setEditModalOpen(false);
      setConfirmModal(null);
    }
  };

  const handleConfirmOk = () => {
    if (confirmModal.action === "delete") {
      confirmDelete(confirmModal.noteId);
    } else if (confirmModal.action === "edit") {
      confirmEdit();
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModal(null);
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-8 dark:bg-gray-900 bg-gradient-to-br from-pink-100 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700  flex flex-col justify-center sm:justify-start items-start overflow-auto sm:overflow-visible">
        <DarkModeToggle />

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-700">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <PlusCircleIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              Notes
            </h1>
            <div className="flex gap-3 w-full sm:w-auto justify-center">
              <Link
                to="/notes/add"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow transform hover:scale-105 transition-all duration-300"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add Note
              </Link>
              <LogoutButton />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-6 animate-pulse">
              <ExclamationCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-300 mr-2" />
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
          )}

          {serverError && (
            <div className="flex items-center gap-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 p-4 rounded transition duration-300">
              <ExclamationCircleIcon className="h-5 w-5" />
              {serverError}
            </div>
          )}

          {!loading && notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-300">
              <ExclamationCircleIcon className="h-10 w-10 mb-2" />
              <p>No notes found. Start by adding a new note!</p>
            </div>
          )}

          {!loading && notes.length > 0 && (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="p-4 border rounded dark:border-gray-700 dark:text-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-900 bg-white dark:bg-gray-700"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-1">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {note.description}
                    </p>

                    {note.tags && note.tags.trim() !== "" && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {note.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((t) => t !== "")
                          .map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mb-1">
                      Due Date:{" "}
                      {note.dueDate
                        ? new Date(note.dueDate)
                            .toISOString()
                            .slice(0, 16)
                            .replace("T", " ")
                        : "N/A"}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      Status:{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          note.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : note.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {note.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => handleEditClick(note)}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline transition-all duration-300"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:hover:text-red-400 text-sm font-medium transition-all duration-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-blue-600 dark:text-blue-400">
                Edit Note
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={editData.tags}
                    onChange={handleEditChange}
                    className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={editData.dueDate}
                    onChange={handleEditChange}
                    className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm modal */}
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm mx-auto text-center shadow-lg">
              <ExclamationCircleIcon className="h-10 w-10 mx-auto text-yellow-500 dark:text-yellow-300 mb-4" />
              <p className="text-gray-800 dark:text-gray-100 font-medium">
                {confirmModal.message}
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOk}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
  @media (max-width: 768px) {
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
`}</style>
    </>
  );
};
