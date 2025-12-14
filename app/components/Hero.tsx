'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden z-10">

            {/* Background Glow - localized reinforcement of the global mesh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-3xl -z-10 mix-blend-multiply animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center px-4"
            >
                <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
                    Lowell ZIMA
                </h1>

                <p className="text-xl md:text-2xl font-light text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                    Applied AI Engineer <span className="text-indigo-600 font-normal">Production / RAG / Agents</span>
                    <br />
                    <span className="text-lg opacity-80">Building AI systems that survive contact with production.</span>
                </p>

                <div className="flex gap-4 justify-center">
                    <motion.a
                        href="#capabilities"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:bg-slate-800 transition-all"
                    >
                        Core Competencies
                    </motion.a>

                    <motion.a
                        href="#projects"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        Deployments
                    </motion.a>
                </div>
            </motion.div>
        </section>
    );
}
