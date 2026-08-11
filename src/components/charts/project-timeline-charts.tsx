"use client";

import * as React from "react";
import { CHART_COLORS, SEMANTIC } from "@/lib/chart-colors";
import { formatCompact } from "@/lib/utils";
import { ChartEmpty, ScreenReaderTable } from "./chart-frame";

export type ProjectTime = number | string;

export type ProjectTask = {
  id: string;
  name: string;
  start: ProjectTime;
  end: ProjectTime;
  lane?: number;
  group?: string;
  progress?: number;
  dependencies?: string[];
  critical?: boolean;
  milestone?: boolean;
  status?: "planned" | "active" | "complete" | "blocked";
};

export type TimelineEvent = {
  id: string;
  date: ProjectTime;
  label: string;
  description?: string;
  category?: string;
  status?: ProjectTask["status"];
};

export type ProjectChartProps = {
  data: ProjectTask[];
  ariaLabel?: string;
  onTaskSelect?: (task: ProjectTask) => void;
};

const WIDTH = 760;
const HEIGHT = 340;

/** Match other chart label / axis type (globals recharts text is 11.5px). */
const LABEL_SIZE = 12;
const AXIS_SIZE = 11.5;
/** Same stack as body / Recharts so timeline text doesn't fall back to system UI. */
const CHART_FONT =
  'var(--font-manrope), "Manrope", ui-sans-serif, system-ui, sans-serif';

function timeValue(value: ProjectTime): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const result = Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    return Number.isFinite(result) ? result : null;
  }
  const result = Date.parse(value);
  return Number.isFinite(result) ? result : null;
}

function validTasks(data: ProjectTask[]) {
  return data.flatMap((task) => {
    const start = timeValue(task.start);
    const end = timeValue(task.end);
    if (start == null || end == null || end < start) return [];
    return [{ task, start, end }];
  });
}

function taskStatusColor(task: ProjectTask, index: number) {
  if (task.status === "complete") return SEMANTIC.positive;
  if (task.status === "blocked") return SEMANTIC.negative;
  if (task.status === "active") return SEMANTIC.warning;
  if (task.status === "planned") return CHART_COLORS[(index + 2) % CHART_COLORS.length];
  return CHART_COLORS[index % CHART_COLORS.length];
}

