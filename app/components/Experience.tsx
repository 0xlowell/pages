'use client';

import { motion } from 'framer-motion';

const experiences = [
    {
        category: "Assurance",
        role: "Visual RAG & Multimodal Search",
        description: "Multimodal RAG on confidential documents (text, graphs/diagrams) with grounded generation.",
        tech: "Azure AI Search, Python, Azure Functions"
    },
    {
        category: "Bid Management",
        role: "Intelligent Profile Matching",
        description: "Matching profiles ↔ JD with skills ontology, multi-level metadata, and business-logic reranking.",
        tech: "Hybrid Retrieval, Embeddings, Context Engineering"
    },
    {
        category: "Internal DevOps",
        role: "Teams Bot Orchestration",
        description: "Teams bot connected to Azure Boards to automate work item management (Stories, AC, estimations).",
        tech: "Bot Framework, Azure DevOps API, Entra ID"
    },
    {
        category: "Public Sector",
        role: "Sovereign GenAI Platform",
        description: "AKS + Open WebUI platform with SSO and observability for scaling LLM experiments.",
        tech: "Kubernetes (AKS), Helm, OpenTelemetry"
    },
    {
        category: "R&D",
        role: "Agentic Prototypes",
        description: "Multi-role agents, reproducible LLM benchmarks, and low-token RSS→Newsletter pipelines.",
        tech: "AutoGen, LangChain, Python Optimization"
    }
];

export default function Experience() {
    return (
        <section className="py-24 px-4 max-w-5xl mx-auto relative z-10" id="experience">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16 ml-12"
            >
                <h2 className="text-3xl font-light tracking-tight text-slate-800 mb-2">Experiences & Contexts</h2>
                <p className="text-slate-500 font-light">Deploying intelligence across industries.</p>
            </motion.div>

            <div className="relative border-l border-slate-200 ml-4 space-y-8">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="pl-8 relative"
                    >
                        <span className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50" />

                        <div className="glass-card p-6 rounded-xl hover:bg-white/70 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                <h3 className="text-lg font-medium text-slate-900">{exp.role}</h3>
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 px-2 py-1 rounded bg-indigo-50/50">
                                    {exp.category}
                                </span>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-4 max-w-3xl">
                                {exp.description}
                            </p>

                            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                {exp.tech}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
