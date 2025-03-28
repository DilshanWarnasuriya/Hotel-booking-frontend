import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BiSolidDashboard } from "react-icons/bi";
import { HiMiniUsers } from "react-icons/hi2";
import { IoIosBed } from "react-icons/io";
import { MdCategory, MdOutlineRateReview } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

export default function SideNavigationBar({ user }) {

    const location = useLocation();
    const currentUrl = location.pathname;
   
    // Link style
    const linkStyle = "w-[90%] h-[45px] mb-[10px] rounded-[10px] pl-[20px] flex items-center text-[16px] hover:bg-[#e7eef9] transition-all duration-500 "

    return (
        <div className="hidden lg:w-[250px] lg:block xl:w-[320px] h-screen border-r border-gray-300 relative pt-[10px]">
            {/* name of company */}
            <div className="w-[100%] flex justify-center border-b border-gray-300 pb-[10px]">
                <div className="h-[60px] flex justify-center items-center">
                    <img src="/logo.png" className="lg:w-[35px] xl:w-[40px] lg:h-[35px] xl:h-[40px] mr-[10px]" />
                    <span className="lg:text-[30px] xl:text-[35px] font-bold text-[#3874cb]">Blue villa</span>
                </div>
            </div>

            {/* links */}
            <div className="flex flex-col items-center mt-[20px]">
                <Link to="/admin"
                    className={`${linkStyle} ${currentUrl == "/admin" || currentUrl == "/admin/" ? "bg-[#e7eef9]" : ""}`}>
                    <BiSolidDashboard size={20} color={`${currentUrl == "/admin" || currentUrl == "/admin/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin" || currentUrl == "/admin/" ? "text-[#3063ba]" : "text-black"}`}>Dashboard</span>
                </Link>

                <Link to="/admin/booking"
                    className={`${linkStyle} ${currentUrl == "/admin/booking" || currentUrl == "/admin/booking/" ? "bg-[#e7eef9]" : ""}`}>
                    <TbBrandBooking size={20} color={`${currentUrl == "/admin/booking" || currentUrl == "/admin/booking/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin/booking" || currentUrl == "/admin/booking/" ? "text-[#3063ba]" : "text-black"}`}>Bookings</span>
                </Link>

                <Link to="/admin/categories"
                    className={`${linkStyle} ${currentUrl == "/admin/categories" || currentUrl == "/admin/categories/" ? "bg-[#e7eef9]" : ""}`}>
                    <MdCategory size={20} color={`${currentUrl == "/admin/categories" || currentUrl == "/admin/categories/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin/categories" || currentUrl == "/admin/categories/" ? "text-[#3063ba]" : "text-black"}`}>Categories</span>
                </Link>

                <Link to="/admin/Rooms"
                    className={`${linkStyle} ${currentUrl == "/admin/Rooms" || currentUrl == "/admin/Rooms/" ? "bg-[#e7eef9]" : ""}`}>
                    <IoIosBed size={20} color={`${currentUrl == "/admin/Rooms" || currentUrl == "/admin/Rooms/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin/Rooms" || currentUrl == "/admin/Rooms/" ? "text-[#3063ba]" : "text-black"}`}>Rooms</span>
                </Link>

                <Link to="/admin/reviews"
                    className={`${linkStyle} ${currentUrl == "/admin/reviews" || currentUrl == "/admin/reviews/" ? "bg-[#e7eef9]" : ""}`}>
                    <MdOutlineRateReview size={20} color={`${currentUrl == "/admin/reviews" || currentUrl == "/admin/reviews/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin/reviews" || currentUrl == "/admin/reviews/" ? "text-[#3063ba]" : "text-black"}`}>Reviews</span>
                </Link>

                <Link to="/admin/users"
                    className={`${linkStyle} ${currentUrl == "/admin/users" || currentUrl == "/admin/users/" ? "bg-[#e7eef9]" : ""}`}>
                    <HiMiniUsers size={20} color={`${currentUrl == "/admin/users" || currentUrl == "/admin/users/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin/users" || currentUrl == "/admin/users/" ? "text-[#3063ba]" : "text-black"}`}>Users</span>
                </Link>

                <Link to="/admin/profile"
                    className={`${linkStyle} ${currentUrl == "/admin/profile" || currentUrl == "/admin/profile/" ? "bg-[#e7eef9]" : ""}`}>
                    <FaUserCircle size={20} color={`${currentUrl == "/admin/profile" || currentUrl == "/admin/profile/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${currentUrl == "/admin/profile" || currentUrl == "/admin/profile/" ? "text-[#3063ba]" : "text-black"}`}>Profile</span>
                </Link>

            </div>

            {/* user details */}
            <div className="w-[100%] flex justify-center items-center absolute bottom-[10px] border-t border-gray-300">
                <div className="lg:w-[80%] xl:w-[90%] h-[60px] flex items-center py-3 mt-[10px]">
                    {/* User image */}
                    <img src={user.image} className="w-[45px] h-[45px] rounded-full" />
                    {/* User details */}
                    <div className="ml-3 flex flex-col">
                        <span className="lg:w-[120px] lg:h-[50px] xl:w-[205px] xl:h-[25px] text-gray-900 overflow-hidden font-semibold">{user.name}</span>
                        <span className="hidden xl:block xl:w-[205px] h-[20px] text-gray-500 overflow-hidden text-sm ">{user.email}</span>
                    </div>
                    {/* Log out Button */}
                    <div className="relative">
                        <IconButton>
                            <AiOutlineLogout size={20} className="text-gray-500 cursor-pointer" />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}