export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
