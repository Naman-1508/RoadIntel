import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();


const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let cachedTweets = [];
let lastFetchTime = 0; // timestamp
const FETCH_INTERVAL = 15 * 60 * 1000; // 5 minutes

let isFetching = false;

export async function fetchTweets() {
  const now = Date.now();

  // Return cached if still valid
  if (cachedTweets.length && now - lastFetchTime < FETCH_INTERVAL) {
    return cachedTweets;
  }
  if(isFetching){
    return cachedTweets.length? cachedTweets : [];
  }
  isFetching = true;

  try {
    const url = "https://api.twitter.com/2/tweets/search/recent";
    const params = {
      query: "accident OR crash OR traffic -is:retweet lang:en",
      max_results: 10,
      "tweet.fields": "created_at,author_id",
    };

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
      params,
    });

    const tweets = res.data.data || [];

    cachedTweets = tweets.map((t) => ({
      id: t.id,
      text: t.text,
      platform: "X",
      timestamp: t.created_at || new Date().toISOString(),
    }));

    lastFetchTime = now;
    return cachedTweets;

  } catch(err) {
    console.error("Twitter/X fetch failed:", err.response?.data || err.message);

    // fallback mock data
    return [
      {
        id: "1",
        text: "Massive accident on I-95, multiple lanes blocked!",
        platform: "X",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Traffic jam due to vehicle fire near Brooklyn Bridge.",
        platform: "X",
        timestamp: new Date().toISOString(),
      },
    ];
  } finally{
    isFetching = false;
  }
}


const severityCache = {};
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export async function analyzeSeverity(text) {
  if (severityCache[text]) {
    return severityCache[text];
  }

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Analyze the following social media post and classify the traffic severity as one of:
        low, moderate, high, or critical.
        Post: "${text}"
        Return only one word (no explanation).
      `;

      const result = await model.generateContent(prompt);
      const severity = result.response.text().trim().toLowerCase();

      severityCache[text] = severity; // cache it
      return severity;

    } catch (err) {
      console.error("❌ Gemini API error:", err.message);
      attempt++;
      if (attempt < MAX_RETRIES) {
        await new Promise(res => setTimeout(res, RETRY_DELAY * attempt));
      } else {
        severityCache[text] = "unknown";
        return "unknown";
      }
    }
  }
}

