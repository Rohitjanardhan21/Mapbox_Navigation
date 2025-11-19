# Pathfinding Algorithms Explained

## 🗺️ Overview

This campus navigation system uses a **hybrid approach** combining multiple algorithms:

1. **Mapbox Directions API** (Primary pathfinding)
2. **Custom AI Scoring Algorithm** (Route selection)
3. **Haversine Formula** (Fallback distance calculation)

---

## 1️⃣ Primary: Mapbox Directions API

### Algorithm Used by Mapbox

Mapbox uses a modified version of **Contraction Hierarchies (CH)** combined with **A* algorithm**.

#### How It Works:

**Step 1: Graph Preprocessing (Contraction Hierarchies)**
- Road network is preprocessed into a hierarchical structure
- Important roads (highways, main streets) are at higher levels
- Local roads are at lower levels
- Creates "shortcuts" between important nodes

**Step 2: Query Phase (A* Search)**
- Uses A* algorithm with Euclidean distance heuristic
- Searches from start and end simultaneously (bidirectional search)
- Finds optimal path through the hierarchical graph

**Step 3: Alternative Routes**
- Generates up to 3 alternative routes
- Uses penalty-based approach to find diverse paths
- Ensures alternatives are significantly different

### Why Mapbox?

✅ **Pre-computed road network** - Fast queries  
✅ **Real-time traffic data** - Accurate ETAs  
✅ **Multiple route alternatives** - More choices  
✅ **Turn-by-turn directions** - Detailed navigation  
✅ **Global coverage** - Works anywhere  

### API Call Structure:

```javascript
GET https://api.mapbox.com/directions/v5/mapbox/walking/{start};{end}
Parameters:
- alternatives=true        // Get multiple routes
- geometries=geojson      // Route coordinates
- steps=true              // Turn-by-turn instructions
- annotations=congestion  // Traffic data
```

---

## 2️⃣ Custom AI Scoring Algorithm

After Mapbox provides multiple routes, our **AI scoring algorithm** selects the best one.

### Algorithm: Weighted Multi-Criteria Decision Analysis (MCDA)

#### Step 1: Normalize Scores

For each route, normalize values to 0-1 scale:

```
normalized_score = (max_value - current_value) / (max_value - min_value)
```

**Example:**
```
Route A: 500m
Route B: 600m
Route C: 550m

Distance scores:
Route A: (600 - 500) / (600 - 500) = 1.0 (best)
Route B: (600 - 600) / (600 - 500) = 0.0 (worst)
Route C: (600 - 550) / (600 - 500) = 0.5 (middle)
```

#### Step 2: Calculate Individual Factor Scores

**Five Factors:**

1. **Distance Score** (30% weight)
   - Shorter routes score higher
   - Normalized against all alternatives

2. **Duration Score** (25% weight)
   - Faster routes score higher
   - Considers walking speed (~5 km/h)

3. **Pedestrian Traffic Score** (20% weight)
   - Time-based estimation
   - Class change times: Lower score
   - Off-peak times: Higher score
   ```javascript
   if (isClassChangeTime && isPeakHours) {
     score -= 0.4; // Heavy traffic
   }
   ```

4. **Path Quality Score** (15% weight)
   - Shorter paths = better maintained
   - Night time: Prefer main paths (well-lit)
   - Midday: Prefer covered paths
   ```javascript
   if (distance < 300m) score += 0.2; // Main paths
   if (nightTime && distance < 400m) score += 0.3; // Safety
   ```

5. **Accessibility Score** (10% weight)
   - Fewer turns = easier navigation
   - Shorter routes = more accessible
   ```javascript
   if (turnsPerKm < 3) score += 0.1;
   ```

#### Step 3: Apply Weighted Scoring

```javascript
totalScore = 
  (distanceScore × 0.30) +
  (durationScore × 0.25) +
  (trafficScore × 0.20) +
  (pathQualityScore × 0.15) +
  (accessibilityScore × 0.10)
```

