# Gadol — Responsive Game Room Redesign (Layout C) + Full Turn Log

**Implementation brief for Antigravity**
Repo: `briansimelane/gadolNew` (branch `master`) — Vue 3 + Vite + Firebase + Materialize
Scope: `GameRoom.vue` and its child components, `main.css`, and a small Firestore schema addition. **No game-rule logic changes** — every buy/token/turn/win calculation stays byte-for-byte identical; this brief changes layout, responsiveness, and logging only.

---

## 1. Goal

Rebuild the game room as a **board-first, mobile-first layout**:

- Everything a player acts on fits on one phone screen with no horizontal scrolling: turn bar → contracts → temporary-resources market (with Acquire) → resource cards in colour pairs → the player's own team panel pinned at the bottom.
- Other teams live in a **swipe-up bottom sheet**.
- A **game log** opens as a slide-over panel and records **every action taken in a turn**, not just the last one.
- Card details stay in the existing zoom overlay — tapping any card opens it, exactly as now.
- Desktop gets the same components arranged with room to breathe (see §5.4) — one codebase, CSS-driven.

**Ordering decision (confirmed by Brian):** the temporary-resources market sits ABOVE the resource cards, directly under the contracts row.

---

## 2. Screen structure (mobile, top to bottom)

```
┌──────────────────────────────────────┐
│ ① Turn bar (sticky)                  │  "Team 1's turn — you"  [log icon]
├──────────────────────────────────────┤
│ ② Contracts row                      │  4 contract cards side by side,
│                                      │  horizontal swipe if they overflow
│ ③ Temp resources market              │  5 token counts + Acquire button
│                                      │  (inline bar, always visible)
│ ④ Resource cards — colour pairs      │  2-col grid: green pair, yellow pair,
│                                      │  red pair, purple pair, black pair
│    [Show upcoming ▾]                 │  collapsed row revealing card [2]
│                                      │  of each colour (dimmed)
├──────────────────────────────────────┤
│ ⑤ Your team panel (pinned, sticky    │  header in seat colour, cash/value
│    bottom above ⑥)                   │  headline + tokens/perms/prod line
├──────────────────────────────────────┤
│ ⑥ "Other teams (3)" handle           │  tap or swipe up → bottom sheet
└──────────────────────────────────────┘
```

Overlays (all rendered via the existing `#modals` teleport):
- **Bottom sheet** — other teams' panels, full detail per team.
- **Log slide-over** — full game log grouped by turn (§6).
- **Zoom overlay** — unchanged (existing `CardZoomOverlay.vue`).
- **Acquire modal** — unchanged logic; restyle to fit the new system (§4.3).
- **Game-end modals** — unchanged logic; restyle only.

---

## 3. Component changes

### 3.1 New components

**`components/TurnBar.vue`**
Props: `activePlayerName`, `isMyTurn`, `isFacilitator`, `isSpectator`. Emits `openLog`.
- Sticky (`position: sticky; top: 0; z-index: 20`).
- Text: `{name}'s turn`, with a "— you" suffix when `isMyTurn`. Facilitator/spectator badges replace the current right-aligned spans.
- Right side: a log icon button (Material icon `history`) emitting `openLog`.
- Background: the active seat's colour (see §5.2 seat palette) at its light tint, text in the dark shade of the same colour — this doubles as a whose-turn colour cue.

**`components/ResourcePairTile.vue`**
Props: `cards` (the 2 face-up cards of one colour), `color`, `interactive`. Emits `select(card)`.
- One tile per colour containing BOTH face-up cards side by side, separated by a thin divider, inside a container tinted with that colour's light shade and bordered with its strong shade. The container carries the colour identity, so the black pair finally reads clearly.
- Each half shows the card's Production value large plus a compact cost strip (reuse the existing badge markup from `ResourceCard.vue` at reduced scale, or Production number + "tap for costs" affordance). Tap → `select(card)` → existing zoom overlay shows full costs and the Buy button. **The zoom overlay remains the place where costs are fully readable and purchases happen.**
- If a colour has fewer than 2 cards left, render the empty half as a dashed placeholder.

