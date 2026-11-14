# Sources & Threshold Rationale

Every warning threshold in CrewCheck lives in [`src/data/thresholds.js`](src/data/thresholds.js). This page explains where each number comes from.

- **Sourced**: the number comes straight from a NASA / CSA document listed below.
- **Project-defined**: our own choice, based on a sourced reference value. These are for spotting trends in a prototype, **not** medical limits.

## Thresholds

| Metric | Warning when | Critical when | Basis |
|---|---|---|---|
| Sleep | < **6 h** for 3 days in a row | < 4 h | **Sourced**: shuttle crews averaged ~6 h/night in space (vs 7.9 h on Earth), and 5–6 h a night impairs performance within a week [7]. Crews are allotted 8.5 h [6][8]. The 3-day window and 4 h critical level are **project-defined**. |
| Exercise | < **60 min** for 3 days in a row | – | **Project-defined**: half of the ~2 h/day NASA prescribes on the ISS to counter bone and muscle loss [4][5]. |
| Radiation | > **0.5 mSv/day** | > **1.0 mSv/day** | **Sourced**: ISS crews receive ~0.2–0.5 mSv/day [2][3]; ~1 mSv/day or more is projected beyond low-Earth orbit [2]. |
| Radiation (mission total) | > **600 mSv** | – | **Sourced**: NASA career limit for effective dose [1][2]. |
| Mood | ≤ **2** of 5 | – | **Project-defined**: self-rated scale. Behavioral health is an HRP risk area [9][10]. |
| Resting heart rate | > **100 bpm** | > 120 bpm | **Project-defined**: monitoring threshold. Cardiovascular change is an HRP risk area [9][10]. |

## Key facts (checked)

| Metric | Claim | Source | Checked |
|---|---|---|---|
| Radiation | Career effective dose limit: < 600 mSv, all ages and sexes | [1] | ✅ read in PDF |
| Radiation | ISS crews receive ~0.5 mSv/day; ~1 mSv/day or more projected beyond LEO | [2] | ✅ read in PDF |
| Radiation | ISS dose 0.2–0.5 mSv/day; ~40–90 mSv per 6-month mission | [3] | ✅ read in PDF |
| Exercise | ISS crews exercise ~2 hours a day on average | [4] | ✅ read on page |
| Exercise | ~2 hours a day (2025 update) | [5] | not re-checked |
| Sleep | Crews are scheduled for 8.5 h sleep (Spaceflight Actigraphy Study: 64 short-duration + 21 long-duration crewmembers, 7,421 nights) | [6] | ✅ slide 13 |
| Sleep | Sleep window 21:30–06:00 GMT | [6] | ⚠️ not found yet, don't quote until checked |
| Sleep | Shuttle crews averaged ~6 h/day in space vs 7.9 h on Earth; 5–6 h/night impairs performance within a week | [7] | ✅ read in PDF |
| Sleep | Astronauts are allotted ~8.5 h for sleep every day | [8] | ✅ read on page |
| Hazards | Five hazards of spaceflight (RIDGE: Radiation, Isolation, Distance, Gravity, Environment) | [9] | not re-checked |
| Hazards | 30+ human health risks tracked in a roadmap | [10] | not re-checked |
| Hazards | Review of the highest-priority risks for a Mars mission | [11] | not re-checked |
| Data | NASA Open Science Data Repository (OSDR) | [12] | not re-checked |

> The HRP sleep report [7] does **not** state a flat "8 hours recommended". It says the average adult sleeps ~8.5 h when given extended sleep opportunity. Quote that instead if asked.

## References

1. NASA Office of the Chief Health and Medical Officer. (2023). *Design for ionizing radiation protection* (NASA-STD-3001 Technical Brief OCHMO-TB-020). NASA. [PDF](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-020-radiation-protection.pdf)
2. NASA Lifetime Surveillance of Astronaut Health. (2023). *LSAH newsletter, 28*(2). NASA. [PDF](https://www.nasa.gov/wp-content/uploads/2023/10/lsah-newsletter-2023-vol28-issue2.pdf)
3. Simonsen, L. C. (2025). *Moon 2 Mars space radiation protection: "Buying down" risks to crew* [Draft paper]. NASA Technical Reports Server. [PDF](https://ntrs.nasa.gov/api/citations/20250006168/downloads/ASCEND%20Simonsen%20draft%201.pdf)
4. NASA. (n.d.). *Counteracting bone and muscle loss in microgravity*. [Link](https://www.nasa.gov/missions/station/iss-research/counteracting-bone-and-muscle-loss-in-microgravity/)
5. NASA. (2025, July 16). *Muscle and exercise studies to maintain crew health in space*. Space Station Blog. [Link](https://www.nasa.gov/blogs/spacestation/2025/07/16/muscle-and-exercise-studies-to-maintain-crew-health-in-space/)
6. Flynn-Evans, E. (2023). *How do humans sleep in space?* [Presentation]. NASA Technical Reports Server. [PDF](https://ntrs.nasa.gov/api/citations/20230003360/downloads/2023%20SLTBR%20Lausanne.pdf)
7. NASA Human Research Program. (2015). *Evidence report: Risk of performance decrements and adverse health outcomes resulting from sleep loss, circadian desynchronization, and work overload*. NASA Technical Reports Server. [PDF](https://ntrs.nasa.gov/api/citations/20150016964/downloads/20150016964.pdf)
8. Canadian Space Agency. (n.d.). *Sleeping in space*. [Link](https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/sleeping-in-space.asp)
9. NASA. (n.d.). *The human body in space*. [Link](https://www.nasa.gov/humans-in-space/the-human-body-in-space/)
10. NASA Human Research Program. (n.d.). *Human research roadmap*. [Link](https://humanresearchroadmap.nasa.gov/)
11. Patel, Z. S., Brunstetter, T. J., Tarver, W. J., Whitmire, A. M., Zwart, S. R., Smith, S. M., & Huff, J. L. (2020). Red risks for a journey to the red planet: The highest priority human health risks for a mission to Mars. *npj Microgravity, 6*, 33. [doi:10.1038/s41526-020-00124-6](https://doi.org/10.1038/s41526-020-00124-6)
12. Gebre, S. G., Scott, R. T., Saravia-Butler, A. M., Lopez, D. K., Sanders, L. M., & Costes, S. V. (2024). NASA Open Science Data Repository: Open science for life in space. *Nucleic Acids Research, 53*(D1), D1697–D1710. [doi:10.1093/nar/gkae1116](https://doi.org/10.1093/nar/gkae1116)
