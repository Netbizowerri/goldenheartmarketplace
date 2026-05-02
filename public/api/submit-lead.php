<?php
/**
 * cPanel API Proxy for Privyr Webhook + Resend Email Notifications
 *
 * Upload this file to public_html/api/submit-lead.php
 *
 * Requirements:
 * - Resend PHP SDK: composer require resend/resend-php
 * - .env file with RESEND_API_KEY, ADMIN_EMAIL, SITE_NAME, FROM_EMAIL
 *
 * Sends dual email notifications on form submission:
 *   1. Admin notification (new lead alert) via Resend
 *   2. Visitor confirmation (auto-reply) via Resend
 *
 * DO NOT REMOVE Privyr webhook logic — it is extended, not replaced.
 *
 * RESEND SETUP CHECKLIST (do this in the Resend dashboard before going live):
 * 1. Login at resend.com/domains
 * 2. Add domain: merchantsgoldenheart.com
 * 3. Copy the DNS records Resend gives you (SPF, DKIM, DMARC)
 * 4. Add those DNS records in cPanel > Zone Editor
 * 5. Click Verify in Resend dashboard
 * 6. Replace re_xxxxxxxxxxxx in .env with your real API key
 */

// Composer autoload for Resend SDK & Dotenv
require_once __DIR__ . '/../../cpanel/vendor/autoload.php';

use Resend\Resend;

// Load .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Environment configuration
$RESEND_API_KEY = $_ENV['RESEND_API_KEY'] ?? '';
$ADMIN_EMAIL    = $_ENV['ADMIN_EMAIL']    ?? 'goldenheartmarketplace@gmail.com';
$SITE_NAME      = $_ENV['SITE_NAME']      ?? 'GoldenHeart Marketplace';
$FROM_EMAIL     = $_ENV['FROM_EMAIL']     ?? 'noreply@merchantsgoldenheart.com';
$WEBHOOK_URL    = $_ENV['PRIVYR_WEBHOOK_URL'] ?? 'https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/JSh0Qptn';

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
        'Source'        => 'GoldenHeart Landing Page',
        'Notes'         => 'Lead from GoldenHeart Marketplace onboarding.',
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

// --- SEND DUAL EMAIL NOTIFICATIONS VIA RESEND (non-blocking) ---

