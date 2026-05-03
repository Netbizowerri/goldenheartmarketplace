<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

function loadEnvFiles(array $paths): void
{
    foreach ($paths as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            continue;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || strpos($trimmed, '#') === 0 || strpos($trimmed, '=') === false) {
                continue;
            }

            [$key, $value] = explode('=', $trimmed, 2);
            $key = trim($key);
            $value = trim($value);

            if ($value !== '' && (($value[0] === '"' && substr($value, -1) === '"') || ($value[0] === "'" && substr($value, -1) === "'"))) {
                $value = substr($value, 1, -1);
            }

            if ($key !== '' && getenv($key) === false) {
                putenv($key . '=' . $value);
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

function envValue(string $key, string $default = ''): string
{
    $value = getenv($key);
    if ($value === false || $value === null || $value === '') {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? $default;
    }

    return is_string($value) ? trim($value) : $default;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function isValidEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function postJson(string $url, array $payload, array $headers = [], int $timeout = 15): array
{
    $ch = curl_init($url);
    $body = json_encode($payload);

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => array_merge(
            ['Content-Type: application/json', 'Accept: application/json'],
            $headers
        ),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeout,
    ]);

    $responseBody = curl_exec($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [
        'ok' => $error === '' && $statusCode >= 200 && $statusCode < 300,
        'status' => $statusCode,
        'error' => $error,
        'body' => $responseBody === false ? '' : $responseBody,
    ];
}

function buildAdminEmailHtml(array $lead, string $siteName): string
{
    return '
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
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h1>New Vendor Enquiry Received</h1>
            </div>
            <div class="content">
                <table class="table">
                    <tr><td>Full Name</td><td>' . htmlspecialchars($lead['fullName']) . '</td></tr>
                    <tr><td>Business Name</td><td>' . htmlspecialchars($lead['businessName']) . '</td></tr>
                    <tr><td>Email</td><td>' . htmlspecialchars($lead['email']) . '</td></tr>
                    <tr><td>Phone</td><td>' . htmlspecialchars($lead['phone']) . '</td></tr>
                    <tr><td>Business Type</td><td>' . htmlspecialchars($lead['businessType']) . '</td></tr>
                    <tr><td>Country</td><td>' . htmlspecialchars($lead['country']) . '</td></tr>
                </table>
            </div>
            <div class="footer">
                <p>' . htmlspecialchars($siteName) . '</p>
            </div>
        </div>
    </body>
    </html>';
}

function buildVisitorEmailHtml(array $lead, string $siteName): string
{
    $firstName = explode(' ', trim($lead['fullName']))[0] ?: $lead['fullName'];

    return '
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
            .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            .table tr { border-bottom: 1px solid #333333; }
            .table tr:last-child { border-bottom: none; }
            .table td { padding: 12px 8px; font-size: 15px; }
            .table td:first-child { color: #888888; font-weight: 500; width: 45%; }
            .table td:last-child { color: #ffffff; }
            .footer { background: #0F0E0B; padding: 24px 40px; border-top: 1px solid #333333; text-align: center; }
            .footer p { margin: 0 0 8px 0; font-size: 13px; color: #666666; }
            .divider { height: 1px; background: linear-gradient(90deg, transparent, #333333, transparent); margin: 24px 0; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h1>Thank you, ' . htmlspecialchars($firstName) . '!</h1>
            </div>
            <div class="content">
                <div class="greeting">We have received your vendor registration interest and will be in touch within 24-48 hours.</div>
                <div class="divider"></div>
                <table class="table">
                    <tr><td>Full Name</td><td>' . htmlspecialchars($lead['fullName']) . '</td></tr>
                    <tr><td>Business Name</td><td>' . htmlspecialchars($lead['businessName']) . '</td></tr>
                    <tr><td>Email</td><td>' . htmlspecialchars($lead['email']) . '</td></tr>
                    <tr><td>Phone</td><td>' . htmlspecialchars($lead['phone']) . '</td></tr>
                    <tr><td>Business Type</td><td>' . htmlspecialchars($lead['businessType']) . '</td></tr>
                    <tr><td>Country</td><td>' . htmlspecialchars($lead['country']) . '</td></tr>
                </table>
            </div>
            <div class="footer">
                <p>' . htmlspecialchars($siteName) . '</p>
            </div>
        </div>
    </body>
    </html>';
}

function sendResendEmail(string $apiKey, array $payload): void
{
    $response = postJson(
        'https://api.resend.com/emails',
        $payload,
        ['Authorization: Bearer ' . $apiKey],
        20
    );

    if (!$response['ok']) {
        error_log('[RESEND ERROR] HTTP ' . $response['status'] . ' ' . $response['error'] . ' ' . $response['body']);
    }
}

loadEnvFiles([
    dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . '.env',
    dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
]);

$RESEND_API_KEY = envValue('RESEND_API_KEY');
$ADMIN_EMAIL = envValue('ADMIN_EMAIL', 'goldenheartmarketplace@gmail.com');
$SITE_NAME = envValue('SITE_NAME', 'GoldenHeart Marketplace');
$FROM_EMAIL = envValue('FROM_EMAIL', 'noreply@merchantsgoldenheart.com');
$WEBHOOK_URL = envValue('PRIVYR_WEBHOOK_URL', 'https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/JSh0Qptn');

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    respond(400, ['success' => false, 'error' => 'Invalid request body.']);
}

$lead = [
    'fullName' => trim((string) ($input['fullName'] ?? '')),
    'businessName' => trim((string) ($input['businessName'] ?? '')),
    'email' => trim((string) ($input['email'] ?? '')),
    'phone' => trim((string) ($input['phone'] ?? '')),
    'businessType' => trim((string) ($input['businessType'] ?? '')),
    'country' => trim((string) ($input['country'] ?? '')),
];

foreach ($lead as $value) {
    if ($value === '') {
        respond(400, ['success' => false, 'error' => 'Please fill in all required fields.']);
    }
}

if (!isValidEmail($lead['email'])) {
    respond(400, ['success' => false, 'error' => 'Enter a valid email address.']);
}

$displayName = explode(' ', $lead['fullName'])[0];
$privyrPayload = [
    'name' => $lead['fullName'],
    'display_name' => $displayName,
    'email' => $lead['email'],
    'phone' => $lead['phone'],
    'other_fields' => [
        'Business Name' => $lead['businessName'],
        'Business Type' => $lead['businessType'],
        'Country' => $lead['country'],
        'Source' => 'GoldenHeart Landing Page',
        'Notes' => 'Lead from GoldenHeart Marketplace onboarding.',
    ],
];

$privyrResponse = postJson($WEBHOOK_URL, $privyrPayload);
if (!$privyrResponse['ok']) {
    error_log('[PRIVYR ERROR] HTTP ' . $privyrResponse['status'] . ' ' . $privyrResponse['error'] . ' ' . $privyrResponse['body']);
    respond(500, [
        'success' => false,
        'error' => 'We could not send your application right now. Please try again later.',
    ]);
}

if ($RESEND_API_KEY !== '' && isValidEmail($FROM_EMAIL)) {
    if (isValidEmail($ADMIN_EMAIL)) {
        sendResendEmail($RESEND_API_KEY, [
            'from' => $FROM_EMAIL,
            'to' => [$ADMIN_EMAIL],
            'subject' => 'New Vendor Enquiry - ' . $SITE_NAME,
            'html' => buildAdminEmailHtml($lead, $SITE_NAME),
        ]);
    }

    sendResendEmail($RESEND_API_KEY, [
        'from' => $FROM_EMAIL,
        'to' => [$lead['email']],
        'reply_to' => $ADMIN_EMAIL,
        'subject' => 'We have received your enquiry - ' . $SITE_NAME,
        'html' => buildVisitorEmailHtml($lead, $SITE_NAME),
    ]);
}

respond(200, ['success' => true, 'message' => 'Lead submitted successfully']);
