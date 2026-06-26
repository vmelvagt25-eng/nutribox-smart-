/* ============================================================
   NUTRIBOX - DATOS DE LA APLICACIÓN
   ============================================================ */

const RECIPES = [
  {
    id: 1,
    name: "Wrap Power",
    emoji: "🌯",
    difficulty: "Fácil",
    difficultyNum: 2,
    time: 10,
    tags: ["pollo", "rapida", "proteina"],
    ingredients: ["Tortilla integral", "Pollo a la plancha", "Lechuga fresca", "Tomate", "Palta/Aguacate"],
    steps: [
      "Calienta la tortilla integral en una sartén por 30 segundos.",
      "Coloca las lonchas de pollo en el centro de la tortilla.",
      "Agrega la lechuga y el tomate en rodajas.",
      "Añade la palta en rodajas o guacamole.",
      "Enrolla firmemente y corta en diagonal.",
      "¡Empaca en papel aluminio para mantenerlo fresco!"
    ],
    nutrition: { calorias: 320, proteinas: 28, carbos: 35, grasas: 8 },
    community_rating: 4.5,
    cost: "S/4.50"
  },
  {
    id: 2,
    name: "Brochetas Superhéroe",
    emoji: "🍢",
    difficulty: "Muy fácil",
    difficultyNum: 1,
    time: 8,
    tags: ["queso", "rapida", "economica", "vegetariana"],
    ingredients: ["Queso fresco en cubos", "Tomate cherry", "Pepino en rodajas", "Jamón de pavo"],
    steps: [
      "Lava bien todos los vegetales.",
      "Corta el queso en cubos medianos.",
      "Corta el pepino en rodajas gruesas.",
      "Ensarta en palitos de madera alternando: pepino, jamón, queso, tomate.",
      "Repite el patrón hasta llenar el palito.",
      "¡Sirve en un recipiente con tapa para el lonchero!"
    ],
    nutrition: { calorias: 220, proteinas: 18, carbos: 8, grasas: 12 },
    community_rating: 5,
    cost: "S/3.80"
  },
  {
    id: 3,
    name: "Mini Hamburguesitas Saludables",
    emoji: "🍔",
    difficulty: "Media",
    difficultyNum: 3,
    time: 20,
    tags: ["pollo", "proteina"],
    ingredients: ["Pan integral pequeño", "Hamburguesa de pollo casera", "Lechuga", "Tomate", "Mostaza o mayonesa light"],
    steps: [
      "Mezcla la pechuga molida con sal, pimienta y ajo en polvo.",
      "Forma medallones pequeños y cocina en sartén con aceite mínimo.",
      "Tuesta ligeramente el pan integral.",
      "Arma la hamburguesa: pan, lechuga, hamburguesa, tomate.",
      "Agrega salsa al gusto.",
      "Envuelve en papel film y lleva al lonchero."
    ],
    nutrition: { calorias: 380, proteinas: 32, carbos: 40, grasas: 10 },
    community_rating: 4.8,
    cost: "S/5.20"
  },
  {
    id: 4,
    name: "Pizza Escolar Nutritiva",
    emoji: "🍕",
    difficulty: "Media",
    difficultyNum: 3,
    time: 15,
    tags: ["pollo", "queso", "proteina"],
    ingredients: ["Pan pita integral", "Salsa de tomate casera", "Pollo desmenuzado", "Tomate", "Queso fresco rallado"],
    steps: [
      "Precalienta el horno a 180°C o usa el microondas.",
      "Unta salsa de tomate sobre el pan pita.",
      "Distribuye el pollo desmenuzado uniformemente.",
      "Agrega rodajas de tomate.",
      "Cubre con queso fresco rallado.",
      "Hornea 10 minutos o microondas 3 minutos.",
      "Deja enfriar antes de empacar."
    ],
    nutrition: { calorias: 350, proteinas: 25, carbos: 42, grasas: 9 },
    community_rating: 4.6,
    cost: "S/4.80"
  },
  {
    id: 5,
    name: "Rollitos Campeones",
    emoji: "🥙",
    difficulty: "Fácil",
    difficultyNum: 2,
    time: 12,
    tags: ["huevo", "verduras", "vegetariana", "proteina"],
    ingredients: ["Tortilla integral", "Huevo revuelto", "Espinaca fresca", "Queso fresco", "Sal y pimienta"],
    steps: [
      "Bate los huevos con sal y pimienta.",
      "Cocina los huevos revueltos a fuego bajo.",
      "Calienta la tortilla 30 segundos.",
      "Extiende el queso fresco sobre la tortilla.",
      "Agrega las hojas de espinaca.",
      "Coloca el huevo revuelto encima.",
      "Enrolla firmemente y corta en porciones."
    ],
    nutrition: { calorias: 295, proteinas: 20, carbos: 32, grasas: 11 },
    community_rating: 4.3,
    cost: "S/3.50"
  }
];