if ($RESEND_API_KEY) {
    $resend = new Resend($RESEND_API_KEY);

    // A) Admin notification
    try {
        $resend->emails->send([
            'from'    => $FROM_EMAIL,
            'to'      => [$ADMIN_EMAIL],
            'subject' => 'New Vendor Enquiry — ' . $SITE_NAME,
            'html'    => '
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0F0E0B; color: #ffffff; padding: 0; margin: 0; }
                    .card { max-width: 600px; margin: 40px auto; background: #1a1a1a; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
                    .header { background: #0F0E0B; padding: 32px 40px; border-bottom: 2px solid #B8860B; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
                    .content { padding: 32px 40px; }
                    .table { width: 100%; border-collapse: collapse; }
                    .table tr { border-bottom: 1px solid #333333; }
                    .table tr:last-child { border-bottom: none; }
                    .table td { padding: 14px 8px; font-size: 15px; }
                    .table td:first-child { color: #888888; font-weight: 500; width: 45%; vertical-align: top; }
                    .table td:last-child { color: #ffffff; }
                    .footer { background: #0F0E0B; padding: 24px 40px; border-top: 1px solid #333333; text-align: center; }
                    .footer p { margin: 0; font-size: 13px; color: #666666; }
                    .footer a { color: #B8860B; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <h1>New Vendor Enquiry Received</h1>
                    </div>
                    <div class="content">
                        <table class="table">
                            <tr><td>Full Name</td><td>' . htmlspecialchars($fullName) . '</td></tr>
                            <tr><td>Business Name</td><td>' . htmlspecialchars($businessName) . '</td></tr>
                            <tr><td>Email</td><td>' . htmlspecialchars($email) . '</td></tr>
                            <tr><td>Phone</td><td>' . htmlspecialchars($phone) . '</td></tr>
                            <tr><td>Business Type</td><td>' . htmlspecialchars($businessType) . '</td></tr>
                            <tr><td>Country</td><td>' . htmlspecialchars($country) . '</td></tr>
                        </table>
                    </div>
                    <div class="footer">
                        <p>' . htmlspecialchars($SITE_NAME) . ' — <a href="https://kelechi-nwachukwu.vercel.app">The Code Orchestrator</a></p>
                    </div>
                </div>
            </body>
            </html>',
        ]);
        error_log("[RESEND] Admin notification sent to {$ADMIN_EMAIL}");
    } catch (Exception $e) {
        error_log("[RESEND ERROR] Admin notification failed: " . $e->getMessage());
    }

    // B) Visitor confirmation
    $firstName = explode(' ', trim($fullName))[0] ?: $fullName;
    try {
        $resend->emails->send([
            'from'    => $FROM_EMAIL,
            'to'      => [$email],
            'reply_to' => $ADMIN_EMAIL,
            'subject' => "We've received your enquiry — " . $SITE_NAME,
            'html'    => '
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0F0E0B; color: #ffffff; padding: 0; margin: 0; }
                    .card { max-width: 600px; margin: 40px auto; background: #1a1a1a; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
                    .header { background: #0F0E0B; padding: 32px 40px; border-bottom: 2px solid #B8860B; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: #B8860B; letter-spacing: -0.5px; }
                    .content { padding: 32px 40px; }
                    .greeting { font-size: 18px; color: #ffffff; margin-bottom: 16px; }
                    .message { font-size: 16px; color: #cccccc; line-height: 1.6; margin-bottom: 24px; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                    .table tr { border-bottom: 1px solid #333333; }
                    .table tr:last-child { border-bottom: none; }
                    .table td { padding: 12px 8px; font-size: 15px; }
                    .table td:first-child { color: #888888; font-weight: 500; width: 45%; }
                    .table td:last-child { color: #ffffff; }
                    .footer { background: #0F0E0B; padding: 24px 40px; border-top: 1px solid #333333; text-align: center; }
                    .footer p { margin: 0 0 8px 0; font-size: 13px; color: #666666; }
                    .footer a { color: #B8860B; text-decoration: none; font-weight: 600; }
                    .divider { height: 1px; background: linear-gradient(90deg, transparent, #333333, transparent); margin: 24px 0; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <h1>Thank you, ' . htmlspecialchars($firstName) . '!</h1>
                    </div>
                    <div class="content">
                        <div class="greeting">We\'ve received your vendor registration interest and will be in touch within 24–48 hours. In the meantime, feel free to reach us on WhatsApp.</div>
                        <div class="divider"></div>
                        <table class="table">
                            <tr><td>Full Name</td><td>' . htmlspecialchars($fullName) . '</td></tr>
                            <tr><td>Business Name</td><td>' . htmlspecialchars($businessName) . '</td></tr>
                            <tr><td>Email</td><td>' . htmlspecialchars($email) . '</td></tr>
                            <tr><td>Phone</td><td>' . htmlspecialchars($phone) . '</td></tr>
                            <tr><td>Business Type</td><td>' . htmlspecialchars($businessType) . '</td></tr>
                            <tr><td>Country</td><td>' . htmlspecialchars($country) . '</td></tr>
                        </table>
                    </div>
                    <div class="footer">
                        <p>' . htmlspecialchars($SITE_NAME) . '</p>
                        <p>Kelechi Nwachukwu — <a href="https://kelechi-nwachukwu.vercel.app">The Code Orchestrator</a></p>
                    </div>
                </div>
            </body>
            </html>',
        ]);
        error_log("[RESEND] Visitor confirmation sent to {$email}");
    } catch (Exception $e) {
        error_log("[RESEND ERROR] Visitor confirmation failed: " . $e->getMessage());
    }
} else {
    error_log("[RESEND] Skipped — API key not configured");
}

echo json_encode(['success' => true, 'message' => 'Lead submitted successfully']);
