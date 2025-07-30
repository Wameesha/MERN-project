import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFriendRequests, acceptFriendRequest } from "../lib/api"; 
import { BellIcon, ClockIcon, MessageSquare, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";

const NotificationsPage = () => {

  const queryClient = useQueryClient();

  const {data: friendRequests, isLoading} = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
    onSuccess: (data) => {
      console.log("Friend requests data:", data);
    },
    onError: (error) => {
      console.error("Error fetching friend requests:", error);
    },
  });

  const {mutate: acceptRequestMutation, isPending} = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data) => {
      console.log("Friend request accepted successfully:", data);
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
      queryClient.invalidateQueries({queryKey: ['friends']});
    },
    onError: (error) => {
      console.error("Error accepting friend request:", error);
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  console.log("Incoming requests:", incomingRequests);
  console.log("Accepted requests:", acceptedRequests);
  console.log("Total incoming requests:", incomingRequests.length);

  // Debug profile pics
  incomingRequests.forEach((req, index) => {
    console.log(`Incoming request ${index} profile pic:`, req.sender?.profilepic);
  });
  
  acceptedRequests.forEach((req, index) => {
    console.log(`Accepted request ${index} profile pic:`, req.recipient?.profilepic);
  });


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading  ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
           { incomingRequests.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold flex items-center gap-2 ">
                <UserCheckIcon className="size-5 text-primary" />
                Friend Requests
                <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

              <div className=" space-y-3">
                {incomingRequests.map((request) => (
                  <div 
                    key={request._id} 
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow ">

                   <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full">
                            <img 
                              src={request.sender.profilepic} 
                              alt={request.sender.fullName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.sender.fullName}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span className="badge badge-secondary badge-sm">
                              Native: {request.sender.nativeLanguage}
                            </span>
                            <span className="badge badge-secondary badge-sm">
                              Learning: {request.sender.learningLanguage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="btn btn-primary btn-sm"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isPending}
                      >
                        Accept
                      </button>

                    </div>

                   </div>
                  </div>
                ))}

              </div>
                
              
            </section>
           )}
          </>
        )}

        {/* Accepted Requests Section */}
        {acceptedRequests.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BellIcon className="size-5 text-success" />
              New Connections
            </h2>

            <div className="space-y-3">
              {acceptedRequests.map((notifications) => (
                <div 
                  key={notifications._id} 
                  className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">

                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          <img 
                            src={notifications.recipient.profilepic} 
                            alt={notifications.recipient.fullName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{notifications.recipient.fullName}</h3>
                        <p className="text-sm my-1">
                          {notifications.recipient.fullName} accepted your friend request
                        </p>
                        <p className="text-xs flex items-center opacity-70">
                          <ClockIcon className="mr-1 size-3" />
                          Recently
                        </p>
                      </div>
                      <div className="badge badge-success">
                        <MessageSquare className="mr-1 size-3" />
                        New Friend
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
          <NoNotificationsFound />
        )}


      </div>
    </div>
  );
}
export default NotificationsPage;   