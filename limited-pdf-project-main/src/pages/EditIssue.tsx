
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IssueForm } from "@/components/IssueForm";
import { api } from "@/server/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Issue } from "@/types/issue";
import { toast } from "@/components/ui/sonner";

const EditIssue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: Omit<Issue, "id" | "createdAt">) => {
    if (!id) return;
    
    setIsSubmitting(true);
    await api.updateIssue(id, data);
    setIsSubmitting(false);
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
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <IssueForm
        initialData={issue}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title="Edit Issue"
      />
    </div>
  );
};

export default EditIssue;
