<?php
require 'db_connection.php'; // Pastikan koneksi database sudah benar

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Bersihkan input untuk menghindari karakter berbahaya
    $username = trim(htmlspecialchars($_POST['username']));
    $email = trim(htmlspecialchars($_POST['email']));
    $password = trim($_POST['password']);

    // Validasi input
    if (empty($username) || empty($email) || empty($password)) {
        echo "Semua kolom wajib diisi.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Format email tidak valid.";
        exit;
    }

    if (strlen($password) < 6) {
        echo "Password harus minimal 6 karakter.";
        exit;
    }

    // Hash password untuk keamanan
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Cek apakah email sudah terdaftar
    $check_query = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_query);
    if (!$stmt) {
        echo "Kesalahan pada query: " . $conn->error;
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "Email sudah terdaftar. Silakan gunakan email lain.";
        $stmt->close();
        $conn->close();
        exit;
    }

    // Masukkan data baru ke database
    $insert_query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($insert_query);
    if (!$stmt) {
        echo "Kesalahan pada query: " . $conn->error;
        exit;
    }

    $stmt->bind_param("sss", $username, $email, $hashed_password);

    if ($stmt->execute()) {
        echo "Registrasi berhasil! Silakan login.";
    } else {
        echo "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
    }

    // Jangan lupa menutup statement dan koneksi
    $stmt->close();
    $conn->close();
} else {
    echo "Permintaan tidak valid.";
}
?>
