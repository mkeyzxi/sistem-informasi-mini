import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Load environment variables
// FIX: Menghapus path spesifik. dotenv akan otomatis mencari file .env
// di direktori tempat skrip dijalankan (yaitu, folder 'backend').
dotenv.config();

// Connect to database
connectDB();

const createAdminUser = async () => {
  try {
    // 1. Cek apakah admin sudah ada
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log(colors.yellow('Admin user already exists.'));
      process.exit();
    }

    // 2. Buat user admin baru
    // Ganti email dan password di bawah ini sesuai keinginan Anda
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // Ganti dengan password yang aman
      role: 'admin',
    });

    if (adminUser) {
        console.log(colors.green.inverse('Admin user created successfully!'));
        console.log('---------------------------------'.green);
        console.log(`Name: ${adminUser.name}`.cyan);
        console.log(`Email: ${adminUser.email}`.cyan);
        console.log(`Password: password123`.cyan + ' (Gunakan ini untuk login)'.yellow);
        console.log('---------------------------------'.green);
    }
    
    process.exit();
  } catch (error) {
    console.error(colors.red.inverse(`Error: ${error.message}`));
    process.exit(1);
  }
};

// Panggil fungsi untuk membuat admin
createAdminUser();