import { PredictionFormValues } from '@shared/schema';
import { PredictionResult } from '@shared/types';
import { apiRequest } from './queryClient';

export const savePrediction = async (
  predictionData: PredictionFormValues, 
  result: PredictionResult,
  weatherData?: any
) => {
  try {
    const saveData = {
      ...predictionData,
      teamAWinPercentage: result.teamAWinPercentage,
      teamBWinPercentage: result.teamBWinPercentage,
      predictionData: result,
      weatherData: weatherData || null
    };
    
    const response = await apiRequest('POST', '/api/predictions/save', saveData);
    return await response.json();
  } catch (error) {
    console.error('Error saving prediction:', error);
    throw error;
  }
};

export const getUserPredictions = async () => {
  try {
    const response = await fetch('/api/predictions/user', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching predictions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user predictions:', error);
    throw error;
  }
};

export const exportPredictionAsPDF = (
  teamA: string,
  teamB: string,
  teamAWinPercentage: number,
  teamBWinPercentage: number,
  weatherData?: any
) => {
  // In a real implementation, this would generate and download a PDF
  // For now we'll just display a message
  console.log('Export prediction as PDF:', {
    teamA, 
    teamB, 
    teamAWinPercentage, 
    teamBWinPercentage,
    weatherData
  });
  
  alert('PDF export functionality will be implemented in a future update.');
};
