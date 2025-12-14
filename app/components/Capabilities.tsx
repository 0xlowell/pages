'use client';

import { motion } from 'framer-motion';

const capabilities = [
    {
        title: "Retrieval-First RAG",
        description: "Going beyond naive vector search. I build hybrid retrieval systems (BM25 + Embeddings) with intelligent chunking, metadata filtering, and semantic reranking."
    },
    {
        title: "Context Engineering",
        description: "The missing link in RAG. I reconstruct document identity from chunks and inject global context (Document-Level Grounding) so the model understands the full picture."
    },
    {
        title: "Agents & Tool Use",
        description: "Orchestrating agents with strict function boundaries. My focus is on safe, deterministic tool execution with human-in-the-loop validation for real-world actions."
    },
    {
        title: "Production & Platform",
        description: "Shipping to Azure/AKS. I prioritize observability (OTEL/logging), FinOps (Spot nodes), and sovereign deployments (Open WebUI) over pure demo capabilities."
    }
];

export default function Capabilities() {
    return (
        <section className="py-24 px-4 relative z-10 bg-slate-50/30 border-y border-slate-200" id="capabilities">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Core Competencies</h2>
                    <h3 className="text-3xl font-light text-slate-900">Engineering Intelligence</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 border border-slate-200 bg-white rounded-lg overflow-hidden">
                    {capabilities.map((cap, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 group hover:bg-slate-50 transition-colors relative"
                        >
                            <span className="text-xs font-mono text-indigo-500 mb-4 block">
                                0{index + 1}
                            </span>

                            <h4 className="text-lg font-medium text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                                {cap.title}
                            </h4>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                {cap.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
