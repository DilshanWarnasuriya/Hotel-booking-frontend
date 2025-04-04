import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box, Typography, IconButton, Skeleton, Dialog, DialogTitle, DialogContent, TextField, Autocomplete, Chip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { MdEdit, MdDelete } from "react-icons/md";
import SideNavigationDrawer from "../../Components/SideNavigationDrawer";
import axios from "axios";
import Alert from "../../Components/Alert";
import { IoClose } from "react-icons/io5";
import { SlCloudUpload } from "react-icons/sl";
import { Tailspin } from "ldrs/react";
import 'ldrs/react/Tailspin.css'
import uploadImage from "../../Utils/uploadImage";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function AdminCategories({ loggedUser }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = import.meta.env.VITE_TOKEN
    const priceRegex = /^[1-9]\d*(\.\d+)?$/;

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
    const [selectImages, setSelectImages] = useState([]); // set selected image file
    const [imagePreview, setImagePreview] = useState([]); // set selected preview images url
    const [selectImageIndex, setSelectImageIndex] = useState(null); // main image preview image index number
    const fileInputRef = useRef(null);
    const initialCategory = { id: "", name: "", description: "", price: "", features: [], images: [] };
    const [category, setCategory] = useState(initialCategory);
    const [currentCategory, setCurrentCategory] = useState(initialCategory);
    const [categoryError, setCategoryError] = useState("");
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);

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

    function handleSelectImages(e) {

        const newFiles = Array.from(e.target.files); // Convert FileList to array
        const existingFiles = selectImages.map((file) => file.name); // Get names of existing files
        const filteredFiles = newFiles.filter((file) => !existingFiles.includes(file.name)); // Filter out duplicates

        if (filteredFiles.length + selectImages.length > 5) {
            setRoomError("You can only upload up to 5 images");
            return;
        }

        setSelectImages((prev) => (Array.isArray(prev) ? [...prev, ...filteredFiles] : [...filteredFiles]));  // Append new files to the existing ones

        const newImagePreviews = filteredFiles.map((file) => URL.createObjectURL(file)); // Generate and append image previews
        setImagePreview((prev) => (Array.isArray(prev) ? [...prev, ...newImagePreviews] : [...newImagePreviews]));

        if (newImagePreviews.length > 0) {
            setSelectImageIndex(selectImages.length + newImagePreviews.length - 1);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target
        setCategory(prev => ({ ...prev, [name]: value }));
        setCategoryError("")
    }

    // Add new category
    async function persist() {
        setIsButtonClicked(true);
        if (category.name.length < 4 || !priceRegex.test(category.price) || category.description.length < 10 || category.description.length > 300 || category.features.length == 0 || selectImages.length == 0) {
            return
        }
        
        const newCategory = { ...category }; // Copying the category state
        setIsButtonLoading(true); // button loading

        // check current Category name is already used
        try {
            const checkName = await axios.get(`${backendUrl}/api/category/name/${newCategory.name}`)
            if (checkName.data.message == "Category found") {
                setCategoryError("Category name is already used");
                setIsButtonLoading(false);
                return
            }
        }
        catch (error) {
            if (error.response.data.message != "Category Not found") {
                setAlertType("error");
                setAlertMessage(error.response.data.message);
                setIsAlertOpen(true);
                setIsButtonLoading(false);
            }

        }

        // upload images and get urls
        try {
            const uploadPromises = selectImages.map(async (image) => {
                const response = await uploadImage(image);
                return response.data.url;
            });

            const urls = (await Promise.all(uploadPromises)).filter(url => url !== null);
            newCategory.images = urls; // Assigning the uploaded image URLs

        } catch (e) {
            setAlertType("error");
            setAlertMessage(e.message);
            setIsAlertOpen(true);
        }

        // Add category
        axios.post(`${backendUrl}/api/category`, newCategory, { headers: { Authorization: `Bearer ${token}` } })
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

    // find by category id for edit details
    function findById(id) {
        axios.get(`${backendUrl}/api/category/id/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                setCategory(result.data.category);
                setCurrentCategory(result.data.category)
                setSelectImages(result.data.category.images)
                setImagePreview(result.data.category.images)
                setSelectImageIndex(0)
                setCategoryError("")
                setDialogTitle("Edit Category Details");
                setIsDialogOpen(true);
            })
            .catch(error => {
                setAlertType("error")
                setAlertMessage(error.response.data.message)
                setIsAlertOpen(true);
            })
    }

    // Update category
    async function update() {

        // check All data entered
        setIsButtonClicked(true);
        if (category.name.length < 4 || !priceRegex.test(category.price) || category.description.length < 10 || category.description.length > 300 || category.features.length == 0 || selectImages.length == 0) {
            return
        }

        const editCategory = { ...category } // assign category to editCategory 
        editCategory.images = selectImages; // assign selectImages to editCategory image for check current and edit category are same
        setIsButtonLoading(true); // button loading

        // check current category and edited category are same
        if (JSON.stringify(editCategory) === JSON.stringify(currentCategory)) {
            setCategoryError("No any Changes")
            return
        }

        // check current Category name is already used
        if (currentCategory.name != category.name) {
            try {
                const checkName = await axios.get(`${backendUrl}/api/category/name/${editCategory.name}`)
                if (checkName.data.message == "Category found") {
                    setCategoryError("Category name is already used");
                    setIsButtonLoading(false);
                    return
                }
            }
            catch (error) {
                if (error.response.data.message != "Category Not found") {
                    setAlertType("error");
                    setAlertMessage(error.response.data.message);
                    setIsAlertOpen(true);
                    setIsButtonLoading(false);
                }

            }
        }

        setCategoryError("")

        // new selected images array
        const filteredFiles = selectImages.filter(file => file instanceof File);

        // upload new selected images and get urls
        if (filteredFiles.length > 0) {
            try {
                const uploadPromises = selectImages.map(async (image) => {
                    const response = await uploadImage(image);
                    return response.data.url;
                });

                const urls = (await Promise.all(uploadPromises)).filter(url => url !== null);
                editCategory.images = urls; // Assigning the uploaded image URLs to upload details

            } catch (error) {
                setAlertType("error");
                setAlertMessage(error.response.data.message);
                setIsAlertOpen(true);
                setIsButtonLoading(false);
            }
        }

        // Update category Details
        axios.put(`${backendUrl}/api/category`, editCategory, { headers: { Authorization: `Bearer ${token}` } })
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
                                setImagePreview([]);
                                setSelectImages([]);
                                setSelectImageIndex(null)
                                setCategoryError("")
                                setCategory(initialCategory);
                                setIsButtonClicked(false)
                                setDialogTitle("Add New Category")
                                setIsDialogOpen(true);
                            }}>
                            <IoMdAddCircleOutline size={20} className="mr-[10px]" /> {/* icon */}
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
                                                                <Avatar src={element.images[0]} sx={{ width: 125, height: 70 }} variant="square" />  {/* Category image */}
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
                                                            <IconButton color="primary" onClick={() => findById(element.id)}> <MdEdit /> </IconButton> {/* edit button */}
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
                    <div className="w-[420px] ">

                        <div className="w-[420px] h-[200px]">
                            {
                                imagePreview.length == 0
                                    ? // no file is selected 
                                    <div className={`w-[420px] h-[200px] flex flex-col justify-center items-center rounded-2xl border z-10 border-dashed ${isButtonClicked && selectImages.length == 0 ? "bg-red-50 border-red-400" : "bg-gray-50 border-gray-400"}`}>
                                        <SlCloudUpload color="#4F46E5" size={40} />
                                        <h2 className="text-center text-gray-500 mt-[5px] text-[14px]">Select images from your device</h2>
                                        <label className="mt-[5px]">
                                            <input type="file" hidden multiple ref={fileInputRef} onChange={handleSelectImages} />
                                            <div className="flex w-28 h-9 px-2 flex-col bg-[#4F46E5] rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">Choose File</div>
                                        </label>
                                    </div>
                                    : // select after files
                                    <div className="relative">
                                        {/* Main image */}
                                        <div className="w-[420px] h-[200px] absolute top-0 left-0 z-0">
                                            <img src={imagePreview[selectImageIndex]} className="w-[420px] h-[200px] rounded-2xl" />
                                        </div>

                                        <div className="w-[420px] h-[200px] opacity-0 hover:opacity-100 transition duration-500 absolute top-0 left-0 flex flex-col justify-center items-center bg-[#0000008e] rounded-2xl border border-gray-400 border-dashed z-20">
                                            {/* Remove button */}
                                            <button
                                                className=" w-28 h-9 bg-[#e54646] rounded-full shadow text-white text-xs font-semibold cursor-pointer"
                                                onClick={() => {
                                                    setSelectImages((prev) => prev.filter((_, i) => i !== selectImageIndex));
                                                    setImagePreview((prev) => prev.filter((_, i) => i !== selectImageIndex));
                                                    setSelectImageIndex(imagePreview.length > 0 ? (imagePreview.length - 2) : selectImageIndex);
                                                }}
                                            > Remove
                                            </button>
                                            {/* input button */}
                                            <label className="mt-[10px]">
                                                <input type="file" hidden multiple ref={fileInputRef} onChange={handleSelectImages} />
                                                <div className={`flex w-28 h-9 px-2 flex-col bg-[#4F46E5] rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none ${imagePreview.length != 5 ? "block" : "hidden"}`}>Choose File</div>
                                            </label>
                                        </div>
                                    </div>
                            }
                        </div>

                        {
                            imagePreview.length > 0
                                ? <div className="w-[420px] h-[50px] mt-[10px] flex justify-center items-center gap-[5px]">
                                    {
                                        imagePreview.slice().reverse().map((element, index) => {
                                            return (
                                                <img key={index} src={element} className="w-[80px] h-[45px] rounded-[5px] cursor-pointer" onClick={() => setSelectImageIndex((selectImages.length - 1) - index)} />
                                            )
                                        })
                                    }
                                </div>
                                : ""
                        }

                        <span className={`text-[#ce453ee5] text-[13px] font-medium ml-[12px] ${isButtonClicked && imagePreview.length == 0 ? "block" : "hidden"}`}>Select more than 1 image</span>
                    </div>

                    {/* Name and Price */}
                    <div className="flex mt-[15px]">
                        <TextField
                            name="name"
                            label="Name"
                            variant="outlined"
                            style={{ width: "205px" }}
                            value={category.name}
                            onChange={handleInputChange}
                            error={isButtonClicked && category.name.length < 4 || categoryError == "Category name is already used"}
                            helperText={`${isButtonClicked && category.name.length < 4 ? "Enter more than 3 characters" : categoryError == "Category name is already used" ? "This name is already used" : ""}`}
                        />

                        <TextField
                            style={{ width: "205px", marginLeft: "10px" }}
                            name="price"
                            label="Price"
                            variant="outlined"
                            value={category.price}
                            onChange={handleInputChange}
                            error={isButtonClicked && !priceRegex.test(category.price)}
                            helperText={`${isButtonClicked && !priceRegex.test(category.price) ? "Enter Valid Price" : ""}`}
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
                            value={category.description}
                            onChange={handleInputChange}
                            error={isButtonClicked && category.description.length < 10 || category.description.length > 300}
                            helperText={`${isButtonClicked && category.description.length < 10 ? "Enter more than 10 characters" : category.description.length > 300 ? "Enter less than 300 characters" : ""}`}
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
                            value={category.features}
                            onChange={(event, newValue) => setCategory(prev => ({ ...prev, features: newValue }))}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Features"
                                    error={isButtonClicked && category.features.length == 0}
                                    helperText={`${isButtonClicked && category.features.length == 0 ? "Enter more than 1 Feature" : ""}`}
                                />
                            )}
                        />
                    </div>

                    {/* button  */}
                    <div className="mt-[15px] flex flex-col items-center">
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
                                    onClick={dialogTitle == "Edit Category Details" ? update : persist}
                                > {dialogTitle == "Edit Category Details" ? "Update Category Details" : dialogTitle}
                                </button>
                        }
                        <span className="text-red-500"> {categoryError == "No any Changes" ? "No any Changes" : ""}</span>
                    </div>

                </DialogContent>

            </Dialog>

            {/* To display success messages and error messages */}
            <Alert isAlertOpen={isAlertOpen} type={alertType} message={alertMessage} setIsAlertOpen={setIsAlertOpen} />

        </main >
    )
}
