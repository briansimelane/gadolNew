# Gadol (gadolNew) — Improvement Brief for Antigravity

**Repo:** `briansimelane/gadolNew` (Vue 3 + Firebase, Firestore doc-per-room in `rooms` collection)
**Author of brief:** Brian Simelane (prepared with Claude, July 2026)

## Purpose and scope

Gadol is a Splendor-style engine-building game (temporary tokens → permanent resource cards → contracts, race to 15 production). The current build works but has three structural problems this brief addresses:

1. **Responsiveness is hand-tuned per breakpoint.** Cards are fixed-pixel PNG backgrounds with absolutely-positioned numbers at hard-coded offsets, so every screen size requires a full re-tuned offset table. Only two media queries exist (≤420px and 421–1440px).
2. **No proper card zoom.** Players cannot comfortably inspect cards, especially on mobile.
3. **Massive duplication.** `GameRoom.vue` is 2,024 lines: 5 colours × card markets and 4 × player panels are each hand-written, and `nextPlayer()` copy-pastes ~40 ref assignments per player. This duplication has already produced at least one live bug (see Bugs section).

Additionally, upgrade **Firebase 8 (namespaced) → Firebase v11 (modular)**.

**Explicitly OUT of scope for this pass:**
- Moving game rules to Cloud Functions. All game logic (token acquisition, card/contract purchases, win checks) **stays client-side exactly as it behaves today**. Server-authoritative validation is a planned later phase — do not restructure the rules logic beyond what the refactors below require. Do, however, keep all mutation logic in composables (not components) so the later Cloud Functions migration is a lift-and-shift.
- Replacing Materialize CSS. Keep it for now; do not add a new UI framework.
- Do NOT use HTML canvas anywhere. This game is correctly a DOM/Vue application (Boardgamearena-style). All improvements below are DOM-based.

**Design references:** boardgamearena.com interaction patterns — scale-to-fit play area, overlay card zoom, compact player panels.

---

## Phase 1 — Build tooling + Firebase v11 migration

### 1.1 Migrate build from Vue CLI 4.5 to Vite

Firebase v9+ is ESM-first and pairs poorly with the webpack 4 inside `@vue/cli-service@4.5`. Migrate the project to **Vite** (latest, with `@vitejs/plugin-vue`):

- Replace `vue-cli-service serve/build` scripts with `vite` / `vite build`.
- Move `public/index.html` to project-root `index.html` per Vite convention (keep `public/` for static assets like `reset.json` and `favicon.ico`).
- Ensure `.browserslistrc` is dropped or ignored (Vite uses `build.target`).
- Update `firebase.json` hosting `public` directory to Vite's output (`dist` — verify it matches).
- Node 20 LTS as the assumed toolchain.

### 1.2 Upgrade dependencies

```
firebase: ^8.6.2  →  ^11.x (latest)
vue: ^3.0.0       →  ^3.5.x (latest 3.x)
vue-router: 4.0   →  ^4.4.x
materialize-css: keep as-is
```

### 1.3 Rewrite `src/firebase/config.js` (modular)

Current file uses `firebase/app` default import + side-effect imports. Replace with:

```js
import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = { /* keep existing values */ }

const app = initializeApp(firebaseConfig)
const projectFirestore = getFirestore(app)
const projectAuth = getAuth(app)
const timestamp = serverTimestamp   // note: modular equivalent of FieldValue.serverTimestamp

export { projectAuth, projectFirestore, timestamp }
```

### 1.4 Migrate every namespaced call site

Systematic mapping (apply across `src/composables/*`, `src/firebase/authscripts.js`, `src/main.js`, `src/views/*`):

