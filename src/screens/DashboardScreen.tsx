import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { StorageService } from '../services/storage';
import { Todo } from '../types';
import TodoItem from '../components/TodoItem';

const DashboardScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userTodos = await StorageService.getTodos(user.id);
      setTodos(userTodos);
    } catch (error) {
      Alert.alert('Error', 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!user || !newTodoText.trim()) {
      Alert.alert('Error', 'Please enter a todo text');
      return;
    }

    try {
      const newTodo = await StorageService.addTodo(user.id, newTodoText.trim());
      setTodos(prev => [...prev, newTodo]);
      setNewTodoText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  const toggleTodo = async (todoId: string) => {
    if (!user) return;

    try {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;

      await StorageService.updateTodo(user.id, todoId, { completed: !todo.completed });
      setTodos(prev => 
        prev.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const editTodo = async (todoId: string, newText: string) => {
    if (!user) return;

    try {
      await StorageService.updateTodo(user.id, todoId, { text: newText });
      setTodos(prev => 
        prev.map(t => t.id === todoId ? { ...t, text: newText } : t)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!user) return;

    try {
      await StorageService.deleteTodo(user.id, todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todos.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Add Todo */}
        <View style={styles.addTodoContainer}>
          <TextInput
            style={styles.addTodoInput}
            placeholder="Add a new todo..."
            placeholderTextColor="#999"
            value={newTodoText}
            onChangeText={setNewTodoText}
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Todo List */}
        <View style={styles.todoListContainer}>
          <Text style={styles.sectionTitle}>Your Todos</Text>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading todos...</Text>
          ) : todos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No todos yet</Text>
              <Text style={styles.emptyStateSubtext}>Add your first todo above!</Text>
            </View>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TodoItem
                  todo={item}
                  onToggle={toggleTodo}
                  onEdit={editTodo}
                  onDelete={deleteTodo}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addTodoContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addTodoInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  todoListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default DashboardScreen;