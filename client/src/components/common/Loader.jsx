export function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800 ${className}`} />;
}

export default Loader;