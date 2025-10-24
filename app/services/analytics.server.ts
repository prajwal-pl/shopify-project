/**
 * Analytics Service
 *
 * Tracks user behavior and generates leads for merchants
 * Critical for lead generation and sales follow-up
 */

import prisma from "~/db.server";

// ============================================================================
// ANALYTICS EVENT TYPES
// ============================================================================

export type AnalyticsEventType =
  | "session_start"
  | "session_end"
  | "step_change"
  | "product_view"
  | "product_detail_view"
  | "filter_change"
  | "setting_selected"
  | "stone_selected"
  | "customization_change"
  | "lead_capture"
  | "add_to_cart"
  | "cart_failed"
  | "configuration_saved"
  | "configuration_shared"
  | "abandonment";

export interface AnalyticsEventData {
  sessionId: string;
  shop: string;
  eventType: AnalyticsEventType;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface UserSession {
  sessionId: string;
  shop: string;
  startedAt: Date;
  lastActiveAt: Date;
  currentStep: number;
  device: 'mobile' | 'desktop';
  referrer?: string;
  userAgent?: string;
}

export interface ProductView {
  sessionId: string;
  productType: 'setting' | 'diamond';
  productId: string;
  sku: string;
  price: number;
  viewedAt: Date;
  viewDuration?: number;
  viewedInDetail: boolean;
}

export interface FilterUsage {
  sessionId: string;
  step: number;
  filterType: string;
  filterValue: any;
  appliedAt: Date;
}

export interface ConfigurationProgress {
  sessionId: string;
  configurationId?: string;
  settingId?: string;
  diamondId?: string;
  customizations?: Record<string, any>;
  totalPrice: number;
  completedSteps: number[];
  lastUpdatedAt: Date;
  status: 'in_progress' | 'completed' | 'abandoned' | 'purchased';
}

export interface LeadCapture {
  sessionId: string;
  leadType: 'inquiry' | 'hint' | 'share' | 'save';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  message?: string;
  configurationId?: string;
  capturedAt: Date;
}

export interface Abandonment {
  sessionId: string;
  configurationId?: string;
  abandonedAtStep: number;
  timeSpent: number;
  itemsViewed: number;
  priceRange?: {
    min: number;
    max: number;
  };
  abandonedAt: Date;
}

// ============================================================================
// ANALYTICS SERVICE CLASS
// ============================================================================

class AnalyticsServiceClass {
  private eventQueue: AnalyticsEventData[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 50;
  private readonly FLUSH_INTERVAL_MS = 30000; // 30 seconds

  constructor() {
    // Start auto-flush on server initialization
    this.startAutoFlush();
  }

  /**
   * Start automatic batch flushing
   */
  private startAutoFlush() {
    if (this.flushInterval) return;

    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL_MS);
  }

  /**
   * Stop automatic batch flushing
   */
  public stopAutoFlush() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Track a generic analytics event
   */
  async trackEvent(eventData: AnalyticsEventData): Promise<void> {
    this.eventQueue.push(eventData);

    // Flush if queue is full
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      await this.flush();
    }
  }

  /**
   * Flush queued events to database
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await prisma.analyticsEvent.createMany({
        data: eventsToFlush.map(event => ({
          shop: event.shop,
          eventType: event.eventType,
          eventData: JSON.stringify({
            ...event.data,
            sessionId: event.sessionId,
          }),
          timestamp: event.timestamp,
        })),
      });

      console.log(`[Analytics] Flushed ${eventsToFlush.length} events to database`);
    } catch (error) {
      console.error('[Analytics] Error flushing events:', error);
      // Re-queue events on error
      this.eventQueue.unshift(...eventsToFlush);
    }
  }

  /**
   * Track session start
   */
  async trackSessionStart(session: UserSession): Promise<void> {
    await this.trackEvent({
      sessionId: session.sessionId,
      shop: session.shop,
      eventType: 'session_start',
      timestamp: new Date(),
      data: {
        device: session.device,
        referrer: session.referrer,
        userAgent: session.userAgent,
      },
    });
  }

