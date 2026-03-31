import React from 'react';
import { ShieldAlert, Cpu, Eye, Code } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[70vh] animate-fade-in-up relative">
            
            {/* Ambient Background Grid & Orbs */}
            <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none z-0"></div>
            <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-cyber-blue/5 blur-[100px] rounded-full mix-blend-screen animate-float"></div>
            <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-cyber-purple/5 blur-[100px] rounded-full mix-blend-screen animate-float" style={{ animationDelay: '3s' }}></div>

            <div className="glass-panel p-12 max-w-4xl w-full text-center relative overflow-hidden group border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyber-blue/10 to-transparent blur-2xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-cyber-blue/20 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyber-purple/10 to-transparent blur-2xl rounded-full -translate-x-1/3 translate-y-1/3 group-hover:bg-cyber-purple/20 transition-colors duration-700"></div>
                
                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto bg-dark-900 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,180,216,0.3)] border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(0,180,216,0.6)] transition-all duration-500 relative">
                        <div className="absolute inset-0 bg-cyber-blue/20 blur-xl rounded-2xl"></div>
                        <Eye className="text-cyber-blue w-12 h-12 relative z-10 drop-shadow-[0_0_10px_rgba(0,180,216,0.8)]" />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase relative group-hover:animate-glitch">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyber-light to-cyber-blue drop-shadow-[0_0_15px_rgba(0,180,216,0.5)]">
                            ThreatLens AI
                        </span>
                    </h1>
                    
                    <div className="flex items-center justify-center gap-4 mb-12">
                         <div className="h-px bg-gradient-to-r from-transparent to-cyber-blue/50 w-24"></div>
                         <span className="text-cyber-blue tracking-[0.3em] text-sm font-bold uppercase">Next-Gen Engine</span>
                         <div className="h-px bg-gradient-to-l from-transparent to-cyber-purple/50 w-24"></div>
                    </div>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-16 font-light">
                        ThreatLens AI is a next-generation explaniable cyber threat detection platform designed to identify phishing emails, malicious URLs, and prompt injection attacks using advanced machine learning models.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
                        <div className="bg-dark-900/80 backdrop-blur p-8 rounded-2xl border border-white/5 hover:border-cyber-blue/50 hover:bg-cyber-blue/5 hover:shadow-[0_0_30px_rgba(0,180,216,0.15)] transition-all duration-300 group/card relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
                            <ShieldAlert className="text-cyber-blue mb-6 w-10 h-10 drop-shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                            <h3 className="text-white font-black text-xl mb-3 tracking-wide">Threat Detection</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Multi-vector analysis catching phishing, bad domains, and injection vectors in real-time.</p>
                        </div>
                        <div className="bg-dark-900/80 backdrop-blur p-8 rounded-2xl border border-white/5 hover:border-cyber-purple/50 hover:bg-cyber-purple/5 hover:shadow-[0_0_30px_rgba(123,44,191,0.15)] transition-all duration-300 group/card relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 delay-100"></div>
                            <Cpu className="text-cyber-purple mb-6 w-10 h-10 drop-shadow-[0_0_10px_rgba(123,44,191,0.5)]" />
                            <h3 className="text-white font-black text-xl mb-3 tracking-wide">Explainable AI</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">We don't just block threats; our engine highlights exactly what triggered the alert contextually.</p>
                        </div>
                        <div className="bg-dark-900/80 backdrop-blur p-8 rounded-2xl border border-white/5 hover:border-cyber-green/50 hover:bg-cyber-green/5 hover:shadow-[0_0_30px_rgba(0,230,118,0.15)] transition-all duration-300 group/card relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 delay-200"></div>
                            <Code className="text-cyber-green mb-6 w-10 h-10 drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
                            <h3 className="text-white font-black text-xl mb-3 tracking-wide">Fast API</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Built on FastAPI and React, delivering sub-second response times for incoming security scans.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
