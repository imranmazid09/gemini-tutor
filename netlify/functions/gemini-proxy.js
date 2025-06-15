// This is the code for our secure proxy function.
// File Location: netlify/functions/gemini-proxy.js

exports.handler = async function(event) {
    // We will only allow the 'POST' method for this function
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Get the prompt data that the website sends to this function
        const { prompt } = JSON.parse(event.body);

        // Access the secret API key stored securely in Netlify's system
        const API_KEY = process.env.GEMINI_API_KEY;

        // This is the official URL for the Gemini API
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        // This is the data structure the Gemini API expects
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            // This is a crucial instruction: we're telling the AI to respond in a structured JSON format
            generationConfig: {
                responseMimeType: "application/json",
            }
        };

        // Call the actual Gemini API from the secure server environment
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // If the API gives an error, we'll log it and report it
            console.error(`Gemini API Error: ${response.statusText}`);
            return { statusCode: response.status, body: `Error: ${response.statusText}` };
        }

        const data = await response.json();

        // Send the successful response from the AI back to the website
        return {
            statusCode: 200,
            body: JSON.stringify(data) // The body must be a string, so we stringify the JSON object
        };

    } catch (error) {
        // Catch any other errors
        console.error("Error in proxy function:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
