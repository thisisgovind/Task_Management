type ErrorBannerProps = {
  message: string
  onRetry?: () => void
}

const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => (
  <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200">
    <p className="text-sm font-medium">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600 transition hover:bg-white dark:border-rose-800 dark:text-rose-100 dark:hover:bg-transparent"
      >
        Retry
      </button>
    ) : null}
  </div>
)

export default ErrorBanner