  /**
   * Track session end
   */
  async trackSessionEnd(sessionId: string, shop: string, duration: number): Promise<void> {
    await this.trackEvent({
      sessionId,
      shop,
      eventType: 'session_end',
      timestamp: new Date(),
      data: { duration },
    });
  }

  /**
   * Track step change
   */
  async trackStepChange(
    sessionId: string,
    shop: string,
    fromStep: number,
    toStep: number
  ): Promise<void> {
    await this.trackEvent({
      sessionId,
      shop,
      eventType: 'step_change',
      timestamp: new Date(),
      data: { fromStep, toStep },
    });
  }

  /**
   * Track product view
   */
  async trackProductView(productView: ProductView): Promise<void> {
    await this.trackEvent({
      sessionId: productView.sessionId,
      shop: '', // Shop will be resolved from session
      eventType: productView.viewedInDetail ? 'product_detail_view' : 'product_view',
      timestamp: new Date(),
      data: {
        productType: productView.productType,
        productId: productView.productId,
        sku: productView.sku,
        price: productView.price,
        viewDuration: productView.viewDuration,
      },
    });
  }

  /**
   * Track filter usage
   */
  async trackFilterUsage(filterUsage: FilterUsage): Promise<void> {
    await this.trackEvent({
      sessionId: filterUsage.sessionId,
      shop: '', // Shop will be resolved from session
      eventType: 'filter_change',
      timestamp: new Date(),
      data: {
        step: filterUsage.step,
        filterType: filterUsage.filterType,
        filterValue: filterUsage.filterValue,
      },
    });
  }

  /**
   * Track configuration update
   */
  async trackConfigurationUpdate(progress: ConfigurationProgress): Promise<void> {
    const eventType = progress.status === 'completed'
      ? progress.settingId
        ? 'setting_selected'
        : 'stone_selected'
      : 'customization_change';

    await this.trackEvent({
      sessionId: progress.sessionId,
      shop: '', // Shop will be resolved from session
      eventType,
      timestamp: new Date(),
      data: {
        configurationId: progress.configurationId,
        settingId: progress.settingId,
        diamondId: progress.diamondId,
        customizations: progress.customizations,
        totalPrice: progress.totalPrice,
        completedSteps: progress.completedSteps,
        status: progress.status,
      },
    });
  }

  /**
   * Track lead capture (CRITICAL for merchant value)
   */
  async trackLeadCapture(lead: LeadCapture): Promise<void> {
    await this.trackEvent({
      sessionId: lead.sessionId,
      shop: '', // Shop will be resolved from session
      eventType: 'lead_capture',
      timestamp: new Date(),
      data: {
        leadType: lead.leadType,
        customerName: lead.customerName,
        customerEmail: lead.customerEmail,
        customerPhone: lead.customerPhone,
        message: lead.message,
        configurationId: lead.configurationId,
      },
    });

    // Also create a lead record for merchant follow-up
    try {
      await prisma.customerInquiry.create({
        data: {
          shop: '', // Shop will be resolved from session
          type: lead.leadType,
          configurationId: lead.configurationId,
          customerName: lead.customerName,
          customerEmail: lead.customerEmail || '',
          customerPhone: lead.customerPhone,
          message: lead.message,
          status: 'new',
        },
      });
    } catch (error) {
      console.error('[Analytics] Error creating lead record:', error);
    }
  }

  /**
   * Track add to cart (CONVERSION EVENT)
   */
  async trackAddToCart(
    sessionId: string,
    shop: string,
    configurationId: string,
    totalPrice: number,
    success: boolean,
    error?: string
  ): Promise<void> {
    await this.trackEvent({
      sessionId,
      shop,
      eventType: success ? 'add_to_cart' : 'cart_failed',
      timestamp: new Date(),
      data: {
        configurationId,
        totalPrice,
        error,
      },
    });
  }

  /**
   * Track configuration save
   */
  async trackConfigurationSave(
    sessionId: string,
    shop: string,
    configurationId: string
  ): Promise<void> {
    await this.trackEvent({
      sessionId,
      shop,
      eventType: 'configuration_saved',
      timestamp: new Date(),
      data: { configurationId },
    });
  }

