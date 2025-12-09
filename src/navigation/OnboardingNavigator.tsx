/**
 * OnboardingNavigator - Premium dark-themed onboarding
 * 
 * Design: "Dark Confidence"
 * - Deep blacks with gold accents
 * - Bold, confident typography
 * - Subtle card/chip motifs
 * - Smooth, understated animations
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  UserProfile,
  PlayerType,
  SkillLevel,
  GameType,
  WeakArea,
  TrainingStyle,
  Stakes,
  setUserProfile,
} from "../storage";

const { width } = Dimensions.get("window");

// Premium dark color palette
const COLORS = {
  bg: "#08090D",
  surface: "#12141A",
  surfaceLight: "#1A1D26",
  border: "#2A2D38",
  gold: "#D4A84B",
  goldDim: "rgba(212, 168, 75, 0.15)",
  blue: "#4A90D9",
  green: "#4ADE80",
  red: "#F87171",
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#6B7280",
};

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

// ============================================
// SCREEN 1: Impact Hook
// ============================================
const ImpactScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Pressable style={styles.screenDark} onPress={onNext}>
      <LinearGradient
        colors={["transparent", "rgba(212, 168, 75, 0.03)", "transparent"]}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.impactContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Decorative suit line */}
        <Text style={styles.suitLine}>♠ ♥ ♦ ♣</Text>
        
        <View style={styles.impactTextBlock}>
          <Text style={styles.impactSmall}>THE TRUTH IS</Text>
          <Text style={styles.impactLarge}>MOST PLAYERS</Text>
          <Text style={styles.impactLarge}>
            <Text style={styles.impactGold}>LOSE</Text> LONG-TERM
          </Text>
        </View>
        
        <View style={styles.impactDivider} />
        
        <Text style={styles.impactSubtext}>
          Not from bad luck.{"\n"}From lack of deliberate practice.
        </Text>
        
        <Text style={styles.tapContinue}>tap to continue</Text>
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// SCREEN 2: The Edge
// ============================================
const EdgeScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.screenDark}>
      <Animated.View style={[styles.edgeContainer, { opacity: fadeAnim }]}>
        <Text style={styles.edgeLabel}>THE EDGE</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statNumber}>12%</Text>
          <Text style={styles.statDesc}>of players are{"\n"}long-term winners</Text>
        </View>
        
        <View style={styles.statDividerHorizontal} />
        
        <View style={styles.statRow}>
          <Text style={styles.statNumber}>3-8×</Text>
          <Text style={styles.statDesc}>higher win-rate{"\n"}for trained players</Text>
        </View>
        
        <View style={styles.statDividerHorizontal} />
        
        <View style={styles.statRow}>
          <Text style={styles.statNumber}>20</Text>
          <Text style={styles.statDesc}>minutes daily{"\n"}to see improvement</Text>
        </View>

        <View style={styles.edgeQuoteBox}>
          <Text style={styles.edgeQuote}>
            "The people who study win.{"\n"}The people who improvise donate."
          </Text>
        </View>
      </Animated.View>
      
      <View style={styles.bottomCTA}>
        <Pressable style={styles.goldButton} onPress={onNext}>
          <Text style={styles.goldButtonText}>I'M READY TO TRAIN</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 3: Player Identity
