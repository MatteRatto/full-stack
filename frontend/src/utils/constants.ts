export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  POSTS: {
    GET_ALL: "/posts",
    GET_MY_POSTS: "/posts/my-posts",
    CREATE: "/posts",
    GET_BY_ID: (id: number) => `/posts/${id}`,
    UPDATE: (id: number) => `/posts/${id}`,
    DELETE: (id: number) => `/posts/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Login effettuato con successo!",
  LOGOUT_SUCCESS: "Logout effettuato con successo!",
  REGISTER_SUCCESS: "Registrazione completata con successo!",
  PROFILE_UPDATE_SUCCESS: "Profilo aggiornato con successo!",
  POST_CREATE_SUCCESS: "Post creato con successo!",
  POST_UPDATE_SUCCESS: "Post aggiornato con successo!",
  POST_DELETE_SUCCESS: "Post eliminato con successo!",
  GENERIC_ERROR: "Si è verificato un errore inaspettato",
  NETWORK_ERROR: "Errore di connessione. Riprova più tardi.",
  UNAUTHORIZED: "Accesso non autorizzato",
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "Questo campo è obbligatorio",
  INVALID_EMAIL: "Inserisci un'email valida",
  MIN_PASSWORD: "La password deve essere di almeno 6 caratteri",
  PASSWORD_REQUIREMENTS:
    "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero",
  MIN_NAME: "Il nome deve essere di almeno 2 caratteri",
  MIN_TITLE: "Il titolo deve essere di almeno 3 caratteri",
  MAX_TITLE: "Il titolo non può superare i 255 caratteri",
  MIN_CONTENT: "Il contenuto deve essere di almeno 10 caratteri",
  MAX_CONTENT: "Il contenuto non può superare i 5000 caratteri",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  POSTS: "/posts",
  CREATE_POST: "/posts/create",
  MY_POSTS: "/posts/my-posts",
  SINGLE_POST: (id: number) => `/posts/${id}`,
  EDIT_POST: (id: number) => `/posts/edit/${id}`,
  NOT_FOUND: "/404",
} as const;
