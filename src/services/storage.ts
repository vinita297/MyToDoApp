import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Todo } from '../types';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const TODOS_KEY = 'todos';

export const StorageService = {
  // User management
  async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getUsers();
      const existingUserIndex = users.findIndex(u => u.id === user.id);
      
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }
      
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async setCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.email === email) || null;
  },

  // Todo management
  async getTodos(userId: string): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(`${TODOS_KEY}_${userId}`);
      return todosJson ? JSON.parse(todosJson) : [];
    } catch (error) {
      console.error('Error getting todos:', error);
      return [];
    }
  },

  async saveTodos(userId: string, todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`${TODOS_KEY}_${userId}`, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  },

  async addTodo(userId: string, todoText: string): Promise<Todo> {
    const todos = await this.getTodos(userId);
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: todoText,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    todos.push(newTodo);
    await this.saveTodos(userId, todos);
    return newTodo;
  },

  async updateTodo(userId: string, todoId: string, updates: Partial<Todo>): Promise<void> {
    const todos = await this.getTodos(userId);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex >= 0) {
      todos[todoIndex] = { ...todos[todoIndex], ...updates, updatedAt: new Date() };
      await this.saveTodos(userId, todos);
    }
  },

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const todos = await this.getTodos(userId);
    const filteredTodos = todos.filter(todo => todo.id !== todoId);
    await this.saveTodos(userId, filteredTodos);
  },
};