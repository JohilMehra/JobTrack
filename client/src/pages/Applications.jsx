const Applications = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-500 mt-1">
            Manage all your job applications here.
          </p>
        </div>

        <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 transition">
          + Add Application
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          No Applications Found
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Start by adding your first job application.
        </p>

        <div className="mt-5 h-44 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400">📄 Applications Table Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Applications;
