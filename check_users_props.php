<?php

$pdo = new PDO('mysql:host=127.0.0.1;dbname=vivenza_hogar', 'root', '');

echo "=== USUARIOS Y SUS PROPIEDADES ===\n\n";

$query = "SELECT u.id, u.name, u.email, u.role, 
                 COUNT(p.id) as prop_count,
                 s.plan, s.status as sub_status
          FROM users u
          LEFT JOIN properties p ON u.id = p.user_id
          LEFT JOIN subscriptions s ON u.id = s.user_id
          GROUP BY u.id, u.name, u.email, u.role, s.plan, s.status
          ORDER BY u.role DESC, u.id";

$stmt = $pdo->query($query);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($results as $user) {
    echo "👤 {$user['name']} ({$user['email']})\n";
    echo "   Rol: {$user['role']}\n";
    echo "   Propiedades: {$user['prop_count']}\n";
    echo "   Suscripción: {$user['plan']} ({$user['sub_status']})\n";
    echo "---\n";
}

echo "\n=== PROPIEDADES POR AGENTE ===\n\n";

$query2 = "SELECT p.id, p.title, p.type, p.status, p.price, u.name as agent_name
           FROM properties p
           JOIN users u ON p.user_id = u.id
           ORDER BY u.name, p.id";

$stmt2 = $pdo->query($query2);
$props = $stmt2->fetchAll(PDO::FETCH_ASSOC);

foreach ($props as $prop) {
    echo "🏠 {$prop['title']}\n";
    echo "   Agente: {$prop['agent_name']}\n";
    echo "   Tipo: {$prop['type']} | Precio: {$prop['price']} | Status: {$prop['status']}\n";
    echo "---\n";
}
