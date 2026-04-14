import { useState, useEffect } from 'react';
import { events2026 } from '../data/events2026';
import type { AstroEvent } from '../data/events2026';

// ─── Astronomical helpers (independent copy, same as PlanetaryToday.tsx) ────

const SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

function longitudeToSign(deg: number): { sign: string; degree: number } {
  const normalized = ((deg % 360) + 360) % 360;
  return { sign: SIGNS[Math.floor(normalized / 30)], degree: Math.floor(normalized % 30) };
}

function getMoonPhaseInfo(phase: number): { name: string; emoji: string } {
  if (phase < 0.0625 || phase >= 0.9375) return { name: 'Luna Nueva', emoji: '🌑' };
  if (phase < 0.1875) return { name: 'Luna Creciente', emoji: '🌒' };
  if (phase < 0.3125) return { name: 'Cuarto Creciente', emoji: '🌓' };
  if (phase < 0.4375) return { name: 'Gibosa Creciente', emoji: '🌔' };
  if (phase < 0.5625) return { name: 'Luna Llena', emoji: '🌕' };
  if (phase < 0.6875) return { name: 'Gibosa Menguante', emoji: '🌖' };
  if (phase < 0.8125) return { name: 'Cuarto Menguante', emoji: '🌗' };
  return { name: 'Luna Menguante', emoji: '🌘' };
}

