import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 bg-cream/95 backdrop-blur-md elevation-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-lg font-medium text-charcoal hover:text-charcoal/70 motion-standard">
                        Lowell ZIMA
                    </Link>
                    <div className="flex items-center space-x-8">
                        <a href="mailto:lowell.zima@pm.me" className="text-sm font-medium text-slate-900 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors">
                            lowell.zima@pm.me
                        </a>
                        {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                            GitHub
                        </a>
                        <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                            Medium
                        </a> */}
                    </div>
                </div>
            </div>
        </nav>
    );
}