**`components/TeamSheet.vue`** (bottom sheet)
Props: `players` (all displayed players except mine), `currentPlayer`. Uses existing `PlayerPanel` internally (restyled, §3.2).
- Collapsed state: a full-width handle bar at the very bottom: drag-pill + "Other teams (N)". `position: sticky; bottom: 0`.
- Expanded: slides up over the board (CSS `transform: translateY`, `transition: 0.25s ease-out`), max-height 75vh, internal scroll, scrim behind it (tap scrim to close). Toggle on tap; a basic touchstart/touchmove swipe handler is a nice-to-have, tap-toggle is the acceptance bar.
- Active team gets a subtle highlight ring.

**`components/GameLogPanel.vue`** (slide-over)
Props: `log` (array), `players` (for colour lookup). Emits `close`.
- Slides in from the right (mobile: full-width; desktop: 360px panel).
- Renders the log grouped by turn (§6.3), newest turn first.

**`components/OwnTeamBar.vue`**
Props: `player`, `isActive`.
- Sticky above the TeamSheet handle. Seat-coloured header strip: "Your team" + `Cash {n} · Value {n}` headline; second line `Tokens g·r·y·p·b · Perms g·r·y·p·b · Prod {n}`.
- Tapping it expands to the full `PlayerPanel` detail inline (simple v-if toggle).
- For the facilitator/spectator (no own seat), hide this bar entirely.

### 3.2 Modified components

- **`GameRoom.vue`** — becomes mostly composition: TurnBar, contracts strip, `TokenMarket`, the five `ResourcePairTile`s, upcoming-cards collapsible, `OwnTeamBar`, `TeamSheet`, `GameLogPanel`, plus the existing overlays. All computed properties and action functions stay; only template + a few new refs (`sheetOpen`, `logOpen`, `upcomingOpen`) change.
- **`TokenMarket.vue`** — restyle as a compact inline bar: five colour dots with counts on one row and the "Acquire resources" button on the right. Keep the `acquireClick` emit and turn-gating exactly as-is. It moves ABOVE the resource tiles.
- **`PlayerPanel.vue`** — keep all data rows; restyle to the card style in §5 (coloured header strip, tighter tables). The "Take this seat" affordance stays (it renders inside the TeamSheet for unjoined seats).
- **`ContractCard.vue` / `ResourceCard.vue` / `CardZoomOverlay.vue`** — visual polish only (radius, borders per §5); no prop or event changes.
- **`NavbarInRoom.vue`** — slim down on mobile: app name + seat identity + exit. Room-ID sharing moves into a small "share" icon that copies the ID (`navigator.clipboard`) with a toast, instead of printing the full ID sentence in the header.

### 3.3 Deleted layout

Remove the old `gameAreaLeft` / `gameAreaRight` two-column scaffold and the `onTableRow1/2/3` groupings from template and CSS. The colour-pair grid replaces them.

---

## 4. Behaviour rules (unchanged logic, new homes)

### 4.1 Turn gating
Identical: any card tap or Acquire tap when `!isMyTurn` → toast "You are not the active player". Facilitator bypasses. Apply the same gate to tiles.

### 4.2 Upcoming cards
The `[Show upcoming]` toggle reveals a dimmed, non-interactive row of each colour's index-[2] card (same slice the current app uses). Collapsed by default on mobile; expanded by default on desktop (`min-width: 900px`).

### 4.3 Acquire modal
Same logic (Get 2 / Get 1 rules, counter, per-colour lockout, cash checks, auto-close at 3 singles). Restyle: single-column colour rows (token image, market count, Get 2 btn, Get 1 btn per row) instead of the wide 5-column table — the current table is the worst mobile offender.

### 4.4 End-game modals
Same triggers via `modalPoints` / `modalContracts` watchers. Add the final scores of all displayed teams to the modal body (data is already in `players`), and show the last turn's log entries beneath — both are free wins.

---

## 5. Visual system

### 5.1 Principles
- Flat surfaces, no gradients or heavy shadows (one soft shadow allowed on the bottom sheet and slide-over so they read as elevated).
- Radius: 10px cards/tiles, 8px buttons, 999px pills.
- The dark-green felt background (`gameRoomBg`) may stay as the page backdrop, but all content sits on light card surfaces — no more white text on green except the page title.
- Type scale: 12px labels, 14px body, 16–18px headline numbers. Nothing below 11px.

