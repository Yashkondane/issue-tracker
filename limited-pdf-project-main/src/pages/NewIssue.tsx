
import { useState } from "react";
import { IssueForm } from "@/components/IssueForm";
import { api } from "@/server/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Issue } from "@/types/issue";

const NewIssue = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Issue, "id" | "createdAt">) => {
    setIsSubmitting(true);
    await api.createIssue(data);
    setIsSubmitting(false);
  };

  return (
    <div className="container py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <IssueForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title="Create New Issue"
      />
    </div>
  );
};

export default NewIssue;