function ProjectBars({
  data,
  showDependencies,
  showProgress,
  compact,
  ariaLabel,
  onTaskSelect,
}: ProjectChartProps & {
  showDependencies: boolean;
  showProgress: boolean;
  compact?: boolean;
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const rows = validTasks(data);
  if (!rows.length) return <ChartEmpty label="No valid project tasks" />;

  const min = Math.min(...rows.map((row) => row.start));
  const max = Math.max(...rows.map((row) => row.end));
  // Pad the domain slightly so end milestones / bars aren't clipped by the frame.
  const pad = Math.max((max - min) * 0.04, 0.35);
  const domainMin = min;
  const domainMax = max + pad;
  const span = Math.max(domainMax - domainMin, 1);

  const left = compact ? 118 : 148;
  const right = 28;
  const top = 28;
  const bottom = 36;
  const rowHeight = Math.min(compact ? 40 : 48, (HEIGHT - top - bottom) / Math.max(rows.length, 1));
  const plotWidth = WIDTH - left - right;
  const x = (value: number) => left + ((value - domainMin) / span) * plotWidth;
  const y = (index: number) => top + index * rowHeight + rowHeight / 2;
  const rowById = new Map(rows.map((row, index) => [row.task.id, { ...row, index }]));
  const label = ariaLabel ?? `Gantt chart with ${rows.length} tasks`;
  const barHeight = compact ? 18 : 22;
  const barRadius = 6;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, index) =>
    domainMin + (span * index) / (tickCount - 1),
  );

  return (
    <div className="h-full w-full overflow-x-auto" tabIndex={0} aria-label="Scrollable project schedule">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full min-w-[40rem] w-full"
        role="group"
        aria-label={label}
        data-chart-svg
        style={{ fontFamily: CHART_FONT }}
      >
        <title>{label}</title>
        <desc>Task bars encode start, end, progress, status, and optional dependencies.</desc>
        <defs>
          <marker
            id={`gantt-arrow-${uid}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 Z" fill="var(--chart-axis)" />
          </marker>
          {rows.map((row, index) => (
            <clipPath key={`clip-${row.task.id}`} id={`gantt-clip-${uid}-${index}`}>
              <rect
                x={x(row.start)}
                y={y(index) - barHeight / 2}
                width={Math.max(4, x(row.end) - x(row.start))}
                height={barHeight}
                rx={barRadius}
              />
            </clipPath>
          ))}
        </defs>

        {/* Grid + axis */}
        {ticks.map((value, index) => (
          <g key={index}>
            <line
              x1={x(value)}
              x2={x(value)}
              y1={top - 6}
              y2={HEIGHT - bottom + 4}
              stroke="var(--chart-grid)"
            />
            <text
              x={x(value)}
              y={HEIGHT - 12}
              textAnchor="middle"
              fill="var(--chart-axis)"
              fontSize={AXIS_SIZE}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatCompact(value)}
            </text>
          </g>
        ))}

        {/* Dependencies under bars so bars stay primary */}
        {showDependencies
          ? rows.flatMap((row) =>
              (row.task.dependencies ?? []).flatMap((dependencyId) => {
                const source = rowById.get(dependencyId);
                const target = rowById.get(row.task.id);
                if (!source || !target) return [];
                const startX = x(source.end);
                const startY = y(source.index);
                const targetX = x(target.start);
                const targetY = y(target.index);
                const elbowX = Math.max(startX + 14, Math.min(targetX - 10, startX + 28));
                return [
                  <path
                    key={`${dependencyId}-${row.task.id}`}
                    d={`M ${startX} ${startY} H ${elbowX} V ${targetY} H ${Math.max(targetX - 2, elbowX)}`}
                    fill="none"
                    stroke="var(--chart-axis)"
                    strokeWidth={1.25}
                    strokeOpacity={0.55}
                    markerEnd={`url(#gantt-arrow-${uid})`}
                  />,
                ];
              }),
            )
          : null}

        {rows.map((row, index) => {
          const centerY = y(index);
          const startX = x(row.start);
          const endX = x(row.end);
          const width = Math.max(4, endX - startX);
          const color = taskStatusColor(row.task, index);
          const progress = Math.max(0, Math.min(1, row.task.progress ?? 0));
          const isMilestone = Boolean(row.task.milestone || row.start === row.end);
          const shortName =
            row.task.name.length > 18
              ? `${row.task.name.slice(0, 17)}…`
              : row.task.name;

          return (
            <g
              key={row.task.id}
              tabIndex={0}
              role={onTaskSelect ? "button" : "group"}
              aria-label={`${row.task.name}, start ${String(row.task.start)}, end ${String(row.task.end)}, ${Math.round(progress * 100)} percent complete`}
              onClick={() => onTaskSelect?.(row.task)}
              onKeyDown={(event) => {
                if (onTaskSelect && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onTaskSelect(row.task);
                }
              }}
              className="cursor-default outline-none"
            >
              <text
                x={left - 12}
                y={centerY}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--secondary-foreground)"
                fontSize={LABEL_SIZE}
                fontWeight={500}
                letterSpacing="-0.01em"
              >
                {shortName}
                <title>{row.task.name}</title>
              </text>

              {isMilestone ? (
                <rect
                  x={startX - 7}
                  y={centerY - 7}
                  width={14}
                  height={14}
                  transform={`rotate(45 ${startX} ${centerY})`}
                  fill={color}
                  stroke="var(--card)"
                  strokeWidth={1.5}
                />
              ) : (
                <g clipPath={`url(#gantt-clip-${uid}-${index})`}>
                  {/* Track: solid soft fill of the status color — not 0.28 opacity
                      (that washed bars to near-invisible beige on light cards). */}
                  <rect
                    x={startX}
                    y={centerY - barHeight / 2}
                    width={width}
                    height={barHeight}
                    rx={barRadius}
                    fill={color}
                    fillOpacity={showProgress ? 0.22 : 0.92}
                    stroke={color}
                    strokeWidth={row.task.critical ? 2 : 1.25}
                    strokeOpacity={0.95}
                  />
                  {showProgress && progress > 0 ? (
                    <rect
                      x={startX}
                      y={centerY - barHeight / 2}
                      width={Math.max(progress >= 1 ? width : 0, width * progress)}
                      height={barHeight}
                      rx={barRadius}
                      fill={color}
                      fillOpacity={1}
                    />
                  ) : null}
                </g>
              )}
              <title>
                {`${row.task.name}: ${String(row.task.start)} → ${String(row.task.end)}${
                  showProgress ? ` · ${Math.round(progress * 100)}%` : ""
                }`}
              </title>
            </g>
          );
        })}
      </svg>
      <ScreenReaderTable>
        <caption>{label} data</caption>
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Start</th>
            <th scope="col">End</th>
            <th scope="col">Progress</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ task }) => (
            <tr key={task.id}>
              <th scope="row">{task.name}</th>
              <td>{String(task.start)}</td>
              <td>{String(task.end)}</td>
              <td>{Math.round(Math.max(0, Math.min(1, task.progress ?? 0)) * 100)}%</td>
              <td>{task.status ?? "Unspecified"}</td>
            </tr>
          ))}
        </tbody>
      </ScreenReaderTable>
    </div>
  );
}

