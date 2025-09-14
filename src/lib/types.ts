

export type DocumentStatus = "Pending" | "In Review" | "Approved" | "Rejected";

export type AuditLogEntry = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
};

export type Document = {
  id: string;
  title: string;
  category: string;
  department: string;
  urgency: "low" | "medium" | "high";
  status: DocumentStatus;
  createdAt: string;
  deadline?: string;
  summary: string;
  assignee: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  auditLog?: AuditLogEntry[];
};

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};
