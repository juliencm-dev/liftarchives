import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { Viewport } from 'next';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

// import menMaster from "@/db/data/updated-men-masters-data.json";
// import womenMaster from "@/db/data/updated-women-masters-data.json";
// import { CompetitionCategoryDetails } from "@/db/schema";
// import { CompetitionCategoryDetailsDto } from "@/db/data-access/dto/lifts/types";
// import { addCompetitionCategoryDetails } from "@/db/data-access/lifts";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Lift Archives',
    description: 'Your personnal weightlifting journal',
    manifest: '/manifest.json',
    icons: { apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // menMaster.forEach(lift => {
    //   const newCategory = lift as CompetitionCategoryDetailsDto;
    //   newCategory.division = "master";
    //   newCategory.gender = "male";
    //   addCompetitionCategoryDetails(newCategory as CompetitionCategoryDetailsDto);
    // });

    // womenMaster.forEach(lift => {
    //   const newCategory = lift as CompetitionCategoryDetailsDto;
    //   newCategory.division = "master";
    //   newCategory.gender = "female";
    //   addCompetitionCategoryDetails(newCategory as CompetitionCategoryDetailsDto);
    // });

    return (
        <html lang="en">
            <body className={cn(inter.className)}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
