// test-milestones-api.js
// A simple script to test the milestones API endpoint

const fetch = require('node-fetch');

async function testMilestonesApi() {
  try {
    console.log('Testing /api/test-milestones endpoint...');
    
    const response = await fetch('http://localhost:3000/api/test-milestones');
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries([...response.headers.entries()]));
    
    // If the response is JSON, parse and display it
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log('Response Data:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response Text:', text);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testMilestonesApi();
