
"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { User, allUsers } from "@/lib/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const { t } = useLanguage();
  const { currentUser, login, logout } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("usersPage.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("usersPage.description")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allUsers.map((user: User) => (
          <Card key={user.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.department}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between gap-4">
               <div className="space-y-1">
                 <p className="text-sm font-medium">{t('usersPage.role')}</p>
                 <Badge variant="secondary">{user.role}</Badge>
               </div>
              {currentUser?.id === user.id ? (
                <Button variant="outline" onClick={logout} className="w-full">
                  {t("userNav.logout")}
                </Button>
              ) : (
                <Button onClick={() => login(user.id)} className="w-full">
                  {t("usersPage.loginAs")} {user.name.split(' ')[0]}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
