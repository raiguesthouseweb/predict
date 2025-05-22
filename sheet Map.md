# Full Project Documentation — Guru Gyan rAi Cricket Prediction System

This document consolidates the entire logic, structure, and Excel sheet explanation from all files including prediction flow, data formatting, and sheet descriptions.

---

## 📁 Excel File Sheet Overview

The primary data file `Categorized_Match_List.xlsx` includes match history across formats. Key sheets:

* T20 Sheets (T20 Male, IPL, BPL, PSL, etc.)
* ODI Sheets (ODI Male, Royal London, Super50, etc.)
* Utility Sheets:

  * `Index` — maps format/gender/league
  * `Day Colors` — day to color mappings
  * `Team Colors` — jersey and flag colors
  * `Stadiums` — stadium location & weather logic

### 🏟️ Stadiums Sheet Weather Logic

| Column | Meaning      |
| ------ | ------------ |
| A      | Stadium Name |
| B      | Country      |
| C      | City         |
| D      | Zip Code     |

* **T20 Format**:

  * Use Zip Code (Col D) for weather lookup (4–5 hrs)
  * If not available → fallback to City (Col C)
* **ODI Format**:

  * Use Zip Code (Col D) for 9–10 hour forecast
  * Fallback to City (Col C) if Zip Code missing

---

## 🎽 Team Colors Sheet

| Column | Description                     |
| ------ | ------------------------------- |
| A      | Team Name                       |
| B–E    | Jersey colors (main, alt1–alt3) |
| F–K    | Flag colors                     |

## 🌈 Day Colors Sheet

| Column | Description   |
| ------ | ------------- |
| A      | Day (Mon–Sun) |
| B      | Color Name    |
| C      | Hex Code      |

## 🧾 Index Sheet

| Column | Description           |
| ------ | --------------------- |
| A      | Format (T20/ODI/Test) |
| B      | Gender                |
| C      | Type (League/Intl)    |
| D      | League Name           |
| E      | Country               |

---

## 🏏 T20 Sheet Columns

| Column | Header        | Description                         |
| ------ | ------------- | ----------------------------------- |
| A      | Date          | Match date (used to derive weekday) |
| B      | Country       | Hosting country                     |
| C      | Venue         | Stadium                             |
| D      | Teams         | Format: `A vs B`                    |
| E      | Toss Winner   | Toss winner (less useful)           |
| F      | Bat First     | Determines 1st Inning               |
| G–J    | 6–15OVR       | Milestone scores of 1st Inning      |
| K      | Digit         | Used for digit logic                |
| L–O    | 6–20OVR (2nd) | Milestones for second inning        |
| P      | Winner        | Final winner (optional)             |

## 🏏 ODI Sheet Columns

| Column | Header                  | Description                     |
| ------ | ----------------------- | ------------------------------- |
| A–E    | Match Date to Bat First | Same as T20                     |
| F–O    | 5–45OVR (1st Inn)       | 5-over milestones               |
| P      | Target (50OVR)          | 1st inning final score          |
| Q      | Digit                   | Used for digit logic            |
| R–Z    | 5–45OVR (2nd Inn)       | 2nd inning milestones           |
| AA     | Final Score (2nd Inn)   | Compare with target for outcome |
| AB     | Winner                  | Final winner                    |

---

# 🎯 Prediction Logic — Pre-Match

### Required Inputs

* Team A
* Team B
* Match Format (T20/ODI)
* Gender
* Match Date (optional)
* League (optional)
* Stadium (optional)

### Steps:

1. **Determine Day** → from date
2. **Get Day Colors** → from Day Colors sheet
3. **Team Color Match %**

   * 70%+ Jersey match = 100% weight
   * 30–69% Jersey alt = 60%
   * Flag color = 30% weight
4. **Head-to-Head (weekday-only)**
5. **Extended Head-to-Head**:

   * Same weekday → High
   * Same stadium → Medium
   * Any day/stadium → Low
6. **Venue Performance**

   * Same day + venue → High
   * Any match at venue → Medium
7. **Weekday Win % (both teams)**
8. **Final Score = Weighted average**

---

# 🔁 Prediction Logic — Inning Break

### Extra Input:

* First Inning Score (Team A)

### Additional Logic:

8. **Score-Based Defense Check**

   * Team A scored X and defended in same league
9. **Any Team Scored X and Defended in same league**
10. **Any Team Defended X in any league, same format/gender**
11. **Digit-Based Logic**

    * 183 → 1+8+3 = 12 → digit = 2
    * T20: search `Column K`, ODI: `Column Q`
    * Count wins/losses for same digit
    * Skip if T20 < 143, ODI < 243

---

# ✅ Normalizations

* Normalize gender: Women/Female → Female
* Normalize teams: USA = United States, UAE = United Arab Emirates

---

This unified file allows developers and analysts to understand the full system in one place — including data input structure, sheet format, and prediction logic layers.

**All rules, formats, colors, and algorithms are now in one source.**
