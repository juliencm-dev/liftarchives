import { Dumbbell } from 'lucide-react';

const footerSections = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Contact', href: '/contact' },
        ],
    },
];

function FooterLinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    return (
        <div>
            <h4 className="text-sm font-medium text-foreground mb-4">{title}</h4>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <a href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Dumbbell className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-semibold text-foreground">LiftArchives</span>
                        </a>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The platform for Olympic weightlifters to track, train, and compete at their best.
                        </p>
                    </div>

                    {footerSections.map((section) => (
                        <FooterLinkGroup key={section.title} title={section.title} links={section.links} />
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} LiftArchives. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
