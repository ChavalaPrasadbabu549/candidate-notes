import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger, Dialog, DialogClose } from "./ui/dialog"


interface CommonDialogProps {
    trigger?: ReactNode;
    title: string;
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showCloseButton?: boolean;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
    trigger,
    title,
    children,
    open,
    onOpenChange,
    showCloseButton = true,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="mt-2">{children}</div>
                {showCloseButton && (
                    <div className="mt-4 text-right">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CommonDialog;
