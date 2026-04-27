<?php
/**
 * cPanel API Proxy for Privyr Webhook
 * 
 * Upload this file to public_html/api/submit-lead.php
 * 
 * Set your webhook URL below or use a .env-style config file.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight CORS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// === CONFIGURATION ===
// Replace with your real Privyr webhook URL
$WEBHOOK_URL = 'https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/JSh0Qptn';

// Read JSON body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request body.']);
    exit;
}

$fullName     = trim($input['fullName'] ?? '');
$businessName = trim($input['businessName'] ?? '');
$email        = trim($input['email'] ?? '');
$phone        = trim($input['phone'] ?? '');
$businessType = trim($input['businessType'] ?? '');
$country      = trim($input['country'] ?? '');

if (!$fullName || !$businessName || !$email || !$phone || !$businessType || !$country) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields.']);
    exit;
}

$displayName = explode(' ', $fullName)[0];

$payload = json_encode([
    'name'         => $fullName,
    'display_name' => $displayName,
    'email'        => $email,
    'phone'        => $phone,
    'other_fields' => [
        'Business Name' => $businessName,
        'Business Type' => $businessType,
        'Country'       => $country,
        'Source'         => 'GoldenHeart Landing Page',
        'Notes'          => 'Lead from GoldenHeart Marketplace onboarding.',
    ],
]);

$ch = curl_init($WEBHOOK_URL);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error    = curl_error($ch);
curl_close($ch);

if ($error || $httpCode >= 400) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'We could not send your application right now. Please try again later.',
    ]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Lead submitted successfully']);
