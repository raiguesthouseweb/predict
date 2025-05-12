import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { MatchData, Team, Stadium, TeamColor, DayColor } from '@shared/types';
import { fileURLToPath } from 'url';

// Base path for data files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname);

/**
 * Parse CSV file
 */
export function parseCSV<T>(filePath: string): T[] {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    
    // Read and parse CSV file
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as T[];
    
    return records;
  } catch (error) {
    console.error(`Error parsing CSV file ${filePath}:`, error);
    return [];
  }
}

/**
 * Write data to CSV file
 */
export function writeCSV<T>(filePath: string, data: T[]): boolean {
  try {
    const csvContent = stringify(data, { header: true });
    fs.writeFileSync(filePath, csvContent);
    return true;
  } catch (error) {
    console.error(`Error writing CSV file ${filePath}:`, error);
    return false;
  }
}

/**
 * Get all teams
 */
export function getTeams(): Team[] {
  const filePath = path.join(DATA_DIR, 'Teams.csv');
  return parseCSV<Team>(filePath);
}

/**
 * Get team colors
 */
export function getTeamColors(): TeamColor[] {
  const filePath = path.join(DATA_DIR, 'team colors.csv');
  return parseCSV<TeamColor>(filePath);
}

/**
 * Get day colors
 */
export function getDayColors(): DayColor[] {
  const filePath = path.join(DATA_DIR, 'day colors.csv');
  return parseCSV<DayColor>(filePath);
}

/**
 * Get match data by format
 */
export function getMatchData(format: string): MatchData[] {
  let filename: string;
  
  switch (format) {
    case 'ODI':
      filename = 'ODI.csv';
      break;
    case 'T20':
      filename = 'T20.csv';
      break;
    case 'BBL T20':
      filename = 'BBL T20.csv';
      break;
    default:
      console.error(`Unknown format: ${format}`);
      return [];
  }
  
  const filePath = path.join(DATA_DIR, filename);
  return parseCSV<MatchData>(filePath);
}

/**
 * Get match index data
 */
export function getMatchIndex(): any[] {
  const filePath = path.join(DATA_DIR, 'Index.csv');
  return parseCSV<any>(filePath);
}

/**
 * Find matches between two teams
 */
export function findHeadToHeadMatches(teamA: string, teamB: string, format: string): MatchData[] {
  const matches = getMatchData(format);
  
  return matches.filter(match => 
    (match.teamA === teamA && match.teamB === teamB) ||
    (match.teamA === teamB && match.teamB === teamA)
  );
}

/**
 * Find matches at a specific stadium
 */
export function findStadiumMatches(stadium: string, format: string): MatchData[] {
  const matches = getMatchData(format);
  
  return matches.filter(match => match.stadium === stadium);
}

/**
 * Generate sample summary of the data
 */
export function generateDataSummary(): any {
  const teams = getTeams();
  const teamColors = getTeamColors();
  const dayColors = getDayColors();
  const matchIndex = getMatchIndex();
  const odiMatches = getMatchData('ODI');
  const t20Matches = getMatchData('T20');
  
  return {
    teams: teams.length,
    teamColors: teamColors.length,
    dayColors: dayColors.length,
    matchIndex: matchIndex.length,
    odiMatches: odiMatches.length,
    t20Matches: t20Matches.length
  };
}
