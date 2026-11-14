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

### NASA's Human Research Program (HRP) defines Five Hazards

- **Space Radiation**: exposure to dangerous cosmic rays that harms the central nervous system, cognitive, motor and behavioral functions invisible to the human eye
- **Isolation & Confinement**: risk of compounding behavioral, and mental health issues during missions compromising performance
- **Distance from Earth**: minimal support from teams on Earth leading to challenges as we explore further
- **Gravity Fields**: multiple gravity fields that the body needs to adapt to which can lead to loss of bone density, lack of coordination, and complications with bodily fluids due to pressure changes
- **Hostile/Close Environments**: challenge to maintain a safe ecosystem in an enclosed environment for extended periods

> What is hazard mapping and how do we connect it to the data?

Human spaceflight poses many risks to the human body although it may not be obvious. The collected metrics will help users understand the significance of their daily behaviors such as sleep, mood, exercise, and heart rate to map the potential hazards that can occur within each category. Tracking physical activities and the exertion represents potential interpretaions to space radiation and gravity fields. For example, seeing a low sleeping score doesn't just mean you didn't get enough sleep. It poses an early indicator of the risk of Isolation and confinement, potentially signaling stress or *circadian desynchronization*. 


## Warnings (rule-based)

Thresholds (all in `src/data/thresholds.js`): sleep < 6 h for 3 days, exercise < 60 min for 3 days, radiation > 0.5 mSv/day (critical > 1.0) or > 600 mSv in total, mood ≤ 2, resting HR > 100 bpm. Where each number comes from, and which ones are our own choices, is in **[SOURCES.md](SOURCES.md)**. Each warning is labeled with the hazard it relates to, e.g. *"⚠️ Isolation risk: low mood + poor sleep 3 days"*.

## Run locally

```bash
npm install
npm run dev
```

Stack: React + Vite, Chart.js, localStorage (no backend).

## References

Full reference list with the facts we checked: **[SOURCES.md](SOURCES.md)**

- [NASA Human Research Program](https://www.nasa.gov/hrp/)
- [NASA Biological & Physical Sciences (BPS) data](https://science.nasa.gov/biological-physical/data/)
