export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Recent updates and mentions.
        </p>
      </div>
       {/* Placeholder content for notifications */}
      <div className="text-center py-20 text-muted-foreground">
        Your notifications will appear here.
      </div>
    </div>
  );
}
