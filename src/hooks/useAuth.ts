import { useState, useEffect } from "react";
import { User, AuthState } from "@/types/auth";

const STORAGE_KEY = "fisiotrack-auth";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Carregar estado de autenticação do localStorage
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user } = JSON.parse(stored);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar estado de autenticação:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulação de login - em um app real, isso seria uma chamada à API
    const users: User[] = [
      {
        id: "1",
        name: "Fisioterapeuta",
        email: "fisio@fisiotrack.com",
        password: "fisio123", // Em produção, usar hash
        role: "therapist",
      },
    ];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const authData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password, // Adicionando a propriedade password ausente
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      setAuthState({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } else {
      return { success: false, error: "Email ou senha incorretos" };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};