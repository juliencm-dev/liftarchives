import { Dumbbell } from 'lucide-react';

const footerLinks = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
    ],
    company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
    ],
    legal: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Contact', href: '/contact' },
    ],
};

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

                    {/* Product Links */}
                    <div>
                        <h4 className="text-sm font-medium text-foreground mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
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

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-medium text-foreground mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
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

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-sm font-medium text-foreground mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
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
