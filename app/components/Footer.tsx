export default function Footer() {
    return (
        <footer className="bg-cream border-t border-charcoal/5 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-charcoal/40">
                        © {new Date().getFullYear()} Lowell ZIMA
                    </p>
                    {/* <div className="flex space-x-6">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-charcoal/40 hover:text-charcoal transition-colors text-sm"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://medium.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-charcoal/40 hover:text-charcoal transition-colors text-sm"
                        >
                            Medium
                        </a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
