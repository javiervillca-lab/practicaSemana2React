import { useState, useEffect } from 'react';

export default function ModalUpdateProduct({ isOpen, onClose, producto, onProductUpdated }) {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [colour, setColour] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Cada vez que se abra el modal con un producto seleccionado, rellenamos los campos
    useEffect(() => {
        if (producto) {
            setName(producto.name || producto.name || '');
            setSize(producto.size || producto.size || '');
            setColour(producto.colour || producto.colour || '');
            setPrice(producto.price || producto.price || '');
            setStock(producto.stock || '');
        }
    }, [producto]);

    if (!isOpen || !producto) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);
        const token = localStorage.getItem('token');

        const productoEditado = {
            name: name,
            size: size,
            colour: colour,
            price: parseFloat(price),
            stock: parseInt(stock, 10)
        };

        try {
            // Le pegamos directamente al IRI del producto (ej: producto['@id'] contiene /api/products/5)
            const response = await fetch(`http://localhost:8008${producto['@id']}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/merge-patch+json',
                    'Accept': 'application/ld+json',
                },
                body: JSON.stringify(productoEditado),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData['hydra:description'] || 'No se pudo actualizar el producto');
            }

            // Avisamos al componente padre que la actualización fue un éxito
            onProductUpdated();

        } catch (err) {
            alert(`Error al actualizar: ${err.message}`);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md p-6">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Editar Producto</h3>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">nombre del producto</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Talla</label>
                            <input
                                type="text"
                                required
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
                            <input
                                type="text"
                                required
                                value={colour}
                                onChange={(e) => setColour(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Precio (Bol)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={guardando}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors cursor-pointer"
                        >
                            {guardando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}