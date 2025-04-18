
// Local storage key for our JSON data
const STORAGE_KEY = "issue-tracker-data";

// Initial data if none exists
const initialData = [
  {
    id: "1",
    title: "Login page not responding",
    description: "Users are unable to login when the server is under heavy load",
    status: "Open",
    priority: "High",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Dashboard shows incorrect stats",
    description: "User dashboard is showing last week's statistics instead of current data",
    status: "In Progress",
    priority: "Medium",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    title: "Button alignment issue on mobile",
    description: "The submit button is misaligned on mobile devices with screen width less than 375px",
    status: "Closed",
    priority: "Low",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

// Load data from localStorage
const loadData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveData(initialData);
    return initialData;
  }
  return JSON.parse(data);
};

// Save data to localStorage
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getAllIssues = () => {
  return loadData();
};

export const getIssueById = (id) => {
  const issues = loadData();
  return issues.find(issue => issue.id === id);
};

export const createIssue = (issue) => {
  const issues = loadData();
  const newIssue = {
    ...issue,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  issues.push(newIssue);
  saveData(issues);
  return newIssue;
};

export const updateIssue = (id, updates) => {
  const issues = loadData();
  const index = issues.findIndex(issue => issue.id === id);
  
  if (index === -1) return null;
  
  issues[index] = {
    ...issues[index],
    ...updates
  };
  
  saveData(issues);
  return issues[index];
};

export const deleteIssue = (id) => {
  const issues = loadData();
  const filteredIssues = issues.filter(issue => issue.id !== id);
  
  if (filteredIssues.length === issues.length) {
    return false;
  }
  
  saveData(filteredIssues);
  return true;
};
