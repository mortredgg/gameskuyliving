<?php
// Konfigurasi database
$servername = "localhost";
$username = "root"; // Default username untuk XAMPP
$password = ""; // Default password untuk XAMPP adalah kosong
$dbname = "games_skuy";

// Membuat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
