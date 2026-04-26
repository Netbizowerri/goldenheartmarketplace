interface PageStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageState({ title, message, actionLabel, onAction }: PageStateProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-xl shadow-black/5">
        <div className="mx-auto mb-5 h-12 w-12 rounded-2xl bg-gold/10" />
        <h1 className="text-2xl font-black text-soft-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-medium-grey">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-soft-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-near-black"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
