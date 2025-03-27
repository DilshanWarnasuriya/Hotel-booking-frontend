import SideNavigationBar from "./Components/SideNavigationBar"

function App() {

  const user = {
    image: "https://media.istockphoto.com/id/870079648/photo/seeing-things-in-a-positive-light.jpg?s=170667a&w=0&k=20&c=0p7KCODmXjvX-9JkkrHg9SPL0zojHb_8ygOfPylt3W8=",
    name: "Mr. Yashoda Dilshan",
    email: "yashodadilshan@gmail.com"
}

  return (
    <>
      <SideNavigationBar user={user}/>
    </>
  )
}

export default App
