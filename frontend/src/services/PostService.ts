import type {
  CreatePostData,
  Post,
  PostsResponse,
  UpdatePostData,
} from "@/types/post.types";
import apiService from "./api";

const generateDemoPosts = (currentUser: {
  id: number;
  name: string;
  email: string;
}): Post[] => [
  {
    id: 1,
    user_id: currentUser.id,
    title: "Benvenuto nella Demo!",
    content:
      "Questo è un post di esempio nella modalità demo. Puoi creare, modificare ed eliminare post liberamente. Tutti i dati sono memorizzati localmente e non vengono salvati su un server reale.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
    author_name: currentUser.name,
    author_email: currentUser.email,
  },
  {
    id: 2,
    user_id: currentUser.id,
    title: "Come funziona la modalità demo",
    content:
      "La modalità demo simula completamente il comportamento del backend. Puoi:\n\n• Creare nuovi post\n• Modificare i tuoi post esistenti\n• Eliminare post\n• Cercare tra i post\n• Navigare tra le pagine\n\nTutti i dati sono temporanei e verranno persi al refresh della pagina.",
    created_at: "2024-12-01T11:30:00Z",
    updated_at: "2024-12-01T11:30:00Z",
    author_name: currentUser.name,
    author_email: currentUser.email,
  },
  {
    id: 3,
    user_id: 2,
    title: "Post di un altro utente",
    content:
      "Questo post è stato creato da un altro utente demo. Noterai che non puoi modificarlo o eliminarlo perché non sei l'autore.",
    created_at: "2024-12-01T09:15:00Z",
    updated_at: "2024-12-01T09:15:00Z",
    author_name: "Test User",
    author_email: "test@test.com",
  },
  {
    id: 4,
    user_id: currentUser.id,
    title: "Funzionalità avanzate",
    content:
      "La demo include anche la paginazione e la ricerca. Prova a cercare 'demo' nella barra di ricerca per vedere come funziona il filtro dei contenuti.",
    created_at: "2024-12-01T08:45:00Z",
    updated_at: "2024-12-01T12:15:00Z",
    author_name: currentUser.name,
    author_email: currentUser.email,
  },
];

class DemoPostsStorage {
  private posts: Post[] = [];
  private nextId: number = 5;
  private initialized: boolean = false;

  constructor() {}

  private initializePosts(): void {
    if (this.initialized) return;

    const currentUser = this.getCurrentUser();
    this.posts = generateDemoPosts(currentUser);
    this.initialized = true;
  }

  getCurrentUserId(): number {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.id || 1;
    } catch {
      return 1;
    }
  }

  getCurrentUser(): { id: number; name: string; email: string } {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        id: user.id || 1,
        name: user.name || "Marco Bianchi",
        email: user.email || "marco.bianchi@demo.com",
      };
    } catch {
      return {
        id: 1,
        name: "Marco Bianchi",
        email: "marco.bianchi@demo.com",
      };
    }
  }

  getAllPosts(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): PostsResponse {
    this.initializePosts();

    let filteredPosts = [...this.posts];

    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.author_name.toLowerCase().includes(searchTerm)
      );
    }

    filteredPosts.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const total = filteredPosts.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  getMyPosts(page: number = 1, limit: number = 10): PostsResponse {
    this.initializePosts();

    const currentUserId = this.getCurrentUserId();
    const myPosts = this.posts.filter((post) => post.user_id === currentUserId);

    myPosts.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const total = myPosts.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = myPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  getPostById(id: number): Post | null {
    this.initializePosts();

    return this.posts.find((post) => post.id === id) || null;
  }

  createPost(postData: CreatePostData): Post {
    this.initializePosts();

    const currentUser = this.getCurrentUser();
    const now = new Date().toISOString();

    const newPost: Post = {
      id: this.nextId++,
      user_id: currentUser.id,
      title: postData.title,
      content: postData.content,
      created_at: now,
      updated_at: now,
      author_name: currentUser.name,
      author_email: currentUser.email,
    };

    this.posts.push(newPost);
    return newPost;
  }

  updatePost(id: number, postData: UpdatePostData): Post | null {
    this.initializePosts();

    const currentUserId = this.getCurrentUserId();
    const currentUser = this.getCurrentUser();
    const postIndex = this.posts.findIndex(
      (post) => post.id === id && post.user_id === currentUserId
    );

    if (postIndex === -1) {
      throw new Error("Post non trovato o non hai i permessi per modificarlo");
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      title: postData.title,
      content: postData.content,
      updated_at: new Date().toISOString(),
      author_name: currentUser.name,
      author_email: currentUser.email,
    };

    return this.posts[postIndex];
  }

  deletePost(id: number): boolean {
    this.initializePosts();

    const currentUserId = this.getCurrentUserId();
    const postIndex = this.posts.findIndex(
      (post) => post.id === id && post.user_id === currentUserId
    );

    if (postIndex === -1) {
      return false;
    }

    this.posts.splice(postIndex, 1);
    return true;
  }

  resetToDefaults(): void {
    const currentUser = this.getCurrentUser();
    this.posts = generateDemoPosts(currentUser);
    this.initialized = true;
  }

  updateUserPostsInfo(userId: number, newName: string, newEmail: string): void {
    this.posts = this.posts.map((post) => {
      if (post.user_id === userId) {
        return {
          ...post,
          author_name: newName,
          author_email: newEmail,
        };
      }
      return post;
    });
  }

  syncWithUserProfile(): void {
    const currentUser = this.getCurrentUser();
    this.updateUserPostsInfo(
      currentUser.id,
      currentUser.name,
      currentUser.email
    );
  }
}

