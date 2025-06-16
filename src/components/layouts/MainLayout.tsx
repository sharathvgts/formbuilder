import { Outlet } from 'react-router'

const MainLayout = () => {
  return (
    <>
      <header>
        {/*Tailwind Styled Navigation comes here */}
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 text-white">
            <li><a href="/">Home</a></li>
            <li><a href="/form/create">Create Form</a></li>
            <li><a href="/form/view">View Forms</a></li>
          </ul>
        </nav>

      </header>
      <Outlet />
    </>
  )
}

export default MainLayout