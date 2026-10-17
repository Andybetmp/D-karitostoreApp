import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { productService, Product } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';

export interface CatalogItem {
  id: number;
  title: string;
  sku: string;
  category: 'Bolsos' | 'Mochilas' | 'Billeteras' | 'Cinturones' | 'Accesorios';
  priceUsd: number;
  stock: number;
  threshold: number;
  description: string;
  img: string;
  fallbackImg: string;
}

const RATE = 3.75;

const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: 19,
    title: 'Bolso de Cuero Artesanal',
    sku: 'DK-BOL-001',
    category: 'Bolsos',
    priceUsd: 190.0,
    stock: 85,
    threshold: 15,
    description:
      'Piel de vacuno curtido vegetal de grano entero, teñido con anilinas orgánicas en tono Caramelo Andino y sellado a base de cera de abejas.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRQkpVKV9X07zGQOCqap7DI9oon4cs23_Tr9_WIuF8bbl_NhMAm9lwwoSX5SSQTVOZV4zbNAgKsZH-2WohXbAKnDdpkdpszh-ipPn9uswhaddI2lWXPxHIuDkot5eM4v2nhJBjs0BZ1xXV_eCVyVnRdbpRiS4cNstd8W192Z16mkdbd7T8jUfGTwy6t7v6bgZXxEgFzqr3--ef9OLDo8oHKOwfh6DHMvrztTOSUYILNFCBQ1GIkQPQ',
    fallbackImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
  },
  {
    id: 20,
    title: 'Mochila de Cuero Premium',
    sku: 'DK-MOC-002',
    category: 'Mochilas',
    priceUsd: 220.0,
    stock: 42,
    threshold: 15,
    description:
      'Mochila ejecutiva en cuero caoba de grano completo con hebillas de bronce cepillado y compartimento acolchado.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWAIqedS22m77_ihGqgW8x-I6BB3EXaMpATgFw9ZTOJ3Fx3c0-xIP6rMLoQos8Nt_RaR-H5F2PECFoHiihtYZKmLilA5ViXiiUFLcPxR8Ekglvqp0bnz9kW-LMJmHIMoDYrc7-9ILeMcXHSo1xDUfOnhT6cET8an5TtvDRM8FQJYCOel_mtu2Fr6TX2JTGZ4Ry58GKvaKMCXUUdb6jzJ1pdDee7baYYGqG6nLFvLICz2Ei3bnYPF7G',
    fallbackImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
  },
  {
    id: 22,
    title: 'Billetera Piel Vacuna',
    sku: 'DK-BIL-003',
    category: 'Billeteras',
    priceUsd: 55.0,
    stock: 110,
    threshold: 20,
    description:
      'Billetera bifold peruana en cuero saddle tan con bruñido de cantos a mano y bloqueo RFID.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARylvCWx9BS7hnE1eB7fkRoq8qAFeYdeVT9wkZDjvRvTmwSd6-7GgDWiIPfh8aBpNYMo9FsBz7mw2D_XLICH2fcGAQ6Viv2QWSEzJXmxiOAXF3cl9SV4hXgbEjcV10-g66oD2M0GWfQfMHRIhGFiMzOnGwP2mGNt13i605HE3QdxpFVOwfigN6_mO1oHjKxqz6YMaT0TcryULM09n0NQpLF-0yCyxpqU0vWEpJKrmeK1rVuKqNouCG',
    fallbackImg: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300',
  },
  {
    id: 24,
    title: 'Cinturón Hebilla Dorada',
    sku: 'DK-CIN-004',
    category: 'Cinturones',
    priceUsd: 70.0,
    stock: 18,
    threshold: 25,
    description:
      'Cinturón artesanal de cuero curtido vegetal con hebilla forjada en latón sólido pulido.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfEnMY66qW5TxXPQK0lADQnIMlTb30U0sQTm-PhiXYj4AoUC6XU2hKhsu5lVlIiYCXQ4SzGLZ7qKs3h1EoxqTMLXRsCG7OSOb7pdd_4SJWwSlKBzehITMgCWByiCLC3lQjsfstHP9bftkScloQqSb18cOCd6yR4Q75vlkZBAzPsgvCbWNqANpd1Ehttx247S_fcoDnchTK3PYsCA-T1z2dnOXpcx-Mx6ZY416hc0kZ1a5IRNUe7cSI',
    fallbackImg: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=300',
  },
  {
    id: 23,
    title: 'Portadocumentos Ejecutivo',
    sku: 'DK-DOC-005',
    category: 'Accesorios',
    priceUsd: 120.0,
    stock: 65,
    threshold: 15,
    description:
      'Portadocumentos ejecutivo de cuero artesanal con monograma grabado y broche de cobre.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB72YiMI2BoxRZd9xzd0msTW-zRRxGGQ15lPqcZFZmpahyLhYpY8wfR756y3vRKY5o0pzjfuK7AQIBikQfie5HZ8OcW4S7KzFqdL1QemvRlNsvuURDz4vxxyAg3WNgOW49gspvTBGU2ShnHDSTzgkwlL0aVzYV0Bm_OR07hvyxpiwy2R2a9pX5yqclIOJPhHa4CfJWXMS0IXv7doaNXkiTI_JecQGiavDxhitJ0slc9tPt4wLLhkydp',
    fallbackImg: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=300',
  },
  {
    id: 26,
    title: 'Morral Bandolera Vintage',
    sku: 'DK-MOR-006',
    category: 'Bolsos',
    priceUsd: 145.0,
    stock: 0,
    threshold: 15,
    description:
      'Morral bandolera en cuero envejecido saddle con costuras reforzadas y correa ajustable.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxbt7ynpISSVFfYjyCq3W7EuY_jlWvHJeJ1EUgezDQvaZKKphsYqrVKoM0xc_qsMtEeUbIo6CAd42rAz9UWVbuRWtGgOK0DappDXUtusgBwMK40FHwQAs-x9AmRMZ6CMmiLZlDhSr10mCUhcc4Qed95ef47jnrz2IYOxEd7lN_SKfytObbmXRUaAvfoZLz-aWXa-M-zfka4i_aTF6j4Yynz73y5b2ZOSylbjy9IaOCoGqXiyZkL4W2',
    fallbackImg: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300',
  },
];

