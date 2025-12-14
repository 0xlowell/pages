export default function Blog() {
    return (
        <section id="blog" className="py-24 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-medium text-charcoal mb-16">
                    Blog
                </h2>

                <div className="space-y-6">
                    <a
                        href="#"
                        className="group block relative elevation-1 hover:elevation-2 motion-standard rounded-2xl p-6 bg-cream border border-charcoal/5"
                    >
                        <h3 className="text-lg font-medium text-charcoal mb-2 group-hover:text-terracotta motion-standard">
                            Blog Post Title
                        </h3>
                        <p className="text-charcoal/60 leading-relaxed mb-3">
                            Preview of the blog post content exploring the intersection of engineering and creativity.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-charcoal/40">
                            <span>Jan 1, 2024</span>
                            <span>·</span>
                            <span>Medium</span>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
