import { TeamColor, DayColor } from "@shared/types";

/**
 * Analyzes team performance based on color theory
 * - Compares team jersey colors with day of the week colors
 * - Calculates color clash and similar-color performance
 */
export async function analyzeColorTheory(
  teamA: string,
  teamB: string,
  matchDate: string,
  teamColors: TeamColor[],
  dayColors: DayColor[]
): Promise<{ teamAPerformance: number; teamBPerformance: number }> {
  try {
    // Find team colors
    const teamAColor = findTeamColor(teamA, teamColors);
    const teamBColor = findTeamColor(teamB, teamColors);
    
    // Get day of the week from match date
    const date = new Date(matchDate);
    const dayOfWeek = getDayOfWeek(date);
    
    // Find day color
    const dayColor = findDayColor(dayOfWeek, dayColors);
    
    // Calculate color compatibility scores
    const teamADayCompatibility = calculateColorCompatibility(teamAColor?.primaryColor, dayColor?.colorHex);
    const teamBDayCompatibility = calculateColorCompatibility(teamBColor?.primaryColor, dayColor?.colorHex);
    
    // Calculate color clash between teams
    const teamColorClash = calculateColorClash(teamAColor?.primaryColor, teamBColor?.primaryColor);
    
    // Calculate final performance scores (0-100 scale)
    // Higher day compatibility = better performance
    // Lower color clash with opponent = better performance
    let teamAPerformance = 50; // Neutral starting point
    let teamBPerformance = 50;
    
    if (teamADayCompatibility !== null && teamBDayCompatibility !== null) {
      // Adjust based on day compatibility (±15 points)
      const dayCompatibilityFactor = 15;
      teamAPerformance += (teamADayCompatibility - 0.5) * 2 * dayCompatibilityFactor;
      teamBPerformance += (teamBDayCompatibility - 0.5) * 2 * dayCompatibilityFactor;
      
      // Adjust based on color clash (±10 points)
      if (teamColorClash !== null) {
        const colorClashFactor = 10;
        // Lower color clash is better for the dominant team (with higher day compatibility)
        if (teamADayCompatibility > teamBDayCompatibility) {
          teamAPerformance += (1 - teamColorClash) * colorClashFactor;
          teamBPerformance -= (1 - teamColorClash) * colorClashFactor;
        } else {
          teamBPerformance += (1 - teamColorClash) * colorClashFactor;
          teamAPerformance -= (1 - teamColorClash) * colorClashFactor;
        }
      }
    }
    
    // Ensure values are in 0-100 range
    teamAPerformance = Math.max(0, Math.min(100, teamAPerformance));
    teamBPerformance = Math.max(0, Math.min(100, teamBPerformance));
    
    return {
      teamAPerformance: Math.round(teamAPerformance),
      teamBPerformance: Math.round(teamBPerformance)
    };
  } catch (error) {
    console.error("Error in color theory analysis:", error);
    // Return neutral values in case of error
    return {
      teamAPerformance: 50,
      teamBPerformance: 50
    };
  }
}

// Helper: Find team color from team name
function findTeamColor(teamName: string, teamColors: TeamColor[]): TeamColor | undefined {
  if (!teamName || !teamColors || teamColors.length === 0) {
    return undefined;
  }
  return teamColors.find(color => 
    color.teamName && 
    teamName && 
    color.teamName.toLowerCase() === teamName.toLowerCase()
  );
}

// Helper: Find day color from day of the week
function findDayColor(dayOfWeek: string, dayColors: DayColor[]): DayColor | undefined {
  return dayColors.find(color => color.day.toLowerCase() === dayOfWeek.toLowerCase());
}

// Helper: Get day of the week from date
function getDayOfWeek(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

// Helper: Calculate color compatibility (0-1 scale)
function calculateColorCompatibility(color1?: string, color2?: string): number | null {
  if (!color1 || !color2) return null;
  
  try {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return null;
    
    // Calculate color distance (0-1 scale where 0 is identical and 1 is completely different)
    const distance = colorDistance(rgb1, rgb2);
    
    // Convert to compatibility (0-1 scale where 1 is highly compatible)
    // We're using a bell curve here - colors that are moderately different are most compatible
    // Colors that are too similar or too different are less compatible
    const compatibility = 1 - Math.abs(distance - 0.5) * 2;
    
    return compatibility;
  } catch (error) {
    console.error("Error calculating color compatibility:", error);
    return null;
  }
}

// Helper: Calculate color clash (0-1 scale)
function calculateColorClash(color1?: string, color2?: string): number | null {
  if (!color1 || !color2) return null;
  
  try {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return null;
    
    // Calculate color distance (0-1 scale)
    // 0 means identical colors, 1 means completely different
    return colorDistance(rgb1, rgb2);
  } catch (error) {
    console.error("Error calculating color clash:", error);
    return null;
  }
}

// Helper: Convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Helper: Calculate color distance (0-1 scale)
function colorDistance(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  // Normalize RGB values to 0-1
  const r1 = color1.r / 255;
  const g1 = color1.g / 255;
  const b1 = color1.b / 255;
  const r2 = color2.r / 255;
  const g2 = color2.g / 255;
  const b2 = color2.b / 255;
  
  // Calculate Euclidean distance
  const distance = Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
  );
  
  // Normalize to 0-1 (max possible distance is sqrt(3))
  return distance / Math.sqrt(3);
}