| Firebase 8 (current) | Firebase 11 (target) |
|---|---|
| `projectFirestore.collection('rooms').doc(id)` | `doc(projectFirestore, 'rooms', id)` |
| `.get()` on a doc | `getDoc(docRef)` |
| `.onSnapshot(cb)` | `onSnapshot(docRef, cb)` — capture and call the returned unsubscribe in `onUnmounted` |
| `docRef.update({...})` | `updateDoc(docRef, {...})` — existing dot-path keys like `"joinedPlayers.Player1Joined"` still work unchanged |
| `.collection(x).add(data)` | `addDoc(collection(projectFirestore, x), data)` |
| `projectAuth.signInWithEmailAndPassword(e, p)` | `signInWithEmailAndPassword(projectAuth, e, p)` |
| `projectAuth.createUserWithEmailAndPassword` | `createUserWithEmailAndPassword(projectAuth, ...)` |
| `res.user.updateProfile({ displayName })` | `updateProfile(res.user, { displayName })` |
| `projectAuth.signOut()` | `signOut(projectAuth)` |
| `projectAuth.onAuthStateChanged(cb)` | `onAuthStateChanged(projectAuth, cb)` |
| `firebase.firestore.FieldValue.serverTimestamp` | `serverTimestamp` from `firebase/firestore` |

Key call sites to verify after migration:
- `GameRoom.vue` line ~759: `const dbConnectionGame = projectFirestore.collection('rooms').doc(props.id)` and the `onSnapshot` at ~827.
- `main.js` auth-gate boot pattern (`onAuthStateChanged` before mounting the app) — preserve the behaviour.
- All `dbConnectionGame.update({...})` calls (there are many; they become `updateDoc(dbConnectionGame, {...})`).

**Acceptance for Phase 1:** app builds and runs under Vite; login/signup/logout work; creating, joining, and playing a full game works identically to before; no `firebase/app` compat imports remain anywhere.

---

## Phase 2 — Scalable card system (the core responsiveness fix)

### 2.1 Principle: scale the card, never re-lay-out its contents

Cards keep their **single design size** (resource: 140×140, contract: 140×170) with all existing internal pixel offsets untouched. Responsiveness is achieved by scaling the whole card as a unit:

```css
.resource_card {
  width: 140px;
  height: 140px;
  transform: scale(var(--card-scale, 1));
  transform-origin: top left;
}
```

Because `transform` does not affect layout flow, each card must sit inside a holder that reserves the scaled footprint:

```css
.card-holder--resource {
  width: calc(140px * var(--card-scale, 1));
  height: calc(140px * var(--card-scale, 1));
}
.card-holder--contract {
  width: calc(140px * var(--card-scale, 1));
  height: calc(170px * var(--card-scale, 1));
}
```

`--card-scale` is set **once** on the game-area root, driven by viewport/container width. Suggested defaults:

| Viewport width | --card-scale |
|---|---|
| ≥ 1440px | 1 |
| 1024–1439px | 0.85 |
| 700–1023px | 0.7 |
| < 700px | 0.55 (floor at ~0.5; below that, rely on zoom) |

Prefer computing this with a small composable (`useCardScale`) using a `ResizeObserver` on the game-area container rather than media queries, so the play area also behaves inside split-screen and embedded contexts. A media-query fallback is acceptable if simpler.

### 2.2 Delete the per-breakpoint offset tables

Once 2.1 is in place, remove from `src/styles/main.css`:
- The entire ≤420px re-declarations of `.contract_card`, `.contract_details`, `.contractValue/Cash/Debtors`, `.redValue/greenValue/yellowValue/purpleValue/blackValue`, `.productValue`, `.resource_card`, `.card_details`, `.productsValue`, `.redCost/greenCost/yellowCost/purpleCost/blackCost`.
- The duplicated `card_details_modal` / `contract_details_modal` offset sets (the zoom overlay in Phase 3 reuses the standard card at a larger scale).

The two grid-layout media queries (`.gameArea` / `.gameAreaLeft` re-arrangements) **stay** — rearranging regions per breakpoint is correct; re-tuning card internals is what gets deleted.

### 2.3 Extract card components

Create `src/components/cards/`:

**`ResourceCard.vue`** — props:
- `card: Object` (fields: `Production, CostRed, CostGreen, CostYellow, CostPurple, CostBlack, Ref`)
- `color: String` (`'red' | 'green' | 'yellow' | 'purple' | 'black'`) → applies the existing `redResource`…`blackResource` background classes
- `interactive: Boolean` (default true) → controls cursor + click emission
- `dimmed: Boolean` (default false) → replaces the current `greyOut` usage for upcoming cards
- emits `select(card)` on click

