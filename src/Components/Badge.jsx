import { GoCheckCircle } from "react-icons/go";
import { MdOutlineErrorOutline } from "react-icons/md";
import { VscError } from "react-icons/vsc";

export default function Badge({ type, message }) {
    return (
        <div className="flex justify-center items-center">
            <div className={`w-fit flex justify-center items-center gap-1 px-2.5 py-1 rounded-full ${type == "success" ? "bg-[#50c87854]" : type == "error" ? "bg-red-100" : "bg-amber-100"}`}>
                {
                    type == "success"
                        ? < GoCheckCircle size={16} color="#29663d" /> // success
                        : type == "error"
                            ? <VscError size={16} color="#b91c1c" /> // error
                            : <MdOutlineErrorOutline size={16} color="#b45309" /> // warning
                }
                <span className={`${type == "success" ? "text-[#29663d]" : type == "error" ? "text-[#b91c1c]" : "text-[#b45309]"}`}>{message}</span>
            </div>
        </div>
    )
}