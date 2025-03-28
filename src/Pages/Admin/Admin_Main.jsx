import { Route, Routes } from "react-router-dom";
import SideNavigationBar from "../../Components/SideNavigationBar";
import AdminUsers from "./Admin_Users";

const user = {
    image: "https://media.istockphoto.com/id/870079648/photo/seeing-things-in-a-positive-light.jpg?s=170667a&w=0&k=20&c=0p7KCODmXjvX-9JkkrHg9SPL0zojHb_8ygOfPylt3W8=",
    name: "Mr. Yashoda Dilshan",
    email: "yashodadilshan@gmail.com"
}

export default function AdminMain() {
    return (
        <section className="w-full h-screen flex">
            <div className="hidden lg:w-[250px] lg:block xl:w-[320px] h-screen fixed ">
                <SideNavigationBar user={user} />
            </div>
            <div className="w-full h-screen hidden sm:block lg:ml-[250px] xl:ml-[320px]">
                <Routes path="/*">
                    <Route path="/users" element={<AdminUsers />} />
                </Routes>
            </div>
        </section>
    )
}