<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$dir = __DIR__ . DIRECTORY_SEPARATOR . 'DANH-GIA-GOOGLE-MAP';
$webDir = '/DANH-GIA-GOOGLE-MAP/';
$allowed = ['jpg','jpeg','png','webp','gif'];
$items = [];

if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (!is_file($path)) continue;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed, true)) continue;
        $items[] = $file;
    }
}

natcasesort($items);
$items = array_values($items);
$out = [];
foreach ($items as $file) {
    $out[] = $webDir . rawurlencode($file);
}

echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
?>
