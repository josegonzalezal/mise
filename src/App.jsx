import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ChevronRight, X, Search, Plus, Minus, Check, Heart, Bookmark,
  Star, Send, Sparkles, Clock, Flame, Users, ChefHat, Utensils, Salad, ShoppingBasket,
  User, Trash2, LogOut, Settings2, ThumbsUp, ThumbsDown, CookingPot,
  Timer, Wallet, Loader2, Refrigerator,
} from "lucide-react";

/* ============================================================
   MISE — recipe app
   Palette: deep kitchen green, warm cream, lime accent
   ============================================================ */

const C = {
  green: "#0B5233",
  greenMid: "#12784A",
  lime: "#C7F04D",
  limeSoft: "#E4F9AA",
  cream: "#F3F0E7",
  card: "#FFFFFF",
  chip: "#EDE8DB",
  ink: "#15190F",
  muted: "#6A7163",
  line: "#E2DCCC",
  red: "#B4432B",
};

const display = {
  fontFamily:
    'ui-rounded, "SF Pro Rounded", "Segoe UI Variable Display", "Trebuchet MS", system-ui, sans-serif',
  letterSpacing: "-0.02em",
};
const body = {
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

/* ============================================================
   1. OPTION SETS  (deliberately wider than the originals)
   ============================================================ */

const DIETS = [
  { id: "everything", label: "I eat everything", note: "Meat, veg, and everything in between." },
  { id: "flexitarian", label: "Flexitarian", note: "Mostly plants, meat now and then." },
  { id: "vegetarian", label: "Vegetarian", note: "No meat or fish. Dairy and eggs are fine." },
  { id: "pescatarian", label: "Pescatarian", note: "Fish and seafood, no meat." },
  { id: "vegan", label: "Vegan", note: "Plants only — no animal products at all." },
  { id: "lowcarb", label: "Low carb / keto", note: "Light on rice, pasta, bread and sugar." },
  { id: "mediterranean", label: "Mediterranean", note: "Olive oil, fish, pulses, lots of veg." },
  { id: "halal", label: "Halal", note: "No pork or alcohol in the cooking." },
  { id: "kosher", label: "Kosher-style", note: "No pork or shellfish, no meat with dairy." },
  { id: "highprotein", label: "High protein", note: "Protein first, at every dinner." },
];

const EXCLUSIONS = [
  ["pork", "Pork", "🥓"], ["beef", "Beef", "🥩"], ["lamb", "Lamb", "🐑"],
  ["shellfish", "Shellfish", "🦐"], ["fish", "Fish", "🐟"], ["dairy", "Dairy", "🥛"],
  ["eggs", "Eggs", "🥚"], ["gluten", "Gluten", "🌾"], ["nuts", "Tree nuts", "🌰"],
  ["peanuts", "Peanuts", "🥜"], ["soy", "Soy", "🫘"], ["sesame", "Sesame", "🫓"],
  ["mushrooms", "Mushrooms", "🍄"], ["alcohol", "Alcohol", "🍷"], ["celery", "Celery", "🥬"],
  ["mustard", "Mustard", "🌭"], ["coriander", "Coriander", "🌿"], ["onion", "Onion & garlic", "🧅"],
  ["offal", "Offal", "🫀"], ["chilli", "Chilli heat", "🌶️"],
];

const FLAVOURS = [
  ["Herbs", "🌿"], ["Cheesy", "🧀"], ["Sweet", "🍯"], ["Tangy", "🍋"], ["Spicy", "🌶️"],
  ["Umami", "🍄"], ["Smoky", "🔥"], ["Garlicky", "🧄"], ["Citrusy", "🍊"], ["Creamy", "🥥"],
  ["Nutty", "🥜"], ["Pickled", "🥒"], ["Earthy", "🥔"], ["Buttery", "🧈"],
  ["Fresh & light", "🥗"], ["Rich & indulgent", "🍫"], ["Charred", "♨️"], ["Peppery", "🫑"],
];

const PROTEINS = [
  ["Beef", "🥩"], ["Pork", "🥓"], ["Poultry", "🍗"], ["Lamb", "🐑"], ["Duck", "🦆"],
  ["Fish", "🐟"], ["Shellfish", "🦐"], ["Eggs", "🥚"], ["Tofu", "⬜"], ["Tempeh", "🟫"],
  ["Beans & lentils", "🫘"], ["Chickpeas", "🟡"], ["Paneer", "🧈"], ["Halloumi", "🧀"],
  ["Nuts & seeds", "🌰"], ["Plant mince", "🌱"],
];

const PERSONAL_GOALS = [
  "Save money", "Waste less food", "Try new recipes", "Save time", "Improve health",
  "Cook easier", "Learn techniques", "Cook for guests", "Prep for the week",
  "Eat more veg", "Cook with kids", "Lighter footprint",
];

const NUTRITION_GOALS = [
  "High in protein", "Low carb", "Calorie smart", "Source of fibre", "Extra vegetables",
  "Low sodium", "Less sugar", "Heart healthy", "Gut friendly", "Dairy free", "Iron rich",
];

const CUISINES = [
  ["Italian", "🍝"], ["French", "🥖"], ["Spanish", "🥘"], ["Greek", "🫒"], ["Turkish", "🌶️"],
  ["Lebanese", "🧆"], ["Moroccan", "🍲"], ["Indian", "🍛"], ["Chinese", "🥡"], ["Japanese", "🍱"],
  ["Korean", "🍚"], ["Thai", "🍜"], ["Vietnamese", "🍲"], ["Indonesian", "🥥"], ["Filipino", "🍢"],
  ["Mexican", "🌮"], ["Peruvian", "🌽"], ["Caribbean", "🍹"], ["American BBQ", "🍖"],
  ["British", "🥧"], ["Dutch", "🥔"], ["Belgian", "🍟"], ["German", "🥨"], ["Portuguese", "🐟"],
  ["Mediterranean", "🐠"], ["Middle Eastern", "🫓"], ["Fusion", "🥢"],
];

const DISHES = [
  ["Pasta", "🍝"], ["Bowls", "🥣"], ["Curry", "🍛"], ["Soups or Stews", "🍲"],
  ["Stir-fries", "🥢"], ["Bakes", "🧀"], ["Sheet-pan", "🔥"], ["Salads", "🥗"],
  ["Tacos", "🌮"], ["Wraps", "🌯"], ["Burgers", "🍔"], ["Sandwiches", "🥪"],
  ["Noodles", "🍜"], ["Ramen & broths", "🍥"], ["Rice dishes", "🍚"], ["Risotto", "🥘"],
  ["Flatbreads", "🫓"], ["Pizza", "🍕"], ["Grills & skewers", "🍢"], ["Dumplings & bao", "🥟"],
  ["Main + sides", "🍽️"], ["Breakfast-for-dinner", "🍳"], ["Pies & tarts", "🥧"],
];

const COOK_STYLES = [
  ["Quick recipes", "Under 20 minutes, minimal prep"],
  ["Chef-style recipes", "20–40 minutes, bakes and roasts"],
  ["Family-style recipes", "Kid and adult friendly"],
  ["One-pan", "Everything in a single pan or tray"],
  ["Batch cooking", "Cook once, eat three times"],
  ["No-cook", "Assembly only, no hob needed"],
  ["Slow weekend", "Long, low, worth the wait"],
  ["Air fryer", "Built around the air fryer"],
];

const EQUIPMENT = [
  "Oven", "Hob", "Microwave", "Air fryer", "Slow cooker", "Pressure cooker",
  "Blender", "Food processor", "Grill / BBQ", "Rice cooker", "Wok",
];

const SKILL_LEVELS = ["Beginner", "Home cook", "Confident", "Chef-y"];
const HEAT_WORDS = ["No heat", "A whisper", "Mild", "Warm", "Hot", "Fiery"];

/* ============================================================
   2. RECIPES
   ingredient string = name|qty(for 2)|unit|aisle
   ============================================================ */

const RAW = [
  {
    id: "gochujang-beef-bowl", title: "Gochujang Beef Bowl", cuisine: "Korean", dish: "Bowls",
    time: 25, kcal: 610, protein: 38, diff: "Easy", cost: 4.2, heat: 3, emoji: "🥩", hue: 12,
    blurb: "Sticky-sweet chilli beef over rice with quick pickled cucumber.",
    proteins: ["Beef"], flavours: ["Spicy", "Umami", "Sweet", "Pickled"],
    diets: ["everything", "highprotein", "halal"], allergens: ["soy", "sesame", "gluten"],
    equipment: ["Hob"], nutri: ["High in protein"], styles: ["Quick recipes", "One-pan"],
    ing: ["Beef mince|300|g|Meat & fish", "Jasmine rice|150|g|Pantry", "Gochujang paste|2|tbsp|Pantry",
      "Soy sauce|2|tbsp|Pantry", "Cucumber|1||Produce", "Spring onions|3||Produce",
      "Rice vinegar|1|tbsp|Pantry", "Sesame seeds|1|tbsp|Pantry", "Garlic|2|cloves|Produce"],
    steps: ["Rinse the rice and cook it with double its volume of water, lid on, 12 minutes. Rest off the heat.",
      "Slice the cucumber thin, toss with the vinegar and a pinch of salt. Leave to pickle.",
      "Fry the beef hard in a dry pan until browned and crisp at the edges, 6 minutes.",
      "Add grated garlic, gochujang and soy. Bubble 2 minutes until it lacquers the meat.",
      "Build the bowls: rice, beef, pickles, spring onion and sesame."],
  },
  {
    id: "coconut-lime-chicken", title: "Coconut Lime Chicken and Rice", cuisine: "Thai", dish: "Bowls",
    time: 30, kcal: 580, protein: 42, diff: "Easy", cost: 4.6, heat: 2, emoji: "🍗", hue: 30,
    blurb: "Charred chicken thighs, coconut rice and a chilli-lime dressing.",
    proteins: ["Poultry"], flavours: ["Creamy", "Citrusy", "Spicy", "Fresh & light"],
    diets: ["everything", "highprotein", "halal", "kosher"], allergens: [],
    equipment: ["Hob"], nutri: ["High in protein", "Dairy free"], styles: ["Chef-style recipes"],
    ing: ["Chicken thighs|400|g|Meat & fish", "Jasmine rice|150|g|Pantry", "Coconut milk|200|ml|Pantry",
      "Limes|2||Produce", "Red chilli|1||Produce", "Coriander|1|bunch|Produce",
      "Fish sauce|1|tbsp|Pantry", "Honey|1|tsp|Pantry"],
    steps: ["Cook the rice in the coconut milk topped up with water to twice the rice volume, 12 minutes.",
      "Season the chicken well and sear skin-side down until deep gold, 8 minutes. Flip and finish.",
      "Whisk lime juice, fish sauce, honey and sliced chilli into a dressing.",
      "Slice the chicken, spoon over the dressing, finish with coriander and a lime cheek."],
  },
  {
    id: "sheetpan-salmon", title: "Lemon Herb Sheet-Pan Salmon", cuisine: "Mediterranean", dish: "Sheet-pan",
    time: 30, kcal: 520, protein: 40, diff: "Easy", cost: 6.1, heat: 0, emoji: "🐟", hue: 8,
    blurb: "One tray: salmon, new potatoes, green beans and a herb-lemon crust.",
    proteins: ["Fish"], flavours: ["Herbs", "Citrusy", "Buttery", "Fresh & light"],
    diets: ["everything", "pescatarian", "mediterranean", "highprotein", "lowcarb"], allergens: ["fish", "dairy"],
    equipment: ["Oven"], nutri: ["High in protein", "Heart healthy", "Extra vegetables"],
    styles: ["Chef-style recipes", "One-pan"],
    ing: ["Salmon fillets|2||Meat & fish", "New potatoes|400|g|Produce", "Green beans|200|g|Produce",
      "Lemon|1||Produce", "Dill|1|bunch|Produce", "Butter|30|g|Dairy & eggs", "Olive oil|2|tbsp|Pantry"],
    steps: ["Heat the oven to 220°C. Halve the potatoes, toss with oil and salt, roast 20 minutes.",
      "Mash the butter with chopped dill and lemon zest.",
      "Push the potatoes aside, add beans and salmon to the tray. Top the fish with herb butter.",
      "Roast 10 minutes until the salmon just flakes. Squeeze over the lemon."],
  },
  {
    id: "chorizo-chickpea-stew", title: "Smoky Chorizo and Chickpea Stew", cuisine: "Spanish", dish: "Soups or Stews",
    time: 35, kcal: 540, protein: 28, diff: "Easy", cost: 3.8, heat: 2, emoji: "🥘", hue: 18,
    blurb: "Paprika-red, spoonable, better on day two.",
    proteins: ["Pork", "Chickpeas"], flavours: ["Smoky", "Garlicky", "Earthy"],
    diets: ["everything"], allergens: ["pork"],
    equipment: ["Hob"], nutri: ["Source of fibre", "Dairy free"], styles: ["Batch cooking", "One-pan"],
    ing: ["Cooking chorizo|200|g|Meat & fish", "Chickpeas|400|g|Pantry", "Chopped tomatoes|400|g|Pantry",
      "Onion|1||Produce", "Garlic|3|cloves|Produce", "Smoked paprika|2|tsp|Herbs & spices",
      "Spinach|100|g|Produce", "Chicken stock|300|ml|Pantry"],
    steps: ["Slice and fry the chorizo until the fat runs red, 4 minutes. Lift out.",
      "Soften the onion in that fat, add garlic and paprika, cook 1 minute.",
      "Tip in tomatoes, chickpeas and stock. Simmer 20 minutes until thick.",
      "Return the chorizo, wilt in the spinach, season and rest 5 minutes before serving."],
  },
  {
    id: "cacio-e-pepe", title: "Cacio e Pepe with Charred Broccoli", cuisine: "Italian", dish: "Pasta",
    time: 20, kcal: 610, protein: 22, diff: "Medium", cost: 2.9, heat: 1, emoji: "🍝", hue: 45,
    blurb: "Three ingredients doing an enormous amount of work.",
    proteins: [], flavours: ["Cheesy", "Peppery", "Charred", "Buttery"],
    diets: ["everything", "vegetarian", "flexitarian", "kosher"], allergens: ["dairy", "gluten"],
    equipment: ["Hob"], nutri: ["Extra vegetables"], styles: ["Quick recipes"],
    ing: ["Spaghetti|200|g|Pantry", "Pecorino|80|g|Dairy & eggs", "Black peppercorns|2|tsp|Herbs & spices",
      "Tenderstem broccoli|200|g|Produce", "Olive oil|1|tbsp|Pantry"],
    steps: ["Toast the crushed peppercorns in a dry pan until they smell like pepper again.",
      "Char the broccoli in oil in a hot pan, 5 minutes, then set aside.",
      "Boil the pasta in less water than usual so the water goes starchy.",
      "Off the heat, toss pasta with pecorino, pepper and splashes of pasta water until glossy, not grainy.",
      "Fold through the broccoli and eat immediately."],
  },
  {
    id: "butter-chicken", title: "Weeknight Butter Chicken", cuisine: "Indian", dish: "Curry",
    time: 40, kcal: 680, protein: 45, diff: "Medium", cost: 5.2, heat: 2, emoji: "🍛", hue: 25,
    blurb: "Yoghurt-marinated chicken in a tomato and cashew sauce.",
    proteins: ["Poultry"], flavours: ["Creamy", "Rich & indulgent", "Umami"],
    diets: ["everything", "highprotein", "halal"], allergens: ["dairy", "nuts"],
    equipment: ["Hob"], nutri: ["High in protein"], styles: ["Chef-style recipes"],
    ing: ["Chicken thighs|400|g|Meat & fish", "Greek yoghurt|100|g|Dairy & eggs", "Passata|400|g|Pantry",
      "Cashews|50|g|Pantry", "Garam masala|2|tsp|Herbs & spices", "Ginger|20|g|Produce",
      "Butter|40|g|Dairy & eggs", "Basmati rice|150|g|Pantry", "Garlic|3|cloves|Produce"],
    steps: ["Marinate the diced chicken in yoghurt, half the spice, grated garlic and ginger. 15 minutes minimum.",
      "Soak the cashews in hot water, then blend smooth with a splash of the water.",
      "Sear the chicken in butter until coloured. Lift out.",
      "Add passata and remaining spice, simmer 10 minutes, stir in the cashew cream.",
      "Return the chicken, simmer 8 minutes. Serve with rice."],
  },
  {
    id: "tofu-pad-thai", title: "Crispy Tofu Pad Thai", cuisine: "Thai", dish: "Noodles",
    time: 30, kcal: 590, protein: 26, diff: "Medium", cost: 3.6, heat: 2, emoji: "🍜", hue: 35,
    blurb: "Tamarind, peanuts, lime — and tofu that actually crisps.",
    proteins: ["Tofu", "Eggs", "Nuts & seeds"], flavours: ["Tangy", "Nutty", "Sweet", "Umami"],
    diets: ["everything", "vegetarian", "flexitarian"], allergens: ["soy", "peanuts", "eggs"],
    equipment: ["Wok", "Hob"], nutri: ["Source of fibre", "Dairy free"], styles: ["Chef-style recipes"],
    ing: ["Firm tofu|280|g|Dairy & eggs", "Rice noodles|180|g|Pantry", "Tamarind paste|2|tbsp|Pantry",
      "Peanuts|50|g|Pantry", "Eggs|2||Dairy & eggs", "Beansprouts|150|g|Produce",
      "Lime|1||Produce", "Soy sauce|2|tbsp|Pantry", "Palm sugar|1|tbsp|Pantry"],
    steps: ["Press the tofu dry, cube it, and fry in a thin layer of oil without touching it for 4 minutes a side.",
      "Soak the noodles in just-boiled water until bendy but firm.",
      "Mix tamarind, soy and sugar into a sauce.",
      "Scramble the eggs in the hot wok, add noodles and sauce, toss hard for 2 minutes.",
      "Fold in tofu and beansprouts. Peanuts and lime at the table."],
  },
  {
    id: "birria-tacos", title: "Birria-Style Beef Tacos", cuisine: "Mexican", dish: "Tacos",
    time: 50, kcal: 720, protein: 44, diff: "Chef", cost: 6.4, heat: 3, emoji: "🌮", hue: 10,
    blurb: "Chilli-braised beef, tortillas fried in the fat, consommé for dipping.",
    proteins: ["Beef"], flavours: ["Smoky", "Rich & indulgent", "Charred", "Spicy"],
    diets: ["everything", "highprotein", "halal"], allergens: ["gluten", "dairy"],
    equipment: ["Hob", "Oven"], nutri: ["High in protein"], styles: ["Slow weekend", "Chef-style recipes"],
    ing: ["Beef short rib|500|g|Meat & fish", "Dried ancho chillies|3||Herbs & spices", "Corn tortillas|8||Bakery",
      "Onion|1||Produce", "Beef stock|500|ml|Pantry", "Cumin|1|tsp|Herbs & spices",
      "Cheddar|80|g|Dairy & eggs", "Lime|1||Produce", "Coriander|1|bunch|Produce"],
    steps: ["Toast the chillies until fragrant, soak in hot stock 10 minutes, then blend with cumin and half the onion.",
      "Brown the beef hard on all sides in a heavy pot.",
      "Pour over the chilli stock, cover, and braise at 160°C for 2 hours (or 35 minutes in a pressure cooker).",
      "Shred the beef, skim the red fat from the top of the broth.",
      "Dip tortillas in that fat, fry, fill with beef and cheese, fold and crisp. Serve broth alongside."],
  },
  {
    id: "miso-mushroom-ramen", title: "Miso Mushroom Ramen", cuisine: "Japanese", dish: "Ramen & broths",
    time: 30, kcal: 480, protein: 20, diff: "Medium", cost: 3.4, heat: 1, emoji: "🍥", hue: 28,
    blurb: "A deep, savoury broth built in half an hour, not overnight.",
    proteins: ["Eggs"], flavours: ["Umami", "Earthy", "Garlicky"],
    diets: ["everything", "vegetarian", "flexitarian"], allergens: ["soy", "gluten", "eggs", "mushrooms", "sesame"],
    equipment: ["Hob"], nutri: ["Low sodium"], styles: ["Chef-style recipes"],
    ing: ["Mixed mushrooms|250|g|Produce", "Ramen noodles|180|g|Pantry", "White miso|3|tbsp|Pantry",
      "Eggs|2||Dairy & eggs", "Spring onions|3||Produce", "Garlic|3|cloves|Produce",
      "Sesame oil|1|tbsp|Pantry", "Vegetable stock|700|ml|Pantry"],
    steps: ["Boil the eggs for 6½ minutes, then straight into cold water and peel.",
      "Fry the mushrooms in sesame oil, hard, until browned and squeaky. Season.",
      "Add garlic and stock, simmer 10 minutes. Whisk the miso in off the boil so it stays alive.",
      "Cook the noodles separately, drain, and put them in the bowls first.",
      "Ladle over broth and mushrooms, halve the eggs, scatter spring onion."],
  },
  {
    id: "harissa-halloumi-traybake", title: "Harissa Halloumi Traybake", cuisine: "Middle Eastern", dish: "Sheet-pan",
    time: 30, kcal: 560, protein: 26, diff: "Easy", cost: 4.1, heat: 2, emoji: "🧀", hue: 20,
    blurb: "Squeaky cheese, blistered peppers, one tray to wash.",
    proteins: ["Halloumi", "Chickpeas"], flavours: ["Spicy", "Cheesy", "Charred", "Smoky"],
    diets: ["everything", "vegetarian", "flexitarian", "kosher", "mediterranean"], allergens: ["dairy"],
    equipment: ["Oven"], nutri: ["High in protein", "Source of fibre", "Extra vegetables"],
    styles: ["One-pan", "Quick recipes"],
    ing: ["Halloumi|225|g|Dairy & eggs", "Chickpeas|400|g|Pantry", "Red peppers|2||Produce",
      "Red onion|1||Produce", "Harissa|2|tbsp|Pantry", "Lemon|1||Produce",
      "Olive oil|2|tbsp|Pantry", "Flatbreads|2||Bakery"],
    steps: ["Heat the oven to 220°C. Chop peppers and onion into big pieces.",
      "Toss with drained chickpeas, harissa and oil. Roast 15 minutes.",
      "Slice the halloumi thick, lay it on top, roast 10 minutes more until it blisters.",
      "Squeeze over lemon and scoop it up with warm flatbread."],
  },
  {
    id: "green-shakshuka", title: "Green Shakshuka", cuisine: "Middle Eastern", dish: "Breakfast-for-dinner",
    time: 25, kcal: 430, protein: 24, diff: "Easy", cost: 3.2, heat: 1, emoji: "🍳", hue: 85,
    blurb: "Eggs poached in a garlicky pan of greens instead of tomato.",
    proteins: ["Eggs"], flavours: ["Herbs", "Garlicky", "Fresh & light", "Peppery"],
    diets: ["everything", "vegetarian", "flexitarian", "lowcarb", "mediterranean", "kosher"], allergens: ["eggs", "dairy"],
    equipment: ["Hob"], nutri: ["High in protein", "Extra vegetables", "Low carb"], styles: ["Quick recipes", "One-pan"],
    ing: ["Eggs|4||Dairy & eggs", "Spinach|200|g|Produce", "Courgette|1||Produce",
      "Feta|80|g|Dairy & eggs", "Garlic|3|cloves|Produce", "Cumin|1|tsp|Herbs & spices",
      "Parsley|1|bunch|Produce", "Sourdough|2|slices|Bakery"],
    steps: ["Grate the courgette and fry with garlic and cumin until the water cooks off.",
      "Add the spinach a handful at a time until it collapses. Season hard.",
      "Make four wells, crack in the eggs, cover and cook 5 minutes for runny yolks.",
      "Crumble over feta and parsley. Toast the bread while you wait."],
  },
  {
    id: "sticky-sesame-aubergine", title: "Sticky Sesame Aubergine", cuisine: "Chinese", dish: "Stir-fries",
    time: 25, kcal: 450, protein: 14, diff: "Easy", cost: 3.0, heat: 2, emoji: "🍆", hue: 275,
    blurb: "Aubergine cooked until it gives up completely, in a sweet-sharp glaze.",
    proteins: ["Tofu"], flavours: ["Sweet", "Umami", "Garlicky", "Nutty"],
    diets: ["everything", "vegetarian", "vegan", "flexitarian"], allergens: ["soy", "sesame", "gluten"],
    equipment: ["Wok", "Hob"], nutri: ["Dairy free", "Source of fibre"], styles: ["Quick recipes"],
    ing: ["Aubergines|2||Produce", "Soy sauce|3|tbsp|Pantry", "Rice vinegar|2|tbsp|Pantry",
      "Maple syrup|2|tbsp|Pantry", "Garlic|3|cloves|Produce", "Ginger|20|g|Produce",
      "Sesame seeds|1|tbsp|Pantry", "Jasmine rice|150|g|Pantry", "Cornflour|1|tsp|Pantry"],
    steps: ["Cut the aubergine into wedges, salt for 10 minutes, pat dry. This is what stops it drinking the oil.",
      "Fry in a hot wok until collapsed and bronze, 10 minutes.",
      "Mix soy, vinegar, maple, garlic, ginger and cornflour. Pour in.",
      "Bubble 2 minutes until it clings. Sesame on top, rice underneath."],
  },
  {
    id: "mushroom-risotto", title: "Mushroom Risotto", cuisine: "Italian", dish: "Risotto",
    time: 35, kcal: 620, protein: 18, diff: "Medium", cost: 4.0, heat: 0, emoji: "🍚", hue: 38,
    blurb: "Stirred, not rushed. Loose enough to move on the plate.",
    proteins: [], flavours: ["Earthy", "Umami", "Cheesy", "Buttery"],
    diets: ["everything", "vegetarian", "flexitarian", "kosher"], allergens: ["dairy", "mushrooms", "alcohol"],
    equipment: ["Hob"], nutri: [], styles: ["Chef-style recipes"],
    ing: ["Arborio rice|180|g|Pantry", "Chestnut mushrooms|250|g|Produce", "Dried porcini|10|g|Pantry",
      "White wine|100|ml|Pantry", "Parmesan|60|g|Dairy & eggs", "Butter|40|g|Dairy & eggs",
      "Shallots|2||Produce", "Vegetable stock|800|ml|Pantry"],
    steps: ["Soak the porcini in hot stock. That liquid is the whole flavour, don't throw it away.",
      "Brown the fresh mushrooms separately and set aside so they stay meaty.",
      "Soften the shallots, add rice and toast 2 minutes, then the wine until it disappears.",
      "Add stock a ladle at a time, stirring, 18 minutes.",
      "Beat in butter and parmesan off the heat, fold in the mushrooms, rest 2 minutes."],
  },
  {
    id: "peri-peri-burger", title: "Peri-Peri Chicken Burger", cuisine: "Fusion", dish: "Burgers",
    time: 30, kcal: 740, protein: 46, diff: "Easy", cost: 4.8, heat: 3, emoji: "🍔", hue: 15,
    blurb: "Butterflied thigh, chilli-lemon marinade, slaw with actual crunch.",
    proteins: ["Poultry"], flavours: ["Spicy", "Tangy", "Charred", "Smoky"],
    diets: ["everything", "highprotein", "halal"], allergens: ["gluten", "eggs", "dairy"],
    equipment: ["Hob", "Grill / BBQ"], nutri: ["High in protein"], styles: ["Chef-style recipes"],
    ing: ["Chicken thighs|400|g|Meat & fish", "Brioche buns|2||Bakery", "Red chillies|2||Produce",
      "Lemon|1||Produce", "Smoked paprika|1|tsp|Herbs & spices", "White cabbage|200|g|Produce",
      "Mayonnaise|3|tbsp|Pantry", "Garlic|2|cloves|Produce"],
    steps: ["Blend chillies, garlic, paprika, lemon juice and oil. Marinate the flattened thighs 15 minutes.",
      "Shred the cabbage very fine and dress with mayo, lemon and salt.",
      "Grill the chicken hard, 5 minutes a side, until charred at the edges.",
      "Toast the buns cut-side down in the same pan. Build: slaw, chicken, more slaw."],
  },
  {
    id: "stamppot", title: "Stamppot with Smoked Sausage", cuisine: "Dutch", dish: "Main + sides",
    time: 40, kcal: 690, protein: 30, diff: "Easy", cost: 3.9, heat: 0, emoji: "🥔", hue: 95,
    blurb: "Mashed potato and kale with a well of gravy in the middle.",
    proteins: ["Pork"], flavours: ["Buttery", "Earthy", "Peppery"],
    diets: ["everything"], allergens: ["dairy", "pork"],
    equipment: ["Hob"], nutri: ["Source of fibre"], styles: ["Family-style recipes"],
    ing: ["Floury potatoes|700|g|Produce", "Kale|200|g|Produce", "Smoked sausage|1||Meat & fish",
      "Butter|50|g|Dairy & eggs", "Milk|100|ml|Dairy & eggs", "Mustard|1|tbsp|Pantry",
      "Onion|1||Produce", "Beef gravy|200|ml|Pantry"],
    steps: ["Boil the potatoes in salted water, 18 minutes, adding the shredded kale for the last 4.",
      "Warm the sausage through in the same pan on top, lid on.",
      "Drain, mash with butter, hot milk and mustard. Keep it rough.",
      "Fry the onion until sweet and stir it through. Serve with the sausage and a pool of gravy."],
  },
  {
    id: "zaatar-chicken-flatbread", title: "Za'atar Chicken Flatbreads", cuisine: "Lebanese", dish: "Flatbreads",
    time: 25, kcal: 620, protein: 40, diff: "Easy", cost: 4.3, heat: 1, emoji: "🫓", hue: 40,
    blurb: "Warm bread, garlic yoghurt, herb-crusted chicken, pickled onion.",
    proteins: ["Poultry"], flavours: ["Herbs", "Tangy", "Garlicky", "Pickled"],
    diets: ["everything", "highprotein", "halal", "mediterranean"], allergens: ["gluten", "dairy", "sesame"],
    equipment: ["Hob"], nutri: ["High in protein"], styles: ["Quick recipes"],
    ing: ["Chicken breast|350|g|Meat & fish", "Flatbreads|2||Bakery", "Za'atar|2|tbsp|Herbs & spices",
      "Greek yoghurt|150|g|Dairy & eggs", "Red onion|1||Produce", "Lemon|1||Produce",
      "Garlic|1|clove|Produce", "Tomatoes|2||Produce"],
    steps: ["Slice the onion thin and squeeze lemon over it with salt. Ten minutes and it turns pink.",
      "Coat the sliced chicken in za'atar and oil, fry hot until cooked through, 8 minutes.",
      "Stir grated garlic and lemon into the yoghurt.",
      "Warm the flatbreads in the pan. Spread yoghurt, pile on chicken, tomato and pickled onion."],
  },
  {
    id: "thai-green-prawn-curry", title: "Thai Green Prawn Curry", cuisine: "Thai", dish: "Curry",
    time: 25, kcal: 520, protein: 32, diff: "Easy", cost: 6.8, heat: 3, emoji: "🍤", hue: 100,
    blurb: "Fifteen minutes of simmering, then the prawns go in and it's done.",
    proteins: ["Shellfish"], flavours: ["Spicy", "Creamy", "Citrusy", "Fresh & light"],
    diets: ["everything", "pescatarian", "highprotein"], allergens: ["shellfish", "fish"],
    equipment: ["Hob"], nutri: ["High in protein", "Dairy free"], styles: ["Quick recipes", "One-pan"],
    ing: ["King prawns|300|g|Meat & fish", "Green curry paste|3|tbsp|Pantry", "Coconut milk|400|ml|Pantry",
      "Green beans|150|g|Produce", "Thai basil|1|bunch|Produce", "Lime|1||Produce",
      "Fish sauce|1|tbsp|Pantry", "Jasmine rice|150|g|Pantry"],
    steps: ["Start the rice.",
      "Fry the paste in a spoon of the thick coconut cream until it splits and smells sharp.",
      "Add the rest of the coconut milk and simmer 8 minutes to thicken.",
      "Add beans, 3 minutes, then prawns, 3 minutes, until just pink.",
      "Fish sauce, lime and torn basil at the very end."],
  },
  {
    id: "kimchi-fried-rice", title: "Kimchi Fried Rice", cuisine: "Korean", dish: "Rice dishes",
    time: 20, kcal: 540, protein: 22, diff: "Easy", cost: 2.8, heat: 3, emoji: "🍚", hue: 5,
    blurb: "The best possible use of yesterday's rice and a jar going soft.",
    proteins: ["Eggs"], flavours: ["Spicy", "Pickled", "Umami"],
    diets: ["everything", "vegetarian", "flexitarian"], allergens: ["eggs", "soy", "sesame"],
    equipment: ["Wok", "Hob"], nutri: ["Gut friendly"], styles: ["Quick recipes", "One-pan"],
    ing: ["Cooked rice|400|g|Pantry", "Kimchi|200|g|Produce", "Eggs|2||Dairy & eggs",
      "Spring onions|3||Produce", "Sesame oil|1|tbsp|Pantry", "Soy sauce|1|tbsp|Pantry",
      "Gochujang|1|tbsp|Pantry"],
    steps: ["Chop the kimchi and fry it in sesame oil until the edges caramelise, 4 minutes.",
      "Stir in gochujang and the kimchi brine from the jar.",
      "Add cold rice and press it into the pan. Leave it alone so a crust forms.",
      "Fry the eggs separately with crisp edges. One per bowl, on top, yolk broken into the rice."],
  },
  {
    id: "muhammara-pasta", title: "Red Pepper and Walnut Pasta", cuisine: "Turkish", dish: "Pasta",
    time: 25, kcal: 640, protein: 20, diff: "Easy", cost: 3.1, heat: 1, emoji: "🌶️", hue: 355,
    blurb: "Muhammara turned into a sauce — sweet peppers, walnuts, pomegranate molasses.",
    proteins: ["Nuts & seeds"], flavours: ["Nutty", "Sweet", "Smoky", "Tangy"],
    diets: ["everything", "vegetarian", "vegan", "flexitarian", "mediterranean"], allergens: ["nuts", "gluten"],
    equipment: ["Blender", "Hob"], nutri: ["Source of fibre", "Dairy free", "Heart healthy"],
    styles: ["Quick recipes"],
    ing: ["Rigatoni|200|g|Pantry", "Roasted red peppers|300|g|Pantry", "Walnuts|70|g|Pantry",
      "Pomegranate molasses|1|tbsp|Pantry", "Garlic|2|cloves|Produce", "Cumin|1|tsp|Herbs & spices",
      "Chilli flakes|1|tsp|Herbs & spices", "Parsley|1|bunch|Produce"],
    steps: ["Toast the walnuts in a dry pan until they smell like biscuits. Keep a handful back.",
      "Blend peppers, walnuts, garlic, cumin, molasses and chilli into a coarse sauce.",
      "Cook the pasta, keeping a mug of the water.",
      "Warm the sauce in the pan, loosen with pasta water, toss the pasta through.",
      "Crushed walnuts and parsley on top."],
  },
  {
    id: "katsu-curry", title: "Chicken Katsu Curry", cuisine: "Japanese", dish: "Curry",
    time: 40, kcal: 780, protein: 44, diff: "Medium", cost: 5.0, heat: 1, emoji: "🍱", hue: 32,
    blurb: "Crunchy panko chicken, glossy curry sauce, pickles to cut it.",
    proteins: ["Poultry"], flavours: ["Umami", "Sweet", "Rich & indulgent"],
    diets: ["everything", "highprotein", "halal"], allergens: ["gluten", "eggs", "soy"],
    equipment: ["Hob", "Oven"], nutri: ["High in protein"], styles: ["Chef-style recipes"],
    ing: ["Chicken breast|2||Meat & fish", "Panko breadcrumbs|80|g|Pantry", "Eggs|1||Dairy & eggs",
      "Plain flour|40|g|Pantry", "Carrot|1||Produce", "Onion|1||Produce",
      "Curry powder|2|tbsp|Herbs & spices", "Chicken stock|400|ml|Pantry", "Jasmine rice|150|g|Pantry"],
    steps: ["Soften onion and carrot slowly, 10 minutes, then add curry powder and flour, cook 2 minutes.",
      "Add stock gradually, simmer 15 minutes, then blend smooth. It should coat a spoon.",
      "Flatten the chicken, then flour, egg and panko it, pressing hard.",
      "Shallow-fry 4 minutes a side until deep gold, rest on a rack so it stays crisp.",
      "Slice thick, pour sauce beside rather than over. Rice alongside."],
  },
  {
    id: "black-bean-chilli", title: "Black Bean and Sweet Potato Chilli", cuisine: "Mexican", dish: "Soups or Stews",
    time: 35, kcal: 480, protein: 18, diff: "Easy", cost: 2.6, heat: 2, emoji: "🫘", hue: 22,
    blurb: "Cheap, big-batch, and better every day of the week.",
    proteins: ["Beans & lentils"], flavours: ["Smoky", "Sweet", "Earthy", "Spicy"],
    diets: ["everything", "vegetarian", "vegan", "flexitarian", "halal", "kosher"], allergens: [],
    equipment: ["Hob"], nutri: ["Source of fibre", "Extra vegetables", "Dairy free", "Iron rich"],
    styles: ["Batch cooking", "One-pan", "Family-style recipes"],
    ing: ["Black beans|800|g|Pantry", "Sweet potatoes|2||Produce", "Chopped tomatoes|400|g|Pantry",
      "Onion|1||Produce", "Chipotle paste|2|tbsp|Pantry", "Cumin|2|tsp|Herbs & spices",
      "Lime|1||Produce", "Coriander|1|bunch|Produce", "Garlic|3|cloves|Produce"],
    steps: ["Dice the sweet potato small so it cooks in the time the sauce takes.",
      "Fry onion and garlic, add cumin and chipotle, cook until it darkens.",
      "Add tomatoes, beans, sweet potato and a splash of water. Simmer 25 minutes, lid ajar.",
      "Mash a little against the side of the pan to thicken it. Lime and coriander to finish."],
  },
  {
    id: "croque-madame", title: "Croque Madame", cuisine: "French", dish: "Sandwiches",
    time: 20, kcal: 720, protein: 34, diff: "Easy", cost: 3.3, heat: 0, emoji: "🥪", hue: 48,
    blurb: "Béchamel on the outside too. That's the whole trick.",
    proteins: ["Pork", "Eggs"], flavours: ["Cheesy", "Buttery", "Rich & indulgent"],
    diets: ["everything"], allergens: ["dairy", "gluten", "eggs", "pork", "mustard"],
    equipment: ["Hob", "Oven"], nutri: ["High in protein"], styles: ["Quick recipes"],
    ing: ["Sourdough|4|slices|Bakery", "Ham|100|g|Meat & fish", "Gruyère|100|g|Dairy & eggs",
      "Butter|30|g|Dairy & eggs", "Plain flour|20|g|Pantry", "Milk|250|ml|Dairy & eggs",
      "Dijon mustard|1|tsp|Pantry", "Eggs|2||Dairy & eggs"],
    steps: ["Melt butter, stir in flour, cook 1 minute, then whisk in milk slowly until thick. Add mustard and half the cheese.",
      "Butter the bread on the outside. Fill with ham and béchamel.",
      "Fry both sides gold, then top with more béchamel and cheese.",
      "Grill until blistered. Fry an egg and lay it on top."],
  },
  {
    id: "lemon-orzo-soup", title: "Lemon Chicken Orzo Soup", cuisine: "Greek", dish: "Soups or Stews",
    time: 30, kcal: 460, protein: 34, diff: "Easy", cost: 3.7, heat: 0, emoji: "🍲", hue: 55,
    blurb: "Avgolemono logic: egg and lemon whisked in to make it silky.",
    proteins: ["Poultry", "Eggs"], flavours: ["Citrusy", "Herbs", "Fresh & light"],
    diets: ["everything", "highprotein", "mediterranean", "halal"], allergens: ["gluten", "eggs", "celery"],
    equipment: ["Hob"], nutri: ["High in protein", "Calorie smart", "Dairy free"], styles: ["Quick recipes", "One-pan"],
    ing: ["Chicken breast|300|g|Meat & fish", "Orzo|120|g|Pantry", "Chicken stock|1|l|Pantry",
      "Lemons|2||Produce", "Eggs|2||Dairy & eggs", "Carrot|1||Produce",
      "Celery|2|sticks|Produce", "Dill|1|bunch|Produce"],
    steps: ["Simmer the whole chicken breasts in the stock with diced carrot and celery, 15 minutes. Lift out and shred.",
      "Add the orzo to the stock and cook 8 minutes.",
      "Whisk eggs with lemon juice, then trickle in a ladle of hot stock while whisking hard.",
      "Take the pot off the heat and stir the mixture in — never let it boil after this.",
      "Return the chicken, add dill, more lemon than feels sensible."],
  },
  {
    id: "crispy-gnocchi", title: "Crispy Gnocchi, Sage Butter", cuisine: "Italian", dish: "Main + sides",
    time: 20, kcal: 580, protein: 16, diff: "Easy", cost: 3.0, heat: 0, emoji: "🥔", hue: 75,
    blurb: "Don't boil it. Fry it straight from the packet.",
    proteins: [], flavours: ["Buttery", "Herbs", "Nutty", "Charred"],
    diets: ["everything", "vegetarian", "flexitarian", "kosher"], allergens: ["dairy", "gluten"],
    equipment: ["Hob"], nutri: ["Extra vegetables"], styles: ["Quick recipes", "One-pan"],
    ing: ["Gnocchi|500|g|Pantry", "Butter|50|g|Dairy & eggs", "Sage|1|bunch|Produce",
      "Parmesan|40|g|Dairy & eggs", "Cherry tomatoes|200|g|Produce", "Garlic|2|cloves|Produce",
      "Lemon|1||Produce"],
    steps: ["Fry the gnocchi dry-packet in oil in a single layer, undisturbed, 4 minutes a side.",
      "Push aside, add butter, sage and sliced garlic. Let the butter go nut-brown.",
      "Add the tomatoes and burst them with the back of a spoon.",
      "Toss everything, finish with lemon and parmesan."],
  },
  {
    id: "pork-belly-bao", title: "Pork Belly Bao", cuisine: "Chinese", dish: "Dumplings & bao",
    time: 55, kcal: 700, protein: 32, diff: "Chef", cost: 5.6, heat: 2, emoji: "🥟", hue: 350,
    blurb: "Braised until the fat melts, then pressed into steamed buns.",
    proteins: ["Pork", "Nuts & seeds"], flavours: ["Sweet", "Umami", "Pickled", "Rich & indulgent"],
    diets: ["everything"], allergens: ["pork", "soy", "gluten", "peanuts", "sesame"],
    equipment: ["Hob"], nutri: [], styles: ["Slow weekend", "Chef-style recipes"],
    ing: ["Pork belly|500|g|Meat & fish", "Bao buns|6||Frozen", "Soy sauce|4|tbsp|Pantry",
      "Brown sugar|2|tbsp|Pantry", "Star anise|2||Herbs & spices", "Ginger|30|g|Produce",
      "Cucumber|1||Produce", "Peanuts|40|g|Pantry", "Coriander|1|bunch|Produce"],
    steps: ["Cut the belly into thick strips and brown them hard in a dry pan. Pour off most of the fat.",
      "Add soy, sugar, star anise, sliced ginger and water to come halfway up. Cover and simmer 45 minutes.",
      "Uncover and reduce until the sauce is syrupy and clings.",
      "Steam the buns 6 minutes.",
      "Fill with pork, cucumber ribbons, crushed peanuts and coriander."],
  },
  {
    id: "paneer-tikka-skewers", title: "Paneer Tikka Skewers", cuisine: "Indian", dish: "Grills & skewers",
    time: 30, kcal: 540, protein: 28, diff: "Easy", cost: 4.4, heat: 2, emoji: "🍢", hue: 16,
    blurb: "Yoghurt marinade, hot grill, char on every edge.",
    proteins: ["Paneer"], flavours: ["Spicy", "Tangy", "Charred", "Smoky"],
    diets: ["everything", "vegetarian", "flexitarian", "highprotein", "kosher"], allergens: ["dairy"],
    equipment: ["Oven", "Grill / BBQ"], nutri: ["High in protein", "Low carb", "Extra vegetables"],
    styles: ["Chef-style recipes"],
    ing: ["Paneer|400|g|Dairy & eggs", "Greek yoghurt|150|g|Dairy & eggs", "Tandoori spice|2|tbsp|Herbs & spices",
      "Red pepper|1||Produce", "Red onion|1||Produce", "Lemon|1||Produce",
      "Ginger|20|g|Produce", "Mint|1|bunch|Produce"],
    steps: ["Mix yoghurt, spice, grated ginger, lemon and salt. Keep a third back for the sauce.",
      "Cube the paneer, pepper and onion, coat in the marinade, leave 15 minutes.",
      "Thread onto skewers and grill on the top shelf at full heat, 12 minutes, turning once.",
      "Stir chopped mint into the reserved yoghurt and serve as a dip."],
  },
];

const RECIPES = RAW.map((r) => ({
  ...r,
  ingredients: r.ing.map((s) => {
    const [name, qty, unit, aisle] = s.split("|");
    return { name, qty: qty ? parseFloat(qty) : null, unit: unit || "", aisle: aisle || "Pantry" };
  }),
}));

const AISLES = ["Produce", "Meat & fish", "Dairy & eggs", "Bakery", "Pantry", "Herbs & spices", "Frozen", "Other"];

const PANTRY_SUGGESTIONS = [
  "Eggs", "Onion", "Garlic", "Rice", "Pasta", "Chicken", "Beef mince", "Tinned tomatoes",
  "Chickpeas", "Potatoes", "Cheddar", "Yoghurt", "Spinach", "Carrot", "Lemon", "Soy sauce",
  "Tofu", "Bread", "Peppers", "Mushrooms", "Coconut milk", "Beans", "Courgette", "Butter",
];

/* ============================================================
   3. STORAGE
   ============================================================ */

const STATE_KEY = "mise:state:v1";
const CHAT_KEY = "mise:chat:v1";

const blankProfile = () => ({
  diet: "everything",
  adults: 1, kids: 0, teens: 0,
  exclude: [],
  flavours: {}, proteins: {}, cuisines: {}, dishes: {},
  personalGoals: [], nutritionGoals: [],
  styles: [], equipment: ["Oven", "Hob", "Microwave"],
  heat: 3, skill: "Home cook", budget: 6, weekdayTime: 40,
});

const blankState = (account) => ({
  account,
  onboarded: false,
  profile: blankProfile(),
  saved: [], favourites: [], cooked: [], ratings: {},
  pantry: [],
  grocery: [],
  custom: [],
});

const AI_KEY = "mise:ai:v1";
const DEFAULT_MODEL = "gemini-3.5-flash";

function readKey(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}
function writeKey(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}
function getAI() {
  const v = readKey(AI_KEY);
  return { apiKey: "", model: DEFAULT_MODEL, ...(v || {}) };
}
function saveAI(v) { writeKey(AI_KEY, v); }

/* ============================================================
   4. MATCHING
   ============================================================ */

function scoreRecipe(recipe, p) {
  if (!p) return { score: 60, reasons: [], blocked: false };
  const reasons = [];
  if (recipe.allergens.some((a) => p.exclude.includes(a)))
    return { score: 0, reasons: ["Contains something you avoid"], blocked: true };
  if (p.diet !== "everything" && !recipe.diets.includes(p.diet))
    return { score: 0, reasons: ["Off your diet"], blocked: true };
  if (p.heat < recipe.heat - 1)
    return { score: 0, reasons: ["Hotter than you like"], blocked: true };

  let s = 55;
  const cu = p.cuisines[recipe.cuisine];
  if (cu === 1) { s += 16; reasons.push(`${recipe.cuisine} is a favourite`); }
  if (cu === -1) s -= 45;
  const di = p.dishes[recipe.dish];
  if (di === 1) { s += 16; reasons.push(`You like ${recipe.dish.toLowerCase()}`); }
  if (di === -1) s -= 40;

  let pr = 0;
  recipe.proteins.forEach((x) => {
    if (p.proteins[x] === 1) pr += 8;
    if (p.proteins[x] === -1) pr -= 35;
  });
  s += Math.max(-40, Math.min(16, pr));
  if (pr > 0) reasons.push("Protein you rated up");

  let fl = 0;
  recipe.flavours.forEach((x) => {
    if (p.flavours[x] === 1) fl += 6;
    if (p.flavours[x] === -1) fl -= 12;
  });
  s += Math.max(-20, Math.min(18, fl));
  if (fl >= 12) reasons.push("Your kind of flavours");

  const nut = recipe.nutri.filter((n) => p.nutritionGoals.includes(n));
  s += Math.min(14, nut.length * 7);
  if (nut.length) reasons.push(nut[0].toLowerCase());

  if (recipe.styles.some((x) => p.styles.includes(x))) { s += 9; reasons.push("Cooks the way you do"); }
  if (recipe.time <= p.weekdayTime) s += 6; else s -= 8;
  if (recipe.cost <= p.budget) s += 5; else s -= 6;
  if (p.personalGoals.includes("Save money") && recipe.cost <= 3.5) { s += 6; reasons.push("Under budget"); }
  if (p.personalGoals.includes("Save time") && recipe.time <= 25) { s += 6; reasons.push("Fast"); }
  if (recipe.equipment.some((e) => !p.equipment.includes(e))) s -= 12;

  const idx = SKILL_LEVELS.indexOf(p.skill);
  if (recipe.diff === "Chef" && idx < 2) s -= 12;
  if (recipe.diff === "Easy" && idx >= 2) s -= 3;

  return { score: Math.max(28, Math.min(99, Math.round(s))), reasons: reasons.slice(0, 2), blocked: false };
}

function pantryMatch(recipe, pantry) {
  if (!pantry.length) return { have: 0, total: recipe.ingredients.length, missing: [] };
  const norm = (x) => x.toLowerCase().replace(/s$/, "");
  const p = pantry.map(norm);
  const missing = [];
  let have = 0;
  recipe.ingredients.forEach((i) => {
    const n = norm(i.name);
    const hit = p.some((x) => n.includes(x) || x.includes(n));
    if (hit) have++; else missing.push(i.name);
  });
  return { have, total: recipe.ingredients.length, missing };
}

/* ============================================================
   5. SMALL UI PIECES
   ============================================================ */

function Chip({ children, active, tone = "lime", onClick, small }) {
  const bg = active ? (tone === "red" ? "#F3D2CA" : C.lime) : C.chip;
  return (
    <button onClick={onClick} style={{ ...body, background: bg, color: C.ink }}
      className={`rounded-full font-semibold transition-colors ${small ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm"}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "", style }) {
  return (
    <div className={`rounded-3xl ${className}`} style={{ background: C.card, ...style }}>{children}</div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <Card className="p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div style={{ color: C.greenMid }}>{icon}</div>
        <h3 className="text-xl font-extrabold" style={{ ...display, color: C.ink }}>{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function RowLink({ title, chips, onClick, hint }) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl p-4 mb-3"
      style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
      <div className="flex items-center justify-between">
        <span className="font-bold" style={{ ...body, color: C.ink }}>{title}</span>
        <ChevronRight size={20} style={{ color: C.muted }} />
      </div>
      {hint && <p className="text-xs mt-1" style={{ ...body, color: C.muted }}>{hint}</p>}
      {chips && (
        <div className="flex flex-wrap gap-2 mt-3">
          {chips.length === 0 && <span className="rounded-lg px-3 py-1 text-xs font-semibold"
            style={{ background: C.chip, color: C.muted }}>None yet</span>}
          {chips.slice(0, 3).map((c) => (
            <span key={c} className="rounded-lg px-3 py-1 text-xs font-bold"
              style={{ background: C.lime, color: C.ink }}>{c}</span>
          ))}
          {chips.length > 3 && (
            <span className="rounded-lg px-3 py-1 text-xs font-bold" style={{ background: C.chip, color: C.muted }}>
              +{chips.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function Sheet({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(10,20,10,0.5)" }}
      onClick={onClose}>
      <div className="rounded-t-3xl flex flex-col" style={{ background: "#FAF8F2", maxHeight: "88%" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <div className="w-10" />
          <div className="h-1 w-10 rounded-full" style={{ background: C.line }} />
          <button onClick={onClose} className="w-10 flex justify-end"><X size={24} style={{ color: C.ink }} /></button>
        </div>
        {title && <h2 className="px-5 pb-3 text-2xl font-extrabold shrink-0" style={{ ...display, color: C.ink }}>{title}</h2>}
        <div className="px-5 pb-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 shrink-0" style={{ borderTop: `1px solid ${C.line}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function ThumbRow({ label, emoji, value, onSet }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-2xl w-8 text-center">{emoji}</span>
      <span className="flex-1 font-bold" style={{ ...body, color: C.ink }}>{label}</span>
      <button onClick={() => onSet(value === 1 ? 0 : 1)}
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: value === 1 ? C.greenMid : C.chip }}>
        <ThumbsUp size={19} style={{ color: value === 1 ? "#fff" : C.ink }} />
      </button>
      <button onClick={() => onSet(value === -1 ? 0 : -1)}
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: value === -1 ? C.red : C.chip }}>
        <ThumbsDown size={19} style={{ color: value === -1 ? "#fff" : C.ink }} />
      </button>
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 12 }) {
  return (
    <div className="flex items-stretch rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} className="px-4 py-2" style={{ background: "#FAF8F2" }}>
        <Minus size={16} />
      </button>
      <div className="px-5 py-2 font-bold flex items-center" style={{ background: "#fff", color: C.ink }}>{value}</div>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="px-4 py-2" style={{ background: C.chip }}>
        <Plus size={16} />
      </button>
    </div>
  );
}

