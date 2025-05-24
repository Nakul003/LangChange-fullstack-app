import React, { useCallback, useState } from 'react'
import { useForm } from "react-hook-form";
import { Eye, EyeClosed, ShipWheelIcon } from "lucide-react";
import { Link } from "react-router"
import illustration from "../assets/i.png"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from "../lib/api.js"

const SignUpPage = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const { register, handleSubmit, } = useForm()
  const queryClient = useQueryClient();

  const { mutate:signupMutation,isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess:()=> queryClient.invalidateQueries({queryKey:["authUser"]}),
  });
  
  const onSubmit = (data) => {
    signupMutation(data)
  }

  
  const pickRandom = Math.floor(Math.random() * 6)
  const placeholderName = useCallback(() => {
    const names = ["Aria Stone", "Kai Maxwell", "Lena Garcia", "Finn Riley", "Maya Cole", "Leo Carter"]
    return names[pickRandom]
  },[],)

  return (
    <div className=' min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='flex border border-primary/25 flex-col lg:flex-row w-full max-w-5xl m-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        <div className='flex flex-col p-4 sm:p-8 w-full lg:w-1/2'>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='w-9 h-9 text-primary' />
            <span className='text-3xl  font-bold font-mono text-transparent bg-clip-text tracking-wider bg-gradient-to-r from-primary to-secondary'>LangChange</span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message}</span>
            </div>
          )}

          <div className='w-full'>

            {/* Form */}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-4'>
                <div>
                  <h2 className='font-semibold text-xl'>Create an Account</h2>
                  <p className='text-sm opacity-70'>Join LangChange and start your language learning adventure!</p>
                </div>

                <div className='space-y-3'>

                  {/* Full Name */}

                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>

                    <input type="text" placeholder={placeholderName()} className='input input-bordered' {...register("fullName")} required />
                  </div>

                  {/* Email */}

                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>

                    <input type="email" placeholder={`${placeholderName().replace(" ","")}@gamil.com `} className='input input-bordered' {...register("email")} required />
                  </div>

                  {/* Password */}

                  <div className='form-control relative w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>

                    <input type={`${showPassword ? "text" : "password"}`} placeholder="*******" className='input input-bordered' {...register("password")} required />

                    {showPassword ? < Eye className='absolute right-5 top-12 cursor-pointer' onClick={()=>{setShowPassword(false)}} /> : < EyeClosed className='absolute right-5 top-12 cursor-pointer' onClick={()=>{setShowPassword(true)}}/>}

                    <p className='text-xs mt-1 opacity-70'>Password must be at least 6 characters long</p>
                  </div>
                  
                  {/* Checkbox */}

                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-2'>

                      <input type="checkbox" className='checkbox checkbox-sm' required />

                      <span className='text-xs leading-tight'>I agree to the {" "}

                        <span className='text-primary hover:underline'>terms of service and {" "}</span>
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>

                </div>

                {/* Submit Form */}

                <button className='btn btn-primary w-full' type='submit' disabled={isPending}>
                    {isPending ? 
                    <div className='flex gap-2'>
                      <span>Signing up</span>
                      <span className="loading loading-dots loading-xs"></span>
                    </div> : "Create Account" }
                </button>
                      
                {/* Go to Login */}

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Already have an account? {" "}
                    <Link to={"/login"} className='text-primary hover:underline'>
                      Sign in
                    </Link>
                  </p>
                </div>

              </div>
            </form>
          </div>
        </div>
        
        {/* Image Section */}

        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src={illustration} alt="Language connection illustration" className='w-full h-full' />
            </div>

            <div className='text-center space-y-3 mt-6'>
                <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
                <p className='opacity-70'>Practice conversation, make friends and improve your language skills together</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default SignUpPage