export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
       {/* Placeholder content for settings */}
      <div className="text-center py-20 text-muted-foreground">
        Settings options will appear here.
      </div>
    </div>
  );
}
