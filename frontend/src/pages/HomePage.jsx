import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getUserFriends, getRecommendedUsers, getOutgoingFriendReqs, sendFriendRequest } from "../lib/api";
import { UsersIcon, UserPlus, Loader2, MapPinIcon, CheckCircleIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from "../components/FriendCard.jsx";
import NoFriendFound from '../components/NoFriendFound.jsx';
import { getLanguageFlagUrl, capitalize } from '../lib/utils';



const HomePage = () => {

  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const {data: friends=[], isLoading: loadingFriends} = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const {data:recommendedUsers=[], isLoading: loadingUsers} = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const {data: outgoingFriendReqs=[]} = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const {mutate: sendRequestMutation , isPending} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data) => {
      console.log("Friend request sent successfully:", data);
      queryClient.invalidateQueries({queryKey: ["outgoingFriendReqs"]});
    },
    onError: (error) => {
      console.error("Error sending friend request:", error);
    },
  });

  useEffect(() => {
    const outgoingIds = new Set()
    if(outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        console.log("Outgoing request:", req); // Debug log
        outgoingIds.add(req.recipient._id);
      });
    }
    console.log("Outgoing request IDs:", outgoingIds); // Debug log
    setOutgoingRequestsIds(outgoingIds)
  }, [outgoingFriendReqs]);

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        {/* Friends Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to="/notifications" className='btn btn-outline btn-sm'>
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        { loadingFriends ? (
          <div className='flex justify-center py-12'>
           <span className='loading loading-spinner loading-lg'/>
          </div>
        ) :  friends.length === 0 ? (
          <NoFriendFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4'>
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users Section */}
        <section>
        <div className='mb-6 sm:mb-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Learners</h2>
              <p className='opacity-70 '>
                Discover perfect language exchange partners based on ypur profile
              </p>
            </div>
          </div>
        </div>

        {loadingUsers ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className='card bg-base-200 p-6 text-center'>
            <h3 className='font-semibold text-lg mb-2'>No Recommended Users Found</h3>
            <p className=' text-base-content opacity-70'>
              Check back later for new language partners!
            </p>
          </div>

        ) : (
          <div className='grid grid-cols-1  md:grid-cols-2  lg:grid-cols-3 gap-6'>
            {recommendedUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id)

              return(
                <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'> 

                <div className='card-body p-5 space-y-4'>
                  <div className='flex items-center gap-3 '>
                    <div className='avatar size-16 rounded-full'>
                      <img src={user.profilepic} alt={user.fullName}  />
                    </div>

                    <div>
                      <h3 className='font-semibold text-lg'>{user.fullName}</h3>
                      {user.location && (
                        <div className='flex items-center text-xs opacity-70 mt-1'>
                          <MapPinIcon className='mr-1 size-3' />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/*Languages with Flags*/}
                  <div className='flex flex-wrap gap-2'>
                    <span className="badge badge-secondary text-xs">
                      {getLanguageFlagUrl(user.nativeLanguage) && (
                        <img
                          src={getLanguageFlagUrl(user.nativeLanguage)}
                          alt={`${user.nativeLanguage} flag`}
                          className="h-3 mr-1 inline-block"
                        />
                      )}
                      Native: {capitalize(user.nativeLanguage)}
                    </span>

                    <span className="badge badge-secondary text-xs">
                      {getLanguageFlagUrl(user.learningLanguage) && (
                        <img
                          src={getLanguageFlagUrl(user.learningLanguage)}
                          alt={`${user.learningLanguage} flag`}
                          className="h-3 mr-1 inline-block"
                        />
                      )}
                      Learning: {capitalize(user.learningLanguage)}
                    </span>
                  </div> 

                  {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                  {/* Action Buttons */}
                  <button className={`btn w-full mt-2 ${
                    hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                  }`}
                    onClick={() => sendRequestMutation(user._id)}
                    disabled={hasRequestBeenSent || isPending}

                  >
                    {hasRequestBeenSent ? (
                      <>
                        <CheckCircleIcon className='mr-2 size-4' />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className='mr-2 size-4' />
                        Send Friend Request
                      </>
                    )}
                  </button>

               </div>
              </div>
              );
            })}
          </div>
        )}
        </section>
      </div>
    </div>
  )
  
};

export default HomePage;
