'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Mode = 'single' | 'range';

interface RangeValue {
  from: Date | null;
  to: Date | null;
}

type Value = Date | RangeValue | null;

interface CalendarProps {
  value?: Value;
  onSelect?: (val: Value) => void;
  className?: string;
  mode?: Mode;
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
  showOutsideDays?: boolean;
}

// --- Date Utility Functions ---
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const isSameDay = (a?: Date | null, b?: Date | null) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
const isBefore = (a: Date, b: Date) => a.getTime() < b.getTime();
const isAfter = (a: Date, b: Date) => a.getTime() > b.getTime();
const startOfWeek = (d: Date, weekStartsOn: 0 | 1) => {
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
};
const endOfWeek = (d: Date, weekStartsOn: 0 | 1) =>
  addDays(startOfWeek(d, weekStartsOn), 6);
const clampRange = (from: Date, to: Date) =>
  isAfter(from, to) ? { from: to, to: from } : { from, to };

function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(d);
}

function formatDateShort(d: Date | null) {
  if (!d) return '';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

// --- The Core Calendar Component ---
export function Calendar({
  value = null,
  onSelect,
  className = '',
  mode = 'single',
  weekStartsOn = 1,
  showOutsideDays = true,
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Value>(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const today = useMemo(() => new Date(), []);

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (mode === 'single' && value instanceof Date) return startOfMonth(value);
    if (mode === 'range' && value && (value as RangeValue).from)
      return startOfMonth((value as RangeValue).from as Date);
    return startOfMonth(today);
  });

  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const handleSelect = (day: Date) => {
    if (mode === 'single') {
      const newValue = day;
      if (onSelect) onSelect(newValue);
      else setInternalValue(newValue);
      return;
    }

    // Range mode logic
    const range = (internalValue || { from: null, to: null }) as RangeValue;
    if (!range.from || (range.from && range.to)) {
      const newRange: RangeValue = { from: day, to: null };
      if (onSelect) onSelect(newRange);
      else setInternalValue(newRange);
    } else {
      const { from, to } = clampRange(range.from, day);
      const newRange: RangeValue = { from, to };
      if (onSelect) onSelect(newRange);
      else setInternalValue(newRange);
    }
  };

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), weekStartsOn);
    const end = endOfWeek(
      addDays(startOfMonth(currentMonth), 35),
      weekStartsOn,
    ); // Ensure 6 weeks
    const weeks: Date[][] = [];
    let cursor = start;
    while (cursor <= end) {
      const week: Date[] = Array.from({ length: 7 }, (_, i) =>
        addDays(cursor, i),
      );
      weeks.push(week);
      cursor = addDays(cursor, 7);
    }
    return weeks;
  }, [currentMonth, weekStartsOn]);

  const inRange = (d: Date) => {
    if (mode !== 'range') return false;
    const range = (internalValue || { from: null, to: null }) as RangeValue;
    if (!range.from || !range.to) return false;
    return !isBefore(d, range.from) && !isAfter(d, range.to);
  };

  const isSelected = (d: Date) => {
    if (mode === 'single') return isSameDay(d, internalValue as Date | null);
    const range = (internalValue || { from: null, to: null }) as RangeValue;
    return isSameDay(d, range.from) || isSameDay(d, range.to);
  };

  const onKeyDown = (e: React.KeyboardEvent, day: Date) => {
    const keyMap: Record<string, () => Date> = {
      ArrowLeft: () => addDays(day, -1),
      ArrowRight: () => addDays(day, 1),
      ArrowUp: () => addDays(day, -7),
      ArrowDown: () => addDays(day, 7),
      Home: () => startOfWeek(day, weekStartsOn),
      End: () => endOfWeek(day, weekStartsOn),
    };

    if (keyMap[e.key]) {
      e.preventDefault();
      setFocusedDate(keyMap[e.key]());
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      setCurrentMonth((m) => addMonths(m, -1));
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      setCurrentMonth((m) => addMonths(m, 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(day);
    }
  };

  useEffect(() => {
    if (
      focusedDate &&
      (isBefore(focusedDate, startOfMonth(currentMonth)) ||
        isAfter(focusedDate, addDays(startOfMonth(currentMonth), 35)))
    ) {
      setCurrentMonth(startOfMonth(focusedDate));
    }
  }, [focusedDate, currentMonth]);

  const weekdayLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfWeek(today, weekStartsOn), i);
      return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(
        day,
      );
    });
  }, [weekStartsOn, today]);

  return (
    <div
      className={`w-full max-w-sm p-3 bg-white rounded-lg shadow-md border ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">
          {formatMonthYear(currentMonth)}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            className="p-1.5 rounded-md hover:bg-gray-100"
            onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="p-1.5 rounded-md hover:bg-gray-100"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 mb-2">
        {weekdayLabels.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day) => {
          const isOutside = day.getMonth() !== currentMonth.getMonth();
          if (!showOutsideDays && isOutside)
            return <div key={day.toISOString()} />;

          const selected = isSelected(day);
          const inrange = inRange(day);
          const isToday = isSameDay(day, today);

          const baseCls =
            'h-9 w-9 flex items-center justify-center text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500';
          const classList = [baseCls];

          if (isOutside) classList.push('text-gray-400');
          if (selected)
            classList.push(
              'bg-blue-600 text-white font-bold hover:bg-blue-700',
            );
          else if (inrange) classList.push('bg-blue-100 text-blue-800');
          else classList.push('hover:bg-gray-100');
          if (isToday) classList.push('font-bold');

          return (
            <button
              key={day.toISOString()}
              className={classList.join(' ')}
              onClick={() => handleSelect(day)}
              onKeyDown={(e) => onKeyDown(e, day)}
              onFocus={() => setFocusedDate(day)}
              aria-pressed={selected}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Date Picker Wrapper Component ---
export function DatePicker({
  value,
  onSelect,
  className = '',
  mode = 'single',
}: CalendarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const display = useMemo(() => {
    if (!value) return '';
    if (value instanceof Date) return formatDateShort(value);
    const range = value as RangeValue;
    if (!range.from && !range.to) return '';
    if (range.from && !range.to) return `${formatDateShort(range.from)} → ...`;
    return `${formatDateShort(range.from)} → ${formatDateShort(range.to)}`;
  }, [value]);

  return (
    <div
      ref={ref}
      className={`relative inline-block w-full max-w-xs ${className}`}
    >
      <button
        type="button"
        className="w-full text-left border rounded-md px-3 py-2 bg-white flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="truncate">
          {display ||
            (mode === 'range' ? 'Select a date range' : 'Select a date')}
        </span>
        <ChevronRight
          className={`h-4 w-4 transform transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2">
          <Calendar
            value={value}
            onSelect={(v) => {
              if (onSelect) onSelect(v);
              if (mode === 'single' && v instanceof Date) setOpen(false);
              if (mode === 'range' && (v as RangeValue).to) setOpen(false);
            }}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
}

export default Calendar;
