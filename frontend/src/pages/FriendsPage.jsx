import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../lib/api";
import { MessageSquare, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { getLanguageFlagUrl } from "../lib/utils";

const FriendsPage = () => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    onSuccess: (data) => {
      console.log("Friends data:", data);
    },
    onError: (error) => {
      console.error("Error fetching friends:", error);
    },
  });

  console.log("Friends list:", friends);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          My Friends
        </h1>

        {friends && friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body p-5">
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full">
                        <img
                          src={friend.profilepic}
                          alt={friend.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg truncate">
                        {friend.fullName}
                      </h3>
                      {friend.location && (
                        <p className="text-sm text-base-content/60">
                          {friend.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {friend.bio && (
                    <p className="text-sm text-base-content/80 mb-3 line-clamp-2">
                      {friend.bio}
                    </p>
                  )}

                  {/* Language badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {friend.nativeLanguage && getLanguageFlagUrl(friend.nativeLanguage) && (
                      <div className="badge badge-primary gap-1">
                        <img 
                          src={getLanguageFlagUrl(friend.nativeLanguage)} 
                          alt={friend.nativeLanguage}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Native</span>
                      </div>
                    )}
                    {friend.learningLanguage && getLanguageFlagUrl(friend.learningLanguage) && (
                      <div className="badge badge-secondary gap-1">
                        <img 
                          src={getLanguageFlagUrl(friend.learningLanguage)} 
                          alt={friend.learningLanguage}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Learning</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/chat/${friend._id}`}
                      className="btn btn-primary btn-sm flex-1 gap-2"
                    >
                      <MessageSquare className="size-4" />
                      Chat
                    </Link>
                    <Link
                      to={`/call/${friend._id}`}
                      className="btn btn-secondary btn-sm flex-1 gap-2"
                    >
                      <Video className="size-4" />
                      Call
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">No Friends Yet</h3>
              <p className="text-base-content/60 mb-4">
                Start by connecting with recommended users on the home page!
              </p>
              <Link to="/" className="btn btn-primary">
                Find Friends
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
