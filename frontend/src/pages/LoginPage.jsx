import { useState } from "react";
import {Shell } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";


const LoginPage = () => {
    
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const {isPending, error, loginMutation} = useLogin();

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation(loginData);
    }
    
    
    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="synthwave">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl  shadow-lg overflow-hidden">
              {/* Left side login form */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* Logo */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <Shell className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            Calliera
                        </span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <div>
                                <span>{error.response.data.message}</span>
                            </div>
                        </div>
                    )}

                   <div cla4ssName="w-full">
                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold">Welcome Back</h2>
                                <p>Sign in to your account to continue your language learning journey</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="form-control w-full space-y-2">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required
                                    />
                                </div>

                                <div className="form-control w-full space-y-2">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    className="input input-bordered w-full"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full mt-2"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="link link-primary">
                                            Create one
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                   </div>
                </div>

                {/* Right side image or illustration */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/signup.png" alt="Language connection illustration" className="w-full h-full" />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                            <p className="opacity-70 ">
                            Practice conversations, make friends, and improve your language skills together
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
    };

export default LoginPage;