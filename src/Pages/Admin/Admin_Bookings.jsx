import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import Badge from "../../Components/Badge";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";
import Alert from "../../Components/Alert";

export default function AdminBookings({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN
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

    // tab related
    const tabs = ["Pending", "Confirm", "Check in"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setIsSidebarDrawerOpen(newOpen);
    // Table related
    const [bookings, setBookings] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordCount, setRecordCount] = useState(getInitialRowCount()); // table record count
    // Alert related
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

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

    // retrieve Record
    useEffect(() => {
        if (!isLoaded) {
            axios.get(`${backendUrl}/api/booking`, {
                params: { status: selectedTab, pageNo: pageNo, recordCount: recordCount },
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            })
                .then(result => {
                    setBookings(result.data.booking);
                    setTotalPages(result.data.totalPage);
                    setIsLoaded(true);
                })
                .catch(error => {
                    setBookings([]);
                    setIsLoaded(true);
                    setAlertType("error")
                    setAlertMessage(error.response.data.message)
                    setIsAlertOpen(true);
                })
        }
    }, [isLoaded])

    // separate Date 
    function getDate(date) {
        date = new Date(date)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;  // Format as YYYY.MM.DD
    }
    // separate time
    function getTime(date) {
        date = new Date(date)
        return date.toLocaleTimeString('en-LK', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: true }).replace(':', '.'); // Sri Lanka time formatting
    }


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
                            onClick={() => { persist() }}>
                            <TiUserAdd size={20} className="mr-[15px]" />  {/* icon */}
                            ADD NEW BOOKING
                        </button>
                    </div>
                </div>

                {/* second row */}
                <div className="w-full h-[90px] flex justify-between items-center bg-red-">
                    {/* Tabs */}
                    <div className="ml-[20px]">
                        <Tabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setPageNo={setPageNo} setIsLoaded={setIsLoaded} />
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
                                {  // Table Skeleton
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
                                                    <Box display="flex" justifyContent="center" width="100%">
                                                        <Skeleton variant="text" width={30} />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }} >
                                                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
                                                        <Skeleton variant="text" width={85} />
                                                        <Skeleton variant="text" width={85} />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
                                                        <Skeleton variant="text" width={70} />
                                                        <Skeleton variant="text" width={70} />
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Box display="flex" justifyContent="center" width="100%">
                                                        <Skeleton variant="text" height={40} width={50} />
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Box display="flex" justifyContent="center">
                                                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                                                        <Skeleton variant="circular" width={40} height={40} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : // Table Content
                                        (bookings && bookings.length > 0) ?
                                            bookings.map((element, index) => {
                                                return (
                                                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                                        {/* User column */}
                                                        <TableCell component="th" scope="row">
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar src={element.image} sx={{ width: 45, height: 45 }} />  {/* User image */}
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography fontWeight="bold" noWrap> {element.name} </Typography> {/* User Name */}
                                                                    <Typography variant="body2" color="text.secondary" noWrap> {element.contactNo} </Typography> {/* User Email */}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Room No */}
                                                        <TableCell align="center" > {element.roomNo} </TableCell>
                                                        {/* Start & End */}
                                                        <TableCell align="center" >
                                                            <Box >
                                                                <Typography noWrap> {getDate(element.startDate)} </Typography>
                                                                <Typography noWrap> {getDate(element.endDate)} </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Check in & out */}
                                                        <TableCell align="center" >
                                                            <Box >
                                                                <Typography noWrap> {element.checkIn ? getTime(element.checkIn) : "-"} </Typography>
                                                                <Typography noWrap> {element.checkOut ? getTime(element.checkOut) : "-"} </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Payed*/}
                                                        <TableCell align="center"><Badge type={element.payed ? "success": "error"} message={element.payed ? "Yes" : "No"} /></TableCell>
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
                                                <TableCell colSpan={6} align="center">No users found</TableCell>
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
                            isLoaded(false);
                        }}
                        variant="outlined"
                        color="primary"
                    />
                </div>

            </div>

            {/* To display success messages and error messages */}
            <Alert isAlertOpen={isAlertOpen} type={alertType} message={alertMessage} setIsAlertOpen={setIsAlertOpen} />
        </main>
    )
}