<?php
// Секретный ключ для безопасности (придумайте свой)
$secret_key = '6232243';

// Проверяем секретный ключ
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Доступ запрещен');
}

// Логируем запрос
file_put_contents('deploy.log', date('Y-m-d H:i:s') . " - Deploy started\n", FILE_APPEND);

// Выполняем git pull
$output = shell_exec('cd deploy.php && git pull origin main 2>&1');

// Логируем результат
file_put_contents('deploy.log', date('Y-m-d H:i:s') . " - Output: " . $output . "\n", FILE_APPEND);

echo "Deploy completed: " . $output;
?>