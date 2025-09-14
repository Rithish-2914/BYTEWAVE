
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Document } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDocuments } from "@/hooks/use-documents";

const formatDate = (dateString: string | undefined, locale: string) => {
    if (!dateString) return 'N/A';
    if (dateString.length === 10 && !dateString.includes('T')) {
         return new Date(`${dateString}T00:00:00Z`).toLocaleDateString(locale, { timeZone: 'UTC' });
    }
    return new Date(dateString).toLocaleDateString(locale);
};

const formatDateTime = (dateString: string | undefined, locale: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(locale);
};


export default function SearchPage() {
  const { t, language } = useLanguage();
  const { documents } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const results = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lowercasedQuery) ||
        doc.summary.toLowerCase().includes(lowercasedQuery) ||
        doc.department.toLowerCase().includes(lowercasedQuery) ||
        doc.assignee.name.toLowerCase().includes(lowercasedQuery)
    );
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleViewDetails = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleCloseDialog = () => {
    setSelectedDocument(null);
  };

  const getUrgencyBadgeVariant = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Search")}
        </h1>
        <p className="text-muted-foreground">
          {t("searchPage.description")}
        </p>
      </div>
      <div className="flex w-full max-w-xl items-center space-x-2">
        <Input
          type="search"
          placeholder={t("header.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button type="submit" onClick={handleSearch}>
            <SearchIcon className="mr-2" />
            {t('Search')}
        </Button>
      </div>

      <div>
        {hasSearched ? (
          searchResults.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((doc) => (
                <Card key={doc.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDetails(doc)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <Badge variant={getUrgencyBadgeVariant(doc.urgency)}>
                            {t(doc.urgency)}
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.summary}
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
                     <div className="flex flex-col items-start">
                        <p><strong>{t('table.department')}:</strong> {doc.department}</p>
                        <p><strong>{t('table.assignee')}:</strong> {doc.assignee.name}</p>
                     </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>{t("searchPage.noResults")}</p>
            </div>
          )
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            {t("searchPage.placeholder")}
          </div>
        )}
      </div>

       <Dialog open={!!selectedDocument} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="sm:max-w-2xl">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocument.title}</DialogTitle>
                <DialogDescription>
                  {t('documentsPage.detailsDialog.documentId')}: {selectedDocument.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                  <div className="flex flex-col gap-2">
                      <h4 className="font-semibold">{t('documentsPage.detailsDialog.summary')}</h4>
                      <p className="text-sm text-muted-foreground">{selectedDocument.summary}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{t('table.status')}</p>
                          <Badge variant="outline">{t(selectedDocument.status)}</Badge>
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{t('table.urgency')}</p>
                          <Badge variant={getUrgencyBadgeVariant(selectedDocument.urgency)}>{t(selectedDocument.urgency)}</Badge>
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{t('table.assignee')}</p>
                          <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                  <AvatarImage src={selectedDocument.assignee.avatarUrl} alt={selectedDocument.assignee.name} />
                                  <AvatarFallback>{selectedDocument.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{selectedDocument.assignee.name}</span>
                          </div>
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{t('table.deadline')}</p>
                          <p className="text-sm">{formatDate(selectedDocument.deadline, language)}</p>
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{t('documentsPage.detailsDialog.createdAt')}</p>
                          <p className="text-sm">{formatDateTime(selectedDocument.createdAt, language)}</p>
                      </div>
                       <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{t('documentsPage.detailsDialog.department')}</p>
                          <p className="text-sm">{selectedDocument.department}</p>
                      </div>
                  </div>
                  <Separator />
                  <div>
                      <h4 className="font-semibold mb-4">{t('documentsPage.detailsDialog.auditLog')}</h4>
                      <div className="text-center py-10 text-sm text-muted-foreground">
                          <p>{t('documentsPage.detailsDialog.noAuditLog')}</p>
                      </div>
                  </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
