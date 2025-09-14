import type { Document } from "./types";
import { DEPARTMENTS, DOCUMENT_CATEGORIES, DOCUMENT_STATUSES, URGENCY_LEVELS } from "./constants";

const users = [
  { name: "Anjali Nair", avatarUrl: "https://picsum.photos/seed/user1/100/100" },
  { name: "Benny Thomas", avatarUrl: "https://picsum.photos/seed/user2/100/100" },
  { name: "Catherine D'Souza", avatarUrl: "https://picsum.photos/seed/user3/100/100" },
  { name: "David Kumar", avatarUrl: "https://picsum.photos/seed/user4/100/100" },
];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomItem = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
};

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
    "SharePoint: New Tender Documents"
];


export const mockDocuments: Document[] = Array.from({ length: 25 }, (_, i) => {
  const createdAt = generateRandomDate(new Date(2023, 6, 1), new Date());
  const deadlineDate = new Date(createdAt.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000));
  
  return {
    id: `DOC-${1001 + i}`,
    title: getRandomItem(documentTitles),
    category: getRandomItem(DOCUMENT_CATEGORIES),
    department: getRandomItem(DEPARTMENTS),
    urgency: getRandomItem(URGENCY_LEVELS as Array<"low" | "medium" | "high">),
    status: getRandomItem(DOCUMENT_STATUSES as Array<"Pending" | "In Review" | "Approved" | "Rejected">),
    createdAt: createdAt.toISOString(),
    deadline: (i % 3 === 0) ? deadlineDate.toISOString().split('T')[0] : undefined,
    summary: "This is an AI-generated summary placeholder for the document. It provides a concise overview of the key points, actions, and entities mentioned within the source file.",
    assignee: getRandomItem(users),
  };
});
