"use client";

import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDocuments } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DOCUMENT_STATUSES } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

function getUrgencyBadgeVariant(urgency: "low" | "medium" | "high") {
  switch (urgency) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    default:
      return "outline";
  }
}

export default function DocumentsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {t("Documents")}
          </h1>
          <p className="text-muted-foreground">
            {t("documentsPage.description")}
          </p>
        </div>
        <Button>
          <PlusCircle />
          {t("documentsPage.addDocument")}
        </Button>
      </div>

      <Tabs defaultValue="All">
        <TabsList>
            <TabsTrigger value="All">{t("documentsPage.all")}</TabsTrigger>
            {DOCUMENT_STATUSES.map(status => (
                <TabsTrigger key={status} value={status}>{t(status)}</TabsTrigger>
            ))}
        </TabsList>
        <TabsContent value="All">
            <DocumentsTable documents={mockDocuments} />
        </TabsContent>
        {DOCUMENT_STATUSES.map(status => (
            <TabsContent key={status} value={status}>
                <DocumentsTable documents={mockDocuments.filter(d => d.status === status)} />
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function DocumentsTable({ documents }: { documents: typeof mockDocuments }) {
  const { t } = useLanguage();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("table.title")}</TableHead>
          <TableHead>{t("table.status")}</TableHead>
          <TableHead>{t("table.urgency")}</TableHead>
          <TableHead>{t("table.assignee")}</TableHead>
          <TableHead>{t("table.deadline")}</TableHead>
          <TableHead>
            <span className="sr-only">{t("table.actions")}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{t(doc.status)}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getUrgencyBadgeVariant(doc.urgency)}>
                {t(doc.urgency)}
              </Badge>
            </TableCell>
            <TableCell className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={doc.assignee.avatarUrl} alt={doc.assignee.name} />
                    <AvatarFallback>{doc.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {doc.assignee.name}
            </TableCell>
            <TableCell>{doc.deadline ? new Date(doc.deadline).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t("table.toggleMenu")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
                  <DropdownMenuItem>{t("table.viewDetails")}</DropdownMenuItem>
                  <DropdownMenuItem>{t("table.edit")}</DropdownMenuItem>
                  <DropdownMenuItem>{t("table.viewAuditLog")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
