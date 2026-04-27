import fetch from 'node-fetch';

// Test the site content endpoint
fetch('http://localhost:3000/api/site-content')
  .then(response => response.json())
  .then(data => {
    console.log('Site content endpoint works:', data.companyName);
  })
  .catch(error => {
    console.error('Site content endpoint failed:', error.message);
  });

// Test the submit-lead endpoint with valid data
fetch('http://localhost:3000/api/submit-lead', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    businessName: 'Doe Enterprises',
    email: 'john@example.com',
    phone: '1234567890',
    businessType: 'Retail',
    country: 'USA'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Submit lead endpoint works:', data);
  })
  .catch(error => {
    console.error('Submit lead endpoint failed:', error.message);
  });