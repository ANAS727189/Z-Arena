import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { JUDGE0_BASE_URL, judge0Headers } from '../config/judge0.config.js';
import dotenv from "dotenv";
dotenv.config();

const http = rateLimit(axios.create(), {
  maxRequests:  process.env.MAX_REQUESTS,
  perMilliseconds:  process.env.MAX_MILLISECONDS,
  maxRPS: process.env.MAX_RPS, 
});

export const compileWithJudge0 = async ({ language_id, source_code, stdin }) => {
  try {
     const response = await http.post(
    `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`,{
      language_id,
      source_code,
      stdin
    },
    { headers: judge0Headers }
  );

  return response.data;
  }catch(err) {
     console.error('Judge0 error:', err.response?.status, err.response?.data);
     throw new Error('Failed to compile with Judge0');
  }
};