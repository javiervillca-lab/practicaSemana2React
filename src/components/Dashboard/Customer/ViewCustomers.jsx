import { useEffect, useState } from 'react';
import ModalNewCustomer from './ModalNewCustomer';
import ModalUpdateCustomer from './ModalUpdateCustomer';

export default function ViewCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [customerSeleccionado, setCustomerSeleccionado] = useState(null);

    const fetchCustomers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8008/api/customers', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/ld+json',
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setCustomers(data['member'] || []);
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

            fetchCustomers();

        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    const handleOpenUpdateModal = (customer) => {
        console.log("ssssss");
        setCustomerSeleccionado(customer);
        setIsUpdateModalOpen(true);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) return <div className="text-slate-500 text-sm">Cargando catálogo...</div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Clientes</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                    + Nuevo Cliente
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Acciones</th>
                            <th className="px-6 py-4">Nombre Cliente</th>
                            <th className="px-6 py-4">Nit / CI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-slate-600">
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">No hay clientes registrados.</td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer['@id']} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <button
                                            onClick={() => handleOpenUpdateModal(customer)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCustomer(customer['@id'], customer.name)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                                        >
                                            Eliminar
                                        </button>

                                    </td>
                                    <td className="px-6 py-4">{customer.nameFull}</td>
                                    <td className="px-6 py-4">{customer.nitCi}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <ModalNewCustomer
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCustomerCreated={() => {
                    setIsCreateModalOpen(false);
                    fetchCustomers(); // Recarga la tabla al terminar
                }}
            />

            <ModalUpdateCustomer
                isOpen={isUpdateModalOpen}
                customer={customerSeleccionado}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setCustomerSeleccionado(null);
                }}
                onCustomerUpdated={() => {
                    setIsUpdateModalOpen(false);
                    setCustomerSeleccionado(null);
                    fetchCustomers(); // Refresca la tabla automáticamente
                }}
            />
        </div>
    );
}