export interface Test {
  type: string; // New: test type (e.g., "multiple_choice", "true_false", "audio_question")
  title: string;
  content: unknown; // Flexible content object that varies by test type
  audiofile?: File; // Optional file for upload
}

// Specific test type interfaces for better type safety
export interface MultipleChoiceTest extends Test {
  type: "multiple_choice";
  content: {
    text: string;
    answers: string[];
    correctAnswer?: string;
    audiofile?: string; // Path to audio file after upload
  };
}

export interface TrueFalseTest extends Test {
  type: "true_false";
  content: {
    text: string;
    correctAnswer: boolean;
    audiofile?: string;
  };
}

export interface AudioQuestionTest extends Test {
  type: "audio_question";
  content: {
    text: string;
    answers?: string[];
    audiofile: string; // Required for audio questions
  };
}

export class DataService {
  private baseUrl = this.getApiUrl();

  private getApiUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    // Проверяем есть ли протокол
    if (apiUrl.includes("://")) {
      return apiUrl;
    }

    // Если нет протокола, добавляем https
    return apiUrl.startsWith("localhost")
      ? `http://${apiUrl}`
      : `https://${apiUrl}`;
  }

  async request(
    url: string,
    method: string,
    body?: unknown,
    isJson: boolean = false
  ) {
    const token = localStorage.getItem("authToken");
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      // Add Content-Type for JSON requests
      if (isJson) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        body: body as BodyInit,
        credentials: "include",
        headers: {
          ...headers,
        },
      });

      return await response.json();
    } catch (error) {
      console.log("error in data service", error);
    }
  }

  async createTest(test: FormData) {
    return this.request("/tests", "POST", test); // FormData, no Content-Type needed
  }

  async deleteTest(id: string) {
    return this.request(`/tests/${id}`, "DELETE");
  }

  async getTests() {
    return this.request("/tests", "GET");
  }

  async login(username: string, password: string) {
    return this.request(
      "/auth/login",
      "POST",
      JSON.stringify({ username, password }),
      true // isJson = true
    );
  }

  async register(username: string, password: string) {
    return this.request(
      "/auth/register",
      "POST",
      JSON.stringify({ username, password }),
      true // isJson = true
    );
  }

  async getTest(id: string) {
    return this.request(`/tests/${id}`, "GET");
  }
}

export const dataService = new DataService();
