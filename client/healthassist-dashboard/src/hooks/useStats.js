import { useState, useEffect } from "react";
import axios from "axios";

/**
 * ✅ Custom React hook to fetch HealthAssist dashboard statistics
 * Handles loading state, API call, and stores the response
 */
export default function useStats() {
  // State to hold fetched statistics
  const [stats, setStats] = useState(null);

  // State to indicate loading status
  const [loading, setLoading] = useState(true);

  /**
   * 🔹 Fetch stats from backend
   * Uses Axios to call /stats/advanced
   * Reads backend URL from root .env (via Vite's import.meta.env)
   */
  const fetchStats = async () => {
    try {
      setLoading(true);

      // Use VITE_BACKEND_URL from .env, fall back to same origin in production
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

      // Axios GET request to backend stats endpoint
      const res = await axios.get(`${BACKEND_URL}/stats/advanced`);

      // Store response data in state
      setStats(res.data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when the hook mounts
  useEffect(() => {
    fetchStats();
  }, []);

  // Return stats data, loading state, and refresh function
  return {
    stats,
    loading,
    fetchStats,
  };
}