#### Step 4: Select Best Route

```javascript
routes.sort((a, b) => b.totalScore - a.totalScore);
return routes[0]; // Highest scoring route
```

### Time-Based Weight Adjustment

Weights change based on time of day:

**Class Change Times (8 AM - 5 PM, at :50-:00 or :20-:30):**
```javascript
{
  duration: 0.35,           // Get to class quickly
  pedestrianTraffic: 0.30,  // Avoid crowds
  distance: 0.20,
  pathQuality: 0.10,
  accessibility: 0.05
}
```

**Night Time (8 PM - 6 AM):**
```javascript
{
  pathQuality: 0.40,        // Well-lit paths
  accessibility: 0.25,      // Safe navigation
  distance: 0.20,
  duration: 0.10,
  pedestrianTraffic: 0.05   // Less relevant
}
```

---

## 3️⃣ Fallback: Haversine Formula

When Mapbox API fails or is unavailable, we use the **Haversine formula** for direct distance.

### Algorithm: Great Circle Distance

Calculates shortest distance between two points on a sphere (Earth).

#### Formula:

```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Where:
- φ = latitude (in radians)
- λ = longitude (in radians)
- R = Earth's radius (6,371 km)
- d = distance

#### Implementation:

```javascript
const R = 6371; // Earth's radius in km
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;

const a = 
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * 
  Math.cos(lat2 * Math.PI / 180) * 
  Math.sin(dLon/2) * Math.sin(dLon/2);

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c; // Distance in km
```

#### Fallback Route:

```javascript
{
  coordinates: [startPoint, endPoint], // Straight line
  distance: haversineDistance,
  duration: distance / 5 * 60 // Assume 5 km/h walking
}
```

---

## 📊 Algorithm Comparison

| Algorithm | Use Case | Pros | Cons |
|-----------|----------|------|------|
| **Mapbox (CH + A*)** | Primary routing | Fast, accurate, real roads | Requires internet |
| **AI Scoring (MCDA)** | Route selection | Campus-optimized, context-aware | Needs multiple routes |
| **Haversine** | Fallback | Works offline, simple | Straight line only |

---

## 🎯 Complete Pathfinding Flow

```
1. User selects destination
   ↓
2. Validate coordinates
   ↓
3. Call Mapbox Directions API
   ↓
4. Receive 1-3 alternative routes
   ↓
5. For each route:
   - Calculate distance score
   - Calculate duration score
   - Estimate pedestrian traffic
   - Assess path quality
   - Evaluate accessibility
   ↓
6. Apply time-based weights
   ↓
7. Calculate weighted total score
   ↓
8. Select highest scoring route
   ↓
9. Display to user with explanation
   ↓
10. If Mapbox fails → Use Haversine fallback
```

---

## 🧮 Example Calculation

### Scenario: Two Routes to Library at 9:50 AM (Class Change)

**Route A:**
- Distance: 400m
- Duration: 5 min
- Main quad (crowded during class change)

**Route B:**
- Distance: 550m
- Duration: 6 min
- Around buildings (less crowded)

### Step 1: Normalize Scores

```
Distance:
Route A: (550 - 400) / (550 - 400) = 1.0
Route B: (550 - 550) / (550 - 400) = 0.0

Duration:
Route A: (6 - 5) / (6 - 5) = 1.0
Route B: (6 - 6) / (6 - 5) = 0.0
```

### Step 2: Calculate Factor Scores

```
Route A:
- Distance: 1.0
- Duration: 1.0
- Traffic: 0.3 (crowded main path)
- Path Quality: 0.7
- Accessibility: 0.8

Route B:
- Distance: 0.0
- Duration: 0.0
- Traffic: 0.9 (less crowded)
- Path Quality: 0.8
- Accessibility: 0.9
```

### Step 3: Apply Weights (Class Change Time)

```
Route A Total:
(1.0 × 0.20) + (1.0 × 0.35) + (0.3 × 0.30) + (0.7 × 0.10) + (0.8 × 0.05)
= 0.20 + 0.35 + 0.09 + 0.07 + 0.04
= 0.75

