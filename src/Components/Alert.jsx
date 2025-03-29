import { Dialog, DialogContent } from "@mui/material";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function Alert({ isAlertOpen, type, message, setIsAlertOpen }) {
    return (
        <Dialog open={isAlertOpen} >
            <DialogContent>
                <div className="w-[300px] h-[170px]">
                    <div className="w-full h-[70px] flex justify-center items-center mt-[5px] bg-blue-">
                        {
                            type == "success"
                                ? <FaRegCircleCheck size="60px" color="#1dc254" />
                                : <MdOutlineErrorOutline size="70px" color="red" />
                        }
                    </div>
                    <div className="w-full h-[50px] flex justify-center items-center bg-green-">
                        <span>{message}</span>
                    </div>
                    <div className="w-full h-[50px] flex justify-center items-center bg-red-">
                        <button
                            className="w-[200px] h-[40px] bg-[#303030] text-white rounded-xl cursor-pointer"
                            onClick={() => setIsAlertOpen(false)}>
                            Ok
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}