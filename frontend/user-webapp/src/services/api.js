import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5045/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  userLogin(usernameOrEmail, password) {
    return this.api.post('/User/login', { usernameOrEmail, password });
  }

  userRegister(userData) {
    return this.api.post('/User/register', userData);
  }

  getCourses(params = {}) {
    return this.api.get('/course', { params });
  }

  getCourse(id) {
    return this.api.get(`/course/${id}`);
  }

  getTopRatedCourses(count = 4) {
    return this.api.get('/course/top-rated', { params: { count } });
  }

  getRelatedCourses(id, count = 4) {
    return this.api.get(`/course/${id}/related`, { params: { count } });
  }

  getCategories() {
    return this.api.get('/category');
  }

  getCart() {
    return this.api.get('/cart');
  }

  addToCart(courseId) {
    return this.api.post('/cart', courseId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  removeFromCart(courseId) {
    return this.api.delete(`/cart/${courseId}`);
  }

  clearCart() {
    return this.api.delete('/cart');
  }

  processPurchase(purchaseData) {
    return this.api.post('/purchase', purchaseData);
  }

  getPurchases() {
    return this.api.get('/purchase');
  }

  hasPurchasedCourse(courseId) {
    return this.api.get(`/purchase/check/${courseId}`);
  }
}

export const apiService = new ApiService();
