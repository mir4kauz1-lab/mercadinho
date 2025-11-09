// Configuração da API
// IMPORTANTE: Substitua pelo IP da sua máquina na rede local
// Para descobrir seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
// Configuração da API
const API_URL = "https://santafe-dashboard.vercel.app/api";

export interface ClienteData {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Serviço de autenticação de clientes
export const clienteAPI = {
  // Cadastro de novo cliente
  register: async (dados: {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    endereco?: string;
  }): Promise<{ success: boolean; message: string; cliente?: ClienteData }> => {
    try {
      const response = await fetch(`${API_URL}/clientes/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  // Login de cliente
  login: async (
    email: string,
    senha: string
  ): Promise<{ success: boolean; message: string; cliente?: ClienteData }> => {
    try {
      const response = await fetch(`${API_URL}/clientes/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  // Buscar perfil do cliente
  getProfile: async (
    clienteId: string
  ): Promise<{ success: boolean; cliente?: ClienteData; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/clientes/profile?id=${clienteId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  // Atualizar perfil do cliente
  updateProfile: async (dados: {
    id: string;
    nome?: string;
    telefone?: string;
    endereco?: string;
    senhaAtual?: string;
    novaSenha?: string;
  }): Promise<{ success: boolean; message: string; cliente?: ClienteData }> => {
    try {
      const response = await fetch(`${API_URL}/clientes/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  // Validar se email já existe
  validateEmail: async (
    email: string
  ): Promise<{ success: boolean; exists: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/clientes/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao validar email:", error);
      return {
        success: false,
        exists: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },
};

// Serviço de produtos
export const produtosAPI = {
  // Listar todos os produtos
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  // Buscar produtos por categoria
  getByCategoria: async (categoriaId: string) => {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const data = await response.json();

      if (data.success) {
        // Filtra produtos pela categoria
        const produtosFiltrados = data.produtos.filter(
          (p: any) => p.categoria.id === categoriaId
        );
        return {
          success: true,
          produtos: produtosFiltrados,
        };
      }
      return data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },
};

// Serviço de categorias
export const categoriasAPI = {
  // Listar todas as categorias
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/categorias`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },
};

// Interface para dados do usuário
export interface UserData {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  createdAt: string;
  updatedAt: string;
}

// Serviço de usuário/perfil
export const userAPI = {
  // Buscar dados do usuário
  getUser: async (
    userId: string
  ): Promise<{ success: boolean; cliente?: UserData; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  // Atualizar dados do usuário
  updateUser: async (dados: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  }): Promise<{ success: boolean; message: string; cliente?: UserData }> => {
    try {
      const response = await fetch(`${API_URL}/user/${dados.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },
};

export default {
  clienteAPI,
  produtosAPI,
  categoriasAPI,
  userAPI,
};
