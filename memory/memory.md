# Memory / Changelog

Running log of changes to the Crypto Trading Micro-Learning course, per the workflow rules in `CLAUDE.md`.

Note: `CLAUDE.md` referenced a prior `v1.35.1` bug-fix entry, but this file was found empty at the
start of this session (2026-07-18) — no earlier history survived. Versioning restarts here at
v1.36.0 and this file is now the source of truth going forward.

## v1.36.0 — 2026-07-18 — Roadmap rescan: content expansion + bug fixes

**Roadmap item implemented:** "Add more details to the existing modules and add new modules where
you deem necessary."

### New modules added (61 → 67 total, still 9 tracks)

- **Foundations & Spot Trading:** "Dollar-cost averaging (DCA)" — a beginner accumulation concept
  that was a clear gap next to the existing lump-sum/timing content.
- **Technical Analysis:** "Bollinger Bands & volatility" — the course had momentum (RSI, MACD) and
  trend (MAs) indicators but no volatility indicator.
- **Futures & Leverage:** "Hedging with derivatives" — covers using a short perp to offset spot risk
  without selling, a natural advanced-level companion to the existing long/short and sizing modules.
- **Advanced Charting & Market Structure:** "Volume profile & point of control" — institutional-style
  volume-by-price concept (POC, HVN/LVN) that complements the existing liquidity/order-block module.
- **Strategies & Playbooks:** "Playbook 4 — DCA & accumulation" — a non-technical-analysis playbook
  tying the new DCA foundations module into a concrete, rule-based approach.
- **Crypto Market Structure & Sentiment:** "The Fear & Greed Index & social sentiment" — sentiment
  gauge distinct from the existing funding-rate/OI positioning content.

Each new module follows the existing format (concept, worked example, exercise, quiz) and carries an
explicit `lvl` (Beginner/Intermediate/Advanced) exactly like every other module.

Added matching glossary terms: Dollar-cost averaging (DCA), Bollinger Bands, Hedging, Volume profile
/ POC, Fear & Greed Index.

### Bugs found and fixed

1. **Stale hardcoded counts.** The banner ("📚 4 tracks · 🔗 33 video-link + reading modules") and
   footer ("4 tracks · 33 modules") were left over from an earlier version of the course and no
   longer matched the actual 9-track/61-module (now 67) content. Fixed by computing both from the
   `COURSE` array at render time (`COURSE.length` / `totalModules`) so they can't go stale again.
2. **Fragile positional level-lookup array.** Levels for the first four tracks (Foundations, TA,
   Futures, Risk & Psychology) were assigned via a flat `LEVELS[]` array indexed by render order,
   while tracks 5–9 already used an explicit `lvl` field per module. Inserting a module anywhere in
   the first four tracks would have silently shifted every subsequent module's level. Refactored so
   every module across all 9 tracks now declares `lvl` explicitly; the positional array was removed.
   *How verified:* extracted the course `<script>` block and ran it under Node (`node --check` for
   syntax, then a `require()`-based structural check) confirming 9 tracks / 67 modules, expected
   level distribution, and no module missing required fields.
3. **No GitHub Pages entry point.** `.github/workflows/static.yml` (added upstream) uploads the
   entire repo as the Pages artifact, but there was no root `index.html` — the course itself lives at
   `docs/crypto-trading-course.html`. Added a root `index.html` that redirects to it.
4. **Missing `trading-journal.xlsx`.** The course's "Trading journal & backtest template" module links
   to `trading-journal.xlsx` (a download in the same folder) and the README describes it in detail,
   but the file didn't exist in the repo. Generated a real workbook (via a one-off Python/openpyxl
   script) with the four tabs the README already documents: Instructions, Trade Log (auto-calculates
   Risk $, P/L $, R-multiple from typed inputs), Dashboard (win rate, expectancy, total R read live
   from the Trade Log), and Backtest (same mechanics for proving a playbook against historical data
   before risking money). Saved to `docs/trading-journal.xlsx` next to the course HTML.
5. **Stray corrupted bytes in `README.md`.** The file ended with a garbled, UTF-16-encoded
   `# cyrpto-trading-course` stub (rendering as spaced-out characters) — leftover junk from repo
   initialization, not real content. Removed it.
6. **No version number surfaced anywhere.** `CLAUDE.md` instructs keeping a version number in the
   footer, but none existed. Added `COURSE_VERSION` in the script and display it in the footer.

### Also updated

- `README.md`: module count 61 → 67.
- `CLAUDE.md`: cleared the Roadmap and Bugs sections now that this pass is complete (per workflow
  rule #3 — completed roadmap items and fixed bugs move here).
