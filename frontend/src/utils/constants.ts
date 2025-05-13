export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
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
  NOT_FOUND: "/404",
} as const;
