import React from 'react';

type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Loguea en consola para depuración local
    console.error('Error atrapado en ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">Ups, algo salió mal</h2>
            <p className="text-sm text-gray-600">
              Se produjo un error al cargar esta sección. Intenta recargar la página. Si persiste, vuelve al inicio.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white"
              >
                Recargar
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
