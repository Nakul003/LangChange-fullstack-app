import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { completeOnBoard } from '../lib/api'
import useAuthUser from '../hooks/useAuthUser'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheel, ShuffleIcon } from 'lucide-react'
import { LANGUAGES, LANGUAGE_TO_FLAG } from "../constants/index.js"

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [userData, setUserData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  })


  const { mutate: onBoardingMutation, isPending, error } = useMutation({
    mutationFn: completeOnBoard,
    onSuccess: () => {
      toast.success("Profile completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error) =>{
      toast.error(error.response.data.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onBoardingMutation(userData)
  }

  const handleRandomAvatar = async() => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    setUserData({ ...userData, profilePic:randomAvatar })
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-6 text-center'>Complete Your Profile</h1>

          {/* Form filling */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col space-y-4 justify-center items-center'>

              {/* Profile Avatar */}
              <div className='w-32 h-32 rounded-full bg-base-300 overflow-hidden'>
                {userData.profilePic ? (
                  <img src={userData.profilePic} alt="profileAvatar" className='w-full h-full object-cover' />) : (<div className='flex items-center justify-center h-full'>
                    <CameraIcon className='w-12 h-12 text-base-content opacity-40' />
                  </div>)}
              </div>

              {/* Generate random avatar */}

              <div className="flex gap-2 items-center">
                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                  <ShuffleIcon className='w-4 h-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>

            </div>

            {/* Full Name */}

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input type="text" value={userData.fullName} className='input input-bordered w-full' placeholder='Your full name' onChange={(e) => { setUserData({ ...userData, fullName: e.target.value }) }} />
            </div>

            { /* Bio */}

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea type="text" value={userData.bio} className='textarea textarea-bordered h-24' placeholder='Tell others about yourself and your language learning goals' onChange={(e) => { setUserData({ ...userData, bio: e.target.value }) }} />
            </div>

            { /* Language */}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/*Native Language  */}

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={userData.nativeLanguage}
                  onChange={(e) => setUserData({ ...userData, nativeLanguage: e.target.value })}
                  className='select select-bordered w-full'>
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>

              {/*Learning Language  */}

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={userData.learningLanguage}
                  onChange={(e) => setUserData({ ...userData, learningLanguage: e.target.value })}
                  className='select select-bordered w-full'>
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Location</span>
              </label>
              <div className='relative'>
                < MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 w-5 h-5 text-base-content opacity-70' />

                <input
                  type="text"
                  name='location'
                  value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  className='input input-bordered w-full pl-10'
                  placeholder='City, Country' />
              </div>
            </div>

            {/* Submit form */}

            <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
              {!isPending ? (
                <>
                  < ShipWheel className='w-5 h-5 mr-2' />
                  Complete Onboarding
                </>
              ) : 
              (<>
                < LoaderIcon className='animate-spin w-5 h-5 mr-2' />
                Onboarding...
              </>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default OnboardingPage