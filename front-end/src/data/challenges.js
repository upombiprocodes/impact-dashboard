// 50 Unique Eco-Challenges with Logic-Based Calculations
// Each challenge has a CO2 impact formula based on real-world data

export const challenges = [
  // ============ FOOD & DIET CHALLENGES (1-15) ============
  {
    id: 1,
    title: "Meatless Monday",
    description: "Skip all meat for the entire day. Red meat has the highest carbon footprint among foods.",
    category: "food",
    difficulty: "easy",
    icon: "🥬",
    // Formula: Average daily meat consumption (150g) × beef CO2 factor (27kg/kg)
    co2Formula: () => (0.15 * 27).toFixed(1),
    co2Impact: 4.05,
    unit: "kg CO₂",
    tips: ["Try lentil curry", "Bean tacos are delicious", "Mushrooms make great meat substitutes"]
  },
  {
    id: 2,
    title: "Local Produce Day",
    description: "Buy only locally-sourced groceries. Transportation accounts for 11% of food emissions.",
    category: "food",
    difficulty: "medium",
    icon: "🌽",
    // Formula: Avg grocery transport emissions × local reduction factor
    co2Formula: () => (2.5 * 0.89).toFixed(1),
    co2Impact: 2.2,
    unit: "kg CO₂",
    tips: ["Visit farmers markets", "Check product origins at store", "Seasonal produce is often local"]
  },
  {
    id: 3,
    title: "Plant-Based Breakfast",
    description: "Replace eggs and bacon with oatmeal, fruits, or plant-based alternatives.",
    category: "food",
    difficulty: "easy",
    icon: "🥣",
    // Formula: (eggs CO2 + bacon CO2) - oatmeal CO2
    co2Formula: () => ((0.1 * 4.8) + (0.05 * 12) - (0.1 * 0.9)).toFixed(1),
    co2Impact: 0.99,
    unit: "kg CO₂",
    tips: ["Overnight oats are easy", "Add nuts for protein", "Smoothie bowls are filling"]
  },
  {
    id: 4,
    title: "Zero Food Waste",
    description: "Don't throw away any edible food today. Food waste contributes 6% of global emissions.",
    category: "food",
    difficulty: "medium",
    icon: "♻️",
    // Formula: Average daily food waste × methane conversion
    co2Formula: () => (0.3 * 2.5).toFixed(1),
    co2Impact: 0.75,
    unit: "kg CO₂",
    tips: ["Plan meals in advance", "Use leftovers creatively", "Compost scraps"]
  },
  {
    id: 5,
    title: "Dairy-Free Day",
    description: "Switch to plant-based milk and skip all dairy products.",
    category: "food",
    difficulty: "medium",
    icon: "🥛",
    // Formula: (milk + cheese daily avg) CO2 saved
    co2Formula: () => ((0.5 * 3.2) + (0.03 * 21)).toFixed(1),
    co2Impact: 2.23,
    unit: "kg CO₂",
    tips: ["Oat milk froths well", "Coconut yogurt is creamy", "Nutritional yeast replaces cheese"]
  },
  {
    id: 6,
    title: "Home-Cooked Meals Only",
    description: "No takeout or restaurant food. Cooking at home reduces packaging and transport emissions.",
    category: "food",
    difficulty: "easy",
    icon: "👨‍🍳",
    // Formula: Restaurant meal overhead × 3 meals
    co2Formula: () => (0.8 * 3).toFixed(1),
    co2Impact: 2.4,
    unit: "kg CO₂",
    tips: ["Meal prep on weekends", "Try one-pot recipes", "Batch cooking saves time"]
  },
  {
    id: 7,
    title: "Seafood Swap",
    description: "Replace fish with plant-based alternatives or sustainable seafood choices.",
    category: "food",
    difficulty: "medium",
    icon: "🐟",
    // Formula: Average fish portion CO2 vs plant protein
    co2Formula: () => (0.15 * (5.1 - 2.0)).toFixed(1),
    co2Impact: 0.47,
    unit: "kg CO₂",
    tips: ["Try hearts of palm 'crab'", "Chickpea 'tuna' is tasty", "Algae-based omega-3s exist"]
  },
  {
    id: 8,
    title: "No Processed Foods",
    description: "Eat only whole foods today. Processing adds significant energy and emissions.",
    category: "food",
    difficulty: "hard",
    icon: "🥕",
    // Formula: Processing energy savings × daily intake
    co2Formula: () => (0.5 * 2.5).toFixed(1),
    co2Impact: 1.25,
    unit: "kg CO₂",
    tips: ["Prep veggies in advance", "Nuts are great snacks", "Fruits satisfy sweet cravings"]
  },
  {
    id: 9,
    title: "Coffee Carbon Cut",
    description: "Skip coffee or switch to shade-grown, carbon-neutral brands.",
    category: "food",
    difficulty: "hard",
    icon: "☕",
    // Formula: Average daily coffee CO2 (production + transport)
    co2Formula: () => (0.3 * 3 * 0.7).toFixed(1),
    co2Impact: 0.63,
    unit: "kg CO₂",
    tips: ["Herbal tea is refreshing", "Cold brew uses less energy", "Support sustainable brands"]
  },
  {
    id: 10,
    title: "Veggie Dinner Party",
    description: "Host or attend a dinner where all dishes are vegetarian.",
    category: "food",
    difficulty: "medium",
    icon: "🍽️",
    // Formula: Meat-based dinner party × guests avg CO2 saved
    co2Formula: (guests = 4) => (guests * 2.5).toFixed(1),
    co2Impact: 10.0,
    unit: "kg CO₂",
    tips: ["Theme nights are fun", "Potluck reduces effort", "Indian cuisine is naturally veggie-rich"]
  },
  {
    id: 11,
    title: "No Beef Today",
    description: "Beef has 20x the carbon footprint of beans. Skip it for just one day.",
    category: "food",
    difficulty: "easy",
    icon: "🐄",
    // Formula: Average beef portion × CO2 factor
    co2Formula: () => (0.2 * 27).toFixed(1),
    co2Impact: 5.4,
    unit: "kg CO₂",
    tips: ["Try portobello burgers", "Seitan has meaty texture", "Black bean tacos rock"]
  },
  {
    id: 12,
    title: "Drink Tap Water Only",
    description: "Skip bottled water and sugary drinks. Plastic bottles have high carbon footprints.",
    category: "food",
    difficulty: "easy",
    icon: "💧",
    // Formula: Bottled water production + transport vs tap
    co2Formula: (bottles = 3) => (bottles * 0.082).toFixed(2),
    co2Impact: 0.25,
    unit: "kg CO₂",
    tips: ["Get a reusable bottle", "Add fruit for flavor", "Room temp water is absorbed faster"]
  },
  {
    id: 13,
    title: "Chocolate Detox",
    description: "Skip chocolate for a day. Cocoa farming drives deforestation.",
    category: "food",
    difficulty: "medium",
    icon: "🍫",
    // Formula: Average chocolate bar CO2
    co2Formula: () => (0.05 * 19).toFixed(1),
    co2Impact: 0.95,
    unit: "kg CO₂",
    tips: ["Carob is a good substitute", "Dark chocolate has lower impact", "Fruit satisfies sweet tooth"]
  },
  {
    id: 14,
    title: "Grow Your Own Herbs",
    description: "Start growing herbs at home. Reduces transport and packaging emissions.",
    category: "food",
    difficulty: "medium",
    icon: "🌿",
    // Formula: Annual herb carbon savings / 365
    co2Formula: () => (15 / 365).toFixed(2),
    co2Impact: 0.04,
    unit: "kg CO₂",
    tips: ["Basil grows fast", "Mint is nearly indestructible", "Windowsill gardens work"]
  },
  {
    id: 15,
    title: "Leftover Lunch",
    description: "Use yesterday's dinner leftovers for today's lunch.",
    category: "food",
    difficulty: "easy",
    icon: "📦",
    // Formula: New lunch production avoided
    co2Formula: () => (1.2).toFixed(1),
    co2Impact: 1.2,
    unit: "kg CO₂",
    tips: ["Rice reheats well", "Make extra dinner portions", "Soups taste better next day"]
  },

  // ============ TRANSPORTATION CHALLENGES (16-30) ============
  {
    id: 16,
    title: "Walk to Work",
    description: "Walk instead of driving if your commute is under 2 miles.",
    category: "transport",
    difficulty: "medium",
    icon: "🚶",
    // Formula: Average car commute (5 miles) × CO2/mile
    co2Formula: (miles = 5) => (miles * 0.404).toFixed(1),
    co2Impact: 2.02,
    unit: "kg CO₂",
    tips: ["Leave 15 min earlier", "Good podcast time", "Great for mental health"]
  },
  {
    id: 17,
    title: "Bike Commute",
    description: "Cycle to your destination instead of driving.",
    category: "transport",
    difficulty: "medium",
    icon: "🚲",
    // Formula: Car miles avoided × CO2 factor
    co2Formula: (miles = 8) => (miles * 0.404).toFixed(1),
    co2Impact: 3.23,
    unit: "kg CO₂",
    tips: ["Plan a safe route", "E-bikes make hills easy", "Great exercise too"]
  },
  {
    id: 18,
    title: "Public Transit Day",
    description: "Use buses, trains, or subways instead of your car.",
    category: "transport",
    difficulty: "easy",
    icon: "🚇",
    // Formula: (Car CO2 - Transit CO2) for average commute
    co2Formula: (miles = 20) => ((miles * 0.404) - (miles * 0.089)).toFixed(1),
    co2Impact: 6.3,
    unit: "kg CO₂",
    tips: ["Check schedules in advance", "Read or work during commute", "Monthly passes save money"]
  },
  {
    id: 19,
    title: "Carpool Champion",
    description: "Share your commute with at least one other person.",
    category: "transport",
    difficulty: "easy",
    icon: "🚗",
    // Formula: Solo commute CO2 / passengers
    co2Formula: (passengers = 2) => ((10 * 0.404) / passengers).toFixed(1),
    co2Impact: 2.02,
    unit: "kg CO₂",
    tips: ["Use carpool apps", "Split gas costs", "HOV lanes save time"]
  },
  {
    id: 20,
    title: "No-Drive Sunday",
    description: "Keep your car parked for the entire day.",
    category: "transport",
    difficulty: "easy",
    icon: "🅿️",
    // Formula: Average Sunday driving CO2
    co2Formula: () => (15 * 0.404).toFixed(1),
    co2Impact: 6.06,
    unit: "kg CO₂",
    tips: ["Plan activities nearby", "Walk to brunch", "Online shopping if needed"]
  },
  {
    id: 21,
    title: "Eco-Driving Mode",
    description: "Drive smoothly: no rapid acceleration, maintain steady speed, coast to stops.",
    category: "transport",
    difficulty: "easy",
    icon: "⚡",
    // Formula: Fuel savings from eco-driving (10-15% reduction)
    co2Formula: (normalCO2 = 8) => (normalCO2 * 0.12).toFixed(1),
    co2Impact: 0.96,
    unit: "kg CO₂",
    tips: ["Use cruise control", "Accelerate gently", "Anticipate traffic flow"]
  },
  {
    id: 22,
    title: "Skip One Flight",
    description: "For every flight you skip this year, you save massive emissions.",
    category: "transport",
    difficulty: "hard",
    icon: "✈️",
    // Formula: Short-haul flight CO2 per passenger
    co2Formula: (hours = 2) => (hours * 90).toFixed(0),
    co2Impact: 180,
    unit: "kg CO₂",
    tips: ["Try train travel", "Video calls work", "Staycations are underrated"]
  },
  {
    id: 23,
    title: "Combine All Errands",
    description: "Plan your route to do all errands in one efficient trip.",
    category: "transport",
    difficulty: "easy",
    icon: "🗺️",
    // Formula: Multiple trips avoided × average trip CO2
    co2Formula: (trips = 3) => (trips * 3 * 0.404).toFixed(1),
    co2Impact: 3.64,
    unit: "kg CO₂",
    tips: ["Make a list first", "Map the optimal route", "Shop in clusters"]
  },
  {
    id: 24,
    title: "Work From Home",
    description: "Remote work eliminates commute emissions entirely.",
    category: "transport",
    difficulty: "medium",
    icon: "🏠",
    // Formula: Full commute CO2 saved
    co2Formula: (roundTripMiles = 30) => (roundTripMiles * 0.404).toFixed(1),
    co2Impact: 12.12,
    unit: "kg CO₂",
    tips: ["Set up a proper workspace", "Take walking breaks", "Video calls replace meetings"]
  },
  {
    id: 25,
    title: "Tire Pressure Check",
    description: "Properly inflated tires improve fuel efficiency by 3%.",
    category: "transport",
    difficulty: "easy",
    icon: "🔧",
    // Formula: Monthly driving CO2 × efficiency gain
    co2Formula: (monthlyCO2 = 200) => (monthlyCO2 * 0.03).toFixed(1),
    co2Impact: 6.0,
    unit: "kg CO₂",
    tips: ["Check monthly", "Use a digital gauge", "Check when tires are cold"]
  },
  {
    id: 26,
    title: "Electric Scooter Day",
    description: "Use an e-scooter or e-bike for short trips instead of driving.",
    category: "transport",
    difficulty: "easy",
    icon: "🛴",
    // Formula: Short car trips replaced
    co2Formula: (trips = 3, avgMiles = 2) => (trips * avgMiles * 0.404).toFixed(1),
    co2Impact: 2.42,
    unit: "kg CO₂",
    tips: ["Wear a helmet", "Follow traffic rules", "Great for urban areas"]
  },
  {
    id: 27,
    title: "Train Over Plane",
    description: "Choose rail travel for trips under 500 miles.",
    category: "transport",
    difficulty: "medium",
    icon: "🚂",
    // Formula: (Flight CO2 - Train CO2) for 300 mile trip
    co2Formula: (miles = 300) => ((miles * 0.255) - (miles * 0.041)).toFixed(0),
    co2Impact: 64,
    unit: "kg CO₂",
    tips: ["Book in advance", "Scenic routes exist", "Work during travel"]
  },
  {
    id: 28,
    title: "Virtual Meeting Day",
    description: "Replace all in-person meetings with video calls.",
    category: "transport",
    difficulty: "easy",
    icon: "💻",
    // Formula: Average meeting travel avoided
    co2Formula: (meetings = 2, avgMiles = 10) => (meetings * avgMiles * 0.404).toFixed(1),
    co2Impact: 8.08,
    unit: "kg CO₂",
    tips: ["Test tech beforehand", "Use good lighting", "Mute when not speaking"]
  },
  {
    id: 29,
    title: "Slow Down Highway",
    description: "Drive at 60 mph instead of 75 mph. Fuel efficiency drops rapidly above 50 mph.",
    category: "transport",
    difficulty: "medium",
    icon: "🐢",
    // Formula: Fuel savings at lower speed × trip distance
    co2Formula: (miles = 50) => (miles * 0.404 * 0.15).toFixed(1),
    co2Impact: 3.03,
    unit: "kg CO₂",
    tips: ["Use cruise control", "Leave earlier", "Enjoy the journey"]
  },
  {
    id: 30,
    title: "Avoid Rush Hour",
    description: "Travel outside peak times to avoid stop-and-go traffic.",
    category: "transport",
    difficulty: "medium",
    icon: "🕐",
    // Formula: Idle time CO2 avoided
    co2Formula: (idleMinutes = 30) => (idleMinutes * 0.02).toFixed(1),
    co2Impact: 0.6,
    unit: "kg CO₂",
    tips: ["Flex your schedule", "Gym during rush hour", "Early bird catches savings"]
  },

  // ============ HOME & ENERGY CHALLENGES (31-40) ============
  {
    id: 31,
    title: "Lights Out Hour",
    description: "Turn off all unnecessary lights for one hour.",
    category: "energy",
    difficulty: "easy",
    icon: "💡",
    // Formula: Average lighting power × CO2 per kWh
    co2Formula: (watts = 200, hours = 1) => ((watts / 1000) * hours * 0.42).toFixed(2),
    co2Impact: 0.08,
    unit: "kg CO₂",
    tips: ["Use natural light", "Candles are cozy", "Motion sensors help"]
  },
  {
    id: 32,
    title: "Cold Wash Clothes",
    description: "Wash all laundry in cold water. Heating water uses 90% of washer energy.",
    category: "energy",
    difficulty: "easy",
    icon: "🧺",
    // Formula: Hot water energy saved per load
    co2Formula: (loads = 1) => (loads * 0.6).toFixed(1),
    co2Impact: 0.6,
    unit: "kg CO₂",
    tips: ["Modern detergents work cold", "Colors stay vibrant", "Clothes last longer"]
  },
  {
    id: 33,
    title: "Unplug Vampires",
    description: "Unplug all devices not in use. Standby power wastes 5-10% of home energy.",
    category: "energy",
    difficulty: "easy",
    icon: "🔌",
    // Formula: Standby power × hours × CO2 factor
    co2Formula: (watts = 50, hours = 24) => ((watts / 1000) * hours * 0.42).toFixed(2),
    co2Impact: 0.5,
    unit: "kg CO₂",
    tips: ["Use power strips", "Smart plugs help", "Unplug chargers when full"]
  },
  {
    id: 34,
    title: "Thermostat Challenge",
    description: "Lower heating by 2°F or raise cooling by 2°F.",
    category: "energy",
    difficulty: "medium",
    icon: "🌡️",
    // Formula: HVAC energy savings per degree
    co2Formula: (degrees = 2) => (degrees * 1.5).toFixed(1),
    co2Impact: 3.0,
    unit: "kg CO₂",
    tips: ["Wear layers", "Use fans with AC", "Smart thermostats learn habits"]
  },
  {
    id: 35,
    title: "Air Dry Laundry",
    description: "Skip the dryer and hang clothes to dry.",
    category: "energy",
    difficulty: "medium",
    icon: "👕",
    // Formula: Dryer energy per load × CO2 factor
    co2Formula: (loads = 1) => (loads * 3 * 0.42).toFixed(1),
    co2Impact: 1.26,
    unit: "kg CO₂",
    tips: ["Indoor racks work", "Clothes smell fresher", "Gentle on fabrics"]
  },
  {
    id: 36,
    title: "5-Minute Shower",
    description: "Limit your shower to 5 minutes. The average shower is 8+ minutes.",
    category: "energy",
    difficulty: "medium",
    icon: "🚿",
    // Formula: Water heating energy saved
    co2Formula: (minutesSaved = 3) => (minutesSaved * 0.2).toFixed(1),
    co2Impact: 0.6,
    unit: "kg CO₂",
    tips: ["Use a timer", "Turn off while soaping", "Low-flow showerheads help"]
  },
  {
    id: 37,
    title: "LED Swap",
    description: "Replace one incandescent bulb with LED. LEDs use 75% less energy.",
    category: "energy",
    difficulty: "easy",
    icon: "💡",
    // Formula: Annual savings per bulb / 365
    co2Formula: () => (40 / 365).toFixed(2),
    co2Impact: 0.11,
    unit: "kg CO₂",
    tips: ["LEDs last 25x longer", "Many color options", "Instant on, no warm-up"]
  },
  {
    id: 38,
    title: "Full Loads Only",
    description: "Only run dishwasher and washing machine with full loads.",
    category: "energy",
    difficulty: "easy",
    icon: "🍽️",
    // Formula: Partial load waste avoided
    co2Formula: (loadsAvoided = 1) => (loadsAvoided * 0.8).toFixed(1),
    co2Impact: 0.8,
    unit: "kg CO₂",
    tips: ["Wait for full load", "Same energy per load", "Water savings too"]
  },
  {
    id: 39,
    title: "Screen-Free Evening",
    description: "Turn off TVs, computers, and devices after 8 PM.",
    category: "energy",
    difficulty: "hard",
    icon: "📵",
    // Formula: Evening device energy savings
    co2Formula: (hours = 4, watts = 150) => ((watts / 1000) * hours * 0.42).toFixed(2),
    co2Impact: 0.25,
    unit: "kg CO₂",
    tips: ["Read a book", "Board games are fun", "Better sleep quality"]
  },
  {
    id: 40,
    title: "Cook with Lids",
    description: "Always use lids when cooking. Reduces energy use by 25%.",
    category: "energy",
    difficulty: "easy",
    icon: "🍳",
    // Formula: Cooking energy saved
    co2Formula: (meals = 3) => (meals * 0.5 * 0.25 * 0.42).toFixed(2),
    co2Impact: 0.16,
    unit: "kg CO₂",
    tips: ["Food cooks faster", "Less steam in kitchen", "Use right-sized burner"]
  },

  // ============ LIFESTYLE & SHOPPING CHALLENGES (41-50) ============
  {
    id: 41,
    title: "No New Clothes",
    description: "Don't buy any new clothing items today. Fashion industry = 10% of global CO2.",
    category: "lifestyle",
    difficulty: "easy",
    icon: "👗",
    // Formula: Average clothing item CO2
    co2Formula: () => (10).toFixed(0),
    co2Impact: 10,
    unit: "kg CO₂",
    tips: ["Shop secondhand", "Host clothing swaps", "Repair before replace"]
  },
  {
    id: 42,
    title: "Digital Declutter",
    description: "Delete old emails and files. Data centers use massive energy.",
    category: "lifestyle",
    difficulty: "easy",
    icon: "📧",
    // Formula: Storage CO2 savings (estimated)
    co2Formula: (gbFreed = 1) => (gbFreed * 0.03).toFixed(2),
    co2Impact: 0.03,
    unit: "kg CO₂",
    tips: ["Unsubscribe from spam", "Clear cloud storage", "Empty trash folders"]
  },
  {
    id: 43,
    title: "Reusable Bag Hero",
    description: "Use only reusable bags for all shopping today.",
    category: "lifestyle",
    difficulty: "easy",
    icon: "🛍️",
    // Formula: Plastic bags avoided × CO2 per bag
    co2Formula: (bags = 5) => (bags * 0.033).toFixed(2),
    co2Impact: 0.17,
    unit: "kg CO₂",
    tips: ["Keep bags in car", "Foldable bags fit pockets", "Tote bags are stylish"]
  },
  {
    id: 44,
    title: "Plant a Tree",
    description: "Plant or sponsor a tree. One tree absorbs ~21kg CO2/year.",
    category: "lifestyle",
    difficulty: "medium",
    icon: "🌳",
    // Formula: Annual CO2 absorption
    co2Formula: () => (21).toFixed(0),
    co2Impact: 21,
    unit: "kg CO₂/year",
    tips: ["Native species best", "Many orgs plant for you", "Great gift idea"]
  },
  {
    id: 45,
    title: "Paperless Day",
    description: "Don't print anything. Use digital notes and documents only.",
    category: "lifestyle",
    difficulty: "easy",
    icon: "📄",
    // Formula: Paper sheets avoided × CO2 per sheet
    co2Formula: (sheets = 10) => (sheets * 0.005).toFixed(2),
    co2Impact: 0.05,
    unit: "kg CO₂",
    tips: ["E-sign documents", "Take phone photos", "Digital notes sync everywhere"]
  },
  {
    id: 46,
    title: "Buy Nothing Day",
    description: "Make zero purchases except essentials. Consumerism drives emissions.",
    category: "lifestyle",
    difficulty: "hard",
    icon: "🚫",
    // Formula: Average daily consumption CO2
    co2Formula: () => (8).toFixed(0),
    co2Impact: 8,
    unit: "kg CO₂",
    tips: ["Focus on experiences", "Use what you have", "Window shop only"]
  },
  {
    id: 47,
    title: "Repair Something",
    description: "Fix an item instead of replacing it. Extend product lifespans.",
    category: "lifestyle",
    difficulty: "medium",
    icon: "🔨",
    // Formula: New product CO2 avoided (partial)
    co2Formula: () => (5).toFixed(0),
    co2Impact: 5,
    unit: "kg CO₂",
    tips: ["YouTube tutorials help", "Repair cafes exist", "Sewing kits are cheap"]
  },
  {
    id: 48,
    title: "Secondhand Find",
    description: "Buy something used instead of new. Reuse beats recycling.",
    category: "lifestyle",
    difficulty: "easy",
    icon: "🔄",
    // Formula: New product manufacturing avoided
    co2Formula: () => (15).toFixed(0),
    co2Impact: 15,
    unit: "kg CO₂",
    tips: ["Thrift stores", "eBay and Facebook Marketplace", "Quality often better"]
  },
  {
    id: 49,
    title: "Eco-Product Switch",
    description: "Replace one household product with an eco-friendly alternative.",
    category: "lifestyle",
    difficulty: "medium",
    icon: "🧴",
    // Formula: Product lifecycle CO2 difference
    co2Formula: () => (3).toFixed(0),
    co2Impact: 3,
    unit: "kg CO₂",
    tips: ["Bamboo toothbrush", "Solid shampoo bars", "Refillable containers"]
  },
  {
    id: 50,
    title: "Spread the Word",
    description: "Tell 3 friends about climate action. Social influence multiplies impact.",
    category: "lifestyle",
    difficulty: "easy",
    icon: "📢",
    // Formula: Potential impact if friends act × probability
    co2Formula: (friends = 3) => (friends * 5 * 0.3).toFixed(1),
    co2Impact: 4.5,
    unit: "kg CO₂ potential",
    tips: ["Share this app", "Lead by example", "Make it fun, not preachy"]
  }
];

// Get a challenge based on the day of the year (rotates through all 50)
export const getDailyChallenge = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const challengeIndex = dayOfYear % challenges.length;
  return challenges[challengeIndex];
};

// Get challenges by category
export const getChallengesByCategory = (category) => {
  if (category === 'all') return challenges;
  return challenges.filter(c => c.category === category);
};

// Get challenges by difficulty
export const getChallengesByDifficulty = (difficulty) => {
  return challenges.filter(c => c.difficulty === difficulty);
};

// Calculate total potential CO2 if all challenges completed
export const getTotalPotentialCO2 = () => {
  return challenges.reduce((sum, c) => sum + c.co2Impact, 0).toFixed(1);
};
