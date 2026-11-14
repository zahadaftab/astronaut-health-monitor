# CrewCheck — Astronaut Health Monitor

NASA Space Apps Challenge: *Create Health Monitoring Software for Astronauts on Space Missions.*

> How do we keep astronauts healthy when no doctor is 3 months away?

Astronauts log four things once a day — **sleep, mood, exercise, heart rate**. CrewCheck graphs the trends and raises early warnings when something looks off, mapped to the spaceflight hazards studied by NASA's Human Research Program (HRP).

## Hazard mapping

| Daily metric | What it tracks | Space hazard |
|---|---|---|
| Exercise minutes | Structure (bones & muscle) | Bone loss / muscle atrophy in microgravity |
| Mood (1–5) + sleep hours | Sense of isolation | Isolation & confinement (behavioral health) |
| Exercise volume | Physical activity | Inactivity / deconditioning |
| Heart rate | Exertion & intensity | Cardiovascular strain / overexertion |
| *(optional)* Radiation dose | Exposure | Space radiation |

## Warnings (rule-based)

Thresholds (all in `src/data/thresholds.js`): sleep < 7 h for 3 days, mood ≤ 2, exercise < 20 min for 3 days, resting HR > 100 bpm, radiation > 0.6 mSv/day. Each warning is labeled with the hazard it relates to, e.g. *"⚠️ Isolation risk: low mood + poor sleep 3 days"*.

## Run locally

```bash
npm install
npm run dev
```

Stack: React + Vite, Chart.js, localStorage (no backend).

## References

- [NASA Human Research Program](https://www.nasa.gov/hrp/)
- [NASA Biological & Physical Sciences (BPS) data](https://science.nasa.gov/biological-physical/data/)