  /**
   * Track configuration share
   */
  async trackConfigurationShare(
    sessionId: string,
    shop: string,
    configurationId: string,
    platform: string
  ): Promise<void> {
    await this.trackEvent({
      sessionId,
      shop,
      eventType: 'configuration_shared',
      timestamp: new Date(),
      data: {
        configurationId,
        platform,
      },
    });
  }

  /**
   * Track abandonment
   */
  async trackAbandonment(abandonment: Abandonment): Promise<void> {
    await this.trackEvent({
      sessionId: abandonment.sessionId,
      shop: '', // Shop will be resolved from session
      eventType: 'abandonment',
      timestamp: new Date(),
      data: {
        configurationId: abandonment.configurationId,
        abandonedAtStep: abandonment.abandonedAtStep,
        timeSpent: abandonment.timeSpent,
        itemsViewed: abandonment.itemsViewed,
        priceRange: abandonment.priceRange,
      },
    });
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardData(shop: string, dateRange?: { from: Date; to: Date }) {
    const from = dateRange?.from || new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
    const to = dateRange?.to || new Date();

    // Get all events in date range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        shop,
        timestamp: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Calculate metrics
    const activeSessions = new Set(
      events
        .filter((e: any) => e.eventType === 'session_start')
        .map((e: any) => {
          const data = e.eventData ? JSON.parse(e.eventData) : {};
          return data.sessionId;
        })
        .filter(Boolean)
    ).size;

    const configEvents = events.filter((e: any) =>
      ['setting_selected', 'stone_selected', 'customization_change'].includes(e.eventType)
    );

    const inProgressCount = new Set(
      configEvents.map((e: any) => {
        const data = e.eventData ? JSON.parse(e.eventData) : {};
        return data.sessionId;
      })
      .filter(Boolean)
    ).size;

    const completedCount = events.filter((e: any) => e.eventType === 'add_to_cart').length;

    const abandonedCount = events.filter((e: any) => e.eventType === 'abandonment').length;

    const leadCaptures = events.filter((e: any) => e.eventType === 'lead_capture');

    // Get popular products
    const productViews = events.filter((e: any) => e.eventType === 'product_view');
    const productCounts: Record<string, number> = {};
    productViews.forEach((event: any) => {
      const productId = (event.eventData as any).productId;
      if (productId) {
        productCounts[productId] = (productCounts[productId] || 0) + 1;
      }
    });

    const popularProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([productId, count]) => ({ productId, views: count }));

    // Calculate drop-off points
    const stepChanges = events.filter((e: any) => e.eventType === 'step_change');
    const dropOffByStep: Record<number, number> = {};
    stepChanges.forEach((event: any) => {
      const toStep = (event.eventData as any).toStep;
      if (toStep) {
        dropOffByStep[toStep] = (dropOffByStep[toStep] || 0) + 1;
      }
    });

    return {
      activeSessions,
      configurations: {
        inProgress: inProgressCount,
        completed: completedCount,
        abandoned: abandonedCount,
      },
      leadCaptures: {
        total: leadCaptures.length,
        byType: leadCaptures.reduce((acc: Record<string, number>, event: any) => {
          const leadType = (event.eventData as any).leadType || 'unknown';
          acc[leadType] = (acc[leadType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      popularProducts,
      dropOffPoints: Object.entries(dropOffByStep)
        .map(([step, count]) => ({ step: parseInt(step), count }))
        .sort((a, b) => b.count - a.count),
    };
  }

  /**
   * Get leads for merchant follow-up
   */
  async getLeads(shop: string, status?: string) {
    return await prisma.customerInquiry.findMany({
      where: {
        shop,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, status: string) {
    return await prisma.customerInquiry.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}

// Export singleton instance
export const AnalyticsService = new AnalyticsServiceClass();

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('[Analytics] Shutting down...');
    await AnalyticsService.flush();
    AnalyticsService.stopAutoFlush();
  });
}
