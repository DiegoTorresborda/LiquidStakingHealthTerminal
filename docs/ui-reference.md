# UI Reference

## Design direction
The dashboard should feel similar in spirit to modern AI-native or intelligence dashboards such as:
https://agents-beat.lovable.app/

The goal is not to clone that interface exactly.
The goal is to reproduce the strengths of that style:
- fast readability
- modern visual hierarchy
- strong card-based structure
- high signal density without clutter
- premium dark mode feel
- score-first storytelling

## Desired visual personality
- dark theme by default
- modern, sharp, clean
- strategic / analytical / institutional
- not overly “retail crypto”
- not meme-heavy
- not a generic BI dashboard
- should feel like a blend of:
  - modern AI workspace
  - premium analytics terminal
  - strategic control center

## Core homepage structure
The homepage should be understandable in one pass.

Suggested structure:

### 1. Top bar
- product name / page title
- selected network
- possibly selected LST
- filter or mode selector
- timestamp or data freshness hint

### 2. Hero summary
This is the most important area.

Include:
- global LST Health Score
- LP Attractiveness label
- short ecosystem diagnosis
- maybe 2–3 top badges such as:
  - Strong liquidity
  - Weak DeFi utility
  - Admin risk elevated

### 3. Seven module cards
Each card should represent one major scoring domain:
- Liquidity & Exit
- Peg Stability
- DeFi Moneyness
- Security & Governance
- Validator Decentralization
- Incentive Sustainability
- Stress Resilience

Each card should show:
- module name
- score
- short description
- 1–2 key metrics
- 1 key alert or insight

### 4. Opportunities panel
A dedicated section for highest-leverage ecosystem improvements.

Examples:
- deepen stablecoin liquidity
- list LST as lending collateral
- reduce validator concentration
- add timelock and governance hardening

This panel is strategically important.
It turns the dashboard into a product and advisory tool.

### 5. Red flags / alerts panel
This section should highlight the biggest structural weaknesses.

Examples:
- no redemption path
- stablecoin exit too shallow
- LST collateral caps too small
- admin control too centralized

### 6. Supporting visuals
A few visual components can reinforce the story, such as:
- slippage chart
- peg deviation chart
- DeFi usage breakdown
- validator concentration chart
- stress scenario outputs

Do not overdo charts.
Charts should support narrative, not replace it.

## UX priorities
The dashboard should answer these questions quickly:
1. Is this ecosystem attractive?
2. What is holding it back?
3. What should be fixed first?
4. Is the problem liquidity, risk, utility, or sustainability?

## Information hierarchy
The order of importance should feel like this:
1. Global score and diagnosis
2. Module scores
3. Red flags
4. Opportunities
5. Supporting metrics
6. Deeper charts

## Tone of the interface
Text in the interface should be:
- concise
- analytical
- confident but not exaggerated
- oriented toward diagnosis and action

Examples of good labels:
- Exit route fragile
- Strong collateral potential
- Incentives overextended
- Governance maturity improving
- Stablecoin depth insufficient
- Validator concentration elevated

## Layout principles
- use cards aggressively
- strong spacing
- large score typography
- concise labels
- avoid cramped dashboards
- avoid giant tables on the homepage
- surface only the metrics that matter most

## Visual components to prioritize in v1
### Must-have
- global score hero
- network selector
- module score cards
- opportunities panel
- red flags panel

### Nice-to-have
- slippage curve
- peg chart
- validator concentration chart
- stress scenario card

## Suggested sample homepage narrative
A user should be able to land on the page and infer something like:

“Network X has decent staking economics, but weak stablecoin exit, limited DeFi moneyness, and elevated governance risk. The clearest upgrade path is stronger stablecoin liquidity plus lending integration.”

If the homepage cannot communicate that kind of diagnosis quickly, the design is not working yet.

## v1 implementation guidance
- use mock data
- focus on visual narrative first
- make cards reusable
- keep scoring config external to components
- favor polished structure over too many features

## Anti-patterns to avoid
- dashboards full of random KPIs with no storyline
- excessive chart density
- bright noisy color palette
- too much dependency on tables
- collapsing everything into one unexplained score
- cluttered crypto terminal look
