import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination, Skeleton, Dialog, DialogTitle, DialogContent, TextField, FormControl, Select, MenuItem, InputLabel, FormHelperText, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import Badge from "../../Components/Badge";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { Tailspin } from 'ldrs/react'
import 'ldrs/react/Tailspin.css'

// Default values shown
<Tailspin
    size="40"
    stroke="5"
    speed="0.9"
    color="black"
/>

export default function AdminUsers({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN
    const defaultHeight = 910;
    const baseRecordCount = 7;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactNoRegex = /^0\d{9}$/;

    // Initial RowCount Calculation
    const getInitialRowCount = () => {
        const newHeight = window.innerHeight;
        if (newHeight > defaultHeight) {
            const reduceHeight = newHeight - defaultHeight;
            return baseRecordCount + Math.round(reduceHeight / 80);
        }
        return baseRecordCount;
    };

    const [searchValue, setSearchValue] = useState("");
    // tab related
    const tabs = ["Client", "Admin", "Disable"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setIsSidebarDrawerOpen(newOpen);
    // Table related
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordCount, setRecordCount] = useState(getInitialRowCount()); // table record count
    // Add and Update user Dialog related
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const initialUser = { title: "", firstName: "", lastName: "", email: "", contactNo: "", password: "", type: "", disabled: false }; // User structure
    const [user, setUser] = useState(initialUser);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);

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

    // handle all inputs in dialog
    function handleInputChange(e) {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }))
    }

    // Add new User
    function persist() {
        setIsButtonClicked(true);

        if (user.title == "" || user.firstName < 4 || user.lastName < 4 || !emailRegex.test(user.email) || !contactNoRegex.test(user.contactNo) || user.password < 8 || user.type == "") {
            return
        }

        setIsButtonLoading(true);
        axios.post(`${backendUrl}/api/user`, user)
            .then(result => {
                console.log(result.data.message)
                setIsDialogOpen(false);
                setIsLoaded(false);
            })
            .catch(error => {
                setIsButtonLoading(false);
                console.log(error.message)
            })
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
                            <h1 className="text-[25px] font-bold">Users Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all users</span>
                        </div>
                    </div>
                    {/* Add user Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer"
                            onClick={() => {
                                setUser(initialUser);
                                setIsButtonClicked(false);
                                setDialogTitle("Add New User");
                                setIsDialogOpen(true);
                            }}>
                            <TiUserAdd size={20} className="mr-[15px]" />  {/* icon */}
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
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>users</TableCell>
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
                                        (users && users.length > 0) ?
                                            users.map((element, index) => {
                                                return (
                                                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                                        {/* User column */}
                                                        <TableCell component="th" scope="row">
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar src={element.image} sx={{ width: 45, height: 45 }} />  {/* User image */}
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography fontWeight="bold" noWrap> {element.title + ". " + element.firstName + " " + element.lastName} </Typography> {/* User Name */}
                                                                    <Typography variant="body2" color="text.secondary" noWrap> {element.email} </Typography> {/* User Email */}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Contact Number column */}
                                                        <TableCell align="center" > {element.contactNo} </TableCell>
                                                        {/* Email Verification column */}
                                                        <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}><Badge type={element.emailVerified ? "success" : "warning"} message={element.emailVerified ? "Verified" : "Not Verified"} /></TableCell>
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

            {/* Add and Update user Dialog */}
            <Dialog open={isDialogOpen} >

                <div className="flex justify-between items-center">
                    <DialogTitle> {dialogTitle} </DialogTitle>
                    <IconButton style={{ marginRight: "10px" }} onClick={() => setIsDialogOpen(false)}> <IoClose /> </IconButton>
                </div>

                <DialogContent dividers>

                    <div className="flex">
                        <TextField
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            style={{ width: "200px" }}
                            value={user.firstName}
                            onChange={handleInputChange}
                            error={isButtonClicked && user.firstName.length < 4}
                            helperText={`${isButtonClicked && user.firstName.length < 4 ? "Enter more than 3 characters" : ""}`}
                        />

                        <TextField
                            style={{ width: "200px", marginLeft: "10px" }}
                            name="lastName"
                            label="Last Name"
                            variant="outlined"
                            value={user.lastName}
                            onChange={handleInputChange}
                            error={isButtonClicked && user.lastName.length < 4}
                            helperText={`${isButtonClicked && user.lastName.length < 4 ? "Enter more than 3 characters" : ""}`}
                        />
                    </div>

                    <div className="mb-[15px]">
                        <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            style={{ width: "410px", marginTop: "15px" }}
                            value={user.email}
                            onChange={handleInputChange}
                            error={isButtonClicked && !emailRegex.test(user.email)}
                            helperText={`${isButtonClicked && !emailRegex.test(user.email) ? "Enter Valid Email address" : ""}`}
                        />
                    </div>

                    <div className="flex mb-[15px]">
                        <TextField
                            style={{ width: "200px" }}
                            name="contactNo"
                            label="Contact No."
                            variant="outlined"
                            value={user.contactNo}
                            onChange={handleInputChange}
                            error={isButtonClicked && user.contactNo.length < 4}
                            helperText={`${isButtonClicked && !contactNoRegex.test(user.contactNo) ? "Enter Valid Contact No." : ""}`}
                        />

                        <TextField
                            style={{ width: "200px", marginLeft: "10px" }}
                            name="password"
                            label="Password"
                            variant="outlined"
                            value={user.password}
                            onChange={handleInputChange}
                            error={isButtonClicked && user.password.length < 8}
                            helperText={`${isButtonClicked && user.password.length < 8 ? "Enter more than 8 characters" : ""}`}
                        />

                    </div>

                    <div className="flex mb-[15px]">
                        <FormControl style={{ width: "200px" }}>
                            <InputLabel error={isButtonClicked && user.title == ""}>Gender</InputLabel>
                            <Select
                                name="title"
                                label="Gender"
                                value={user.title}
                                onChange={handleInputChange}
                                error={isButtonClicked && user.title == ""}
                            >
                                <MenuItem value="Mr">Male</MenuItem>
                                <MenuItem value="Ms">Female</MenuItem>
                            </Select>
                            <FormHelperText error>{isButtonClicked && user.title == "" ? "Select User title" : ""}</FormHelperText>
                        </FormControl>

                        <FormControl style={{ width: "200px", marginLeft: "10px" }}>
                            <InputLabel error={isButtonClicked && user.type == ""} >Type</InputLabel>
                            <Select
                                name="type"
                                label="Type"
                                value={user.type}
                                onChange={handleInputChange}
                                error={isButtonClicked && user.type == ""}
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Client">Client</MenuItem>
                            </Select>
                            <FormHelperText error>{isButtonClicked && user.type == "" ? "Select User Type" : ""}</FormHelperText>
                        </FormControl>
                    </div>

                    {/* button  */}
                    <div>
                        {
                            isButtonLoading
                                ?
                                <button className="w-full h-[45px] rounded-md bg-[#303030b7] text-white mb-[5px] font-bold flex justify-center items-center">
                                    <Tailspin size="20" stroke="3" speed="0.9" color="white" />
                                    <span className="ml-[10px]">Loading....</span>
                                </button>
                                :
                                <button
                                    className="w-full h-[45px] rounded-md bg-[#303030] text-white mb-[5px] font-bold cursor-pointer"
                                    onClick={persist}
                                > {dialogTitle}
                                </button>
                        }
                    </div>

                </DialogContent>

            </Dialog>

        </main>
    )
}