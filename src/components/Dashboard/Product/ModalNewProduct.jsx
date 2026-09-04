import { useState } from 'react';

export default function ModalNewProduct({ isOpen, onClose, onProductCreated }) {
    const [nombre, setName] = useState('');
    const [talla, setSize] = useState('');
    const [color, setColour] = useState('');
    const [precio, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [guardando, setSave] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSave(true);
        const token = localStorage.getItem('token');

        const nuevoProducto = {
            name: nombre,
            size: talla,
            colour: color,
            price: parseFloat(precio),
            stock: parseInt(stock, 10)
        };
        console.log('Enviando producto:', nuevoProducto);

        try {
            const response = await fetch('http://localhost:8008/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json',
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData['hydra:description'] || 'No se pudo crear');
            }

            // Limpiar campos y avisar al componente padre que limpie todo
            setName('');
            setSize('');
            setColour('');
            setPrice('');
            setStock('');
            onProductCreated();
        } catch (err) {
            alert(`Error al guardar: ${err.message}`);
        } finally {
            setSave(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Producto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del producto</label>
                        <input
                            type="text" required value={nombre} onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Pantalón, Camiseta, Zapatos"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Talla</label>
                            <input
                                type="text" required value={talla} onChange={(e) => setSize(e.target.value)}
                                placeholder="Ej. M, L, XL"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
                            <input
                                type="text" required value={color} onChange={(e) => setColour(e.target.value)}
                                placeholder="Ej. Rojo, Azul, Verde"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Precio (Bol)</label>
                            <input
                                type="number" step="0.01" min="0" required value={precio} onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Inicial</label>
                            <input
                                type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)}
                                placeholder="0"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit" disabled={guardando} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-lg cursor-pointer">
                            {guardando ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}