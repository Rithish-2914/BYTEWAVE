import type { Document } from "./types";
import { DEPARTMENTS, DOCUMENT_CATEGORIES, DOCUMENT_STATUSES, URGENCY_LEVELS } from "./constants";

const users = [
  { name: "Anjali Nair", avatarUrl: "https://picsum.photos/seed/user1/100/100" },
  { name: "Benny Thomas", avatarUrl: "https://picsum.photos/seed/user2/100/100" },
  { name: "Catherine D'Souza", avatarUrl: "https://picsum.photos/seed/user3/100/100" },
  { name: "David Kumar", avatarUrl: "https://picsum.photos/seed/user4/100/100" },
];

const documentTitles = [
    "Civil Engineering Blueprint Q4",
    "Monthly Maintenance Report",
    "Vendor Invoice #INV-2024-789",
    "CMRS Safety Directive Update",
    "New HR Policy on Remote Work",
    "Legal Opinion on Land Acquisition",
    "EIA Study for Corridor Extension",
    "Passenger Feedback Summary - May",
    "Signalling System Upgrade Plan",
    "Rolling Stock Inspection Checklist",
    "Station Operations Log - 15/07/2024",
    "Purchase Order #PO-2024-1123",
    "Board Meeting Minutes - June",
    "WhatsApp PDF: Incident at Aluva Station",
    "Maximo Export: Asset Depreciation",
    "SharePoint: New Tender Documents",
    "Safety Audit Report - Q2 2024",
    "New Employee Onboarding Kit",
    "Budget Proposal 2025 - Finance",
    "IT Systems Maintenance Schedule",
    "Environmental Compliance Certificate",
    "Security Protocol Update v3.1",
    "Executive Decision Memo - Project Alpha",
    "Press Release - New Metro Line",
    "Training Manual for Station Staff",
];


export const mockDocuments: Document[] = Array.from({ length: 25 }, (_, i) => {
    const date = new Date(Date.UTC(2024, 6, 15 - (i % 15)));
    const deadlineDate = new Date(date.getTime() + ((i % 5) * 5 * 24 * 60 * 60 * 1000));
  
  return {
    id: `DOC-${1001 + i}`,
    title: documentTitles[i],
    category: DOCUMENT_CATEGORIES[i % DOCUMENT_CATEGORIES.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    urgency: URGENCY_LEVELS[i % URGENCY_LEVELS.length] as "low" | "medium" | "high",
    status: DOCUMENT_STATUSES[i % DOCUMENT_STATUSES.length] as "Pending" | "In Review" | "Approved" | "Rejected",
    createdAt: date.toISOString(),
    deadline: (i % 3 === 0) ? deadlineDate.toISOString().split('T')[0] : undefined,
    summary: "This is an AI-generated summary placeholder for the document. It provides a concise overview of the key points, actions, and entities mentioned within the source file.",
    assignee: users[i % users.length],
  };
});