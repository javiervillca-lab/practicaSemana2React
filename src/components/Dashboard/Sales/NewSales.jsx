import { useState, useEffect } from 'react';

export default function NewSales() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [estadoVenta, setEstadoVenta] = useState('completada');
    const [carrito, setCarrito] = useState([]);
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            const token = localStorage.getItem('token');
            const opcionesFetch = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/ld+json',
                }
            };

            try {
                const [resCustomers, resProducts] = await Promise.all([
                    fetch('http://localhost:8008/api/customers', opcionesFetch),
                    fetch('http://localhost:8008/api/products', opcionesFetch)
                ]);

                if (!resCustomers.ok || !resProducts.ok) {
                    throw new Error('No se pudieron obtener los datos del sistema de ventas.');
                }

                const dataC = await resCustomers.json();
                const dataP = await resProducts.json();

                setCustomers(dataC['member'] || []);
                setProducts(dataP['member'] || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);


    // 3. Añadir products al carrito de compras
    const agregarAlCarrito = (producto) => {
        if ((producto.stock || 0) <= 0) {
            alert('¡Atención! Este producto no cuenta con stock disponible.');
            return;
        }

        const existe = carrito.find(item => item['@id'] === producto['@id']);

        if (existe) {
            if (existe.cantidad >= producto.stock) {
                alert(`No puedes agregar más unids. El stock máximo disponible es ${producto.stock}.`);
                return;
            }
            setCarrito(carrito.map(item =>
                item['@id'] === producto['@id']
                    ? { ...item, cantidad: item.cantidad + 1, totalLinea: (item.cantidad + 1) * item.precio }
                    : item
            ));
        } else {
            setCarrito([...carrito, {
                '@id': producto['@id'],
                nombre: producto.name,
                precio: parseFloat(producto.price || 0),
                cantidad: 1,
                totalLinea: parseFloat(producto.price || 0),
                stockMaximo: producto.stock
            }]);
        }
    };

    const actualizarCantidad = (iri, nuevaCantidad, stockMaximo) => {
        if (nuevaCantidad < 1) return;
        if (nuevaCantidad > stockMaximo) {
            alert(`Cantidad limitada. Solo hay ${stockMaximo} unidades en inventario.`);
            return;
        }
        setCarrito(carrito.map(item =>
            item['@id'] === iri
                ? { ...item, cantidad: nuevaCantidad, totalLinea: nuevaCantidad * item.precio }
                : item
        ));
    };

    const eliminarDelCarrito = (iri) => {
        setCarrito(carrito.filter(item => item['@id'] !== iri));
    };

    const calcularTotalVenta = () => {
        return carrito.reduce((sum, item) => sum + item.totalLinea, 0);
    };

    const handleProcesarVenta = async (e) => {
        e.preventDefault();
        if (!clienteSeleccionado) return alert('Por favor, selecciona un cliente antes de procesar el pago.');
        if (carrito.length === 0) return alert('Detalle de venta está vacío. Agrega productOs para vender.');

        setProcesando(true);
        const token = localStorage.getItem('token');
        const precioTotalFinal = calcularTotalVenta();

        // Estructura JSON solicitada para tu API
        const nuevaVenta = {
            saleDate: new Date().toISOString(),
            totalPrice: precioTotalFinal,
            customer: clienteSeleccionado,
            state: estadoVenta,
            saleDetails: carrito.map(item => ({
                quantity: item.cantidad,
                unitPrice: item.precio,
                lineTotal: item.totalLinea,
                product: item['@id']
            }))
        };

        try {
            const response = await fetch('http://localhost:8008/api/sales', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json',
                },
                body: JSON.stringify(nuevaVenta),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData['hydra:description'] || 'No se pudo registrar la venta.');
            }

            alert('¡Venta realizada con éxito!');

            setCarrito([]);
            setClienteSeleccionado('');

        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setProcesando(false);
        }
    };

    if (loading) return <div className="text-slate-500 text-sm p-6">Sincronizando catálogo del sistema...</div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg m-6">{error}</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2 space-y-6">

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                    <h2 className="text-base font-bold text-slate-900 mb-4">Información de la Transacción</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Asignar Cliente</label>
                            <select
                                value={clienteSeleccionado}
                                onChange={(e) => setClienteSeleccionado(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">-- Buscar Cliente --</option>
                                {customers.map(c => (
                                    <option key={c['@id']} value={c['@id']}>
                                        {c.nameFull || 'Cliente Registrado'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Estado Operativo</label>
                            <select
                                value={estadoVenta}
                                onChange={(e) => setEstadoVenta(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="completada">Completada / Pagada</option>
                                <option value="pendiente">Pendiente por Cobrar</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                    <h2 className="text-base font-bold text-slate-900 mb-4">Catálogo de Productos</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {products.length === 0 ? (
                            <p className="text-slate-400 text-xs col-span-2 py-4">No se encontraron products coincidentes.</p>
                        ) : (
                            products.map(p => (
                                <button
                                    key={p['@id']}
                                    type="button"
                                    onClick={() => agregarAlCarrito(p)}
                                    className="flex flex-col text-left p-3 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer group"
                                >
                                    <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 truncate">{p.name || p.nombre}</span>
                                    <div className="flex justify-between w-full mt-1 text-xs">
                                        <span className="text-emerald-600 font-bold">{p.price} Bs.</span>
                                        <span className={`font-medium ${p.stock > 5 ? 'text-slate-500' : 'text-amber-600 font-bold'}`}>
                                            Stock: {p.stock} unids
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between min-h-[480px]">
                <div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between min-h-[480px]">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                                Resumen de venta
                            </h2>

                            <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
                                {carrito.length === 0 ? (
                                    <div className="text-center text-slate-400 py-16 text-sm">
                                        El detalle venta está vacío.<br />Haz clic en un producto para añadirlo.
                                    </div>
                                ) : (
                                    carrito.map(item => (
                                        <div key={item['@id']} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="text-xs font-bold text-slate-900 truncate">{item.nombre}</p>
                                                <p className="text-xs text-emerald-600 font-medium">{item.precio.toFixed(2)} Bs. c/u</p>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) => actualizarCantidad(item['@id'], parseInt(e.target.value, 10) || 1, item.stockMaximo)}
                                                    className="w-12 text-center border border-gray-300 rounded-md py-0.5 text-xs font-semibold focus:outline-hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarDelCarrito(item['@id'])}
                                                    className="text-red-500 hover:text-red-700 text-sm font-bold px-1 cursor-pointer"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                            <div className="flex justify-between items-center text-slate-600 text-sm">
                                <span>Subtotal</span>
                                <span>{calcularTotalVenta().toFixed(2)} Bs.</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3 text-slate-900">
                                <span className="text-sm font-bold">Total Neto:</span>
                                <span className="text-xl font-black text-emerald-600">{calcularTotalVenta().toFixed(2)} Bs.</span>
                            </div>

                            <button
                                onClick={handleProcesarVenta}
                                disabled={procesando || carrito.length === 0}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-center py-3 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer"
                            >
                                {procesando ? 'procesando...' : 'Confirmar y Guardar Venta'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
} 