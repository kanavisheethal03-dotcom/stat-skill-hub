import { cn } from '@/utils/cn';

interface CompetencyHeatmapProps {
  data: { name: string; category: string; score: number }[];
  className?: string;
}

export function CompetencyHeatmap({ data, className }: CompetencyHeatmapProps) {
  const getHeatColor = (score: number) => {
    if (score >= 80) return 'bg-success-500 text-white';
    if (score >= 60) return 'bg-secondary-400 text-white';
    if (score >= 40) return 'bg-warning-400 text-white';
    return 'bg-error-500 text-white';
  };

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {data.map((item) => (
        <div
          key={item.name}
          className={cn(
            'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 cursor-default',
            getHeatColor(item.score)
          )}
          title={`${item.name}: ${item.score}%`}
        >
          <div className="text-xs opacity-90 mb-0.5">{item.category}</div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-lg font-bold tabular-nums mt-1">{item.score}%</div>
        </div>
      ))}
    </div>
  );
}

interface RadarChartProps {
  data: { label: string; value: number; previousValue?: number }[];
  size?: number;
  className?: string;
}

export function RadarChart({ data, size = 320, className }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 60;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const currentPoints = data.map((d, i) => getPoint(d.value, i));
  const previousPoints = data.map((d, i) =>
    d.previousValue !== undefined ? getPoint(d.previousValue, i) : null
  );

  const currentPath = currentPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const previousPath = previousPoints
    .filter((p): p is { x: number; y: number } => p !== null)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg width={size} height={size} className={className}>
      {/* Grid circles */}
      {gridLevels.map((level) => {
        const r = level * maxRadius;
        return (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={1}
          />
        );
      })}
      {/* Axis lines */}
      {data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + maxRadius * Math.cos(angle);
        const y = center + maxRadius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#e4e4e7"
            strokeWidth={1}
          />
        );
      })}
      {/* Previous scores (dashed) */}
      {previousPath && (
        <polygon
          points={previousPath}
          fill="rgba(100, 116, 139, 0.1)"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="5,3"
        />
      )}
      {/* Current scores */}
      <polygon
        points={currentPath}
        fill="rgba(37, 99, 235, 0.15)"
        stroke="#2563eb"
        strokeWidth={2}
      />
      {/* Data points */}
      {currentPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#2563eb" />
      ))}
      {/* Labels */}
      {data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = maxRadius + 30;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-neutral-600 font-medium"
          >
            {d.label.length > 18 ? d.label.substring(0, 16) + '...' : d.label}
          </text>
        );
      })}
    </svg>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string; previousValue?: number }[];
  className?: string;
  height?: number;
  showAxis?: boolean;
}

export function BarChart({ data, className, height = 200, showAxis = true }: BarChartProps) {
  const maxValue = 100;
  const barWidth = 100 / data.length;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative" style={{ height }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((level) => (
          <div
            key={level}
            className="absolute left-0 right-0 border-t border-neutral-100"
            style={{ bottom: `${level}%` }}
          >
            {showAxis && (
              <span className="absolute -left-7 -translate-y-1/2 text-[10px] text-neutral-400 tabular-nums">
                {level}
              </span>
            )}
          </div>
        ))}
        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around gap-2 px-2">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {item.previousValue !== undefined && (
                <div
                  className="w-full max-w-[40px] bg-neutral-300 rounded-t-sm transition-all duration-500 relative"
                  style={{ height: `${(item.previousValue / maxValue) * 100}%` }}
                  title={`Previous: ${item.previousValue}%`}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-neutral-400 tabular-nums">
                    {item.previousValue}
                  </span>
                </div>
              )}
              <div
                className={cn(
                  'w-full max-w-[40px] rounded-t-md transition-all duration-500 relative',
                  item.color || getScoreColor(item.value)
                )}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
                title={`${item.label}: ${item.value}%`}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-neutral-700 tabular-nums">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Labels */}
      <div className="flex justify-around gap-2 px-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-neutral-500 font-medium leading-tight block">
              {item.label.length > 12 ? item.label.substring(0, 10) + '..' : item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  className?: string;
  height?: number;
  color?: string;
}

export function LineChart({ data, className, height = 180, color = '#2563eb' }: LineChartProps) {
  const width = 100;
  const padding = 5;
  const maxValue = 100;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = 100 - (d.value / maxValue) * (100 - 2 * padding) - padding;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} 100`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((level) => (
            <line
              key={level}
              x1={0}
              y1={100 - level}
              x2={width}
              y2={100 - level}
              stroke="#f4f4f5"
              strokeWidth={0.3}
            />
          ))}
          <path d={areaD} fill="url(#lineGradient)" />
          <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={1.5} fill={color} />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-neutral-500 font-medium">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  className?: string;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ segments, size = 180, className, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = size / 2 - 10;
  const innerRadius = radius * 0.65;
  const center = size / 2;
  let currentAngle = -Math.PI / 2;

  const arcs = segments.map((segment) => {
    const angle = (segment.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    return { path, ...segment };
  });

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width={size} height={size}>
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.path}
            fill={arc.color}
            stroke="white"
            strokeWidth={2}
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <title>{`${arc.label}: ${arc.value}`}</title>
          </path>
        ))}
        {centerValue && (
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-neutral-900 font-bold"
            style={{ fontSize: size * 0.12 }}
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-neutral-500 font-medium"
            style={{ fontSize: size * 0.06 }}
          >
            {centerLabel}
          </text>
        )}
      </svg>
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-neutral-600 font-medium">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-success-500';
  if (score >= 60) return 'bg-secondary-500';
  if (score >= 40) return 'bg-warning-500';
  return 'bg-error-500';
}
