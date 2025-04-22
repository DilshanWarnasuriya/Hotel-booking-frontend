import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination } from "@mui/material";
import { useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import Badge from "../../Components/Badge";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";

export default function AdminBookings({ loggedUser }) {

    // tab related
    const tabs = ["Pending", "Confirm", "Check in"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setIsSidebarDrawerOpen(newOpen);
    // Table related
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(5);


    return (
        <main className="App w-full h-screen flex p-[25px]">

            {/* medium screen sidebar */}
            <SideNavigationDrawer open={isSidebarDrawerOpen} toggleDrawer={toggleDrawer} loggedUser={loggedUser} />

            {/* Page Content */}
            <div className="w-full h-full rounded-lg shadow-md">

                {/* first row */}
                <div className="w-full h-[90px] flex justify-between items-center">
                    {/* Tittle */}
                    <div className="flex">
                        <div className="lg:hidden h-[60px] ml-[20px] flex items-center cursor-pointer">
                            <TiThMenu size={30} onClick={toggleDrawer(true)} />
                        </div>
                        <div className="ml-[20px]">
                            <h1 className="text-[25px] font-bold">Bookings Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all bookings</span>
                        </div>
                    </div>
                    {/* Add user Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer"
                            onClick={() => { }}>
                            <TiUserAdd size={20} className="mr-[15px]" />  {/* icon */}
                            ADD NEW BOOKING
                        </button>
                    </div>
                </div>

                {/* second row */}
                <div className="w-full h-[90px] flex justify-between items-center bg-red-">
                    {/* Tabs */}
                    <div className="ml-[20px]">
                        <Tabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setIsLoaded={setIsLoaded} />
                    </div>
                    {/* Search */}
                    <div className="mr-[20px]">
                        <div className="relative flex items-center w-[200px] md:w-[300px]">
                            <AiOutlineSearch className="absolute left-4 w-4 h-4 text-gray-600" />
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full h-10 pl-10 pr-4 border border-gray-600 rounded-lg text-gray-900 outline-none transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* table row */}
                <div className="w-full h-[calc(100vh-305px)] overflow-auto">
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "calc(100vh - 305px)", overflow: "auto", border: "none" }}>
                        <Table stickyHeader sx={{ minWidth: 580, border: "none" }} aria-label="simple table">

                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>users</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Room</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Start & End</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, }}>In & Out</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Payed</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow key={1} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                    {/* User column */}
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <Avatar src="https://media.istockphoto.com/id/870079648/photo/seeing-things-in-a-positive-light.jpg?s=170667a&w=0&k=20&c=0p7KCODmXjvX-9JkkrHg9SPL0zojHb_8ygOfPylt3W8=" sx={{ width: 45, height: 45 }} />  {/* User image */}
                                            <Box sx={{ ml: 2 }}>
                                                <Typography fontWeight="bold" noWrap> Mr. Yashoda </Typography> {/* User Name */}
                                                <Typography variant="body2" color="text.secondary" noWrap> 0743838490 </Typography> {/* User Email */}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    {/* Room No */}
                                    <TableCell align="center" > 102 </TableCell>
                                    {/* Start & End */}
                                    <TableCell align="center" >
                                        <Box >
                                            <Typography noWrap> 2025.03.12 </Typography>
                                            <Typography noWrap> 2025.03.12 </Typography>
                                        </Box>
                                    </TableCell>
                                    {/* Check in & out */}
                                    <TableCell align="center" >
                                        <Box >
                                            <Typography noWrap> 8.30 A.M </Typography>
                                            <Typography noWrap> 7.30 A.M </Typography>
                                        </Box>
                                    </TableCell>
                                    {/* Payed*/}
                                    <TableCell align="center"><Badge type="error" message="No" /></TableCell>
                                    {/* Actions column */}
                                    <TableCell align="center" >
                                        <IconButton color="primary"> <MdEdit /> </IconButton> {/* edit button */}
                                        <IconButton color="error"> <MdDelete /> </IconButton> {/* delete button */}
                                    </TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>

                {/* Pagination row */}
                <div className="w-full h-[75px] flex justify-center items-center">
                    <Pagination
                        page={pageNo}
                        count={totalPages}
                        onChange={(event, value) => {
                            setPageNo(value);
                        }}
                        variant="outlined"
                        color="primary"
                    />
                </div>

            </div>
        </main>
    )
}