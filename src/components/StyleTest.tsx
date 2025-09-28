import React from 'react';

const StyleTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Prueba de Estilos - Dark Mode
          </h1>
          <p className="text-secondary mb-6">
            Este componente verifica que todos los estilos estén funcionando correctamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-4">Colores de Texto</h2>
            <div className="space-y-2">
              <p className="text-primary">Texto Primario</p>
              <p className="text-secondary">Texto Secundario</p>
              <p className="text-tertiary">Texto Terciario</p>
              <p className="text-muted">Texto Muted</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-4">Estados</h2>
            <div className="space-y-2">
              <p className="text-success">Éxito</p>
              <p className="text-warning">Advertencia</p>
              <p className="text-error">Error</p>
              <p className="text-info">Información</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">Botones</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Botón Primario</button>
            <button className="btn-secondary">Botón Secundario</button>
            <button className="btn-primary bg-success hover:bg-success-light">Éxito</button>
            <button className="btn-primary bg-error hover:bg-error-light">Error</button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <span className="badge badge-success">Éxito</span>
            <span className="badge badge-warning">Advertencia</span>
            <span className="badge badge-error">Error</span>
            <span className="badge badge-info">Info</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">Gradientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Gradiente Primario</span>
            </div>
            <div className="h-20 gradient-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Gradiente Secundario</span>
            </div>
            <div className="h-20 gradient-tertiary rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Gradiente Terciario</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">Inputs</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Input de Prueba
              </label>
              <input
                type="text"
                placeholder="Escribe algo aquí..."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Select de Prueba
              </label>
              <select className="w-full">
                <option>Opción 1</option>
                <option>Opción 2</option>
                <option>Opción 3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">Progress Bar</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary">Progreso</span>
                <span className="text-primary">75%</span>
              </div>
              <div className="progress h-3">
                <div className="progress-bar h-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleTest; 