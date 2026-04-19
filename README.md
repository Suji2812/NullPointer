# NullPointer — AI Bias Detection Platform

<div align="center">

![NullPointer Banner](https://nullpointer-bias-2026-11a58.web.app/)

**Find the bias your AI is hiding.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase-orange?style=for-the-badge&logo=firebase)](https://nullpointer-bias-2026-11a58.web.app/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Google Solution Challenge](https://img.shields.io/badge/Google-Solution%20Challenge%202026-red?style=for-the-badge&logo=google)](https://developers.google.com/community/gdsc-solution-challenge)
[![SDG 10](https://img.shields.io/badge/UN%20SDG-10%20Reduced%20Inequalities-pink?style=for-the-badge)](https://sdgs.un.org/goals/goal10)
[![SDG 5](https://img.shields.io/badge/UN%20SDG-5%20Gender%20Equality-red?style=for-the-badge)](https://sdgs.un.org/goals/goal5)

</div>

---

## What is NullPointer?

Every day, AI systems make life-changing decisions — who gets hired, who gets a loan, who receives medical care. Most of these systems are biased. Not intentionally, but because they learned from biased historical data. And almost nobody catches it.

**NullPointer catches it.**

NullPointer is an AI-powered bias detection platform that audits datasets for fairness issues in automated decision-making systems. Upload any CSV dataset and get a Fairness Score, intersectional bias analysis, plain English explanations powered by Gemini AI, and counterfactual proof of discrimination — all in under 30 seconds.

> *The name "NullPointer" comes from programming — it's the exact moment a system fails. In AI bias, the NullPointer is the moment a qualified person gets rejected because of who they are, not what they can do.*

---

## Live Demo

**Try it now:** [https://nullpointer-bias-2026-11a58.web.app](https://nullpointer-bias-2026-11a58.web.app)

No sign-up required. Use the built-in sample dataset to see it in action immediately.

---

## Features

### Bias Fingerprinting
Detects intersectional bias across combined demographic attributes simultaneously — race × gender × age × location. Traditional tools check one attribute at a time and miss the worst discrimination. NullPointer finds patterns that are invisible to single-attribute analysis.

### Fairness Score (0–100)
A single composite metric combining three industry-standard fairness measures:
- **Demographic Parity** — are approval rates equal across groups?
- **Equalized Odds** — are error rates equal across groups?
- **Disparate Impact Ratio** — the industry-standard 80% rule

Color coded: 🔴 0–40 Critical / 🟡 41–70 Moderate / 🟢 71–100 Fair

### Gemini Plain English Analysis
Bias findings explained in human language any manager can understand. No data science degree required. Gemini 2.5 Flash translates complex statistical metrics into sentences that get action taken.

### Counterfactual Testing
Flip one demographic attribute on a single applicant record and see if the AI decision changes. This proves discrimination at the individual level — the kind of evidence that holds up in a courtroom.

### Bias Progression Insight
Historical trend chart showing how bias changes over time. Visualizes how each model retrain on biased data makes the system progressively worse.

### Compliance Mapping
Findings automatically mapped to:
- **EEOC guidelines** (US employment discrimination law)
- **EU AI Act thresholds** (0.80 minimum for fairness metrics)

---

## How It Works

```
1. Upload CSV Dataset
         ↓
2. Auto-detect sensitive columns (gender, age, race, etc.)
         ↓
3. Configure analysis (decision type + target column)
         ↓
4. Gemini 2.5 Flash analyzes every demographic combination
         ↓
5. Get Fairness Score + Bias Fingerprint + Plain English Report
         ↓
6. Run Counterfactual Testing to prove discrimination
         ↓
7. Review fix recommendations + projected impact
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Google Antigravity** | Agentic IDE used to build the entire frontend |
| **Gemini 2.5 Flash API** | Bias analysis, plain English explanations, counterfactual verdicts |
| **Firebase Hosting** | Cloud deployment and global CDN |
| **HTML / CSS / JavaScript** | Frontend — no framework needed |
| **Chart.js** | Bias Progression visualization |
| **Canvas API** | Real-time animated bias visualization on homepage |
| **localStorage** | Client-side state management between pages |

---

## Project Structure

```
nullpointer/
│
├── index.html          # Landing page with animated bias visualization
├── upload.html         # CSV upload and dataset configuration
├── results.html        # Analysis results — score, heatmap, Gemini report
├── fix.html            # Counterfactual testing and fix recommendations
│
├── upload.js           # CSV handling, Gemini API calls, fallback logic
├── results.js          # Results rendering — heatmap, chart, metrics
├── fix.js              # Counterfactual panel and score animation
│
├── styles.css          # Full design system — dark theme
├── config.js           # API key and Gemini endpoint (not committed)
│
├── firebase.json       # Firebase Hosting configuration
└── .firebaserc         # Firebase project reference
```

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome recommended)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/api-keys) (free)

### Run Locally

**1. Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/nullpointer.git
cd nullpointer
```

**2. Create your config file:**

Create a file called `config.js` in the root folder:
```javascript
const GEMINI_API_KEY = 'your-api-key-here';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;
```

**3. Open the app:**

Simply open `index.html` in your browser. No build step or server required.

> ⚠️ **Note:** Running from `file://` may have CORS limitations in some browsers. For best results, use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
Then open `http://localhost:8000`

### Deploy to Firebase

**1. Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

**2. Login and deploy:**
```bash
firebase login
firebase init hosting
firebase deploy
```

---

## Usage Guide

### Using the Sample Dataset

1. Click **"Audit Dataset Now"** on the homepage
2. Click **"Load Sample Dataset (UCI Adult Income)"**
3. Select **"Hiring decisions"** as the decision context
4. Confirm **"income"** is selected as the target column
5. Click **"Analyze for Bias"**
6. Wait ~15-30 seconds for Gemini analysis
7. Explore results → click "Run Counterfactual Analysis"

### Using Your Own Dataset

Your CSV must:
- Have a header row
- Contain a column representing the AI decision (approved/rejected, >50K/≤50K, etc.)
- Have at least one demographic column (gender, race, age, etc.)
- Be under 1,000 rows

**Supported decision types:**
- Hiring decisions
- Loan approvals
- Medical triage

---

## Understanding the Results

### Fairness Score
| Score | Status | Meaning |
|---|---|---|
| 71–100 | 🟢 Fair | Meets EU AI Act minimum threshold |
| 41–70 | 🟡 Moderate Bias | Below compliance threshold, action needed |
| 0–40 | 🔴 Critical Bias | Significant discrimination detected |

### Bias Fingerprint Heatmap
Each cell shows a **rejection multiplier** — how many times more likely that demographic group is to be rejected compared to the baseline (1.0×).

- 🟢 1.0–1.2× = Fair (near baseline)
- 🟡 1.3–2.0× = Moderate bias
- 🔴 2.1–3.5× = High bias
- ⬛ 3.5×+ = Critical bias

### Technical Metrics
All three metrics must score above **0.80** to meet EU AI Act compliance:
- **Demographic Parity:** Equal approval rates across groups
- **Equalized Odds:** Equal true/false positive rates across groups
- **Disparate Impact Ratio:** Ratio of approval rates between groups

---

## API Key Security

> ⚠️ **Important:** Never commit your `config.js` file to GitHub. It contains your API key.

The `.gitignore` already excludes `config.js`. For additional security:

1. Go to [Google AI Studio](https://aistudio.google.com/api-keys)
2. Select your API key → Add HTTP referrer restriction
3. Add your domain: `your-firebase-app.web.app/*`

This ensures your key only works from your deployed domain.

---

## Why NullPointer?

| | Traditional Tools | NullPointer |
|---|---|---|
| **Analysis type** | Single attribute | Intersectional |
| **Output** | Statistics | Plain English |
| **Legal mapping** | None | EEOC + EU AI Act |
| **Proof level** | Population level | Individual record |
| **Expertise required** | Data scientist | Anyone |
| **Cost** | Enterprise pricing | Free |

---

## SDG Alignment

**UN SDG 10 — Reduced Inequalities**
NullPointer directly addresses inequality in AI systems by making bias detection accessible to any organization — not just those with data science teams.

**UN SDG 5 — Gender Equality**
Counterfactual testing specifically proves gender-based discrimination at the individual record level — a concrete tool for advancing gender equality in automated decisions.

---

## Roadmap

### Phase 2 (6 months)
- [ ] Support for PDF and Excel dataset uploads
- [ ] Real-time API monitoring for live systems
- [ ] Bias Time-Travel with multi-year dataset comparison

### Phase 3 (12 months)
- [ ] Organization accounts and audit history
- [ ] Automated EU AI Act compliance reports
- [ ] Integration with HR platforms (Workday, SAP SuccessFactors)

### Phase 4
- [ ] Support for image and NLP model bias
- [ ] Multi-language support
- [ ] Developer SDK for embedding bias checking in pipelines

---

## Cost

| Resource | Current Cost | At Scale (10K users/month) |
|---|---|---|
| Firebase Hosting | Free | Free |
| Gemini 2.5 Flash API | Free (1,500 req/day) | ~$2–5/month |
| Google Antigravity | Free | Free |
| **Total** | **₹0 / month** | **~$5/month** |

---

## Built With

This project was built entirely using **Google Antigravity** — Google's agentic IDE powered by Gemini 3. The entire frontend was scaffolded, debugged, and iterated using Antigravity's autonomous agent capabilities.

---

## Submission

**Google Solution Challenge 2026**
- Team: NullPointer
- Team Leader: B.Sujitha
- Problem Statement: [Unbiased AI Decision] Ensuring Fairness and Detecting Bias in Automated Decisions
- SDGs: SDG 10 + SDG 5

---

## License

This project is submitted for Google Solution Challenge 2026. All rights reserved.

---

<div align="center">

**NullPointer — Turning exceptions into solutions.**

*One biased model running unchecked for 5 years can reject tens of thousands of qualified people based on who they are — not what they can do. NullPointer finds the exact moment bias breaks the system — and fixes it.*

</div>
