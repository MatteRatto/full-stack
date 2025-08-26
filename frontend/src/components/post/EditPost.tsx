import LoadingSpinner from "@/components/common/LoadingSpinner";
import PrivateRoute from "@/components/common/PrivateRoute";
import postsService from "@/services/PostService";
import type { Post } from "@/types/post.types";
import { ROUTES } from "@/utils/constants";
import { postSchema, type PostFormData } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

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
      setValue("title", postData.title);
      setValue("content", postData.content);
    } catch (error: any) {
      toast.error(error.message || "Errore nel caricamento del post");
      navigate(ROUTES.POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    if (!post) return;

    try {
      setIsSaving(true);
      await postsService.updatePost(post.id, data);
      toast.success("Post aggiornato con successo!");
      navigate(`/posts/${post.id}`);
    } catch (error: any) {
      toast.error(error.message || "Errore nell'aggiornamento del post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateRoute>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="lg" />
        </div>
      </PrivateRoute>
    );
  }

  return (
    <>
      <Helmet>
        <title>Modifica: {post?.title} - MR app</title>
        <meta name="description" content="Modifica il tuo post" />
      </Helmet>

      <PrivateRoute>
        <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="max-w-3xl mx-auto w-full">
            <div className="mb-6">
              <nav className="mb-4 text-left">
                <button
                  onClick={() => navigate(`/posts/${post?.id}`)}
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
                  Torna al post
                </button>
              </nav>

              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Modifica Post
                </h1>
                <p className="mt-1 text-gray-600">
                  Aggiorna il contenuto del tuo post
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Titolo
                    </label>
                    <input
                      {...register("title")}
                      id="title"
                      type="text"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contenuto
                    </label>
                    <textarea
                      {...register("content")}
                      id="content"
                      rows={4}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.content ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm resize-vertical`}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.content.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Minimo 10 caratteri, massimo 5000 caratteri
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(`/posts/${post?.id}`)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Annulla
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <LoadingSpinner size="sm" className="text-white mr-2" />
                        Salvando...
                      </>
                    ) : (
                      "Salva Modifiche"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PrivateRoute>
    </>
  );
};

export default EditPost;
