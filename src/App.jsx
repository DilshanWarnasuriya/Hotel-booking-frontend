import { BrowserRouter, Route, Routes } from "react-router-dom"
import SideNavigationBar from "./Components/SideNavigationBar"
import AdminMain from "./Pages/Admin/Admin_Main"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes path="/*">
          <Route path="/admin/*" element={<AdminMain/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