export function GanttChart(props: ProjectChartProps) {
  return <ProjectBars {...props} showDependencies={false} showProgress />;
}

export function AdvancedGanttChart(props: ProjectChartProps) {
  return <ProjectBars {...props} showDependencies showProgress />;
}

export function GanttRangeChart(props: ProjectChartProps) {
  return <ProjectBars {...props} showDependencies={false} showProgress={false} compact />;
}

export type TimelineChartProps = {
  events: TimelineEvent[];
  ariaLabel?: string;
  onEventSelect?: (event: TimelineEvent) => void;
};

function validEvents(events: TimelineEvent[]) {
  return events
    .flatMap((event) => {
      const date = timeValue(event.date);
      return date == null ? [] : [{ event, date }];
    })
    .sort((a, b) => a.date - b.date);
}

export function TimelineChart({
  events,
  ariaLabel = "Project timeline",
  onEventSelect,
}: TimelineChartProps) {
  const points = validEvents(events);
  if (!points.length) return <ChartEmpty label="No valid timeline events" />;
  const min = points[0]!.date;
  const max = points[points.length - 1]!.date;
  const span = Math.max(max - min, 1);
  const x = (value: number) => 50 + ((value - min) / span) * (WIDTH - 100);
  const baseline = HEIGHT / 2;
  // Tight label stack: name + date with consistent gap; stem stops short of type.
  const nameOffset = 44;
  const dateGap = 15;
  const stemGap = 10;
  return (
    <div className="h-full w-full overflow-x-auto" tabIndex={0} aria-label="Scrollable timeline">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full min-w-[40rem] w-full"
        role="group"
        aria-label={ariaLabel}
        style={{ fontFamily: CHART_FONT }}
      >
        <title>{ariaLabel}</title>
        <line
          x1={50}
          x2={WIDTH - 50}
          y1={baseline}
          y2={baseline}
          stroke="var(--chart-axis)"
          strokeWidth={2}
        />
        {points.map(({ event, date }, index) => {
          const above = index % 2 === 0;
          const pointX = x(date);
          const nameY = baseline + (above ? -nameOffset : nameOffset);
          const dateY = nameY + (above ? -dateGap : dateGap);
          const stemEnd = nameY + (above ? stemGap : -stemGap);
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const shortLabel =
            event.label.length > 18
              ? `${event.label.slice(0, 17)}…`
              : event.label;
          return (
            <g
              key={event.id}
              tabIndex={0}
              role={onEventSelect ? "button" : "group"}
              aria-label={`${event.label}, ${String(event.date)}${event.description ? `, ${event.description}` : ""}`}
              onClick={() => onEventSelect?.(event)}
              onKeyDown={(keyboardEvent) => {
                if (
                  onEventSelect &&
                  (keyboardEvent.key === "Enter" || keyboardEvent.key === " ")
                ) {
                  keyboardEvent.preventDefault();
                  onEventSelect(event);
                }
              }}
              className="ce-svg-mark"
            >
              <line
                x1={pointX}
                x2={pointX}
                y1={baseline}
                y2={stemEnd}
                stroke={color}
                strokeWidth={1.5}
              />
              <circle
                cx={pointX}
                cy={baseline}
                r={6.5}
                fill="var(--card)"
                stroke={color}
                strokeWidth={2.5}
              />
              <text
                x={pointX}
                y={nameY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={LABEL_SIZE}
                fontWeight={600}
                letterSpacing="-0.01em"
              >
                {shortLabel}
                <title>{event.label}</title>
              </text>
              <text
                x={pointX}
                y={dateY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--chart-axis)"
                fontSize={AXIS_SIZE}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(event.date)}
              </text>
            </g>
          );
        })}
      </svg>
      <ScreenReaderTable>
        <caption>{ariaLabel} data</caption>
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {points.map(({ event }) => (
            <tr key={event.id}>
              <th scope="row">{event.label}</th>
              <td>{String(event.date)}</td>
              <td>{event.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </ScreenReaderTable>
    </div>
  );
}

export function MilestoneChart(props: TimelineChartProps) {
  const points = validEvents(props.events);
  if (!points.length) return <ChartEmpty label="No milestones" />;
  const min = points[0]!.date;
  const max = points[points.length - 1]!.date;
  const span = Math.max(max - min, 1);
  const x = (value: number) => 58 + ((value - min) / span) * (WIDTH - 116);
  const baseline = HEIGHT - 76;
  return (
    <div
      className="h-full w-full overflow-x-auto"
      tabIndex={0}
      aria-label="Scrollable milestone timeline"
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full min-w-[40rem] w-full"
        role="group"
        aria-label={props.ariaLabel ?? "Milestone chart"}
        style={{ fontFamily: CHART_FONT }}
      >
        <title>{props.ariaLabel ?? "Milestone chart"}</title>
        <line
          x1={48}
          x2={WIDTH - 48}
          y1={baseline}
          y2={baseline}
          stroke="var(--chart-axis)"
          strokeWidth={2}
        />
        {points.map(({ event, date }, index) => {
          const pointX = x(date);
          const color = taskStatusColor(
            {
              id: event.id,
              name: event.label,
              start: event.date,
              end: event.date,
              status: event.status,
            },
            index,
          );
          const nameY = 78 + (index % 3) * 44;
          const dateY = nameY + 16;
          return (
            <g
              key={event.id}
              tabIndex={0}
              aria-label={`${event.label}, ${String(event.date)}`}
              className="ce-svg-mark"
            >
              <line
                x1={pointX}
                x2={pointX}
                y1={dateY + 10}
                y2={baseline - 10}
                stroke={color}
                strokeDasharray="3 3"
              />
              <rect
                x={pointX - 8}
                y={baseline - 8}
                width={16}
                height={16}
                transform={`rotate(45 ${pointX} ${baseline})`}
                fill={color}
              />
              <text
                x={pointX}
                y={nameY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={LABEL_SIZE}
                fontWeight={600}
                letterSpacing="-0.01em"
              >
                {event.label.length > 16
                  ? `${event.label.slice(0, 15)}…`
                  : event.label}
                <title>{event.label}</title>
              </text>
              <text
                x={pointX}
                y={dateY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--chart-axis)"
                fontSize={AXIS_SIZE}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(event.date)}
              </text>
            </g>
          );
        })}
      </svg>
      <ScreenReaderTable>
        <caption>{props.ariaLabel ?? "Milestone chart"} data</caption>
        <thead>
          <tr>
            <th scope="col">Milestone</th>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {points.map(({ event }) => (
            <tr key={event.id}>
              <th scope="row">{event.label}</th>
              <td>{String(event.date)}</td>
              <td>{event.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </ScreenReaderTable>
    </div>
  );
}

export function ProjectRoadmap(props: ProjectChartProps) {
  const grouped = [...props.data]
    .sort((a, b) =>
      String(a.group ?? "Roadmap").localeCompare(String(b.group ?? "Roadmap")),
    )
    .map((task, index) => ({ ...task, lane: index }));
  return (
    <ProjectBars
      {...props}
      data={grouped}
      showDependencies={false}
      showProgress
      ariaLabel={
        props.ariaLabel ?? "Project roadmap grouped into delivery lanes"
      }
    />
  );
}
