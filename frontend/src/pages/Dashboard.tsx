import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import instance from "../utils/api";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import CommonDialog from "../components/CommonDialog";
import CandidateForm from "../components/CandidateForm";
import CandidateList from "../components/CandidateList";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../components/ui/dialog";
import { NotesInterface } from "../components/NotesInterface";

interface Candidate {
    _id: string;
    name: string;
    email: string;
}

const Dashboard = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [addOpen, setAddOpen] = useState(false);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/candidates/getall");
            setCandidates(response?.data?.data || []);
        } catch (err) {
            console.error("Error fetching candidates data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    return (
        <div className="pl-4 pr-4 pt-14">
            <Navbar />
            <div className="flex justify-between items-center mb-4 mt-4">
                <h1 className="text-xl font-bold ">Candidates List</h1>
                <CommonDialog
                    trigger={<Button className="cursor-pointer">Add Candidate</Button>}
                    title="Add New Candidate"
                    open={addOpen}
                    onOpenChange={setAddOpen}
                    showCloseButton={false}
                >
                    <CandidateForm onSuccess={fetchCandidates} onClose={() => setAddOpen(false)} />
                </CommonDialog>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <Loader2Icon className="animate-spin w-6 h-6" />
                </div>
            ) : (
                <CandidateList
                    candidates={candidates}
                    onSelectCandidate={(candidate) => setSelectedCandidate(candidate)}
                />
            )}

            {selectedCandidate && (
                <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Candidate <span className="text-blue-600">{selectedCandidate.name}</span> </DialogTitle>
                        </DialogHeader>
                        <NotesInterface candidateId={selectedCandidate._id} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Dashboard;
