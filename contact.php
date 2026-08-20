<?php
/**
 * IMAROC - Formulaire de Contact & Demande de Projet
 * Traitement sécurisé côté serveur (PHP) - Adapté au Template
 */

// Configuration de la réponse en JSON
header('Content-Type: application/json; charset=utf-8');

// Empêcher l'accès direct via GET
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Méthode de requête non autorisée.'
    ]);
    exit;
}

// Nettoyage et récupération des données du formulaire
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';

// Validation des champs requis
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Veuillez remplir tous les champs obligatoires.'
    ]);
    exit;
}

// Validation de l'adresse email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'L\'adresse e-mail saisie n\'est pas valide.'
    ]);
    exit;
}

// Destinataire officiel
$to = 'ettayfikhawla@gmail.com'; 

// Sujet de l'email
$email_subject = "[Contact Site Vitrine] - " . $subject . " par " . $name;

// Construction du corps du message en HTML
$email_body = "
<html>
<head>
    <title>$email_subject</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; background-color: #F9FAFB; }
        .header { background-color: #0D1B2A; color: #ffffff; padding: 20px; text-align: center; border-radius: 6px 6px 0 0; border-bottom: 4px solid #D4A017; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; }
        .content { padding: 20px; background-color: #ffffff; }
        .detail-row { margin-bottom: 12px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; }
        .detail-label { font-weight: bold; color: #0D1B2A; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
        .detail-value { font-size: 15px; margin-top: 4px; color: #1F2937; }
        .message-box { background-color: #F3F4F6; padding: 15px; border-left: 4px solid #D4A017; border-radius: 4px; font-style: italic; margin-top: 20px; }
        .footer { text-align: center; margin-top: 25px; font-size: 12px; color: #6B7280; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>IMAROC - NOUVEAU MESSAGE</h1>
        </div>
        <div class='content'>
            <div class='detail-row'>
                <div class='detail-label'>Nom</div>
                <div class='detail-value'>$name</div>
            </div>
            <div class='detail-row'>
                <div class='detail-label'>Adresse E-mail</div>
                <div class='detail-value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='detail-row'>
                <div class='detail-label'>Sujet</div>
                <div class='detail-value'><strong>$subject</strong></div>
            </div>
            
            <div class='detail-label' style='margin-top:20px;'>Message</div>
            <div class='message-box'>
                " . nl2br($message) . "
            </div>
        </div>
        <div class='footer'>
            Ce message a été envoyé depuis le formulaire de contact du site vitrine IMAROC.
        </div>
    </div>
</body>
</html>
";

// Headers pour l'envoi d'e-mail au format HTML
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: IMAROC Web System <noreply@imaroc.ma>" . "\r\n";
$headers .= "Reply-To: $name <$email>" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Envoi de l'e-mail
if (@mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Merci ! Votre message a été envoyé avec succès. Notre équipe vous recontactera sous 24h.'
    ]);
} else {
    // Si la fonction mail() échoue (par exemple sur un serveur local)
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Une erreur technique interne s\'est produite lors de l\'envoi. Veuillez nous contacter directement à l\'adresse contact@imaroc.ma.'
    ]);
}
exit;
?>
