import { Drawer, IconButton } from "@mui/material";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { IoIosBed } from "react-icons/io";
import { MdCategory, MdOutlineRateReview } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

export default function SideNavigationDrawer({ open, toggleDrawer, loggedUser }) {

    const location = useLocation();
    const currentUrl = location.pathname;

    // Link style
    const linkStyle = "w-[90%] h-[45px] mb-[10px] rounded-[10px] pl-[20px] flex items-center text-[16px] text-black hover:bg-[#e7eef9] transition-all duration-500"

    return (
        <Drawer open={open} onClose={toggleDrawer(false)}>
            <div className="w-[300px] h-screen border-r border-gray-400 relative pt-[10px]" >
                {/* name of company */}
                <div className="w-[100%] h-[80px] flex justify-center items-center border-b border-gray-300">
                    <img src="/Blue Villa Logo.jpg" className="w-[180px] h-[55px]" />
                </div>

                {/* links */}
                <div className="flex flex-col items-center mt-[20px]">
                    <Link to="/admin"
                        className={`${linkStyle} ${currentUrl == "/admin" || currentUrl == "/admin/" ? "bg-[#e7eef9]" : ""}`}>
                        <BiSolidDashboard size={20} color={`${currentUrl == "/admin" || currentUrl == "/admin/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                        <span className={`${currentUrl == "/admin" || currentUrl == "/admin/" ? "text-[#3063ba]" : "text-black"}`}>Dashboard</span>
                    </Link>

                    <Link to="/admin/bookings"
                        className={`${linkStyle} ${currentUrl == "/admin/bookings" || currentUrl == "/admin/bookings/" ? "bg-[#e7eef9]" : ""}`}>
                        <TbBrandBooking size={20} color={`${currentUrl == "/admin/bookings" || currentUrl == "/admin/bookings/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                        <span className={`${currentUrl == "/admin/bookings" || currentUrl == "/admin/bookings/" ? "text-[#3063ba]" : "text-black"}`}>Bookings</span>
                    </Link>

                    <Link to="/admin/categories"
                        className={`${linkStyle} ${currentUrl == "/admin/categories" || currentUrl == "/admin/categories/" ? "bg-[#e7eef9]" : ""}`}>
                        <MdCategory size={20} color={`${currentUrl == "/admin/categories" || currentUrl == "/admin/categories/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                        <span className={`${currentUrl == "/admin/categories" || currentUrl == "/admin/categories/" ? "text-[#3063ba]" : "text-black"}`}>Categories</span>
                    </Link>

                    <Link to="/admin/rooms"
                        className={`${linkStyle} ${currentUrl == "/admin/rooms" || currentUrl == "/admin/rooms/" ? "bg-[#e7eef9]" : ""}`}>
                        <IoIosBed size={20} color={`${currentUrl == "/admin/rooms" || currentUrl == "/admin/rooms/" ? "#3063ba" : "#757575"}`} className="mr-[10px] " />
                        <span className={`${currentUrl == "/admin/rooms" || currentUrl == "/admin/rooms/" ? "text-[#3063ba]" : "text-black"}`}>Rooms</span>
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

                {/* loggedUser details */}
                <div className="w-[100%] flex justify-center items-center absolute bottom-[10px] border-t border-gray-400">
                    <div className="w-[90%] h-[60px] flex items-center py-3 mt-[10px]">
                        {/* User image */}
                        <img src={loggedUser.image} className="w-[45px] h-[45px] rounded-full" />
                        {/* User details */}
                        <div className="ml-3 flex flex-col">
                            <span className="w-[180px] h-[25px] text-gray-900 overflow-hidden font-semibold">{loggedUser.name}</span>
                            <span className="w-[170px] h-[20px] text-gray-500 overflow-hidden text-sm ">{loggedUser.email}</span>
                        </div>
                        {/* Options Button */}
                        <div className="relative">
                            {/* Options Button */}
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                                <AiOutlineLogout size={20} className="text-gray-500 cursor-pointer" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
