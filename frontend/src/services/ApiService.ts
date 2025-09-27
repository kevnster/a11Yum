import { ApiResponse } from '../types';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.a11yum.com') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<ApiResponse<any[]>> {
    return this.request('/restaurants');
  }

  async getRestaurant(id: string): Promise<ApiResponse<any>> {
    return this.request(`/restaurants/${id}`);
  }

  async searchRestaurants(query: string): Promise<ApiResponse<any[]>> {
    return this.request(`/restaurants/search?q=${encodeURIComponent(query)}`);
  }

  // User endpoints
  async getUser(id: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Accessibility endpoints
  async getAccessibilityFeatures(): Promise<ApiResponse<any[]>> {
    return this.request('/accessibility-features');
  }
}

export const apiService = new ApiService();
export default ApiService;
