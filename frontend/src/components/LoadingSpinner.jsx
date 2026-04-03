export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} animate-spin`}>
        <svg viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="3" />
          <path className="opacity-80" fill="#10b981" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
