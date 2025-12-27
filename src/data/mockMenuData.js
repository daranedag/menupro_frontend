// Mock data para demostración
export const mockMenus = [
  {
    id: 'breakfast',
    name: 'Desayuno',
    icon: '🌅',
    description: '6:00 AM - 11:00 AM',
    sections: [
      {
        id: 'breakfast-specials',
        name: 'Especiales del Día',
        icon: '⭐',
        description: 'Nuestras recomendaciones de la mañana',
        items: [
          {
            id: 'b1',
            name: 'Desayuno Continental',
            description: 'Croissant, café, jugo de naranja y frutas frescas',
            longDescription: 'Croissant recién horneado, café premium de origen colombiano, jugo de naranja natural y una selección de frutas de temporada',
            price: 12.99,
            discount: 20,
            image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
            tags: [
              { label: 'Popular', variant: 'primary' },
              { label: 'Ligero', variant: 'success' }
            ],
            calories: 450,
            prepTime: 10,
          },
          {
            id: 'b2',
            name: 'Huevos Benedictinos',
            description: 'Huevos pochados sobre muffin inglés con salsa holandesa',
            longDescription: 'Dos huevos pochados perfectamente cocinados sobre muffin inglés tostado, cubiertos con nuestra cremosa salsa holandesa casera, acompañados de papas rostizadas y ensalada',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
            tags: [
              { label: 'Chef\'s Special', variant: 'warning' }
            ],
            calories: 620,
            prepTime: 15,
          },
        ]
      },
      {
        id: 'breakfast-pancakes',
        name: 'Pancakes & Waffles',
        icon: '🥞',
        items: [
          {
            id: 'b3',
            name: 'Pancakes Clásicos',
            description: 'Stack de 3 pancakes esponjosos con maple syrup y mantequilla',
            price: 9.99,
            discount: 15,
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
            tags: [
              { label: 'Vegetariano', variant: 'success' }
            ],
            calories: 580,
            prepTime: 12,
            isVegetarian: true,
          },
          {
            id: 'b4',
            name: 'Waffles con Fresas',
            description: 'Waffles crujientes con fresas frescas y crema batida',
            price: 11.99,
            image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400',
            calories: 640,
            prepTime: 15,
            isVegetarian: true,
          },
        ]
      }
    ]
  },
  {
    id: 'lunch',
    name: 'Almuerzo',
    icon: '🍽️',
    description: '11:00 AM - 4:00 PM',
    sections: [
      {
        id: 'lunch-starters',
        name: 'Entradas',
        icon: '🥗',
        items: [
          {
            id: 'l1',
            name: 'Ensalada César',
            description: 'Lechuga romana, crutones, parmesano y aderezo césar',
            longDescription: 'Lechuga romana fresca, crutones caseros, queso parmesano rallado y nuestro aderezo césar preparado al momento',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
            tags: [
              { label: 'Vegetariano', variant: 'success' },
              { label: 'Light', variant: 'info' }
            ],
            calories: 280,
            prepTime: 8,
            isVegetarian: true,
          },
          {
            id: 'l2',
            name: 'Sopa del Día',
            description: 'Pregunta por la preparación especial de hoy',
            price: 6.99,
            discount: 10,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
            calories: 180,
            prepTime: 5,
          },
        ]
      },
      {
        id: 'lunch-mains',
        name: 'Platos Principales',
        icon: '🍖',
        items: [
          {
            id: 'l3',
            name: 'Hamburguesa Clásica',
            description: 'Carne 100% res, lechuga, tomate, cebolla, pepinillos y salsa especial',
            longDescription: '200g de carne premium 100% res, lechuga fresca, tomate, cebolla morada, pepinillos, queso cheddar y nuestra salsa especial de la casa. Servida con papas fritas crujientes',
            price: 14.99,
            discount: 25,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            tags: [
              { label: 'Best Seller', variant: 'danger' }
            ],
            calories: 850,
            prepTime: 18,
          },
          {
            id: 'l4',
            name: 'Pasta Carbonara',
            description: 'Spaghetti con panceta, huevo, parmesano y pimienta negra',
            price: 13.99,
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
            calories: 720,
            prepTime: 20,
          },
          {
            id: 'l5',
            name: 'Pollo a la Parrilla',
            description: 'Pechuga de pollo marinada con vegetales asados',
            longDescription: 'Pechuga de pollo marinada en hierbas finas, asada a la parrilla y servida con una selección de vegetales de temporada rostizados y arroz integral',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
            tags: [
              { label: 'Saludable', variant: 'success' },
              { label: 'Alto en Proteína', variant: 'info' }
            ],
            calories: 480,
            prepTime: 22,
          },
        ]
      }
    ]
  },
  {
    id: 'drinks',
    name: 'Bebidas',
    icon: '🍹',
    description: 'Todo el día',
    sections: [
      {
        id: 'drinks-hot',
        name: 'Bebidas Calientes',
        icon: '☕',
        items: [
          {
            id: 'd1',
            name: 'Café Americano',
            description: 'Espresso doble con agua caliente',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
            calories: 5,
            prepTime: 3,
          },
          {
            id: 'd2',
            name: 'Cappuccino',
            description: 'Espresso con leche vaporizada y espuma',
            price: 4.50,
            discount: 10,
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
            tags: [
              { label: 'Popular', variant: 'primary' }
            ],
            calories: 120,
            prepTime: 5,
          },
        ]
      },
      {
        id: 'drinks-cold',
        name: 'Bebidas Frías',
        icon: '🧊',
        items: [
          {
            id: 'd3',
            name: 'Limonada Natural',
            description: 'Limones frescos, agua y azúcar',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9f?w=400',
            tags: [
              { label: 'Refrescante', variant: 'info' }
            ],
            calories: 110,
            prepTime: 3,
            isVegetarian: true,
          },
          {
            id: 'd4',
            name: 'Smoothie de Frutas',
            description: 'Mezcla de frutas tropicales con yogurt',
            price: 6.99,
            discount: 15,
            image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
            tags: [
              { label: 'Saludable', variant: 'success' }
            ],
            calories: 240,
            prepTime: 5,
            isVegetarian: true,
          },
        ]
      },
      {
        id: 'drinks-cocktails',
        name: 'Cócteles',
        icon: '🍸',
        items: [
          {
            id: 'd5',
            name: 'Mojito Clásico',
            description: 'Ron blanco, menta, lima, azúcar y soda',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
            tags: [
              { label: 'Best Seller', variant: 'danger' }
            ],
            prepTime: 7,
          },
          {
            id: 'd6',
            name: 'Margarita',
            description: 'Tequila, triple sec, jugo de lima',
            price: 10.99,
            discount: 20,
            image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400',
            prepTime: 5,
            isSpicy: true,
          },
        ]
      }
    ]
  }
];

// Información del restaurante de ejemplo
export const mockRestaurant = {
  id: '123',
  name: 'Restaurante La Delicia',
  description: 'Cocina tradicional con un toque moderno',
  address: 'Calle Principal #123, Ciudad',
  phone: '+1 234 567 8900',
  hours: 'Lun-Dom: 6:00 AM - 11:00 PM',
  logo: '🍽️',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
};
