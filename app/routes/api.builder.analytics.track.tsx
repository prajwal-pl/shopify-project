import type { ActionFunctionArgs } from "react-router";
import { AnalyticsService } from "~/services/analytics.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();

    await AnalyticsService.trackEvent({
      sessionId: body.sessionId,
      shop: body.shop,
      eventType: body.eventType,
      timestamp: new Date(body.timestamp),
      data: body.data,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return Response.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
