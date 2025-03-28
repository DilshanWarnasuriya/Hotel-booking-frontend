
export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="h-[40px] p-[4px] border flex border-gray-400 rounded-lg">
      {
        tabs.map(tabName => {
          return (
            <button
              key={tabName}
              className={`px-[25px] text-center rounded-lg transition duration-500 cursor-pointer ${activeTab == tabName ? "bg-[#e8eef8]" : "bg-white"}`}
              onClick={() => setActiveTab(tabName)}>
              {tabName}
            </button>
          )
        })
      }
    </div>
  );
}
