import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Check if user is authenticated from localStorage - only once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    console.log('useAuth useEffect running'); // Debug log
    
    // Check for existing auth data
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('userData');
    
    console.log('useAuth - localStorage check:', { isLoggedIn, userData }); // Debug log
    
    if (isLoggedIn && userData) {
      // User is already logged in
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
      console.log('useAuth - User already authenticated:', parsedUser); // Debug log
    } else {
      // User is not authenticated
      setUser(null);
      setIsAuthenticated(false);
      console.log('useAuth - User not authenticated'); // Debug log
    }
    
    setIsLoading(false);
  }, []);

  // Function to login
  const login = (userData: any) => {
    console.log('Login function called with:', userData); // Debug log
    
    // Update localStorage first
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Then update state
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log('Login completed - State updated:', { userData, isAuthenticated: true }); // Debug log
  };

  // Function to logout
  const logout = () => {
    console.log('Logout function called'); // Debug log
    
    // Clear localStorage first
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    // Then update state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('Logout completed - State updated'); // Debug log
  };

  console.log('useAuth returning state:', { isAuthenticated, user, isLoading }); // Debug log

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}
