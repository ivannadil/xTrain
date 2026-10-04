import clsx from "clsx";

/** xTrain wordmark: wide Archivo with an orange playhead as the dot of the i. */
export function Wordmark({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <span className={clsx("display text-[22px] leading-none text-ink-10 select-none", className)} aria-hidden>
        x<span className="sr-only">Train</span>
        <span className="inline-block align-baseline ml-[1px] h-[7px] w-[7px] rotate-45 bg-orange translate-y-[-9px]" />
      </span>
    );
  }
  return (
    <span className={clsx("display text-[22px] leading-none text-ink-10 select-none inline-flex items-baseline", className)}>
      xTra
      <span className="relative inline-block">
        <span className="opacity-0">i</span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="absolute bottom-0 w-[3px] h-[58%] bg-ink-10 rounded-[1px]" />
          <span className="absolute top-[4%] h-[6px] w-[6px] rotate-45 bg-orange" />
        </span>
      </span>
      n
    </span>
  );
}
