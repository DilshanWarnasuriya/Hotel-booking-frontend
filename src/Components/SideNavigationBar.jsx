import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BiSolidDashboard } from "react-icons/bi";
import { HiMiniUsers } from "react-icons/hi2";
import { IoIosBed } from "react-icons/io";
import { MdCategory, MdOutlineRateReview } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { SlOptionsVertical } from "react-icons/sl";

export default function SideNavigationBar({user}) {

    const [activeLink, setActiveLink] = useState("Dashboard")
    // user menu related
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    // Button style
    const linkStyle = "w-[90%] h-[45px] mb-[10px] rounded-[10px] pl-[20px] flex items-center text-[16px] hover:bg-[#e7eef9] transition-all duration-500 hover:cursor-pointer"

    return (
        <div className="hidden lg:w-[250px] lg:block xl:w-[320px] h-screen border-r border-gray-300 relative pt-[10px]">
            {/* name of company */}
            <div className="w-[100%] flex justify-center border-b border-gray-300 pb-[10px]">
                <div className="h-[60px] flex justify-center items-center">
                    <img src="logo.png" className="lg:w-[35px] xl:w-[40px] lg:h-[35px] xl:h-[40px] mr-[10px]" />
                    <span className="lg:text-[30px] xl:text-[35px] font-bold text-[#3874cb]">Blue villa</span>
                </div>
            </div>

            {/* links */}
            <div className="flex flex-col items-center mt-[20px]">
                <button className={`${linkStyle} ${activeLink === "Dashboard" ? "bg-[#e7eef9]" : "bg-[#ffffff]"} `} onClick={() => setActiveLink("Dashboard")}>
                    <BiSolidDashboard size={20} color={`${activeLink === "Dashboard" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${activeLink === "Dashboard" ? "text-[#3063ba]" : "text-black"}`}>Dashboard</span>
                </button>

                <button className={`${linkStyle} ${activeLink === "Bookings" ? "bg-[#e7eef9]" : "bg-[#ffffff]"} `} onClick={() => setActiveLink("Bookings")}>
                    <TbBrandBooking size={20} color={`${activeLink === "Bookings" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${activeLink === "Bookings" ? "text-[#3063ba]" : "text-black"}`}>Bookings</span>
                </button>

                <button className={`${linkStyle} ${activeLink === "Categories" ? "bg-[#e7eef9]" : "bg-[#ffffff]"} `} onClick={() => setActiveLink("categories")}>
                    <MdCategory size={20} color={`${activeLink === "Categories" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${activeLink === "Categories" ? "text-[#3063ba]" : "text-black"}`}>Categories</span>
                </button>

                <button className={`${linkStyle} ${activeLink === "Rooms" ? "bg-[#e7eef9]" : "bg-[#ffffff]"} `} onClick={() => setActiveLink("rooms")}>
                    <IoIosBed size={20} color={`${activeLink === "Rooms" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${activeLink === "Rooms" ? "text-[#3063ba]" : "text-black"}`}>Rooms</span>
                </button>

                <button className={`${linkStyle} ${activeLink === "Reviews" ? "bg-[#e7eef9]" : "bg-[#ffffff]"} `} onClick={() => setActiveLink("Reviews")}>
                    <MdOutlineRateReview size={20} color={`${activeLink === "Reviews" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${activeLink === "Reviews" ? "text-[#3063ba]" : "text-black"}`}>Reviews</span>
                </button>

                <button className={`${linkStyle} ${activeLink === "Users" ? "bg-[#e7eef9]" : "bg-[#ffffff]"} `} onClick={() => setActiveLink("Users")}>
                    <HiMiniUsers size={20} color={`${activeLink === "Users" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                    <span className={`${activeLink === "Users" ? "text-[#3063ba]" : "text-black"}`}>Users</span>
                </button>

            </div>

            {/* user details */}
            <div className="w-[100%] flex justify-center items-center absolute bottom-[10px] border-t border-gray-300">
                <div className="w-[90%] h-[60px] flex items-center py-3 mt-[10px]">
                    {/* User image */}
                    <img src={user.image} className="w-[45px] h-[45px] rounded-full" />
                    {/* User details */}
                    <div className="ml-3 flex flex-col">
                        <span className="lg:w-[150px] xl:w-[205px] h-[25px] text-gray-900 overflow-hidden font-semibold">{user.name}</span>
                        <span className="lg:w-[140px] xl:w-[205px] h-[20px] text-gray-500 overflow-hidden text-sm ">{user.email}</span>
                    </div>
                    {/* Options Button */}
                    <div className="relative">
                        {/* Options Button */}
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <SlOptionsVertical size={20} className="text-gray-500 cursor-pointer" />
                        </IconButton>

                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                        >
                            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                            <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    )
}