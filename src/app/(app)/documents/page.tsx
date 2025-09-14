

"use client";

import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
import { useState, useEffect } from "react";
import type { Document, DocumentStatus, AuditLogEntry } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDocuments } from "@/hooks/use-documents";
import { useAuth } from "@/components/providers/auth-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allUsers } from "@/lib/users";

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

const formatDate = (dateString: string | undefined, locale: string) => {
    if (!dateString) return 'N/A';
    if (dateString.length === 10 && !dateString.includes('T')) {
         return new Date(`${dateString}T00:00:00Z`).toLocaleDateString(locale, { timeZone: 'UTC' });
    }
    return new Date(dateString).toLocaleDateString(locale);
};

const formatDateTime = (dateString: string | undefined, locale: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short'});
};

export default function DocumentsPage() {
  const { t, language } = useLanguage();
  const { documents, updateDocumentStatus, addAuditLogEntry } = useDocuments();
  const { currentUser } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<{docId: string; status: DocumentStatus} | null>(null);

  const handleViewDetails = (doc: Document) => {
    setSelectedDocument(doc);
  };
  
  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
  };


  const handleCloseDialog = () => {
    setSelectedDocument(null);
  };
  
  const handleCloseEditDialog = () => {
    setEditingDocument(null);
  }

  const handleStatusChange = (docId: string, status: DocumentStatus) => {
    setActionToConfirm({ docId, status });
  };
  
  const confirmStatusChange = () => {
    if (actionToConfirm && currentUser) {
        updateDocumentStatus(actionToConfirm.docId, actionToConfirm.status, {id: currentUser.id, name: currentUser.name});
        setActionToConfirm(null);
        handleCloseDialog();
    }
  };

  const userDocuments = documents.filter(doc => 
    currentUser?.role === 'Admin' || doc.department === currentUser?.department
  );
  
  const canTakeAction = currentUser && selectedDocument && selectedDocument.assignee.id === currentUser.id;

  const getActionButtons = () => {
    if (!canTakeAction || !selectedDocument) return null;

    switch(selectedDocument.status) {
        case 'Pending':
        case 'In Review':
            return (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => handleStatusChange(selectedDocument.id, 'Rejected')}>{t('actions.reject')}</Button>
                    <Button onClick={() => handleStatusChange(selectedDocument.id, 'Approved')}>{t('actions.approve')}</Button>
                </div>
            );
        case 'Rejected':
            return (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => handleStatusChange(selectedDocument.id, 'Pending')}>{t('actions.reopen')}</Button>
                    <Button onClick={() => handleStatusChange(selectedDocument.id, 'Approved')}>{t('actions.approve')}</Button>
                </div>
            );
        case 'Approved':
            // No actions for approved documents for now
            return null;
        default:
            return null;
    }
  }


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
        {currentUser?.role === 'Admin' && (
            <Button asChild>
                <Link href="/upload">
                    <PlusCircle />
                    {t("documentsPage.addDocument")}
                </Link>
            </Button>
        )}
      </div>

      <Tabs defaultValue="All">
        <TabsList>
            <TabsTrigger value="All">{t("documentsPage.all")}</TabsTrigger>
            {DOCUMENT_STATUSES.map(status => (
                <TabsTrigger key={status} value={status}>{t(status)}</TabsTrigger>
            ))}
        </TabsList>
        <TabsContent value="All">
            <DocumentsTable documents={userDocuments} onViewDetails={handleViewDetails} onEdit={handleEdit} />
        </TabsContent>
        {DOCUMENT_STATUSES.map(status => (
            <TabsContent key={status} value={status}>
                <DocumentsTable documents={userDocuments.filter(d => d.status === status)} onViewDetails={handleViewDetails} onEdit={handleEdit} />
            </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedDocument} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocument.title}</DialogTitle>
                <DialogDescription>
                  {t('documentsPage.detailsDialog.documentId')}: {selectedDocument.id}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 -mx-6 px-6">
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
                        {selectedDocument.auditLog && selectedDocument.auditLog.length > 0 ? (
                            <ul className="space-y-4">
                                {selectedDocument.auditLog.map(log => (
                                    <li key={log.id} className="flex items-start gap-3 text-sm">
                                        <Avatar className="h-6 w-6 mt-0.5">
                                            <AvatarImage src={allUsers.find(u => u.id === log.userId)?.avatarUrl} />
                                            <AvatarFallback>{log.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-muted-foreground">
                                                <span className="font-semibold text-foreground">{log.userName}</span>
                                                &nbsp;{log.action}
                                            </p>
                                            <time className="text-xs text-muted-foreground/80">
                                                {formatDateTime(log.timestamp, language)}
                                            </time>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-sm text-muted-foreground">
                                <p>{t('documentsPage.detailsDialog.noAuditLog')}</p>
                            </div>
                        )}
                    </div>
                </div>
              </ScrollArea>
              <DialogFooter className="mt-auto pt-4 border-t">
                {getActionButtons()}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {editingDocument && (
        <EditDocumentDialog 
            doc={editingDocument} 
            onClose={handleCloseEditDialog} 
        />
      )}

       <AlertDialog open={!!actionToConfirm} onOpenChange={() => setActionToConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('actions.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('actions.confirmDescription', {status: t(actionToConfirm?.status || '')})}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionToConfirm(null)}>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>{t('actions.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function DocumentsTable({ documents, onViewDetails, onEdit }: { documents: Document[], onViewDetails: (doc: Document) => void, onEdit: (doc: Document) => void }) {
  const { t, language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          <TableRow key={doc.id} onClick={() => onViewDetails(doc)} className="cursor-pointer">
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
            <TableCell>{isClient ? formatDate(doc.deadline, language) : 'N/A'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t("table.toggleMenu")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onViewDetails(doc)}>{t("table.viewDetails")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(doc)}>{t("table.edit")}</DropdownMenuItem>
                  <DropdownMenuSeparator />
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


function EditDocumentDialog({ doc, onClose }: { doc: Document, onClose: () => void }) {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const { updateDocumentStatus, addAuditLogEntry } = useDocuments();
    const [status, setStatus] = useState<DocumentStatus>(doc.status);
    const [comment, setComment] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = () => {
        if (!currentUser) return;
        setIsSaving(true);
        
        let hasChanges = false;
        
        // 1. Update status if changed
        if (status !== doc.status) {
            updateDocumentStatus(doc.id, status, currentUser, `Status changed to ${status} via edit.`);
            hasChanges = true;
        }

        // 2. Add comment to audit log if provided
        if (comment.trim()) {
            addAuditLogEntry(doc.id, {
                id: `log-${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                action: `Comment: ${comment.trim()}`,
                timestamp: new Date().toISOString(),
            });
            hasChanges = true;
        }
        
        // If only status changed without a comment, add a default log entry
        if(status !== doc.status && !comment.trim()){
             addAuditLogEntry(doc.id, {
                id: `log-${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                action: `Status changed to ${status}.`,
                timestamp: new Date().toISOString(),
            });
        }


        setIsSaving(false);
        onClose();
    };


    return (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editDialog.title')}</DialogTitle>
                    <DialogDescription>{doc.title}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">{t('editDialog.status')}</Label>
                         <Select value={status} onValueChange={(value) => setStatus(value as DocumentStatus)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder={t('editDialog.selectStatus')} />
                            </SelectTrigger>
                            <SelectContent>
                                {DOCUMENT_STATUSES.map(s => (
                                    <SelectItem key={s} value={s}>{t(s)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="audit-comment">{t('editDialog.addFollowUp')}</Label>
                        <Textarea
                            id="audit-comment"
                            placeholder={t('editDialog.commentPlaceholder')}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t('actions.cancel')}</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>{t('editDialog.save')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}