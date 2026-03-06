import { LoadingSkeleton } from "@/components/gift/LoadingSkeleton";

export default function GiftsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mt-8">
        <LoadingSkeleton />
      </div>
    </div>
  );
}
