import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { MatchData, Team, Stadium, TeamColor, DayColor } from "@shared/types";
import { fileURLToPath } from 'url';

// Base directory for cricket data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "cricket", "data");

// Cache for parsed CSV data
const dataCache: Record<string, any[]> = {};

// Parse CSV file and cache the results
export async function parseCSV(filename: string): Promise<any[]> {
  const filePath = path.join(DATA_DIR, filename);
  
  // Return cached data if exists
  if (dataCache[filename]) {
    return dataCache[filename];
  }
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    
    // Read and parse CSV file
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Cache the parsed data
    dataCache[filename] = records;
    
    return records;
  } catch (error) {
    console.error(`Error parsing CSV file ${filename}:`, error);
    return [];
  }
}

// Clear cache for a specific file
export function clearCache(filename?: string) {
  if (filename) {
    delete dataCache[filename];
  } else {
    // Clear all cache
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
  }
}

// Get all available teams
export async function getTeams(): Promise<Team[]> {
  const teamsData = await parseCSV("Teams.csv");
  // Format the raw data into the expected Team structure
  return teamsData.map(item => ({
    name: item.Team || "",
    shortName: item.ShortName || ""
  }));
}

// Search teams by name
export async function searchTeams(query: string): Promise<string[]> {
  const teams = await getTeams();
  const searchLower = query.toLowerCase();
  
  return teams
    .filter(team => team.name && team.name.toLowerCase().includes(searchLower))
    .map(team => team.name);
}

// Get team colors
export async function getTeamColors(): Promise<TeamColor[]> {
  const colorsData = await parseCSV("team colors.csv");
  return colorsData.map(item => ({
    teamName: item["Team Name"] || "",
    primaryColor: item["Jersey - Color 1"] ? item["Jersey - Color 1"].split("#")[1] || "" : "",
    secondaryColor: item["Jersey - Color 2"] ? item["Jersey - Color 2"].split("#")[1] || "" : ""
  }));
}

// Get day colors
export async function getDayColors(): Promise<DayColor[]> {
  const daysData = await parseCSV("day colors.csv");
  return daysData
    .filter(item => item["दिन"] && item["Hex Code"])
    .map(item => ({
      day: translateDayToEnglish(item["दिन"] || ""),
      colorHex: item["Hex Code"] || "",
      colorName: item["रंग"] || ""
    }));
}

// Helper to translate Hindi day names to English
function translateDayToEnglish(hindiDay: string): string {
  const translations: Record<string, string> = {
    "सोमवार": "Monday",
    "मंगलवार": "Tuesday", 
    "बुधवार": "Wednesday",
    "गुरुवार": "Thursday",
    "शुक्रवार": "Friday",
    "शनिवार": "Saturday",
    "रविवार": "Sunday"
  };
  
  return translations[hindiDay] || hindiDay;
}

// Get match index for format and gender
export async function getMatchIndex(): Promise<any[]> {
  return parseCSV("Index.csv");
}

// Get filename for match format and gender
export async function getMatchFilename(format: string, gender: string): Promise<string | null> {
  const indexData = await getMatchIndex();
  
  const matchEntry = indexData.find(
    entry => 
      entry.Format && 
      entry.Gendre && 
      entry.Format.toLowerCase() === format.toLowerCase() && 
      entry.Gendre.toLowerCase() === gender.toLowerCase() &&
      entry["File Name"]
  );

  if (matchEntry) {
    return matchEntry["File Name"];
  } else {
    // Log the available formats and genders for debugging
    console.log('Available matches in index:');
    indexData.forEach(entry => {
      console.log(`Format: ${entry.Format}, Gender: ${entry.Gendre}, File: ${entry["File Name"]}`);
    });
    
    // Fallback to direct file mapping based on format
    if (format.toLowerCase() === 'odi') {
      return 'ODI.csv';
    } else if (format.toLowerCase() === 't20') {
      return 'T20.csv';
    }
    
    return null;
  }
}

