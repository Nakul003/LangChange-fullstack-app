import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRecommendedUsers, getUserFriends, getOutgoingFriendReqs, sendFriendRequest } from '../lib/api.js';
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from "lucide-react";
import FriendCard from "../components/FriendCard.jsx"
import NoFriends from '../components/NoFriends.jsx';
import NoRecommendedUsers from "../components/NoRecommendedUsers.jsx";
import { useThemeStore } from "../store/ThemeStore.js";
import {getLanguageFlag} from "../components/FriendCard.jsx"
import { capitialize } from "../lib/utils.js";
import toast from "react-hot-toast"

const HomePage = () => {

  const queryClient = useQueryClient();
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());
  const { theme } = useThemeStore()

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends
  })

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  })

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  })

  const { mutate: sendRequestMutation, isPending, error } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
    onError: (error) => toast.error(error.response.data.message)
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req?.recipient._id)
      });

      setOutgoingRequestIds(outgoingIds);
    }
  }, [outgoingFriendReqs])


  return (
    <div className=' p-4 sm:p-6 lg:p-8' data-theme={theme} >
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to={"/notifications"} className='btn btn-outline btn-sm'>
            <UserIcon className='mr-2 w-4 h-4' />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends?.length === 0 ? (
          <NoFriends />)
         :
          (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>)
        }

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Learners</h2>
                <p className='opacity-70'>Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {
            loadingUsers ? (
              <div className='flex justify-center py-12'>
                <span className='loading loading-spinner loading-lg' />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <NoRecommendedUsers />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {recommendedUsers.map((user) => {

                  const hasRequestBeenSent = outgoingRequestIds.has(user._id)

                  return (
                    <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                      <div className='card-body p-5 space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className='avatar screen w-10   rounded-full'>
                            <img src={user?.profilePic} alt={user?.fullName} />
                          </div>

                          <div>
                            <h3 className='font-semibold  text-lg'>{user?.fullName}</h3>
                            {user?.location && (
                              <div className='flex items-center text-xs opacity-70 mt-1'>
                                < MapPinIcon className='w-3 h-3 mr-1' />
                                {user?.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-1.5'>
                          <span className='badge badge-secondary'>
                          {getLanguageFlag(user?.nativeLanguage)}
                            Native: {capitialize(user?.nativeLanguage)}
                          </span>
                          <span className='badge badge-outline'>
                          {getLanguageFlag(user?.learningLanguage)}
                            Learning: {capitialize(user?.learningLanguage)}
                          </span>
                        </div>

                        {user?.bio && <p className='text-sm opacity-70'>{user?.bio}</p>}

                        <button className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`} onClick={() => sendRequestMutation(user?._id)} disabled={hasRequestBeenSent || isPending}>
                          {hasRequestBeenSent ? (
                            <>
                              < CheckCircleIcon className='w-4 h-4 mr-2' />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className='w-4 h-4 mr-2' />
                              Send Friend Request
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </section>
      </div>
    </div>
  )
}

export default HomePage;

