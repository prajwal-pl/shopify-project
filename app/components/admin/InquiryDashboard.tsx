/**
 * Inquiry Dashboard Component
 *
 * Phase 2.0: Customer inquiry management interface.
 *
 * Features:
 * - List all customer inquiries
 * - Filter by type (Hint, Info, Viewing, Email)
 * - Filter by status (New, Contacted, Closed)
 * - Date range filtering
 * - Inquiry cards with customer info and ring details
 * - Actions: View Details, Mark Read, Mark Contacted, Mark Closed
 * - Reply to Customer button
 */

import { useState } from "react";
import type {
  CustomerInquiry,
  InquiryType,
  InquiryStatus,
} from "~/types/builder";

interface InquiryDashboardProps {
  inquiries: CustomerInquiry[];
  totalCount: number;
  onStatusUpdate: (inquiryId: string, status: InquiryStatus) => Promise<void>;
  onFilterChange: (filter: {
    type?: InquiryType;
    status?: InquiryStatus;
  }) => void;
  isLoading?: boolean;
}

export function InquiryDashboard({
  inquiries,
  totalCount,
  onStatusUpdate,
  onFilterChange,
  isLoading = false,
}: InquiryDashboardProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onFilterChange({
      type: type === "all" ? undefined : (type as InquiryType),
      status:
        selectedStatus === "all"
          ? undefined
          : (selectedStatus as InquiryStatus),
    });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onFilterChange({
      type: selectedType === "all" ? undefined : (selectedType as InquiryType),
      status: status === "all" ? undefined : (status as InquiryStatus),
    });
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="inquiry-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Customer Inquiries</h1>
        <div className="header-stats">
          <span className="stat-badge new">{newCount} New</span>
          <span className="stat-badge total">{totalCount} Total</span>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Type:</label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="hint">💌 Drop A Hint</option>
            <option value="info">📧 Request Info</option>
            <option value="viewing">📅 Schedule Viewing</option>
            <option value="email">✉️ Email Friend</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Inquiry List */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading inquiries...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="empty-state">
          <p>No inquiries found.</p>
          <p className="empty-hint">
            Customers haven't submitted any inquiries yet.
          </p>
        </div>
      ) : (
        <div className="inquiries-list">
          {inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>
      )}

      <style>{`
        .inquiry-dashboard {
          padding: 1.5rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 1.75rem;
          color: #333;
        }

        .header-stats {
          display: flex;
          gap: 0.75rem;
        }

        .stat-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .stat-badge.new {
          background: #ffebee;
          color: #c62828;
        }

        .stat-badge.total {
          background: #e3f2fd;
          color: #1565c0;
        }

        .dashboard-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 500;
          color: #666;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .inquiries-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f0f0f0;
          border-top-color: #6D2932;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-hint {
          font-size: 0.9rem;
          color: #999;
        }
      `}</style>
    </div>
  );
}

/**
 * Inquiry Card Component
 */
interface InquiryCardProps {
  inquiry: CustomerInquiry;
  onStatusUpdate: (inquiryId: string, status: InquiryStatus) => Promise<void>;
}

function InquiryCard({ inquiry, onStatusUpdate }: InquiryCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: InquiryStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(inquiry.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const getTypeIcon = (type: InquiryType): string => {
    switch (type) {
      case "hint":
        return "💌";
      case "info":
        return "📧";
      case "viewing":
        return "📅";
      case "email":
        return "✉️";
      default:
        return "📬";
    }
  };

  const getTypeLabel = (type: InquiryType): string => {
    switch (type) {
      case "hint":
        return "Drop A Hint";
      case "info":
        return "Request Info";
      case "viewing":
        return "Schedule Viewing";
      case "email":
        return "Email Friend";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return <span className="status-badge new">New</span>;
      case "contacted":
        return <span className="status-badge contacted">Contacted</span>;
      case "closed":
        return <span className="status-badge closed">Closed</span>;
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="inquiry-card">
      <div className="inquiry-header">
        <div className="inquiry-title">
          <span className="type-icon">{getTypeIcon(inquiry.type)}</span>
          <span className="type-label">{getTypeLabel(inquiry.type)}</span>
          {getStatusBadge(inquiry.status)}
        </div>
        <span className="inquiry-date">{formatDate(inquiry.createdAt)}</span>
      </div>

      <div className="inquiry-body">
        <div className="customer-info">
          <p>
            <strong>From:</strong> {inquiry.customerName || "Anonymous"}{" "}
            {inquiry.customerEmail && `(${inquiry.customerEmail})`}
          </p>
          {inquiry.customerPhone && (
            <p>
              <strong>Phone:</strong> {inquiry.customerPhone}
            </p>
          )}
        </div>

        {inquiry.message && (
          <div className="inquiry-message">
            <strong>Message:</strong>
            <p>{inquiry.message}</p>
          </div>
        )}

        {inquiry.preferredDate && (
          <div className="preferred-date">
            <strong>Preferred Date:</strong>{" "}
            {new Date(inquiry.preferredDate).toLocaleDateString()}{" "}
            {inquiry.preferredTime && `at ${inquiry.preferredTime}`}
          </div>
        )}

        {inquiry.configurationId && (
          <div className="config-link">
            <strong>Configuration:</strong> {inquiry.configurationId}
          </div>
        )}
      </div>

      <div className="inquiry-actions">
        {inquiry.customerEmail && (
          <a
            href={`mailto:${inquiry.customerEmail}`}
            className="action-btn primary"
          >
            Reply to Customer
          </a>
        )}

        {inquiry.status === "new" && (
          <button
            className="action-btn secondary"
            onClick={() => handleStatusUpdate("contacted")}
            disabled={isUpdating}
          >
            Mark Contacted
          </button>
        )}

        {inquiry.status !== "closed" && (
          <button
            className="action-btn secondary"
            onClick={() => handleStatusUpdate("closed")}
            disabled={isUpdating}
          >
            Mark Closed
          </button>
        )}
      </div>

      <style>{`
        .inquiry-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.25rem;
          transition: all 0.2s;
        }

        .inquiry-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .inquiry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .inquiry-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .type-icon {
          font-size: 1.5rem;
        }

        .type-label {
          font-weight: 600;
          color: #333;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.new {
          background: #ffebee;
          color: #c62828;
        }

        .status-badge.contacted {
          background: #fff3e0;
          color: #f57c00;
        }

        .status-badge.closed {
          background: #e0e0e0;
          color: #666;
        }

        .inquiry-date {
          font-size: 0.9rem;
          color: #999;
        }

        .inquiry-body {
          margin-bottom: 1rem;
        }

        .customer-info p,
        .inquiry-message p,
        .preferred-date,
        .config-link {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: #666;
        }

        .inquiry-message {
          padding: 0.75rem;
          background: #f9f9f9;
          border-radius: 6px;
          margin: 0.75rem 0;
        }

        .inquiry-message p {
          margin: 0.5rem 0 0 0;
          color: #333;
          font-style: italic;
        }

        .inquiry-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .action-btn.primary {
          background: #6D2932;
          color: white;
          border: none;
        }

        .action-btn.primary:hover {
          background: #5a1f28;
        }

        .action-btn.secondary {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
        }

        .action-btn.secondary:hover:not(:disabled) {
          background: #f7f7f7;
          border-color: #ccc;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .inquiry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