function Slider({ value, min, max, step = 1, onChange, format }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-1" style={{ ...body, color: C.ink }}>
        <span>{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full" style={{ accentColor: C.greenMid }} />
    </div>
  );
}

function MatchRing({ score, size = 44 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="rgba(255,255,255,0.85)" stroke={C.line} strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.greenMid} strokeWidth="4"
        strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="54%" textAnchor="middle" fontSize={size * 0.3} fontWeight="800" fill={C.ink}
        style={display}>{score}</text>
    </svg>
  );
}

function Tile({ hue, emoji, h = 128 }) {
  return (
    <div className="w-full flex items-center justify-center" style={{
      height: h,
      background: `linear-gradient(135deg, hsl(${hue} 62% 84%), hsl(${(hue + 28) % 360} 55% 68%))`,
    }}>
      <span style={{ fontSize: h * 0.42 }}>{emoji}</span>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, full = true }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${full ? "w-full" : ""} rounded-2xl py-4 font-extrabold text-base disabled:opacity-40`}
      style={{ ...display, background: C.green, color: "#fff" }}>{children}</button>
  );
}

/* ============================================================
   6. AUTH + ONBOARDING
   ============================================================ */

function AuthScreen({ existing, onSignIn, onCreate, onForget }) {
  const [mode, setMode] = useState(existing ? "in" : "up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (!existing) { setMode("up"); setError(""); } }, [existing]);

  const submit = () => {
    setError("");
    if (mode === "up" || !existing) {
      if (!name.trim()) return setError("Add a name so the app knows what to call you.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setError("That email address is missing something.");
      onCreate({ name: name.trim(), email: email.trim().toLowerCase(), createdAt: Date.now() });
    } else {
      if (email.trim().toLowerCase() !== existing?.email) return setError("No account on this device with that email.");
      onSignIn();
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: C.green }}>
      <div className="flex-1 flex flex-col justify-center px-7">
        <div className="text-6xl mb-4">🍳</div>
        <h1 className="text-5xl font-extrabold text-white mb-3" style={display}>Mise</h1>
        <p className="text-lg mb-8" style={{ ...body, color: C.limeSoft }}>
          Tell it what's in your fridge. Get dinner that fits your taste, your week and your budget.
        </p>
      </div>
      <div className="rounded-t-3xl p-6 pb-8" style={{ background: "#FAF8F2" }}>
        <h2 className="text-2xl font-extrabold mb-1" style={{ ...display, color: C.ink }}>
          {mode === "up" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm mb-5" style={{ ...body, color: C.muted }}>
          {mode === "up"
            ? "Your account and everything you save live on this device."
            : `Signed up as ${existing?.email}`}
        </p>

        {mode === "up" && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name"
            className="w-full rounded-2xl px-4 py-4 mb-3 text-base outline-none"
            style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" inputMode="email"
          className="w-full rounded-2xl px-4 py-4 mb-3 text-base outline-none"
          style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />

        {error && <p className="text-sm mb-3 font-semibold" style={{ ...body, color: C.red }}>{error}</p>}

        <PrimaryButton onClick={submit}>{mode === "up" ? "Create account" : "Sign in"}</PrimaryButton>

        <div className="flex justify-center gap-4 mt-4 text-sm font-bold" style={body}>
          {existing && mode === "up" && (
            <button style={{ color: C.greenMid }} onClick={() => { setMode("in"); setError(""); }}>
              Sign in instead
            </button>
          )}
          {existing && mode === "in" && (
            <button style={{ color: C.muted }} onClick={onForget}>Start a new account</button>
          )}
          {!existing && <span style={{ color: C.muted }}>No password needed — nothing leaves this device.</span>}
        </div>
      </div>
    </div>
  );
}

function Onboarding({ profile, setProfile, onDone, name }) {
  const [step, setStep] = useState(0);
  const toggleMap = (key, item, val) =>
    setProfile({ ...profile, [key]: { ...profile[key], [item]: profile[key][item] === val ? 0 : val } });
  const toggleList = (key, item) =>
    setProfile({
      ...profile,
      [key]: profile[key].includes(item) ? profile[key].filter((x) => x !== item) : [...profile[key], item],
    });

  const steps = [
    {
      title: `How do you eat, ${name}?`, sub: "Pick the closest fit. You can change it any time.",
      content: (
        <div className="space-y-2">
          {DIETS.map((d) => (
            <button key={d.id} onClick={() => setProfile({ ...profile, diet: d.id })}
              className="w-full text-left rounded-2xl p-4"
              style={{ background: profile.diet === d.id ? C.lime : "#fff", border: `1px solid ${C.line}` }}>
              <div className="font-extrabold" style={{ ...body, color: C.ink }}>{d.label}</div>
              <div className="text-xs mt-1" style={{ ...body, color: profile.diet === d.id ? "#3D4A2E" : C.muted }}>{d.note}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Anything to leave out?", sub: "Allergies, dislikes, things you just never buy.",
      content: (
        <div className="flex flex-wrap gap-2">
          {EXCLUSIONS.map(([id, label, e]) => (
            <Chip key={id} active={profile.exclude.includes(id)} onClick={() => toggleList("exclude", id)}>
              {e} {label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      title: "Which cuisines pull you in?", sub: "Tap the ones you'd happily eat every week.",
      content: (
        <div className="flex flex-wrap gap-2">
          {CUISINES.map(([label, e]) => (
            <Chip key={label} active={profile.cuisines[label] === 1} onClick={() => toggleMap("cuisines", label, 1)}>
              {e} {label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      title: "What do you actually cook?", sub: "Dish shapes, not ingredients.",
      content: (
        <div className="flex flex-wrap gap-2">
          {DISHES.map(([label, e]) => (
            <Chip key={label} active={profile.dishes[label] === 1} onClick={() => toggleMap("dishes", label, 1)}>
              {e} {label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      title: "How much time do you have?", sub: "On a normal weeknight.",
      content: (
        <div className="space-y-6">
          <div>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Weeknight limit</p>
            <Slider value={profile.weekdayTime} min={15} max={90} step={5}
              onChange={(v) => setProfile({ ...profile, weekdayTime: v })} format={(v) => `${v} minutes`} />
          </div>
          <div>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Spice tolerance</p>
            <Slider value={profile.heat} min={0} max={5} onChange={(v) => setProfile({ ...profile, heat: v })}
              format={(v) => HEAT_WORDS[v]} />
          </div>
          <div>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Budget per serving</p>
            <Slider value={profile.budget} min={2} max={14} onChange={(v) => setProfile({ ...profile, budget: v })}
              format={(v) => `€${v}.00`} />
          </div>
          <div>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Cooking every day for</p>
            <div className="flex items-center justify-between mb-2">
              <span style={{ ...body, color: C.ink }}>Adults</span>
              <Stepper value={profile.adults} min={1} onChange={(v) => setProfile({ ...profile, adults: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ ...body, color: C.ink }}>Kids under 12</span>
              <Stepper value={profile.kids} onChange={(v) => setProfile({ ...profile, kids: v })} />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const s = steps[step];
  return (
    <div className="h-full flex flex-col" style={{ background: C.cream }}>
      <div className="px-5 pt-5 pb-3" style={{ background: C.green }}>
        <div className="flex items-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full"
              style={{ background: i <= step ? C.lime : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <h1 className="text-3xl font-extrabold text-white" style={display}>{s.title}</h1>
        <p className="text-sm mt-1" style={{ ...body, color: C.limeSoft }}>{s.sub}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5">{s.content}</div>
      <div className="p-5 flex gap-3" style={{ background: C.cream, borderTop: `1px solid ${C.line}` }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="rounded-2xl px-5 font-bold"
            style={{ ...body, background: C.chip, color: C.ink }}>Back</button>
        )}
        <div className="flex-1">
          <PrimaryButton onClick={() => (step === steps.length - 1 ? onDone() : setStep(step + 1))}>
            {step === steps.length - 1 ? "Start cooking" : "Next"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   7. RECIPE DETAIL
   ============================================================ */

function RecipeDetail({ recipe, open, onClose, state, actions }) {
  const [servings, setServings] = useState(2);
  const [tab, setTab] = useState("ingredients");
  useEffect(() => { if (recipe) setServings(Math.max(1, (state.profile.adults || 1) + (state.profile.kids || 0))); },
    [recipe, state.profile.adults, state.profile.kids]);
  if (!recipe) return null;

  const saved = state.saved.includes(recipe.id);
  const fav = state.favourites.includes(recipe.id);
  const cooked = state.cooked.includes(recipe.id);
  const rating = state.ratings[recipe.id] || 0;
  const factor = servings / 2;
  const pm = pantryMatch(recipe, state.pantry);
  const { score } = scoreRecipe(recipe, state.profile);

  const fmt = (q) => {
    if (q == null) return "";
    const v = q * factor;
    return v % 1 === 0 ? String(v) : v.toFixed(1).replace(".0", "");
  };

  return (
    <Sheet open={open} onClose={onClose}
      footer={
        <div className="flex gap-3">
          <button onClick={() => actions.toggleFav(recipe.id)}
            className="w-14 rounded-2xl flex items-center justify-center"
            style={{ background: fav ? "#F6D9D2" : C.chip }}>
            <Heart size={22} fill={fav ? C.red : "none"} style={{ color: fav ? C.red : C.ink }} />
          </button>
          <button onClick={() => actions.toggleSave(recipe.id)}
            className="flex-1 rounded-2xl py-4 font-extrabold"
            style={{ ...display, background: saved ? C.chip : C.lime, color: C.ink }}>
            {saved ? "Saved" : "Save to cookbook"}
          </button>
          <button onClick={() => actions.addToGrocery(recipe, servings)}
            className="w-14 rounded-2xl flex items-center justify-center" style={{ background: C.green }}>
            <ShoppingBasket size={22} color="#fff" />
          </button>
        </div>
      }>
      <div className="-mx-5 -mt-2 mb-4 overflow-hidden">
        <Tile hue={recipe.hue} emoji={recipe.emoji} h={150} />
      </div>

      <div className="flex items-start gap-3 mb-2">
        <h2 className="text-3xl font-extrabold flex-1" style={{ ...display, color: C.ink }}>{recipe.title}</h2>
        <MatchRing score={score} size={52} />
      </div>
      <p className="text-sm mb-4" style={{ ...body, color: C.muted }}>{recipe.blurb}</p>

      <div className="flex flex-wrap gap-2 mb-4 text-xs font-bold" style={body}>
        {[[Clock, `${recipe.time} min`], [Flame, `${recipe.kcal} kcal`], [ChefHat, recipe.diff],
        [Wallet, `€${recipe.cost.toFixed(2)}/serving`], [Utensils, `${recipe.protein}g protein`]].map(([Icon, t], i) => (
          <span key={i} className="rounded-full px-3 py-2 flex items-center gap-1"
            style={{ background: C.chip, color: C.ink }}>
            <Icon size={13} /> {t}
          </span>
        ))}
      </div>

      {state.pantry.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: C.limeSoft }}>
          <p className="font-extrabold text-sm" style={{ ...body, color: C.ink }}>
            You already have {pm.have} of {pm.total} ingredients
          </p>
          {pm.missing.length > 0 && (
            <p className="text-xs mt-1" style={{ ...body, color: "#4A5637" }}>
              Still need: {pm.missing.join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {["ingredients", "method"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 rounded-xl py-2 font-bold capitalize"
            style={{ ...body, background: tab === t ? C.green : C.chip, color: tab === t ? "#fff" : C.ink }}>{t}</button>
        ))}
      </div>

      {tab === "ingredients" ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold" style={{ ...body, color: C.ink }}>Servings</span>
            <Stepper value={servings} min={1} max={10} onChange={setServings} />
          </div>
          {recipe.ingredients.map((i) => {
            const has = state.pantry.some((p) =>
              i.name.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(i.name.toLowerCase()));
            return (
              <div key={i.name} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${C.line}` }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: has ? C.greenMid : C.chip }}>
                  {has && <Check size={13} color="#fff" />}
                </div>
                <span className="flex-1" style={{ ...body, color: C.ink }}>{i.name}</span>
                <span className="text-sm font-bold" style={{ ...body, color: C.muted }}>
                  {fmt(i.qty)} {i.unit}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <ol className="space-y-4">
          {recipe.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm font-extrabold"
                style={{ ...display, background: C.lime, color: C.ink }}>{i + 1}</span>
              <p className="flex-1 leading-relaxed" style={{ ...body, color: C.ink }}>{s}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6 rounded-2xl p-4" style={{ background: "#FFF", border: `1px solid ${C.line}` }}>
        <p className="font-extrabold mb-3" style={{ ...body, color: C.ink }}>
          {cooked ? "You've cooked this" : "Cooked it?"}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.toggleCooked(recipe.id)}
            className="rounded-xl px-4 py-3 font-bold flex items-center gap-2"
            style={{ ...body, background: cooked ? C.greenMid : C.chip, color: cooked ? "#fff" : C.ink }}>
            <CookingPot size={17} /> {cooked ? "Cooked" : "Mark cooked"}
          </button>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => actions.rate(recipe.id, n)}>
                <Star size={24} fill={n <= rating ? "#F0B429" : "none"}
                  style={{ color: n <= rating ? "#F0B429" : C.line }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function RecipeCard({ recipe, score, onOpen, wide, badge }) {
  return (
    <button onClick={onOpen} className={`text-left rounded-3xl overflow-hidden shrink-0 ${wide ? "w-full" : ""}`}
      style={{ background: C.card, width: wide ? undefined : 176 }}>
      <div className="relative">
        <Tile hue={recipe.hue} emoji={recipe.emoji} h={wide ? 120 : 116} />
        {score != null && <div className="absolute top-2 right-2"><MatchRing score={score} size={40} /></div>}
        {badge && (
          <div className="absolute bottom-2 left-2 rounded-full px-2 py-1 text-xs font-extrabold"
            style={{ ...body, background: C.lime, color: C.ink }}>{badge}</div>
        )}
      </div>
      <div className="p-3">
        <p className="font-extrabold leading-tight text-sm mb-1" style={{ ...display, color: C.ink }}>{recipe.title}</p>
        <p className="text-xs" style={{ ...body, color: C.muted }}>
          {recipe.time} min · {recipe.kcal} kcal · {recipe.cuisine}
        </p>
      </div>
    </button>
  );
}

/* ============================================================
   8. DISCOVER
   ============================================================ */

function Discover({ state, onOpen }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const scored = useMemo(() => {
    return RECIPES.map((r) => ({ r, ...scoreRecipe(r, state.profile), pm: pantryMatch(r, state.pantry) }))
      .filter((x) => !x.blocked);
  }, [state.profile, state.pantry]);

  const filters = [
    ["all", "Everything"], ["quick", "Under 25 min"], ["pantry", "From my pantry"],
    ["cheap", "Under €4"], ["protein", "High protein"], ["veg", "Meat-free"],
  ];

  const list = useMemo(() => {
    let l = [...scored];
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((x) =>
        x.r.title.toLowerCase().includes(s) || x.r.cuisine.toLowerCase().includes(s) ||
        x.r.dish.toLowerCase().includes(s) ||
        x.r.ingredients.some((i) => i.name.toLowerCase().includes(s)));
    }
    if (filter === "quick") l = l.filter((x) => x.r.time <= 25);
    if (filter === "cheap") l = l.filter((x) => x.r.cost < 4);
    if (filter === "protein") l = l.filter((x) => x.r.nutri.includes("High in protein"));
    if (filter === "veg") l = l.filter((x) => x.r.diets.includes("vegetarian") || x.r.diets.includes("vegan"));
    if (filter === "pantry") l = l.filter((x) => x.pm.have >= 3).sort((a, b) => b.pm.have - a.pm.have);
    return l.sort((a, b) => (filter === "pantry" ? 0 : b.score - a.score));
  }, [scored, q, filter]);

  const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 8);
  const quick = scored.filter((x) => x.r.time <= 25).slice(0, 8);
  const fromPantry = [...scored].filter((x) => x.pm.have >= 2).sort((a, b) => b.pm.have - a.pm.have).slice(0, 8);

  return (
    <div className="pb-6">
      <div className="px-5 pt-5">
        <h1 className="text-3xl font-extrabold mb-1" style={{ ...display, color: C.ink }}>
          Looking for inspiration, {state.account.name}?
        </h1>
        <p className="text-sm mb-4" style={{ ...body, color: C.muted }}>
          Sorted by how well each recipe fits your food profile.
        </p>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-3"
          style={{ background: "#fff", border: `1px solid ${C.line}` }}>
          <Search size={18} style={{ color: C.muted }} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search recipes and ingredients" className="flex-1 outline-none text-sm"
            style={{ ...body, background: "transparent", color: C.ink }} />
          {q && <button onClick={() => setQ("")}><X size={16} style={{ color: C.muted }} /></button>}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-4">
        {filters.map(([id, label]) => (
          <div key={id} className="shrink-0">
            <Chip active={filter === id} onClick={() => setFilter(id)}>{label}</Chip>
          </div>
        ))}
      </div>

      {q || filter !== "all" ? (
        <div className="px-5">
          <p className="text-sm font-bold mb-3" style={{ ...body, color: C.muted }}>
            {list.length} {list.length === 1 ? "recipe" : "recipes"}
          </p>
          {list.length === 0 && (
            <Card className="p-6 text-center">
              <p className="font-extrabold mb-1" style={{ ...display, color: C.ink }}>Nothing matches yet</p>
              <p className="text-sm" style={{ ...body, color: C.muted }}>
                Try a different filter, or loosen an exclusion in your food profile.
              </p>
            </Card>
          )}
          <div className="grid grid-cols-2 gap-3">
            {list.map((x) => (
              <RecipeCard key={x.r.id} recipe={x.r} score={x.score} onOpen={() => onOpen(x.r)} wide
                badge={filter === "pantry" ? `${x.pm.have}/${x.pm.total} in stock` : null} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <Row title="Matched to your taste" items={top} onOpen={onOpen} />
          {fromPantry.length > 0 && (
            <Row title="Using what you have" items={fromPantry} onOpen={onOpen} pantryBadge />
          )}
          <Row title="On the table in 25" items={quick} onOpen={onOpen} />
          <div className="px-5 mt-2">
            <h2 className="text-xl font-extrabold mb-3" style={{ ...display, color: C.ink }}>The whole menu</h2>
            <div className="grid grid-cols-2 gap-3">
              {scored.map((x) => (
                <RecipeCard key={x.r.id} recipe={x.r} score={x.score} onOpen={() => onOpen(x.r)} wide />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ title, items, onOpen, pantryBadge }) {
  if (!items.length) return null;
  return (
    <div className="mb-6">
      <h2 className="px-5 text-xl font-extrabold mb-3" style={{ ...display, color: C.ink }}>{title}</h2>
      <div className="flex gap-3 overflow-x-auto px-5 pb-1">
        {items.map((x) => (
          <RecipeCard key={x.r.id} recipe={x.r} score={x.score} onOpen={() => onOpen(x.r)}
            badge={pantryBadge ? `${x.pm.have}/${x.pm.total} in stock` : null} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   9. PANTRY CHEF (AI chat)
   ============================================================ */

function profileSummary(p) {
  const liked = (m) => Object.keys(m).filter((k) => m[k] === 1);
  const disliked = (m) => Object.keys(m).filter((k) => m[k] === -1);
  return [
    `Diet: ${DIETS.find((d) => d.id === p.diet)?.label}`,
    `Cooking for: ${p.adults} adults, ${p.kids} kids`,
    p.exclude.length ? `Never use: ${p.exclude.join(", ")}` : "No exclusions",
    `Spice tolerance: ${HEAT_WORDS[p.heat]}`,
    `Skill: ${p.skill}. Weeknight limit: ${p.weekdayTime} min. Budget: about €${p.budget} per serving.`,
    liked(p.cuisines).length ? `Loves cuisines: ${liked(p.cuisines).join(", ")}` : "",
    disliked(p.cuisines).length ? `Avoid cuisines: ${disliked(p.cuisines).join(", ")}` : "",
    liked(p.dishes).length ? `Loves dish types: ${liked(p.dishes).join(", ")}` : "",
    liked(p.flavours).length ? `Loves flavours: ${liked(p.flavours).join(", ")}` : "",
    disliked(p.flavours).length ? `Dislikes flavours: ${disliked(p.flavours).join(", ")}` : "",
    liked(p.proteins).length ? `Proteins they like: ${liked(p.proteins).join(", ")}` : "",
    disliked(p.proteins).length ? `Proteins to avoid: ${disliked(p.proteins).join(", ")}` : "",
    p.nutritionGoals.length ? `Nutrition goals: ${p.nutritionGoals.join(", ")}` : "",
    p.personalGoals.length ? `Personal goals: ${p.personalGoals.join(", ")}` : "",
    `Equipment available: ${p.equipment.join(", ")}`,
  ].filter(Boolean).join("\n");
}

const CHAT_RULES = `You are Pantry Chef inside a recipe app called Mise. You help one person decide what to cook tonight from what they already have.

How you behave:
- Ask ONE short question at a time. Never stack questions.
- Before suggesting anything, you need three things: what they have, roughly how long they've got, and what kind of thing they're in the mood for. If a detail is already in their profile or the conversation, do not ask again — use it.
- Keep replies to two sentences maximum. No preamble, no lists in the reply text.
- Once you know enough (or if they ask you to just decide), propose 1–2 recipes built mostly around their listed ingredients.
- Never propose anything containing an ingredient on their exclusion list, and respect their diet strictly.
- Assume basics exist: salt, pepper, oil, water. Everything else must come from their pantry or go in "needToBuy".

Reply with raw JSON only. No markdown fences, no text outside the JSON.
{
  "reply": "your short message",
  "chips": ["up to 4 short tappable answers to your question, [] when proposing recipes"],
  "recipes": [
    {
      "title": "...",
      "time": 25,
      "kcal": 550,
      "difficulty": "Easy",
      "cuisine": "...",
      "why": "one line on why it suits them",
      "usesFromPantry": ["..."],
      "needToBuy": ["..."],
      "ingredients": ["200g rice", "..."],
      "steps": ["...", "..."]
    }
  ]
}
Max 2 recipes, max 10 ingredients each, max 5 steps each, each step one sentence.`;

function localFallback(state, text) {
  const pantry = state.pantry;
  if (!pantry.length) {
    return {
      reply: "Add a few things from your fridge above and I'll work from those.",
      chips: ["Eggs", "Chicken", "Pasta", "Rice"], recipes: [],
    };
  }
  const ranked = RECIPES.map((r) => ({ r, ...scoreRecipe(r, state.profile), pm: pantryMatch(r, pantry) }))
    .filter((x) => !x.blocked).sort((a, b) => b.pm.have * 10 + b.score / 10 - (a.pm.have * 10 + a.score / 10))
    .slice(0, 2);
  return {
    reply: `I couldn't reach the model, so here's the closest fit from the Mise menu for ${pantry.slice(0, 3).join(", ")}.`,
    chips: [],
    recipes: ranked.map(({ r, pm }) => ({
      title: r.title, time: r.time, kcal: r.kcal, difficulty: r.diff, cuisine: r.cuisine,
      why: r.blurb, usesFromPantry: r.ingredients.filter((i) => !pm.missing.includes(i.name)).map((i) => i.name),
      needToBuy: pm.missing, ingredients: r.ingredients.map((i) => `${i.qty || ""}${i.unit} ${i.name}`.trim()),
      steps: r.steps, id: r.id,
    })),
  };
}

function PantryChef({ state, setState, messages, setMessages, onOpenGenerated }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const addPantry = (item) => {
    const v = item.trim();
    if (!v) return;
    if (state.pantry.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    setState({ ...state, pantry: [...state.pantry, v] });
  };
  const removePantry = (item) => setState({ ...state, pantry: state.pantry.filter((x) => x !== item) });

  const send = useCallback(async (text) => {
    const clean = text.trim();
    if (!clean || busy) return;
    const next = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);

    const transcript = next.slice(-10)
      .map((m) => `${m.role === "user" ? "Them" : "You"}: ${m.text}`).join("\n");

    const prompt = `${CHAT_RULES}

THEIR FOOD PROFILE
${profileSummary(state.profile)}

WHAT THEY SAY THEY HAVE RIGHT NOW
${state.pantry.length ? state.pantry.join(", ") : "(nothing listed yet)"}

CONVERSATION SO FAR
${transcript}

Respond to their last message as raw JSON.`;

    const ai = getAI();
    if (!ai.apiKey) {
      setMessages([...next, {
        role: "chef",
        text: "I need a Gemini API key before I can think. Add one in Profile → AI chef — it's free and takes a minute.",
        chips: [], recipes: [],
      }]);
      setBusy(false);
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${ai.model || DEFAULT_MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": ai.apiKey },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: 1400,
              temperature: 0.8,
            },
          }),
        }
      );

      if (res.status === 429) throw new Error("rate");
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "api");

      const raw = (data.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || "").join("").trim();

      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {
        parsed = { reply: raw.slice(0, 400) || "Say that again?", chips: [], recipes: [] };
      }
      setMessages([...next, {
        role: "chef", text: parsed.reply || "", chips: parsed.chips || [], recipes: parsed.recipes || [],
      }]);
    } catch (err) {
      const rate = String(err && err.message) === "rate";
      const fb = localFallback(state, clean);
      setMessages([...next, {
        role: "chef",
        text: rate
          ? "You've hit the free tier limit for now. Here's the closest fit from the menu instead."
          : fb.reply,
        chips: [], recipes: fb.recipes,
      }]);
    } finally {
      setBusy(false);
    }
  }, [messages, busy, state, setMessages]);

  const starters = [
    "Here's what's in my fridge",
    "I've got 20 minutes",
    "Something warm and cheap",
    "Surprise me",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* pantry rail */}
      <div className="px-5 pt-4 pb-3 shrink-0" style={{ background: C.cream, borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Refrigerator size={17} style={{ color: C.greenMid }} />
            <span className="font-extrabold text-sm" style={{ ...body, color: C.ink }}>
              In your kitchen ({state.pantry.length})
            </span>
          </div>
          <button onClick={() => setAddOpen(true)} className="text-sm font-bold flex items-center gap-1"
            style={{ ...body, color: C.greenMid }}>
            <Plus size={15} /> Add
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {state.pantry.length === 0 && (
            <span className="text-xs" style={{ ...body, color: C.muted }}>
              Nothing listed yet — add a few things and the chef works from those.
            </span>
          )}
          {state.pantry.map((p) => (
            <button key={p} onClick={() => removePantry(p)}
              className="shrink-0 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1"
              style={{ ...body, background: C.lime, color: C.ink }}>
              {p} <X size={12} />
            </button>
          ))}
        </div>
      </div>

      {/* thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="mt-6">
            <div className="text-5xl mb-3">👨‍🍳</div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ ...display, color: C.ink }}>
              Tell me what you've got
            </h2>
            <p className="text-sm mb-5" style={{ ...body, color: C.muted }}>
              I'll ask a couple of quick questions — time, mood, effort — then give you something to cook tonight.
              I already know your diet, your exclusions and how hot you like things.
            </p>
            <div className="flex flex-wrap gap-2">
              {starters.map((s) => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}
            </div>
            {!getAI().apiKey && (
              <div className="rounded-2xl p-4 mt-5" style={{ background: "#FBEEE6", border: `1px solid ${C.line}` }}>
                <p className="font-extrabold text-sm mb-1" style={{ ...body, color: C.ink }}>
                  The chef isn't connected yet
                </p>
                <p className="text-xs" style={{ ...body, color: C.muted }}>
                  Add a free Gemini API key in Profile → AI chef. Until then I'll match your pantry against
                  the 26 recipes already in the app.
                </p>
              </div>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="mb-4">
            {m.role === "user" ? (
              <div className="flex justify-end">
                <div className="rounded-3xl rounded-br-lg px-4 py-3 max-w-xs"
                  style={{ ...body, background: C.green, color: "#fff" }}>{m.text}</div>
              </div>
            ) : (
              <div>
                {m.text && (
                  <div className="rounded-3xl rounded-bl-lg px-4 py-3 max-w-xs mb-2"
                    style={{ ...body, background: "#fff", color: C.ink, border: `1px solid ${C.line}` }}>{m.text}</div>
                )}
                {m.chips?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {m.chips.map((c) => <Chip key={c} small onClick={() => send(c)}>{c}</Chip>)}
                  </div>
                )}
                {m.recipes?.map((r, k) => (
                  <button key={k} onClick={() => onOpenGenerated(r)}
                    className="w-full text-left rounded-3xl overflow-hidden mb-2"
                    style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} style={{ color: C.greenMid }} />
                        <span className="text-xs font-bold" style={{ ...body, color: C.greenMid }}>
                          Built for your pantry
                        </span>
                      </div>
                      <p className="font-extrabold text-lg leading-tight mb-1" style={{ ...display, color: C.ink }}>
                        {r.title}
                      </p>
                      <p className="text-xs mb-2" style={{ ...body, color: C.muted }}>
                        {r.time} min · {r.kcal} kcal · {r.difficulty} · {r.cuisine}
                      </p>
                      {r.why && <p className="text-sm mb-2" style={{ ...body, color: C.ink }}>{r.why}</p>}
                      {r.needToBuy?.length > 0 && (
                        <p className="text-xs" style={{ ...body, color: C.red }}>
                          Need to buy: {r.needToBuy.join(", ")}
                        </p>
                      )}
                      <p className="text-xs font-bold mt-2" style={{ ...body, color: C.greenMid }}>
                        Open recipe →
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-2 text-sm" style={{ ...body, color: C.muted }}>
            <Loader2 size={15} className="animate-spin" /> Thinking about your fridge…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* composer */}
      <div className="px-4 py-3 shrink-0 flex items-end gap-2"
        style={{ background: C.cream, borderTop: `1px solid ${C.line}` }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
          placeholder="I have chicken, rice and half a lemon…"
          className="flex-1 rounded-2xl px-4 py-3 outline-none text-sm"
          style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />
        <button onClick={() => send(input)} disabled={busy || !input.trim()}
          className="w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-40"
          style={{ background: C.green }}>
          <Send size={19} color="#fff" />
        </button>
      </div>

      <Sheet open={addOpen} title="What's in your kitchen?" onClose={() => setAddOpen(false)}
        footer={<PrimaryButton onClick={() => setAddOpen(false)}>Done</PrimaryButton>}>
        <div className="flex gap-2 mb-4">
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { addPantry(newItem); setNewItem(""); } }}
            placeholder="Type an ingredient" className="flex-1 rounded-2xl px-4 py-3 outline-none"
            style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />
          <button onClick={() => { addPantry(newItem); setNewItem(""); }}
            className="rounded-2xl px-4 font-bold" style={{ ...body, background: C.lime, color: C.ink }}>Add</button>
        </div>
        <p className="text-sm font-bold mb-2" style={{ ...body, color: C.muted }}>Common things</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {PANTRY_SUGGESTIONS.map((s) => (
            <Chip key={s} small active={state.pantry.includes(s)}
              onClick={() => (state.pantry.includes(s) ? removePantry(s) : addPantry(s))}>{s}</Chip>
          ))}
        </div>
        {state.pantry.length > 0 && (
          <>
            <p className="text-sm font-bold mb-2" style={{ ...body, color: C.muted }}>Your list</p>
            <div className="flex flex-wrap gap-2">
              {state.pantry.map((p) => (
                <Chip key={p} small active onClick={() => removePantry(p)}>{p} ✕</Chip>
              ))}
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}

function GeneratedRecipeSheet({ recipe, open, onClose, onSave, onShop, saved }) {
  if (!recipe) return null;
  return (
    <Sheet open={open} onClose={onClose} title={recipe.title}
      footer={
        <div className="flex gap-3">
          <button onClick={() => onSave(recipe)} className="flex-1 rounded-2xl py-4 font-extrabold"
            style={{ ...display, background: saved ? C.chip : C.lime, color: C.ink }}>
            {saved ? "Saved to cookbook" : "Save to cookbook"}
          </button>
          <button onClick={() => onShop(recipe)} className="w-14 rounded-2xl flex items-center justify-center"
            style={{ background: C.green }}>
            <ShoppingBasket size={22} color="#fff" />
          </button>
        </div>
      }>
      <p className="text-sm mb-4" style={{ ...body, color: C.muted }}>
        {recipe.time} min · {recipe.kcal} kcal · {recipe.difficulty} · {recipe.cuisine}
      </p>
      {recipe.why && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: C.limeSoft }}>
          <p className="text-sm font-semibold" style={{ ...body, color: C.ink }}>{recipe.why}</p>
        </div>
      )}
      <h3 className="font-extrabold mb-2" style={{ ...display, color: C.ink }}>Ingredients</h3>
      {(recipe.ingredients || []).map((i, k) => (
        <div key={k} className="py-2 text-sm" style={{ ...body, color: C.ink, borderBottom: `1px solid ${C.line}` }}>
          {i}
        </div>
      ))}
      {recipe.needToBuy?.length > 0 && (
        <p className="text-xs mt-3" style={{ ...body, color: C.red }}>
          Not in your kitchen: {recipe.needToBuy.join(", ")}
        </p>
      )}
      <h3 className="font-extrabold mt-6 mb-3" style={{ ...display, color: C.ink }}>Method</h3>
      <ol className="space-y-3">
        {(recipe.steps || []).map((s, k) => (
          <li key={k} className="flex gap-3">
            <span className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm font-extrabold"
              style={{ ...display, background: C.lime, color: C.ink }}>{k + 1}</span>
            <p className="flex-1 leading-relaxed text-sm" style={{ ...body, color: C.ink }}>{s}</p>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

/* ============================================================
   10. COOKBOOK
   ============================================================ */

function Cookbook({ state, onOpen, onOpenCustom }) {
  const [view, setView] = useState("all");
  const byId = (id) => RECIPES.find((r) => r.id === id);
  const fiveStar = Object.keys(state.ratings).filter((k) => state.ratings[k] === 5);

  const lists = {
    all: state.saved, fav: state.favourites, five: fiveStar, cooked: state.cooked,
  };
  const tiles = [
    ["fav", "Favourites", "❤️", state.favourites.length],
    ["five", "5-star rated", "⭐", fiveStar.length],
    ["cooked", "Cooked", "🍲", state.cooked.length],
    ["all", "All saved", "🔖", state.saved.length],
  ];
  const current = (lists[view] || []).map(byId).filter(Boolean);

  return (
    <div className="px-5 pt-5 pb-6">
      <h1 className="text-3xl font-extrabold mb-1" style={{ ...display, color: C.ink }}>
        Everything you cook, in one place
      </h1>
      <p className="text-sm mb-5" style={{ ...body, color: C.muted }}>
        Saved recipes, what you've already made, and the ones the chef built for you.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {tiles.map(([id, label, emoji, n]) => (
          <button key={id} onClick={() => setView(id)} className="rounded-3xl p-4 text-left"
            style={{ background: view === id ? C.lime : C.card }}>
            <div className="text-2xl mb-2">{emoji}</div>
            <p className="font-extrabold" style={{ ...display, color: C.ink }}>{label}</p>
            <p className="text-xs" style={{ ...body, color: view === id ? "#4A5637" : C.muted }}>
              {n} {n === 1 ? "recipe" : "recipes"}
            </p>
          </button>
        ))}
      </div>

      {state.custom.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-extrabold mb-3" style={{ ...display, color: C.ink }}>From Pantry Chef</h2>
          <div className="space-y-3">
            {state.custom.map((r, i) => (
              <button key={i} onClick={() => onOpenCustom(r)}
                className="w-full text-left rounded-3xl p-4" style={{ background: C.card }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={13} style={{ color: C.greenMid }} />
                  <span className="text-xs font-bold" style={{ ...body, color: C.greenMid }}>Made for you</span>
                </div>
                <p className="font-extrabold" style={{ ...display, color: C.ink }}>{r.title}</p>
                <p className="text-xs" style={{ ...body, color: C.muted }}>
                  {r.time} min · {r.kcal} kcal · {r.cuisine}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-extrabold mb-3" style={{ ...display, color: C.ink }}>
        {tiles.find((t) => t[0] === view)[1]}
      </h2>
      {current.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="font-extrabold mb-1" style={{ ...display, color: C.ink }}>Nothing here yet</p>
          <p className="text-sm" style={{ ...body, color: C.muted }}>
            Save a recipe from Discover and it lands here, with your rating and cooking history.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {current.map((r) => (
            <RecipeCard key={r.id} recipe={r} score={scoreRecipe(r, state.profile).score} onOpen={() => onOpen(r)} wide />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   11. GROCERY LIST
   ============================================================ */

function Grocery({ state, setState }) {
  const [text, setText] = useState("");
  const add = () => {
    if (!text.trim()) return;
    setState({
      ...state,
      grocery: [...state.grocery, { id: Date.now() + Math.random(), name: text.trim(), qty: "", aisle: "Other", done: false }],
    });
    setText("");
  };
  const toggle = (id) =>
    setState({ ...state, grocery: state.grocery.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) });
  const remove = (id) => setState({ ...state, grocery: state.grocery.filter((g) => g.id !== id) });
  const clearDone = () => setState({ ...state, grocery: state.grocery.filter((g) => !g.done) });

  const grouped = AISLES.map((a) => [a, state.grocery.filter((g) => g.aisle === a)]).filter(([, l]) => l.length);
  const done = state.grocery.filter((g) => g.done).length;

  return (
    <div className="px-5 pt-5 pb-6">
      <h1 className="text-3xl font-extrabold mb-1" style={{ ...display, color: C.ink }}>Grocery list</h1>
      <p className="text-sm mb-4" style={{ ...body, color: C.muted }}>
        {state.grocery.length === 0
          ? "Add a recipe's ingredients from any recipe page and they arrive here, sorted by aisle."
          : `${done} of ${state.grocery.length} in the basket`}
      </p>

      <div className="flex gap-2 mb-5">
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder="Add an item" className="flex-1 rounded-2xl px-4 py-3 outline-none"
          style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />
        <button onClick={add} className="rounded-2xl px-5 font-bold" style={{ ...body, background: C.lime, color: C.ink }}>
          Add
        </button>
      </div>

      {grouped.length === 0 ? (
        <Card className="p-6 text-center">
          <ShoppingBasket size={28} style={{ color: C.muted }} className="mx-auto mb-2" />
          <p className="font-extrabold mb-1" style={{ ...display, color: C.ink }}>The list is empty</p>
          <p className="text-sm" style={{ ...body, color: C.muted }}>
            Open a recipe and tap the basket to send its ingredients here.
          </p>
        </Card>
      ) : (
        <>
          {grouped.map(([aisle, items]) => (
            <div key={aisle} className="mb-5">
              <p className="text-xs font-extrabold uppercase mb-2" style={{ ...body, color: C.muted, letterSpacing: "0.08em" }}>
                {aisle}
              </p>
              <Card className="overflow-hidden">
                {items.map((g, i) => (
                  <div key={g.id} className="flex items-center gap-3 px-4 py-3"
                    style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
                    <button onClick={() => toggle(g.id)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: g.done ? C.greenMid : C.chip }}>
                      {g.done && <Check size={14} color="#fff" />}
                    </button>
                    <span className="flex-1 text-sm"
                      style={{ ...body, color: g.done ? C.muted : C.ink, textDecoration: g.done ? "line-through" : "none" }}>
                      {g.name}
                    </span>
                    {g.qty && <span className="text-xs font-bold" style={{ ...body, color: C.muted }}>{g.qty}</span>}
                    <button onClick={() => remove(g.id)}><X size={16} style={{ color: C.muted }} /></button>
                  </div>
                ))}
              </Card>
            </div>
          ))}
          {done > 0 && (
            <button onClick={clearDone} className="w-full rounded-2xl py-3 font-bold"
              style={{ ...body, background: C.chip, color: C.ink }}>
              Clear {done} ticked {done === 1 ? "item" : "items"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
   11b. AI SETTINGS
   ============================================================ */

function AISettings() {
  const [ai, setAi] = useState(getAI());
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const commit = (next) => { setAi(next); saveAI(next); setSaved(true); setTimeout(() => setSaved(false), 1500); };

  return (
    <SectionCard icon={<Sparkles size={22} />} title="AI chef">
      <p className="text-sm mb-4" style={{ ...body, color: C.muted }}>
        Pantry Chef runs on Google's Gemini. Paste a key from aistudio.google.com — the free tier is enough
        for a few dinners a day. The key is stored on this phone and goes nowhere else.
      </p>

      <label className="text-xs font-extrabold uppercase" style={{ ...body, color: C.muted, letterSpacing: "0.08em" }}>
        API key
      </label>
      <div className="flex gap-2 mt-2 mb-4">
        <input value={ai.apiKey} type={show ? "text" : "password"}
          onChange={(e) => commit({ ...ai, apiKey: e.target.value.trim() })}
          placeholder="AIza…" autoComplete="off" spellCheck={false}
          className="flex-1 rounded-2xl px-4 py-3 outline-none text-sm"
          style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />
        <button onClick={() => setShow(!show)} className="rounded-2xl px-4 text-sm font-bold"
          style={{ ...body, background: C.chip, color: C.ink }}>{show ? "Hide" : "Show"}</button>
      </div>

      <label className="text-xs font-extrabold uppercase" style={{ ...body, color: C.muted, letterSpacing: "0.08em" }}>
        Model
      </label>
      <input value={ai.model} onChange={(e) => commit({ ...ai, model: e.target.value.trim() })}
        placeholder={DEFAULT_MODEL} spellCheck={false}
        className="w-full rounded-2xl px-4 py-3 mt-2 outline-none text-sm"
        style={{ ...body, background: "#fff", border: `1px solid ${C.line}`, color: C.ink }} />
      <p className="text-xs mt-2" style={{ ...body, color: C.muted }}>
        Change this if Google retires the model. Flash-Lite variants have the highest free limits.
      </p>

      <div className="flex items-center gap-2 mt-4">
        <div className="w-2 h-2 rounded-full" style={{ background: ai.apiKey ? C.greenMid : C.line }} />
        <span className="text-sm font-bold" style={{ ...body, color: ai.apiKey ? C.greenMid : C.muted }}>
          {saved ? "Saved" : ai.apiKey ? "Chef is connected" : "Not connected"}
        </span>
      </div>
    </SectionCard>
  );
}

/* ============================================================
   12. FOOD PROFILE
   ============================================================ */

function Profile({ state, setState, onSignOut, onReset }) {
  const p = state.profile;
  const [sheet, setSheet] = useState(null);
  const set = (patch) => setState({ ...state, profile: { ...p, ...patch } });
  const toggleMap = (key, item, val) =>
    set({ [key]: { ...p[key], [item]: p[key][item] === val ? 0 : val } });
  const toggleList = (key, item) =>
    set({ [key]: p[key].includes(item) ? p[key].filter((x) => x !== item) : [...p[key], item] });

  const likedKeys = (m) => Object.keys(m).filter((k) => m[k] === 1);
  const diet = DIETS.find((d) => d.id === p.diet);

  return (
    <div className="pb-6">
      <div className="px-5 pt-5 pb-6" style={{ background: C.green }}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-extrabold"
            style={{ ...display, background: C.lime, color: C.ink }}>
            {state.account.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-xl font-extrabold text-white" style={display}>{state.account.name}</p>
            <p className="text-sm" style={{ ...body, color: C.limeSoft }}>{state.account.email}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {[["Saved", state.saved.length], ["Cooked", state.cooked.length], ["In kitchen", state.pantry.length]]
            .map(([l, n]) => (
              <div key={l} className="flex-1 rounded-2xl py-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <p className="text-xl font-extrabold text-white" style={display}>{n}</p>
                <p className="text-xs" style={{ ...body, color: C.limeSoft }}>{l}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="px-5 -mt-3">
        <SectionCard icon={<Salad size={22} />} title="Your diet">
          <RowLink title={diet?.label} hint={diet?.note} onClick={() => setSheet("diet")} />
        </SectionCard>

        <SectionCard icon={<Users size={22} />} title="Household">
          {[["Adults", "adults", 1], ["Teens (12–17)", "teens", 0], ["Kids (under 12)", "kids", 0]].map(([label, key, min]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="font-bold" style={{ ...body, color: C.ink }}>{label}</span>
              <Stepper value={p[key]} min={min} onChange={(v) => set({ [key]: v })} />
            </div>
          ))}
        </SectionCard>

        <SectionCard icon={<Utensils size={22} />} title="Dietary habits">
          <RowLink title="Exclude" chips={p.exclude.map((id) => EXCLUSIONS.find((e) => e[0] === id)?.[1])}
            onClick={() => setSheet("exclude")} />
          <RowLink title="Flavours" chips={likedKeys(p.flavours)} onClick={() => setSheet("flavours")} />
          <RowLink title="Proteins" chips={likedKeys(p.proteins)} onClick={() => setSheet("proteins")} />
          <div className="rounded-2xl p-4" style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Spice tolerance</p>
            <Slider value={p.heat} min={0} max={5} onChange={(v) => set({ heat: v })} format={(v) => HEAT_WORDS[v]} />
          </div>
        </SectionCard>

        <SectionCard icon={<Timer size={22} />} title="Goals">
          <RowLink title="Personal" chips={p.personalGoals} onClick={() => setSheet("personal")} />
          <RowLink title="Nutrition" chips={p.nutritionGoals} onClick={() => setSheet("nutrition")} />
        </SectionCard>

        <SectionCard icon={<ChefHat size={22} />} title="Cooking preferences">
          <RowLink title="Cuisines" chips={likedKeys(p.cuisines)} onClick={() => setSheet("cuisines")} />
          <RowLink title="Dish types" chips={likedKeys(p.dishes)} onClick={() => setSheet("dishes")} />
          <RowLink title="Cooking style" chips={p.styles} onClick={() => setSheet("styles")} />
          <RowLink title="Kitchen equipment" chips={p.equipment} onClick={() => setSheet("equipment")} />
          <div className="rounded-2xl p-4 mb-3" style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Weeknight time limit</p>
            <Slider value={p.weekdayTime} min={15} max={90} step={5}
              onChange={(v) => set({ weekdayTime: v })} format={(v) => `${v} minutes`} />
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Budget per serving</p>
            <Slider value={p.budget} min={2} max={14} onChange={(v) => set({ budget: v })}
              format={(v) => `€${v}.00`} />
          </div>
          <div className="rounded-2xl p-4" style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
            <p className="font-bold mb-2" style={{ ...body, color: C.ink }}>Skill level</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map((s) => (
                <Chip key={s} small active={p.skill === s} onClick={() => set({ skill: s })}>{s}</Chip>
              ))}
            </div>
          </div>
        </SectionCard>

        <AISettings />

        <SectionCard icon={<Settings2 size={22} />} title="Account">
          <button onClick={onSignOut} className="w-full flex items-center gap-3 rounded-2xl p-4 mb-3"
            style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
            <LogOut size={18} style={{ color: C.ink }} />
            <span className="font-bold" style={{ ...body, color: C.ink }}>Sign out</span>
          </button>
          <button onClick={onReset} className="w-full flex items-center gap-3 rounded-2xl p-4"
            style={{ background: "#FAF8F2", border: `1px solid ${C.line}` }}>
            <Trash2 size={18} style={{ color: C.red }} />
            <span className="font-bold" style={{ ...body, color: C.red }}>Delete account and everything saved</span>
          </button>
          <p className="text-xs mt-3" style={{ ...body, color: C.muted }}>
            Your account, profile and saved recipes are stored on this device only.
          </p>
        </SectionCard>
      </div>

      {/* SHEETS */}
      <Sheet open={sheet === "diet"} title="How do you eat?" onClose={() => setSheet(null)}>
        <div className="space-y-2">
          {DIETS.map((d) => (
            <button key={d.id} onClick={() => { set({ diet: d.id }); setSheet(null); }}
              className="w-full text-left rounded-2xl p-4"
              style={{ background: p.diet === d.id ? C.lime : "#fff", border: `1px solid ${C.line}` }}>
              <div className="font-extrabold" style={{ ...body, color: C.ink }}>{d.label}</div>
              <div className="text-xs mt-1" style={{ ...body, color: p.diet === d.id ? "#3D4A2E" : C.muted }}>{d.note}</div>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === "exclude"} title="Any ingredients to avoid?" onClose={() => setSheet(null)}>
        <div className="rounded-2xl p-4 mb-4" style={{ background: "#DDF3E9" }}>
          <p className="font-extrabold text-sm mb-1" style={{ ...body, color: C.ink }}>How this works</p>
          <p className="text-xs" style={{ ...body, color: "#2E4C3D" }}>
            Anything ticked here is removed from your menu entirely, not just ranked lower.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXCLUSIONS.map(([id, label, e]) => (
            <Chip key={id} tone="red" active={p.exclude.includes(id)} onClick={() => toggleList("exclude", id)}>
              {e} {label}
            </Chip>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === "flavours"} title="Any favourite flavours?" onClose={() => setSheet(null)}>
        {FLAVOURS.map(([label, e]) => (
          <ThumbRow key={label} label={label} emoji={e} value={p.flavours[label] || 0}
            onSet={(v) => toggleMap("flavours", label, v)} />
        ))}
      </Sheet>

      <Sheet open={sheet === "proteins"} title="Which proteins do you enjoy?" onClose={() => setSheet(null)}>
        {PROTEINS.map(([label, e]) => (
          <ThumbRow key={label} label={label} emoji={e} value={p.proteins[label] || 0}
            onSet={(v) => toggleMap("proteins", label, v)} />
        ))}
      </Sheet>

      <Sheet open={sheet === "cuisines"} title="Any favourite cuisines?" onClose={() => setSheet(null)}>
        {CUISINES.map(([label, e]) => (
          <ThumbRow key={label} label={label} emoji={e} value={p.cuisines[label] || 0}
            onSet={(v) => toggleMap("cuisines", label, v)} />
        ))}
      </Sheet>

      <Sheet open={sheet === "dishes"} title="What kind of dinners do you love?" onClose={() => setSheet(null)}>
        {DISHES.map(([label, e]) => (
          <ThumbRow key={label} label={label} emoji={e} value={p.dishes[label] || 0}
            onSet={(v) => toggleMap("dishes", label, v)} />
        ))}
      </Sheet>

      <Sheet open={sheet === "personal"} title="What are your personal goals?" onClose={() => setSheet(null)}>
        <div className="space-y-2">
          {PERSONAL_GOALS.map((g) => (
            <button key={g} onClick={() => toggleList("personalGoals", g)}
              className="w-full text-left rounded-2xl p-4 font-bold flex items-center justify-between"
              style={{ ...body, background: p.personalGoals.includes(g) ? C.lime : "#fff", border: `1px solid ${C.line}`, color: C.ink }}>
              {g}
              {p.personalGoals.includes(g) && <Check size={18} />}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === "nutrition"} title="What are your nutrition goals?" onClose={() => setSheet(null)}>
        <div className="space-y-2">
          {NUTRITION_GOALS.map((g) => (
            <button key={g} onClick={() => toggleList("nutritionGoals", g)}
              className="w-full text-left rounded-2xl p-4 font-bold flex items-center justify-between"
              style={{ ...body, background: p.nutritionGoals.includes(g) ? C.lime : "#fff", border: `1px solid ${C.line}`, color: C.ink }}>
              {g}
              {p.nutritionGoals.includes(g) && <Check size={18} />}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === "styles"} title="How do you like to cook?" onClose={() => setSheet(null)}>
        <div className="space-y-2">
          {COOK_STYLES.map(([label, note]) => (
            <button key={label} onClick={() => toggleList("styles", label)}
              className="w-full text-left rounded-2xl p-4"
              style={{ background: p.styles.includes(label) ? C.lime : "#fff", border: `1px solid ${C.line}` }}>
              <div className="font-extrabold" style={{ ...body, color: C.ink }}>{label}</div>
              <div className="text-xs mt-1" style={{ ...body, color: p.styles.includes(label) ? "#3D4A2E" : C.muted }}>{note}</div>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === "equipment"} title="What's in your kitchen?" onClose={() => setSheet(null)}>
        <p className="text-sm mb-4" style={{ ...body, color: C.muted }}>
          Recipes that need something you don't have get pushed down the menu.
        </p>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((e) => (
            <Chip key={e} active={p.equipment.includes(e)} onClick={() => toggleList("equipment", e)}>{e}</Chip>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

/* ============================================================
   13. APP SHELL
   ============================================================ */

export default function MiseApp() {
  const [loading, setLoading] = useState(true);
  const [state, setStateRaw] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState("discover");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [openCustom, setOpenCustom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState("");
  const saveTimer = useRef(null);

  /* load */
  useEffect(() => {
    (async () => {
      const s = await readKey(STATE_KEY);
      const c = await readKey(CHAT_KEY);
      if (s) { setStateRaw(s); setSignedIn(false); }
      if (c) setMessages(c);
      setLoading(false);
    })();
  }, []);

  /* debounced persist */
  const setState = useCallback((next) => {
    setStateRaw(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeKey(STATE_KEY, next), 500);
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    const t = setTimeout(() => writeKey(CHAT_KEY, messages.slice(-30)), 600);
    return () => clearTimeout(t);
  }, [messages]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2000); };

  /* actions */
  const actions = useMemo(() => ({
    toggleSave: (id) => {
      const on = state.saved.includes(id);
      setState({ ...state, saved: on ? state.saved.filter((x) => x !== id) : [...state.saved, id] });
      flash(on ? "Removed from cookbook" : "Saved to cookbook");
    },
    toggleFav: (id) => {
      const on = state.favourites.includes(id);
      setState({
        ...state,
        favourites: on ? state.favourites.filter((x) => x !== id) : [...state.favourites, id],
        saved: on || state.saved.includes(id) ? state.saved : [...state.saved, id],
      });
    },
    toggleCooked: (id) => {
      const on = state.cooked.includes(id);
      setState({ ...state, cooked: on ? state.cooked.filter((x) => x !== id) : [...state.cooked, id] });
      if (!on) flash("Added to your cooking history");
    },
    rate: (id, n) => setState({ ...state, ratings: { ...state.ratings, [id]: n } }),
    addToGrocery: (recipe, servings) => {
      const f = servings / 2;
      const items = recipe.ingredients
        .filter((i) => !state.pantry.some((p) =>
          i.name.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(i.name.toLowerCase())))
        .map((i) => ({
          id: Date.now() + Math.random(), name: i.name,
          qty: i.qty ? `${+(i.qty * f).toFixed(1)}${i.unit}` : "", aisle: i.aisle, done: false,
        }));
      setState({ ...state, grocery: [...state.grocery, ...items] });
      flash(`${items.length} items added to your list`);
    },
  }), [state, setState]);

  const saveCustom = (r) => {
    if (state.custom.some((c) => c.title === r.title)) return;
    setState({ ...state, custom: [{ ...r, savedAt: Date.now() }, ...state.custom] });
    flash("Saved to cookbook");
  };
  const shopCustom = (r) => {
    const list = (r.needToBuy?.length ? r.needToBuy : r.ingredients || []).map((n) => ({
      id: Date.now() + Math.random(), name: n, qty: "", aisle: "Other", done: false,
    }));
    setState({ ...state, grocery: [...state.grocery, ...list] });
    flash(`${list.length} items added to your list`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: "100dvh", background: C.green }}>
        <Loader2 size={28} color="#fff" className="animate-spin" />
      </div>
    );
  }

  if (!state || !signedIn) {
    return (
      <div style={{ height: "100dvh", ...body }}>
        <AuthScreen
          existing={state?.account}
          onSignIn={() => setSignedIn(true)}
          onCreate={(acc) => { const s = blankState(acc); setState(s); setSignedIn(true); }}
          onForget={() => { setStateRaw(null); setMessages([]); writeKey(STATE_KEY, null); }}
        />
      </div>
    );
  }

  if (!state.onboarded) {
    return (
      <div style={{ height: "100dvh", ...body }}>
        <Onboarding name={state.account.name} profile={state.profile}
          setProfile={(p) => setState({ ...state, profile: p })}
          onDone={() => setState({ ...state, onboarded: true })} />
      </div>
    );
  }

  const tabs = [
    ["discover", "Discover", Search],
    ["chef", "Chef", Sparkles],
    ["cookbook", "Cookbook", Bookmark],
    ["list", "List", ShoppingBasket],
    ["profile", "Profile", User],
  ];

  return (
    <div className="flex flex-col relative" style={{ height: "100dvh", ...body, background: C.cream }}>
      <div className="shrink-0 px-5 py-3 flex items-center justify-center" style={{ background: C.green }}>
        <span className="text-lg font-extrabold text-white" style={display}>
          {tab === "chef" ? "Pantry Chef" : tab === "discover" ? "Mise" :
            tab === "cookbook" ? "Cookbook" : tab === "list" ? "Grocery list" : "Food profile"}
        </span>
      </div>

      <div className={`flex-1 min-h-0 ${tab === "chef" ? "overflow-hidden" : "overflow-y-auto"}`}
        style={{ background: C.cream }}>
        {tab === "discover" && <Discover state={state} onOpen={setOpenRecipe} />}
        {tab === "chef" && (
          <PantryChef state={state} setState={setState} messages={messages} setMessages={setMessages}
            onOpenGenerated={setOpenCustom} />
        )}
        {tab === "cookbook" && <Cookbook state={state} onOpen={setOpenRecipe} onOpenCustom={setOpenCustom} />}
        {tab === "list" && <Grocery state={state} setState={setState} />}
        {tab === "profile" && (
          <Profile state={state} setState={setState}
            onSignOut={() => setSignedIn(false)}
            onReset={() => {
              setStateRaw(null); setMessages([]); setSignedIn(false);
              writeKey(STATE_KEY, null); writeKey(CHAT_KEY, null);
            }} />
        )}
      </div>

      {toast && (
        <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 84 }}>
          <div className="rounded-full px-4 py-2 text-sm font-bold"
            style={{ background: C.ink, color: "#fff" }}>{toast}</div>
        </div>
      )}

      <div className="shrink-0 flex" style={{ background: "#EFEADC", borderTop: `1px solid ${C.line}`, paddingBottom: "env(safe-area-inset-bottom)" }}>
        {tabs.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 py-2 flex flex-col items-center gap-1">
            <div className="rounded-full px-4 py-1" style={{ background: tab === id ? C.lime : "transparent" }}>
              <Icon size={19} style={{ color: C.ink }} />
            </div>
            <span className="text-xs font-bold" style={{ color: tab === id ? C.ink : C.muted }}>{label}</span>
          </button>
        ))}
      </div>

      <RecipeDetail recipe={openRecipe} open={!!openRecipe} onClose={() => setOpenRecipe(null)}
        state={state} actions={actions} />
      <GeneratedRecipeSheet recipe={openCustom} open={!!openCustom} onClose={() => setOpenCustom(null)}
        onSave={saveCustom} onShop={shopCustom}
        saved={!!openCustom && state.custom.some((c) => c.title === openCustom.title)} />
    </div>
  );
}
