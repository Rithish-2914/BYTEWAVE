export default function ArchivePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Archive
        </h1>
        <p className="text-muted-foreground">
          Browse and restore archived documents.
        </p>
      </div>
      {/* Placeholder content for archive */}
      <div className="text-center py-20 text-muted-foreground">
        Archived documents will appear here.
      </div>
    </div>
  );
}
