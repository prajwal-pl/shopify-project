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
} from "~/types/builder";
import type { MetalType, RingSize } from "~/utils/constants";

type BuilderContextType = BuilderState & BuilderActions;

const BuilderContext = createContext<BuilderContextType | null>(null);

const STORAGE_KEY = "ring-builder-state";

export function BuilderProvider({
  children,
  shop,
}: {
  children: React.ReactNode;
  shop: string;
}) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>(1);
  const [selectedSetting, setSelectedSetting] = useState<Setting | undefined>();
  const [selectedMetalType, setSelectedMetalType] = useState<
    MetalType | undefined
  >();
  const [selectedStone, setSelectedStone] = useState<Stone | undefined>();
  const [ringSize, setRingSize] = useState<RingSize | undefined>();
  const [sideStones, setSideStones] = useState<SideStonesConfig | undefined>();
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    settingPrice: 0,
    stonePrice: 0,
    sideStonesPrice: 0,
    subtotal: 0,
    markup: 0,
    markupPercent: 0,
    total: 0,
  });

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
  ]);

  // Calculate price whenever selections change
  useEffect(() => {
    calculatePrice();
  }, [selectedSetting, selectedMetalType, selectedStone, sideStones]);

  const calculatePrice = () => {
    let settingPrice = 0;
    let stonePrice = 0;
    let sideStonesPrice = 0;

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

    const subtotal = settingPrice + stonePrice + sideStonesPrice;

    // TODO: Fetch markup percentage from app settings
    const markupPercent = 0; // Will be fetched from API in real implementation
    const markup = (subtotal * markupPercent) / 100;
    const total = subtotal + markup;

    setPriceBreakdown({
      settingPrice,
      stonePrice,
      sideStonesPrice,
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
  };

  const selectStone = (stone: Stone) => {
    setSelectedStone(stone);
    // Auto-advance to customization
    setCurrentStep(3);
  };

  const updateMetalType = (metalType: MetalType) => {
    setSelectedMetalType(metalType);
  };

  const updateRingSize = (size: RingSize) => {
    setRingSize(size);
  };

  const updateSideStones = (config: SideStonesConfig) => {
    setSideStones(config);
  };

  const goToStep = (step: BuilderStep) => {
    if (step === 3 && (!selectedStone || !ringSize)) {
      return;
    }
    setCurrentStep(step);
  };

  const resetBuilder = () => {
    setCurrentStep(1);
    setSelectedSetting(undefined);
    setSelectedMetalType(undefined);
    setSelectedStone(undefined);
    setRingSize(undefined);
    setSideStones(undefined);
    setPriceBreakdown({
      settingPrice: 0,
      stonePrice: 0,
      sideStonesPrice: 0,
      subtotal: 0,
      markup: 0,
      markupPercent: 0,
      total: 0,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: BuilderContextType = {
    currentStep,
    selectedSetting,
    selectedMetalType,
    selectedStone,
    ringSize,
    sideStones,
    priceBreakdown,
    selectSetting,
    selectStone,
    updateMetalType,
    updateRingSize,
    updateSideStones,
    goToStep,
    resetBuilder,
    calculatePrice,
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
