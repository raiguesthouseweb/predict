import { getHeadToHead } from "../csvParser";

/**
 * Analyzes head-to-head records between two teams
 */
export async function analyzeHeadToHead(
  teamA: string,
  teamB: string,
  matchFormat: string,
  gender: string
): Promise<{ teamAWins: number; teamBWins: number; teamAWinPercentage: number }> {
  try {
    // Get head-to-head matches
    const h2hMatches = await getHeadToHead(teamA, teamB, matchFormat, gender);
    
    if (!h2hMatches || h2hMatches.length === 0) {
      // If no head-to-head data, return neutral 50/50
      return {
        teamAWins: 0,
        teamBWins: 0,
        teamAWinPercentage: 50
      };
    }
    
    // Count wins for each team
    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;
    
    h2hMatches.forEach(match => {
      if (match.winner === teamA) {
        teamAWins++;
      } else if (match.winner === teamB) {
        teamBWins++;
      } else {
        draws++; // Handle draws or no result
      }
    });
    
    // Calculate Team A win percentage, excluding draws
    const totalDecisiveMatches = teamAWins + teamBWins;
    
    if (totalDecisiveMatches === 0) {
      // If all matches were draws, return neutral 50/50
      return {
        teamAWins: 0,
        teamBWins: 0,
        teamAWinPercentage: 50
      };
    }
    
    const teamAWinPercentage = Math.round((teamAWins / totalDecisiveMatches) * 100);
    
    return {
      teamAWins,
      teamBWins,
      teamAWinPercentage
    };
  } catch (error) {
    console.error("Error in head-to-head analysis:", error);
    
    // Return neutral 50/50 in case of error
    return {
      teamAWins: 0,
      teamBWins: 0,
      teamAWinPercentage: 50
    };
  }
}
