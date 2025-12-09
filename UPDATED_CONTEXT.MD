Absolutely — here is the **fully updated and corrected `UPDATED_CONTEXT.md`** reflecting the **final agreed JSON structure**, including:

* Player position in every action
* `sizingRef` logic preserved
* `exactAmount` present when needed
* Street markers included
* Display and animation logic updated accordingly

You can **copy-paste this directly** into your frontend repo and tell Cursor to adopt it.

---

```md
# 🎮 Frontend Context — Poker Spot Rendering & Action Format (FINAL SPEC)

This document defines how the frontend must interpret, render, animate, and display poker training spots.

This format is **finalized**, solver-compatible, and will not be changed without a formal version bump.

---

## 🛑 BREAKING CHANGE: History & Option Format Updated

Actions in the spot data now follow this structure:

```

[position, actionCode, sizingRef?, exactAmount?]

```

Examples:

```

["BB", "x"]                        → BB checks
["BTN", "f"]                      → BTN folds
["BTN", "c", null, 4.7]           → BTN calls 4.7bb
["BTN", "b", 33, 5.94]            → BTN bets 33% pot (5.94bb)
["BTN", "b", "pot", 18.22]        → pot-sized bet
["BB", "r", "3x", 22.5]           → raise 3x to 22.5bb
["BTN", "a", "AI", 82.1]          → all-in jam
["-", "f"]                        → street marker: flop

```

This format provides both:

- **intent** (sizingRef)
- **execution value** (exactAmount)

The frontend must treat both values as meaningful.

---

## 📌 Interpretation Rules

| Field | Meaning |
|-------|--------|
| `position` | Actor ("BTN", "SB", "BB", "CO", "HJ", etc.) |
| `actionCode` | `"x"`, `"f"`, `"c"`, `"b"`, `"r"`, `"a"` |
| `sizingRef` | Percentage, `"pot"`, `"3x"`, `"AI"`, or `null` |
| `exactAmount` | The real chip amount deducted when action occurs |

Frontend **must not modify** the stored values.

---

## 🎨 Display Rules

Frontend shows **rounded bet amounts** to the nearest **0.5bb**.

| exactAmount | rounded UI |
|-------------|------------|
| 5.94        | 6bb        |
| 7.21        | 7bb        |
| 4.49        | 4.5bb      |

UI Label Format:

```

"{sizingRef label} ({roundedAmount}bb)"

```

Examples:

| Raw JSON | UI Label |
|----------|----------|
| `["BTN","b",33,5.94]` | `Bet 33% (6bb)` |
| `["BTN","b","pot",18.22]` | `Pot Bet (18bb)` |
| `["BTN","a","AI",82.1]` | `All-In (82bb)` |
| `["BTN","c",null,4.7]` | `Call (4.5bb)` |

If no sizingRef applies (checks/folds), display a simple label:

```

Check
Fold

```

---

## 🎬 Animation Rules

Animation must use:

| Purpose | Value Used |
|---------|------------|
| Visual chip movement | **roundedAmount** |
| Pot logic & game simulation | **exactAmount** |

Example:

```

Pot = 18bb
Action = ["BTN","b",33,5.94]
Rounded visually = 6bb

```

Animation Steps:

1. Animate **6bb** chips sliding to center
2. Update visual pot display to ~ **24bb**
3. Internal state uses `5.94` for math accuracy

---

## 🧮 Derived State Behavior

The frontend is responsible for computing:

- pot after each action  
- hero remaining stack  
- villain remaining stack  

The JSON does **not** store running pot or stack snapshots.

Use:

```

initialStack
initialPot
hist[]

````

to derive state deterministically.

---

## 🗂 Component Expectations

| Component | Responsibility |
|----------|----------------|
| `<PokerTable />` | Shows updated pot + stacks based on hist |
| `<ActionBar />` | Displays actions using rounded formatting rules |
| `<ChipAnimator />` | Animates chip movement using rounded values |
| `<ReplayTimeline />` (future) | Step-based hand playback |

---

## 🚫 Non-Negotiable Rules

- ❌ Do **NOT** mutate spot JSON
- ❌ Do **NOT** replace exact values with rounded ones
- ❌ Do **NOT** infer missing values
- ❌ Do **NOT** reorder actions

- ✅ The frontend must treat the JSON as **immutable truth**

---

## 🧪 Required Utility

Add (or maintain) this helper:

```ts
export const roundToNearestHalf = (n: number) => Math.round(n * 2) / 2;
````

All rounding must use this rule.

---

## 🔧 Example Interpretation

Raw JSON:

```
["BTN","b",33,5.9371875]
```

Frontend:

* Internal math → `5.9371875`
* Display → `"Bet 33% (6bb)"`
* Animation → move 6bb visual chips

---

## 🏷 Format Version

```
spot_format_version = 1
```

Add only when future format changes occur.

---

## Summary

✔ exact values stored
✔ rounding applied only in UI
✔ animation follows rounded logic
✔ solver-grade format preserved
✔ deterministic replay supported

This ensures the app feels polished and intuitive while remaining mathematically exact and solver-compatible.

---

```

-
```
