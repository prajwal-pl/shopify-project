/**
 * Admin Route: Customer Inquiries Dashboard
 *
 * Phase 2.0: View and manage customer inquiries.
 *
 * Features:
 * - List all inquiries for the shop
 * - Filter by type and status
 * - Update inquiry status
 * - Reply to customers
 */

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
// import { InquiryDashboard } from "~/components/admin/InquiryDashboard";
import type {
  CustomerInquiry,
  InquiryType,
  InquiryStatus,
} from "~/types/builder";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type");
  const statusFilter = url.searchParams.get("status");

  // Build filter conditions
  const where: any = { shop };

  if (typeFilter && typeFilter !== "all") {
    where.type = typeFilter;
  }

  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }

  // Fetch inquiries
  const inquiries = await prisma.customerInquiry.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 50,
  });

  const totalCount = await prisma.customerInquiry.count({ where: { shop } });

  return {
    inquiries,
    totalCount,
    shop,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const inquiryId = formData.get("inquiryId") as string;
  const status = formData.get("status") as InquiryStatus;

  if (!inquiryId || !status) {
    return Response.json(
      { success: false, error: "Missing inquiryId or status" },
      { status: 400 },
    );
  }

  try {
    // Verify inquiry belongs to this shop
    const inquiry = await prisma.customerInquiry.findFirst({
      where: { id: inquiryId, shop },
    });

    if (!inquiry) {
      return Response.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 },
      );
    }

    // Update status
    await prisma.customerInquiry.update({
      where: { id: inquiryId },
      data: { status },
    });

    return Response.json({ success: true, status });
  } catch (error: any) {
    console.error("Error updating inquiry status:", error);
    return Response.json(
      { success: false, error: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}

export default function InquiriesRoute() {
  const { inquiries, totalCount } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleStatusUpdate = async (
    inquiryId: string,
    status: InquiryStatus,
  ) => {
    fetcher.submit({ inquiryId, status }, { method: "POST" });
  };

  const handleFilterChange = (filter: {
    type?: InquiryType;
    status?: InquiryStatus;
  }) => {
    const params = new URLSearchParams();
    if (filter.type) params.set("type", filter.type);
    if (filter.status) params.set("status", filter.status);

    window.location.href = `/app/builder/inquiries?${params.toString()}`;
  };

  return (
    <div className="inquiries-page">
      <div style={{ padding: "40px", textAlign: "center", background: "white", borderRadius: "12px", margin: "20px" }}>
        <h1>Customer Inquiries - Under Reconstruction</h1>
        <p>Admin components are being rebuilt from scratch...</p>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Total inquiries: {totalCount}
        </p>
      </div>
      {/* <InquiryDashboard ... /> */}
    </div>
  );
}
