export default function SearchPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Search
        </h1>
        <p className="text-muted-foreground">
          Find documents across the entire organization.
        </p>
      </div>
       {/* Placeholder content for search */}
      <div className="text-center py-20 text-muted-foreground">
        Search results will appear here.
      </div>
    </div>
  );
}
