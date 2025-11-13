# Campus Navigation - Quick Start Guide

## What You Have

✅ **AI-powered campus navigation system**
✅ **Optimized for walking routes**
✅ **Automatically avoids crowds during class changes**
✅ **Prioritizes safety at night**
✅ **Considers accessibility needs**

## It's Already Working!

The AI route selection is **automatically enabled**. Every time someone navigates, it:

1. Fetches multiple route options
2. Analyzes them based on campus factors
3. Selects the best route
4. Shows alternatives if available

## Campus-Specific Intelligence

### Pedestrian Traffic (20% weight)
- Detects class change times automatically
- Avoids crowded main paths during :50-:00 and :20-:30
- Suggests alternative routes when busy

### Path Quality (15% weight)
- Prefers paved, maintained walkways
- Considers lighting (important at night)
- Evaluates covered paths (weather protection)

### Accessibility (10% weight)
- Identifies ramps and elevators
- Prefers smooth surfaces
- Suggests simpler navigation

### Distance (30% weight)
- Shorter walking distance preferred
- Balanced with other factors

### Duration (25% weight)
- Faster routes during class changes
- Less critical during free time

## Time-Based Behavior

**Class Change Times (8 AM - 5 PM, at :50-:00 or :20-:30)**
- Avoids crowded main paths
- Prioritizes getting to class on time
- Suggests less-traveled alternatives

**Night Time (8 PM - 6 AM)**
- Prioritizes well-lit main paths
- Safety is top priority
- Prefers shorter routes

**Normal Hours**
- Balanced approach
- Optimal user experience

## Example Routes

### Morning Rush (9:50 AM)
```
From: Engineering Building
To: Library

Route A: 400m, 5 min (through main quad - CROWDED)
Route B: 550m, 6 min (around buildings - CLEAR)

✅ AI Selects: Route B
Reason: "Less crowded path during class change"
```

### Late Night (11 PM)
```
From: Library
To: Dorm

Route A: 350m, 4 min (dark shortcut)
Route B: 450m, 5 min (well-lit main road)

✅ AI Selects: Route B
Reason: "Better path conditions (well-lit)"
```

## How to Use

### Basic Navigation:
1. Open the app
2. Tap a destination or search
3. AI automatically selects best route
4. Start walking!

### View Alternatives:
1. After route is calculated
2. Check console for route comparison
3. See why AI chose that route
4. View alternative options

## Console Logs

You'll see logs like:
```
AI selected best route with score: 0.85
Score breakdown: {
  distance: 0.78,
  duration: 0.92,
  pedestrianTraffic: 0.88,
  pathQuality: 0.75,
  accessibility: 0.82
}
```

## Customization

### Adjust Weights (in `utils/aiRouteSelector.js`):
```javascript
const SCORING_WEIGHTS = {
  distance: 0.30,           // Increase for shorter routes
  duration: 0.25,           // Increase for faster routes
  pedestrianTraffic: 0.20,  // Increase to avoid crowds more
  pathQuality: 0.15,        // Increase for better paths
  accessibility: 0.10       // Increase for easier navigation
};
```

## Testing Tips

1. **Test during class change times** (set device time to 9:50 AM)
2. **Test at night** (set device time to 11 PM)
3. **Compare routes** in console logs
4. **Try different destinations** to see variety

## Files to Know

- **`utils/aiRouteSelector.js`** - AI logic (campus-optimized)
- **`hooks/useNavigation.js`** - Navigation with AI
- **`CAMPUS_AI_NAVIGATION.md`** - Full documentation
- **`CAMPUS_SYSTEM_SUMMARY.md`** - Complete overview

## Key Benefits

✅ **Smarter than "shortest path"** - considers real campus conditions
✅ **Time-aware** - adapts to class schedules
✅ **Safety-focused** - well-lit paths at night
✅ **Accessible** - considers all users
✅ **Transparent** - explains decisions

## That's It!

Your campus navigation system is ready. The AI works automatically in the background, making smart routing decisions based on campus-specific factors.

**Just navigate and let the AI handle the rest!** 🎓
