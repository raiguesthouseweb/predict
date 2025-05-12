/**
 * Analyzes first innings score patterns to predict winning probability
 */
export async function analyzeScorePattern(
  teamAScore: number,
  matchFormat: string
): Promise<{ teamAWinProbability: number }> {
  try {
    // Statistical analysis of first innings score and win probability
    // Based on typical winning scores in different formats
    
    // For T20 matches
    if (matchFormat === 'T20') {
      return calculateT20ScoreProbability(teamAScore);
    }
    
    // For ODI matches
    if (matchFormat === 'ODI') {
      return calculateODIScoreProbability(teamAScore);
    }
    
    // Default case - should not reach here
    return { teamAWinProbability: 50 };
  } catch (error) {
    console.error("Error in score pattern analysis:", error);
    
    // Return neutral value in case of error
    return { teamAWinProbability: 50 };
  }
}

/**
 * Calculates win probability based on T20 first innings score
 */
function calculateT20ScoreProbability(score: number): { teamAWinProbability: number } {
  // Parse score into digits
  const scoreString = score.toString();
  const lastDigit = parseInt(scoreString[scoreString.length - 1]);
  
  // Special case for numbers ending with lucky or unlucky digits
  let digitFactor = 0;
  
  // Consider 7 as lucky digit (+5%)
  if (lastDigit === 7) {
    digitFactor = 5;
  }
  // Consider 0, 1, 4 as slightly negative (-2%)
  else if (lastDigit === 0 || lastDigit === 1 || lastDigit === 4) {
    digitFactor = -2;
  }
  
  let probability = 50; // Starting point
  
  // T20 scoring brackets and corresponding win probabilities
  if (score < 120) {
    // Very low score, unlikely to win
    probability = 20 + (score - 100) / 2;
  } 
  else if (score >= 120 && score < 140) {
    // Below par score
    probability = 35 + (score - 120) / 2;
  }
  else if (score >= 140 && score < 160) {
    // Par score
    probability = 45 + (score - 140) / 2;
  }
  else if (score >= 160 && score < 180) {
    // Good score
    probability = 55 + (score - 160) / 2;
  }
  else if (score >= 180 && score < 200) {
    // Very good score
    probability = 65 + (score - 180) / 2;
  }
  else if (score >= 200 && score < 220) {
    // Excellent score
    probability = 75 + (score - 200) / 4;
  }
  else if (score >= 220) {
    // Exceptional score
    probability = 85 + Math.min((score - 220) / 10, 10);
  }
  
  // Apply digit factor
  probability += digitFactor;
  
  // Ensure probability is between 0 and 100
  probability = Math.max(0, Math.min(100, probability));
  
  return { teamAWinProbability: Math.round(probability) };
}

/**
 * Calculates win probability based on ODI first innings score
 */
function calculateODIScoreProbability(score: number): { teamAWinProbability: number } {
  // Parse score into digits
  const scoreString = score.toString();
  const lastDigit = parseInt(scoreString[scoreString.length - 1]);
  
  // Special case for numbers ending with lucky or unlucky digits
  let digitFactor = 0;
  
  // Consider 7 as lucky digit (+5%)
  if (lastDigit === 7) {
    digitFactor = 5;
  }
  // Consider 0, 1, 4 as slightly negative (-2%)
  else if (lastDigit === 0 || lastDigit === 1 || lastDigit === 4) {
    digitFactor = -2;
  }
  
  let probability = 50; // Starting point
  
  // ODI scoring brackets and corresponding win probabilities
  if (score < 200) {
    // Very low score, unlikely to win
    probability = 15 + (score - 150) / 5;
  } 
  else if (score >= 200 && score < 250) {
    // Below par score
    probability = 30 + (score - 200) / 5;
  }
  else if (score >= 250 && score < 300) {
    // Par score
    probability = 40 + (score - 250) / 5;
  }
  else if (score >= 300 && score < 350) {
    // Good score
    probability = 60 + (score - 300) / 5;
  }
  else if (score >= 350 && score < 400) {
    // Very good score
    probability = 75 + (score - 350) / 10;
  }
  else if (score >= 400) {
    // Exceptional score
    probability = 85 + Math.min((score - 400) / 20, 15);
  }
  
  // Apply digit factor
  probability += digitFactor;
  
  // Ensure probability is between 0 and 100
  probability = Math.max(0, Math.min(100, probability));
  
  return { teamAWinProbability: Math.round(probability) };
}
