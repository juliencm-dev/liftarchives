import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BackToDashboard = () => {
    return (
        <Button
            variant="link"
            asChild
            className="hidden md:inline-flex -ml-2 mb-2 h-auto w-fit gap-1.5 px-2 py-1 text-sm"
        >
            <Link to="/dashboard">
                <ArrowLeft className="size-3.5" />
                Back to Dashboard
            </Link>
        </Button>
    );
};
