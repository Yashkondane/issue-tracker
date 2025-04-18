
import { Issue } from "@/types/issue";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Clock, AlertTriangle, CheckCircle, Calendar, User } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
}

export function IssueCard({ issue }: IssueCardProps) {
  // Helper function to get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "destructive";
      case "In Progress":
        return "default";
      case "Closed":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Helper function to get badge variant based on priority
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case "In Progress":
        return <Clock className="h-3.5 w-3.5" />;
      case "Closed":
        return <CheckCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  // Format the date
  const formattedDate = format(new Date(issue.createdAt), "MMM d, yyyy");

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 glass-effect border-t-4 overflow-hidden" style={{
      borderTopColor: issue.status === "Open" 
        ? "hsl(var(--destructive))" 
        : issue.status === "In Progress" 
          ? "hsl(var(--primary))" 
          : "hsl(var(--secondary))"
    }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg group">
          <Link 
            to={`/issue/${issue.id}`} 
            className="inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left"
          >
            {issue.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 transition-all hover:line-clamp-none">
          {issue.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={getStatusVariant(issue.status)} 
            className="transition-all hover:scale-105 flex gap-1 items-center"
          >
            {getStatusIcon(issue.status)}
            {issue.status}
          </Badge>
          <Badge 
            variant={getPriorityVariant(issue.priority)}
            className="transition-all hover:scale-105"
          >
            {issue.priority}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          ID: {issue.id.slice(0, 4)}
        </div>
      </CardFooter>
    </Card>
  );
}
