# Excel Data Structure Guidelines for Match Prediction

This document provides a detailed overview of how the Excel file `Categorized_Match_List.xlsx` is structured and how its data is used by our cricket match prediction web application. It is intended for implementation guidance, particularly for integrating new logic or handing this off to Trae or any other developer.

---

## 🔗 Source Reference

* File: `server/cricket/xlsxParser.ts` → Handles Excel reading
* Main data source: `Categorized_Match_List.xlsx`
* File documented in: `FullInformation.md`

---

## 📊 Excel File Structure Overview

The Excel workbook contains **multiple sheets**, each representing a specific **category or league of matches**. Based on the current `Categorized_Match_List.xlsx` file, the following sheets are included:

1. ODI Male
2. T20 Male
3. ODI Women
4. T20I Women
5. Super Smash Male
6. South Africa T20
7. PSL
8. Lanka Premier League
9. IPL
10. Sheffield Shield MMD
11. Syed Mushtaq Ali Trophy
12. Royal London One-Day Cup
13. Vitality Blast T20
14. Nepal Premier League T20
15. Mzansi Super League T20
16. Major League Cricket T20
17. Inter-Provincial Twenty20 Trophy
18. CSA T20 Challenge Male
19. International League T20 Male
20. Bangladesh Premier League Male
21. Women’s Caribbean Premier League
22. Caribbean Premier League Male
23. Big Bash League Male
24. Women Premier League (WPL)
25. BBW
26. Women’s T20 Challenge
27. Super Smash Women
28. Women’s Cricket Super League T20
29. Test Women
30. Plunket Shield Multi Day Match
31. Womens One Day Cup
32. The Hundred Male
33. TEST M
34. Multi Day Domestic (MDM) England
35. Rachael Heyhoe Flint Trophy 50O
36. The Hundred Women
37. FairBreak Invitational Tournament
38. Super50 Women
39. Blaze Indies T20
40. Charlotte Edwards Cup T20 Women

Each sheet follows a consistent structure of columns for match data.

### 🧾 Key Columns (General across all sheets):

| Column | Description               | Used in Prediction?                  |
| ------ | ------------------------- | ------------------------------------ |
| A      | Match Date (DD-MM-YYYY)   | ✅ Yes (For recent performance logic) |
| B      | Stadium Name              | ✅ Yes (For stadium-based filters)    |
| C      | Match Type (ODI/T20/Test) | ✅ Yes                                |
| D      | League/Series Name        | ✅ Yes (Used for tagging & filtering) |
| E      | Team A                    | ✅ Yes                                |
| F      | Team B                    | ✅ Yes                                |
| G      | Toss Winner               | ✅ Yes                                |
| H      | Toss Decision (Bat/Field) | ✅ Yes                                |
| I      | First Inning Score        | ✅ Yes                                |
| J      | First Inning Wickets      | ❌ No                                 |
| K      | First Inning Overs        | ❌ No                                 |
| L      | Second Inning Score       | ✅ Yes                                |
| M      | Second Inning Wickets     | ❌ No                                 |
| N      | Second Inning Overs       | ❌ No                                 |
| O      | Result Type (Win/NR/Tie)  | ✅ Yes                                |
| P      | Winning Team              | ✅ Yes                                |
| Q      | Margin (Runs/Wickets)     | ✅ Yes                                |
| R      | Match Notes (Optional)    | ❌ No                                 |

---

## 🧠 How Prediction Works

The system uses the data above to generate predictions by evaluating:

* **Team matchups**: historical head-to-head performance
* **Stadium trends**: win/loss trends at specific venues
* **Score patterns**: how often specific scores are defended or chased
* **Date filters**: day-of-week analysis (e.g. how teams perform on Fridays)

These calculations are performed via helper functions defined in:

* `getHeadToHead`, `getStadiumMatches`, `getAllHeadToHead`, etc.
* Located in: `server/cricket/xlsxParser.ts`

---

## 📌 What to Ignore

The following columns can be ignored for current prediction logic:

* J, K, M, N (Wickets & Overs)
* R (Notes)

These are reserved for future enhancement or visual display only.

---

## 🔧 Developer Notes for Trae

* Only read columns **A to Q** from each sheet
* Use standardized column names to map dynamically
* Sheet names can vary but structure is consistent
* Use filtering functions from `xlsxParser.ts` to query relevant match data
* Ensure encoding and newline handling is proper when parsing Excel

---

## ✅ Summary

* `Categorized_Match_List.xlsx` contains all match history data
* `xlsxParser.ts` extracts it into structured format
* Prediction engine uses historical data trends, scores, venues, and team history
* Only relevant rows/columns are used per query

This structure allows seamless integration of Excel data into the web app’s prediction engine with low complexity and high performance.
