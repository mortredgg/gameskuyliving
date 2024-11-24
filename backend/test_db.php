<?php
require 'db.php';

if ($conn->connect_error) {
    echo "Koneksi gagal: " . $conn->connect_error;
} else {
    echo "Koneksi berhasil!";
}

$conn->close(); // Menutup koneksi
?>
