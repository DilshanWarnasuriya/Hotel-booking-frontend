import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";
import Alert from "../../Components/Alert";
import ConfirmationAlert from "../../Components/ConfirmationAlert";

export default function AdminReviews({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN
    const defaultHeight = 910;
    const baseRecordCount = 8;

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
    const [reviews, setReviews] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordCount, setRecordCount] = useState(getInitialRowCount()); // table record count
    // Alert related
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    // Confirmation Alert related
    const [isConfirmationAlertOpen, setIsConfirmationAlertOpen] = useState(false);
    const [confirmationAlertType, setConfirmationAlertType] = useState("");
    const [selectItem, setSelectItem] = useState(null);
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
            axios.get(`${backendUrl}/api/review`, { params: { type: selectedTab, pageNo: pageNo, recordCount: recordCount } })
                .then(result => {
                    setReviews(result.data.reviews);
                    setTotalPages(result.data.totalPage);
                    setIsLoaded(true);
                })
                .catch(error => {
                    setReviews([]);
                    setIsLoaded(true);
                    setAlertType("error")
                    setAlertMessage(error.response.data.message)
                    setIsAlertOpen(true);
                })
        }
    }, [isLoaded])

    // Review Enable and Disable
    function update(id, check) {
        const body = { id: id, message: check == true ? "enable" : "disable" }

        axios.put(`${backendUrl}/api/review`, body, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
            .then(result => {
                setAlertType("success")
                setAlertMessage(result.data.message)
                setIsAlertOpen(true);
                setIsLoaded(false);
            })
            .catch(error => {
                setAlertType("error")
                setAlertMessage(error.response.data.message)
                setIsAlertOpen(true);
                setIsLoaded(false);
            })
    }

    // Remove Review
    function remove() {
        axios.delete(`${backendUrl}/api/review/${selectItem}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                setConfirmationAlertType("")
                setIsConfirmationAlertOpen(false)
                setIsButtonLoading(false)
                setAlertType("success")
                setAlertMessage(result.data.message)
                setIsAlertOpen(true);
                setIsLoaded(false);
            })
            .catch(error => {
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
                <div className="w-full h-[90px] flex justify-between items-center">
                    {/* Tittle */}
                    <div className="flex">
                        <div className="lg:hidden h-[60px] ml-[20px] flex items-center cursor-pointer">
                            <TiThMenu size={30} onClick={toggleDrawer(true)} />
                        </div>
                        <div className="ml-[20px]">
                            <h1 className="text-[25px] font-bold">Reviews Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all reviews</span>
                        </div>
                    </div>
                    <div className="mr-[20px]">
                        <Tabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setPageNo={setPageNo} setIsLoaded={setIsLoaded} />
                    </div>
                </div>

                {/* table row */}
                <div className="w-full h-[calc(100vh-230px)] overflow-auto mt-[15px]">
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "calc(100vh - 230px)", overflow: "auto", border: "none" }}>
                        <Table stickyHeader sx={{ minWidth: 580, border: "none" }} aria-label="simple table">

                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>User</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Rating</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, display: { xs: "none", md: "table-cell" } }}>Comment</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {
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
                                                        <Skeleton variant="text" width={80} />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }} >
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
                                        :
                                        (reviews && reviews.length > 0) ?
                                            reviews.map((element, index) => {
                                                return (
                                                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease" }}>
                                                        {/* User column */}
                                                        <TableCell component="th" scope="row">
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar src={element.image} sx={{ width: 45, height: 45 }} />  {/* User image */}
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography fontWeight="bold" noWrap> {element.name} </Typography> {/* User Name */}
                                                                    <Typography variant="body2" color="text.secondary" noWrap> {element.email} </Typography> {/* User Email */}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Rating number */}
                                                        <TableCell align="center" > 5 </TableCell>
                                                        {/* Comment */}
                                                        <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                            <div className="flex justify-center items-center">
                                                                <p className="max-w-[600px] text-justify">{element.comment}</p>
                                                            </div>
                                                        </TableCell>
                                                        {/* Actions column */}
                                                        <TableCell align="center" >
                                                            <div className="flex justify-center items-center">
                                                                <label className="inline-flex items-center cursor-pointer mr-[5px]">
                                                                    <input type="checkbox" defaultChecked={element.disabled != true} className="sr-only peer" onChange={(e) => update(element.id, e.target.checked)} />
                                                                    <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3063ba]"></div>
                                                                </label>
                                                                <IconButton color="error" onClick={() => {
                                                                    setSelectItem(element.id)
                                                                    setConfirmationAlertType("Delete")
                                                                    setIsConfirmationAlertOpen(true)
                                                                }}> <MdDelete /> </IconButton> {/* delete button */}
                                                            </div>
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
                        }}
                        variant="outlined"
                        color="primary"
                    />
                </div>

            </div>

            {/* To display success messages and error messages */}
            <Alert isAlertOpen={isAlertOpen} type={alertType} message={alertMessage} setIsAlertOpen={setIsAlertOpen} />

            {/* To display Confirm messages to remove category */}
            <ConfirmationAlert open={isConfirmationAlertOpen} type={confirmationAlertType} action={remove} setIsConfirmationAlertOpen={setIsConfirmationAlertOpen} isButtonLoading={isButtonLoading} />

        </main>
    )
}