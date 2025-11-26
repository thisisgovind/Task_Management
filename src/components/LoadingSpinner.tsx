const LoadingSpinner = ({ label = 'Loading' }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <span className="h-3 w-3 animate-pulse rounded-full bg-brand"></span>
    <span className="h-3 w-3 animate-pulse rounded-full bg-brand [animation-delay:150ms]"></span>
    <span className="h-3 w-3 animate-pulse rounded-full bg-brand [animation-delay:300ms]"></span>
    <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
      {label}
    </p>
  </div>
)

export default LoadingSpinner

