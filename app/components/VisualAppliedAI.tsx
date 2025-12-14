'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our graph data
type NodeType = 'root' | 'category' | 'project' | 'skill';

interface Node {
    id: string;
    label: string;
    type: NodeType;
    description?: string;
    x: number;
    y: number;
    r: number; // radius
}

interface Link {
    source: string;
    target: string;
}

// Data extracted from CV
const INITIAL_NODES: Node[] = [
    // Root
    { id: 'me', label: 'Applied AI Engineer', type: 'root', x: 400, y: 300, r: 40 },

    // Categories
    { id: 'ai', label: 'AI Engineering', type: 'category', x: 600, y: 200, r: 30 },
    { id: 'infra', label: 'Cloud & Infra', type: 'category', x: 600, y: 400, r: 30 },
    { id: 'design', label: 'Agentic Design', type: 'category', x: 200, y: 250, r: 30 },
    { id: 'rd', label: 'R&D', type: 'category', x: 200, y: 450, r: 30 },

    // AI Projects/Skills
    { id: 'rag', label: 'RAG Systems', type: 'skill', description: 'Advanced RAG on confidential docs, visual data, and CVs', x: 750, y: 150, r: 20 },
    { id: 'agents', label: 'Multi-Agent', type: 'skill', description: 'AutoGen, CrewAI, LangGraph workflows', x: 700, y: 250, r: 20 },
    { id: 'teams', label: 'Teams Bot', type: 'project', description: 'Custom plugin for Azure DevOps actions', x: 800, y: 200, r: 25 },

    // Infra
    { id: 'azure', label: 'Azure Stack', type: 'skill', description: 'Foundry, Functions, Web Apps, Entra ID', x: 700, y: 380, r: 20 },
    { id: 'k8s', label: 'Kubernetes', type: 'skill', description: 'AKS clusters, Helm charts, OpenWebUI deployment', x: 750, y: 450, r: 25 },

    // Design
    { id: 'visual', label: 'Visual RAG', type: 'project', description: 'Graph & diagram understanding from PPTs', x: 100, y: 200, r: 25 },
    { id: 'ux', label: 'Conversational UX', type: 'skill', description: 'Reasoning capabilities & user flow design', x: 50, y: 300, r: 20 },

    // R&D
    { id: 'proto', label: 'Prototyping', type: 'skill', description: 'Rapid dev of AI demos, newsletters, sentiment analysis', x: 100, y: 500, r: 20 },
    { id: 'llm', label: 'LLM Ops', type: 'skill', description: 'Fine-tuning, prompting, model comparison', x: 250, y: 550, r: 20 },
];

const LINKS: Link[] = [
    { source: 'me', target: 'ai' },
    { source: 'me', target: 'infra' },
    { source: 'me', target: 'design' },
    { source: 'me', target: 'rd' },

    { source: 'ai', target: 'rag' },
    { source: 'ai', target: 'agents' },
    { source: 'ai', target: 'teams' },

    { source: 'infra', target: 'azure' },
    { source: 'infra', target: 'k8s' },

    { source: 'design', target: 'visual' },
    { source: 'design', target: 'ux' },

    { source: 'rd', target: 'proto' },
    { source: 'rd', target: 'llm' },
];

export default function VisualAppliedAI() {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

    // Simple "naive" wobble effect
    const wobble = {
        animate: {
            d: [
                "M 0 0 Q 50 0, 100 0",
                "M 0 0 Q 50 -5, 100 0",
                "M 0 0 Q 50 5, 100 0"
            ],
            transition: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="py-20 bg-stone-50 overflow-hidden relative min-h-[800px] flex flex-col items-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="z-10 text-center mb-8 max-w-2xl px-4">
                <h2 className="text-3xl font-serif text-stone-800 mb-4">What is an Applied AI Engineer?</h2>
                <p className="text-stone-600">
                    A bridge between <span className="text-rose-600 font-medium">Research</span>, <span className="text-indigo-600 font-medium">Engineering</span>, and <span className="text-amber-600 font-medium">Design</span>.
                    <br />Interact with the constellation to explore my universe.
                </p>
            </div>

            <div className="relative w-full max-w-4xl h-[600px] bg-white/50 rounded-3xl border border-stone-200 shadow-sm backdrop-blur-sm overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 800 600">
                    {/* Links */}
                    {LINKS.map((link, i) => {
                        const source = INITIAL_NODES.find(n => n.id === link.source)!;
                        const target = INITIAL_NODES.find(n => n.id === link.target)!;

                        return (
                            <motion.line
                                key={i}
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                stroke="#d6d3d1"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {INITIAL_NODES.map((node) => {
                        const isSelected = selectedNode?.id === node.id;
                        const isHovered = hoveredNode?.id === node.id;

                        return (
                            <motion.g
                                key={node.id}
                                onClick={() => setSelectedNode(node)}
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 100, delay: Math.random() * 0.5 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.r}
                                    fill={node.type === 'root' ? '#e11d48' : node.type === 'category' ? '#4f46e5' : '#f59e0b'}
                                    opacity={isSelected || isHovered ? 1 : 0.8}
                                    className="transition-colors duration-300"
                                />
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.r + 5}
                                    fill="none"
                                    stroke={node.type === 'root' ? '#e11d48' : node.type === 'category' ? '#4f46e5' : '#f59e0b'}
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    opacity={isSelected ? 1 : 0}
                                    className="animate-spin-slow"
                                />

                                <text
                                    x={node.x}
                                    y={node.y + node.r + 20}
                                    textAnchor="middle"
                                    fill="#44403c"
                                    className={`text-xs font-medium pointer-events-none ${node.type === 'root' ? 'font-bold uppercase tracking-widest' : ''}`}
                                >
                                    {node.label}
                                </text>
                            </motion.g>
                        );
                    })}
                </svg>

                {/* Info Panel Overlay */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-stone-200 shadow-lg"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-stone-800 mb-2">{selectedNode.label}</h3>
                                    <p className="text-stone-600">{selectedNode.description || 'Explore the node to learn more.'}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
                                    className="text-stone-400 hover:text-stone-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
          transform-origin: center;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </section>
    );
}
