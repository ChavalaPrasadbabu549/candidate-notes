import { Bell, LogOut, Home } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface NavbarProps {
    name?: string;
}

const Navbar = ({ name }: NavbarProps) => {
    const displayName = name || localStorage.getItem("name") || "User";
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };
    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center z-50">
            <div className="flex items-center gap-6">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-2 text-sm font-medium cursor-pointer ${isActive ? "text-blue-600" : "text-gray-600"
                        } hover:text-blue-600`
                    }
                >
                    <Home className="w-4 h-4" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        `flex items-center gap-2  cursor-pointer ${isActive ? "text-blue-600" : "text-gray-600"
                        } hover:text-blue-600`
                    }
                >
                    <Bell className="w-4 h-4" />
                    Notifications
                </NavLink>

            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-1">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold uppercase">
                        {displayName.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {displayName}
                    </span>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
