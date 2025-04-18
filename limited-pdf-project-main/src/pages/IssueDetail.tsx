
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Issue } from "@/types/issue";
import { api } from "@/server/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { IssueDeleteDialog } from "@/components/IssueDeleteDialog";
import { toast } from "@/components/ui/sonner";

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await api.getIssueById(id);
        setIssue(data);
      } catch (error) {
        toast.error("Failed to load issue details");
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssue();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await api.deleteIssue(id);
      toast.success("Issue deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error(`Failed to delete issue: ${(error as Error).message}`);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <p>Loading issue details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container py-8 text-center">
        <p>Issue not found</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{issue.title}</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate(`/issue/edit/${issue.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={getStatusVariant(issue.status)}>
              Status: {issue.status}
            </Badge>
            <Badge variant={getPriorityVariant(issue.priority)}>
              Priority: {issue.priority}
            </Badge>
            <Badge variant="outline">
              Created: {format(new Date(issue.createdAt), "MMM d, yyyy")}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
              {issue.description}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div></div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/issue/edit/${issue.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Issue
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete Issue
            </Button>
          </div>
        </CardFooter>
      </Card>

      <IssueDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default IssueDetail;
