
export default function Tabs({ tabs, selectedTab, setSelectedTab, setPageNo, setIsLoaded }) {
  return (
    <div className="h-[40px] p-[4px] border flex border-gray-400 rounded-lg">
      {
        tabs.map(tabName => {
          return (
            <button
              key={tabName}
              className={`px-[25px] text-center rounded-lg transition duration-500 cursor-pointer ${selectedTab == tabName ? "bg-[#e8eef8]" : "bg-white"}`}
              onClick={() => {
                setSelectedTab(tabName);
                setPageNo(1)
                setIsLoaded(false)
              }}>
              {tabName}
            </button>
          )
        })
      }
    </div>
  );
}