### 5.2 Colour tokens (CSS variables in `main.css`)
Define once, use everywhere:

```css
:root {
  --g-green: #639922;  --g-green-bg: #EAF3DE;  --g-green-text: #27500A;
  --g-yellow: #BA7517; --g-yellow-bg: #FAEEDA; --g-yellow-text: #633806;
  --g-red: #E24B4A;    --g-red-bg: #FCEBEB;    --g-red-text: #791F1F;
  --g-purple: #534AB7; --g-purple-bg: #EEEDFE; --g-purple-text: #26215C;
  --g-black: #444441;  --g-black-bg: #F1EFE8;  --g-black-text: #2C2C2A;
  --seat1: var(--g-yellow); --seat2: var(--g-green);
  --seat3: #185FA5;         --seat4: #D85A30;   /* keep blue/orange seat identity */
}
```

Rule: coloured text always sits on the same family's `-bg` tint; never black-on-colour or white-on-light-tint.

### 5.3 Mobile-first CSS strategy
- Write all new styles mobile-first; enhance with `@media (min-width: 600px)` and `(min-width: 900px)`.
- Kill every fixed pixel width in the game-room styles. Grids: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px` for the resource pairs; contracts row: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;` with `scroll-snap-align: start` per card.
- The board column gets `padding-bottom` equal to OwnTeamBar + sheet-handle height so content never hides behind the sticky footer stack.
- Test target: 360px wide viewport with no horizontal scrollbar anywhere.

### 5.4 Desktop (≥900px)
Same components, two-region grid: board sections (contracts, market, pairs, upcoming) in a main column; `TeamSheet` content renders instead as a static right rail (the sheet CSS switches to `position: static` at this breakpoint — one component, two presentations); `GameLogPanel` still a slide-over; `OwnTeamBar` becomes the first card of the right rail.

---

## 6. Game log — record EVERY action in a turn

### 6.1 Why the current field fails
`lastAction` is a single string overwritten by every write, so a turn of three single tokens shows only the third. Replace the display with a real log while keeping `lastAction` written for backward compatibility (other views may read it).

### 6.2 Schema additions to `rooms/{roomId}`

```js
{
  turnNumber: 1,          // NEW — increments in nextPlayer()
  gameLog: [              // NEW — flat, append-only array of action entries
    {
      turn: 1,            // groups entries into turns
      seat: 1,            // acting seat (1-based)
      name: "Brian",      // acting player's display name at time of action
      type: "BUY_PERM" | "BUY_CONTRACT" | "TOKENS_2" | "TOKEN_1" | "TURN_END" | "SEAT_JOIN",
      text: "bought a Green permanent resource",   // human-readable, no name prefix
      detail: { colour: "green" },                 // small structured extras, optional
      ts: 1753500000000   // Date.now() — NOT serverTimestamp (not allowed inside arrays)
    }
  ],
  lastAction: "..."       // keep writing exactly as today
}
```

Create-game change (`Create.vue`): initialise `turnNumber: 1, gameLog: []` in `roomDetails`. For rooms created before this change, treat missing fields as `turnNumber: 1` / `[]` in all reads (`gameData.gameLog || []`) — no migration needed.

### 6.3 Writing entries — one per action, same updateDoc

Add a tiny helper in `GameRoom.vue`:

```js
const logEntry = (type, text, detail = {}) => ({
  turn: gameData.value.turnNumber || 1,
  seat: activePlayer.value.seat,
  name: activePlayer.value.joined ? activePlayer.value.name : `Seat ${activePlayer.value.seat}`,
  type, text, detail, ts: Date.now()
})
```

Then in each existing action, extend the **same single `updateDoc`** (never a second write) with:

```js
gameLog: [...(gameData.value.gameLog || []), logEntry(...)]
```

