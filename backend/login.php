<?php
require 'db.php'; // Menghubungkan ke database
session_start(); // Memulai session

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Query untuk memeriksa email
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Bind hasil ke variabel
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        // Verifikasi password
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id; // Simpan user ID ke session
            echo "Login berhasil!"; // Debug message
            header("Location: ../index.html"); // Redirect ke halaman utama
            exit();
        } else {
            echo "Password salah.";
        }
    } else {
        echo "Email tidak ditemukan.";
    }

    $stmt->close();
    $conn->close();
}
?>
