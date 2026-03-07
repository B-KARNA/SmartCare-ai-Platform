// ============================================================
// CBT Counselor — AI Personal Counsellor Chat Flow
// ============================================================

/**
 * Empathetic, CBT-informed responses with a calm, supportive tone.
 * These simulate a professional counseling session flow.
 */

const CBT_RESPONSES = {
    // Opening / greeting
    greeting: [
        "Hello, I'm glad you reached out. 💙 I'm your MedVault wellness counselor. This is a safe, judgment-free space. How are you feeling right now?",
        "Welcome. I'm here to listen and support you. 💙 Whatever you're going through, you don't have to face it alone. Would you like to share what's on your mind?"
    ],

    // Stress / Anxiety
    anxiety: [
        "I hear you, and it's completely okay to feel anxious. 🌿 Let's try something together — can you take a slow, deep breath? In for 4 counts, hold for 4, out for 4. This is called box breathing, and it can help calm your nervous system.\n\n**Let's try a thought exercise:** What's one specific thought causing you the most worry right now?",
        "Anxiety can feel overwhelming, but remember — your thoughts are not facts. 💙 In CBT, we call this 'cognitive distortion.' Let me help you examine that thought.\n\n**Can you tell me:** What evidence do you have that supports this worry? And what evidence contradicts it?"
    ],

    // Sadness / Depression
    sadness: [
        "I'm sorry you're feeling this way. Your feelings are valid, and it takes real strength to acknowledge them. 💙\n\n**A gentle CBT exercise:** Think of one small thing you did today — even getting out of bed counts. That's an achievement. Sometimes, breaking our day into tiny wins can shift our perspective.\n\nWould you like to talk more about what's bringing you down?",
        "It's okay to not be okay. 🌿 Depression often tells us lies — that nothing will get better, that we're alone. But those are thoughts, not truths.\n\n**Let's try this:** Name three things you can see right now, two things you can touch, and one thing you can hear. This grounding exercise can help bring you back to the present moment."
    ],

    // Sleep issues
    sleep: [
        "Sleep difficulties are really tough to deal with. 🌙 Here are some evidence-based sleep hygiene tips:\n\n• Try to keep a consistent sleep schedule\n• Avoid screens 30 minutes before bed\n• Try progressive muscle relaxation — tense and release each muscle group\n\nWould you like me to guide you through a relaxation exercise?",
    ],

    // Anger / Frustration
    anger: [
        "It's completely natural to feel angry. Anger is a valid emotion that's trying to tell you something. 💙\n\n**A CBT technique for anger:** The STOP method:\n🛑 **S**top — Pause before reacting\n🤔 **T**hink — What triggered this feeling?\n👁️ **O**bserve — What bodily sensations do you notice?\n✨ **P**roceed — Choose your response mindfully\n\nWhat situation triggered your anger?",
    ],

    // General support
    general: [
        "Thank you for sharing that with me. 💙 It sounds like you're carrying a lot right now. Remember, seeking support is a sign of strength, not weakness.\n\nWould you like to:\n• Try a grounding exercise\n• Talk about what's bothering you\n• Learn a coping technique\n\nI'm here for whatever you need.",
        "I appreciate your openness. 🌿 Everyone's mental health journey is unique, and there's no 'right' way to feel.\n\n**A daily practice I recommend:** Try writing down 3 things you're grateful for each evening. Research shows this simple habit can significantly improve emotional well-being over time.\n\nWhat would feel most helpful to you right now?",
    ],

    // Positive / doing well
    positive: [
        "That's wonderful to hear! 😊 Celebrating the good moments is so important for mental health.\n\n**A positive psychology exercise:** Take a moment to really savor this feeling. What specifically is making you feel good? Noticing and appreciating positive emotions helps build resilience for tougher days.\n\nKeep up the great work on your wellness journey! 💚",
    ]
};

// Keywords for each emotional state
const EMOTION_KEYWORDS = {
    anxiety: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'panic', 'scared', 'fear', 'overthinking', 'restless', 'uneasy', 'tense', 'stress', 'stressed'],
    sadness: ['sad', 'depressed', 'depression', 'unhappy', 'lonely', 'empty', 'down', 'miserable', 'cry', 'crying', 'heartbroken', 'grief', 'loss', 'lost'],
    sleep: ['sleep', 'insomnia', 'can\'t sleep', 'nightmare', 'restless', 'tired', 'exhausted', 'fatigue'],
    anger: ['angry', 'anger', 'frustrated', 'furious', 'irritated', 'annoyed', 'rage', 'mad', 'hostile'],
    positive: ['happy', 'great', 'good', 'wonderful', 'amazing', 'better', 'grateful', 'thankful', 'excited', 'joy', 'cheerful']
};

/**
 * Detect the emotional tone and return an appropriate CBT counselor response.
 */
export function getCBTResponse(text) {
    const lower = text.toLowerCase();

    // Score each emotion
    const scores = {};
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
        scores[emotion] = keywords.filter(k => lower.includes(k)).length;
    }

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const emotion = best[1] > 0 ? best[0] : 'general';

    const responses = CBT_RESPONSES[emotion];
    return {
        response: responses[Math.floor(Math.random() * responses.length)],
        emotion,
        isCounseling: true
    };
}

export function getCBTGreeting() {
    return CBT_RESPONSES.greeting[Math.floor(Math.random() * CBT_RESPONSES.greeting.length)];
}
