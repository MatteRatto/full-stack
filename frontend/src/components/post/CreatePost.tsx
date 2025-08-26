import LoadingSpinner from "@/components/common/LoadingSpinner";
import PrivateRoute from "@/components/common/PrivateRoute";
import postsService from "@/services/PostService";
import { ROUTES } from "@/utils/constants";
import { postSchema, type PostFormData } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsLoading(true);
      await postsService.createPost(data);
      toast.success("Post creato con successo!");
      navigate(ROUTES.POSTS);
    } catch (error: any) {
      toast.error(error.message || "Errore nella creazione del post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nuovo Post - MR app</title>
        <meta
          name="description"
          content="Crea un nuovo post da condividere con la community"
        />
      </Helmet>

      <PrivateRoute>
        <div className="flex-1 flex flex-col justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Nuovo Post</h1>
              <p className="mt-1 text-gray-600">
                Condividi i tuoi pensieri con la community
              </p>
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
                      placeholder="Inserisci il titolo del post..."
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
                      rows={8}
                      placeholder="Scrivi il contenuto del tuo post..."
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

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.POSTS)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="text-white mr-2" />
                        Creazione...
                      </>
                    ) : (
                      "Pubblica Post"
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

export default CreatePost;
