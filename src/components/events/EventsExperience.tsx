import { useEffect, useMemo, useState } from 'react';
import EventCalendar from './EventCalendar';
import EventDetails from './EventDetails';
import EventTimeline from './EventTimeline';
import { eventMonthKey, monthKey, toLocalDate, type EventType, type SerializedEvent } from './types';

interface EventsExperienceProps {
  events: SerializedEvent[];
}

function monthStart(event: SerializedEvent) {
  const date = toLocalDate(event.date);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sortEvents(events: SerializedEvent[]) {
  return [...events].sort((a, b) => toLocalDate(a.date).getTime() - toLocalDate(b.date).getTime());
}

export default function EventsExperience({ events }: EventsExperienceProps) {
  const sortedEvents = useMemo(() => sortEvents(events), [events]);
  const eventTypes = useMemo(() => Array.from(new Set(sortedEvents.map((event) => event.type))), [sortedEvents]);
  const firstUpcoming = sortedEvents.find((event) => event.status !== 'Past') ?? sortedEvents[0];

  const [activeType, setActiveType] = useState<EventType | 'All'>('All');
  const [selectedSlug, setSelectedSlug] = useState(firstUpcoming.slug);
  const filteredEvents = useMemo(
    () => (activeType === 'All' ? sortedEvents : sortedEvents.filter((event) => event.type === activeType)),
    [activeType, sortedEvents]
  );
  const selectedEvent = filteredEvents.find((event) => event.slug === selectedSlug) ?? filteredEvents[0] ?? firstUpcoming;
  const [visibleMonth, setVisibleMonth] = useState(monthStart(selectedEvent));

  useEffect(() => {
    if (!filteredEvents.some((event) => event.slug === selectedSlug) && filteredEvents[0]) {
      setSelectedSlug(filteredEvents[0].slug);
    }
  }, [filteredEvents, selectedSlug]);

  useEffect(() => {
    setVisibleMonth(monthStart(selectedEvent));
  }, [selectedEvent.slug]);

  const selectEvent = (slug: string) => {
    setSelectedSlug(slug);
  };

  const selectAdjacent = (direction: 1 | -1) => {
    const currentIndex = filteredEvents.findIndex((event) => event.slug === selectedEvent.slug);
    const nextIndex = (currentIndex + direction + filteredEvents.length) % filteredEvents.length;
    setSelectedSlug(filteredEvents[nextIndex].slug);
  };

  const changeMonth = (nextMonth: Date) => {
    const normalized = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    setVisibleMonth(normalized);
    const selectedStillVisible = eventMonthKey(selectedEvent) === monthKey(normalized);
    const firstInMonth = filteredEvents.find((event) => eventMonthKey(event) === monthKey(normalized));

    if (!selectedStillVisible && firstInMonth) {
      setSelectedSlug(firstInMonth.slug);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-2" aria-label="Event filters">
        {(['All', ...eventTypes] as Array<EventType | 'All'>).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            className={[
              'mono-label rounded-full border px-3 py-2 text-xs uppercase transition',
              activeType === type
                ? 'border-gold-duck bg-gold-duck/12 text-gold-duck'
                : 'border-cyan-quantum/18 text-slate-400 hover:border-cyan-quantum/45 hover:text-cyan-quantum'
            ].join(' ')}
            aria-pressed={activeType === type}
          >
            {type}
          </button>
        ))}
      </div>

      <EventTimeline
        events={filteredEvents}
        selectedSlug={selectedEvent.slug}
        onSelect={selectEvent}
        onNext={() => selectAdjacent(1)}
        onPrevious={() => selectAdjacent(-1)}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <EventCalendar
          events={filteredEvents}
          selectedEvent={selectedEvent}
          visibleMonth={visibleMonth}
          onMonthChange={changeMonth}
          onSelect={selectEvent}
        />
        <EventDetails event={selectedEvent} />
      </div>
    </div>
  );
}
