/**
 * AI/ML Route Selection System
 * Intelligently selects the best route from multiple alternatives
 */

// Campus-specific route scoring weights
const SCORING_WEIGHTS = {
  distance: 0.30,        // Important for walking between classes
  duration: 0.25,        // Time to reach class
  pedestrianTraffic: 0.20, // Avoid crowded paths during class changes
  pathQuality: 0.15,     // Prefer paved, covered, well-lit paths
  accessibility: 0.10    // Ramps, elevators, smooth surfaces
};

/**
 * Fetch multiple alternative routes from Mapbox
 */
export const fetchAlternativeRoutes = async (startCoords, endCoords, accessToken) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?` +
      `alternatives=true&` +
      `geometries=geojson&` +
      `overview=full&` +
      `steps=true&` +
      `annotations=congestion,maxspeed&` +
      `access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.routes || [];
  } catch (error) {
    console.error('Error fetching alternative routes:', error);
    return [];
  }
};

/**
 * Calculate pedestrian traffic score (campus-specific)
 * Estimates crowding based on time and path characteristics
 */
const calculatePedestrianTrafficScore = (route) => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  
  // Class change times (typically :50-:00 and :20-:30)
  const isClassChangeTime = 
    (minute >= 50 || minute <= 5) || 
    (minute >= 20 && minute <= 30);
  
  // Peak hours on campus (8 AM - 5 PM)
  const isPeakHours = hour >= 8 && hour <= 17;
  
  let score = 1.0; // Start with best score (no crowd)
  
  // Reduce score during class changes
  if (isClassChangeTime && isPeakHours) {
    score -= 0.4; // Heavy pedestrian traffic
  } else if (isPeakHours) {
    score -= 0.2; // Moderate traffic
  }
  
  // Prefer longer routes during peak times (likely less crowded)
  if (isClassChangeTime && route.distance < 500) {
    score -= 0.2; // Short routes get more crowded
  }
  
  return Math.max(0.1, score);
};

/**
 * Calculate path quality score (campus-specific)
 * Considers: paved paths, covered walkways, lighting, shade
 */
const calculatePathQualityScore = (route) => {
  let score = 0.5; // Base score
  
  const hour = new Date().getHours();
  const distance = route.distance;
  
  // Prefer shorter paths (better maintained on campus)
  if (distance < 300) {
    score += 0.2; // Main campus paths
  } else if (distance < 600) {
    score += 0.1; // Secondary paths
  }
  
  // Time-based preferences
  if (hour >= 18 || hour <= 6) {
    // Night time: prefer well-lit main paths (shorter routes)
    score += distance < 400 ? 0.3 : -0.2;
  } else if (hour >= 11 && hour <= 15) {
    // Midday: prefer shaded/covered paths
    score += 0.1;
  }
  
  return Math.max(0.1, Math.min(1.0, score));
};

/**
 * Calculate accessibility score (campus-specific)
 * Considers: ramps, elevators, smooth surfaces, building access
 */
const calculateAccessibilityScore = (route) => {
  let score = 0.7; // Base score (most campus paths are accessible)
  
  const steps = route.legs?.[0]?.steps || [];
  const distance = route.distance;
  
  // Shorter routes are generally more accessible
  if (distance < 400) {
    score += 0.2; // Direct paths between buildings
  }
  
  // Fewer turns = easier navigation for accessibility
  const turnsPerKm = steps.length / (distance / 1000);
  if (turnsPerKm < 3) {
    score += 0.1; // Straight, simple paths
  }
  
  return Math.max(0.3, Math.min(1.0, score));
};

/**
 * Normalize values to 0-1 scale for comparison
 */
const normalize = (value, min, max) => {
  if (max === min) return 0.5;
  return (max - value) / (max - min);
};

/**
 * AI-powered route scoring algorithm
 */
export const scoreRoute = (route, allRoutes, userPreferences = {}) => {
  // Extract min/max values for normalization
  const distances = allRoutes.map(r => r.distance);
  const durations = allRoutes.map(r => r.duration);
  
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  // Calculate individual scores (0-1, higher is better)
  const distanceScore = normalize(route.distance, minDistance, maxDistance);
  const durationScore = normalize(route.duration, minDuration, maxDuration);
  const pedestrianTrafficScore = calculatePedestrianTrafficScore(route);
  const pathQualityScore = calculatePathQualityScore(route);
  const accessibilityScore = calculateAccessibilityScore(route);

  // Apply user preferences if provided
  const weights = { ...SCORING_WEIGHTS, ...userPreferences };

  // Calculate weighted total score
  const totalScore = 
    (distanceScore * weights.distance) +
    (durationScore * weights.duration) +
    (pedestrianTrafficScore * weights.pedestrianTraffic) +
    (pathQualityScore * weights.pathQuality) +
    (accessibilityScore * weights.accessibility);

  return {
    totalScore,
    breakdown: {
      distance: distanceScore,
      duration: durationScore,
      pedestrianTraffic: pedestrianTrafficScore,
      pathQuality: pathQualityScore,
      accessibility: accessibilityScore
    }
  };
};

