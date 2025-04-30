import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination, Skeleton, Dialog, DialogTitle, DialogContent, TextField, FormControl, Select, MenuItem, InputLabel, FormHelperText, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import { Tailspin } from "ldrs/react";
import { IoClose } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import Tabs from "../../Components/Tabs";
import Badge from "../../Components/Badge";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";
import Alert from "../../Components/Alert";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

export default function AdminBookings({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN
    const defaultHeight = 910;
    const baseRecordCount = 7;
    const contactNoRegex = /^0\d{9}$/;
    const personCountRegex = /^[1-9]\d*$/;

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
    // Add and Update booking Dialog related
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");

    const initialBooking = { id: "", roomNo: "", category: "", name: "", image: "", contactNo: "", personCount: "", startDate: null, endDate: null, checkIn: "", checkOut: "", status: "", reason: "", payed: false }; // Booking structure
    const [booking, setBooking] = useState(initialBooking);
    const [bookingError, setBookingError] = useState("");
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(initialBooking);
    const initialUserName = { title: "", firstName: "" }
    const [userName, setUserName] = useState(initialUserName);

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

    // handle all inputs in dialog
    function handleInputChange(e) {
        const { name, value } = e.target;
        if (name == "title" || name == "firstName") {
            setUserName(prev => ({ ...prev, [name]: value }))
        }
        else {
            setBooking(prev => ({ ...prev, [name]: value }))
        }
        setBookingError("")
    }

    // Add new Booking
    function persist() {
        setIsButtonClicked(true);

        if (userName.title == "" || userName.firstName.length < 4 || !contactNoRegex.test(booking.contactNo) || !personCountRegex.test(booking.personCount) || booking.category == "" || booking.status == "" || booking.startDate == "" || booking.endDate == "") {
            return
        }
        if (new Date(booking.startDate) > new Date(booking.endDate)) {
            setBookingError("Select date after start date")
            return
        }
        setIsButtonLoading(true);

        // Name
        const newBooking = booking;
        newBooking.name = userName.title + "." + userName.firstName;

        // Save booking
        axios.post(`${backendUrl}/api/booking`, newBooking, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
            .then(result => {
                setIsDialogOpen(false);
                setAlertType("success")
                setAlertMessage(result.data.message)
                setIsAlertOpen(true);
                setIsLoaded(false);
                setIsButtonLoading(false);
            })
            .catch(error => {
                if (error.response.data.message == "Rooms not available this days") {
                    setBookingError(error.response.data.message)
                }
                setIsButtonLoading(false);
                setAlertType("error")
                setAlertMessage(error.response.data.message)
                setIsAlertOpen(true);
            })
    }

    // find by booking id for edit details
    function findById(id) {
        axios.get(`${backendUrl}/api/booking/id/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                const getBooking = result.data.booking;
                // dates
                getBooking.startDate = getBooking.startDate.split("T")[0].replace(/\-/g, '.');
                getBooking.endDate = getBooking.endDate.split("T")[0].replace(/\-/g, '.');
                // user name
                const getUserName = userName;
                getUserName.title = getBooking.name.split(".")[0];
                getUserName.firstName = getBooking.name.split(".")[1];
                setUserName(getUserName)

                setBooking(getBooking);
                setCurrentBooking(getBooking)
                setBookingError("")
                setDialogTitle("Edit Booking Details");
                setIsDialogOpen(true);
            })
            .catch(error => {
                setAlertType("error")
                setAlertMessage(error.message)
                setIsAlertOpen(true);
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
                            <h1 className="text-[25px] font-bold">Bookings Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all bookings</span>
                        </div>
                    </div>
                    {/* Add booking Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer"
                            onClick={() => {
                                setBooking(initialBooking);
                                setBookingError("")
                                setDialogTitle("Add New Booking");
                                setIsButtonClicked(false);
                                setIsDialogOpen(true);
                            }}>
                            <IoMdAddCircleOutline size={20} className="mr-[10px]" /> {/* icon */}
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
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Users</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Room</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Start & End</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, display: selectedTab == "Check in" ? "table-cell" : "none" }}>In & Out</TableCell>
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
                                                <TableCell align="center" sx={{ display: selectedTab == "Check in" ? "table-cell" : "none" }} >
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
                                                        {/* Booking column */}
                                                        <TableCell component="th" scope="row">
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar src={element.image} sx={{ width: 45, height: 45 }} />  {/* Booking image */}
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography fontWeight="bold" noWrap> {element.name} </Typography> {/* Booking Name */}
                                                                    <Typography variant="body2" color="text.secondary" noWrap> {element.contactNo} </Typography> {/* Booking Email */}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Room No */}
                                                        <TableCell align="center" >
                                                            <Box >
                                                                <Typography noWrap> {element.roomNo} </Typography>
                                                                <Typography noWrap> {element.category} </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Start & End */}
                                                        <TableCell align="center" >
                                                            <Box >
                                                                <Typography noWrap> {getDate(element.startDate)} </Typography>
                                                                <Typography noWrap> {getDate(element.endDate)} </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Check in & out */}
                                                        <TableCell align="center" sx={{ display: selectedTab == "Check in" ? "table-cell" : "none" }} >
                                                            <Box >
                                                                <Typography noWrap> {element.checkIn ? getTime(element.checkIn) : "-"} </Typography>
                                                                <Typography noWrap> {element.checkOut ? getTime(element.checkOut) : "-"} </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Payed*/}
                                                        <TableCell align="center"><Badge type={element.payed ? "success" : "error"} message={element.payed ? "Yes" : "No"} /></TableCell>
                                                        {/* Actions column */}
                                                        <TableCell align="center" >
                                                            <IconButton color="primary" onClick={() => findById(element.id)}> <MdEdit /> </IconButton> {/* edit button */}
                                                            <IconButton color="error"> <MdDelete /> </IconButton> {/* delete button */}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            : // Empty Table
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">No Booking found</TableCell>
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

            {/* Add and Update booking Dialog */}
            <Dialog open={isDialogOpen} >

                <div className="flex justify-between items-center">
                    <DialogTitle> {dialogTitle} </DialogTitle>
                    <IconButton style={{ marginRight: "10px" }} onClick={() => setIsDialogOpen(false)}> <IoClose /> </IconButton>
                </div>

                <DialogContent dividers>

                    {/* Title and Name */}
                    <div className="flex mt-[20px]">
                        <FormControl style={{ width: "200px" }}>
                            <InputLabel error={isButtonClicked && userName.title == ""}>Title</InputLabel>
                            <Select
                                name="title"
                                label="Title"
                                value={userName.title}
                                onChange={handleInputChange}
                                error={isButtonClicked && userName.title == ""}
                            >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                            </Select>
                            <FormHelperText error>{isButtonClicked && userName.title == "" ? "Select User Title" : ""}</FormHelperText>
                        </FormControl>

                        <TextField
                            style={{ width: "200px", marginLeft: "10px" }}
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            value={userName.firstName}
                            onChange={handleInputChange}
                            error={isButtonClicked && userName.firstName.length < 4}
                            helperText={`${isButtonClicked && userName.firstName.length < 4 ? "Enter more than 3 characters" : ""}`}
                        />
                    </div>

                    {/* Contact no and person count */}
                    <div className="flex mt-[15px]">
                        <TextField
                            style={{ width: "200px" }}
                            name="contactNo"
                            label="Contact No."
                            variant="outlined"
                            value={booking.contactNo}
                            onChange={handleInputChange}
                            error={isButtonClicked && booking.contactNo.length < 4 || bookingError == "Contact No is already used"}
                            helperText={`${isButtonClicked && !contactNoRegex.test(booking.contactNo) ? "Enter Valid Contact No." : ""}`}
                        />

                        <TextField
                            style={{ width: "200px", marginLeft: "10px" }}
                            name="personCount"
                            label="Person Count"
                            variant="outlined"
                            value={booking.personCount}
                            onChange={handleInputChange}
                            error={isButtonClicked && !personCountRegex.test(booking.personCount)}
                            helperText={`${isButtonClicked && !personCountRegex.test(booking.personCount) ? "Enter Valid Person Count" : ""}`}
                        />

                    </div>

                    {/* category and status */}
                    <div className="flex mt-[15px]">
                        <FormControl style={{ width: "200px" }}>
                            <InputLabel error={isButtonClicked && booking.category == ""}>Category</InputLabel>
                            <Select
                                name="category"
                                label="Category"
                                value={booking.category}
                                onChange={handleInputChange}
                                error={isButtonClicked && booking.category == ""}
                            >
                                <MenuItem value="Luxury">Luxury</MenuItem>
                                <MenuItem value="Stranded">Stranded</MenuItem>
                            </Select>
                            <FormHelperText error>{isButtonClicked && booking.category == "" ? "Select Room Category" : ""}</FormHelperText>
                        </FormControl>

                        <FormControl style={{ width: "200px", marginLeft: "10px" }}>
                            <InputLabel error={isButtonClicked && booking.status == ""} >Status</InputLabel>
                            <Select
                                name="status"
                                label="Status"
                                value={booking.status}
                                onChange={handleInputChange}
                                error={isButtonClicked && booking.status == ""}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirm">Confirm</MenuItem>
                                <MenuItem value="check in">Check In</MenuItem>
                                {   // only edit dialog view
                                    dialogTitle == "Edit Booking Details"
                                        ?
                                        <div>
                                            <MenuItem value="check in">Check Out</MenuItem>
                                            <MenuItem value="check in">Cancel</MenuItem>
                                        </div>
                                        : ""
                                }
                            </Select>
                            <FormHelperText error>{isButtonClicked && booking.status == "" ? "Select Booking Status" : ""}</FormHelperText>
                        </FormControl>
                    </div>

                    {/* start date and end date */}
                    <div className="flex mt-[5px]">

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Start Date"
                                    name="startDate"
                                    onChange={(newValue) => {
                                        const formattedDate = newValue ? newValue.format("YYYY.MM.DD") : "";
                                        setBooking(prev => ({ ...prev, startDate: formattedDate }));
                                    }}
                                    value={booking.startDate ? dayjs(booking.startDate, "YYYY.MM.DD") : null}
                                    disablePast
                                    slotProps={{
                                        textField: {
                                            helperText: `${isButtonClicked && booking.startDate == "" ? "Select Start Date" : ""}`,
                                            style: { width: "200px" },
                                            error: (isButtonClicked && booking.startDate == "") || (bookingError === "Rooms not available this days")
                                        },
                                    }}
                                />

                                <DatePicker
                                    label="End Date"
                                    name="endDate"
                                    onChange={(newValue) => {
                                        const formattedDate = newValue ? newValue.format("YYYY.MM.DD") : "";
                                        setBooking(prev => ({ ...prev, endDate: formattedDate }));
                                    }}
                                    value={booking.endDate ? dayjs(booking.endDate, "YYYY.MM.DD") : null}
                                    disablePast
                                    slotProps={{
                                        textField: {
                                            helperText: `${isButtonClicked && booking.endDate == "" ? "Select End Date" : isButtonClicked && new Date(booking.startDate) > new Date(booking.endDate) ? "Select date after start date" : ""}`,
                                            style: { width: "200px", marginLeft: "10px" },
                                            error: isButtonClicked && booking.endDate == "" || isButtonClicked && new Date(booking.startDate) > new Date(booking.endDate) || bookingError == "Rooms not available this days"
                                        },
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                    </div>

                    {/* payed tick */}
                    <div className={`flex ml-[5px] mt-[10px]`}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={booking.payed} onChange={(e) => setBooking(prev => ({ ...prev, payed: e.target.checked ? true : false }))} />
                            }
                            label="Payed"
                        />
                    </div>

                    {/* button  */}
                    <div className="flex flex-col items-center mt-[10px]">
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
                                > {dialogTitle == "Edit Booking Details" ? "Update Booking" : "Add New Booking"}
                                </button>
                        }
                        <span className="text-red-500"> {bookingError == "No any Changes" ? "No any Changes" : ""}</span>
                    </div>

                </DialogContent>

            </Dialog>

            {/* To display success messages and error messages */}
            <Alert isAlertOpen={isAlertOpen} type={alertType} message={alertMessage} setIsAlertOpen={setIsAlertOpen} />
        </main>
    )
}