const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Form Builder</h1>
      <p className="text-lg text-gray-600 mb-6">Create and manage your forms easily.</p>
      <a
        href="/form/create"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Get Started
      </a>
      <p className="mt-4 text-sm text-gray-500">
        Or view existing forms <a href="/form/view" className="text-blue-600 hover:underline">here</a>.
      </p>
    </div>
  )
}

export default Home