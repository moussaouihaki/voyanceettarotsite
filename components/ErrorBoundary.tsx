"use client";

import { Component, ReactNode } from "react";
import { Star } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <Star size={32} className="text-[#d4af6f] mb-6 opacity-50" />
        <p className="font-serif-display text-2xl text-[#c9b88a] mb-3">
          Une perturbation cosmique s&apos;est produite
        </p>
        <p className="text-[#8a6f3a] text-sm mb-8 max-w-sm">
          Les astres ont momentanément brouillé les signaux. Rechargez la page pour rétablir la connexion.
        </p>
        <button
          onClick={() => { this.setState({ hasError: false, message: "" }); window.location.reload(); }}
          className="btn-outline-gold"
        >
          Recharger
        </button>
      </div>
    );
  }
}
