export interface AstroEvent {
  date: string; // ISO YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD for ranges
  dateEnd?: string;
  title: string;
  description: string;
  impact: string;
  isKey?: boolean; // Bold in the original doc
}

export const events2026: AstroEvent[] = [
  {
    date: '2026-04-07',
    title: 'Saturno entra en Aries',
    description: 'Activa Casa 7 de Edward (DSC 8° Aries) e inicia el tránsito hacia el Saturno natal de Martina (27° Aries). Comienzo del Retorno de Saturno de Martina y del ciclo de relaciones serias para Edward.',
    impact: 'Inicio del Retorno de Saturno de Martina · Saturno en Casa 7 de Edward',
    isKey: true,
  },
  {
    date: '2026-04-17',
    title: 'Luna Nueva en Aries (27°)',
    description: 'Luna Nueva a 27° Aries: cae exacta sobre el Saturno natal de Martina (27° Aries 25\', Casa 4) y dentro de la Casa 7 de Edward. Para Martina, es la apertura simbólica del año de mayor transformación personal. Para Edward, es una siembra de intenciones en el área del vínculo y la pareja.',
    impact: 'Exacta sobre Saturno natal de Martina · siembra en Casa 7 de Edward',
    isKey: true,
  },
  {
    date: '2026-04-26',
    title: 'Urano entra en Géminis',
    description: 'Urano deja Tauro tras 7 años. Activa Casa 9 de Edward (filosofía, viajes, creencias) y Casa 6 de Martina (rutinas, trabajo, salud). Cambios imprevistos en estas áreas para los próximos años.',
    impact: 'Casa 9 de Edward · Casa 6 de Martina · cambio de era',
    isKey: true,
  },
  {
    date: '2026-05-13',
    dateEnd: '2026-05-20',
    title: 'Sol + Mercurio + Urano en Tauro',
    description: 'Primera ventana de diálogo afectivo real',
    impact: 'Primera ventana de diálogo afectivo real',
    isKey: true,
  },
  {
    date: '2026-05-16',
    title: 'Luna Nueva en Tauro',
    description: 'Siembra sobre Venus (Edward) y Luna (Martina)',
    impact: 'Siembra sobre Venus (Edward) y Luna (Martina)',
  },
  {
    date: '2026-05-31',
    title: 'Luna Azul en Sagitario',
    description: 'Luna Llena en Sagitario · intensidad alta',
    impact: 'Intensidad alta · catarsis o conversación honesta',
  },
  {
    date: '2026-06-06',
    dateEnd: '2026-06-14',
    title: 'Venus–Júpiter en Cáncer',
    description: 'Conjunción Venus–Júpiter · ventana de máxima apertura',
    impact: 'Máxima oportunidad del año · estar disponibles',
    isKey: true,
  },
  {
    date: '2026-06-29',
    dateEnd: '2026-07-23',
    title: 'Mercurio retrógrado en Cáncer',
    description: 'Período de digestión de junio',
    impact: 'Revisar, no decidir · digestión de junio',
  },
  {
    date: '2026-06-30',
    title: 'Júpiter entra en Leo',
    description: 'Expansión de Edward hasta julio 2027',
    impact: 'Expansión de Edward · activo hasta jul 2027',
    isKey: true,
  },
  {
    date: '2026-07-02',
    title: 'Cumpleaños de Edward',
    description: 'Renovación de año personal · Solar Return',
    impact: 'Renovación de año personal',
  },
  {
    date: '2026-07-23',
    title: 'Mercurio directo',
    description: 'Segunda ventana de decisiones importantes',
    impact: 'Segunda ventana de decisiones importantes',
    isKey: true,
  },
  {
    date: '2026-08-12',
    title: 'Eclipse Solar Total en Leo',
    description: 'Cierre del ciclo iniciado en febrero',
    impact: 'Cierre del ciclo iniciado en febrero',
    isKey: true,
  },
  {
    date: '2026-08-28',
    title: 'Eclipse Lunar Parcial en Piscis',
    description: 'Revisión de rutinas y revelación interna',
    impact: 'Revisión de rutinas y revelación interna',
  },
  {
    date: '2026-10-03',
    title: 'Venus retrógrado',
    description: 'Venus retrógrado en Escorpio → Libra',
    impact: 'Revisión profunda de amor y valores',
  },
  {
    date: '2026-10-24',
    title: 'Mercurio retrógrado (simultáneo con Venus)',
    description: 'Período de revisión total',
    impact: 'Período de revisión total · no firmar contratos',
  },
  {
    date: '2026-11-13',
    dateEnd: '2026-11-14',
    title: 'Venus y Mercurio directos',
    description: 'Claridad y cierre de ciclo',
    impact: 'Claridad · cierre de ciclo',
    isKey: true,
  },
  {
    date: '2026-11-15',
    dateEnd: '2026-12-15',
    title: 'Retorno de Saturno · conjunción exacta',
    description: 'Maduración definitiva de Martina · nueva etapa adulta',
    impact: 'Maduración definitiva de Martina · nueva etapa adulta',
    isKey: true,
  },
  {
    date: '2026-12-02',
    title: 'Cumpleaños 28 de Martina',
    description: 'Culminación del retorno de Saturno',
    impact: 'Culminación del retorno de Saturno',
    isKey: true,
  },
];