function toJDE(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  let Y = y, M = m;
  if (m <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

function sunLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = (M * Math.PI) / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  const omega = 125.04 - 1934.136 * T;
  return (((L0 + C) - 0.00569 - 0.00478 * Math.sin((omega * Math.PI) / 180)) % 360 + 360) % 360;
}

function moonLongitude(jde: number): { lon: number; phase: number } {
  const T = (jde - 2451545.0) / 36525;
  const D  = 297.85036 + 445267.111480 * T - 0.0019142 * T * T;
  const M  = 357.52772 + 35999.050340 * T - 0.0001603 * T * T;
  const Mp = 134.96298 + 477198.867398 * T + 0.0086972 * T * T;
  const F  = 93.27191  + 483202.017538 * T - 0.0036825 * T * T;
  const r = Math.PI / 180;
  const lon = 218.3165 + 481267.8813 * T
    + 6.289  * Math.sin(Mp * r)
    - 1.274  * Math.sin((2 * D - Mp) * r)
    + 0.658  * Math.sin(2 * D * r)
    - 0.214  * Math.sin(2 * Mp * r)
    - 0.186  * Math.sin(M * r)
    - 0.114  * Math.sin(2 * F * r);
  const sunLon = sunLongitude(jde);
  const phase = (((lon - sunLon) % 360) + 360) % 360 / 360;
  return { lon: ((lon % 360) + 360) % 360, phase };
}

function planetLongitude(jde: number, planet: string): number {
  const T = (jde - 2451545.0) / 36525;
  const L: Record<string, number> = {
    Mercury: ((252.25032 + 149472.67411 * T) % 360 + 360) % 360,
    Venus:   ((181.97973 +  58517.81538 * T) % 360 + 360) % 360,
    Mars:    ((355.45332 +  19140.29934 * T) % 360 + 360) % 360,
    Jupiter: (( 34.40438 +   3034.90374 * T) % 360 + 360) % 360,
    Saturn:  (( 49.94432 +   1222.11494 * T) % 360 + 360) % 360,
  };
  return L[planet] ?? 0;
}

function isRetrograde(jde: number, planet: string): boolean {
  if (planet === 'Sun' || planet === 'Moon') return false;
  let diff = planetLongitude(jde + 5, planet) - planetLongitude(jde - 5, planet);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// ─── Natal chart data ────────────────────────────────────────────────────────

interface NatalPoint { key: string; label: string; lon: number }

// Edward: Libra ASC — Sol 10° Cáncer, Luna 24° Sag, Venus 26° Tau, Sat 29° Acu, MC 7° Cáncer
const EDWARD_NATAL: NatalPoint[] = [
  { key: 'sol',     label: 'Sol natal',     lon: 100 },  // 10° Cáncer  (90+10)
  { key: 'luna',    label: 'Luna natal',    lon: 264 },  // 24° Sagitario (240+24)
  { key: 'venus',   label: 'Venus natal',   lon:  56 },  // 26° Tauro   (30+26)
  { key: 'saturno', label: 'Saturno natal', lon: 329 },  // 29° Acuario (300+29)
  { key: 'mc',      label: 'MC',            lon:  97 },  // 7° Cáncer   (90+7)
];

// Martina: Capricornio ASC — Sol 10° Sag, Luna 23° Tau, Venus 18° Sag, Sat 27° Aries, ASC 18° Cap
const MARTINA_NATAL: NatalPoint[] = [
  { key: 'sol',     label: 'Sol natal',     lon: 250 },  // 10° Sagitario (240+10)
  { key: 'luna',    label: 'Luna natal',    lon:  53 },  // 23° Tauro   (30+23)
  { key: 'venus',   label: 'Venus natal',   lon: 258 },  // 18° Sagitario (240+18)
  { key: 'saturno', label: 'Saturno natal', lon:  27 },  // 27° Aries
  { key: 'asc',     label: 'ASC',           lon: 288 },  // 18° Capricornio (270+18)
];

// ─── Aspect calculation ──────────────────────────────────────────────────────

interface AspectResult { name: string; short: string; orb: number }

function getAspect(transitLon: number, natalLon: number): AspectResult | null {
  const raw  = ((transitLon - natalLon) % 360 + 360) % 360;
  const sep  = raw <= 180 ? raw : 360 - raw;   // 0–180

  const defs = [
    { name: 'conjunción', short: 'conjunta', angle:   0, maxOrb: 7 },
    { name: 'oposición',  short: 'opone',    angle: 180, maxOrb: 7 },
    { name: 'trígono',    short: 'trina',    angle: 120, maxOrb: 5 },
    { name: 'cuadratura', short: 'cuadra',   angle:  90, maxOrb: 5 },
    { name: 'sextil',     short: 'sextila',  angle:  60, maxOrb: 3 },
  ];

  let best: AspectResult | null = null;
  for (const d of defs) {
    const orb = Math.abs(sep - d.angle);
    if (orb <= d.maxOrb && (!best || orb < best.orb)) {
      best = { name: d.name, short: d.short, orb };
    }
  }
  return best;
}

// ─── Interpretive texts ──────────────────────────────────────────────────────

const INTERP: Record<string, string> = {
  'luna-conjunción-sol':     'renovación emocional e identidad',
  'luna-conjunción-luna':    'amplificación emocional intensa',
  'luna-conjunción-venus':   'apertura afectiva y sensibilidad',
  'luna-conjunción-saturno': 'introspección y necesidad de estructura',
  'luna-conjunción-mc':      'visibilidad emocional y vida pública',
  'luna-conjunción-asc':     'sensibilidad elevada, presencia personal',
  'luna-oposición-sol':      'tensión entre emoción e identidad',
  'luna-oposición-luna':     'polaridad emocional, reflexión profunda',
  'luna-oposición-venus':    'contraste entre necesidad y deseo',
  'luna-oposición-saturno':  'tensión entre necesidad y límites',
  'luna-oposición-mc':       'balance entre vida privada y pública',
  'luna-oposición-asc':      'sensibilidad en relación con otros',
  'luna-trígono-sol':        'flujo entre emoción e identidad',
  'luna-trígono-luna':       'armonía emocional y receptividad',
  'luna-trígono-venus':      'apertura afectiva y sensibilidad',
  'luna-trígono-saturno':    'madurez emocional y consistencia',
  'luna-trígono-mc':         'expresión emocional fluida y pública',
  'luna-trígono-asc':        'armonía emocional con el entorno',
  'luna-cuadratura-sol':     'tensión entre sentir y ser',
  'luna-cuadratura-luna':    'conflicto emocional interior',
  'luna-cuadratura-venus':   'fricción entre sentimientos y relaciones',
  'luna-cuadratura-saturno': 'tensión entre necesidad y estructura',
  'luna-cuadratura-mc':      'tensión emocional en lo público',
  'luna-sextil-sol':         'oportunidad de expresión auténtica',
  'luna-sextil-venus':       'afinidad emocional con el entorno',
  'luna-sextil-saturno':     'oportunidad de equilibrio y orden',
  'luna-sextil-asc':         'receptividad y apertura al entorno',
  'sol-conjunción-sol':      'renovación de identidad y propósito',
  'sol-conjunción-venus':    'amor y voluntad unificados',
  'sol-conjunción-luna':     'voluntad que ilumina las emociones',
  'sol-conjunción-saturno':  'responsabilidad y definición personal',
  'sol-conjunción-mc':       'pico de visibilidad y reconocimiento',
  'sol-conjunción-asc':      'proyección personal amplificada',
  'sol-oposición-sol':       'punto álgido de consciencia personal',
  'sol-trígono-sol':         'flujo de identidad y vitalidad',
  'sol-trígono-venus':       'alineación entre amor e identidad',
  'sol-trígono-luna':        'coherencia entre voluntad y emociones',
  'sol-trígono-saturno':     'confianza y madurez personal',
  'sol-trígono-mc':          'alineación con el propósito profesional',
  'sol-cuadratura-sol':      'tensión de crecimiento e identidad',
  'sol-cuadratura-saturno':  'fricción con responsabilidades y límites',
  'sol-sextil-mc':           'oportunidad de reconocimiento profesional',
  'mercurio-conjunción-sol': 'claridad mental y comunicación',
  'mercurio-conjunción-luna':'inteligencia emocional activa',
  'mercurio-trígono-luna':   'fluidez emocional en la comunicación',
  'mercurio-trígono-sol':    'claridad de pensamiento y expresión',
  'mercurio-sextil-venus':   'conversación afectiva y creatividad',
  'venus-conjunción-venus':  'sensibilidad afectiva amplificada',
  'venus-conjunción-luna':   'dulzura emocional y apertura',
  'venus-trígono-luna':      'receptividad y placer emocional',
  'venus-trígono-venus':     'armonía en el amor y las relaciones',
  'venus-trígono-sol':       'calidez y expresión creativa',
  'venus-cuadratura-saturno':'tensión entre amor y compromiso',
  'venus-sextil-luna':       'afinidad afectiva y suavidad',
  'marte-conjunción-sol':    'energía y asertividad elevadas',
  'marte-trígono-sol':       'iniciativa y energía en flujo',
  'marte-oposición-sol':     'tensión entre acción y voluntad',
  'marte-cuadratura-saturno':'fricción entre impulso y límites',
  'marte-sextil-sol':        'oportunidad de acción y determinación',
  'saturno-conjunción-saturno': 'retorno de Saturno — definición vital',
};

const FALLBACK: Record<string, string> = {
  'conjunción': 'activación e intensidad',
  'oposición':  'tensión polarizante y consciencia',
  'trígono':    'flujo armónico y apertura',
  'cuadratura': 'fricción y desafío dinámico',
  'sextil':     'oportunidad y afinidad',
};

function interpret(transitKey: string, aspect: string, natalKey: string): string {
  return INTERP[`${transitKey}-${aspect}-${natalKey}`] ?? FALLBACK[aspect] ?? 'influencia energética activa';
}

// ─── Transit calculation ─────────────────────────────────────────────────────

interface TransitPlanet { symbol: string; name: string; key: string; lon: number; retrograde: boolean }
interface Transit {
  transitSymbol: string;
  transitName: string;
  aspectShort: string;
  aspect: string;
  natalLabel: string;
  orb: number;
  interpretation: string;
  retrograde: boolean;
}

function computeTransits(planets: TransitPlanet[], natal: NatalPoint[]): Transit[] {
  const hits: Transit[] = [];
  for (const p of planets) {
    for (const n of natal) {
      const asp = getAspect(p.lon, n.lon);
      if (asp) {
        hits.push({
          transitSymbol: p.symbol,
          transitName: p.name,
          aspectShort: asp.short,
          aspect: asp.name,
          natalLabel: n.label,
          orb: asp.orb,
          interpretation: interpret(p.key, asp.name, n.key),
          retrograde: p.retrograde,
        });
      }
    }
  }
  return hits.sort((a, b) => a.orb - b.orb).slice(0, 3);
}

// ─── Date / week helpers ─────────────────────────────────────────────────────

const DAYS_ES   = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const DAYS_FULL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface WeekDay {
  dayLabel: string;
  iso: string;
  moonSign: string;
  moonSignChanged: boolean;
  events: AstroEvent[];
  isToday: boolean;
}

function buildWeek(today: Date): WeekDay[] {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const noonUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12));
    const { lon } = moonLongitude(toJDE(noonUTC));
    const { sign } = longitudeToSign(lon);

    let moonSignChanged = false;
    if (i > 0) {
      const prev = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + i - 1, 12));
      const { lon: prevLon } = moonLongitude(toJDE(prev));
      moonSignChanged = longitudeToSign(prevLon).sign !== sign;
    }

    const iso = isoDate(date);
    const dayEvents = events2026.filter(ev => iso >= ev.date && iso <= (ev.dateEnd ?? ev.date));
    const d = DAYS_ES[date.getDay()];

    return {
      dayLabel: `${d.charAt(0).toUpperCase() + d.slice(1)} ${date.getDate()}`,
      iso,
      moonSign: sign,
      moonSignChanged,
      events: dayEvents,
      isToday: i === 0,
    };
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ReportData {
  dateLabel: string;
  moonSign: string; moonDegree: number; moonPhase: string; moonEmoji: string;
  sunSign: string; sunDegree: number;
  saturnSign: string; saturnRetrograde: boolean;
  edwardTransits: Transit[];
  martinaTransits: Transit[];
  week: WeekDay[];
}

