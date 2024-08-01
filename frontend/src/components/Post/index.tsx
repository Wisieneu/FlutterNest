import ShareBtn from './ShareBtn';
import CommentsBtn from './CommentsBtn';
import LikesBtn from './LikeBtn';
// import { Profile } from '../../types';

// TODO:
interface postProps {
  postId: string;
  author: string;
  textContent: string;
}

export default function Post(props: postProps) {
  return (
    <div className="flex shadow-lg md:mx-auto border-b border-gray-700">
      <div className="flex items-start px-8 py-6">
        <img
          className="w-12 h-12 rounded-full object-cover mr-4 shadow"
          src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
          alt="avatar"
        />
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold -mt-1">
              {props.author} · <span className="text-gray-600 text-sm">@atName</span>
            </h2>
            <small className="text-sm text-gray-600">22h ago</small>
          </div>

          <p className="mt-3 text-sm">{props.textContent}</p>

          <div className="interactions-container mt-4 flex items-center text-gray-500">
            <LikesBtn postId={23} likesAmount={55} />
            <CommentsBtn postId={23} commentAmount={55} />
            <ShareBtn postId={23} />
          </div>
        </div>
      </div>
    </div>
  );
}
