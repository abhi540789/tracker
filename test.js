// test.js
import fetch from 'node-fetch'; // if using ES modules (package.json has "type": "module")

const url = 'https://tracker-dun-chi.vercel.app/api/hello';

const hitApi = async () => {
  for (let i = 1; i <= 50; i++) {
    try {
      const response = await fetch(url);
      const data = await response.text(); // or .json() if JSON
      console.log(`[${i}] ✅ Response:`, data);
    } catch (err) {
      console.error(`[${i}] ❌ Error:`, err.message);
    }
  }
};

hitApi();