Per action:
- **BuyPermResource** → `logEntry('BUY_PERM', \`bought a ${card.Colour} permanent resource (+${card.Production} production)\`, { colour, ref: card.Ref })`. If temp tokens were spent, append the fact in the text: `", paying with X temp tokens"` where X = the sum of adjusts.
- **BuyContract** → `logEntry('BUY_CONTRACT', \`completed a contract worth ${card.Value}\`, { ref: card.Ref })`.
- **getTwoTokens** → `logEntry('TOKENS_2', \`bought 2 ${colour} tokens\`, { colour })`.
- **getOneToken** → `logEntry('TOKEN_1', \`bought 1 ${colour} token (${counter}/3)\`, { colour })` — **this is the key fix: each of the three singles becomes its own entry**, with the counter showing progression.
- **nextPlayer** (the non-win branch) → append `logEntry('TURN_END', 'ended their turn')` to the same updateDoc that advances `currentPlayer`, and set `turnNumber: (gameData.value.turnNumber || 1) + 1` in that write.
- **JoinPlayer** → `{ ...entry, type:'SEAT_JOIN', seat: seatNum, name: displayName, text: 'joined the game' }` (actor is the joiner, not the active player — build this one manually rather than via `logEntry`).

Notes:
- Use array-spread, not `arrayUnion` (spread keeps ordering guaranteed and works in the same object as the other field updates; entries are unique anyway via `ts`).
- **Cap the log at 300 entries**: before writing, `const trimmed = newLog.slice(-300)`. Firestore docs cap at 1 MiB and the room doc already carries all decks; 300 entries at ~120 bytes each is comfortably safe and far more history than a game produces.
- `lastAction` keeps its current strings untouched.

### 6.4 Rendering (GameLogPanel)

- Group entries by `turn`, newest turn first; within a turn, chronological order.
- Turn header: `Turn {n} — {name}` in the acting seat's colour.
- Entry rows: 12px, seat-coloured dot + text. `TURN_END` entries render as the turn's closing divider rather than a text row.
- A "Last turn" section (the most recent completed turn) also renders inline where the Last Action strip used to live is NOT needed — instead, the TurnBar's log icon shows a small badge when new entries arrived since the panel was last opened (compare lengths in a local ref).
- Empty state: "No actions yet — Team 1 to play."

---

## 7. Acceptance checklist

- [ ] 360px-wide viewport: full board (turn bar → contracts → market → pairs → own team → sheet handle) with zero horizontal scroll; contracts swipe with snap.
- [ ] Temp-resources market renders ABOVE the resource pairs and Acquire works with all existing rules (Get 2 vs singles lockouts, 3-single auto-advance, cash toasts).
- [ ] Colour pairs: five tiles, two cards each, black pair clearly legible; tapping a card opens the zoom overlay with full costs and a working Buy.
- [ ] Bottom sheet opens/closes (tap handle, tap scrim); shows every other team's full panel incl. "Take this seat" for empty seats; active team highlighted.
- [ ] Own-team bar always visible for seated players, expands to full detail; hidden for facilitator/spectator.
- [ ] A turn of 3 single tokens produces THREE log entries (1/3, 2/3, 3/3) plus a turn-end divider; buying with temp tokens logs the token spend; log groups by turn with seat colours.
- [ ] `turnNumber` increments exactly once per completed turn; win turns do not increment (game ends instead).
- [ ] Old rooms (no `gameLog`/`turnNumber`) open without errors and start logging from their next action.
- [ ] Desktop ≥900px: right rail replaces the bottom sheet; upcoming cards expanded by default; log slide-over 360px wide.
- [ ] Full playthrough of both rule sets in two browsers: every score, market count, and win trigger identical to current master (regression on §4 logic).
- [ ] End-game modal shows final scores of all teams.

---

## 8. Build order

1. CSS tokens (§5.2) + strip the old two-column layout; get the board sections stacking mobile-first with existing components.
2. `TurnBar`, restyled `TokenMarket` (moved above resources), `ResourcePairTile` + upcoming toggle.
3. `OwnTeamBar` + `TeamSheet` (tap-toggle first, swipe later) + desktop right-rail breakpoint.
4. Log schema: `Create.vue` init, `logEntry` helper, extend all five action updateDocs + `nextPlayer` + `JoinPlayer`, with the 300-entry cap.
5. `GameLogPanel` + TurnBar badge.
6. Restyle Acquire and end-game modals; add final scores to end modal.
7. Regression playthrough (both rule sets, two browsers, one phone).
