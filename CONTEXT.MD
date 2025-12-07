# 🃏 Poker Training App — Context & Architecture

This document defines the product vision, UX goals, technical decisions, and implementation rules for the Poker Training mobile app.  
Cursor must treat this as the authoritative reference when generating, modifying, or structuring UI code.

---

## 🎯 Product Vision

Create a mobile-first, premium poker training experience where users:

- Watch a hand replay street-by-street
- Reach a key decision node
- Choose an action (check, bet, fold, etc.)
- Receive feedback and optional AI explanation

The app should feel more like a polished poker client + coaching environment than a "utility tool."

Think:  
**PokerBaazi UI polish + DTO/Odin drills + Duolingo learning flow.**

---

## 🧘 UX Philosophy

The experience should be:

- Smooth  
- Aesthetic  
- Casino-inspired  
- Low friction  
- Rewarding  

Tone: confident and helpful — not robotic.

Animations and pacing matter. The UI should feel alive.

---

## 🧬 Core User Loop

1. Tap **Start Training**
2. A spot loads from stored spot JSON
3. Replay animation shows how the hand reached the decision
4. Decision UI unlocks
5. User selects action
6. Immediate evaluation (correct / mix / mistake)
7. User may request further explanation (future AI layer)
8. Option to replay or move to next spot

---

## 🧩 Technical Stack

- Expo + React Native  
- TypeScript  
- Tailwind (via NativeWind)  
- React Navigation (native-stack)  
- expo-linear-gradient  
- **react-native-reanimated** (preferred) or Moti for animations

All code must be modular, typed, and scalable.

---

## 🎨 Design Language

Visual aesthetic:

- Dark poker environment  
- Purple felt table (PokerBaazi style)
- Vertical ellipse table shape for mobile
- Soft neon accent lighting  
- Subtle glow edges  
- Smooth motion  
- Crisp card assets  
- Rounded buttons with strong affordance  

The UI should feel premium — not default React Native styling.

---

## 🃏 Table Rendering Strategy

- Use **CSS gradient** for poker table (swappable to PNG later)
- Vertical ellipse shape optimized for mobile portrait
- Place interactive elements using **percentage-based absolute positioning**
- 6-max seat layout with hero at bottom

This ensures visual consistency across device sizes.

---

## 📁 Project File Structure

```
src/
  navigation/
    RootNavigator.tsx

  screens/
    HomeScreen.tsx
    SpotScreen.tsx
    AnimatedDrillScreen.tsx
    SpotsScreen.tsx
    StatsScreen.tsx

  components/
    PokerTable.tsx
    Seat.tsx
    BoardCards.tsx
    HeroHand.tsx
    Card.tsx
    PotDisplay.tsx
    ActionBar.tsx
    DealerButton.tsx
    TableFelt.tsx
    TabBarIcon.tsx

  types/
    spot.ts

  utils/
    SpotParser.ts
    cardUtils.ts

  data/
    spots.json

  theme/
    colors.ts
```

Root files:

- `App.tsx`
- `tailwind.config.js`
- `CONTEXT.md`

---

## 📱 Screens

### `HomeScreen`
- Clean minimal start screen
- Main CTA: **Start Training**
- Later: streak, XP, last score, difficulty tag

### `SpotScreen`
- Debug/static view of a spot
- Used before full animation flow is ready

### `AnimatedDrillScreen` (Core)
- Loads a spot
- Plays step-based replay animation
- Unlocks decision UI
- Displays feedback
- Supports replay/reset

### `SpotsScreen`
- Spot pack library
- Browse training categories

### `StatsScreen`
- User progress and stats
- Accuracy, streaks, insights

---

## 🧱 Components (High-Level Behavior)

| Component | Role |
|----------|------|
| `PokerTable` | Renders table, provides overlay coordinate system |
| `Seat` | Avatar, name, stack, card backs, status tag |
| `BoardCards` | Renders 3–5 community cards |
| `HeroHand` | Renders hero's two face-up cards |
| `Card` | Single card with rank/suit display |
| `PotDisplay` | Chip icon + pot amount |
| `ActionBar` | Decision buttons (Check, Bet sizes, Fold, etc.) |
| `DealerButton` | Red "D" dealer button |
| `TableFelt` | CSS gradient table background |

All UI must support animated entry and active/disabled states.

---

## 🎬 Replay System

Phases:

```
idle → preflop → flop → turn → river → decision → result
```

During replay:

- Buttons are disabled
- Chip and card animations run sequentially based on timeline
- Text bubbles may appear to show actions

State transitions must use reanimated.

---

## 🗂 Spot Data Format (Final Compact JSON)

