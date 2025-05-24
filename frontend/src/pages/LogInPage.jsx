import React, { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login } from '../lib/api.js';
import { toast } from "react-hot-toast"
import { Eye, EyeClosed, ShipWheelIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from "react-router";
import illustration from "../assets/i.png"

const LogInPage = () => {

  const [ showPassword, setShowPassword ] = useState(false);

  const queryClient = useQueryClient();
  const { register, handleSubmit, } = useForm()

  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
      toast.success("Login successfully")
    },
  });

  const onSubmit = (data) => {
    loginMutation(data);
  }

  const pickRandom = Math.floor(Math.random() * 6)
  const placeholderName = useCallback(() => {
    const names = ["Aria Stone", "Kai Maxwell", "Lena Garcia", "Finn Riley", "Maya Cole", "Leo Carter"]
    return names[pickRandom]
  },[],)

  return (
    <div className='min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">

      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          <div className='flex items-center justify-start mb-4 gap-2'>
            <ShipWheelIcon className='w-9 h-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              LangChange
            </span>
          </div>

          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error.response?.data.message}</span>
            </div>
          )}

          <div className='w-full'>

            {/* Form */}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Welcome Back</h2>
                  <p className='text-sm opacity-70'>Sign in to your account to continue your language journey
                  </p>
                </div>
                <div className='flex flex-col gap-3'>

                  {/* Email */}

                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder={`${placeholderName().replace(" ", "")}@gamil.com `} className='input input-bordered w-full'
                      {...register("email")}
                      required
                    />
                  </div>

                  {/* Password */}

                  <div className='form-control relative w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type={`${showPassword ? "text" : "password"}`}
                      placeholder='********'
                      className='input input-bordered w-full'
                      {...register("password")}
                      required
                    />
                    {showPassword ? < Eye className='absolute right-5 top-12 cursor-pointer' onClick={()=>{setShowPassword(false)}} /> : < EyeClosed className='absolute right-5 top-12 cursor-pointer' onClick={()=>{setShowPassword(true)}}/>}
                  </div>

                  {/* Submit Form */}

                  <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
                    {isPending ? (
                      <>
                        <span className='loading loading-spinner loading-xs'></span>
                        Signing in...
                      </>
                    ) : ("Sign In")}
                  </button>
                  
                  {/* Go to login */}

                  <div className='text-center mt-4'>
                    <p className='text-sm'>
                      Don't have an account?{" "}
                      <Link to={"/signup"} className='text-primary hover:underline'>
                        Create one
                      </Link>
                    </p>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        
         <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src={illustration} alt="illustration-image" className='w-full h-full' />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
              <p className='opacity-70'>
                Practice conversation, make friends, and improve your language skills together
              </p>
            </div>
          </div>
         </div>

      </div>
    </div>
  )
}

export default LogInPage