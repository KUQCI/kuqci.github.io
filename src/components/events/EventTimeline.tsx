import { useEffect, useRef } from 'react';
import { formatEventDate, formatEventTime, isPastEvent, type SerializedEvent } from './types';

interface EventTimelineProps {
  events: SerializedEvent[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function EventTimeline({
  events,
  selectedSlug,
  onSelect,
  onNext,
  onPrevious
}: EventTimelineProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedCard = scrollerRef.current?.querySelector<HTMLElement>(`[data-event-card="${selectedSlug}"]`);
    selectedCard?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedSlug]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrevious();
    }
  };

  return (
    <section aria-label="Event timeline" onKeyDown={onKeyDown}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mono-label text-xs uppercase text-cyan-quantum/75">timeline</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Chronological signal</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-quantum/20 text-slate-100 transition hover:border-gold-duck/50 hover:text-gold-duck"
            aria-label="Select previous event"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-quantum/20 text-slate-100 transition hover:border-gold-duck/50 hover:text-gold-duck"
            aria-label="Select next event"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar relative -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-10"
        tabIndex={0}
      >
        <div className="absolute bottom-5 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-quantum/30 to-transparent" />
        {events.map((event) => {
          const selected = event.slug === selectedSlug;
          const past = isPastEvent(event);

          return (
            <button
              key={event.slug}
              data-event-card={event.slug}
              type="button"
              onClick={() => onSelect(event.slug)}
              aria-current={selected ? 'true' : undefined}
              className={[
                'relative min-h-[19rem] w-[18.5rem] shrink-0 snap-center rounded-2xl border p-5 text-left transition duration-200 md:w-[21rem]',
                selected
                  ? 'border-gold-duck/55 bg-surface-2 shadow-gold-glow'
                  : 'border-cyan-quantum/14 bg-surface/72 hover:border-cyan-quantum/35',
                past ? 'opacity-65' : 'opacity-100'
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="mono-label rounded-full border border-blue-qci/30 px-2.5 py-1 text-[0.65rem] uppercase text-cyan-quantum">
                  {event.type}
                </span>
                <span className="mono-label rounded-full border border-gold-duck/25 px-2.5 py-1 text-[0.65rem] uppercase text-gold-duck">
                  {event.status}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{event.title}</h3>
              <dl className="mt-4 grid gap-2 text-sm text-slate-300">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Date</dt>
                  <dd className="text-right">{formatEventDate(event.date)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Time</dt>
                  <dd>{formatEventTime(event)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Location</dt>
                  <dd className="text-right">{event.location}</dd>
                </div>
                {event.difficulty && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Level</dt>
                    <dd>{event.difficulty}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{event.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="mono-label rounded-full bg-blue-qci/10 px-2 py-1 text-[0.7rem] text-cyan-quantum">
                    {tag}
                  </span>
                ))}
              </div>
              <span
                className={[
                  'absolute -bottom-7 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border',
                  selected
                    ? 'border-gold-duck bg-gold-duck shadow-gold-glow'
                    : 'border-cyan-quantum/45 bg-surface-2'
                ].join(' ')}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
