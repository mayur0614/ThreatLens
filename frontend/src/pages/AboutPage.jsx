import React from 'react';
import { ShieldAlert, Cpu, Eye, Code } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[70vh] animate-fade-in-up">
            <div className="glass-panel p-12 max-w-3xl w-full text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-cyber-blue/10 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-purple/5 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 group-hover:bg-cyber-purple/10 transition-colors duration-700"></div>
                
                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-dark-800 rounded-2xl flex items-center justify-center mb-6 shadow-glow-blue border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <Eye className="text-cyber-blue w-10 h-10" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        About ThreatLens AI
                    </h1>
                    
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
                        ThreatLens AI is a next-generation explaniable cyber threat detection platform designed to identify phishing emails, malicious URLs, and prompt injection attacks using advanced machine learning models.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="bg-dark-900/50 p-6 rounded-xl border border-white/5 hover:border-cyber-blue/30 transition-colors">
                            <ShieldAlert className="text-cyber-blue mb-4 w-8 h-8" />
                            <h3 className="text-white font-bold mb-2">Threat Detection</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Multi-vector analysis catching phishing, bad domains, and injection vectors in real-time.</p>
                        </div>
                        <div className="bg-dark-900/50 p-6 rounded-xl border border-white/5 hover:border-cyber-purple/30 transition-colors">
                            <Cpu className="text-cyber-purple mb-4 w-8 h-8" />
                            <h3 className="text-white font-bold mb-2">Explainable AI</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">We don't just block threats; our engine highlights exactly what triggered the alert contextually.</p>
                        </div>
                        <div className="bg-dark-900/50 p-6 rounded-xl border border-white/5 hover:border-cyber-green/30 transition-colors">
                            <Code className="text-cyber-green mb-4 w-8 h-8" />
                            <h3 className="text-white font-bold mb-2">Fast API</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Built on FastAPI and React, delivering sub-second response times for incoming security scans.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
