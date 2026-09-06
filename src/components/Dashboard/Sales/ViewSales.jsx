import { useEffect, useState } from 'react';

export default function ViewSales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSales = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8008/api/sales', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/ld+json',
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setSales(data['member'] || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCustomer = async (iri, nombreProducto) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${nombreProducto}"?`);
        if (!confirmar) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8008${iri}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`No se pudo eliminar el producto (Código ${response.status})`);
            }

            fetchSales();

        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    if (loading) return <div className="text-slate-500 text-sm">Cargando ventas realizadas...</div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Acciones</th>
                            <th className="px-6 py-4">Fecha de venta</th>
                            <th className="px-6 py-4">Total precio</th>
                            <th className="px-6 py-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-slate-600">
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">No hay ventas registradas.</td>
                            </tr>
                        ) : (
                            sales.map((sale) => (
                                <tr key={sale['@id']} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <button
                                            onClick={() => handleOpenUpdateModal(sale)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCustomer(sale['@id'], "fecha:  " + sale.saleDate + "  total:  " + sale.totalPrice + "  estado:  " + sale.state)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                                        >
                                            Eliminar
                                        </button>

                                    </td>
                                    <td className="px-6 py-4">{sale.saleDate}</td>
                                    <td className="px-6 py-4">{sale.totalPrice} Bs.</td>
                                    <td className="px-6 py-4">{sale.state}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}