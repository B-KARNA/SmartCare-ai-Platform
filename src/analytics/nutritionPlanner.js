// ============================================================
// AI Nutrition Planner
// ============================================================

/**
 * Generates dietary recommendations and weekly meal plans tailored 
 * to the user's specific health risks.
 */

const DIET_TYPES = {
    DASH: {
        id: 'dash',
        name: 'DASH Diet (Cardio Focus)',
        description: 'Dietary Approaches to Stop Hypertension. Rich in fruits, vegetables, whole grains, and low-fat dairy.',
        restrictions: ['Low Sodium', 'Low Saturated Fat']
    },
    LOW_GI: {
        id: 'low_gi',
        name: 'Low Glycemic Diet (Blood Sugar Focus)',
        description: 'Focuses on complex carbohydrates that have minimal impact on blood sugar levels.',
        restrictions: ['Low Sugar', 'Complex Carbs Only']
    },
    BALANCED: {
        id: 'balanced',
        name: 'Balanced Wellness Diet',
        description: 'A well-rounded, Mediterranean-style diet for optimal general health and immunity.',
        restrictions: ['Minimize Processed Foods']
    }
};

const MEAL_DATABASE = {
    dash: [
        { type: 'Breakfast', name: 'Oatmeal with Blueberries & Walnuts', calories: 320 },
        { type: 'Lunch', name: 'Grilled Chicken Salad with Vinaigrette', calories: 450 },
        { type: 'Dinner', name: 'Baked Salmon with Quinoa & Asparagus', calories: 520 },
        { type: 'Breakfast', name: 'Greek Yogurt with Banana Slices', calories: 280 },
        { type: 'Lunch', name: 'Turkey Wrap with Spinach & Hummus', calories: 410 },
        { type: 'Dinner', name: 'Lentil Soup with Whole Grain Roll', calories: 380 }
    ],
    low_gi: [
        { type: 'Breakfast', name: 'Scrambled Eggs with Spinach', calories: 310 },
        { type: 'Lunch', name: 'Quinoa Bowl with Black Beans & Avocado', calories: 480 },
        { type: 'Dinner', name: 'Grilled Tofu with Broccoli & Brown Rice', calories: 450 },
        { type: 'Breakfast', name: 'Avocado Toast on Rye Bread', calories: 340 },
        { type: 'Lunch', name: 'Tuna Salad on Lettuce Wraps', calories: 360 },
        { type: 'Dinner', name: 'Chicken Stir-fry with Zucchini Noodles', calories: 420 }
    ],
    balanced: [
        { type: 'Breakfast', name: 'Smoothie Bowl (Spinach, Mango, Chia)', calories: 350 },
        { type: 'Lunch', name: 'Mediterranean Chickpea Salad', calories: 420 },
        { type: 'Dinner', name: 'Herb-Roasted Chicken with Sweet Potato', calories: 550 },
        { type: 'Breakfast', name: 'Whole Wheat Pancakes with Berries', calories: 400 },
        { type: 'Lunch', name: 'Tomato Basil Soup with Grilled Cheese', calories: 460 },
        { type: 'Dinner', name: 'Shrimp Pasta in Garlic Olive Oil', calories: 510 }
    ]
};

export function getRecommendedDiet(riskProfile) {
    let highestRisk = null;

    // Find the highest severity risk
    riskProfile.forEach(risk => {
        if (!highestRisk || risk.score > highestRisk.score) {
            highestRisk = risk;
        }
    });

    if (highestRisk && highestRisk.severity !== 'low') {
        if (highestRisk.name.includes('Cardio')) return DIET_TYPES.DASH;
        if (highestRisk.name.includes('Diabetes')) return DIET_TYPES.LOW_GI;
    }

    // Default
    return DIET_TYPES.BALANCED;
}

export function generateDailyMealPlan(dietType) {
    const options = MEAL_DATABASE[dietType.id];

    // Randomly select 1 Breakfast, 1 Lunch, 1 Dinner
    const breakfasts = options.filter(m => m.type === 'Breakfast');
    const lunches = options.filter(m => m.type === 'Lunch');
    const dinners = options.filter(m => m.type === 'Dinner');

    const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return [
        getRand(breakfasts),
        getRand(lunches),
        getRand(dinners)
    ];
}
