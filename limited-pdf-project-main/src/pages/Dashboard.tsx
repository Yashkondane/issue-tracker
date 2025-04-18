
import { useEffect, useState } from "react";
import { IssueCard } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/server/api";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "@/types/issue";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/components/DashboardStats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("newest");

  const { data: issues = [], isLoading } = useQuery<Issue[]>({
    queryKey: ["issues"],
    queryFn: api.getAllIssues,
  });

  // Filter and sort issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === "priority") {
      const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  // Stagger animation effect for cards
  useEffect(() => {
    const cards = document.querySelectorAll('.issue-card');
    cards.forEach((card, index) => {
      card.classList.add('animate-fade-in');
      (card as HTMLElement).style.animationDelay = `${index * 0.05}s`;
    });
  }, [sortedIssues]);

  const getActiveFilters = () => {
    const active = [];
    if (statusFilter !== "all") active.push(`Status: ${statusFilter}`);
    if (priorityFilter !== "all") active.push(`Priority: ${priorityFilter}`);
    return active;
  }

  const activeFilters = getActiveFilters();

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSearchQuery("");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-primary animate-bounce"></div>
          <div className="h-4 w-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-4 w-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          <span className="ml-2">Loading issues</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Issue Tracker
          </h1>
          <Button
            onClick={() => navigate("/issue/new")}
            className="transition-all hover:scale-105 shadow-md"
          >
            <Plus className="mr-2" />
            New Issue
          </Button>
        </div>

        {/* Stats Section */}
        <DashboardStats issues={issues} />

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="font-normal">
                {filter}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
              Clear all
            </Button>
          </div>
        )}

        {/* Sort Section */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {sortedIssues.length} issue{sortedIssues.length !== 1 ? 's' : ''} found
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort by: {sortOrder === "newest" ? "Newest" : sortOrder === "oldest" ? "Oldest" : "Priority"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priority")}>
                Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIssues.map((issue) => (
            <div key={issue.id} className="issue-card opacity-0">
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>

        {sortedIssues.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground mb-2">No issues found.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new issue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
