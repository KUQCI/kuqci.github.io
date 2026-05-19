import { formatEventDate, formatEventTime, isPastEvent, type SerializedEvent } from './types';

interface EventDetailsProps {
  event: SerializedEvent;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const past = isPastEvent(event);

  return (
    <aside className="rounded-2xl border border-gold-duck/20 bg-gradient-to-br from-surface-2 to-ink p-6 shadow-gold-glow">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mono-label rounded-full border border-blue-qci/35 px-2.5 py-1 text-xs uppercase text-cyan-quantum">
          {event.type}
        </span>
        <span className="mono-label rounded-full border border-gold-duck/25 px-2.5 py-1 text-xs uppercase text-gold-duck">
          {event.status}
        </span>
        {event.difficulty && (
          <span className="mono-label rounded-full border border-slate-600 px-2.5 py-1 text-xs uppercase text-slate-300">
            {event.difficulty}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-3xl font-semibold text-white">{event.title}</h2>
      <dl className="mt-6 grid gap-3 text-sm text-slate-300">
        <div className="flex justify-between gap-4 border-t border-cyan-quantum/10 pt-3">
          <dt className="text-slate-500">Date</dt>
          <dd className="text-right">{formatEventDate(event.date)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-cyan-quantum/10 pt-3">
          <dt className="text-slate-500">Time</dt>
          <dd>{formatEventTime(event)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-cyan-quantum/10 pt-3">
          <dt className="text-slate-500">Location</dt>
          <dd className="text-right">{event.location}</dd>
        </div>
      </dl>

      <p className="mt-6 leading-8 text-slate-300">{event.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span key={tag} className="mono-label rounded-full bg-blue-qci/10 px-2.5 py-1 text-xs text-cyan-quantum">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {event.registrationUrl && !past ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex justify-center rounded-2xl border border-gold-duck bg-gold-duck px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#ffd46f]"
          >
            Register
          </a>
        ) : (
          <span className="inline-flex justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400">
            Registration unavailable
          </span>
        )}
        <button
          type="button"
          className="inline-flex justify-center rounded-2xl border border-cyan-quantum/30 px-5 py-3 text-sm font-semibold text-cyan-quantum transition hover:border-gold-duck/50 hover:text-gold-duck"
          aria-label={`Add ${event.title} to calendar`}
        >
          Add to calendar
        </button>
      </div>
    </aside>
  );
}
