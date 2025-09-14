
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockDocuments } from "@/lib/data";
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

export default function SearchPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const results = mockDocuments.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lowercasedQuery) ||
        doc.summary.toLowerCase().includes(lowercasedQuery) ||
        doc.department.toLowerCase().includes(lowercasedQuery) ||
        doc.assignee.name.toLowerCase().includes(lowercasedQuery)
    );
    setSearchResults(results);
    setHasSearched(true);
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
                <Card key={doc.id}>
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
                     <p><strong>{t('table.department')}:</strong> {doc.department}</p>
                     <p><strong>{t('table.assignee')}:</strong> {doc.assignee.name}</p>
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
    </div>
  );
}
