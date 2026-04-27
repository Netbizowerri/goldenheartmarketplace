// Simple test to verify API endpoints are working
async function testEndpoints() {
  try {
    // Test site content endpoint
    const siteContentResponse = await fetch('http://localhost:3000/api/site-content');
    const siteContentData = await siteContentResponse.json();
    console.log('✅ Site content endpoint:', siteContentData.companyName);
    
    // Test submit lead endpoint
    const submitLeadResponse = await fetch('http://localhost:3000/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        businessName: 'Test Business',
        email: 'test@example.com',
        phone: '1234567890',
        businessType: 'Retail',
        country: 'Test Country'
      })
    });
    const submitLeadData = await submitLeadResponse.json();
    console.log('✅ Submit lead endpoint:', submitLeadData);
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

// Wait a bit for server to start, then test
setTimeout(testEndpoints, 5000);