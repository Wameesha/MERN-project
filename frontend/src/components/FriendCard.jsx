import { MessageCircle, Phone, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLanguageFlagUrl } from '../lib/utils';

const FriendCard = ({ friend }) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>
        {/*User info*/}
        <div className='flex items-center gap-3 mb-3'>
          <div className='avatar size-12'>
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className='font-semibold truncate'>{friend.fullName}</h3>
        </div>

        <div className='flex flex-wrap gap-1.5 mb-3'>
          <span className="badge badge-secondary text-xs">
            {getLanguageFlagUrl(friend.nativeLanguage) && (
              <img
                src={getLanguageFlagUrl(friend.nativeLanguage)}
                alt={`${friend.nativeLanguage} flag`}
                className="h-3 mr-1 inline-block"
              />
            )}
            Native: {friend.nativeLanguage}
          </span>

          <span className="badge badge-secondary text-xs">
            {getLanguageFlagUrl(friend.learningLanguage) && (
              <img
                src={getLanguageFlagUrl(friend.learningLanguage)}
                alt={`${friend.learningLanguage} flag`}
                className="h-3 mr-1 inline-block"
              />
            )}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

