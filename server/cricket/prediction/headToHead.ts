import { getHeadToHead } from "../csvParser";

interface HeadToHeadResult {
  teamAWins: number;
  teamBWins: number;
  teamAWinPercentage: number;
  totalMatches?: number;
  draws?: number;
  recentForm?: {
    teamA: string[];
    teamB: string[];
  };
  detailedLogs?: string[];
}

/**
 * Analyzes head-to-head records between two teams with enhanced logging
 */
export async function analyzeHeadToHead(
  teamA: string,
  teamB: string,
  matchFormat: string,
  gender: string
): Promise<HeadToHeadResult> {
  const detailedLogs: string[] = [];
  
  try {
    // Get head-to-head matches
    const h2hMatches = await getHeadToHead(teamA, teamB, matchFormat, gender);
    detailedLogs.push(`Found ${h2hMatches.length} head-to-head matches between ${teamA} and ${teamB} in ${matchFormat} (${gender})`);
    
    if (!h2hMatches || h2hMatches.length === 0) {
      // If no head-to-head data, return neutral 50/50
      detailedLogs.push(`No historical data found. Using neutral 50/50 prediction baseline.`);
      return {
        teamAWins: 0,
        teamBWins: 0,
        teamAWinPercentage: 50,
        totalMatches: 0,
        draws: 0,
        detailedLogs
      };
    }
    
    // Count wins for each team
    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;
    
    // Recent form tracking (last 5 matches, most recent first)
    const teamAForm: string[] = [];
    const teamBForm: string[] = [];
    
    // Sort matches by date (most recent first) if date field is available
    if (h2hMatches[0].matchDate) {
      h2hMatches.sort((a, b) => {
        return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
      });
      detailedLogs.push(`Matches sorted by date, analyzing from most recent to oldest`);
    }
    
    h2hMatches.forEach((match, index) => {
      if (match.winner === teamA) {
        teamAWins++;
        if (index < 5) {
          teamAForm.push('W');
          teamBForm.push('L');
        }
      } else if (match.winner === teamB) {
        teamBWins++;
        if (index < 5) {
          teamAForm.push('L');
          teamBForm.push('W');
        }
      } else {
        draws++; // Handle draws or no result
        if (index < 5) {
          teamAForm.push('D');
          teamBForm.push('D');
        }
      }
    });
    
    detailedLogs.push(`Match Statistics: ${teamA} won ${teamAWins} matches, ${teamB} won ${teamBWins} matches`);
    if (draws > 0) {
      detailedLogs.push(`${draws} matches resulted in a draw or no result`);
    }
    
    // Calculate Team A win percentage, excluding draws
    const totalDecisiveMatches = teamAWins + teamBWins;
    
    if (totalDecisiveMatches === 0) {
      // If all matches were draws, return neutral 50/50
      detailedLogs.push(`All matches were draws. Using neutral 50/50 prediction baseline.`);
      return {
        teamAWins: 0,
        teamBWins: 0,
        teamAWinPercentage: 50,
        totalMatches: h2hMatches.length,
        draws,
        recentForm: {
          teamA: teamAForm,
          teamB: teamBForm
        },
        detailedLogs
      };
    }
    
    const teamAWinPercentage = Math.round((teamAWins / totalDecisiveMatches) * 100);
    
    // Add recent form analysis
    if (teamAForm.length > 0) {
      detailedLogs.push(`Recent form for ${teamA}: ${teamAForm.join(', ')}`);
      detailedLogs.push(`Recent form for ${teamB}: ${teamBForm.join(', ')}`);
    }
    
    detailedLogs.push(`Head-to-head win percentage: ${teamA} ${teamAWinPercentage}% - ${teamB} ${100-teamAWinPercentage}%`);
    
    return {
      teamAWins,
      teamBWins,
      teamAWinPercentage,
      totalMatches: h2hMatches.length,
      draws,
      recentForm: {
        teamA: teamAForm,
        teamB: teamBForm
      },
      detailedLogs
    };
  } catch (error) {
    console.error("Error in head-to-head analysis:", error);
    detailedLogs.push(`Error analyzing head-to-head data: ${error}`);
    detailedLogs.push(`Using neutral 50/50 prediction baseline due to error.`);
    
    // Return neutral 50/50 in case of error
    return {
      teamAWins: 0,
      teamBWins: 0,
      teamAWinPercentage: 50,
      detailedLogs
    };
  }
}
