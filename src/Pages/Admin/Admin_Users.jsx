import { useState } from "react";
import { TiThMenu, TiUserAdd } from "react-icons/ti";
import { AiOutlineSearch } from "react-icons/ai";
import Tabs from "../../Components/Tabs";

export default function AdminUsers() {

    // tab related
    const tabs = ["Clients", "Admins", "Disable"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [searchValue, setSearchValue] = useState("");

    return (
        <main className="App w-full h-screen flex p-[25px]">

            {/* Page Content */}
            <div className="w-full h-full rounded-lg shadow-md">

                {/* first row */}
                <div className="w-full h-[90px] flex justify-between items-center bg-blue-gray-">
                    {/* Tittle */}
                    <div className="flex">
                        <div className="ml-[20px]">
                            <h1 className="text-[25px] font-bold">Users Page</h1>
                            <span className="text-[16px] text-gray-700">See information about all users</span>
                        </div>
                    </div>
                    {/* Add member Button */}
                    <div className="mr-[20px]">
                        <button className="bg-[#212121] text-white py-[12px] px-[20px] rounded-lg text-[14px] flex items-center font-bold cursor-pointer">
                            <TiUserAdd size={20} className="mr-[15px]" />
                            ADD NEW USER
                        </button>
                    </div>

                </div>

                {/* second row */}
                <div className="w-full h-[90px] flex justify-between items-center bg-red-">
                    {/* Tabs */}
                    <div className="ml-[20px]">
                        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
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
            </div>

        </main>
    )
}