const BADGES = [
  { id: 1, emoji: "🌱", name: "Semilla Nutri", desc: "¡Tu primera insignia!", req: 5, reward: "Desbloquea mascota virtual" },
  { id: 2, emoji: "⚡", name: "Explorador Energético", desc: "¡Estás en racha!", req: 10, reward: "Desbloquea accesorios del avatar" },
  { id: 3, emoji: "🛡", name: "Guardián de la Energía", desc: "¡Eres constante!", req: 15, reward: "Desbloquea minijuegos exclusivos" },
  { id: 4, emoji: "🧠", name: "Maestro de la Concentración", desc: "¡Tu cerebro agradece!", req: 20, reward: "Multiplicador de insignias x2" },
  { id: 5, emoji: "🥗", name: "Genio Nutri", desc: "¡Casi un experto!", req: 25, reward: "Acceso a recetas premium" },
  { id: 6, emoji: "🏆", name: "Campeón NutriBox", desc: "¡Increíble logro!", req: 30, reward: "Diseña la Lonchera de la Semana" },
  { id: 7, emoji: "⭐", name: "Influencer Saludable", desc: "¡Todos te admiran!", req: 40, reward: "Aparece en el Salón de la Fama" },
  { id: 8, emoji: "👑", name: "Leyenda NutriBox", desc: "¡El máximo nivel!", req: 50, reward: "Mentor de nuevos usuarios" }
];

const SALON_POSTS = [
  { id: 1, author: "Familia Rodríguez", emoji: "🥗", date: "25 Jun", text: "¡Mi hijo quedó encantado con el Wrap Power! Lo ayudé a enrollarlo y fue toda una aventura. 💪", likes: 24 },
  { id: 2, author: "Mamá de Sofía", emoji: "🍢", date: "24 Jun", text: "Las Brochetas Superhéroe son un éxito total. En 8 minutos lista y Sofía las ama! 🌟", likes: 31 },
  { id: 3, author: "Familia Pérez", emoji: "🍕", date: "23 Jun", text: "Hicimos la Pizza Escolar Nutritiva por primera vez y quedó deliciosa. ¡Altamente recomendada!", likes: 18 },
  { id: 4, author: "Papá de Lucas", emoji: "🍔", date: "22 Jun", text: "Lucas ya sabe hacer las Mini Hamburguesitas solo. ¡Qué orgulloso estoy! 🎉", likes: 42 }
];

const FORO_POSTS_INIT = [
  { id: 1, author: "Carmen M.", avatar: "👩", text: "Consejo: Prepara los ingredientes la noche anterior. En la mañana solo armas la lonchera y ahorras 10 minutos valiosos.", date: "hace 2h", likes: 15 },
  { id: 2, author: "Roberto V.", avatar: "👨", text: "¿Alguien sabe dónde consiguen tortillas integrales económicas? Las del mercado son buenas pero caras...", date: "hace 3h", likes: 8 },
  { id: 3, author: "Ana L.", avatar: "👩‍🦱", text: "Tip: Compren las frutas de temporada, son más baratas y nutritivas. Esta semana el mango está espectacular 🥭", date: "hace 5h", likes: 22 }
];

const TREE_STAGES = [
  { min: 0,  max: 4,  emoji: "🌰", label: "Semilla" },
  { min: 5,  max: 9,  emoji: "🌱", label: "Brote" },
  { min: 10, max: 19, emoji: "🪴", label: "Planta pequeña" },
  { min: 20, max: 29, emoji: "🌿", label: "Árbol joven" },
  { min: 30, max: 39, emoji: "🌳", label: "Árbol grande" },
  { min: 40, max: 49, emoji: "🌸", label: "Árbol con flores" },
  { min: 50, max: 999,emoji: "🎄", label: "Gran árbol lleno de frutos" }
];

const NOTIFICATIONS = [
  { icon: "🥗", title: "¡Hora de la lonchera!", text: "Hoy toca preparar una nueva lonchera" },
  { icon: "🌳", title: "Tu árbol necesita crecer", text: "¡Sube una foto para ganar insignias!" },
  { icon: "📖", title: "Receta nueva disponible", text: "¡Prueba la nueva receta de temporada!" },
  { icon: "🎮", title: "¡Videojuego desbloqueado!", text: "Ya puedes jugar Carrera de Alimentos" }
];

const AI_SUGGESTIONS = [
  "🤖 IA sugiere: Basado en los gustos de tu hijo, el Wrap Power es perfecto para mañana.",
  "🤖 IA sugiere: Para ahorrar esta semana, las Brochetas Superhéroe son la opción más económica.",
  "🤖 IA sugiere: ¿Qué tal sustituir la palta por huevo en el Wrap? Misma proteína, menor costo.",
  "🤖 IA sugiere: Menú semanal personalizado listo. Presiona para ver los 5 días.",
  "🤖 IA sugiere: Tu hijo tiene baja satisfacción con verduras. Los Rollitos Campeones los enmascara bien."
];

const GAME_FOODS = {
  healthy: ["🍎","🥕","🍌","🥦","🍓","🍊","🥑","🫐","🍇","🥝","🍑","🥗"],
  unhealthy: ["🍔","🍟","🍕","🍩","🍭","🧃","🍫","🥤"]
};