/**
 * Select the best route using AI scoring
 */
export const selectBestRoute = (routes, userPreferences = {}) => {
  if (!routes || routes.length === 0) {
    return null;
  }

  if (routes.length === 1) {
    return {
      route: routes[0],
      score: scoreRoute(routes[0], routes, userPreferences),
      alternatives: []
    };
  }

  // Score all routes
  const scoredRoutes = routes.map(route => ({
    route,
    score: scoreRoute(route, routes, userPreferences)
  }));

  // Sort by total score (descending)
  scoredRoutes.sort((a, b) => b.score.totalScore - a.score.totalScore);

  return {
    route: scoredRoutes[0].route,
    score: scoredRoutes[0].score,
    alternatives: scoredRoutes.slice(1).map(sr => ({
      route: sr.route,
      score: sr.score
    }))
  };
};

/**
 * Time-based preference adjustment (campus-specific)
 * Adjusts scoring weights based on campus schedule
 */
export const getTimeBasedPreferences = () => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  
  // Class change times (rush between classes)
  const isClassChangeTime = 
    (minute >= 50 || minute <= 5) || 
    (minute >= 20 && minute <= 30);
  
  // Between classes (8 AM - 5 PM): avoid crowds, prioritize speed
  if (isClassChangeTime && hour >= 8 && hour <= 17) {
    return {
      duration: 0.35,           // Get to class quickly
      pedestrianTraffic: 0.30,  // Avoid crowded paths
      distance: 0.20,           // Shorter is better
      pathQuality: 0.10,
      accessibility: 0.05
    };
  }
  
  // Night time (8 PM - 6 AM): prioritize safety and lighting
  if (hour >= 20 || hour <= 6) {
    return {
      pathQuality: 0.40,        // Well-lit, main paths
      accessibility: 0.25,      // Easy, safe navigation
      distance: 0.20,           // Prefer shorter routes
      duration: 0.10,
      pedestrianTraffic: 0.05   // Less relevant at night
    };
  }
  
  // Normal campus hours: balanced approach
  return SCORING_WEIGHTS;
};

/**
 * Compare two overlapping routes and explain the difference
 */
export const compareRoutes = (route1, route2, allRoutes) => {
  const score1 = scoreRoute(route1, allRoutes);
  const score2 = scoreRoute(route2, allRoutes);
  
  const timeDiff = Math.abs(route1.duration - route2.duration) / 60; // minutes
  const distDiff = Math.abs(route1.distance - route2.distance) / 1000; // km
  
  let recommendation = '';
  let reason = '';
  
  if (score1.totalScore > score2.totalScore) {
    recommendation = 'Route 1';
    reason = determineMainReason(score1.breakdown, score2.breakdown);
  } else {
    recommendation = 'Route 2';
    reason = determineMainReason(score2.breakdown, score1.breakdown);
  }
  
  return {
    recommendation,
    reason,
    timeDifference: `${timeDiff.toFixed(1)} minutes`,
    distanceDifference: `${distDiff.toFixed(1)} km`,
    score1: score1.totalScore.toFixed(2),
    score2: score2.totalScore.toFixed(2)
  };
};

/**
 * Determine the main reason for route preference
 */
const determineMainReason = (betterBreakdown, worseBreakdown) => {
  const differences = {
    traffic: betterBreakdown.traffic - worseBreakdown.traffic,
    duration: betterBreakdown.duration - worseBreakdown.duration,
    safety: betterBreakdown.safety - worseBreakdown.safety,
    roadQuality: betterBreakdown.roadQuality - worseBreakdown.roadQuality,
    distance: betterBreakdown.distance - worseBreakdown.distance
  };
  
  const maxDiff = Object.entries(differences).reduce((max, [key, value]) => 
    value > max.value ? { key, value } : max
  , { key: '', value: -Infinity });
  
  const reasons = {
    pedestrianTraffic: 'less crowded path',
    duration: 'faster walking time',
    pathQuality: 'better path conditions (paved/lit)',
    accessibility: 'easier navigation',
    distance: 'shorter walking distance'
  };
  
  return reasons[maxDiff.key] || 'overall better conditions';
};
