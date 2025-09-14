import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../utils/api";
import { Loader2Icon } from "lucide-react";
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "../components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";



const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        // Name validation
        if (!form.name.trim() || form.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters long.";
        }

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
            const response = await instance.post("/user/register", form);
            if (response.status === 201) {
                toast.success(response?.data?.message || "Signup successful!");
                navigate("/login");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Signup failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-150 flex flex-col justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex flex-col justify-center items-center">
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Fill in your details to sign up and start using the app
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="name">User Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                            </div>

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
                                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
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
                            {loading ? <Loader2Icon className="animate-spin" /> : "Sign Up"}
                        </Button>
                    </CardFooter>
                    <div className="text-sm text-center">
                        <span>Already have an account? </span>
                        <a
                            className="underline underline-offset-4 hover:text-primary cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </a>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Signup;
