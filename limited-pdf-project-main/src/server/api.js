
import * as db from "./db";

// Simulate network delay for API calls
const SIMULATED_DELAY = 300;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logRequest = (method, endpoint, body) => {
  console.log(`[${new Date().toISOString()}] ${method} ${endpoint}`, body ? body : "");
};

export const api = {
  getAllIssues: async () => {
    logRequest("GET", "/api/issues");
    await delay(SIMULATED_DELAY);
    return db.getAllIssues();
  },

  getIssueById: async (id) => {
    logRequest("GET", `/api/issues/${id}`);
    await delay(SIMULATED_DELAY);
    
    const issue = db.getIssueById(id);
    if (!issue) {
      throw new Error("Issue not found");
    }
    
    return issue;
  },

  createIssue: async (issueData) => {
    logRequest("POST", "/api/issues", issueData);
    
    if (!issueData.title.trim()) {
      throw new Error("Title is required");
    }
    
    if (!issueData.description.trim()) {
      throw new Error("Description is required");
    }
    
    await delay(SIMULATED_DELAY);
    return db.createIssue(issueData);
  },

  updateIssue: async (id, updates) => {
    logRequest("PUT", `/api/issues/${id}`, updates);
    
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

  deleteIssue: async (id) => {
    logRequest("DELETE", `/api/issues/${id}`);
    await delay(SIMULATED_DELAY);
    
    const success = db.deleteIssue(id);
    if (!success) {
      throw new Error("Issue not found");
    }
  }
};
