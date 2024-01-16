export default function Skeleton({ size = 4 }: { size: number }) {
  return (
    <>
      {[...Array(size)].map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-lg bg-background-paper"
        />
      ))}
    </>
  );
}
