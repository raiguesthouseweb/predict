Console Errors 

weatherApi.ts:5 
            
            
            GET http://localhost:5000/api/weather?city=Eden%20Gardens&hours=4 500 (Internal Server Error)
fetchWeatherData @ weatherApi.ts:5
getWeatherData @ useWeather.ts:25
(anonymous) @ useWeather.ts:35
commitHookEffectListMount @ react-dom.development.js:23189
commitPassiveMountOnFiber @ react-dom.development.js:24965
commitPassiveMountEffects_complete @ react-dom.development.js:24930
commitPassiveMountEffects_begin @ react-dom.development.js:24917
commitPassiveMountEffects @ react-dom.development.js:24905
flushPassiveEffectsImpl @ react-dom.development.js:27078
flushPassiveEffects @ react-dom.development.js:27023
commitRootImpl @ react-dom.development.js:26974
commitRoot @ react-dom.development.js:26721
performSyncWorkOnRoot @ react-dom.development.js:26156
flushSyncCallbacks @ react-dom.development.js:12042
(anonymous) @ react-dom.development.js:25690
[NEW] Explain Console errors by using Copilot in Edge: click
         
         to explain an error. 
        Learn more
        Don't show again
weatherApi.ts:14  Error fetching weather: Error: Weather API error: 500 - {"error":"Failed to fetch weather data","details":"Request failed with status code 401"}
    at fetchWeatherData (weatherApi.ts:9:13)
    at async getWeatherData (useWeather.ts:25:22)
overrideMethod @ hook.js:608
fetchWeatherData @ weatherApi.ts:14
await in fetchWeatherData
getWeatherData @ useWeather.ts:25
(anonymous) @ useWeather.ts:35
commitHookEffectListMount @ react-dom.development.js:23189
commitPassiveMountOnFiber @ react-dom.development.js:24965
commitPassiveMountEffects_complete @ react-dom.development.js:24930
commitPassiveMountEffects_begin @ react-dom.development.js:24917
commitPassiveMountEffects @ react-dom.development.js:24905
flushPassiveEffectsImpl @ react-dom.development.js:27078
flushPassiveEffects @ react-dom.development.js:27023
commitRootImpl @ react-dom.development.js:26974
commitRoot @ react-dom.development.js:26721
performSyncWorkOnRoot @ react-dom.development.js:26156
flushSyncCallbacks @ react-dom.development.js:12042
(anonymous) @ react-dom.development.js:25690
useWeather.ts:29  Weather fetch error: Error: Weather API error: 500 - {"error":"Failed to fetch weather data","details":"Request failed with status code 401"}
    at fetchWeatherData (weatherApi.ts:9:13)
    at async getWeatherData (useWeather.ts:25:22)
overrideMethod @ hook.js:608
getWeatherData @ useWeather.ts:29
await in getWeatherData
(anonymous) @ useWeather.ts:35
commitHookEffectListMount @ react-dom.development.js:23189
commitPassiveMountOnFiber @ react-dom.development.js:24965
commitPassiveMountEffects_complete @ react-dom.development.js:24930
commitPassiveMountEffects_begin @ react-dom.development.js:24917
commitPassiveMountEffects @ react-dom.development.js:24905
flushPassiveEffectsImpl @ react-dom.development.js:27078
flushPassiveEffects @ react-dom.development.js:27023
commitRootImpl @ react-dom.development.js:26974
commitRoot @ react-dom.development.js:26721
performSyncWorkOnRoot @ react-dom.development.js:26156
flushSyncCallbacks @ react-dom.development.js:12042
(anonymous) @ react-dom.development.js:25690


Prediction Logs
Starting prediction analysis for India vs Pakistan
Match details: T20, Male, Eden Gardens, 2025-05-22
Prediction mode: Pre-Match
Filtering data using: Format=T20, Gender=Male, League=All
FACTOR 1: HEAD-TO-HEAD ANALYSIS
Found 0 head-to-head matches between India and Pakistan in T20 (Male)
No matches found in T20 (Male). Searching across all available formats and genders...
Found 0 total head-to-head matches between India and Pakistan across all formats and genders
No historical data found. Using neutral 50/50 prediction baseline.
FACTOR 2: STADIUM PERFORMANCE ANALYSIS
Found 0 matches at Eden Gardens for T20 (Male)
No historical data found for Eden Gardens. Using neutral 50/50 prediction baseline.
FACTOR 3: COLOR THEORY ANALYSIS
Evaluating team jersey colors vs weekday performance...
India jersey color performance score: 50%
Pakistan jersey color performance score: 50%
FACTOR 4: SEASONAL PERFORMANCE ANALYSIS
Analyzing seasonal performance for May...
India seasonal advantage: 50%
Pakistan seasonal advantage: 50%
FINAL PREDICTION CALCULATION
Pre-match prediction model weights:
- Head-to-head record: 35%
- Stadium performance: 25%
- Color theory: 15%
- Seasonal factors: 25%
Component contributions to final prediction:
- Head-to-head: India 17.5% | Pakistan 17.5%
- Stadium: India 12.5% | Pakistan 12.5%
- Color theory: India 7.5% | Pakistan 7.5%
- Seasonal: India 12.5% | Pakistan 12.5%
FINAL PREDICTION: India 50% - Pakistan 50%

