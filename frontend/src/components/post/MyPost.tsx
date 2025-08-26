import LoadingSpinner from "@/components/common/LoadingSpinner";
import PrivateRoute from "@/components/common/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import postsService from "@/services/PostService";
import type { Post } from "@/types/post.types";
import { ROUTES } from "@/utils/constants";
import { getInitials } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PostCard from "./PostCard";

const MyPosts: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMyPosts = async (currentPage: number = 1) => {
    try {
      setIsLoading(true);
      const response = await postsService.getMyPosts(currentPage, 10);
      setPosts(response.posts);
      setTotalPages(response.pagination.pages);
      setPage(currentPage);
    } catch (error: any) {
      toast.error(error.message || "Errore nel caricamento dei tuoi post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo post?")) {
      return;
    }

    try {
      await postsService.deletePost(postId);
      toast.success("Post eliminato con successo!");
      loadMyPosts(page);
    } catch (error: any) {
      toast.error(error.message || "Errore nell'eliminazione del post");
    }
  };

  return (
    <>
      <Helmet>
        <title>I miei Post - MR app</title>
        <meta
          name="description"
          content="Gestisci tutti i tuoi post pubblicati"
        />
      </Helmet>

      <PrivateRoute>
        <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    I miei Post
                  </h1>
                  <p className="mt-1 text-gray-600">
                    Gestisci tutti i post che hai pubblicato
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <Link
                    to={ROUTES.POSTS}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Tutti i Post
                  </Link>
                  <Link
                    to={ROUTES.CREATE_POST}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Nuovo Post
                  </Link>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-600">
                        {getInitials(user?.name || "")}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {user?.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {isLoading
                          ? "Caricamento..."
                          : `${posts.length} post pubblicat${
                              posts.length === 1 ? "o" : "i"
                            }`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Non hai ancora pubblicato post
                </h3>
                <p className="mt-2 text-gray-500">
                  Inizia a condividere i tuoi pensieri con la community!
                </p>
                <div className="mt-6">
                  <Link
                    to={ROUTES.CREATE_POST}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Crea il tuo primo post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={() => handleDeletePost(post.id)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => loadMyPosts(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Precedente
                  </button>

                  <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                    Pagina {page} di {totalPages}
                  </span>

                  <button
                    onClick={() => loadMyPosts(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Successiva
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </PrivateRoute>
    </>
  );
};

export default MyPosts;
