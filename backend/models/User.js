// File: backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama tidak boleh kosong'],
    },
    email: {
      type: String,
      required: [true, 'Email tidak boleh kosong'],
      unique: true,
      match: [/.+\@.+\..+/, 'Format email tidak valid'],
    },
    password: {
      type: String,
      required: [true, 'Password tidak boleh kosong'],
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ['mahasiswa', 'dosen', 'admin'],
      default: 'mahasiswa',
    },
    studentId: { // Nomor Induk Mahasiswa (NIM)
      type: String,
      unique: true,
      sparse: true, // Memungkinkan null menjadi unik
    },
    lecturerId: { // Nomor Induk Dosen (NIDN)
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enkripsi password sebelum menyimpan
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metode untuk mencocokkan password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;