// Get match data for specific format and gender
export async function getMatchData(format: string, gender: string): Promise<MatchData[]> {
  const filename = await getMatchFilename(format, gender);
  
  if (!filename) {
    console.error(`No match file found for ${format} ${gender}`);
    return [];
  }
  
  const rawData = await parseCSV(filename);
  
  return rawData.map(match => {
    // Extract teams from "Teams" column which has format like "Team A vs Team B"
    let teamA = "";
    let teamB = "";
    
    if (match.Teams && typeof match.Teams === 'string') {
      const teams = match.Teams.split(" vs ");
      teamA = teams[0] ? teams[0].trim() : "";
      teamB = teams[1] ? teams[1].trim() : "";
    }
    
    // Standardize stadium info
    let stadium = "";
    if (match.Venue && typeof match.Venue === 'string') {
      // Venues often look like "Stadium Name, City", so we just take the first part
      const venueParts = match.Venue.split(",");
      stadium = venueParts[0] ? venueParts[0].trim() : match.Venue.trim();
      
      // Remove quotes if they exist
      stadium = stadium.replace(/^"(.*)"$/, '$1');
    }
    
    // Extract the winner
    const winner = match.WINNER ? match.WINNER.trim() : "";
    
    return {
      teamA,
      teamB,
      winner,
      matchFormat: format,
      gender,
      matchDate: match.Date || "",
      stadium,
      teamAScore: 0, // Add proper parsing logic if needed
      teamBScore: 0  // Add proper parsing logic if needed
    };
  }).filter(match => match.teamA && match.teamB); // Filter out matches with missing team info
}

// Get all stadiums from all formats and genders
export async function getAllStadiums(): Promise<string[]> {
  // We'll collect stadiums from both ODI and T20 formats, both male and female
  const formats = ["ODI", "T20"];
  const genders = ["Male", "Female"];
  
  const stadiumsSet = new Set<string>();
  
  for (const format of formats) {
    for (const gender of genders) {
      const matchData = await getMatchData(format, gender);
      
      matchData.forEach(match => {
        if (match.stadium && match.stadium.trim() !== '') {
          stadiumsSet.add(match.stadium);
        }
      });
    }
  }
  
  return Array.from(stadiumsSet).sort();
}

// Search stadiums from all match data
export async function searchStadiums(query: string, format: string, gender: string): Promise<string[]> {
  const allStadiums = await getAllStadiums();
  const searchLower = query.toLowerCase();
  
  return allStadiums.filter(stadium => 
    stadium.toLowerCase().includes(searchLower)
  );
}

// Get match history between two teams
export async function getHeadToHead(teamA: string, teamB: string, format: string, gender: string): Promise<MatchData[]> {
  const matchData = await getMatchData(format, gender);
  
  return matchData.filter(match => 
    (match.teamA === teamA && match.teamB === teamB) ||
    (match.teamA === teamB && match.teamB === teamA)
  );
}

// Get match history between two teams (from all formats/genders)
export async function getAllHeadToHead(teamA: string, teamB: string): Promise<MatchData[]> {
  // We'll collect matches from both ODI and T20 formats, both male and female
  const formats = ["ODI", "T20"];
  const genders = ["Male", "Female"];
  
  let allMatches: MatchData[] = [];
  
  for (const format of formats) {
    for (const gender of genders) {
      const matches = await getHeadToHead(teamA, teamB, format, gender);
      allMatches = [...allMatches, ...matches];
    }
  }
  
  return allMatches;
}

// Get matches at a specific stadium
export async function getStadiumMatches(stadium: string, format: string, gender: string): Promise<MatchData[]> {
  const matchData = await getMatchData(format, gender);
  
  return matchData.filter(match => match.stadium === stadium);
}

// Get city from stadium name
export async function getCityFromStadium(stadium: string): Promise<string> {
  // Find a match with this stadium
  const formats = ["ODI", "T20"];
  const genders = ["Male", "Female"];
  
  for (const format of formats) {
    for (const gender of genders) {
      try {
        // Get the raw data to access the Venue field
        const filename = await getMatchFilename(format, gender);
        if (!filename) continue;
        
        const rawData = await parseCSV(filename);
        
        // Look for a match with this stadium
        for (const matchRow of rawData) {
          const matchVenue = matchRow.Venue || "";
          
          if (typeof matchVenue === 'string' && 
              matchVenue.includes(stadium) && 
              matchVenue.includes(',')) {
            // Venue format is usually "Stadium Name, City"
            const parts = matchVenue.split(',');
            if (parts.length > 1) {
              return parts[1].trim();
            }
          }
        }
      } catch (error) {
        console.error(`Error finding city for stadium ${stadium}:`, error);
      }
    }
  }
  
  // If no city found, return the stadium name as fallback
  return stadium;
}
