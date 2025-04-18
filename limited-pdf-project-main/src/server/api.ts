
import { Issue } from "@/types/issue";
import * as db from "./db";

// Simulate network delay for API calls
const SIMULATED_DELAY = 300;

// Add delay to simulate real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Log requests (for debugging purposes as required)
const logRequest = (method: string, endpoint: string, body?: any) => {
  console.log(`[${new Date().toISOString()}] ${method} ${endpoint}`, body ? body : "");
};

// API endpoints
export const api = {
  // GET /api/issues - Retrieve all issues
  getAllIssues: async (): Promise<Issue[]> => {
    logRequest("GET", "/api/issues");
    await delay(SIMULATED_DELAY);
    return db.getAllIssues();
  },

  // GET /api/issues/:id - Retrieve specific issue
  getIssueById: async (id: string): Promise<Issue> => {
    logRequest("GET", `/api/issues/${id}`);
    await delay(SIMULATED_DELAY);
    
    const issue = db.getIssueById(id);
    if (!issue) {
      throw new Error("Issue not found");
    }
    
    return issue;
  },

  // POST /api/issues - Create new issue
  createIssue: async (issueData: Omit<Issue, "id" | "createdAt">): Promise<Issue> => {
    logRequest("POST", "/api/issues", issueData);
    
    // Input validation
    if (!issueData.title.trim()) {
      throw new Error("Title is required");
    }
    
    if (!issueData.description.trim()) {
      throw new Error("Description is required");
    }
    
    await delay(SIMULATED_DELAY);
    return db.createIssue(issueData);
  },

  // PUT /api/issues/:id - Update existing issue
  updateIssue: async (id: string, updates: Partial<Omit<Issue, "id" | "createdAt">>): Promise<Issue> => {
    logRequest("PUT", `/api/issues/${id}`, updates);
    
    // Input validation
    if (updates.title && !updates.title.trim()) {
      throw new Error("Title cannot be empty");
    }
    
    if (updates.description && !updates.description.trim()) {
      throw new Error("Description cannot be empty");
    }
    
    await delay(SIMULATED_DELAY);
    
    const updatedIssue = db.updateIssue(id, updates);
    if (!updatedIssue) {
      throw new Error("Issue not found");
    }
    
    return updatedIssue;
  },

  // DELETE /api/issues/:id - Remove an issue
  deleteIssue: async (id: string): Promise<void> => {
    logRequest("DELETE", `/api/issues/${id}`);
    await delay(SIMULATED_DELAY);
    
    const success = db.deleteIssue(id);
    if (!success) {
      throw new Error("Issue not found");
    }
  }
};
