import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminMain from "./Pages/Admin/Admin_Main"

export default function App() {
  return (
    <BrowserRouter>
      <Routes path="/*">
        <Route path="/admin/*" element={<AdminMain />} />
      </Routes>
    </BrowserRouter>
  )
}
