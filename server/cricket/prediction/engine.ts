import { PredictionFormValues } from "@shared/schema";
import { PredictionResult, TeamColor, DayColor } from "@shared/types";
import { analyzeHeadToHead } from "./headToHead";
import { analyzeStadium } from "./stadiumAnalysis";
import { analyzeColorTheory } from "./colorTheory";
import { analyzeSeasonalFactor } from "./seasonalAnalysis";
import { analyzeScorePattern } from "./scorePattern";

/**
 * Main prediction engine that combines all factors to generate a match prediction
 * Enhanced with detailed logs for each analysis factor
 */
export async function predictMatch(
  predictionData: PredictionFormValues, 
  teamColors: TeamColor[],
  dayColors: DayColor[]
): Promise<PredictionResult> {
  const { 
    teamA, 
    teamB, 
    matchFormat, 
    gender, 
    matchDate, 
    stadium, 
    teamAScore, 
    predictionMode 
  } = predictionData;
  
  // Initialize log messages
  const logs: string[] = [
    `Starting prediction analysis for ${teamA} vs ${teamB}`,
    `Match details: ${matchFormat}, ${gender}, ${stadium}, ${matchDate}`,
    `Prediction mode: ${predictionMode === 'pre-match' ? 'Pre-Match' : 'Inning Break'}`
  ];
  
  logs.push("---------------------------------------------");
  logs.push("FACTOR 1: HEAD-TO-HEAD ANALYSIS");
  logs.push("---------------------------------------------");
  
  // Step 1: Analyze head-to-head record with detailed logs
  const headToHeadResult = await analyzeHeadToHead(teamA, teamB, matchFormat, gender);
  
  // Add detailed head-to-head logs
  if (headToHeadResult.detailedLogs) {
    logs.push(...headToHeadResult.detailedLogs);
  }
  
  logs.push("---------------------------------------------");
  logs.push("FACTOR 2: STADIUM PERFORMANCE ANALYSIS");
  logs.push("---------------------------------------------");
  
  // Step 2: Analyze stadium factor with detailed logs
  const stadiumResult = await analyzeStadium(teamA, teamB, stadium, matchFormat, gender);
  
  // Add detailed stadium analysis logs
  if (stadiumResult.detailedLogs) {
    logs.push(...stadiumResult.detailedLogs);
  }
  
  logs.push("---------------------------------------------");
  logs.push("FACTOR 3: COLOR THEORY ANALYSIS");
  logs.push("---------------------------------------------");
  
  // Step 3: Analyze color theory (jersey vs day of the week)
  const colorResult = await analyzeColorTheory(teamA, teamB, matchDate, teamColors, dayColors);
  
  // Add some basic color theory logs
  logs.push(`Evaluating team jersey colors vs weekday performance...`);
  logs.push(`${teamA} jersey color performance score: ${colorResult.teamAPerformance}%`);
  logs.push(`${teamB} jersey color performance score: ${colorResult.teamBPerformance}%`);
  
  logs.push("---------------------------------------------");
  logs.push("FACTOR 4: SEASONAL PERFORMANCE ANALYSIS");
  logs.push("---------------------------------------------");
  
  // Step 4: Analyze seasonal factor (month performance)
  const seasonalResult = await analyzeSeasonalFactor(teamA, teamB, matchDate, matchFormat, gender);
  
  // Add some basic seasonal analysis logs
  const matchMonth = new Date(matchDate).toLocaleString('default', { month: 'long' });
  logs.push(`Analyzing seasonal performance for ${matchMonth}...`);
  logs.push(`${teamA} seasonal advantage: ${seasonalResult.teamASeasonalAdvantage}%`);
  logs.push(`${teamB} seasonal advantage: ${seasonalResult.teamBSeasonalAdvantage}%`);
  
  // Step 5: If post-innings, analyze score pattern
  let scorePatternResult = { teamAWinProbability: 50 };
  
  if (predictionMode === "post-innings" && teamAScore) {
    logs.push("---------------------------------------------");
    logs.push("FACTOR 5: FIRST INNINGS SCORE ANALYSIS");
    logs.push("---------------------------------------------");
    logs.push(`Analyzing first innings score: ${teamAScore} runs`);
    scorePatternResult = await analyzeScorePattern(teamAScore, matchFormat);
    logs.push(`Based on the score pattern analysis, ${teamA} has a ${scorePatternResult.teamAWinProbability}% chance of winning`);
  }
  
  logs.push("---------------------------------------------");
  logs.push("FINAL PREDICTION CALCULATION");
  logs.push("---------------------------------------------");
  
  // Calculate final win probabilities - weighting factors
  let teamAWinPercentage = 0;
  let teamBWinPercentage = 0;
  
  if (predictionMode === "pre-match") {
    // Pre-match weights
    const headToHeadWeight = 0.35;
    const stadiumWeight = 0.25;
    const colorWeight = 0.15;
    const seasonalWeight = 0.25;
    
    logs.push("Pre-match prediction model weights:");
    logs.push(`- Head-to-head record: ${headToHeadWeight * 100}%`);
    logs.push(`- Stadium performance: ${stadiumWeight * 100}%`);
    logs.push(`- Color theory: ${colorWeight * 100}%`);
    logs.push(`- Seasonal factors: ${seasonalWeight * 100}%`);
    
    teamAWinPercentage = (
      headToHeadResult.teamAWinPercentage * headToHeadWeight +
      stadiumResult.teamAWinPercentage * stadiumWeight +
      colorResult.teamAPerformance * colorWeight +
      seasonalResult.teamASeasonalAdvantage * seasonalWeight
    );
    
    teamBWinPercentage = (
      (100 - headToHeadResult.teamAWinPercentage) * headToHeadWeight +
      stadiumResult.teamBWinPercentage * stadiumWeight +
      colorResult.teamBPerformance * colorWeight +
      seasonalResult.teamBSeasonalAdvantage * seasonalWeight
    );
    
    logs.push("Component contributions to final prediction:");
    logs.push(`- Head-to-head: ${teamA} ${(headToHeadResult.teamAWinPercentage * headToHeadWeight).toFixed(1)}% | ${teamB} ${((100 - headToHeadResult.teamAWinPercentage) * headToHeadWeight).toFixed(1)}%`);
    logs.push(`- Stadium: ${teamA} ${(stadiumResult.teamAWinPercentage * stadiumWeight).toFixed(1)}% | ${teamB} ${(stadiumResult.teamBWinPercentage * stadiumWeight).toFixed(1)}%`);
    logs.push(`- Color theory: ${teamA} ${(colorResult.teamAPerformance * colorWeight).toFixed(1)}% | ${teamB} ${(colorResult.teamBPerformance * colorWeight).toFixed(1)}%`);
    logs.push(`- Seasonal: ${teamA} ${(seasonalResult.teamASeasonalAdvantage * seasonalWeight).toFixed(1)}% | ${teamB} ${(seasonalResult.teamBSeasonalAdvantage * seasonalWeight).toFixed(1)}%`);
    
  } else {
    // Post-innings weights
    const headToHeadWeight = 0.20;
    const stadiumWeight = 0.15;
    const colorWeight = 0.10;
    const seasonalWeight = 0.15;
    const scoreWeight = 0.40;
    
    logs.push("Inning Break prediction model weights:");
    logs.push(`- Head-to-head record: ${headToHeadWeight * 100}%`);
    logs.push(`- Stadium performance: ${stadiumWeight * 100}%`);
    logs.push(`- Color theory: ${colorWeight * 100}%`);
    logs.push(`- Seasonal factors: ${seasonalWeight * 100}%`);
    logs.push(`- First innings score: ${scoreWeight * 100}%`);
    
    teamAWinPercentage = (
      headToHeadResult.teamAWinPercentage * headToHeadWeight +
      stadiumResult.teamAWinPercentage * stadiumWeight +
      colorResult.teamAPerformance * colorWeight +
      seasonalResult.teamASeasonalAdvantage * seasonalWeight +
      scorePatternResult.teamAWinProbability * scoreWeight
    );
    
    teamBWinPercentage = 100 - teamAWinPercentage;
    
    logs.push("Component contributions to final prediction:");
    logs.push(`- Head-to-head: ${teamA} ${(headToHeadResult.teamAWinPercentage * headToHeadWeight).toFixed(1)}% | ${teamB} ${((100 - headToHeadResult.teamAWinPercentage) * headToHeadWeight).toFixed(1)}%`);
    logs.push(`- Stadium: ${teamA} ${(stadiumResult.teamAWinPercentage * stadiumWeight).toFixed(1)}% | ${teamB} ${(stadiumResult.teamBWinPercentage * stadiumWeight).toFixed(1)}%`);
    logs.push(`- Color theory: ${teamA} ${(colorResult.teamAPerformance * colorWeight).toFixed(1)}% | ${teamB} ${(colorResult.teamBPerformance * colorWeight).toFixed(1)}%`);
    logs.push(`- Seasonal: ${teamA} ${(seasonalResult.teamASeasonalAdvantage * seasonalWeight).toFixed(1)}% | ${teamB} ${(seasonalResult.teamBSeasonalAdvantage * seasonalWeight).toFixed(1)}%`);
    logs.push(`- Score pattern: ${teamA} ${(scorePatternResult.teamAWinProbability * scoreWeight).toFixed(1)}% | ${teamB} ${((100 - scorePatternResult.teamAWinProbability) * scoreWeight).toFixed(1)}%`);
  }
  
  // Normalize to ensure they sum to 100%
  const totalPercentage = teamAWinPercentage + teamBWinPercentage;
  teamAWinPercentage = Math.round((teamAWinPercentage / totalPercentage) * 100);
  teamBWinPercentage = 100 - teamAWinPercentage;
  
  logs.push("---------------------------------------------");
  logs.push(`FINAL PREDICTION: ${teamA} ${teamAWinPercentage}% - ${teamB} ${teamBWinPercentage}%`);
  logs.push("---------------------------------------------");
  
  return {
    teamAWinPercentage,
    teamBWinPercentage,
    factors: {
      headToHead: {
        teamAWins: headToHeadResult.teamAWins,
        teamBWins: headToHeadResult.teamBWins,
        teamAWinPercentage: headToHeadResult.teamAWinPercentage
      },
      stadiumAdvantage: {
        teamAWinPercentage: stadiumResult.teamAWinPercentage,
        teamBWinPercentage: stadiumResult.teamBWinPercentage
      },
      colorTheory: {
        teamAPerformance: colorResult.teamAPerformance,
        teamBPerformance: colorResult.teamBPerformance
      },
      seasonalFactor: {
        teamASeasonalAdvantage: seasonalResult.teamASeasonalAdvantage,
        teamBSeasonalAdvantage: seasonalResult.teamBSeasonalAdvantage
      },
      ...(predictionMode === "post-innings" ? {
        scorePattern: {
          teamAWinProbability: scorePatternResult.teamAWinProbability
        }
      } : {})
    },
    logs
  };
}
