import { useState } from "react";
import { Shell} from "lucide-react";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/useSignUp.js";


const SignUpPage = () => {

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  //This is how we did it first version, without using our custom hook
  // const queryClient = useQueryClient();
  // const {mutate:signupMutation, isPending, error }= useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({queryKey : ["authUser"]}),
  // })

  //This is how we use our custom hook - Optimized version
  const {isPending, error, signupMutation} = useSignUp();


  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
   
  }

  return <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="synthwave">
    <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl overflow-hidden">
    {/* Left side signup form */}

    <div className="w-full lg:w-1/2 p-4 flex flex-col ">
    {/* Logo */}
    <div className="mb-4 flex items-center justify-start gap-2">
       <Shell className="size-9 text-primary" />
       <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
        Calliera
       </span>
    </div>

    {/*Error Message */}
    {error && (
      <div className="alert alert-error mb-4">
        <div>
          <span>{error.response.data.message}</span>
        </div>
      </div>
    )}

    

    


    <div className = "w-full">
      <form onSubmit={handleSignup}>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold ">Create an Account</h2>
            <p className="text-sm opacity-70">
              Join Calliera and start your language lerning adventure!
            </p>
          </div>

           <div className="space-y-3">

            {/* Full Name Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered w-full"
                value={signupData.fullName}
                onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                required 
              />
            </div>

            {/* Email Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Eamail</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                required 
              />
            </div>

            {/* Password Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                required 
              />
              <p className="text-xs text-error mt-1">
                Password must be at least 6 characters long.
              </p>
           </div>

           <div className="form-control w-full">
              <label className="label cursor-pointer justify-start gap 2"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  required
                />
                <span className="text-xs leading-tight">
                  I agree to the <a href="#" className="link link-primary">Terms and Conditions</a>
                </span>
            </label>
          </div>
        </div>

        <button className="btn btn-primary w-full " type="submit">
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Loading...
            </>
          ) : (
            "Create Account"
          )}
        </button>

          <div className="text-center mt-4">
            <p className="text-sm ">
              Already have an account? 
              <Link to="/login" className="text-primary hover:underline"> 
              Sign in
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>

  {/* Right side image */}
  <div className="hidden lg:block w-full lg:w-1/2 bg-primary/10 items-center justify-center ">
    <div className="max-w-md p-8">
      {/*Illustration*/}
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
</div>;
  
}


export default SignUpPage;
