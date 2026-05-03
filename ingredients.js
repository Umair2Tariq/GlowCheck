export const INGREDIENTS = [
  {
    name: "Niacinamide",
    aliases: ["Vitamin B3", "Nicotinamide"],
    safety: "safe",
    rating: 9,
    benefits: ["Brightening", "Pore minimizing", "Oil control", "Anti-inflammatory"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: ["Vitamin C"],
  },
  {
    name: "Hyaluronic Acid",
    aliases: ["HA", "Sodium Hyaluronate"],
    safety: "safe",
    rating: 10,
    benefits: ["Deep hydration", "Plumping", "Moisture retention"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Retinol",
    aliases: ["Vitamin A", "Retinoid", "Retin-A"],
    safety: "caution",
    rating: 8,
    benefits: ["Anti-aging", "Cell turnover", "Collagen boost", "Acne treatment"],
    concerns: ["Sun sensitivity", "Initial purging", "Dryness", "Not for pregnancy"],
    skin_types: ["normal", "combination", "oily"],
    avoid_with: ["AHA", "BHA", "Benzoyl Peroxide", "Vitamin C"],
  },
  {
    name: "Vitamin C",
    aliases: ["Ascorbic Acid", "L-Ascorbic Acid", "Ascorbyl Glucoside"],
    safety: "safe",
    rating: 9,
    benefits: ["Brightening", "Antioxidant", "Collagen synthesis", "Dark spot fading"],
    concerns: ["Can oxidize", "May sting sensitive skin"],
    skin_types: ["normal", "combination", "oily", "dry"],
    avoid_with: ["Niacinamide", "Retinol", "AHA", "BHA"],
  },
  {
    name: "Salicylic Acid",
    aliases: ["BHA", "Beta Hydroxy Acid"],
    safety: "caution",
    rating: 8,
    benefits: ["Acne fighting", "Pore clearing", "Exfoliating", "Oil control"],
    concerns: ["Drying", "Sun sensitivity", "Avoid in pregnancy"],
    skin_types: ["oily", "combination"],
    avoid_with: ["Retinol", "AHA", "Vitamin C"],
  },
  {
    name: "Glycolic Acid",
    aliases: ["AHA", "Alpha Hydroxy Acid"],
    safety: "caution",
    rating: 8,
    benefits: ["Exfoliating", "Texture improvement", "Brightening", "Anti-aging"],
    concerns: ["Sun sensitivity", "Irritation", "Not for sensitive skin"],
    skin_types: ["normal", "combination", "oily"],
    avoid_with: ["Retinol", "BHA", "Vitamin C"],
  },
  {
    name: "Ceramides",
    aliases: ["Ceramide NP", "Ceramide AP", "Ceramide EOP"],
    safety: "safe",
    rating: 10,
    benefits: ["Barrier repair", "Moisture lock", "Soothing"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Benzoyl Peroxide",
    aliases: ["BPO", "Benzoyl"],
    safety: "caution",
    rating: 7,
    benefits: ["Kills acne bacteria", "Reduces inflammation", "Clears breakouts"],
    concerns: ["Bleaches fabric", "Very drying", "Irritating"],
    skin_types: ["oily", "combination"],
    avoid_with: ["Retinol", "AHA", "BHA", "Vitamin C"],
  },
  {
    name: "Azelaic Acid",
    aliases: ["Azelaic"],
    safety: "safe",
    rating: 9,
    benefits: ["Brightening", "Anti-acne", "Rosacea relief", "Hyperpigmentation"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Peptides",
    aliases: ["Matrixyl", "Argireline", "Copper Peptides"],
    safety: "safe",
    rating: 9,
    benefits: ["Anti-aging", "Collagen stimulation", "Firming", "Repair"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: ["AHA", "BHA"],
  },
  {
    name: "Kojic Acid",
    aliases: ["Kojic"],
    safety: "caution",
    rating: 7,
    benefits: ["Brightening", "Dark spot fading", "Anti-fungal"],
    concerns: ["Can irritate", "Sensitivity"],
    skin_types: ["normal", "combination", "oily"],
    avoid_with: [],
  },
  {
    name: "Lactic Acid",
    aliases: ["AHA Lactic"],
    safety: "caution",
    rating: 8,
    benefits: ["Gentle exfoliation", "Hydrating", "Brightening", "Anti-aging"],
    concerns: ["Sun sensitivity", "Mild irritation"],
    skin_types: ["normal", "combination", "dry", "sensitive"],
    avoid_with: ["Retinol"],
  },
  {
    name: "Squalane",
    aliases: ["Squalene"],
    safety: "safe",
    rating: 10,
    benefits: ["Deep moisturizing", "Non-comedogenic", "Antioxidant", "Barrier support"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Zinc Oxide",
    aliases: ["Zinc", "ZnO"],
    safety: "safe",
    rating: 9,
    benefits: ["Sun protection", "Anti-inflammatory", "Acne control"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Allantoin",
    aliases: ["Allantoic Acid"],
    safety: "safe",
    rating: 9,
    benefits: ["Soothing", "Skin repair", "Anti-irritant", "Moisturizing"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Centella Asiatica",
    aliases: ["Cica", "Gotu Kola", "Centella"],
    safety: "safe",
    rating: 9,
    benefits: ["Healing", "Anti-inflammatory", "Soothing", "Barrier repair"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Tranexamic Acid",
    aliases: ["TXA", "Tranexamic"],
    safety: "safe",
    rating: 8,
    benefits: ["Brightening", "Hyperpigmentation", "Dark spot fading"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Bakuchiol",
    aliases: ["Bakuchi"],
    safety: "safe",
    rating: 8,
    benefits: ["Natural retinol alternative", "Anti-aging", "Firming", "Safe in pregnancy"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Sulfur",
    aliases: ["Sulphur"],
    safety: "caution",
    rating: 7,
    benefits: ["Acne treatment", "Anti-bacterial", "Oil control"],
    concerns: ["Strong odor", "Drying"],
    skin_types: ["oily", "combination"],
    avoid_with: [],
  },
  {
    name: "Mandelic Acid",
    aliases: ["Mandelic"],
    safety: "caution",
    rating: 7,
    benefits: ["Gentle exfoliation", "Brightening", "Acne treatment"],
    concerns: ["Sun sensitivity"],
    skin_types: ["normal", "combination", "oily", "sensitive"],
    avoid_with: ["Retinol"],
  },
  {
    name: "Alpha Arbutin",
    aliases: ["Arbutin"],
    safety: "safe",
    rating: 9,
    benefits: ["Brightening", "Hyperpigmentation", "Dark spot fading"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Resveratrol",
    aliases: [],
    safety: "safe",
    rating: 8,
    benefits: ["Antioxidant", "Anti-aging", "Anti-inflammatory"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Ferulic Acid",
    aliases: [],
    safety: "safe",
    rating: 9,
    benefits: ["Antioxidant", "Boosts Vitamin C", "Anti-aging", "UV protection"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Retinaldehyde",
    aliases: ["Retinal"],
    safety: "caution",
    rating: 8,
    benefits: ["Anti-aging", "Faster than retinol", "Cell turnover"],
    concerns: ["Irritation", "Sun sensitivity", "Not for pregnancy"],
    skin_types: ["normal", "combination", "oily"],
    avoid_with: ["AHA", "BHA", "Vitamin C"],
  },
  {
    name: "Polyglutamic Acid",
    aliases: ["PGA"],
    safety: "safe",
    rating: 9,
    benefits: ["Hydration", "Moisture retention", "Plumping"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Propolis",
    aliases: ["Bee Propolis"],
    safety: "safe",
    rating: 8,
    benefits: ["Healing", "Anti-bacterial", "Soothing", "Antioxidant"],
    concerns: ["Avoid if bee allergy"],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Snail Mucin",
    aliases: ["Snail Secretion Filtrate", "Snail Extract"],
    safety: "safe",
    rating: 9,
    benefits: ["Repair", "Hydration", "Anti-aging", "Soothing"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "EGF",
    aliases: ["Epidermal Growth Factor"],
    safety: "safe",
    rating: 8,
    benefits: ["Cellular repair", "Anti-aging", "Collagen boost"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Glycerin",
    aliases: ["Glycerol"],
    safety: "safe",
    rating: 10,
    benefits: ["Hydration", "Moisture binding", "Barrier support"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Panthenol",
    aliases: ["Provitamin B5", "Dexpanthenol"],
    safety: "safe",
    rating: 10,
    benefits: ["Hydration", "Soothing", "Healing", "Anti-inflammatory"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Adenosine",
    aliases: [],
    safety: "safe",
    rating: 8,
    benefits: ["Anti-aging", "Wrinkle reduction", "Soothing"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Madecassoside",
    aliases: ["Asiaticoside"],
    safety: "safe",
    rating: 9,
    benefits: ["Healing", "Anti-inflammatory", "Collagen synthesis"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Licorice Root Extract",
    aliases: ["Glabridin", "Liquorice"],
    safety: "safe",
    rating: 8,
    benefits: ["Brightening", "Anti-inflammatory", "Hyperpigmentation"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Neem Oil",
    aliases: ["Neem"],
    safety: "caution",
    rating: 6,
    benefits: ["Anti-bacterial", "Acne control", "Anti-fungal"],
    concerns: ["Strong odor", "May clog pores for some"],
    skin_types: ["oily", "combination"],
    avoid_with: [],
  },
  {
    name: "Rosehip Oil",
    aliases: ["Rosehip Seed Oil"],
    safety: "safe",
    rating: 8,
    benefits: ["Anti-aging", "Brightening", "Hydration", "Scar fading"],
    concerns: ["May break out some oily skin types"],
    skin_types: ["normal", "dry", "combination", "sensitive"],
    avoid_with: [],
  },
  {
    name: "Jojoba Oil",
    aliases: ["Jojoba"],
    safety: "safe",
    rating: 9,
    benefits: ["Balancing", "Non-comedogenic", "Moisturizing"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Tea Tree Oil",
    aliases: ["Melaleuca"],
    safety: "caution",
    rating: 7,
    benefits: ["Anti-bacterial", "Anti-acne", "Anti-fungal"],
    concerns: ["Must be diluted", "Can irritate"],
    skin_types: ["oily", "combination"],
    avoid_with: [],
  },
  {
    name: "Phytic Acid",
    aliases: [],
    safety: "caution",
    rating: 7,
    benefits: ["Gentle exfoliation", "Brightening", "Antioxidant"],
    concerns: ["Sun sensitivity"],
    skin_types: ["normal", "combination", "dry", "sensitive"],
    avoid_with: ["Retinol"],
  },
  {
    name: "Noni Extract",
    aliases: ["Morinda Citrifolia"],
    safety: "safe",
    rating: 7,
    benefits: ["Antioxidant", "Anti-aging", "Brightening"],
    concerns: [],
    skin_types: ["oily", "combination", "sensitive", "normal", "dry"],
    avoid_with: [],
  },
  {
    name: "Vitamin E",
    aliases: ["Tocopherol", "Vitamin E Acetate"],
    safety: "safe",
    rating: 8,
    benefits: ["Antioxidant", "Moisturizing", "Healing", "Boosts Vitamin C"],
    concerns: ["May clog pores in high concentrations"],
    skin_types: ["normal", "dry", "sensitive", "combination"],
    avoid_with: [],
  },
];

export const SAFETY_META = {
  safe: {
    label: "Safe",
    color: "#166534",
    background: "#d1fae5",
    border: "#86efac",
    badge: "Safety: 1/10 (Low)",
  },
  caution: {
    label: "Use with caution",
    color: "#b45309",
    background: "#fef3c7",
    border: "#fdba74",
    badge: "Safety: 4/10 (Moderate)",
  },
  avoid: {
    label: "Avoid",
    color: "#b91c1c",
    background: "#fee2e2",
    border: "#fca5a5",
    badge: "Avoid mixing",
  },
};

export const SKIN_LABELS = {
  oily: "Oily",
  combination: "Combination",
  normal: "Normal",
  dry: "Dry",
  sensitive: "Sensitive",
};

export function getIngredientByName(name) {
  if (!name) {
    return null;
  }

  const needle = name.toLowerCase().trim();

  return (
    INGREDIENTS.find(
      (ingredient) =>
        ingredient.name.toLowerCase() === needle ||
        ingredient.aliases.some((alias) => alias.toLowerCase() === needle)
    ) || null
  );
}

function levenshtein(a, b) {
  const grid = Array.from({ length: a.length + 1 }, (_, row) =>
    Array.from({ length: b.length + 1 }, (_, column) =>
      row === 0 ? column : column === 0 ? row : 0
    )
  );

  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      grid[row][column] =
        a[row - 1] === b[column - 1]
          ? grid[row - 1][column - 1]
          : 1 +
            Math.min(
              grid[row - 1][column],
              grid[row][column - 1],
              grid[row - 1][column - 1]
            );
    }
  }

  return grid[a.length][b.length];
}

function similarity(a, b) {
  const source = a.toLowerCase();
  const target = b.toLowerCase();

  if (target.includes(source) || source.includes(target)) {
    return 1;
  }

  const distance = levenshtein(source, target);
  return 1 - distance / Math.max(source.length, target.length);
}

export function fuzzySearch(query, limit = 6) {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  return INGREDIENTS.map((ingredient) => {
    const scores = [
      similarity(normalizedQuery, ingredient.name),
      ...ingredient.aliases.map((alias) => similarity(normalizedQuery, alias)),
    ];

    return { ingredient, score: Math.max(...scores) };
  })
    .filter((entry) => entry.score >= 0.45)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.ingredient);
}

function matchesAvoid(rule, ingredient) {
  const normalizedRule = rule.toLowerCase();

  return (
    ingredient.name.toLowerCase().includes(normalizedRule) ||
    ingredient.aliases.some((alias) => alias.toLowerCase().includes(normalizedRule))
  );
}

export function analyzeIngredients(ingredients) {
  const conflicts = [];

  for (let index = 0; index < ingredients.length; index += 1) {
    for (let compare = index + 1; compare < ingredients.length; compare += 1) {
      const left = ingredients[index];
      const right = ingredients[compare];

      const leftAvoids = left.avoid_with.some((rule) => matchesAvoid(rule, right));
      const rightAvoids = right.avoid_with.some((rule) => matchesAvoid(rule, left));

      if (leftAvoids || rightAvoids) {
        conflicts.push([left.name, right.name]);
      }
    }
  }

  const benefits = [...new Set(ingredients.flatMap((ingredient) => ingredient.benefits))];
  const concerns = [...new Set(ingredients.flatMap((ingredient) => ingredient.concerns))];
  const averageRating = ingredients.length
    ? Math.round(
        ingredients.reduce((total, ingredient) => total + ingredient.rating, 0) / ingredients.length
      )
    : 0;

  const compatibleSkinTypes = ["oily", "combination", "normal", "dry", "sensitive"].filter(
    (skinType) => ingredients.every((ingredient) => ingredient.skin_types.includes(skinType))
  );

  return {
    conflicts,
    benefits,
    concerns,
    averageRating,
    compatibleSkinTypes,
  };
}

export function getStackSafetyLevel(ingredients, analysis) {
  const cautionCount = ingredients.filter((ingredient) => ingredient.safety === "caution").length;

  if (analysis.conflicts.length > 0) {
    return "avoid";
  }

  if (cautionCount > 0) {
    return "caution";
  }

  return "safe";
}

export function getIngredientCategory(ingredient) {
  const categories = [
    "Anti-aging",
    "Hydration",
    "Barrier Repair",
    "Renewal",
    "Brightening",
    "Acne Care",
    "Soothing",
  ];

  const benefit = ingredient.benefits.find((entry) =>
    categories.some((category) => entry.toLowerCase().includes(category.toLowerCase()))
  );

  if (!benefit) {
    if (ingredient.name === "Ceramides") {
      return "Barrier Repair";
    }

    if (ingredient.name === "Retinol" || ingredient.name === "Retinaldehyde") {
      return "Renewal";
    }

    if (ingredient.name === "Hyaluronic Acid" || ingredient.name === "Polyglutamic Acid") {
      return "Hydration";
    }

    return ingredient.benefits[0] || "Skincare";
  }

  if (benefit === "Anti-inflammatory") {
    return "Soothing";
  }

  if (benefit === "Pore minimizing") {
    return "Brightening";
  }

  return benefit;
}
