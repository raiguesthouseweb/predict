import { getStadiumMatches } from "../csvParser";

/**
 * Analyzes team performance at a specific stadium
 */
export async function analyzeStadium(
  teamA: string,
  teamB: string,
  stadium: string,
  matchFormat: string,
  gender: string
): Promise<{ teamAWinPercentage: number; teamBWinPercentage: number }> {
  try {
    // Get all matches at the stadium
    const stadiumMatches = await getStadiumMatches(stadium, matchFormat, gender);
    
    if (!stadiumMatches || stadiumMatches.length === 0) {
      // If no stadium data, return neutral 50/50
      return {
        teamAWinPercentage: 50,
        teamBWinPercentage: 50
      };
    }
    
    // Filter matches involving Team A
    const teamAMatches = stadiumMatches.filter(match => 
      match.teamA === teamA || match.teamB === teamA
    );
    
    // Filter matches involving Team B
    const teamBMatches = stadiumMatches.filter(match => 
      match.teamA === teamB || match.teamB === teamB
    );
    
    // Calculate Team A win percentage at this stadium
    let teamAWins = 0;
    let teamATotal = teamAMatches.length;
    
    if (teamATotal > 0) {
      teamAMatches.forEach(match => {
        if (
          (match.teamA === teamA && match.winner === teamA) ||
          (match.teamB === teamA && match.winner === teamA)
        ) {
          teamAWins++;
        }
      });
    }
    
    // Calculate Team B win percentage at this stadium
    let teamBWins = 0;
    let teamBTotal = teamBMatches.length;
    
    if (teamBTotal > 0) {
      teamBMatches.forEach(match => {
        if (
          (match.teamA === teamB && match.winner === teamB) ||
          (match.teamB === teamB && match.winner === teamB)
        ) {
          teamBWins++;
        }
      });
    }
    
    // Calculate win percentages
    const teamAWinPercentage = teamATotal > 0
      ? Math.round((teamAWins / teamATotal) * 100)
      : 50;
      
    const teamBWinPercentage = teamBTotal > 0
      ? Math.round((teamBWins / teamBTotal) * 100)
      : 50;
    
    // Balance the percentages when both teams have data
    // This is a weighted average based on number of matches
    if (teamATotal > 0 && teamBTotal > 0) {
      const totalMatches = teamATotal + teamBTotal;
      const weightedTeamA = (teamAWinPercentage * teamATotal / totalMatches);
      const weightedTeamB = (teamBWinPercentage * teamBTotal / totalMatches);
      
      // Normalize so total is 100
      const totalWeighted = weightedTeamA + weightedTeamB;
      const normalizedTeamA = Math.round((weightedTeamA / totalWeighted) * 100);
      const normalizedTeamB = 100 - normalizedTeamA;
      
      return {
        teamAWinPercentage: normalizedTeamA,
        teamBWinPercentage: normalizedTeamB
      };
    }
    
    return {
      teamAWinPercentage,
      teamBWinPercentage
    };
  } catch (error) {
    console.error("Error in stadium analysis:", error);
    
    // Return neutral 50/50 in case of error
    return {
      teamAWinPercentage: 50,
      teamBWinPercentage: 50
    };
  }
}
