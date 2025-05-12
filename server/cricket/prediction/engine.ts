import { PredictionFormValues } from "@shared/schema";
import { PredictionResult, TeamColor, DayColor } from "@shared/types";
import { analyzeHeadToHead } from "./headToHead";
import { analyzeStadium } from "./stadiumAnalysis";
import { analyzeColorTheory } from "./colorTheory";
import { analyzeSeasonalFactor } from "./seasonalAnalysis";
import { analyzeScorePattern } from "./scorePattern";

/**
 * Main prediction engine that combines all factors to generate a match prediction
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
    `Match details: ${matchFormat}, ${gender}, ${stadium}, ${matchDate}`
  ];
  
  // Step 1: Analyze head-to-head record
  logs.push("Analyzing head-to-head record...");
  const headToHeadResult = await analyzeHeadToHead(teamA, teamB, matchFormat, gender);
  
  // Step 2: Analyze stadium factor
  logs.push(`Analyzing performance at ${stadium}...`);
  const stadiumResult = await analyzeStadium(teamA, teamB, stadium, matchFormat, gender);
  
  // Step 3: Analyze color theory (jersey vs day of the week)
  logs.push("Evaluating team jersey colors vs weekday performance...");
  const colorResult = await analyzeColorTheory(teamA, teamB, matchDate, teamColors, dayColors);
  
  // Step 4: Analyze seasonal factor (month performance)
  logs.push("Calculating seasonal performance adjustments...");
  const seasonalResult = await analyzeSeasonalFactor(teamA, teamB, matchDate, matchFormat, gender);
  
  // Step 5: If post-innings, analyze score pattern
  let scorePatternResult = { teamAWinProbability: 50 };
  if (predictionMode === "post-innings" && teamAScore) {
    logs.push(`Analyzing first innings score pattern: ${teamAScore}...`);
    scorePatternResult = await analyzeScorePattern(teamAScore, matchFormat);
  }
  
  // Calculate final win probabilities - weighting factors
  let teamAWinPercentage = 0;
  let teamBWinPercentage = 0;
  
  if (predictionMode === "pre-match") {
    // Pre-match weights
    const headToHeadWeight = 0.35;
    const stadiumWeight = 0.25;
    const colorWeight = 0.15;
    const seasonalWeight = 0.25;
    
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
  } else {
    // Post-innings weights
    const headToHeadWeight = 0.20;
    const stadiumWeight = 0.15;
    const colorWeight = 0.10;
    const seasonalWeight = 0.15;
    const scoreWeight = 0.40;
    
    teamAWinPercentage = (
      headToHeadResult.teamAWinPercentage * headToHeadWeight +
      stadiumResult.teamAWinPercentage * stadiumWeight +
      colorResult.teamAPerformance * colorWeight +
      seasonalResult.teamASeasonalAdvantage * seasonalWeight +
      scorePatternResult.teamAWinProbability * scoreWeight
    );
    
    teamBWinPercentage = 100 - teamAWinPercentage;
  }
  
  // Normalize to ensure they sum to 100%
  const totalPercentage = teamAWinPercentage + teamBWinPercentage;
  teamAWinPercentage = Math.round((teamAWinPercentage / totalPercentage) * 100);
  teamBWinPercentage = 100 - teamAWinPercentage;
  
  logs.push("Finalizing prediction model weights...");
  logs.push(`Prediction complete: ${teamA} ${teamAWinPercentage}% - ${teamB} ${teamBWinPercentage}%`);
  
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
