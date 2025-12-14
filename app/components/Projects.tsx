'use client';

import { motion } from 'framer-motion';

const projects = [
    {
        title: "Context-Aware CV Matching",
        context: "Bid Management",
        description: "Hybrid retrieval (BM25 + embeddings) pipeline that reconstructs document identity from chunks. Enables the model to compare full profiles (CVs) against Job Descriptions with deep context.",
        tags: ["Context Engineering", "Hybrid Retrieval", "Metadata Filters"]
    },
    {
        title: "Sovereign GenAI Platform",
        context: "Private Chat",
        description: "AKS deployment centered on Open WebUI. Provides client sovereignty (no public SaaS), Cost/FinOps controls, and SSO integration for secure enterprise adoption.",
        tags: ["AKS", "Open WebUI", "FinOps", "Sovereign"]
    },
    {
        title: "Visual RAG",
        context: "Assurance / PMO",
        description: "Pipeline for confidential PMO documentation relying on charts & graphs. Structures ingestion so visuals remain searchable and grounded in the retrieval process.",
        tags: ["Multimodal", "Streamlit", "Azure AI"]
    },
    {
        title: "Agentic Operator Bot",
        context: "Internal DevOps",
        description: "Microsoft Teams bot integrated with Azure Boards. Retrieves work items and proposes updates via controlled workflows with strict human-in-the-loop validation.",
        tags: ["Bot Framework", "Agents", "Safety"]
    }
];

export default function Projects() {
    return (
        <section className="py-24 px-4 relative z-10 bg-white" id="projects">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 border-b border-slate-200 pb-8"
                >
                    <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Deployments</h2>
                    <h3 className="text-3xl font-light text-slate-900">Selected Case Studies</h3>
                </motion.div>

                <div className="flex flex-col">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group border-b border-slate-100 py-12 last:border-0 hover:bg-slate-50/50 transition-colors -mx-4 px-4 rounded-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Left: Context & Title */}
                                <div className="md:col-span-4">
                                    <span className="text-xs font-mono text-indigo-500 mb-2 block uppercase tracking-wider">
                                        {project.context}
                                    </span>
                                    <h4 className="text-xl font-medium text-slate-900 group-hover:text-indigo-900 transition-colors">
                                        {project.title}
                                    </h4>
                                </div>

                                {/* Middle: Description */}
                                <div className="md:col-span-5">
                                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Right: Tech Stack */}
                                <div className="md:col-span-3 flex flex-wrap content-start gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
