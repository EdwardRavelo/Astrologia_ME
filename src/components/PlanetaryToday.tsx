import { useState, useEffect } from 'react';

interface PlanetData {
  symbol: string;
  name: string;
  sign: string;
  degree: number;
  retrograde?: boolean;
  phase?: string;
  phaseEmoji?: string;
}

const SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

function longitudeToSign(deg: number): { sign: string; degree: number } {
  const normalized = ((deg % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return { sign: SIGNS[signIndex], degree: Math.floor(degree) };
}

function getMoonPhaseEmoji(phase: number): { name: string; emoji: string } {
  // phase: 0-1 (0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter)
  if (phase < 0.0625 || phase >= 0.9375) return { name: 'Luna Nueva', emoji: '🌑' };
  if (phase < 0.1875) return { name: 'Luna Creciente', emoji: '🌒' };
  if (phase < 0.3125) return { name: 'Cuarto Creciente', emoji: '🌓' };
  if (phase < 0.4375) return { name: 'Gibosa Creciente', emoji: '🌔' };
  if (phase < 0.5625) return { name: 'Luna Llena', emoji: '🌕' };
  if (phase < 0.6875) return { name: 'Gibosa Menguante', emoji: '🌖' };
  if (phase < 0.8125) return { name: 'Cuarto Menguante', emoji: '🌗' };
  return { name: 'Luna Menguante', emoji: '🌘' };
}

// Julian Day Number from a date
function toJDE(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  let Y = y;
  let M = m;
  if (m <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

// Simple VSOP87-approximation for Sun ecliptic longitude
function sunLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = (M * Math.PI) / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  const sunLon = L0 + C;
  // Apparent longitude (aberration approx)
  const omega = 125.04 - 1934.136 * T;
  const omegaRad = (omega * Math.PI) / 180;
  return ((sunLon - 0.00569 - 0.00478 * Math.sin(omegaRad)) % 360 + 360) % 360;
}

// Simple Moon longitude approximation
function moonLongitude(jde: number): { lon: number; phase: number } {
  const T = (jde - 2451545.0) / 36525;
  const D = 297.85036 + 445267.111480 * T - 0.0019142 * T * T;
  const M = 357.52772 + 35999.050340 * T - 0.0001603 * T * T;
  const Mp = 134.96298 + 477198.867398 * T + 0.0086972 * T * T;
  const F = 93.27191 + 483202.017538 * T - 0.0036825 * T * T;
  const deg = Math.PI / 180;
  const lon = 218.3165 + 481267.8813 * T
    + 6.289 * Math.sin(Mp * deg)
    - 1.274 * Math.sin((2 * D - Mp) * deg)
    + 0.658 * Math.sin(2 * D * deg)
    - 0.214 * Math.sin(2 * Mp * deg)
    - 0.186 * Math.sin(M * deg)
    - 0.114 * Math.sin(2 * F * deg);
  const sunLon = sunLongitude(jde);
  const elongation = ((lon - sunLon) % 360 + 360) % 360;
  const phase = elongation / 360;
  return { lon: ((lon % 360) + 360) % 360, phase };
}

// Approximate positions for visible planets using mean elements
function planetLongitude(jde: number, planet: string): number {
  const T = (jde - 2451545.0) / 36525;
  // Mean longitudes (very approximate)
  const L: Record<string, number> = {
    Mercury: ((252.25032 + 149472.67411 * T) % 360 + 360) % 360,
    Venus: ((181.97973 + 58517.81538 * T) % 360 + 360) % 360,
    Mars: ((355.45332 + 19140.29934 * T) % 360 + 360) % 360,
    Jupiter: ((34.40438 + 3034.90374 * T) % 360 + 360) % 360,
    Saturn: ((49.94432 + 1222.11494 * T) % 360 + 360) % 360,
    Uranus: ((313.23218 + 428.48202 * T) % 360 + 360) % 360,
    Neptune: ((304.88003 + 218.46515 * T) % 360 + 360) % 360,
  };
  return L[planet] ?? 0;
}

// Rough check for retrograde (compare position a few days forward/back)
function isRetrograde(jde: number, planet: string): boolean {
  if (planet === 'Sun' || planet === 'Moon') return false;
  const lon1 = planetLongitude(jde - 5, planet);
  const lon2 = planetLongitude(jde + 5, planet);
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

export default function PlanetaryToday() {
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const now = new Date();
      const jde = toJDE(now);

      const sunLon = sunLongitude(jde);
      const { lon: moonLon, phase: moonPhase } = moonLongitude(jde);
      const { name: phaseName, emoji: phaseEmoji } = getMoonPhaseEmoji(moonPhase);

      const mercuryLon = planetLongitude(jde, 'Mercury');
      const venusLon = planetLongitude(jde, 'Venus');
      const marsLon = planetLongitude(jde, 'Mars');
      const jupiterLon = planetLongitude(jde, 'Jupiter');
      const saturnLon = planetLongitude(jde, 'Saturn');

      const result: PlanetData[] = [
        { symbol: '☉', name: 'Sol', ...longitudeToSign(sunLon) },
        { symbol: '☽', name: 'Luna', ...longitudeToSign(moonLon), phase: phaseName, phaseEmoji },
        { symbol: '☿', name: 'Mercurio', ...longitudeToSign(mercuryLon), retrograde: isRetrograde(jde, 'Mercury') },
        { symbol: '♀', name: 'Venus', ...longitudeToSign(venusLon), retrograde: isRetrograde(jde, 'Venus') },
        { symbol: '♂', name: 'Marte', ...longitudeToSign(marsLon), retrograde: isRetrograde(jde, 'Mars') },
        { symbol: '♃', name: 'Júpiter', ...longitudeToSign(jupiterLon) },
        { symbol: '♄', name: 'Saturno', ...longitudeToSign(saturnLon), retrograde: isRetrograde(jde, 'Saturn') },
      ];

      setPlanets(result);
      setLoading(false);
    } catch (e) {
      setError('Error al calcular posiciones planetarias');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="card animate-pulse h-28" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 font-mono text-sm">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {planets.map((p) => (
        <div
          key={p.name}
          className="bg-space-800 border border-space-700 rounded-xl p-5 hover:border-gold-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold-400/5"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl text-gold-400 font-mono leading-none">{p.symbol}</span>
            {p.retrograde && (
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">℞</span>
            )}
          </div>
          <div className="text-star-white font-sans text-sm mb-1">{p.name}</div>
          <div className="text-gold-300 font-mono text-base font-medium">
            {p.degree}° {p.sign}
          </div>
          {p.phase && (
            <div className="text-silver-300 text-xs mt-1 font-mono">
              {p.phaseEmoji} {p.phase}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