**`ContractCard.vue`** — props: `card` (fields: `Value, Cash, Debtors, Production, CostRed…CostBlack, Ref`), `interactive`, emits `select(card)`.

Move the card-internal CSS (offsets, fonts, backgrounds) into these components as scoped styles. `GameRoom.vue`'s ten hand-written card blocks collapse to loops like:

```html
<ResourceCard
  v-for="card in gameData.z01greenCards.slice(0, 2)"
  :key="card.Ref"
  :card="card" color="green"
  @select="onResourceSelect" />
```

Where `onResourceSelect` centralises the current active-player check (active player or facilitator → `handleResourceCard`; otherwise → `NotActivePlayer()` toast), replacing the repeated conditional `v-on` object expressions.

**Also extract:** `PlayerPanel.vue` (one instance per player, props: `player`, `scores`, `seatLabel`, `isActive`, `joinable`, emits `takeSeat`) and `TokenMarket.vue` (the temporary resources market table + acquire button). The four hand-written `scoreP1…scoreP4` blocks become a single `v-for`.

---

## Phase 3 — Card zoom overlay (BGA-style)

Create `src/components/cards/CardZoomOverlay.vue`, mounted once at the `GameRoom` level (or via the existing `#modals` teleport target):

- A module-level/shared `ref` (e.g. `useCardZoom()` composable exposing `zoomedCard`, `zoomType`, `openZoom(card, type)`, `closeZoom()`).
- When set, render a fixed-position, centred backdrop (`rgba(0,0,0,.6)`) with the **same `ResourceCard` / `ContractCard` component** rendered at `--card-scale: 2.2` (clamp so the card never exceeds ~85% of the smaller viewport dimension), `interactive: false`.
- The overlay also shows the action button when applicable (reuse the existing affordability logic: `contractAfford` / `resourceAfford` and `BuyContract()` / `BuyPermResource()` — behaviour unchanged, just re-housed).

**Interaction model:**
- **Desktop:** clicking a card opens the zoom overlay (this replaces the current `ModalPermResources` / `ModalContracts` custom modals, which can be retired along with their duplicated modal offset CSS). Optional nice-to-have: hover after a 400ms delay shows a passive zoom preview (no buttons); moving off dismisses it.
- **Mobile/touch:** tap opens the overlay; tap on backdrop or a visible ✕ closes it. No hover behaviour.
- Close on `Esc`. Trap focus while open. Respect `prefers-reduced-motion` (no scale-in animation when set).

Keep the rules text currently shown in the modals (the bullet explanations of contract/resource rules) as a collapsible "How this works" section inside the overlay.

---

## Phase 4 — Data model and state cleanup

### 4.1 Players as an array

Restructure the room document from flat fields to an array, updating `public/reset.json` / `src/assets/reset.json`, `Create.vue` (room creation), `Join.vue`, and `GameRoom.vue` accordingly:

```js
// FROM
joinedPlayers: { Player1Joined, Player1Name, Player1Online, Player1UserID, ...Player4 }
z12Player1Scores: {...}, z13Player2Scores: {...}, z14Player3Scores: {...}, z15Player4Scores: {...}

// TO
players: [
  { seat: 1, joined: false, name: '', online: false, uid: '',
    scores: { greenTemp, redTemp, yellowTemp, purpleTemp, blackTemp,
              greenPerm, redPerm, yellowPerm, purplePerm, blackPerm,
              cash, costs, debtors, production, value,
              TempTokensTakenCounter, greenTokenTaken, redTokenTaken,
              yellowTokenTaken, purpleTokenTaken, blackTokenTaken } },
  // seats 2–4
],
activeSeatIndex: 0
```

Notes:
- Firestore cannot dot-path-update inside array elements; mutations should read the `players` array from the already-subscribed local `gameData`, modify the copy, and `updateDoc(dbConnectionGame, { players })`. This is acceptable for the current client-side-rules phase (single active player at a time limits contention) and will move server-side later anyway.
- `numPlayers` continues to control how many seats render (`players.slice(0, numPlayers)`).
- One-time compatibility: old in-flight rooms will not match the new shape. Acceptable — new games only; no migration script needed. Bump a `schemaVersion: 2` field on the room doc so the client can refuse to load v1 rooms gracefully.