const demoStorage = new DemoPostsStorage();

class PostsService {
  private isDemoMode(): boolean {
    try {
      const isDemoFromWindow = (window as any).__IS_DEMO_MODE__;
      if (typeof isDemoFromWindow === "boolean") {
        return isDemoFromWindow;
      }
    } catch (e) {}

    const token = localStorage.getItem("token");

    const isDemoToken =
      token === "demo-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

    if (isDemoToken) {
      return true;
    }

    const envDemo = import.meta.env.VITE_DEMO_MODE === "true";

    if (!token) {
      return true;
    }

    return envDemo;
  }

  async getAllPosts(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PostsResponse> {
    const demoMode = this.isDemoMode();

    if (demoMode) {
      demoStorage.syncWithUserProfile();

      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 500)
      );

      const result = demoStorage.getAllPosts(page, limit, search);
      return result;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const url = `/posts?${params.toString()}`;

    const response = await apiService.get<Post[]>(url);

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
    if (this.isDemoMode()) {
      demoStorage.syncWithUserProfile();

      await new Promise((resolve) =>
        setTimeout(resolve, 400 + Math.random() * 300)
      );

      return demoStorage.getMyPosts(page, limit);
    }

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
    if (this.isDemoMode()) {
      demoStorage.syncWithUserProfile();

      await new Promise((resolve) =>
        setTimeout(resolve, 200 + Math.random() * 200)
      );

      const post = demoStorage.getPostById(id);
      if (!post) {
        throw new Error("Post non trovato");
      }
      return post;
    }

    const response = await apiService.get<Post>(`/posts/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Post non trovato");
  }

  async createPost(postData: CreatePostData): Promise<Post> {
    if (this.isDemoMode()) {
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 400)
      );

      if (!postData.title || postData.title.trim().length < 3) {
        throw new Error("Il titolo deve essere di almeno 3 caratteri");
      }
      if (!postData.content || postData.content.trim().length < 10) {
        throw new Error("Il contenuto deve essere di almeno 10 caratteri");
      }
      if (postData.title.length > 255) {
        throw new Error("Il titolo non può superare i 255 caratteri");
      }
      if (postData.content.length > 5000) {
        throw new Error("Il contenuto non può superare i 5000 caratteri");
      }

      return demoStorage.createPost(postData);
    }

    const response = await apiService.post<Post>("/posts", postData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Errore nella creazione del post");
  }

  async updatePost(id: number, postData: UpdatePostData): Promise<Post> {
    if (this.isDemoMode()) {
      await new Promise((resolve) =>
        setTimeout(resolve, 600 + Math.random() * 400)
      );

      if (!postData.title || postData.title.trim().length < 3) {
        throw new Error("Il titolo deve essere di almeno 3 caratteri");
      }
      if (!postData.content || postData.content.trim().length < 10) {
        throw new Error("Il contenuto deve essere di almeno 10 caratteri");
      }
      if (postData.title.length > 255) {
        throw new Error("Il titolo non può superare i 255 caratteri");
      }
      if (postData.content.length > 5000) {
        throw new Error("Il contenuto non può superare i 5000 caratteri");
      }

      const updatedPost = demoStorage.updatePost(id, postData);
      if (!updatedPost) {
        throw new Error(
          "Post non trovato o non hai i permessi per modificarlo"
        );
      }
      return updatedPost;
    }

    const response = await apiService.put<Post>(`/posts/${id}`, postData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Errore nell'aggiornamento del post");
  }

  async deletePost(id: number): Promise<void> {
    if (this.isDemoMode()) {
      await new Promise((resolve) =>
        setTimeout(resolve, 400 + Math.random() * 300)
      );

      const success = demoStorage.deletePost(id);
      if (!success) {
        throw new Error("Post non trovato o non hai i permessi per eliminarlo");
      }
      return;
    }

    const response = await apiService.delete(`/posts/${id}`);

    if (!response.success) {
      throw new Error(response.error || "Errore nell'eliminazione del post");
    }
  }

  isDemoModeActive(): boolean {
    return this.isDemoMode();
  }

  resetDemoData(): void {
    if (this.isDemoMode()) {
      demoStorage.resetToDefaults();
    }
  }

  getDemoStats() {
    if (this.isDemoMode()) {
      const currentUserId = demoStorage.getCurrentUserId();
      const allPosts = demoStorage.getAllPosts(1, 1000).posts;
      const myPosts = allPosts.filter((post) => post.user_id === currentUserId);

      return {
        totalPosts: allPosts.length,
        myPosts: myPosts.length,
        otherUsersPosts: allPosts.length - myPosts.length,
      };
    }
    return null;
  }

  forceSyncDemoData(): void {
    if (this.isDemoMode()) {
      demoStorage.syncWithUserProfile();
    }
  }
}

export const postsService = new PostsService();
export default postsService;
