import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem("authToken");

    // Redirect to home page
    navigate("/", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium"
    >
      Logout
    </button>
  );
};
