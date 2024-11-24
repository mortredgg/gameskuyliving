<?php
$servername = "localhost"; // Nama server
$username = "root";        // Username MySQL Anda
$password = "";            // Password MySQL Anda (kosong untuk XAMPP)
$dbname = "games_skuy";    // Nama database Anda

// Membuat koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
