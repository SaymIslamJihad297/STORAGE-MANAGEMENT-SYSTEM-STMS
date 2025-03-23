import { Outlet } from "react-router-dom";
import AddSomething from "./components/includes/AddItems";
import Navbar from "./components/includes/Navbar";

function App() {

  return (
    <div className='h-screen bg-black'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
