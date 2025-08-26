import { useAuth } from "@/context/AuthContext";
import type { Post } from "@/types/post.types";
import { formatDate, getInitials } from "@/utils/helpers";
import React from "react";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user?.id === post.user_id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600">
                {getInitials(post.author_name)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {post.author_name}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/posts/edit/${post.id}`}
                className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-md hover:bg-gray-100"
                title="Modifica post"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <Link to={`/posts/${post.id}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h3>
          <div className="text-gray-700 leading-relaxed">
            {post.content.length > 300 ? (
              <p>{post.content.substring(0, 300)}...</p>
            ) : (
              <p>{post.content}</p>
            )}
          </div>
        </Link>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">Post #{post.id}</span>
              {post.updated_at !== post.created_at && (
                <span className="text-xs text-gray-500">
                  Modificato: {formatDate(post.updated_at)}
                </span>
              )}
            </div>

            <Link
              to={`/posts/${post.id}`}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Leggi tutto →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
