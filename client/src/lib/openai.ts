import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Check for the API key in the environment variables with fallback
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";

// Initialize the OpenAI client
const openai = new OpenAI({ 
  apiKey,
  dangerouslyAllowBrowser: true // Allow usage in browser environment 
});

/**
 * Analyzes revenue anomalies
 */
export async function analyzeRevenueAnomalies(revenueData: any[]): Promise<{
  anomalies: Array<{
    date: string;
    amount: number;
    percentageChange: number;
    reason: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  summary: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are a financial analyst AI. Analyze the revenue data to detect anomalies and provide insights. " +
            "Return your analysis as JSON with 'anomalies' array and 'summary' text. " +
            "For each anomaly, include date, amount, percentageChange, reason (your analysis of why this happened), " +
            "and severity (high/medium/low)."
        },
        {
          role: "user",
          content: `Analyze this revenue data for anomalies: ${JSON.stringify(revenueData)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Failed to analyze revenue anomalies:", error);
    return {
      anomalies: [],
      summary: "Unable to analyze revenue data at this time."
    };
  }
}

/**
 * Generates ad copy suggestions based on existing ads performance
 */
export async function generateAdCopySuggestions(adData: any, productInfo: string): Promise<{
  suggestions: Array<{
    headline: string;
    description: string;
    callToAction: string;
    targetAudience: string;
    estimatedPerformance: string;
  }>;
  reasoning: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are an advertising specialist AI. Generate ad copy suggestions based on existing ad performance data and product information. " +
            "Return your suggestions as JSON with an array of ad suggestions and your reasoning."
        },
        {
          role: "user",
          content: `Generate ad copy suggestions based on this ad performance data: ${JSON.stringify(adData)}. Product information: ${productInfo}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Failed to generate ad copy suggestions:", error);
    return {
      suggestions: [],
      reasoning: "Unable to generate ad copy suggestions at this time."
    };
  }
}

/**
 * Analyzes customer feedback sentiment
 */
export async function analyzeSentiment(feedbackText: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  keyThemes: string[];
  actionableInsights: string[];
  summary: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are a customer feedback analysis AI. Analyze the sentiment of customer feedback. " +
            "Return your analysis as JSON with sentiment category, numeric score (0-1), key themes, actionable insights, and summary."
        },
        {
          role: "user",
          content: `Analyze the sentiment in this customer feedback: "${feedbackText}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Failed to analyze sentiment:", error);
    return {
      sentiment: 'neutral',
      score: 0.5,
      keyThemes: [],
      actionableInsights: [],
      summary: "Unable to analyze sentiment at this time."
    };
  }
}

/**
 * Generates a daily business briefing
 */
export async function generateDailyBriefing(businessData: any): Promise<{
  summary: string;
  keyMetrics: Record<string, string>;
  importantAlerts: string[];
  recommendedActions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are a business intelligence AI. Generate a concise daily briefing based on business data. " +
            "Return your briefing as JSON with a summary, key metrics, important alerts, and recommended actions."
        },
        {
          role: "user",
          content: `Generate a daily briefing based on this business data: ${JSON.stringify(businessData)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Failed to generate daily briefing:", error);
    return {
      summary: "Unable to generate daily briefing at this time.",
      keyMetrics: {},
      importantAlerts: [],
      recommendedActions: []
    };
  }
}

export default {
  analyzeRevenueAnomalies,
  generateAdCopySuggestions,
  analyzeSentiment,
  generateDailyBriefing
};
