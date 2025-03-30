import { Dialog, DialogContent } from "@mui/material";
import { Tailspin } from "ldrs/react";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function ConfirmationAlert({ open, type, action, setIsConfirmationAlertOpen, isButtonLoading }) {
    return (
        <Dialog open={open} >
            <DialogContent>
                <div className="w-[300px] h-[170px]">
                    <div className="w-full h-[70px] flex justify-center items-center mt-[5px] bg-blue-">
                        <MdOutlineErrorOutline size="70px" color={type == "Delete" ? "red" : "#f59e0b"} />
                    </div>
                    <div className="w-full h-[50px] flex justify-center items-center bg-green-">
                        <span>Are you sure?</span>
                    </div>
                    <div className="w-full h-[50px] flex justify-center items-center bg-red- ">
                        {
                            isButtonLoading
                                ?
                                <button className={`w-[120px] h-[40px] text-white font-bold flex justify-center items-center rounded-xl ${type == "Delete" ? "bg-red-500" : "bg-amber-500"}`} disabled>
                                    <Tailspin size="15" stroke="3" speed="0.9" color="white" />
                                    <span className="ml-[10px]">Loading...</span>
                                </button>
                                :
                                <button
                                    className={`w-[120px] h-[40px] text-white rounded-xl cursor-pointer  ${type == "Delete" ? "bg-red-500" : "bg-[#f59e0b]"}`}
                                    onClick={action}>
                                    {type == "Delete" ? "Delete" : "Yes"}
                                </button>
                        }
                        <button
                            className="w-[120px] h-[40px] ml-[10px] bg-[#303030] text-white rounded-xl cursor-pointer"
                            onClick={() => setIsConfirmationAlertOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
