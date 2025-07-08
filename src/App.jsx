import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/base/Login.jsx";
import { Signup } from "./components/base/Signup.jsx";
import { NotesList } from "./components/notes/NotesList.jsx";
import { AddNote } from "./components/notes/AddNote.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<NotesList />} />
        <Route path="/notes/add" element={<AddNote />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
