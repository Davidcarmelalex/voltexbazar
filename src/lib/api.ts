const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
const SITE_BASE = API_BASE.replace(/\/api$/, "");

type JsonObject = Record<string, unknown>;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  subscription?: string;
  createdAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  icon?: string;
  image?: string;
  status?: string;
  earnings?: number;
  tasks?: number;
  uptime?: string;
  rating?: number;
  reviews?: number;
  time?: string;
  tags?: string[];
}

export interface Deployment {
  id: string;
  agentId: string;
  agent: Agent;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  vpsIp?: string | null;
  containerName?: string | null;
  deploymentMode?: string | null;
}

export interface Subscription {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  plan: string;
  paymentId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  userId: string;
  address: string;
  treasuryAddress?: string;
  subwalletId?: string;
  balance: number;
  pendingBalance?: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  date?: string;
}

export interface DashboardStats {
  totalEarnings: number;
  leadsGenerated: number;
  hoursSaved: number;
  activeAgents: number;
  revenueChange: number;
  leadsChange: number;
  hoursChange: number;
}

export interface Activity {
  id: number;
  action: string;
  agent: string;
  time: string;
  type: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  address: string;
  treasuryAddress?: string;
  subwalletId?: string;
  userDepositReference?: string;
  network: string;
  status?: string;
  confirmations?: number;
  expiresAt?: string;
  instructions?: string;
}

export interface PaymentConfig {
  token: string;
  chain: string;
  supportedTokens?: string[];
  supportedChains?: string[];
  paymentWindowMinutes: number;
  walletAddress: string;
  confirmationsRequired?: number;
  subwalletMode?: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  address: string;
  chain: string;
  currency: string;
  status: string;
  createdAt?: string;
}

class ApiClient {
  beginGoogleLogin() {
    if (typeof window !== "undefined") {
      window.location.href = `${SITE_BASE}/api/auth/google`;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers,
    });

    const data: { message?: string } & T = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ success: boolean; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, phone: string, password: string) {
    return this.request<{ success: boolean; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    });
  }

  async sendOTP(phone: string) {
    return this.request<{ success: boolean; message: string }>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, otp: string) {
    return this.request<{ success: boolean; user: User }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
  }

  async getMe() {
    return this.request<{ success: boolean; user: User }>("/auth/me");
  }

  async logout() {
    return this.request<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    });
  }

  // Agents
  async getAgents(params?: { category?: string; search?: string; sort?: string }) {
    const query = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    const queryString = query.toString();
    return this.request<{ success: boolean; agents: Agent[] }>(
      `/agents${queryString ? `?${queryString}` : ""}`
    );
  }

  async getAgent(id: string) {
    return this.request<{ success: boolean; agent: Agent }>(`/agents/${id}`);
  }

  async deployAgent(agentId: string, config?: JsonObject) {
    return this.request<{ success: boolean; deployment: Deployment }>("/agents/deploy", {
      method: "POST",
      body: JSON.stringify({ agentId, config }),
    });
  }

  async getUserAgents(userId: string) {
    return this.request<{ success: boolean; deployments: Deployment[] }>(`/agents/user/${userId}`);
  }

  async runAgent(deploymentId: string, input: string) {
    return this.request<{ success: boolean; output: string }>("/agents/run", {
      method: "POST",
      body: JSON.stringify({ deploymentId, input }),
    });
  }

  async stopAgent(deploymentId: string) {
    return this.request<{ success: boolean; deployment: Deployment }>("/agents/stop", {
      method: "POST",
      body: JSON.stringify({ deploymentId }),
    });
  }

  async startAgent(deploymentId: string) {
    return this.request<{ success: boolean; deployment: Deployment }>("/agents/start", {
      method: "POST",
      body: JSON.stringify({ deploymentId }),
    });
  }

  async activateSubscription(agentId: string, plan: string, paymentId: string) {
    return this.request<{ success: boolean; subscription: Subscription }>("/agents/activate-subscription", {
      method: "POST",
      body: JSON.stringify({ agentId, plan, paymentId }),
    });
  }

  async getMySubscription() {
    return this.request<{ success: boolean; subscription: Subscription | null }>("/agents/subscription/me");
  }

  // Payment
  async createPayment(amount: number, plan?: string) {
    return this.request<{ success: boolean; payment: Payment }>("/payment/create", {
      method: "POST",
      body: JSON.stringify({ amount, plan }),
    });
  }

  async getPaymentStatus(id: string) {
    return this.request<{ success: boolean; payment: Payment }>(`/payment/status/${id}`);
  }

  async getPaymentConfig() {
    return this.request<{ success: boolean; config: PaymentConfig }>("/payment/config");
  }

  async getWallet() {
    return this.request<{ success: boolean; wallet: Wallet }>("/payment/wallet/me");
  }

  async getTransactions() {
    return this.request<{ success: boolean; transactions: Transaction[] }>(
      "/payment/transactions/me"
    );
  }

  async withdraw(amount: number, address: string) {
    return this.request<{ success: boolean; message: string; withdrawal: Withdrawal }>("/payment/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount, address }),
    });
  }

  // Dashboard
  async getDashboardStats(userId: string) {
    return this.request<{ success: boolean; stats: DashboardStats }>(`/dashboard/stats/${userId}`);
  }

  async getRevenueData(userId: string) {
    return this.request<{ success: boolean; data: Array<{ name: string; value: number }> }>(
      `/dashboard/revenue/${userId}`
    );
  }

  async getActivity(userId: string) {
    return this.request<{ success: boolean; activities: Activity[] }>(`/dashboard/activity/${userId}`);
  }

  async getAgentPerformance(userId: string) {
    return this.request<{ success: boolean; agents: Agent[] }>(`/dashboard/agents/${userId}`);
  }

  // VPS
  async createVPS(plan: string) {
    const userId = "demo-user";
    return this.request<{ success: boolean; vps: JsonObject }>("/vps/create", {
      method: "POST",
      body: JSON.stringify({ userId, plan }),
    });
  }

  async getVPSStatus(vpsId: string) {
    return this.request<{ success: boolean; vps: JsonObject }>(`/vps/status/${vpsId}`);
  }

  async getVPSPlans() {
    return this.request<{ success: boolean; plans: Record<string, JsonObject> }>("/vps/plans");
  }
}

export const api = new ApiClient();
export default api;
