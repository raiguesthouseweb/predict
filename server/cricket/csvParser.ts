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
  return parseCSV("Teams.csv");
}

// Search teams by name
export async function searchTeams(query: string): Promise<string[]> {
  const teams = await getTeams();
  const searchLower = query.toLowerCase();
  
  return teams
    .filter(team => team.name.toLowerCase().includes(searchLower))
    .map(team => team.name);
}

// Get team colors
export async function getTeamColors(): Promise<TeamColor[]> {
  return parseCSV("team colors.csv");
}

// Get day colors
export async function getDayColors(): Promise<DayColor[]> {
  return parseCSV("day colors.csv");
}

// Get match index for format and gender
export async function getMatchIndex(): Promise<any[]> {
  return parseCSV("Index.csv");
}

// Get filename for match format and gender
export async function getMatchFilename(format: string, gender: string): Promise<string | null> {
  const indexData = await getMatchIndex();
  
  const matchEntry = indexData.find(
    entry => entry.Format === format && entry.Gender === gender
  );
  
  return matchEntry ? matchEntry.Filename : null;
}

// Get match data for specific format and gender
export async function getMatchData(format: string, gender: string): Promise<MatchData[]> {
  const filename = await getMatchFilename(format, gender);
  
  if (!filename) {
    console.error(`No match file found for ${format} ${gender}`);
    return [];
  }
  
  return parseCSV(filename);
}

// Search stadiums from match data
export async function searchStadiums(query: string, format: string, gender: string): Promise<string[]> {
  const matchData = await getMatchData(format, gender);
  const searchLower = query.toLowerCase();
  
  // Extract unique stadiums that match the query
  const stadiums = new Set<string>();
  
  matchData.forEach(match => {
    if (match.stadium && match.stadium.toLowerCase().includes(searchLower)) {
      stadiums.add(match.stadium);
    }
  });
  
  return Array.from(stadiums);
}

// Get match history between two teams
export async function getHeadToHead(teamA: string, teamB: string, format: string, gender: string): Promise<MatchData[]> {
  const matchData = await getMatchData(format, gender);
  
  return matchData.filter(match => 
    (match.teamA === teamA && match.teamB === teamB) ||
    (match.teamA === teamB && match.teamB === teamA)
  );
}

// Get matches at a specific stadium
export async function getStadiumMatches(stadium: string, format: string, gender: string): Promise<MatchData[]> {
  const matchData = await getMatchData(format, gender);
  
  return matchData.filter(match => match.stadium === stadium);
}
