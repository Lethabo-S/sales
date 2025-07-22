import { User, LoginCredentials, RegisterCredentials } from '../types/auth';

// Mock authentication service - replace with real implementation
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Mock users database
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isEmailVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          marketing: false,
          security: true,
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowDirectMessages: true,
        },
      },
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      isEmailVerified: true,
      createdAt: '2024-01-02T00:00:00Z',
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: false,
          marketing: true,
          security: true,
        },
        privacy: {
          profileVisibility: 'private',
          showOnlineStatus: false,
          allowDirectMessages: true,
        },
      },
    },
  ];

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In real implementation, verify password hash
    if (credentials.email === 'admin@example.com' && credentials.password !== 'admin123') {
      throw new Error('Invalid email or password');
    }
    if (credentials.email === 'user@example.com' && credentials.password !== 'user123') {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return user;
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      role: 'user',
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          marketing: false,
          security: true,
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowDirectMessages: true,
        },
      },
    };

    this.mockUsers.push(newUser);

    const token = this.generateToken(newUser.id);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));

    return newUser;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (!token || !userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

    // Update in mock database
    const index = this.mockUsers.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      this.mockUsers[index] = updatedUser;
    }

    return updatedUser;
  }

  async resetPassword(email: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In real implementation, send reset email
    console.log(`Password reset email sent to ${email}`);
  }

  async refreshToken(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      throw new Error('No token found');
    }

    // In real implementation, refresh the token
    // For now, just check if token exists
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private generateToken(userId: string): string {
    // In real implementation, use proper JWT
    return `mock_token_${userId}_${Date.now()}`;
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.mockUsers;
  }

  async updateUserRole(userId: string, role: User['role']): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.mockUsers[userIndex].role = role;
    return this.mockUsers[userIndex];
  }
}

export const authService = new AuthService();