export interface TrendingItem {
  id?: number;
  name: string;
  imgsrc: string;
  popularity: number;
  users: string[];
}

export const trendingItems: TrendingItem[] = [
  {
    id: 1,
    name: 'Bolso de Cuero Artesanal Arequipa',
    imgsrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    popularity: 88,
    users: ['Valeria Paredes', 'Carlos Mendoza', 'Lucía Quispe', 'Rodrigo Vargas', 'Andrea Salas'],
  },
  {
    id: 2,
    name: 'Mochila Ejecutiva de Cuero Genuino',
    imgsrc: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    popularity: 79,
    users: ['Jolaus Meza', 'Diego Cornejo', 'Fernanda Cáceres', 'Martín Delgado'],
  },
  {
    id: 3,
    name: 'Billetera Clásica Piel Vacuna',
    imgsrc: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    popularity: 71,
    users: ['Sebastián Rojas', 'Camila Flores', 'Jorge Chávez', 'Paola Medina', 'Luis Zeballos'],
  },
  {
    id: 4,
    name: 'Cinturón Hebilla Dorada Premium',
    imgsrc: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    popularity: 64,
    users: ['Gabriela Benavides', 'Renzo Polar', 'Mariana Núñez'],
  },
];
