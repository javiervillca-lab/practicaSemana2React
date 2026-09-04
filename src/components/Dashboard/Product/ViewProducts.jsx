import { useEffect, useState } from 'react';
import ModalNewProduct from './ModalNewProduct';

export default function ViewProducts() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8008/api/products', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/ld+json',
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setProductos(data['member'] || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (iri, nombreProducto) => {
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

            fetchProducts();

        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <div className="text-slate-500 text-sm">Cargando catálogo...</div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Inventario Disponible</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                    + Nuevo Producto
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Acciones</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Talla</th>
                            <th className="px-6 py-4">Color</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-slate-600">
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">No hay productos registrados.</td>
                            </tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod['@id']} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <button className="text-warning-600 hover:text-warning-700 mr-2">Editar</button>
                                        <button
                                            onClick={() => handleDeleteProduct(prod['@id'], prod.name)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                                        >
                                            Eliminar
                                        </button>

                                    </td>
                                    <td className="px-6 py-4">{prod.name}</td>
                                    <td className="px-6 py-4">{prod.size}</td>
                                    <td className="px-6 py-4">{prod.colour}</td>
                                    <td className="px-6 py-4">${prod.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${(prod.stock || 0) > 5 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {prod.stock} unidades
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <ModalNewProduct
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductCreated={() => {
                    setIsModalOpen(false);
                    fetchProducts(); // Recarga la tabla al terminar
                }}
            />
        </div>
    );
}