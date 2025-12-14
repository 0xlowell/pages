'use client';

import { motion } from 'framer-motion';

type PillarKey = 'research' | 'engineering' | 'infrastructure';

interface Skill {
    title: string;
    description: string;
    tags: string[];
}

interface PillarData {
    id: PillarKey;
    label: string;
    accentClass: string; // Tailored gradient/color for text
    borderClass: string;
    description: string;
    skills: Skill[];
}

const pillars: PillarData[] = [
    {
        id: 'research',
        label: 'Research',
        accentClass: 'text-rose-700 decoration-rose-200/50',
        borderClass: 'border-rose-100/50 hover:border-rose-200',
        description: 'Transforming theory into retrieval-centric intelligence.',
        skills: [
            {
                title: 'Advanced RAG',
                description: 'Hybrid retrieval (BM25 + Dense) with metadata-filtering and context-aware chunking.',
                tags: ['Hybrid Search', 'Reranking', 'Context Engineering']
            },
            {
                title: 'Agentic Workflows',
                description: 'Orchestrating multi-agent systems with controlled memory and specialized tools.',
                tags: ['AutoGen', 'CrewAI', 'Evaluations']
            },
            {
                title: 'Deep Research',
                description: 'Deep document understanding and automated knowledge synthesis.',
                tags: ['Metadata Design', 'Data Quality', 'Semantic Parsing']
            }
        ]
    },
    {
        id: 'engineering',
        label: 'Engineering',
        accentClass: 'text-slate-700 decoration-slate-200/50',
        borderClass: 'border-slate-100/50 hover:border-slate-200',
        description: 'Building the robust application layer that powers AI.',
        skills: [
            {
                title: 'Full Stack AI',
                description: 'Developing end-to-end solutions from Python backends to React/Angular interfaces.',
                tags: ['FastAPI', 'React', 'Python']
            },
            {
                title: 'System Integration',
                description: 'Seamlessly weaving AI into enterprise ecosystems (Teams Bots, SSO, APIs).',
                tags: ['Bot Framework', 'Entra ID', 'REST APIs']
            },
            {
                title: 'Performance',
                description: 'Optimized Python pipelines for token reduction and low-latency inference.',
                tags: ['Token Optimization', 'AsyncIO', 'Caching']
            }
        ]
    },
    {
        id: 'infrastructure',
        label: 'Infrastructure',
        accentClass: 'text-indigo-700 decoration-indigo-200/50',
        borderClass: 'border-indigo-100/50 hover:border-indigo-200',
        description: 'The sovereign, scalable backbone of production AI.',
        skills: [
            {
                title: 'Cloud Native (AKS)',
                description: 'Production Kubernetes management with Helm charts and zero-downtime deployments.',
                tags: ['Kubernetes', 'Helm', 'Docker']
            },
            {
                title: 'Cost Intelligence',
                description: 'Strategic use of Spot Nodes and autoscaling to minimize cloud spend.',
                tags: ['Spot Instances', 'FinOps', 'Autoscaling']
            },
            {
                title: 'DevOps & MLOps',
                description: 'Industrial-grade CI/CD pipelines and complete system observability.',
                tags: ['CI/CD', 'OpenTelemetry', 'Azure DevOps']
            }
        ]
    }
];

export default function AppliedAIPresentation() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-32 min-h-[90vh] flex flex-col justify-center items-center font-sans relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center mb-20"
            >
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-slate-800 mb-6 drop-shadow-sm">
                    Applied AI Engineer
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed mix-blend-multiply">
                    I bridge the gap between <span className="font-medium text-rose-600">Research</span>, <span className="font-medium text-slate-600">Engineering</span>, and <span className="font-medium text-indigo-600">Infrastructure</span>.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {pillars.map((pillar, index) => (
                    <motion.div
                        key={pillar.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className={`
              glass-panel 
              rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group
              ${pillar.borderClass}
            `}
                    >
                        {/* "Light" effect gradient that moves on hover could go here, for now a subtle highlight */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />

                        <div className="mb-10 relative z-10">
                            <h3 className={`text-3xl font-light tracking-tight mb-4 ${pillar.accentClass}`}>
                                {pillar.label}
                            </h3>
                            <p className="text-sm font-medium text-slate-500/90 leading-relaxed uppercase tracking-wide">
                                {pillar.description}
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 relative z-10">
                            {pillar.skills.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/40 hover:bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/40 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default"
                                >
                                    <h4 className="font-semibold text-slate-800 text-sm mb-1">{skill.title}</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                        {skill.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skill.tags.map(tag => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-white/50 px-2 py-1 rounded-md border border-white/60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