Route B Total:
(0.0 × 0.20) + (0.0 × 0.35) + (0.9 × 0.30) + (0.8 × 0.10) + (0.9 × 0.05)
= 0.00 + 0.00 + 0.27 + 0.08 + 0.045
= 0.395
```

### Result:

**Route A wins** (0.75 > 0.395) despite being crowded, because:
- Much shorter distance
- Faster duration
- During class change, speed matters more

**But wait!** The traffic penalty is significant. Let's recalculate with actual weights:

```
Class Change Weights:
- Duration: 0.35
- Traffic: 0.30
- Distance: 0.20
- Path Quality: 0.10
- Accessibility: 0.05

Route A: (1.0×0.20) + (1.0×0.35) + (0.3×0.30) + (0.7×0.10) + (0.8×0.05) = 0.75
Route B: (0.0×0.20) + (0.0×0.35) + (0.9×0.30) + (0.8×0.10) + (0.9×0.05) = 0.40
```

**Route A still wins**, but if traffic score was 0.1 instead of 0.3:
```
Route A: 0.20 + 0.35 + 0.03 + 0.07 + 0.04 = 0.69
```

The algorithm balances all factors intelligently!

---

## 🔬 Algorithm Complexity

### Time Complexity:

**Mapbox API Call:** O(1) - Pre-computed graph  
**AI Scoring:** O(n × m) where:
- n = number of routes (typically 1-3)
- m = number of factors (5)
- Total: O(15) = O(1) constant time

**Overall:** O(1) - Very fast!

### Space Complexity:

**Route Storage:** O(n × p) where:
- n = number of routes
- p = points per route (typically 50-200)
- Total: O(600) = O(1) for practical purposes

---

## 🎓 Academic References

This system combines concepts from:

1. **Contraction Hierarchies** (Geisberger et al., 2008)
2. **A* Search Algorithm** (Hart, Nilsson, Raphael, 1968)
3. **Multi-Criteria Decision Analysis** (Hwang & Yoon, 1981)
4. **Haversine Formula** (Sinnott, 1984)

---

## 💡 Why This Approach?

### Advantages:

✅ **Fast** - Leverages pre-computed Mapbox data  
✅ **Accurate** - Real road network, not straight lines  
✅ **Context-Aware** - Adapts to time and campus conditions  
✅ **Transparent** - Shows why routes were chosen  
✅ **Flexible** - Easy to adjust weights and factors  
✅ **Reliable** - Has fallback for offline use  

### Limitations:

❌ Requires internet for Mapbox API  
❌ Pedestrian traffic is estimated, not measured  
❌ Path quality is heuristic-based  
❌ Doesn't account for real-time events (construction, etc.)  

---

## 🚀 Future Improvements

### Potential Enhancements:

1. **Machine Learning Integration**
   - Train model on actual user choices
   - Learn optimal weights per user
   - Predict traffic patterns

2. **Real-Time Data**
   - WiFi-based crowd density
   - Weather integration
   - Event schedules

3. **Advanced Algorithms**
   - Dijkstra's for custom graphs
   - Floyd-Warshall for all-pairs shortest path
   - Genetic algorithms for multi-objective optimization

4. **Graph-Based Approach**
   - Build custom campus graph
   - Include indoor paths
   - Model stairs, elevators, doors

---

## 📚 Learn More

- **Mapbox Directions API:** https://docs.mapbox.com/api/navigation/directions/
- **A* Algorithm:** https://en.wikipedia.org/wiki/A*_search_algorithm
- **Contraction Hierarchies:** https://en.wikipedia.org/wiki/Contraction_hierarchies
- **MCDA:** https://en.wikipedia.org/wiki/Multiple-criteria_decision_analysis

---

**The combination of Mapbox's powerful routing engine with our custom AI scoring creates an intelligent, campus-optimized navigation system!** 🎓🗺️