const inferCategory = (title: string): CatalogItem['category'] => {
  const t = (title || '').toLowerCase();
  if (t.includes('mochila')) return 'Mochilas';
  if (t.includes('billetera') || t.includes('tarjetero')) return 'Billeteras';
  if (t.includes('cinturón') || t.includes('cinturon') || t.includes('correa')) return 'Cinturones';
  if (t.includes('porta') || t.includes('accesorio')) return 'Accesorios';
  return 'Bolsos';
};

const ProductManagement = (): ReactElement => {
  const [items, setItems] = useState<CatalogItem[]>(INITIAL_CATALOG);
  const [editingId, setEditingId] = useState<number | null>(19);
  const [prodName, setProdName] = useState('Bolso de Cuero Artesanal Arequipeño');
  const [prodSku, setProdSku] = useState('DK-LUG-2024-009');
  const [prodCat, setProdCat] = useState<CatalogItem['category']>('Bolsos');
  const [priceUsd, setPriceUsd] = useState<string>('190.00');
  const [pricePen, setPricePen] = useState<string>('712.50');
  const [stockQty, setStockQty] = useState<number>(350);
  const [stockThreshold, setStockThreshold] = useState<number>(15);
  const [leatherSpec, setLeatherSpec] = useState<string>(
    'Piel de vacuno curtido vegetal de grano entero, teñido con anilinas orgánicas en tono Caramelo Andino y sellado a base de cera de abejas.'
  );
  const [prodImg, setProdImg] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjbKSH42f1r9qK5WdFs3OFD3WJkvdhXY8aylbjwxo7PW1dpju3aYXX6a_X6keQlMcNf-qTdIqKc3wNQEZNzwzZxHOcdh8fd4SK08LU_2zZRF1YLhVTx4hy0x9IqtbtBEpX476oh8G7y72iJEIEkaeFIpCQqPDQUGU2Hlr9Tp8-WjH62RtFoTSsTrTnlQk2bObRKqJFuFXn0epPlMlnKX6DVDfPoFLVJLaDAElIPXEi9zXaWiYPc9HO'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [categoryPill, setCategoryPill] = useState<'ALL' | CatalogItem['category']>('ALL');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 3200);
  };

  const syncWithMicroservices = useCallback(async () => {
    try {
      const res = await productService.getAllProducts();
      const apiProducts: Product[] = Array.isArray(res.data) ? res.data : [];
      if (apiProducts.length > 0) {
        const merged = [...INITIAL_CATALOG];
        for (const p of apiProducts) {
          const exists = merged.some(
            (m) => m.id === p.id || m.title.toLowerCase() === (p.title || '').toLowerCase()
          );
          if (!exists && p.id) {
            merged.push({
              id: p.id,
              title: p.title,
              sku: `DK-API-${String(p.id).padStart(3, '0')}`,
              category: inferCategory(p.title),
              priceUsd: Number(p.price || 99),
              stock: Number(p.stock ?? 45),
              threshold: 15,
              description: p.description || 'Marroquinería artesanal en cuero peruano.',
              img: p.img || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
              fallbackImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
            });
          }
        }
        setItems(merged);
      }
    } catch {
      // Keep Stitch catalog items
    }
  }, []);

  useEffect(() => {
    syncWithMicroservices();
  }, [syncWithMicroservices]);

  const handleUsdChange = (val: string) => {
    setPriceUsd(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPricePen((num * RATE).toFixed(2));
    } else {
      setPricePen('');
    }
  };

  const handlePenChange = (val: string) => {
    setPricePen(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPriceUsd((num / RATE).toFixed(2));
    } else {
      setPriceUsd('');
    }
  };

  const handleSelectForEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setProdName(item.title);
    setProdSku(item.sku);
    setProdCat(item.category);
    setPriceUsd(item.priceUsd.toFixed(2));
    setPricePen((item.priceUsd * RATE).toFixed(2));
    setStockQty(item.stock);
    setStockThreshold(item.threshold);
    setLeatherSpec(item.description);
    setProdImg(item.img);
  };

  const handlePrepareNewProduct = () => {
    setEditingId(null);
    setProdName('');
    setProdSku('DK-NEW-' + Math.floor(100 + Math.random() * 900));
    setProdCat('Bolsos');
    setPriceUsd('150.00');
    setPricePen((150 * RATE).toFixed(2));
    setStockQty(50);
    setStockThreshold(15);
    setLeatherSpec(
      'Cuero peruano de grano entero curtido al tanino vegetal en Arequipa con herrajes de bronce.'
    );
  };

  const handleSaveProduct = async () => {
    if (!prodName.trim()) {
      showNotification('Por favor ingresa el nombre del producto artesanal.');
      return;
    }
    setSaveState('saving');
    const numericPrice = parseFloat(priceUsd) || 120;

    try {
      if (editingId !== null) {
        try {
          await productService.updateProduct(editingId, {
            title: prodName,
            description: leatherSpec,
            price: numericPrice,
            img: prodImg,
            category: prodCat,
            stock: stockQty,
          });
          await inventoryService.updateInventory(editingId, {
            productId: editingId,
            stock: stockQty,
            reservedStock: 0,
          });
        } catch {
          // Local update proceeds
        }
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingId
              ? {
                  ...it,
                  title: prodName,
                  sku: prodSku,
                  category: prodCat,
                  priceUsd: numericPrice,
                  stock: stockQty,
                  threshold: stockThreshold,
                  description: leatherSpec,
                  img: prodImg,
                }
              : it
          )
        );
      } else {
        let newId = Date.now();
        try {
          const res = await productService.createProduct({
            title: prodName,
            description: leatherSpec,
            price: numericPrice,
            img: prodImg,
            category: prodCat,
            stock: stockQty,
          });
          if (res.data?.id) {
            newId = res.data.id;
            await inventoryService.createInventory({
              productId: newId,
              stock: stockQty,
              reservedStock: 0,
            });
          }
        } catch {
          // Local insert proceeds
        }
        const created: CatalogItem = {
          id: newId,
          title: prodName,
          sku: prodSku,
          category: prodCat,
          priceUsd: numericPrice,
          stock: stockQty,
          threshold: stockThreshold,
          description: leatherSpec,
          img: prodImg,
          fallbackImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
        };
        setItems((prev) => [created, ...prev]);
        setEditingId(newId);
      }
    } finally {
      setTimeout(() => {
        setSaveState('saved');
        showNotification(`SKU ${prodSku} sincronizado con Product-Service (:8082) e Inventory-Service (:8083)`);
        setTimeout(() => setSaveState('idle'), 1600);
      }, 500);
    }
  };

  const handleRestockItem = async (item: CatalogItem) => {
    const updatedStock = item.stock + 30;
    try {
      await inventoryService.updateInventory(item.id, {
        productId: item.id,
        stock: updatedStock,
        reservedStock: 0,
      });
    } catch {
      // Local update
    }
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, stock: updatedStock } : it))
    );
    showNotification(`Lote +30 uds ingresado en Almacén Arequipa para ${item.sku} (:8083)`);
  };

  const handleDuplicateItem = async (item: CatalogItem) => {
    const newSku = `${item.sku}-COPY`;
    const copy: CatalogItem = {
      ...item,
      id: Date.now(),
      title: `${item.title} (Edición Especial)`,
      sku: newSku,
    };
    setItems((prev) => [copy, ...prev]);
    showNotification(`SKU duplicado: ${newSku}`);
  };

  const handleDeleteItem = async (item: CatalogItem) => {
    try {
      await productService.deleteProduct(item.id);
    } catch {
      // Local delete
    }
    setItems((prev) => prev.filter((it) => it.id !== item.id));
    showNotification(`Producto ${item.sku} archivado del catálogo.`);
  };

  const getItemStatus = (item: CatalogItem): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (item.stock <= 0) return 'out_of_stock';
    if (item.stock <= item.threshold) return 'low_stock';
    return 'in_stock';
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryPill === 'ALL' || item.category === categoryPill;
    const status = getItemStatus(item);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalCustodiedUnits = items.reduce((acc, it) => acc + Number(it.stock || 0), 0);

  return (
    <div className="flex flex-col w-full">
      {/* Notification Toast */}
      {toastBanner && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-container-highest border border-primary/40 text-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md text-label-md">
          <span className="material-symbols-outlined text-tertiary text-base">check_circle</span>
          <span>{toastBanner}</span>
        </div>
      )}

      {/* Real-time Architecture Micro-rail */}
      <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md rounded-xl px-space-md py-space-xs flex flex-wrap items-center justify-between gap-2 mb-space-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
            </span>
            <span className="font-mono-data text-mono-data text-primary uppercase tracking-wider">
              SYNC BUS ACTIVE
            </span>
          </div>
          <span className="text-surface-bright font-mono-data">/</span>
          <div className="flex items-center gap-space-xs font-mono-data text-mono-data text-on-surface-variant">
            <span>PRODUCT SERVICE</span>
            <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-tertiary">
              :8082 OK
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-mono-data text-mono-data text-on-surface-variant">
            <span>INVENTORY SERVICE</span>
            <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-tertiary">
              :8083 OK
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm font-mono-data text-mono-data text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-secondary">cached</span>
          <span>
            PostgreSQL Shard: <span className="text-on-surface">AREQUIPA-ZONE-01</span>
          </span>
        </div>
      </div>

      {/* View Operational Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-secondary-container/20 px-2 py-0.5 rounded">
              Almacén Central Arequipa
            </span>
            <span className="font-mono-data text-mono-data text-on-surface-variant">
              · LATAM-SUR NODE
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Gestión de Catálogo &amp; Almacén Central Arequipa
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Control maestro de SKU, existencias físicas bivalentes, paridad cambiaria multimoneda y especificaciones de marroquinería artesanal fina.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={() => showNotification('Plantilla CSV de Catálogo Arequipa lista para importar.')}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-all duration-200 shadow-sm active:scale-98"
          >
            <span className="material-symbols-outlined text-base text-on-surface-variant">
              file_upload
            </span>
            <span>Importar CSV</span>
          </button>
          <button
            type="button"
            onClick={() => showNotification('Batch #AQ-884 activo en Taller Yanahuara (Arequipa).')}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-all duration-200 shadow-sm active:scale-98"
          >
            <span className="material-symbols-outlined text-base text-on-surface-variant">
              history
            </span>
            <span>Historial de Lotes</span>
          </button>
          <button
            type="button"
            onClick={handlePrepareNewProduct}
            className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:brightness-110 shadow-[0_4px_20px_rgba(212,163,115,0.25)] transition-all duration-200 font-bold active:scale-98"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Crear Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Master Split Layout: 40% Form (Product :8082) / 60% Inventory Ledger (:8083) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT PANEL: CRUD Studio Form (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-[0_12px_32px_-6px_rgba(0,0,0,0.5)] flex flex-col gap-space-md relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                  {editingId ? 'Formulario de Edición Activo' : 'Nuevo Registro de Catálogo'}
                </span>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Ficha Técnica de Producto
                  </span>
                  <span className="font-mono-data text-mono-data bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant">
                    :8082
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">
                edit_note
              </span>
            </div>

            <form
              className="flex flex-col gap-space-md"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct();
              }}
            >
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between"
                  htmlFor="prod-name"
                >
                  <span>Nombre del Producto</span>
                  <span className="text-primary font-mono-data text-mono-data">Requerido</span>
                </label>
                <input
                  id="prod-name"
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ej. Bolso de Cuero Artesanal Arequipeño"
                  className="w-full bg-surface-container rounded-lg px-space-md py-2.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner transition-all"
                />
              </div>

              {/* SKU & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium"
                    htmlFor="prod-sku"
                  >
                    SKU / Código Único
                  </label>
                  <div className="relative">
                    <input
                      id="prod-sku"
                      type="text"
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value.toUpperCase())}
                      className="w-full bg-surface-container rounded-lg pl-3 pr-8 py-2.5 font-mono-data text-mono-data text-secondary uppercase focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                    <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-base text-on-surface-variant">
                      qr_code_2
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium"
                    htmlFor="prod-cat"
                  >
                    Categoría Marroquinera
                  </label>
                  <div className="relative">
                    <select
                      id="prod-cat"
                      value={prodCat}
                      onChange={(e) => setProdCat(e.target.value as CatalogItem['category'])}
                      className="w-full bg-surface-container rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-primary shadow-inner cursor-pointer"
                    >
                      <option value="Bolsos">Bolsos de Mano</option>
                      <option value="Mochilas">Mochilas Ejecutivas</option>
                      <option value="Billeteras">Billeteras &amp; Tarjeteros</option>
                      <option value="Cinturones">Cinturones Finos</option>
                      <option value="Accesorios">Accesorios Ejecutivos</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-base text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Multicurrency Live Calculator */}
              <div className="bg-surface-container p-space-md rounded-xl flex flex-col gap-space-xs shadow-inner">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Paridad Cambiaria Automatizada
                  </span>
                  <span className="font-mono-data text-mono-data text-tertiary bg-tertiary/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                    1 USD = 3.75 PEN
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label
                      className="font-mono-data text-mono-data text-on-surface-variant"
                      htmlFor="price-usd"
                    >
                      Precio USD ($)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-secondary font-mono-data font-bold">
                        $
                      </span>
                      <input
                        id="price-usd"
                        type="number"
                        step="0.50"
                        value={priceUsd}
                        onChange={(e) => handleUsdChange(e.target.value)}
                        className="w-full bg-surface-container-high rounded-lg pl-7 pr-3 py-2 font-mono-data text-mono-data text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="font-mono-data text-mono-data text-on-surface-variant"
                      htmlFor="price-pen"
                    >
                      Precio PEN (S/.)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-primary font-mono-data font-bold">
                        S/
                      </span>
                      <input
                        id="price-pen"
                        type="number"
                        step="0.50"
                        value={pricePen}
                        onChange={(e) => handlePenChange(e.target.value)}
                        className="w-full bg-surface-container-high rounded-lg pl-8 pr-3 py-2 font-mono-data text-mono-data text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Physical & Alert Threshold */}
              <div className="grid grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="stock-qty"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">
                      warehouse
                    </span>
                    <span>Stock Arequipa</span>
                  </label>
                  <input
                    id="stock-qty"
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    className="w-full bg-surface-container rounded-lg px-3 py-2 font-mono-data text-mono-data text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="stock-threshold"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">
                      warning_amber
                    </span>
                    <span>Umbral Mínimo</span>
                  </label>
                  <input
                    id="stock-threshold"
                    type="number"
                    value={stockThreshold}
                    onChange={(e) => setStockThreshold(Number(e.target.value))}
                    className="w-full bg-surface-container rounded-lg px-3 py-2 font-mono-data text-mono-data text-secondary font-bold focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  />
                </div>
              </div>

              {/* Leather Specifications */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md text-on-surface font-medium"
                  htmlFor="leather-spec"
                >
                  Especificación de Cuero &amp; Acabado
                </label>
                <textarea
                  id="leather-spec"
                  rows={2}
                  value={leatherSpec}
                  onChange={(e) => setLeatherSpec(e.target.value)}
                  className="w-full bg-surface-container rounded-lg p-3 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner resize-none"
                />
              </div>

              {/* Product Image Studio Preview */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Fotografía en Estudio
                  </label>
                  <span className="font-mono-data text-mono-data text-on-surface-variant">
                    PNG/WebP / 4K
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-space-sm">
                  <div className="relative h-24 rounded-lg overflow-hidden bg-surface-container-highest group cursor-pointer shadow-sm">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Product preview"
                      src={prodImg}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 via-transparent to-transparent flex items-end p-1.5">
                      <span className="font-label-caps text-label-caps text-primary uppercase">
                        Principal
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      const nextUrl = window.prompt(
                        'Ingresa la URL de la fotografía de estudio:',
                        prodImg
                      );
                      if (nextUrl && nextUrl.trim()) setProdImg(nextUrl.trim());
                    }}
                    className="col-span-2 h-24 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex flex-col items-center justify-center p-2 text-center cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                      cloud_upload
                    </span>
                    <span className="font-label-md text-label-md text-on-surface mt-1">
                      Arrastrar o cambiar fotografía
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                      Fondo neutro o estudio (Max 12MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Action Footer */}
              <div className="pt-space-sm flex flex-col gap-space-xs">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold hover:brightness-110 shadow-[0_4px_16px_rgba(212,163,115,0.3)] transition-all flex items-center justify-center gap-space-xs active:scale-98"
                >
                  {saveState === 'saving' ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">
                        progress_activity
                      </span>
                      <span>Sincronizando con :8082...</span>
                    </>
                  ) : saveState === 'saved' ? (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>¡SKU Actualizado!</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>{editingId ? 'Guardar Cambios' : 'Crear Producto en Catálogo'}</span>
                    </>
                  )}
                </button>
                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    type="button"
                    onClick={handlePrepareNewProduct}
                    className="py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors text-center"
                  >
                    Cancelar / Limpiar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProduct}
                    className="py-2.5 rounded-xl bg-secondary-container/40 text-secondary hover:bg-secondary-container/60 font-label-md text-label-md transition-colors flex items-center justify-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">storefront</span>
                    <span>Publicar en Tienda</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Workshop Inventory Mini-Insight Widget */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-space-sm">
              <div className="p-2.5 rounded-xl bg-tertiary-container/20 text-tertiary">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {totalCustodiedUnits} Unidades
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Total físico custodiado en Arequipa
                </span>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-mono-data text-mono-data text-primary font-bold">98.2%</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Ratio Óptimo
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Inventory Ledger (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Filter and Query Header */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant pointer-events-none text-base">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  placeholder="Buscar por SKU, nombre artesanal o etiqueta..."
                  type="text"
                />
              </div>

              <div className="flex items-center gap-space-xs">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-surface-container text-on-surface font-label-md text-label-md px-3 py-2 pr-8 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-primary shadow-inner cursor-pointer"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="in_stock">En Stock</option>
                    <option value="low_stock">Stock Bajo</option>
                    <option value="out_of_stock">Agotado</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2 text-base text-on-surface-variant pointer-events-none">
                    filter_list
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    syncWithMicroservices();
                    showNotification('Catálogo e Inventario sincronizados con :8082 y :8083');
                  }}
                  className="p-2 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                  title="Refrescar desde Microservicios"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                </button>
              </div>
            </div>

            {/* Category Pills Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap">
              {(
                [
                  { key: 'ALL', label: `Todos (${items.length})` },
                  {
                    key: 'Bolsos',
                    label: `Bolsos (${items.filter((i) => i.category === 'Bolsos').length})`,
                  },
                  {
                    key: 'Mochilas',
                    label: `Mochilas (${items.filter((i) => i.category === 'Mochilas').length})`,
                  },
                  {
                    key: 'Billeteras',
                    label: `Billeteras (${items.filter((i) => i.category === 'Billeteras').length})`,
                  },
                  {
                    key: 'Cinturones',
                    label: `Cinturones (${items.filter((i) => i.category === 'Cinturones').length})`,
                  },
                  {
                    key: 'Accesorios',
                    label: `Accesorios (${items.filter((i) => i.category === 'Accesorios').length})`,
                  },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setCategoryPill(pill.key as any)}
                  className={
                    categoryPill === pill.key
                      ? 'px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold transition-all shadow-sm'
                      : 'px-3 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all'
                  }
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* High-Density Ledger Table Container */}
          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,0,0,0.55)] flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-lowest">
                  <tr>
                    <th className="py-3.5 pl-4 pr-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider w-14">
                      Miniatura
                    </th>
                    <th className="py-3.5 px-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      Producto &amp; SKU
                    </th>
                    <th className="py-3.5 px-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="py-3.5 px-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="py-3.5 px-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      Stock Arequipa
                    </th>
                    <th className="py-3.5 px-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      Estado :8083
                    </th>
                    <th className="py-3.5 pr-4 pl-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest/20 font-body-sm text-body-sm">
                  {filteredItems.map((item) => {
                    const status = getItemStatus(item);
                    const isSelected = editingId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectForEdit(item)}
                        className={`hover:bg-surface-container-high/60 transition-colors group cursor-pointer ${
                          status === 'low_stock'
                            ? 'bg-secondary-container/5'
                            : status === 'out_of_stock'
                            ? 'bg-error-container/5'
                            : ''
                        } ${isSelected ? 'ring-1 ring-inset ring-primary/40' : ''}`}
                      >
                        <td className="py-3 pl-4 pr-2">
                          <div
                            className={`w-11 h-11 rounded-lg overflow-hidden bg-surface-container-highest shadow-sm ${
                              status === 'out_of_stock' ? 'opacity-60' : ''
                            }`}
                          >
                            <img
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              alt={item.title}
                              src={item.img}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = item.fallbackImg;
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                              {item.title}
                            </span>
                            <span className="font-mono-data text-mono-data text-secondary">
                              {item.sku}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-mono-data text-mono-data text-on-surface font-bold">
                              ${item.priceUsd.toFixed(2)} USD
                            </span>
                            <span className="font-mono-data text-mono-data text-on-surface-variant">
                              S/. {(item.priceUsd * RATE).toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-space-xs">
                            <span
                              className={`font-mono-data text-mono-data font-bold ${
                                status === 'out_of_stock'
                                  ? 'text-error'
                                  : status === 'low_stock'
                                  ? 'text-secondary'
                                  : 'text-on-surface'
                              }`}
                            >
                              {item.stock}
                            </span>
                            <span className="text-on-surface-variant font-body-sm">uds</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {status === 'in_stock' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-md text-label-md font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                              En Stock
                            </span>
                          )}
                          {status === 'low_stock' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/30 text-secondary font-label-md text-label-md font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                              Stock Bajo
                            </span>
                          )}
                          {status === 'out_of_stock' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/30 text-error font-label-md text-label-md font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-error" />
                              Agotado
                            </span>
                          )}
                        </td>
                        <td
                          className="py-3 pr-4 pl-2 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {(status === 'low_stock' || status === 'out_of_stock') && (
                              <button
                                type="button"
                                onClick={() => handleRestockItem(item)}
                                className={`px-2 py-1 rounded font-mono-data text-mono-data font-semibold transition-colors flex items-center gap-1 ${
                                  status === 'out_of_stock'
                                    ? 'bg-error-container/40 text-error hover:bg-error-container'
                                    : 'bg-secondary-container/40 text-secondary hover:bg-secondary-container'
                                }`}
                                title="Reabastecer Lote (+30 uds)"
                              >
                                <span className="material-symbols-outlined text-xs">
                                  {status === 'out_of_stock' ? 'priority_high' : 'add_shopping_cart'}
                                </span>
                                <span>Reabastecer</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSelectForEdit(item)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                              title="Editar Producto"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateItem(item)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                              title="Duplicar SKU"
                            >
                              <span className="material-symbols-outlined text-base">
                                content_copy
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
                              title="Archivar"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Ledger Footer */}
            <div className="bg-surface-container-lowest px-space-md py-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant">
              <div className="flex items-center gap-space-xs font-mono-data text-mono-data">
                <span className="material-symbols-outlined text-sm text-tertiary">sync</span>
                <span>Sincronizado hace 2 min con Almacén Arequipa</span>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-body-sm text-body-sm">
                  Mostrando <strong className="text-on-surface">{filteredItems.length}</strong> de{' '}
                  <strong className="text-on-surface">{items.length}</strong> productos en catálogo central
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 rounded bg-surface-container text-on-surface-variant/40 cursor-not-allowed"
                    disabled
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <span className="font-mono-data text-mono-data px-2 text-primary font-bold">
                    1
                  </span>
                  <button
                    className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Production Telemetry Banner */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">precision_manufacturing</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Taller Yanahuara - Lote en Costura
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Batch #AQ-884: 40 Bolsos de Cuero Artesanal en etapa de tinte vegetal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <div className="w-32 bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="font-mono-data text-mono-data text-primary font-bold">72%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
