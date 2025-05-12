import { getStadiumMatches } from "../csvParser";

interface StadiumAnalysisResult {
  teamAWinPercentage: number;
  teamBWinPercentage: number;
  teamAMatches?: number;
  teamBMatches?: number;
  teamAWins?: number;
  teamBWins?: number;
  detailedLogs?: string[];
}

/**
 * Analyzes team performance at a specific stadium with detailed logs
 */
export async function analyzeStadium(
  teamA: string,
  teamB: string,
  stadium: string,
  matchFormat: string,
  gender: string
): Promise<StadiumAnalysisResult> {
  const detailedLogs: string[] = [];
  
  try {
    // Get all matches at the stadium
    const stadiumMatches = await getStadiumMatches(stadium, matchFormat, gender);
    detailedLogs.push(`Found ${stadiumMatches.length} matches at ${stadium} for ${matchFormat} (${gender})`);
    
    if (!stadiumMatches || stadiumMatches.length === 0) {
      // If no stadium data, return neutral 50/50
      detailedLogs.push(`No historical data found for ${stadium}. Using neutral 50/50 prediction baseline.`);
      return {
        teamAWinPercentage: 50,
        teamBWinPercentage: 50,
        teamAMatches: 0,
        teamBMatches: 0,
        teamAWins: 0,
        teamBWins: 0,
        detailedLogs
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
    
    detailedLogs.push(`${teamA} has played ${teamAMatches.length} matches at this venue`);
    detailedLogs.push(`${teamB} has played ${teamBMatches.length} matches at this venue`);
    
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
      detailedLogs.push(`${teamA} has won ${teamAWins} out of ${teamATotal} matches at this venue (${Math.round((teamAWins / teamATotal) * 100)}% win rate)`);
    } else {
      detailedLogs.push(`${teamA} has not played any matches at this venue`);
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
      detailedLogs.push(`${teamB} has won ${teamBWins} out of ${teamBTotal} matches at this venue (${Math.round((teamBWins / teamBTotal) * 100)}% win rate)`);
    } else {
      detailedLogs.push(`${teamB} has not played any matches at this venue`);
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
      
      detailedLogs.push(`Weighted stadium advantage: ${teamA} ${normalizedTeamA}% - ${teamB} ${normalizedTeamB}%`);
      
      return {
        teamAWinPercentage: normalizedTeamA,
        teamBWinPercentage: normalizedTeamB,
        teamAMatches: teamATotal,
        teamBMatches: teamBTotal,
        teamAWins,
        teamBWins,
        detailedLogs
      };
    }
    
    if (teamATotal === 0 && teamBTotal === 0) {
      detailedLogs.push(`Neither team has played at this venue. Using neutral 50/50 prediction baseline.`);
    } else if (teamATotal === 0) {
      detailedLogs.push(`${teamA} has not played at this venue, using only ${teamB}'s performance data.`);
    } else if (teamBTotal === 0) {
      detailedLogs.push(`${teamB} has not played at this venue, using only ${teamA}'s performance data.`);
    }
    
    detailedLogs.push(`Stadium advantage: ${teamA} ${teamAWinPercentage}% - ${teamB} ${teamBWinPercentage}%`);
    
    return {
      teamAWinPercentage,
      teamBWinPercentage,
      teamAMatches: teamATotal,
      teamBMatches: teamBTotal,
      teamAWins,
      teamBWins,
      detailedLogs
    };
  } catch (error) {
    console.error("Error in stadium analysis:", error);
    detailedLogs.push(`Error analyzing stadium data: ${error}`);
    detailedLogs.push(`Using neutral 50/50 prediction baseline due to error.`);
    
    // Return neutral 50/50 in case of error
    return {
      teamAWinPercentage: 50,
      teamBWinPercentage: 50,
      detailedLogs
    };
  }
}
