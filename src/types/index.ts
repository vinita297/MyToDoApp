export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
};

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}