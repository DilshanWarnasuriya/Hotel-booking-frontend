import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Box, Skeleton, TextField, FormControl, Select, MenuItem, InputLabel, FormHelperText, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import { IoMdAddCircleOutline } from "react-icons/io";
import Alert from "../../Components/Alert";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { Tailspin } from "ldrs/react";
import 'ldrs/react/Tailspin.css'

export default function AdminRooms({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN
    const numberRegex = /^\d+$/;
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
    const tabs = ["All", "Enable", "Disable"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setIsSidebarDrawerOpen(newOpen);
    // Table related
    const [rooms, setRooms] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordCount, setRecordCount] = useState(getInitialRowCount()); // table record count
    // Alert related
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    // Add and Update room Dialog related
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const initialRoom = { number: "", category: "", maxPerson: "", disabled: false }; // Room structure
    const [room, setRoom] = useState(initialRoom);
    const [roomError, setRoomError] = useState("");
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(initialRoom);
    const [categories, setCategories] = useState([]);

    const [searchValue, setSearchValue] = useState("");

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
            axios.get(`${backendUrl}/api/room`, { params: { type: selectedTab, pageNo: pageNo, recordCount: recordCount } })
                .then(result => {
                    setRooms(result.data.rooms);
                    setTotalPages(result.data.totalPage);
                    setIsLoaded(true);
                })
                .catch(error => {
                    setRooms([]);
                    setIsLoaded(true);
                    setAlertType("error")
                    setAlertMessage(error.response.data.message)
                    setIsAlertOpen(true);
                })

            // get all categories
            axios.get(`${backendUrl}/api/category`)
                .then(result => {
                    setCategories(result.data);
                    setIsLoaded(true);
                })
                .catch(error => {
                    setCategories([]);
                    setIsLoaded(true);
                    setAlertType("error");
                    setAlertMessage(error.response.data.message);
                    setIsAlertOpen(true);
                })
        }
    }, [isLoaded])

    // handle all inputs in dialog
    function handleInputChange(e) {
        const { name, value } = e.target;
        setRoom(prev => ({ ...prev, [name]: value }))
        setRoomError("")
    }

    // Add new Room
    function persist() {
        setIsButtonClicked(true);

        if (room.category == "" || !numberRegex.test(room.number) || !numberRegex.test(room.maxPerson)) {
            return
        }

        setIsButtonLoading(true)
        axios.post(`${backendUrl}/api/room`, room, { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                setIsDialogOpen(false);
                setAlertType("success")
                setAlertMessage(result.data.message)
                setIsAlertOpen(true);
                setIsLoaded(false);
                setIsButtonLoading(false);
            })
            .catch(error => {
                setIsButtonLoading(false);
                if (error.response.data.message == "Room number is already used") {
                    setRoomError(error.response.data.message)
                }
                else {
                    setAlertType("error")
                    setAlertMessage(error.response.data.message)
                    setIsAlertOpen(true);
                }
            })
    }

    // Find by room number
    function findByNumber(number, purpose) {
        axios.get(`${backendUrl}/api/room/number/${number}`)
            .then(result => {
                if (purpose == "search") {
                    setRooms([result.data.room]);
                }
                else {
                    setRoom(result.data.room);
                    setCurrentRoom(result.data.room)
                    setDialogTitle("Edit Room Details");
                    setIsDialogOpen(true);
                }
            })
            .catch(error => {
                setAlertType("error")
                setAlertMessage(error.response.data.message)
                setIsAlertOpen(true);
            })
    }

    // Update room
    function update() {
        setIsButtonClicked(true);

        if (room.category == "" || !numberRegex.test(room.number) || !numberRegex.test(room.maxPerson)) {
            return
        }

        if (JSON.stringify(room) === JSON.stringify(currentRoom)) {
            setRoomError("No any Changes")
            return
        }

        setIsButtonLoading(true)
        axios.put(`${backendUrl}/api/room`, room, { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                setIsDialogOpen(false);
                setAlertType("success")
                setAlertMessage(result.data.message)
                setIsAlertOpen(true);
                setIsLoaded(false);
                setIsButtonLoading(false);
            })
            .catch(error => {
                setIsButtonLoading(false);
                setAlertType("error")
                setAlertMessage(error.response.data.message)
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
                <div className="w-full h-[100px] flex justify-between items-center">
                    {/* Tittle */}
                    <div className="flex">
                        <div className="lg:hidden h-[60px] ml-[20px] flex items-center cursor-pointer">
                            <TiThMenu size={30} onClick={toggleDrawer(true)} />
                        </div>
                        <div className="ml-[20px]">
                            <h1 className="text-[25px] font-bold">Rooms Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all rooms</span>
                        </div>
                    </div>
                    {/* Add room Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer"
                            onClick={() => {
                                setRoom(initialRoom);
                                setRoomError("")
                                setDialogTitle("Add New Room");
                                setIsButtonClicked(false);
                                setIsDialogOpen(true);
                            }}>
                            <IoMdAddCircleOutline size={20} className="mr-[10px]" />  {/* icon */}
                            ADD NEW ROOM
                        </button>
                    </div>
                </div>

                {/* second row */}
                <div className="w-full h-[100px] flex justify-between items-center bg-red-">
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
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" ? findByNumber(searchValue, "search") : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* table row */}
                <div className="w-full h-[calc(100vh-325px)] overflow-auto">
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "calc(100vh - 305px)", overflow: "auto", border: "none" }}>
                        <Table stickyHeader sx={{ minWidth: 580, border: "none" }} aria-label="simple table">

                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Room No.</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Category</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, }}>Max.Person</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {   // Table Skeleton
                                    !isLoaded ?
                                        Array.from({ length: recordCount }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center">
                                                    <Box display="flex" justifyContent="center" width="100%">
                                                        <Skeleton variant="text" width={80} />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" justifyContent="center" width="100%">
                                                        <Skeleton variant="text" width={80} />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" >
                                                    <Box display="flex" justifyContent="center" width="100%">
                                                        <Skeleton variant="text" width={60} />
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
                                        (rooms && rooms.length > 0) ?
                                            rooms.map((element, index) => {
                                                return (
                                                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                                        <TableCell align="center" > {element.number} </TableCell>
                                                        <TableCell align="center" > {element.category} </TableCell>
                                                        <TableCell align="center" > {element.maxPerson} </TableCell>
                                                        <TableCell align="center" >
                                                            <IconButton color="primary" onClick={() => findByNumber(element.number, "get room details")}> <MdEdit /> </IconButton>
                                                            <IconButton color="error"> <MdDelete /> </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            : // Empty Table
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No rooms found</TableCell>
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

            {/* Add and Update room Dialog */}
            <Dialog open={isDialogOpen} >

                <div className="flex justify-between items-center">
                    <DialogTitle> {dialogTitle} </DialogTitle>
                    <IconButton style={{ marginRight: "10px" }} onClick={() => setIsDialogOpen(false)}> <IoClose /> </IconButton>
                </div>

                <DialogContent dividers>

                    {/* Select Category */}
                    <div className="flex mb-[15px]">
                        <FormControl style={{ width: "300px" }}>
                            <InputLabel error={isButtonClicked && room.category == ""}>Category</InputLabel>
                            <Select
                                name="category"
                                label="Category"
                                value={room.category}
                                onChange={handleInputChange}
                                error={isButtonClicked && room.category == ""}
                            >
                                {
                                    (categories && categories.length > 0)
                                        ? categories.map((element, index) => {
                                            return (
                                                <MenuItem key={index} value={element.name}>{element.name}</MenuItem>
                                            )
                                        })
                                        : <MenuItem value=""> No category </MenuItem>
                                }

                            </Select>
                            <FormHelperText error>{isButtonClicked && room.category == "" ? "Select category" : ""}</FormHelperText>
                        </FormControl>
                    </div>

                    {/* Room Number */}
                    <div className="flex mb-[15px]">
                        <TextField
                            name="number"
                            label="Number"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={room.number}
                            onChange={handleInputChange}
                            error={isButtonClicked && !numberRegex.test(room.number) || roomError == "Room number is already used"}
                            helperText={`${isButtonClicked && !numberRegex.test(room.number) ? "Enter Valid number" : roomError == "Room number is already used" ? "This Room number is already used" : ""}`}
                            disabled={dialogTitle != "Add New Room"}
                        />
                    </div>

                    {/* Maximum person count */}
                    <div className="flex mb-[20px]">
                        <TextField
                            name="maxPerson"
                            label="Max. Persons"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={room.maxPerson}
                            onChange={handleInputChange}
                            error={isButtonClicked && !numberRegex.test(room.maxPerson)}
                            helperText={`${isButtonClicked && !numberRegex.test(room.maxPerson) ? "Enter Valid count" : ""}`}
                        />
                    </div>

                    {/* Disable */}
                    <div className={`flex ml-[5px] mb-[10px] ${dialogTitle == "Edit Room Details" ? "block" : "hidden"}`}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={room.disabled} onChange={(e) => setRoom(prev => ({ ...prev, disabled: e.target.checked ? true : false }))} />
                            }
                            label="Disable"
                        />
                    </div>

                    {/* button  */}
                    <div className="flex flex-col items-center">
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
                                    onClick={dialogTitle == "Add New Room" ? persist : update}
                                > {dialogTitle == "Edit Room Details" ? "Update Room Details" : dialogTitle}
                                </button>
                        }
                        <span className="text-red-500"> {roomError == "No any Changes" ? "No any Changes" : ""}</span>
                    </div>

                </DialogContent>

            </Dialog>

            {/* To display success messages and error messages */}
            <Alert isAlertOpen={isAlertOpen} type={alertType} message={alertMessage} setIsAlertOpen={setIsAlertOpen} />
        </main>
    )
}