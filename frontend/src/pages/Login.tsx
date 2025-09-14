import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "../components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
// import { toast } from "react-toastify";
import instance, { updateToken } from "../utils/api";
import { Loader2Icon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"


interface LoginProps {
    setTriggerRefresh?: React.Dispatch<React.SetStateAction<number | null>>;
}

const Login: React.FC<LoginProps> = ({ setTriggerRefresh = null }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org)$/i;
        if (!emailRegex.test(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(form.password)) {
            newErrors.password =
                "Password must be at least 6 characters long and include at least one letter and one number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setLoading(true);
            const response = await instance.post("/user/login", form);
            if (response.status === 200) {
                localStorage.setItem("token", response?.data?.data?.token);
                localStorage.setItem("name", response?.data?.data?.name);
                updateToken(response?.data?.data?.token);
                navigate("/dashboard");
                if (setTriggerRefresh) setTriggerRefresh(prev => (prev ?? 0) + 1);

                toast(response?.data?.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-150 flex flex-col justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex flex-col justify-center items-center">
                    <CardTitle className="text-center">Login to your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials below to login to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="./forgotpassword"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter a strong password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                {errors.password && (
                                    <p className="text-red-600 text-sm">{errors.password}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="py-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <Loader2Icon className="animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </CardFooter>
                    <div className="text-sm text-center">
                        <span>Don’t have an account? </span>
                        <a
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </a>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
