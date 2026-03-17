"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Users, Bag, CaretLeft, X, Trash, CaretRight, Check,
  Scissors, Hand, Eye, Palette, Flower, Sparkle,
  type Icon,
} from "@phosphor-icons/react";
import { useKioskStore } from "@/store/kiosk-store";
import type { KioskService, KioskProfessional } from "@/store/kiosk-store";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import ServiceCard from "@/components/kiosk/ServiceCard";
import ProfessionalCard from "@/components/kiosk/ProfessionalCard";
import CrossSellModal from "@/components/kiosk/CrossSellModal";

// ---------------------------------------------------------------------------
// Sub-step type
// ---------------------------------------------------------------------------

type SubStep = "categories" | "services" | "professional";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_SERVICES: KioskService[] = [
  { id: "s01", name: "Corte Feminino", category: "Cabelo", price_charmes: 80, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop" },
  { id: "s02", name: "Corte + Escova Premium", category: "Cabelo", price_charmes: 120, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop" },
  { id: "s03", name: "Hidratação Capilar", category: "Cabelo", price_charmes: 90, duration_minutes: 75, image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop" },
  { id: "s04", name: "Coloração Completa", category: "Cabelo", price_charmes: 180, duration_minutes: 120, image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop" },
  { id: "s05", name: "Escova Botox", category: "Cabelo", price_charmes: 150, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop" },
  { id: "s06", name: "Manicure Completa", category: "Unhas", price_charmes: 45, duration_minutes: 45, image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop" },
  { id: "s07", name: "Pedicure Completa", category: "Unhas", price_charmes: 50, duration_minutes: 50, image_url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop" },
  { id: "s08", name: "Gel nas Unhas", category: "Unhas", price_charmes: 85, duration_minutes: 70, image_url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300&fit=crop" },
  { id: "s09", name: "Design de Sobrancelha", category: "Sobrancelha", price_charmes: 35, duration_minutes: 30, image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop" },
  { id: "s10", name: "Henna de Sobrancelha", category: "Sobrancelha", price_charmes: 40, duration_minutes: 40, image_url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop" },
  { id: "s11", name: "Maquiagem Social", category: "Maquiagem", price_charmes: 120, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
  { id: "s12", name: "Maquiagem para Noivas", category: "Maquiagem", price_charmes: 250, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=300&fit=crop" },
  { id: "s13", name: "Depilação com Cera", category: "Depilação", price_charmes: 60, duration_minutes: 45, image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop" },
  { id: "s14", name: "Limpeza de Pele", category: "Tratamentos", price_charmes: 110, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop" },
  { id: "s15", name: "Peeling Facial", category: "Tratamentos", price_charmes: 140, duration_minutes: 50, image_url: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=300&fit=crop" },
];

const MOCK_PROFESSIONALS: KioskProfessional[] = [
  { id: "p01", name: "Ana Silva", avatar_url: null, specialty: "Cabelo & Coloração" },
  { id: "p02", name: "Bruna Costa", avatar_url: null, specialty: "Unhas & Nail Art" },
  { id: "p03", name: "Carla Santos", avatar_url: null, specialty: "Sobrancelha & Make" },
  { id: "p04", name: "Daniela Rocha", avatar_url: null, specialty: "Depilação" },
  { id: "p05", name: "Eduarda Lima", avatar_url: null, specialty: "Cabelo & Escova" },
  { id: "p06", name: "Fernanda Alves", avatar_url: null, specialty: "Manicure & Pedicure" },
];

// ---------------------------------------------------------------------------
// Category data
// ---------------------------------------------------------------------------

interface CategoryInfo {
  name: string;
  icon: Icon;
  color: string;
}

const CATEGORIES: CategoryInfo[] = [
  { name: "Cabelo", icon: Scissors, color: "#D94B8C" },
  { name: "Unhas", icon: Hand, color: "#E87AAF" },
  { name: "Sobrancelha", icon: Eye, color: "#C2185B" },
  { name: "Maquiagem", icon: Palette, color: "#F5B8D3" },
  { name: "Depilação", icon: Flower, color: "#7B2D52" },
  { name: "Tratamentos", icon: Sparkle, color: "#9D6B9E" },
];

const STEP_LABELS = ["Identificação", "Serviço", "Confirmação", "Concluído"];

import { formatCharmes } from "@/lib/format";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const listContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const profSectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0, y: 16,
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0, y: -12,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SelectServiceScreen() {
  const cart = useKioskStore((s) => s.cart);
  const professionalsByService = useKioskStore((s) => s.professionalsByService);
  const addToCart = useKioskStore((s) => s.addToCart);
  const removeFromCart = useKioskStore((s) => s.removeFromCart);
  const assignProfessional = useKioskStore((s) => s.assignProfessional);
  const assignAllProfessionals = useKioskStore((s) => s.assignAllProfessionals);
  const goToConfirm = useKioskStore((s) => s.goToConfirm);
  const reset = useKioskStore((s) => s.reset);

  // Cross-sell
  const showCrossSell = useKioskStore((s) => s.showCrossSell);
  const crossSellService = useKioskStore((s) => s.crossSellService);
  const crossSellDiscount = useKioskStore((s) => s.crossSellDiscount);
  const showCrossSellModal = useKioskStore((s) => s.showCrossSellModal);
  const hideCrossSell = useKioskStore((s) => s.hideCrossSell);

  const [subStep, setSubStep] = useState<SubStep>("categories");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showPerServicePicker, setShowPerServicePicker] = useState(false);
  const [currentServiceIdx, setCurrentServiceIdx] = useState(0);

  const filteredServices = useMemo(
    () => MOCK_SERVICES.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, s) => sum + s.price_charmes, 0),
    [cart]
  );

  // All services have a professional assigned?
  const allAssigned = useMemo(
    () => cart.length > 0 && cart.every((s) => professionalsByService[s.id] != null),
    [cart, professionalsByService]
  );

  // -- Cross-sell logic -----------------------------------------------------

  function getCrossSellSuggestion(): KioskService | null {
    const cartIds = new Set(cart.map((s) => s.id));
    const candidates = MOCK_SERVICES.filter((s) => !cartIds.has(s.id));
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function handleAddToCart(service: KioskService) {
    addToCart(service);
  }

  // "Continuar" → cross-sell first, then professional
  function handleContinue() {
    const suggestion = getCrossSellSuggestion();
    if (suggestion) {
      showCrossSellModal(suggestion, 20);
    } else {
      setSubStep("professional");
    }
  }

  function handleCrossSellAdd() {
    if (crossSellService) addToCart(crossSellService);
    hideCrossSell();
    setSubStep("professional");
  }

  function handleCrossSellDecline() {
    hideCrossSell();
    setSubStep("professional");
  }

  function handleCrossSellAddMore() {
    hideCrossSell();
    setSubStep("categories");
  }

  function handleBackFromServices() {
    setSubStep("categories");
    setActiveCategory("");
  }

  // "Qualquer disponível" — assign all and go to confirm
  function handleSkipProfessional() {
    const anyProf: KioskProfessional = {
      id: "any", name: "Qualquer disponível", avatar_url: null, specialty: null,
    };
    assignAllProfessionals(anyProf);
    goToConfirm();
  }

  // -- Derived layout -------------------------------------------------------

  const title =
    subStep === "categories"
      ? "Escolha a Categoria"
      : subStep === "services"
      ? activeCategory
      : "Tem preferência de profissional?";

  const backAction =
    subStep === "categories"
      ? reset
      : subStep === "services"
      ? handleBackFromServices
      : () => {
          setShowPerServicePicker(false);
          setSubStep(cart.length > 0 ? "services" : "categories");
        };

  // No footer primary action — PerServicePicker has its own confirm button
  const primaryAction = undefined;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of MOCK_SERVICES) {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <ScreenLayout
      title={title}
      currentStep={1}
      totalSteps={4}
      stepLabels={STEP_LABELS}
      backAction={backAction}
      primaryAction={primaryAction}
    >
      <div className="flex flex-col h-full relative">

        {/* ---------------------------------------------------------------- */}
        {/* Cart badge — floating, positioned higher (top: -12px)            */}
        {/* ---------------------------------------------------------------- */}
        {cart.length > 0 && subStep !== "professional" && (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              setShowCartDrawer((v) => !v);
            }}
            className={[
              "absolute -top-3 right-0 z-30",
              "flex items-center gap-4",
              "glass-strong border-2 border-cta/40 rounded-[20px]",
              "px-7 min-h-[80px]",
              "active:scale-[0.96] transition-all duration-100",
              "shadow-lg",
            ].join(" ")}
          >
            <div className="relative">
              <Bag size={32} className="text-cta" weight="light" />
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-cta text-white text-[16px] font-bold font-body">
                {cart.length}
              </span>
            </div>
            <span className="text-[28px] font-bold font-body text-cta">
              {formatCharmes(cartTotal)}
            </span>
          </button>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Cart drawer overlay                                              */}
        {/* ---------------------------------------------------------------- */}
        <AnimatePresence>
          {showCartDrawer && (
            <motion.div
              className="absolute inset-0 z-40 flex flex-col"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="glass-strong rounded-[24px] p-6 flex flex-col gap-4 max-h-full overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[32px] text-brand-text">
                    Seu Carrinho
                  </h3>
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setShowCartDrawer(false);
                    }}
                    className="w-14 h-14 flex items-center justify-center rounded-full glass active:scale-[0.92] transition-all"
                  >
                    <X size={26} className="text-brand-text-muted" />
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4 border-b border-brand-border/30"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[26px] font-body font-semibold text-brand-text line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[22px] font-body text-cta font-bold">
                        {formatCharmes(item.price_charmes)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        removeFromCart(item.id);
                        if (cart.length <= 1) setShowCartDrawer(false);
                      }}
                      className="shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-red-50 active:scale-[0.90] transition-all"
                    >
                      <Trash size={22} className="text-red-500" weight="regular" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[28px] font-body font-bold text-brand-text">Total</span>
                  <span className="text-[30px] font-body font-bold text-cta">{formatCharmes(cartTotal)}</span>
                </div>

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setShowCartDrawer(false);
                    handleContinue();
                  }}
                  className="w-full flex items-center justify-center gap-3 min-h-[80px] rounded-[18px] bg-gradient-to-r from-primary to-primary-soft text-white font-body text-[28px] font-semibold glow-primary active:scale-[0.98] transition-all mt-2"
                >
                  Continuar
                  <CaretRight size={24} weight="bold" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------------------- */}
        {/* Sub-step content                                                 */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto scrollbar-branded pb-4 pt-[96px]">
          <AnimatePresence mode="wait">

            {/* ============================================================ */}
            {/* Sub 1: Category grid                                         */}
            {/* ============================================================ */}
            {subStep === "categories" && (
              <motion.div
                key="categories"
                className="flex flex-col gap-5"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="grid grid-cols-2 gap-5">
                  {CATEGORIES.map((cat) => (
                    <motion.div key={cat.name} variants={listItemVariants}>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setActiveCategory(cat.name);
                          setSubStep("services");
                        }}
                        className={[
                          "w-full flex flex-col items-center justify-center gap-4",
                          "min-h-[200px] rounded-[24px] p-6",
                          "glass card-elevated",
                          "active:scale-[0.96] transition-all duration-150",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cta",
                        ].join(" ")}
                        style={{ borderLeft: `5px solid ${cat.color}` }}
                      >
                        <cat.icon size={48} weight="light" style={{ color: cat.color }} />
                        <span className="text-[28px] font-display font-bold text-brand-text">
                          {cat.name}
                        </span>
                        <span className="text-[22px] font-body text-brand-text-muted">
                          {categoryCounts[cat.name] ?? 0} serviços
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* "Continuar" button on categories when cart has items */}
                {cart.length > 0 && (
                  <motion.div variants={listItemVariants} className="mt-2">
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        handleContinue();
                      }}
                      className="w-full flex items-center justify-center gap-3 min-h-[90px] rounded-[20px] bg-gradient-to-r from-primary to-primary-soft text-white font-body text-[30px] font-semibold glow-primary active:scale-[0.98] transition-all"
                    >
                      Continuar com {cart.length} {cart.length === 1 ? "serviço" : "serviços"}
                      <CaretRight size={26} weight="bold" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* Sub 2: Services list                                          */}
            {/* ============================================================ */}
            {subStep === "services" && (
              <motion.div
                key={`services-${activeCategory}`}
                className="flex flex-col gap-4"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); handleBackFromServices(); }}
                  className="flex items-center gap-2 text-[24px] font-body font-medium text-brand-text-muted mb-2 active:opacity-70 transition-opacity self-start"
                  variants={listItemVariants}
                >
                  <CaretLeft size={22} weight="bold" />
                  Todas as categorias
                </motion.button>

                {filteredServices.map((service) => (
                  <motion.div key={service.id} variants={listItemVariants}>
                    <ServiceCard
                      name={service.name}
                      category={service.category}
                      priceCharmes={service.price_charmes}
                      durationMinutes={service.duration_minutes}
                      imageUrl={service.image_url}
                      inCart={cart.some((s) => s.id === service.id)}
                      onAdd={() => handleAddToCart(service)}
                    />
                  </motion.div>
                ))}

                {cart.length > 0 && (
                  <motion.div variants={listItemVariants} className="mt-4 flex flex-col gap-4">
                    <button
                      type="button"
                      onPointerDown={(e) => { e.preventDefault(); handleContinue(); }}
                      className="w-full flex items-center justify-center gap-3 min-h-[90px] rounded-[20px] bg-gradient-to-r from-primary to-primary-soft text-white font-body text-[30px] font-semibold glow-primary active:scale-[0.98] transition-all"
                    >
                      Continuar
                      <CaretRight size={26} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onPointerDown={(e) => { e.preventDefault(); handleBackFromServices(); }}
                      className="w-full flex items-center justify-center gap-3 min-h-[80px] rounded-[20px] glass-strong border border-brand-border text-[26px] font-body font-medium text-brand-text active:scale-[0.98] transition-all"
                    >
                      <Bag size={22} weight="light" className="text-brand-text-muted" />
                      Adicionar mais serviços
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* Sub 3: Professional preference                                */}
            {/* ============================================================ */}
            {subStep === "professional" && (
              <motion.div
                key="professional"
                variants={profSectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-6"
              >
                {!showPerServicePicker ? (
                  <>
                    {/* Question prompt */}
                    <p className="text-[26px] font-body text-brand-text-muted text-center leading-snug">
                      Tem algum profissional de preferência para os seus serviços?
                    </p>

                    {/* "Qualquer disponível" — BIG gradient CTA */}
                    <button
                      type="button"
                      onPointerDown={(e) => { e.preventDefault(); handleSkipProfessional(); }}
                      className="w-full flex items-center justify-center gap-4 min-h-[120px] rounded-[22px] ring-1 ring-white/20 text-white font-body text-[32px] font-semibold tracking-wide glow-cta active:scale-[0.98] transition-all duration-150"
                      style={{ background: "linear-gradient(to right, #C2185B, #D94B8C)" }}
                    >
                      <Users size={32} weight="light" />
                      Qualquer disponível
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div aria-hidden="true" className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(217,75,140,0.3), transparent)" }} />
                      <span className="text-[24px] font-body text-brand-text-muted shrink-0">ou escolha por serviço</span>
                      <div aria-hidden="true" className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(217,75,140,0.3), transparent)" }} />
                    </div>

                    {/* "Escolher profissional" — secondary */}
                    <button
                      type="button"
                      onPointerDown={(e) => { e.preventDefault(); setCurrentServiceIdx(0); setShowPerServicePicker(true); }}
                      className="w-full flex items-center justify-center gap-3 min-h-[90px] rounded-[22px] glass-strong border border-brand-border text-[28px] font-body font-medium text-brand-text active:scale-[0.98] transition-all"
                    >
                      Escolher profissional
                      <CaretRight size={24} weight="bold" />
                    </button>
                  </>
                ) : (
                  /* Per-service professional picker — one at a time */
                  <PerServicePicker
                    cart={cart}
                    currentIdx={currentServiceIdx}
                    professionalsByService={professionalsByService}
                    professionals={MOCK_PROFESSIONALS}
                    onAssign={(serviceId, prof) => {
                      assignProfessional(serviceId, prof);
                      // Auto-advance to next service after selection
                      if (currentServiceIdx < cart.length - 1) {
                        setCurrentServiceIdx((i) => i + 1);
                      }
                    }}
                    onConfirm={goToConfirm}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cross-sell modal overlay */}
      {showCrossSell && crossSellService && (
        <CrossSellModal
          service={crossSellService}
          discount={crossSellDiscount}
          onAddToCart={handleCrossSellAdd}
          onDecline={handleCrossSellDecline}
          onAddMore={handleCrossSellAddMore}
        />
      )}
    </ScreenLayout>
  );
}

// ---------------------------------------------------------------------------
// PerServicePicker — step-by-step professional assignment with banner
// ---------------------------------------------------------------------------

interface PerServicePickerProps {
  cart: KioskService[];
  currentIdx: number;
  professionalsByService: Record<string, KioskProfessional>;
  professionals: KioskProfessional[];
  onAssign: (serviceId: string, prof: KioskProfessional) => void;
  onConfirm: () => void;
}

function PerServicePicker({
  cart,
  currentIdx,
  professionalsByService,
  professionals,
  onAssign,
  onConfirm,
}: PerServicePickerProps) {
  const service = cart[currentIdx];
  if (!service) return null;

  const assigned = professionalsByService[service.id];
  const allDone = cart.every((s) => professionalsByService[s.id] != null);
  const isLast = currentIdx === cart.length - 1;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress indicator */}
      <p className="text-[22px] font-body text-brand-text-muted text-center">
        Serviço {currentIdx + 1} de {cart.length}
      </p>

      {/* Service banner with photo overlay */}
      <div className="relative w-full rounded-[20px] overflow-hidden" style={{ height: 180 }}>
        {service.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, rgba(217,75,140,0.25), rgba(194,24,91,0.15))",
            }}
          />
        )}
        {/* Dark overlay + service name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
          <span className="text-white font-display text-[36px] font-bold leading-tight drop-shadow-lg">
            {service.name}
          </span>
        </div>
      </div>

      {/* Prompt */}
      <p className="text-[26px] font-body text-brand-text text-center leading-snug">
        Quem vai fazer esse serviço?
      </p>

      {/* Professional grid */}
      <div className="grid grid-cols-2 gap-4">
        {professionals.map((prof) => (
          <ProfessionalCard
            key={prof.id}
            name={prof.name}
            avatarUrl={prof.avatar_url}
            specialty={prof.specialty}
            selected={assigned?.id === prof.id}
            onSelect={() => onAssign(service.id, prof)}
          />
        ))}
      </div>

      {/* Confirm when all are assigned */}
      {allDone && isLast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-2"
        >
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); onConfirm(); }}
            className="w-full flex items-center justify-center gap-3 min-h-[100px] rounded-[22px] ring-1 ring-white/20 text-white font-body text-[32px] font-semibold tracking-wide glow-cta active:scale-[0.98] transition-all duration-150"
            style={{ background: "linear-gradient(to right, #C2185B, #D94B8C)" }}
          >
            Confirmar
            <CaretRight size={26} weight="bold" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
