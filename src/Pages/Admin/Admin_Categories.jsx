import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Skeleton, Dialog, DialogTitle, DialogContent, TextField, Autocomplete, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { MdEdit, MdDelete } from "react-icons/md";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";
import Alert from "../../Components/Alert";
import { IoClose } from "react-icons/io5";

export default function AdminCategories({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Drawer Side navigation bar related
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => setIsSidebarDrawerOpen(newOpen);
    // Table related
    const [categories, setCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    // Alert related
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    // Add and Update Dialog related
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");

    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        if (!isLoaded) {
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
    })


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
                    {/* Add category Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer"
                            onClick={() => {
                                setDialogTitle("Add New Category")
                                setIsDialogOpen(true);
                            }}>
                            <TiUserAdd size={20} className="mr-[15px]" />  {/* icon */}
                            ADD NEW CATEGORY
                        </button>
                    </div>
                </div>

                {/* table row */}
                <div className="w-full h-[calc(100vh-160px)] overflow-auto mt-[20px]">
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "calc(100vh - 160px)", overflow: "auto", border: "none" }}>
                        <Table stickyHeader sx={{ minWidth: 580, border: "none" }} aria-label="simple table">

                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Category</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1, display: { xs: "none", md: "table-cell" } }}>Description</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Features</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", position: "sticky", top: 0, zIndex: 1 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {   // Table Skeleton
                                    !isLoaded
                                        ?
                                        Array.from({ length: 6 }).map((_, index) => (
                                            < TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    <Box display="flex" alignItems="center">
                                                        <Skeleton variant="rectangular" width={125} height={70} />
                                                        <Box sx={{ ml: 2 }}>
                                                            <Skeleton variant="text" width={80} />
                                                            <Skeleton variant="text" width={60} />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" height="100px" sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                    <div className="flex justify-center" >
                                                        <Skeleton variant="rectangular" width="100%" height={70} />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" height="100px">
                                                    <div className="flex justify-center">
                                                        <Skeleton variant="rectangular" width="100%" height={70} />
                                                    </div>
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
                                        (categories && categories.length > 0) ?
                                            categories.map((element, index) => {
                                                return (
                                                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e8eef8" }, transition: "background-color 0.3s ease", minHeight: "85px" }}>
                                                        {/* Category column */}
                                                        <TableCell component="th" scope="row">
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar src={element.image[0]} sx={{ width: 125, height: 70 }} variant="square" />  {/* Category image */}
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography fontWeight="bold" noWrap> {element.name} </Typography> {/* Category Name */}
                                                                    <Typography variant="body2" color="text.secondary" noWrap> {"Rs. " + element.price} </Typography> {/* Category price */}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        {/* Description column */}
                                                        <TableCell align="center" sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                            <div className="flex justify-center items-center">
                                                                <p className="max-w-[500px] text-justify">{element.description}</p>
                                                            </div>
                                                        </TableCell>
                                                        {/* Features column */}
                                                        <TableCell align="center">
                                                            <div className="flex justify-center items-center">
                                                                <div className="max-w-[500px] min-h-[85px] flex flex-wrap gap-2 justify-center items-center">
                                                                    {
                                                                        element.features.map((feature, index) => {
                                                                            return (
                                                                                <span key={index} className="py-[5px] px-[15px] rounded-[20px] bg-[#ebebeb]">{feature}</span>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        {/* Actions column */}
                                                        <TableCell align="center" >
                                                            <IconButton color="primary"> <MdEdit /> </IconButton> {/* edit button */}
                                                            <IconButton color="error"> <MdDelete /> </IconButton> {/* delete button */}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            :  // Empty Table
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No categories found</TableCell>
                                            </TableRow>
                                }

                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>

            </div>

            <Dialog open={isDialogOpen}>

                <div className="flex justify-between items-center">
                    <DialogTitle> {dialogTitle} </DialogTitle>
                    <IconButton style={{ marginRight: "10px" }} onClick={() => setIsDialogOpen(false)}> <IoClose /> </IconButton>
                </div>

                <DialogContent dividers>

                    {/* Images */}
                    <div className="w-[420px] h-[260px]">
                        <img src="https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/FullLengthImages/Medium/1-Living_Villa-bedroom.jpg" className="w-[420px] h-[200px]" />

                        <div className="w-[420px] h-[50px] mt-[10px] flex justify-center items-center gap-[5px]">
                            <img src="https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/FullLengthImages/Medium/1-Living_Villa-bedroom.jpg" className="w-[80px] h-[45px] cursor-pointer" />
                            <img src="https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/FullLengthImages/Medium/1-Living_Villa-bedroom.jpg" className="w-[80px] h-[45px] cursor-pointer" />
                            <img src="https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/FullLengthImages/Medium/1-Living_Villa-bedroom.jpg" className="w-[80px] h-[45px] cursor-pointer" />
                            <img src="https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/FullLengthImages/Medium/1-Living_Villa-bedroom.jpg" className="w-[80px] h-[45px] cursor-pointer" />
                            <img src="https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/FullLengthImages/Medium/1-Living_Villa-bedroom.jpg" className="w-[80px] h-[45px] cursor-pointer" />
                        </div>
                    </div>

                    {/* Name and Price */}
                    <div className="flex mt-[20px]">
                        <TextField
                            name="cName"
                            label="Name"
                            variant="outlined"
                            style={{ width: "205px" }}
                        />

                        <TextField
                            style={{ width: "205px", marginLeft: "10px" }}
                            name="price"
                            label="Price"
                            variant="outlined"
                        />
                    </div>

                    {/* Description */}
                    <div className="mt-[15px] ">
                        <TextField
                            style={{ width: "420px" }}
                            name="description"
                            label="Description"
                            variant="outlined"
                            multiline
                            maxRows={4}
                        />
                    </div>

                    {/* Features */}
                    <div className="mt-[15px] ">
                        <Autocomplete
                            multiple
                            freeSolo
                            limitTags={2}
                            name="features"
                            options={[]} // No predefined list
                            style={{ width: "420px" }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={index}
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Features"
                                />
                            )}
                        />
                    </div>

                    {/* button  */}
                    <div className="flex flex-col items-center mt-[20px]">
                        <button
                            className="w-full h-[45px] rounded-md bg-[#303030] text-white mb-[5px] font-bold cursor-pointer"
                        > {dialogTitle == "Edit User Details" ? "Update User Details" : dialogTitle}
                        </button>
                    </div>


                </DialogContent>


            </Dialog>

            {/* To display success messages and error messages */}
            <Alert isAlertOpen={isAlertOpen} type={alertType} message={alertMessage} setIsAlertOpen={setIsAlertOpen} />
        </main >
    )
}
