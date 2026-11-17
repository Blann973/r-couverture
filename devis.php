<?php
// Envoie la demande de devis par email. À placer à côté de index.html.
$destinataire = 'rigueurcouverture.charpente@gmail.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !empty($_POST['_honey'])) {
    header('Location: index.html'); exit;
}
function champ($k) { return trim(str_replace(["\r", "\n"], ' ', strip_tags($_POST[$k] ?? ''))); }

$nom = champ('nom'); $tel = champ('tel'); $email = champ('email');
$type = champ('type'); $ville = champ('ville');
$message = trim(strip_tags($_POST['message'] ?? ''));

if (!$nom || !$tel || !filter_var($email, FILTER_VALIDATE_EMAIL) || !isset($_POST['rgpd'])) {
    header('Location: index.html?envoi=erreur#devis'); exit;
}

$corps = "Nom : $nom\nTéléphone : $tel\nEmail : $email\nTravaux : $type\nVille : $ville\n\n$message";
// L'adresse d'expéditeur doit exister sur ton domaine (à créer dans Hostinger).
$entetes = "From: site@rigueurcouverture.fr\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
$sujet = '=?UTF-8?B?' . base64_encode("Demande de devis – $nom") . '?=';

$ok = mail($destinataire, $sujet, $corps, $entetes);
header('Location: index.html?envoi=' . ($ok ? 'ok' : 'erreur') . '#devis');
