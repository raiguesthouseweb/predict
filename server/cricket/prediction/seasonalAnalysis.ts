import { getMatchData } from "../csvParser";
import { MatchData } from "@shared/types";

/**
 * Analyzes team performance based on season/month
 */
export async function analyzeSeasonalFactor(
  teamA: string,
  teamB: string,
  matchDate: string,
  matchFormat: string,
  gender: string
): Promise<{ teamASeasonalAdvantage: number; teamBSeasonalAdvantage: number }> {
  try {
    // Extract month from match date
    const date = new Date(matchDate);
    const month = date.getMonth() + 1; // 1-12
    
    // Get all matches for the format and gender
    const allMatches = await getMatchData(matchFormat, gender);
    
    if (!allMatches || allMatches.length === 0) {
      // Return neutral values if no data
      return {
        teamASeasonalAdvantage: 50,
        teamBSeasonalAdvantage: 50
      };
    }
    
    // Get all matches for each team
    const teamAMatches = allMatches.filter(match => 
      match.teamA === teamA || match.teamB === teamA
    );
    
    const teamBMatches = allMatches.filter(match => 
      match.teamA === teamB || match.teamB === teamB
    );
    
    // Get monthly performance for each team
    const teamAMonthlyPerformance = calculateMonthlyPerformance(teamA, teamAMatches);
    const teamBMonthlyPerformance = calculateMonthlyPerformance(teamB, teamBMatches);
    
    // Get performance for the target month
    const teamAMonthPerformance = teamAMonthlyPerformance[month] || 50;
    const teamBMonthPerformance = teamBMonthlyPerformance[month] || 50;
    
    return {
      teamASeasonalAdvantage: teamAMonthPerformance,
      teamBSeasonalAdvantage: teamBMonthPerformance
    };
  } catch (error) {
    console.error("Error in seasonal analysis:", error);
    
    // Return neutral values in case of error
    return {
      teamASeasonalAdvantage: 50,
      teamBSeasonalAdvantage: 50
    };
  }
}

/**
 * Calculates win percentage by month for a team
 */
function calculateMonthlyPerformance(team: string, matches: MatchData[]): Record<number, number> {
  // Initialize monthly performance object (months 1-12)
  const monthlyPerformance: Record<number, number> = {};
  
  // Count matches and wins by month
  const monthMatches: Record<number, number> = {};
  const monthWins: Record<number, number> = {};
  
  matches.forEach(match => {
    // Get match month
    const matchDate = new Date(match.matchDate);
    const month = matchDate.getMonth() + 1; // 1-12
    
    // Increment match count for month
    monthMatches[month] = (monthMatches[month] || 0) + 1;
    
    // Check if team won
    if (match.winner === team) {
      // Increment win count for month
      monthWins[month] = (monthWins[month] || 0) + 1;
    }
  });
  
  // Calculate win percentage for each month
  for (let month = 1; month <= 12; month++) {
    if (monthMatches[month] && monthMatches[month] > 0) {
      const winPercentage = (monthWins[month] || 0) / monthMatches[month] * 100;
      monthlyPerformance[month] = Math.round(winPercentage);
    } else {
      // No data for this month, use 50% as neutral
      monthlyPerformance[month] = 50;
    }
  }
  
  return monthlyPerformance;
}
