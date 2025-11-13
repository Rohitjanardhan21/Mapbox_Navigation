# How to Use AI Route Selection

## Quick Start

The AI route selection is **already integrated** and works automatically! Every time you navigate, it's using AI to find the best route.

## Optional: Add Route Comparison UI

If you want users to see and compare alternative routes, add this to your `app/index.jsx`:

### Step 1: Import the component

```javascript
import RouteComparisonModal from '../components/RouteComparisonModal';
```

### Step 2: Add state for modal visibility

```javascript
const [showRouteComparison, setShowRouteComparison] = useState(false);
```

### Step 3: Get alternative routes from navigation hook

```javascript
const {
  // ... existing properties
  alternativeRoutes,  // NEW
  routeScore,         // NEW
  // ... rest of properties
} = useNavigation();
```

### Step 4: Add the modal component

```jsx
<RouteComparisonModal
  visible={showRouteComparison}
  onClose={() => setShowRouteComparison(false)}
  mainRoute={routeInfo}
  alternatives={alternativeRoutes}
  onSelectRoute={(route, index) => {
    console.log('User selected route:', index);
    setShowRouteComparison(false);
    // Optionally update the route
  }}
/>
```

### Step 5: Show modal when routes are calculated

```javascript
// After startNavigation is called
if (alternativeRoutes && alternativeRoutes.length > 0) {
  setShowRouteComparison(true);
}
```

## Complete Example

```javascript
const handleQuickNavigation = async (item) => {
  if (!userLocation) {
    Alert.alert('Location Required', 'Please wait for your location');
    return;
  }
  
  try {
    handleSelectResult(item);
    const success = await startNavigation(userLocation, item);
    
    // Show route comparison if alternatives exist
    if (success && alternativeRoutes && alternativeRoutes.length > 0) {
      setShowRouteComparison(true);
    }
  } catch (error) {
    console.error('Error in navigation:', error);
  }
};
```

## What Users Will See

1. **Automatic Selection**: AI picks the best route instantly
2. **Optional Comparison**: Modal shows all routes with scores
3. **Visual Feedback**: Color-coded bars show each factor
4. **Clear Recommendation**: "AI Recommended" badge on best route
5. **Manual Override**: Users can choose any alternative

## Console Output

When AI is working, you'll see logs like:

```
AI selected best route with score: 0.85
Score breakdown: {
  distance: 0.78,
  duration: 0.92,
  traffic: 0.88,
  roadQuality: 0.75,
  safety: 0.82
}
Route comparison: {
  recommendation: 'Route 1',
  reason: 'less traffic congestion',
  timeDifference: '3.2 minutes',
  distanceDifference: '0.8 km'
}
```

## Testing

1. **Start the app**: `npx expo start`
2. **Navigate somewhere**: Tap a location or search
3. **Check console**: See AI decision-making in action
4. **View alternatives**: Open route comparison modal

## Customization

### Adjust AI Weights

Edit `utils/aiRouteSelector.js`:

```javascript
const SCORING_WEIGHTS = {
  distance: 0.25,    // Increase for shorter routes
  duration: 0.35,    // Increase for faster routes
  trafficLevel: 0.20, // Increase to avoid traffic more
  roadQuality: 0.10,  // Increase for better roads
  safety: 0.10       // Increase for safer routes
};
```

### Add Custom Preferences

```javascript
// In your navigation call
const customPreferences = {
  safety: 0.40,      // Prioritize safety
  duration: 0.30,
  distance: 0.15,
  trafficLevel: 0.10,
  roadQuality: 0.05
};

// Pass to calculateRoute
await calculateRoute(start, end, true, customPreferences);
```

## Benefits You Get

✅ **Smarter Routes**: Best path, not just shortest
✅ **Time Savings**: Avoids traffic automatically  
✅ **Safety**: Prioritizes safer roads at night
✅ **Transparency**: See why routes were chosen
✅ **Flexibility**: Override AI if you prefer
✅ **No Extra Work**: Works automatically!

---

**That's it! The AI is already working. The modal is optional for power users who want to see alternatives.**
