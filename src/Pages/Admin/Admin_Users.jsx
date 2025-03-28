import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import Badge from "../../Components/Badge";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";

export default function AdminUsers() {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN

    const [searchValue, setSearchValue] = useState("");
    // tab related
    const tabs = ["Client", "Admin", "Disable"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setOpen(newOpen);
    // Table related
    const [Users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const user = {
        id: 1,
        image: "https://media.istockphoto.com/id/870079648/photo/seeing-things-in-a-positive-light.jpg?s=170667a&w=0&k=20&c=0p7KCODmXjvX-9JkkrHg9SPL0zojHb_8ygOfPylt3W8=",
        name: "Mr. Yashoda Dilshan",
        email: "yashodadilshan@gmail.com",
        contactNo: "0743838490",
        emailVerification: true
    }

    const defaultHeight = 910;
    const baseRecordCount = 7;

    // Initial RowCount Calculation
    const getInitialRowCount = () => {
        const newHeight = window.innerHeight;
        if (newHeight > defaultHeight) {
            const reduceHeight = newHeight - defaultHeight;
            return baseRecordCount + Math.round(reduceHeight / 80);
        }
        return baseRecordCount;
    };

    const [recordCount, setRecordCount] = useState(getInitialRowCount());

    // Calculating Record Count when changing window height
    useEffect(() => {
        const handleResize = () => {
            const newHeight = window.innerHeight;
            if (newHeight > defaultHeight) {
                const reduceHeight = newHeight - defaultHeight;
                setRecordCount(baseRecordCount + Math.round(reduceHeight / 80));
                setIsLoaded(false)
            } else {
                setRecordCount(baseRecordCount);
            }
        };
        window.addEventListener("resize", handleResize); // Add Event Listener
        return () => { // Cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    useEffect(() => {
        if (!isLoaded) {
            axios.get(`${backendUrl}/api/user`, {
                params: { type: selectedTab, pageNo: pageNo, recordCount: recordCount },
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            })
                .then(result => {
                    setUsers(result.data.users);
                    setTotalPages(result.data.totalPage);
                    setIsLoaded(true);
                })
                .catch(error => {
                    setUsers([]);
                    setIsLoaded(true);
                    console.log(error.message);
                })
        }
    }, [isLoaded])


    return (
        <main className="App w-full h-screen flex p-[25px]">

            {/* medium screen sidebar */}
            <SideNavigationDrawer open={isSidebarDrawerOpen} toggleDrawer={toggleDrawer} user={user} />

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
                            <h1 className="text-[25px] font-bold">Users Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all users</span>
                        </div>
                    </div>
                    {/* Add user Button */}
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
                                {   // Table Skeleton
                                    !isLoaded ?
                                        Array.from({ length: recordCount }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    <Box display="flex" alignItems="center">
                                                        <Skeleton variant="circular" width={45} height={45} />
                                                        <Box sx={{ ml: 2 }}>
                                                            <Skeleton variant="text" width={120} />
                                                            <Skeleton variant="text" width={160} />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Skeleton variant="text" width={80} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Skeleton variant="text" width={60} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" justifyContent="center">
                                                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                                                        <Skeleton variant="circular" width={40} height={40} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        :  // Table Content
                                        (Users && Users.length > 0) ?
                                            Users.map((user, index) => {
                                                return (
                                                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                                        {/* User column */}
                                                        <TableCell component="th" scope="row">
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar src={user.image} sx={{ width: 45, height: 45 }} />  {/* User image */}
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography fontWeight="bold" noWrap> {user.title + ". " + user.firstName + " " + user.lastName} </Typography> {/* User Name */}
                                                                    <Typography variant="body2" color="text.secondary" noWrap> {user.email} </Typography> {/* User Email */}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Contact Number column */}
                                                        <TableCell align="center" > {user.contactNo} </TableCell>
                                                        {/* Email Verification column */}
                                                        <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}><Badge type={user.emailVerified ? "success" : "warning"} message={user.emailVerified ? "Verified" : "Not Verified"} /></TableCell>
                                                        {/* Actions column */}
                                                        <TableCell align="center" >
                                                            <IconButton color="primary"> <MdEdit /> </IconButton> {/* edit button */}
                                                            <IconButton color="error"> <MdDelete /> </IconButton> {/* delete button */}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            : // Empty Table
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No users found</TableCell>
                                            </TableRow>
                                }
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
                            setIsLoaded(false);
                        }}
                        variant="outlined"
                        color="primary"
                    />
                </div>

            </div>

        </main>
    )
}