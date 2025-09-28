export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'therapist';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}