### Example Spot

```json
{
  "id": "s001",
  "st": 100,
  "fmt": "6m",
  "str": "t",
  "hero": { "pos": "SB", "hand": ["Ah", "Jd"] },
  "v": ["BB"],
  "brd": ["Ks", "7c", "2d", "Jh"],
  "pot": 18,
  "hist": [
    ["CO", "r", 2.3],
    ["BTN", "c"],
    ["SB", "c"],
    ["BB", "c"],
    ["-", "f"],
    ["BB", "x"],
    ["CO", "b", 6],
    ["BTN", "f"],
    ["SB", "c"],
    ["BB", "c"],
    ["-", "t"],
    ["BB", "x"]
  ],
  "opts": [
    ["x"],
    ["b", 33],
    ["b", 75]
  ],
  "sol": {
    "b": 1,
    "ev": [-0.2, 1.1, -0.4]
  }
}
```

### Field Reference

| Key | Type | Meaning | Example |
|-----|------|---------|---------|
| `id` | string | Unique spot ID | `"s001"` |
| `st` | number | Effective stack (BB) | `100` |
| `fmt` | string | Format: `6m` / `9m` / `hu` | `"6m"` |
| `str` | string | Street: `p` / `f` / `t` / `r` | `"t"` |
| `hero` | object | Hero position + hole cards | `{ "pos": "SB", "hand": ["Ah","Jd"] }` |
| `v` | array | Villain(s) still in hand | `["BB"]` or `["BB","CO"]` |
| `brd` | array | Board cards (0-5) | `["Ks","7c","2d","Jh"]` |
| `pot` | number | Pot size at decision (BB) | `18` |
| `hist` | array | Action timeline | See below |
| `opts` | array | Available actions for hero | See below |
| `sol` | object | Solver answer | `{ "b": 1, "ev": [...] }` |

### Action Encoding

**In `hist` (what happened):**

| Code | Meaning | Example |
|------|---------|---------|
| `r` | Raise | `["CO", "r", 2.3]` — raise to 2.3bb |
| `c` | Call | `["BTN", "c"]` |
| `x` | Check | `["BB", "x"]` |
| `b` | Bet | `["CO", "b", 6]` — bet 6bb |
| `f` | Fold | `["BTN", "f"]` |
| `a` | All-in | `["SB", "a"]` |
| `-` | Street marker | `["-", "f"]` — flop dealt |

**Street markers:**

| Code | Street |
|------|--------|
| `p` | Preflop |
| `f` | Flop |
| `t` | Turn |
| `r` | River |

**In `opts` (hero's choices):**

| Format | Meaning |
|--------|---------|
| `["x"]` | Check |
| `["c"]` | Call |
| `["c", 8.5]` | Call 8.5bb |
| `["b", 33]` | Bet 33% pot |
| `["b", 75]` | Bet 75% pot |
| `["r", 3]` | Raise 3x |
| `["a"]` | All-in |
| `["f"]` | Fold |

### Solution Format

```json
"sol": {
  "b": 1,
  "ev": [-0.2, 1.1, -0.4]
}
```

- `sol.b` = index of best action in `opts` (0-indexed)
- `sol.ev` = EV for each opt in same order

### Deriving Player Stacks

Parser walks `hist` to calculate:
1. Start all players at `st`
2. Subtract contributions from actions
3. Mark folded players
4. Output current stack per seat

---

## 🧪 Interaction Rules

- Buttons disabled during replay
- Unlock via animation when decision state reached
- Immediate feedback appears after selection
- Explanation button optional (future AI feature)
- Replay and Next always visible post-decision

---

## 🧱 Engineering Rules

- Use TypeScript everywhere
- Avoid deeply nested components — prefer small composable pieces
- Prefer inline styles (NativeWind plugin currently disabled)
- No magic pixel values — use relative or theme scale
- Components must be reusable and animation-safe

---

## 🏁 Definition of "UI MVP Complete"

- User can start a drill
- Spot loads from JSON
- Replay animates streets in correct order
- Action bar unlocks at decision point
- User can choose an action
- UI shows evaluation marker
- User can replay or move to next spot
- No AI integration required

---

## 🚧 Future Integration Notes (Not for current build)

- Spot database stored locally or remote
- Spot selection engine (random, difficulty-based, adaptive)
- AI coaching agent reads spot JSON + user action and returns explanation
- Cloud syncing of accuracy, streaks, leaderboard, etc.

---

## 📌 Cursor Rule

> If generating code or modifying structure, follow the vision and constraints in this document.  
> If uncertain, prefer simplicity, modularity, and visual polish.

---
