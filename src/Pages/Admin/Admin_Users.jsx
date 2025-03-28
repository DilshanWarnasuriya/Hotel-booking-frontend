import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination } from "@mui/material";
import { useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import Badge from "../../Components/Badge";

export default function AdminUsers() {

    const [searchValue, setSearchValue] = useState("");
    // tab related
    const tabs = ["Clients", "Admins", "Disable"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    // Pagination related
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(5);

    const user = {
        id: 1,
        image: "https://media.istockphoto.com/id/870079648/photo/seeing-things-in-a-positive-light.jpg?s=170667a&w=0&k=20&c=0p7KCODmXjvX-9JkkrHg9SPL0zojHb_8ygOfPylt3W8=",
        name: "Mr. Yashoda Dilshan",
        email: "yashodadilshan@gmail.com",
        contactNo: "0743838490",
        emailVerification: true
    }

    return (
        <main className="App w-full h-screen flex p-[25px]">

            {/* Page Content */}
            <div className="w-full h-full rounded-lg shadow-md">

                {/* first row */}
                <div className="w-full h-[90px] flex justify-between items-center">
                    {/* Tittle */}
                    <div className="flex">
                        <div className="ml-[20px]">
                            <h1 className="text-[25px] font-bold">Users Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all users</span>
                        </div>
                    </div>
                    {/* Add member Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer">
                            <TiUserAdd size={20} className="mr-[15px]" />
                            ADD NEW USER
                        </button>
                    </div>

                </div>

                {/* second row */}
                <div className="w-full h-[90px] flex justify-between items-center bg-red-">
                    {/* Tabs */}
                    <div className="ml-[20px]">
                        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    {/* Search */}
                    <div className="mr-[20px]">
                        <div className="relative flex items-center w-[200px] md:w-[300px]">
                            <AiOutlineSearch className="absolute left-4 w-4 h-4 text-gray-600" />
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full h-10 pl-10 pr-4 border border-gray-600 rounded-lg text-gray-900 outline-none transition-all placeholder-gray-600"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
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
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Users</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Contact Number</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, display: { xs: "none", md: "table-cell" } }}>Email Verification</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                    {/* Member column */}
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <Avatar src={user.image} sx={{ width: 45, height: 45 }} />  {/* member image */}
                                            <Box sx={{ ml: 2 }}>
                                                <Typography fontWeight="bold" noWrap> {user.name} </Typography> {/* member Name */}
                                                <Typography variant="body2" color="text.secondary" noWrap> {user.email} </Typography> {/* member Email */}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    {/* Contact Number column */}
                                    <TableCell align="center" > {user.contactNo} </TableCell>
                                    {/* Email Verification column */}
                                    <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}><Badge type={user.emailVerification ? "success" : "warning"} message={user.emailVerification ? "Verified" : "Not Verified"} /></TableCell>
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
                        onChange={(event, value) => setPageNo(value)}
                        variant="outlined"
                        color="primary"
                    />
                </div>

            </div>

        </main>
    )
}