// ============================================
const IdentityScreen: React.FC<{
  onNext: (type: PlayerType) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const options: { type: PlayerType; icon: string; title: string; desc: string }[] = [
    { type: "casual", icon: "♠", title: "RECREATIONAL", desc: "I play for fun, want to lose less" },
    { type: "improver", icon: "♥", title: "STUDENT", desc: "Building real, lasting skill" },
    { type: "competitive", icon: "♦", title: "GRINDER", desc: "I play to win, consistently" },
    { type: "serious", icon: "♣", title: "CRUSHER", desc: "High stakes is my goal" },
  ];

  return (
    <View style={styles.screenDark}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>WHO ARE YOU</Text>
        <Text style={styles.questionTitle}>
          AT THE <Text style={styles.goldText}>TABLE</Text>?
        </Text>
        
        <View style={styles.optionsList}>
          {options.map((opt) => (
            <Pressable
              key={opt.type}
              style={styles.optionRow}
              onPress={() => onNext(opt.type)}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionIconText}>{opt.icon}</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 4: Skill Level
// ============================================
const SkillScreen: React.FC<{
  onNext: (level: SkillLevel) => void;
  onBack: () => void;
  step: number;
}> = ({ onNext, onBack, step }) => {
  const levels: { level: SkillLevel; title: string; desc: string }[] = [
    { level: "beginner", title: "LEARNING", desc: "New to strategy" },
    { level: "intermediate", title: "DEVELOPING", desc: "Know the basics" },
    { level: "advanced", title: "SKILLED", desc: "Understand ranges & position" },
    { level: "semi_pro", title: "ADVANCED", desc: "Studied GTO concepts" },
  ];

  return (
    <View style={styles.screenDark}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <StepIndicator current={step} total={5} />
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>YOUR LEVEL</Text>
        <Text style={styles.questionTitle}>
          HOW <Text style={styles.goldText}>EXPERIENCED</Text>{"\n"}ARE YOU?
        </Text>
        
        <View style={styles.levelGrid}>
          {levels.map((lvl, idx) => (
            <Pressable
              key={lvl.level}
              style={styles.levelCard}
              onPress={() => onNext(lvl.level)}
            >
              <Text style={styles.levelNumber}>{idx + 1}</Text>
              <Text style={styles.levelTitle}>{lvl.title}</Text>
              <Text style={styles.levelDesc}>{lvl.desc}</Text>
            </Pressable>
          ))}
        </View>
        
        <Text style={styles.hintText}>You can adjust this later</Text>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 5: Game Format
// ============================================
const GameFormatScreen: React.FC<{
  onNext: (games: GameType[], stakes: Stakes) => void;
  onBack: () => void;
  step: number;
}> = ({ onNext, onBack, step }) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [stakes, setStakes] = useState<Stakes>("low");

  const gameOpts: { type: GameType; label: string }[] = [
    { type: "cash_online", label: "Online Cash" },
    { type: "cash_live", label: "Live Cash" },
    { type: "mtt", label: "Tournaments" },
    { type: "zoom", label: "Zoom/Fast" },
  ];

  const stakesOpts: { type: Stakes; label: string }[] = [
    { type: "micro", label: "Micro" },
    { type: "low", label: "Low" },
    { type: "mid", label: "Mid" },
    { type: "high", label: "High" },
  ];

  const toggleGame = (g: GameType) => {
    setGames((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);
  };

  return (
    <View style={styles.screenDark}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <StepIndicator current={step} total={5} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionLabel}>YOUR GAME</Text>
        <Text style={styles.questionTitle}>
          WHAT DO YOU <Text style={styles.goldText}>PLAY</Text>?
        </Text>
        
        <View style={styles.chipGroup}>
          {gameOpts.map((opt) => (
            <Pressable
              key={opt.type}
              style={[styles.chip, games.includes(opt.type) && styles.chipActive]}
              onPress={() => toggleGame(opt.type)}
            >
              <Text style={[styles.chipText, games.includes(opt.type) && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
        
        <Text style={[styles.questionLabel, { marginTop: 32 }]}>STAKES</Text>
        
        <View style={styles.stakesRow}>
          {stakesOpts.map((opt) => (
            <Pressable
              key={opt.type}
              style={[styles.stakePill, stakes === opt.type && styles.stakePillActive]}
              onPress={() => setStakes(opt.type)}
            >
              <Text style={[styles.stakeText, stakes === opt.type && styles.stakeTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.bottomCTA}>
        <Pressable
          style={[styles.goldButton, games.length === 0 && styles.buttonDisabled]}
          onPress={() => games.length > 0 && onNext(games, stakes)}
          disabled={games.length === 0}
        >
          <Text style={styles.goldButtonText}>CONTINUE</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 6: Weak Areas
// ============================================
const WeakAreasScreen: React.FC<{
  onNext: (areas: WeakArea[]) => void;
  onBack: () => void;
  step: number;
}> = ({ onNext, onBack, step }) => {
  const [selected, setSelected] = useState<WeakArea[]>([]);

  const areas: { type: WeakArea; label: string }[] = [
    { type: "preflop", label: "Preflop" },
    { type: "cbetting", label: "C-Betting" },
    { type: "bluffing", label: "Bluffing" },
    { type: "defending_bb", label: "BB Defense" },
    { type: "hand_reading", label: "Hand Reading" },
    { type: "river_play", label: "River Play" },
    { type: "confidence", label: "Tilt Control" },
  ];

  const toggle = (a: WeakArea) => {
    setSelected((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);
  };

  return (
    <View style={styles.screenDark}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <StepIndicator current={step} total={5} />
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>FOCUS AREAS</Text>
        <Text style={styles.questionTitle}>
          WHERE DO YOU <Text style={styles.goldText}>LEAK</Text>?
        </Text>
        
        <View style={styles.chipGroupWrap}>
          {areas.map((a) => (
            <Pressable
              key={a.type}
              style={[styles.chipLarge, selected.includes(a.type) && styles.chipActive]}
              onPress={() => toggle(a.type)}
            >
              <Text style={[styles.chipText, selected.includes(a.type) && styles.chipTextActive]}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
        
        <Text style={styles.hintText}>Select all that apply</Text>
      </View>
      
      <View style={styles.bottomCTA}>
        <Pressable
          style={[styles.goldButton, selected.length === 0 && styles.buttonDisabled]}
          onPress={() => selected.length > 0 && onNext(selected)}
          disabled={selected.length === 0}
        >
          <Text style={styles.goldButtonText}>CONTINUE</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 7: Session Style
// ============================================
const SessionScreen: React.FC<{
  onNext: (style: TrainingStyle, mins: number) => void;
  onBack: () => void;
  step: number;
}> = ({ onNext, onBack, step }) => {
  const options: { style: TrainingStyle; mins: number; title: string; time: string; desc: string }[] = [
    { style: "quick", mins: 5, title: "SPEED DRILL", time: "5 min", desc: "Quick reps, high volume" },
    { style: "focused", mins: 15, title: "FOCUSED SESSION", time: "15 min", desc: "Balanced practice" },
    { style: "deep", mins: 25, title: "DEEP WORK", time: "25 min", desc: "Thorough analysis" },
  ];

  return (
    <View style={styles.screenDark}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <StepIndicator current={step} total={5} />
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>SESSION LENGTH</Text>
        <Text style={styles.questionTitle}>
          HOW DO YOU <Text style={styles.goldText}>TRAIN</Text>?
        </Text>
        
        <View style={styles.sessionOptions}>
          {options.map((opt) => (
            <Pressable
              key={opt.style}
              style={styles.sessionCard}
              onPress={() => onNext(opt.style, opt.mins)}
            >
              <Text style={styles.sessionTime}>{opt.time}</Text>
              <Text style={styles.sessionTitle}>{opt.title}</Text>
              <Text style={styles.sessionDesc}>{opt.desc}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 8: Building Animation
// ============================================
const BuildingScreen: React.FC<{ onNext: () => void; profile: UserProfile }> = ({ onNext }) => {
  const [step, setStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const steps = [
    "Analyzing your profile",
    "Calibrating difficulty curve",
    "Loading solver data",
    "Building your training path",
  ];

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Step through loading
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onNext, 1000);
          return s;
        }
        return s + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screenDark}>
      <View style={styles.buildingContainer}>
        <Animated.View style={[styles.buildingOrb, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={[COLORS.gold, "#B8860B"]}
            style={styles.orbGradient}
          >
            <Text style={styles.orbIcon}>♠</Text>
          </LinearGradient>
        </Animated.View>
        
        <Text style={styles.buildingTitle}>BUILDING YOUR</Text>
        <Text style={styles.buildingTitleGold}>TRAINING ENGINE</Text>
        
        <View style={styles.stepsContainer}>
          {steps.map((s, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={[styles.stepDot, idx <= step && styles.stepDotActive]} />
              <Text style={[styles.stepText, idx <= step && styles.stepTextActive]}>
                {s}
              </Text>
              {idx <= step && <Text style={styles.stepCheck}>✓</Text>}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// ============================================
// SCREEN 9: Welcome
// ============================================
const WelcomeScreen: React.FC<{ onStart: () => void; profile: UserProfile }> = ({ onStart, profile }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const tagline = {
    casual: "Play smarter, lose less.",
    improver: "Your edge starts here.",
    competitive: "Time to grind with purpose.",
    serious: "Let's build something elite.",
  }[profile.playerType || "improver"];

  return (
    <View style={styles.screenDark}>
      <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.welcomeLogoBox}>
          <Text style={styles.welcomeLogo}>♠</Text>
        </View>
        
        <Text style={styles.welcomeLabel}>WELCOME TO</Text>
        <Text style={styles.welcomeTitle}>RANGELAB</Text>
        
        <Text style={styles.welcomeTagline}>{tagline}</Text>
        
        <View style={styles.welcomeStats}>
          <View style={styles.welcomeStat}>
            <Text style={styles.welcomeStatValue}>∞</Text>
            <Text style={styles.welcomeStatLabel}>Spots</Text>
          </View>
          <View style={styles.welcomeStatDivider} />
          <View style={styles.welcomeStat}>
            <Text style={styles.welcomeStatValue}>GTO</Text>
            <Text style={styles.welcomeStatLabel}>Solver-verified</Text>
          </View>
          <View style={styles.welcomeStatDivider} />
          <View style={styles.welcomeStat}>
            <Text style={styles.welcomeStatValue}>AI</Text>
            <Text style={styles.welcomeStatLabel}>Coaching</Text>
          </View>
        </View>
      </Animated.View>
      
      <View style={styles.bottomCTA}>
        <Pressable style={styles.goldButton} onPress={onStart}>
          <Text style={styles.goldButtonText}>START FIRST SPOT</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ============================================
// Step Indicator
// ============================================
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <View style={styles.stepIndicator}>
    {Array.from({ length: total }).map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.stepDotIndicator,
          idx < current && styles.stepDotIndicatorDone,
          idx === current && styles.stepDotIndicatorActive,
        ]}
      />
    ))}
  </View>
);

// ============================================
// MAIN NAVIGATOR
// ============================================
export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const [screen, setScreen] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({});

  const update = (data: Partial<UserProfile>) => {
    setProfile((p) => ({ ...p, ...data }));
  };

  const finish = async () => {
    await setUserProfile({ ...profile, onboardedAt: new Date().toISOString() });
    onComplete();
  };

  const getStep = () => Math.max(0, screen - 3);

  switch (screen) {
    case 0: return <ImpactScreen onNext={() => setScreen(1)} />;
    case 1: return <EdgeScreen onNext={() => setScreen(2)} />;
    case 2: return <IdentityScreen onNext={(t) => { update({ playerType: t }); setScreen(3); }} onBack={() => setScreen(1)} />;
    case 3: return <SkillScreen step={getStep()} onNext={(l) => { update({ skillLevel: l }); setScreen(4); }} onBack={() => setScreen(2)} />;
    case 4: return <GameFormatScreen step={getStep()} onNext={(g, s) => { update({ gameTypes: g, stakes: s }); setScreen(5); }} onBack={() => setScreen(3)} />;
    case 5: return <WeakAreasScreen step={getStep()} onNext={(a) => { update({ weakAreas: a }); setScreen(6); }} onBack={() => setScreen(4)} />;
    case 6: return <SessionScreen step={getStep()} onNext={(s, m) => { update({ trainingStyle: s, sessionLengthMinutes: m }); setScreen(7); }} onBack={() => setScreen(5)} />;
    case 7: return <BuildingScreen profile={profile} onNext={() => setScreen(8)} />;
    case 8: return <WelcomeScreen profile={profile} onStart={finish} />;
    default: return null;
  }
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Base
  screenDark: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  
  // Step indicator
  stepIndicator: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
  stepDotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  stepDotIndicatorDone: {
    backgroundColor: COLORS.gold,
  },
  stepDotIndicatorActive: {
    backgroundColor: COLORS.gold,
    width: 24,
  },
  
  // Impact screen
  impactContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  suitLine: {
    fontSize: 24,
    color: COLORS.textMuted,
    letterSpacing: 12,
    marginBottom: 40,
  },
  impactTextBlock: {
    alignItems: "center",
  },
  impactSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted,
    letterSpacing: 4,
    marginBottom: 12,
  },
  impactLarge: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 44,
  },
  impactGold: {
    color: COLORS.gold,
  },
  impactDivider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.gold,
    marginVertical: 32,
  },
  impactSubtext: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 26,
  },
  tapContinue: {
    position: "absolute",
    bottom: 40,
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  
  // Edge screen
  edgeContainer: {
    flex: 1,
    paddingTop: 60,
  },
  edgeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 32,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: "900",
    color: COLORS.textPrimary,
    width: 120,
  },
  statDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  statDividerHorizontal: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  edgeQuoteBox: {
    marginTop: 40,
    padding: 24,
    backgroundColor: COLORS.goldDim,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  edgeQuote: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontStyle: "italic",
    lineHeight: 26,
  },
  
  // Question screens
  questionContainer: {
    flex: 1,
    paddingTop: 8,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 8,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textPrimary,
    lineHeight: 36,
    marginBottom: 32,
  },
  goldText: {
    color: COLORS.gold,
  },
  hintText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 24,
  },
  
  // Option rows
  optionsList: {
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.goldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconText: {
    fontSize: 20,
    color: COLORS.gold,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionArrow: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  
  // Level grid
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  levelCard: {
    width: (width - 60) / 2,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.gold,
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  levelDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  
  // Chips
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chipGroupWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipLarge: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.gold,
  },
  
  // Stakes
  stakesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  stakePill: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stakePillActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold,
  },
  stakeText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  stakeTextActive: {
    color: COLORS.gold,
  },
  
  // Session options
  sessionOptions: {
    gap: 16,
  },
  sessionCard: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sessionTime: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.gold,
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  sessionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  
  // Building screen
  buildingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buildingOrb: {
    marginBottom: 40,
  },
  orbGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  orbIcon: {
    fontSize: 36,
    color: "#000",
  },
  buildingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 3,
  },
  buildingTitleGold: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 40,
  },
  stepsContainer: {
    gap: 16,
    alignSelf: "stretch",
    paddingHorizontal: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    backgroundColor: COLORS.gold,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textMuted,
  },
  stepTextActive: {
    color: COLORS.textPrimary,
  },
  stepCheck: {
    fontSize: 14,
    color: COLORS.green,
    fontWeight: "700",
  },
  
  // Welcome screen
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeLogoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  welcomeLogo: {
    fontSize: 40,
    color: "#000",
  },
  welcomeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted,
    letterSpacing: 3,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  welcomeTagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 48,
  },
  welcomeStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  welcomeStat: {
    alignItems: "center",
  },
  welcomeStatValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.gold,
  },
  welcomeStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  welcomeStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  
  // Bottom CTA
  bottomCTA: {
    paddingVertical: 24,
  },
  goldButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  goldButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 1.5,
  },
});
