// Cricket data types
export interface Team {
  name: string;
  shortName?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface Stadium {
  name: string;
  city: string;
  country: string;
}

export interface MatchData {
  teamA: string;
  teamB: string;
  winner: string;
  matchFormat: string;
  gender: string;
  matchDate: string;
  stadium: string;
  teamAScore?: number;
  teamBScore?: number;
}

export interface TeamColor {
  teamName: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface DayColor {
  day: string;
  colorHex: string;
  colorName: string;
}

export interface PredictionResult {
  teamAWinPercentage: number;
  teamBWinPercentage: number;
  factors: {
    headToHead: {
      teamAWins: number;
      teamBWins: number;
      teamAWinPercentage: number;
    };
    stadiumAdvantage: {
      teamAWinPercentage: number;
      teamBWinPercentage: number;
    };
    colorTheory: {
      teamAPerformance: number;
      teamBPerformance: number;
    };
    seasonalFactor: {
      teamASeasonalAdvantage: number;
      teamBSeasonalAdvantage: number;
    };
    scorePattern?: {
      teamAWinProbability: number;
    };
  };
  logs: string[];
}

export interface WeatherData {
  city: string;
  rainProbability: number[];
  temperature: number;
  conditions: string;
  forecastHours: number;
}

// Auth types
export interface AuthUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Message types
export interface UserMessage {
  id: number;
  userId: number;
  content: string;
  fromAdmin: boolean;
  read: boolean;
  createdAt: Date;
}
