import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";


interface Candidate {
    _id: string;
    name: string;
    email: string;
}

interface CandidateListProps {
    candidates: Candidate[];
    onSelectCandidate?: (candidate: Candidate) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates, onSelectCandidate }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {candidates?.map((candidate) => (
                <Card
                    key={candidate._id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onSelectCandidate?.(candidate)}
                >
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-gray-900">{candidate.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">{candidate.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Candidate Notes View</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CandidateList;
