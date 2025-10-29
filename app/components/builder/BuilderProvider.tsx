/**
 * Builder Provider - React Context
 *
 * Manages global state for the ring builder flow.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  BuilderState,
  BuilderActions,
  BuilderStep,
  Setting,
  Stone,
  PriceBreakdown,
  SideStonesConfig,
  EngravingConfig,
  GiftMessageConfig,
  RingProduct,
} from "~/types/builder";
import type { MetalType, RingSize } from "~/utils/constants";
import { useToast } from "../shared/useToast";
import type { ToastProps } from "../shared/Toast";

type BuilderContextType = BuilderState & BuilderActions & {
  sessionId: string;
  trackEvent: (eventType: string, data: any) => Promise<void>;
  showToast: (toast: Omit<ToastProps, "onClose">) => void;
  toasts: Array<ToastProps & { id: string }>;
  showCart: boolean;
  cartItemCount: number;
  openCart: () => void;
  closeCart: () => void;
  refreshCartCount: () => Promise<void>;
};

const BuilderContext = createContext<BuilderContextType | null>(null);

const STORAGE_KEY = "ring-builder-state";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function BuilderProvider({
  children,
  shop,
}: {
  children: React.ReactNode;
  shop: string;
}) {
  const { toasts, showToast, removeToast } = useToast();
  const [sessionId] = useState(() => generateSessionId());
  const [sessionStartTime] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState<BuilderStep>(1);
  const [selectedSetting, setSelectedSetting] = useState<Setting | undefined>();
  const [selectedMetalType, setSelectedMetalType] = useState<
    MetalType | undefined
  >();
  const [selectedStone, setSelectedStone] = useState<Stone | undefined>();
  const [ringSize, setRingSize] = useState<RingSize | undefined>();
  const [sideStones, setSideStones] = useState<SideStonesConfig | undefined>();
  const [engraving, setEngraving] = useState<EngravingConfig | undefined>();
  const [giftMessage, setGiftMessage] = useState<GiftMessageConfig | undefined>();
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    settingPrice: 0,
    stonePrice: 0,
    sideStonesPrice: 0,
    engravingPrice: 0,
    subtotal: 0,
    markup: 0,
    markupPercent: 0,
    total: 0,
  });
  const [showSettingDetail, setShowSettingDetail] = useState(false);
  const [showStoneDetail, setShowStoneDetail] = useState(false);
  const [viewDetailSetting, setViewDetailSetting] = useState<
    Setting | RingProduct | undefined
  >();
  const [viewDetailStone, setViewDetailStone] = useState<Stone | undefined>();
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.shop === shop) {
          // Restore state if it's for the same shop
          setCurrentStep(state.currentStep || 1);
          setSelectedSetting(state.selectedSetting);
          setSelectedMetalType(state.selectedMetalType);
          setSelectedStone(state.selectedStone);
          setRingSize(state.ringSize);
          setSideStones(state.sideStones);
          setEngraving(state.engraving);
          setGiftMessage(state.giftMessage);
        }
      } catch (error) {
        console.error("Error loading builder state:", error);
      }
    }
  }, [shop]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      shop,
      currentStep,
      selectedSetting,
      selectedMetalType,
      selectedStone,
      ringSize,
      sideStones,
      engraving,
      giftMessage,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    shop,
    currentStep,
    selectedSetting,
    selectedMetalType,
    selectedStone,
    ringSize,
    sideStones,
    engraving,
    giftMessage,
  ]);

  // Calculate price whenever selections change
  useEffect(() => {
    calculatePrice();
  }, [selectedSetting, selectedMetalType, selectedStone, sideStones, engraving]);

  const calculatePrice = () => {
    let settingPrice = 0;
    let stonePrice = 0;
    let sideStonesPrice = 0;
    let engravingPrice = 0;

    // Get setting price for selected metal type
    if (selectedSetting && selectedMetalType) {
      settingPrice = selectedSetting.basePrices[selectedMetalType] || 0;
    }

    // Get stone price
    if (selectedStone) {
      stonePrice = selectedStone.price;
    }

    // Calculate side stones price
    if (sideStones && sideStones.quantity > 0) {
      sideStonesPrice = sideStones.price || 0;
    }

    // Calculate engraving price
    if (engraving?.enabled) {
      engravingPrice = engraving.price || 0;
    }

    const subtotal = settingPrice + stonePrice + sideStonesPrice + engravingPrice;

    // TODO: Fetch markup percentage from app settings
    const markupPercent = 0; // Will be fetched from API in real implementation
    const markup = (subtotal * markupPercent) / 100;
    const total = subtotal + markup;

    setPriceBreakdown({
      settingPrice,
      stonePrice,
      sideStonesPrice,
      engravingPrice,
      subtotal,
      markup,
      markupPercent,
      total,
    });
  };

  const selectSetting = (setting: Setting, metalType: MetalType) => {
    setSelectedSetting(setting);
    setSelectedMetalType(metalType);
    // Auto-advance to stone selection
    setCurrentStep(2);

    trackEvent('product_view', {
      productId: setting.id,
      productType: 'setting',
      metalType,
      price: setting.basePrices[metalType],
    });

    trackEvent('step_change', {
      fromStep: 1,
      toStep: 2,
      settingSelected: true,
    });
  };

  const selectStone = (stone: Stone) => {
    setSelectedStone(stone);
    // Auto-advance to customization
    setCurrentStep(3);

    trackEvent('product_view', {
      productId: stone.id,
      productType: 'stone',
      carat: stone.carat,
      shape: stone.shape,
      color: stone.color,
      clarity: stone.clarity,
      price: stone.price,
    });

    trackEvent('step_change', {
      fromStep: 2,
      toStep: 3,
      stoneSelected: true,
    });
  };

  const updateMetalType = (metalType: MetalType) => {
    setSelectedMetalType(metalType);

    trackEvent('configuration_update', {
      field: 'metalType',
      value: metalType,
      step: currentStep,
    });
  };

  const updateRingSize = (size: RingSize) => {
    setRingSize(size);

    trackEvent('configuration_update', {
      field: 'ringSize',
      value: size,
      step: currentStep,
    });
  };

  const updateSideStones = (config: SideStonesConfig) => {
    setSideStones(config);

    trackEvent('configuration_update', {
      field: 'sideStones',
      value: config,
      step: currentStep,
    });
  };

  const updateEngraving = (config: EngravingConfig) => {
    setEngraving(config);

    trackEvent('configuration_update', {
      field: 'engraving',
      value: config,
      step: currentStep,
    });
  };

  const updateGiftMessage = (config: GiftMessageConfig) => {
    setGiftMessage(config);

    trackEvent('configuration_update', {
      field: 'giftMessage',
      value: config,
      step: currentStep,
    });
  };

  const goToStep = (step: BuilderStep) => {
    const previousStep = currentStep;
    setCurrentStep(step);

    trackEvent('step_change', {
      fromStep: previousStep,
      toStep: step,
    });
  };

  const resetBuilder = () => {
    setCurrentStep(1);
    setSelectedSetting(undefined);
    setSelectedMetalType(undefined);
    setSelectedStone(undefined);
    setRingSize(undefined);
    setSideStones(undefined);
    setEngraving(undefined);
    setGiftMessage(undefined);
    setPriceBreakdown({
      settingPrice: 0,
      stonePrice: 0,
      sideStonesPrice: 0,
      engravingPrice: 0,
      subtotal: 0,
      markup: 0,
      markupPercent: 0,
      total: 0,
    });
    setShowSettingDetail(false);
    setShowStoneDetail(false);
    setViewDetailSetting(undefined);
    setViewDetailStone(undefined);
    localStorage.removeItem(STORAGE_KEY);
  };

  const showSettingDetailView = (setting: Setting | RingProduct) => {
    setViewDetailSetting(setting);
    setShowSettingDetail(true);
  };

  const showStoneDetailView = (stone: Stone) => {
    setViewDetailStone(stone);
    setShowStoneDetail(true);
  };

  const hideDetailViews = () => {
    setShowSettingDetail(false);
    setShowStoneDetail(false);
  };

  const openCart = () => {
    setShowCart(true);
    refreshCartCount();
  };

  const closeCart = () => {
    setShowCart(false);
  };

  const refreshCartCount = async () => {
    try {
      const response = await fetch(`/api/builder/cart/get?shop=${shop}`);
      const data = await response.json();
      setCartItemCount(data.item_count || 0);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const trackEvent = async (eventType: string, data: any) => {
    try {
      await fetch('/api/builder/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          shop,
          eventType,
          timestamp: new Date().toISOString(),
          data,
        }),
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const initSession = async () => {
      try {
        await fetch('/api/builder/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            sessionId,
            shop,
            eventType: 'session_start',
            timestamp: new Date(sessionStartTime).toISOString(),
            data: {
              timestamp: new Date(sessionStartTime).toISOString(),
              userAgent: navigator.userAgent,
            },
          }),
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Analytics tracking failed:', error);
      }

      try {
        const response = await fetch(`/api/builder/cart/get?shop=${shop}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setCartItemCount(data.item_count || 0);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch cart count:', error);
      }
    };

    initSession();

    return () => {
      controller.abort();
    };
  }, [shop, sessionId, sessionStartTime]);

  const value: BuilderContextType = {
    sessionId,
    trackEvent,
    showToast,
    toasts,
    showCart,
    cartItemCount,
    openCart,
    closeCart,
    refreshCartCount,
    currentStep,
    selectedSetting,
    selectedMetalType,
    selectedStone,
    ringSize,
    sideStones,
    engraving,
    giftMessage,
    priceBreakdown,
    showSettingDetail,
    showStoneDetail,
    viewDetailSetting,
    viewDetailStone,
    selectSetting,
    selectStone,
    updateMetalType,
    updateRingSize,
    updateSideStones,
    updateEngraving,
    updateGiftMessage,
    goToStep,
    resetBuilder,
    calculatePrice,
    showSettingDetailView,
    showStoneDetailView,
    hideDetailViews,
  };

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within BuilderProvider");
  }
  return context;
}
