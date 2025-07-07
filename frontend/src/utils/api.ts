import { useAuth } from "@clerk/clerk-react";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useApi = () => {
    const { getToken } = useAuth();
    
    const makeRequest = async <T = any>(
      endpoint: string, 
      options: RequestOptions = {}
    ): Promise<T> => {
        const token = await getToken();
        const defaultOptions: RequestOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 429) {
                throw new Error("Daily quota exceeded");
            }
            throw new Error(errorData?.detail || "An error occurred");
        }

        return response.json();
    };

    return { makeRequest };
};