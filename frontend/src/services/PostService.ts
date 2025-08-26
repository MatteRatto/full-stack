import type {
  CreatePostData,
  Post,
  PostsResponse,
  UpdatePostData,
} from "@/types/post.types";
import apiService from "./api";

class PostsService {
  async getAllPosts(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PostsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await apiService.get<Post[]>(
      `/posts?${params.toString()}`
    );

    if (response.success && response.data) {
      return {
        posts: response.data,
        pagination: (response as any).pagination || {
          page,
          limit,
          total: response.data.length,
          pages: 1,
        },
      };
    }

    throw new Error(response.error || "Errore nel recupero dei post");
  }

  async getMyPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<PostsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiService.get<Post[]>(
      `/posts/my-posts?${params.toString()}`
    );

    if (response.success && response.data) {
      return {
        posts: response.data,
        pagination: (response as any).pagination || {
          page,
          limit,
          total: response.data.length,
          pages: 1,
        },
      };
    }

    throw new Error(response.error || "Errore nel recupero dei tuoi post");
  }

  async getPostById(id: number): Promise<Post> {
    const response = await apiService.get<Post>(`/posts/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Post non trovato");
  }

  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await apiService.post<Post>("/posts", postData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Errore nella creazione del post");
  }

  async updatePost(id: number, postData: UpdatePostData): Promise<Post> {
    const response = await apiService.put<Post>(`/posts/${id}`, postData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Errore nell'aggiornamento del post");
  }

  async deletePost(id: number): Promise<void> {
    const response = await apiService.delete(`/posts/${id}`);

    if (!response.success) {
      throw new Error(response.error || "Errore nell'eliminazione del post");
    }
  }
}

export const postsService = new PostsService();
export default postsService;