export default function DailyReport() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    const now  = new Date();
    const jde  = toJDE(now);

    const sunLon  = sunLongitude(jde);
    const { lon: moonLon, phase } = moonLongitude(jde);
    const { name: moonPhase, emoji: moonEmoji } = getMoonPhaseInfo(phase);
    const { sign: moonSign, degree: moonDegree }   = longitudeToSign(moonLon);
    const { sign: sunSign,  degree: sunDegree }    = longitudeToSign(sunLon);
    const saturnLon = planetLongitude(jde, 'Saturn');
    const { sign: saturnSign } = longitudeToSign(saturnLon);
    const saturnRetrograde = isRetrograde(jde, 'Saturn');

    const planets: TransitPlanet[] = [
      { symbol: '☽', name: 'Luna',     key: 'luna',     lon: moonLon,                           retrograde: false },
      { symbol: '☉', name: 'Sol',      key: 'sol',      lon: sunLon,                            retrograde: false },
      { symbol: '☿', name: 'Mercurio', key: 'mercurio', lon: planetLongitude(jde, 'Mercury'),   retrograde: isRetrograde(jde, 'Mercury') },
      { symbol: '♀', name: 'Venus',    key: 'venus',    lon: planetLongitude(jde, 'Venus'),     retrograde: isRetrograde(jde, 'Venus') },
      { symbol: '♂', name: 'Marte',    key: 'marte',    lon: planetLongitude(jde, 'Mars'),      retrograde: isRetrograde(jde, 'Mars') },
    ];

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayFull = DAYS_FULL[now.getDay()];
    const dateLabel = `${dayFull} ${now.getDate()} de ${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;

    setData({
      dateLabel,
      moonSign, moonDegree, moonPhase, moonEmoji,
      sunSign, sunDegree,
      saturnSign, saturnRetrograde,
      edwardTransits: computeTransits(planets, EDWARD_NATAL),
      martinaTransits: computeTransits(planets, MARTINA_NATAL),
      week: buildWeek(today),
    });
  }, []);

  if (!data) {
    return (
      <div className="bg-space-800 border border-space-700 rounded-2xl p-8 animate-pulse">
        <div className="h-5 bg-space-700 rounded w-56 mb-5" />
        <div className="h-4 bg-space-700 rounded w-full mb-3" />
        <div className="h-4 bg-space-700 rounded w-3/4" />
      </div>
    );
  }

  const weekItems = data.week.filter(d => d.isToday || d.moonSignChanged || d.events.length > 0);

  return (
    <div className="bg-space-800 border border-space-700 rounded-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-space-700/60 bg-space-950/40">
        <div className="flex items-center gap-3">
          <span className="text-gold-400 font-mono">✦</span>
          <span className="font-mono text-xs text-silver-300 tracking-widest uppercase">Reporte de hoy</span>
        </div>
        <span className="font-mono text-xs text-silver-300/50 capitalize">{data.dateLabel}</span>
      </div>

      {/* ── Sky summary ── */}
      <div className="px-6 py-3 border-b border-space-700/30 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-mono">
        <span>
          <span className="mr-1">{data.moonEmoji}</span>
          <span className="text-gold-300">Luna en {data.moonDegree}° {data.moonSign}</span>
          <span className="text-silver-300/40 ml-2">· {data.moonPhase}</span>
        </span>
        <span className="text-space-700 hidden sm:inline">|</span>
        <span>
          <span className="text-silver-300/60 mr-1">☉</span>
          <span className="text-gold-300">Sol en {data.sunDegree}° {data.sunSign}</span>
        </span>
        <span className="text-space-700 hidden sm:inline">|</span>
        <span>
          <span className="text-silver-300/60 mr-1">♄</span>
          <span className="text-gold-300">Saturno en {data.saturnSign}</span>
          {data.saturnRetrograde && <span className="text-amber-400 ml-1 text-xs">℞</span>}
        </span>
      </div>

      {/* ── Transits: two columns ── */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-space-700/30">

        {/* Edward */}
        <div className="px-6 py-5">
          <div className="text-xs font-mono text-gold-400/60 uppercase tracking-widest mb-4">Edward</div>
          {data.edwardTransits.length === 0 ? (
            <p className="text-silver-300/30 text-xs font-mono italic">Sin tránsitos activos</p>
          ) : (
            <div className="space-y-3">
              {data.edwardTransits.map((t, i) => (
                <div key={i}>
                  <div className="text-sm font-mono leading-snug">
                    <span className="text-gold-300">{t.transitSymbol}</span>
                    {t.retrograde && <span className="text-amber-400 text-xs">℞</span>}
                    <span className="text-silver-300 mx-1">{t.aspectShort}</span>
                    <span className="text-gold-300/80">{t.natalLabel}</span>
                    <span className="text-silver-300/25 text-xs ml-2">{t.orb.toFixed(1)}°</span>
                  </div>
                  <div className="text-xs text-silver-300/50 font-mono mt-0.5">{t.interpretation}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Martina */}
        <div className="px-6 py-5">
          <div className="text-xs font-mono text-nebula-purple/60 uppercase tracking-widest mb-4">Martina</div>
          {data.martinaTransits.length === 0 ? (
            <p className="text-silver-300/30 text-xs font-mono italic">Sin tránsitos activos</p>
          ) : (
            <div className="space-y-3">
              {data.martinaTransits.map((t, i) => (
                <div key={i}>
                  <div className="text-sm font-mono leading-snug">
                    <span className="text-nebula-purple">{t.transitSymbol}</span>
                    {t.retrograde && <span className="text-amber-400 text-xs">℞</span>}
                    <span className="text-silver-300 mx-1">{t.aspectShort}</span>
                    <span className="text-nebula-purple/80">{t.natalLabel}</span>
                    <span className="text-silver-300/25 text-xs ml-2">{t.orb.toFixed(1)}°</span>
                  </div>
                  <div className="text-xs text-silver-300/50 font-mono mt-0.5">{t.interpretation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Weekly view ── */}
      {weekItems.length > 0 && (
        <div className="border-t border-space-700/30 px-6 py-5">
          <div className="text-xs font-mono text-silver-300/40 uppercase tracking-widest mb-4">Esta semana</div>
          <div className="space-y-2">
            {weekItems.map((day) => (
              <div key={day.iso} className={`flex items-start gap-4 text-xs font-mono ${day.isToday ? 'text-gold-300' : 'text-silver-300/60'}`}>
                <span className="w-12 shrink-0 pt-px">{day.dayLabel}</span>
                <div className="flex flex-col gap-0.5">
                  {day.isToday && !day.moonSignChanged && (
                    <span className="text-silver-300/40">
                      {data.moonEmoji} en {data.moonSign} · {data.moonPhase}
                    </span>
                  )}
                  {day.moonSignChanged && (
                    <span className={day.isToday ? 'text-gold-300/80' : 'text-silver-300/50'}>
                      ☽ Luna entra {day.moonSign}
                    </span>
                  )}
                  {day.events.map((ev, j) => (
                    <span key={j} className={ev.isKey ? 'text-gold-300' : day.isToday ? 'text-gold-300/70' : 'text-silver-300/60'}>
                      {ev.isKey && <span className="mr-1">★</span>}
                      {ev.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
