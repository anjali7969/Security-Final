import { Link } from "react-router-dom";

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <h1 className="text-7xl font-bold text-red-600 mb-4">403</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 text-lg mb-6">
                You don't have permission to view this page.
            </p>

            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default ForbiddenPage;