### 4.2 Replace the Label*/Value* ref machinery

Delete the ~40 `LabelplayerX` / `ValueplayerX` refs and the giant per-player assignment blocks in `nextPlayer()` (currently ~1,000 lines of the file). Replace with computeds:

```js
const activePlayer = computed(() => gameData.value.players[gameData.value.activeSeatIndex])
const isMyTurn = computed(() =>
  user.value.uid === activePlayer.value.uid || user.value.uid === gameData.value.facilitator)
```

`nextPlayer()` reduces to advancing `activeSeatIndex` (mod `numPlayers`), resetting the token-taken counters on the player whose turn is ending, and running the existing end-of-game checks. The `setTimeout(..., 60)` wrapper inside `nextPlayer()` exists to wait for refs to repopulate — with computeds it is unnecessary; remove it.

All templates that read `ValueplayerCash` etc. switch to `activePlayer.scores.cash`; token-modal disables switch to `activePlayer.scores.TempTokensTakenCounter` etc.

### 4.3 Housekeeping

- Delete the ~200 lines of commented-out imperative DOM code in `src/composables/gameSetup.js` (the old `document.createElement` card builders). Keep `shuffle()` and the live setup logic.
- Remove `import '../src/assets/reset.json'` from `main.js` (side-effect import of JSON does nothing useful under Vite).
- Consolidate: `getRoomData.js` does a one-shot `get` while `GameRoom.vue` separately opens its own `onSnapshot` — fold both into one `useRoom(id)` composable that returns the live `gameData` ref and the doc reference, with unsubscribe on unmount.

---

## Bugs to fix (independent of refactors — fix even if a phase slips)

1. **Player 4 token counters read/write Player 3's scores.** `GameRoom.vue`, Player 4 branch of `nextPlayer()` (approx. lines 1887–1892 and 1911–1916): `LabelTempTokensTakenCounter`, `Label/Value greenTokenTaken`, `redTokenTaken`, `yellowTokenTaken`, `purpleTokenTaken`, `blackTokenTaken` all reference `z14Player3Scores` instead of `z15Player4Scores`. In a 4-player game, Player 4's token-taking state corrupts Player 3's. (The Phase 4 refactor eliminates this class of bug entirely; if refactoring immediately, just verify the new code path with a 4-player test.)
2. **Every card `v-for` has a broken `:key`.** e.g. `:key="gameData.z01greenCards.index"` — `.index` on an array is `undefined`, so all keys are `undefined`. Use the card's `Ref` field: `:key="card.Ref"`. Apply to all ten card loops. (Correct keys are also a prerequisite for adding `<TransitionGroup>` deal/replace animations later.)
3. **Spectator check hardcodes four UID comparisons** in the notifications bar; after Phase 4 this becomes `!players.some(p => p.uid === user.uid) && user.uid !== facilitator`.

---

## Testing / acceptance checklist

Run a full 4-player game (facilitator + 4 accounts) after each phase:

- [ ] Create room → join all seats → play tokens/cards/contracts → reach a win condition, under Firebase v11 / Vite.
- [ ] Cards render pixel-correct (numbers aligned to card art) at 1920, 1440, 1024, 768, and 390px widths with **no per-size offset CSS** — only `--card-scale` changes.
- [ ] Tap/click any market card on mobile → zoom overlay opens, card is large and legible, purchase button appears only when affordable and it's your turn; Esc/backdrop closes.
- [ ] Player 4 takes tokens in a 4-player game → Player 3's counters are untouched (regression test for Bug 1).
- [ ] No Vue key warnings in console; no Firebase compat imports; `npm run build` clean.
- [ ] Turn passing works with no `setTimeout` delays; spectator and facilitator views behave as before.
- [ ] Game rules behaviour is byte-for-byte the same as production today (client-side rules retained by design).

## Later phases (recorded for context, do not build now)

- Cloud Functions server-authoritative move validation + tightened `firestore.rules` (currently rules are permissive by design of this phase).
- `<TransitionGroup>` card-deal animations (enabled by the `:key` fix).
- Materialize CSS retirement.
- Full BGA-style scale-to-fit of the entire play area (design-resolution + single root transform) if per-card scaling proves insufficient on unusual aspect ratios.
