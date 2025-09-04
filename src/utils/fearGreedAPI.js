// Real Fear & Greed Index API using alternative.me
export const fetchFearGreedIndex = async () => {
  try {
    // Use the official alternative.me API for Fear & Greed Index
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      const fearGreedData = data.data[0];
      return {
        value: parseInt(fearGreedData.value),
        classification: getFearGreedClassification(parseInt(fearGreedData.value)),
        timestamp: Date.now(),
        rawData: fearGreedData
      };
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (error) {
    console.error('Error fetching real Fear & Greed Index:', error);
    
    // Only as absolute fallback if API fails, return null to avoid dummy data
    return null;
  }
};

export const getFearGreedClassification = (value) => {
  if (value <= 20) return 'Extreme Fear';
  if (value <= 40) return 'Fear';
  if (value <= 60) return 'Neutral';
  if (value <= 80) return 'Greed';
  return 'Extreme Greed';
};

export const getFearGreedColor = (value) => {
  if (value <= 20) return '#ef4444'; // red-500
  if (value <= 40) return '#f97316'; // orange-500
  if (value <= 60) return '#eab308'; // yellow-500
  if (value <= 80) return '#84cc16'; // lime-500
  return '#22c55e'; // green-500
};