<?php

$pdo = new PDO('mysql:host=127.0.0.1;dbname=vivenza_hogar', 'root', '');

$query = "SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME 
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
          WHERE TABLE_SCHEMA = 'vivenza_hogar' 
          AND REFERENCED_TABLE_NAME IS NOT NULL 
          ORDER BY TABLE_NAME";

$stmt = $pdo->query($query);
$relations = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "=== RELACIONES FOREIGN KEYS ===\n\n";
foreach ($relations as $rel) {
    echo $rel['TABLE_NAME'] . '.' . $rel['COLUMN_NAME'] 
         . ' → ' . $rel['REFERENCED_TABLE_NAME'] . "\n";
}

echo "\n\n=== TABLA DE CONTEO ===\n";
$tables = ['users', 'properties', 'locations', 'subscriptions', 'inquiries', 
           'property_images', 'favorites', 'user_verifications', 'messages', 'notifications'];

foreach ($tables as $table) {
    $count = $pdo->query("SELECT COUNT(*) as cnt FROM $table")->fetch()['cnt'];
    echo "$table: $count registros\n";
}
