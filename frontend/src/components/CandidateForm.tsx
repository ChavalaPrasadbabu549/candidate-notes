import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";
import instance from "../utils/api";


interface CandidateFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

const CandidateForm = ({ onSuccess, onClose }: CandidateFormProps) => {
    const [newCandidate, setNewCandidate] = useState({ name: "", email: "" });
    const [adding, setAdding] = useState(false);

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            const response = await instance.post("/candidates/signup", newCandidate);
            if (response.status === 201) {
                setNewCandidate({ name: "", email: "" });
                toast.success(response?.data?.message || "Candidate added successfully");
                onSuccess();
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add candidate");
        } finally {
            setAdding(false);
        }
    };

    return (
        <form onSubmit={handleAddCandidate} className="space-y-4">
            <Input
                placeholder="Full Name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                required
            />
            <Input
                type="email"
                placeholder="Email"
                value={newCandidate.email}
                onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                required
            />
            <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={adding}>
                    {adding ? <Loader2Icon className="animate-spin w-5 h-5" /> : "Add"}
                </Button>
            </div>
        </form>
    );
};

export default CandidateForm;
