import { useState } from 'react';
import ViewProducts from './Product/ViewProducts';
import ViewCustomers from './Customer/ViewCustomers';
import NewSales from './Sales/NewSales';
import ViewSales from './Sales/ViewSales';

export default function Dashboard() {
    const [seccionActiva, setSeccionActiva] = useState('nueva venta');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5">
                <div>
                    <div className="text-2xl font-black tracking-wider mb-8 text-emerald-400 flex items-center gap-2">
                        <span>SIGVE</span>
                    </div>

                    <nav className="space-y-1">
                        <button
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${seccionActiva === 'inicio' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            INICIO
                        </button>
                        <button
                            onClick={() => setSeccionActiva('nueva venta')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${seccionActiva === 'nueva venta' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                           Nueva venta
                        </button>
                        <button
                            onClick={() => setSeccionActiva('ventas realizadas')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${seccionActiva === 'ventas realizadas' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            Ventas realizadas
                        </button>


                        <button
                            onClick={() => setSeccionActiva('productos')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${seccionActiva === 'productos' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            productos
                        </button>

                        <button
                            onClick={() => setSeccionActiva('clientes')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${seccionActiva === 'clientes' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            Clientes
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                        >
                            Salir
                        </button>
                    </nav>
                </div>
            </aside>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-xs">
                    <h1 className="text-xl font-bold text-slate-800 capitalize">
                        Gestión de {seccionActiva}
                    </h1>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-bold border border-emerald-200">
                        Sistema de Inventario y Ventas | SIGVE
                    </span>
                </header>

                {/* RENDER CONDICIONAL DE LAS VISTAS */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {seccionActiva === 'nueva venta' && <NewSales />}
                    {seccionActiva === 'ventas realizadas' && <ViewSales />}
                    {seccionActiva === 'productos' && <ViewProducts />}
                    {seccionActiva === 'clientes' && <ViewCustomers />}
                </main>
                <footer className="bg-white border-t border-gray-200 shadow-xs">
                    <div className="w-full p-4">
                        <span className="text-sm text-body sm:text-center">UCB V1.0 &copy; 2026 - Trabajo Practica 2 </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}