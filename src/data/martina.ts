export const martina = {
  name: 'Martina',
  birthDate: '1998-12-02',
  birthTime: '08:30',
  birthPlace: 'Chivilcoy, Buenos Aires, ARG',
  coords: { lat: -34.9083, lon: -60.0306 },

  elements: [
    { name: 'Fuego', pct: 40.91 },
    { name: 'Tierra', pct: 27.27 },
    { name: 'Aire', pct: 27.27 },
    { name: 'Agua', pct: 4.55 },
  ],

  modalities: [
    { name: 'Mutable', pct: 40.91 },
    { name: 'Cardinal', pct: 36.36 },
    { name: 'Fijo', pct: 22.73 },
  ],

  planets: [
    { symbol: '☉', name: 'Sol', position: '10° Sagitario 4\'', house: 11, notes: '' },
    { symbol: '☽', name: 'Luna', position: '23° Tauro 40\'', house: 5, notes: '' },
    { symbol: '☿', name: 'Mercurio', position: '8° Sagitario 4\'', house: 11, notes: 'Retrógrado' },
    { symbol: '♀', name: 'Venus', position: '18° Sagitario 19\'', house: 12, notes: '' },
    { symbol: '♂', name: 'Marte', position: '2° Libra 49\'', house: 9, notes: 'Entre casas' },
    { symbol: '♃', name: 'Júpiter', position: '18° Piscis 46\'', house: 3, notes: '' },
    { symbol: '♄', name: 'Saturno', position: '27° Aries 25\'', house: 4, notes: 'Retrógrado' },
    { symbol: '♅', name: 'Urano', position: '9° Acuario 38\'', house: 1, notes: 'Entre casas' },
    { symbol: '♆', name: 'Neptuno', position: '0° Acuario 6\'', house: 1, notes: '' },
    { symbol: '♇', name: 'Plutón', position: '8° Sagitario 0\'', house: 11, notes: '' },
    { symbol: 'Ω', name: 'Nodo Norte', position: '25° Leo 57\'', house: 8, notes: 'Retrógrado' },
    { symbol: 'ƒ', name: 'Quirón', position: '25° Virgo 40\'', house: 11, notes: '' },
  ],

  houses: [
    { house: 1, label: 'ASC', cusp: '18° Capricornio 32\'' },
    { house: 2, label: '', cusp: '9° Acuario 45\'' },
    { house: 3, label: '', cusp: '4° Piscis 2\'' },
    { house: 4, label: 'IC', cusp: '3° Aries 53\'' },
    { house: 5, label: '', cusp: '9° Tauro 28\'' },
    { house: 6, label: '', cusp: '16° Géminis 5\'' },
    { house: 7, label: 'DSC', cusp: '18° Cáncer 32\'' },
    { house: 8, label: '', cusp: '9° Leo 45\'' },
    { house: 9, label: '', cusp: '4° Virgo 2\'' },
    { house: 10, label: 'MC', cusp: '3° Libra 53\'' },
    { house: 11, label: '', cusp: '9° Escorpio 28\'' },
    { house: 12, label: '', cusp: '16° Sagitario 5\'' },
  ],

  keyAspects: [
    { p1: 'Sol', aspect: 'Conjunción', p2: 'Mercurio', orb: '2°', type: 'harmonic', note: 'Mente e identidad integradas' },
    { p1: 'Sol', aspect: 'Sextil', p2: 'Urano', orb: '0.44°', type: 'harmonic', note: 'Originalidad e independencia' },
    { p1: 'Luna', aspect: 'Oposición', p2: 'Saturno', orb: '2°', type: 'tension', note: 'Tensión entre necesidad y estructura' },
    { p1: 'Venus', aspect: 'Cuadratura', p2: 'Júpiter', orb: '0.44°', type: 'tension', note: 'Exceso emocional sin estructura' },
    { p1: 'Marte', aspect: 'Conjunción', p2: 'MC', orb: '1.08°', type: 'harmonic', note: 'Acción y vocación integradas' },
    { p1: 'Mercurio', aspect: 'Conjunción', p2: 'Neptuno', orb: '0.07°', type: 'harmonic', note: 'Pensamiento intuitivo y poético' },
  ],
};
