import LoadingSpinner from "@/components/common/LoadingSpinner";
import PrivateRoute from "@/components/common/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import postsService from "@/services/PostService";
import type { Post } from "@/types/post.types";
import { ROUTES } from "@/utils/constants";
import { formatDate, getInitials } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const postData = await postsService.getPostById(Number(id));
      setPost(postData);
    } catch (error: any) {
      toast.error(error.message || "Errore nel caricamento del post");
      navigate(ROUTES.POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    try {
      setIsDeleting(true);
      await postsService.deletePost(post.id);
      toast.success("Post eliminato con successo!");
      navigate(ROUTES.POSTS);
    } catch (error: any) {
      toast.error(error.message || "Errore nell'eliminazione del post");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </PrivateRoute>
    );
  }

  if (!post) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Post non trovato
            </h2>
            <Link
              to={ROUTES.POSTS}
              className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
            >
              Torna alla bacheca
            </Link>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  const isAuthor = user?.id === post.user_id;

  return (
    <>
      <Helmet>
        <title>{post.title} - MR app</title>
        <meta
          name="description"
          content={post.content.substring(0, 150) + "..."}
        />
      </Helmet>

      <PrivateRoute>
        <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto w-full">
            <nav className="mb-8">
              <Link
                to={ROUTES.POSTS}
                className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Torna alla bacheca
              </Link>
            </nav>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-600">
                        {getInitials(post.author_name)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.author_name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <time>{formatDate(post.created_at)}</time>
                        {post.updated_at !== post.created_at && (
                          <>
                            <span>•</span>
                            <span>
                              Modificato: {formatDate(post.updated_at)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isAuthor && (
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/posts/edit/${post.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Modifica
                      </Link>

                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Elimina
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <>
                                <LoadingSpinner
                                  size="sm"
                                  className="text-white mr-2"
                                />
                                Eliminazione...
                              </>
                            ) : (
                              "Conferma Eliminazione"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {post.content}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Post #{post.id}</span>
                    <span>•</span>
                    <span>{post.content.length} caratteri</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={ROUTES.POSTS}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Torna alla bacheca
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </PrivateRoute>
    </>
  );
};

export default SinglePost;
