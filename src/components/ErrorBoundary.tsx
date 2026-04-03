import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "./UI";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue s'est produite.";
      let isDatabaseError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.authInfo && parsed.operationType) {
            isDatabaseError = true;
            errorMessage = `Erreur de base de données (${parsed.operationType}) sur ${parsed.path || "inconnu"}.`;
            const err = String(parsed.error).toLowerCase();
            if (
              err.includes("permission-denied") ||
              err.includes("row-level security") ||
              err.includes("42501")
            ) {
              errorMessage =
                "Accès refusé. Vous n'avez pas les permissions nécessaires pour cette action.";
            }
          }
        }
      } catch (e) {
        // Not a JSON error message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full glass p-8 rounded-3xl border-brand-orange/20 text-center space-y-6">
            <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange">
              <AlertCircle size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold">
                Oups ! Quelque chose a mal tourné
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>

            {isDatabaseError && (
              <div className="bg-white/5 p-4 rounded-xl text-left">
                <p className="text-[10px] font-mono uppercase text-white/40 mb-1">
                  Détails techniques
                </p>
                <code className="text-[10px] text-brand-orange break-all">
                  {this.state.error?.message}
                </code>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> Réessayer
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Home size={18} /> Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
