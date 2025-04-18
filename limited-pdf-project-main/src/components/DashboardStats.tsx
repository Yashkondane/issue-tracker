import { BarChart, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Issue } from "@/types/issue";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DashboardStatsProps {
  issues: Issue[];
}

export function DashboardStats({ issues }: DashboardStatsProps) {
  // Calculate stats
  const totalIssues = issues.length;
  const openIssues = issues.filter(issue => issue.status === "Open").length;
  const inProgressIssues = issues.filter(issue => issue.status === "In Progress").length;
  const closedIssues = issues.filter(issue => issue.status === "Closed").length;
  
  const highPriority = issues.filter(issue => issue.priority === "High").length;
  const mediumPriority = issues.filter(issue => issue.priority === "Medium").length;
  const lowPriority = issues.filter(issue => issue.priority === "Low").length;

  // Calculate completion percentage
  const completionPercentage = totalIssues ? Math.round((closedIssues / totalIssues) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="overflow-hidden transition-all hover:shadow-md glass-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
              <h3 className="text-2xl font-bold mt-1">{totalIssues}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{completionPercentage}% complete</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md glass-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open</p>
              <h3 className="text-2xl font-bold mt-1">{openIssues}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={totalIssues ? (openIssues / totalIssues) * 100 : 0} className="h-2 bg-muted/50" />
            <p className="text-xs text-muted-foreground mt-2">{totalIssues ? Math.round((openIssues / totalIssues) * 100) : 0}% of total</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md glass-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <h3 className="text-2xl font-bold mt-1">{inProgressIssues}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={totalIssues ? (inProgressIssues / totalIssues) * 100 : 0} className="h-2 bg-muted/50" />
            <p className="text-xs text-muted-foreground mt-2">{totalIssues ? Math.round((inProgressIssues / totalIssues) * 100) : 0}% of total</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md glass-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Closed</p>
              <h3 className="text-2xl font-bold mt-1">{closedIssues}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={totalIssues ? (closedIssues / totalIssues) * 100 : 0} className="h-2 bg-muted/50" />
            <p className="text-xs text-muted-foreground mt-2">{totalIssues ? Math.round((closedIssues / totalIssues) * 100) : 0}% of total</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
