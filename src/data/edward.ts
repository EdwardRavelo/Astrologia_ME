export const edward = {
  name: 'Edward Ravelo',
  birthDate: '1993-07-02',
  birthTime: '11:47',
  birthPlace: 'Bogotá, Colombia',
  coords: { lat: 4.6097, lon: -74.0817 },

  elements: [
    { name: 'Agua', pct: 36.36 },
    { name: 'Tierra', pct: 27.27 },
    { name: 'Aire', pct: 22.73 },
    { name: 'Fuego', pct: 13.64 },
  ],

  modalities: [
    { name: 'Cardinal', pct: 59.09 },
    { name: 'Mutable', pct: 22.73 },
    { name: 'Fijo', pct: 18.18 },
  ],

  planets: [
    { symbol: '☉', name: 'Sol', position: '10° Cáncer 48\'', house: 10, notes: '' },
    { symbol: '☽', name: 'Luna', position: '24° Sagitario 59\'', house: 3, notes: '' },
    { symbol: '☿', name: 'Mercurio', position: '28° Cáncer 12\'', house: 10, notes: 'Retrógrado' },
    { symbol: '♀', name: 'Venus', position: '26° Tauro 26\'', house: 8, notes: '' },
    { symbol: '♂', name: 'Marte', position: '5° Virgo 27\'', house: 11, notes: 'Entre casas' },
    { symbol: '♃', name: 'Júpiter', position: '6° Libra 12\'', house: 12, notes: 'Entre casas' },
    { symbol: '♄', name: 'Saturno', position: '29° Acuario 55\'', house: 5, notes: 'Retrógrado' },
    { symbol: '♅', name: 'Urano', position: '20° Capricornio 36\'', house: 4, notes: 'Retrógrado' },
    { symbol: '♆', name: 'Neptuno', position: '20° Capricornio 1\'', house: 4, notes: 'Retrógrado' },
    { symbol: '♇', name: 'Plutón', position: '22° Escorpio 58\'', house: 2, notes: 'Retrógrado' },
    { symbol: 'Ω', name: 'Nodo Norte', position: '10° Sagitario 45\'', house: 3, notes: 'Retrógrado' },
    { symbol: 'ƒ', name: 'Quirón', position: '21° Leo 56\'', house: 11, notes: '' },
  ],

  houses: [
    { house: 1, label: 'ASC', cusp: '8° Libra 50\'' },
    { house: 2, label: '', cusp: '9° Escorpio 59\'' },
    { house: 3, label: '', cusp: '9° Sagitario 27\'' },
    { house: 4, label: 'IC', cusp: '7° Capricornio 43\'' },
    { house: 5, label: '', cusp: '6° Acuario 32\'' },
    { house: 6, label: '', cusp: '7° Piscis 10\'' },
    { house: 7, label: 'DSC', cusp: '8° Aries 50\'' },
    { house: 8, label: '', cusp: '9° Tauro 59\'' },
    { house: 9, label: '', cusp: '9° Géminis 27\'' },
    { house: 10, label: 'MC', cusp: '7° Cáncer 43\'' },
    { house: 11, label: '', cusp: '6° Leo 32\'' },
    { house: 12, label: '', cusp: '7° Virgo 10\'' },
  ],

  keyAspects: [
    { p1: 'Sol', aspect: 'Trígono', p2: 'Venus', orb: '0.35°', type: 'harmonic', note: 'Amor y creatividad en flujo' },
    { p1: 'Sol', aspect: 'Cuadratura', p2: 'Júpiter', orb: '4.6°', type: 'tension', note: 'Tensión entre identidad y expansión' },
    { p1: 'Luna', aspect: 'Trígono', p2: 'Saturno', orb: '3.06°', type: 'harmonic', note: 'Madurez emocional' },
    { p1: 'Venus', aspect: 'Cuadratura', p2: 'Saturno', orb: '3.48°', type: 'tension', note: 'El amor no se da sin peso' },
    { p1: 'Urano', aspect: 'Conjunción', p2: 'Neptuno', orb: '0.58°', type: 'generational', note: 'Generacional — visión y ruptura' },
    { p1: 'Saturno', aspect: 'Oposición', p2: 'Plutón', orb: '3.47°', type: 'tension', note: 'Transformación profunda de estructura' },
  ],
};
