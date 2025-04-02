import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Pagination, Skeleton } from "@mui/material";
import { useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Tabs from "../../Components/Tabs";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";

export default function AdminCategories({ loggedUser }) {

    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setIsSidebarDrawerOpen(newOpen);

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
                            <h1 className="text-[25px] font-bold">Categories Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all Categories</span>
                        </div>
                    </div>
                    {/* Add user Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer"
                            onClick={() => { }}>
                            <TiUserAdd size={20} className="mr-[15px]" />  {/* icon */}
                            ADD NEW CATEGORY
                        </button>
                    </div>
                </div>


                {/* table row */}
                <div className="w-full h-[calc(100vh-160px)] overflow-auto mt-[20px]">
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "calc(100vh - 305px)", overflow: "auto", border: "none" }}>
                        <Table stickyHeader sx={{ minWidth: 580, border: "none" }} aria-label="simple table">

                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Category</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Description</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, display: { xs: "none", md: "table-cell" } }}>Features</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow key={1} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease", minHeight: "85px" }}>
                                    {/* Category column */}
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <Avatar src="https://www.serenevilla.com/images/mainpic-room.jpg" sx={{ width: 125, height: 70 }} variant="square" />  {/* Category image */}
                                            <Box sx={{ ml: 2 }}>
                                                <Typography fontWeight="bold" noWrap> Luxury </Typography> {/* Category Name */}
                                                <Typography variant="body2" color="text.secondary" noWrap> Rs. 7000 </Typography> {/* Category price */}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    {/* Description column */}
                                    <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}>
                                        <div className="flex justify-center items-center">
                                            <p className="max-w-[500px] text-justify">Experience ultimate luxury in this elegant suite, featuring plush king-size bedding, floor-to-ceiling windows with breathtaking views, a private balcony, and a lavish marble bathroom with a deep soaking tub. Indulge in modern amenities, personalized service, and an ambiance of pure sophistication.</p>
                                        </div>
                                    </TableCell>
                                    {/* Features column */}
                                    <TableCell align="center">
                                        <div className="flex justify-center items-center">
                                            <div className="max-w-[500px] min-h-[85px] flex flex-wrap gap-2 justify-center items-center">
                                                <span className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">Air Conditioner</span>
                                                <span className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">Breakfast</span>
                                                <span className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">Lunch Buffet </span>
                                                <span className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">Evening Snack</span>
                                                <span className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">Dinner</span>
                                                <span className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">Pool Access</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* Actions column */}
                                    <TableCell align="center" >
                                        <IconButton color="primary"> <MdEdit /> </IconButton> {/* edit button */}
                                        <IconButton color="error"> <MdDelete /> </IconButton> {/* delete button */}
                                    </TableCell>
                                </TableRow>

                                <TableRow key={1}>
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <Skeleton variant="rectangular" width={125} height={70} />
                                            <Box sx={{ ml: 2 }}>
                                                <Skeleton variant="text" width={80} />
                                                <Skeleton variant="text" width={60} />
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}>
                                        <div className="flex justify-center">
                                            <Skeleton variant="text" width="100%" height={120} />
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex justify-center">
                                            <Skeleton variant="text" width="100%" height={120} />
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center">
                                            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                                            <Skeleton variant="circular" width={40} height={40} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                
                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>


            </div>
        </main>
    )
}
