// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import colors from 'colors';
// import User from '../models/User.js';
// import connectDB from '../config/db.js';

// dotenv.config();
// connectDB();

// const PASSWORD = '11111111';

// const seedUsers = async () => {
// 	try {
// 		// Admin check
// 		const adminExists = await User.findOne({ role: 'admin' });
// 		if (!adminExists) {
// 			await User.create({
// 				name: 'Admin User',
// 				email: 'admin@example.com',
// 				password: PASSWORD,
// 				role: 'admin',
// 			});
// 			console.log(colors.green('✅ Admin user created'));
// 		} else {
// 			console.log(colors.yellow('⚠️ Admin user already exists'));
// 		}

// 		// Dosen
// 		const dosenCount = await User.countDocuments({ role: 'dosen' });
// 		if (dosenCount < 5) {
// 			const dosenBulk = [];
// 			for (let i = 1; i <= 5; i++) {
// 				dosenBulk.push({
// 					name: `Dosen ${i}`,
// 					email: `dosen${i}@example.com`,
// 					password: PASSWORD,
// 					role: 'dosen',
// 				});
// 			}
// 			await User.insertMany(dosenBulk);
// 			console.log(colors.green(`✅ ${dosenBulk.length} dosen users created`));
// 		} else {
// 			console.log(colors.yellow('⚠️ Dosen users already exist'));
// 		}

// 		// Mahasiswa
// 		const mhsCount = await User.countDocuments({ role: 'mahasiswa' });
// 		if (mhsCount < 60) {
// 			const mahasiswaBulk = [];
// 			for (let i = 1; i <= 60; i++) {
// 				mahasiswaBulk.push({
// 					name: `Mahasiswa ${i}`,
// 					email: `mahasiswa${i}@example.com`,
// 					password: PASSWORD,
// 					role: 'mahasiswa',
// 				});
// 			}
// 			await User.insertMany(mahasiswaBulk);
// 			console.log(colors.green(`✅ ${mahasiswaBulk.length} mahasiswa users created`));
// 		} else {
// 			console.log(colors.yellow('⚠️ Mahasiswa users already exist'));
// 		}

// 		console.log(colors.cyan('🎉 Dummy user generation completed!'));
// 		process.exit();
// 	} catch (error) {
// 		console.error(colors.red(`❌ Error: ${error.message}`));
// 		process.exit(1);
// 	}
// };

// seedUsers();







import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const PASSWORD = '11111111';

const randomDosen = [
	{ name: 'Liam Zhao', email: 'liam.zhao@unitech.edu', lecturerId: 'D00110' },
	{ name: 'Sophie Dubois', email: 'sophie.dubois@academe.org', lecturerId: 'D00111' },
	{ name: 'Drake Müller', email: 'drake.muller@forschung.de', lecturerId: 'D00112' },
	{ name: 'Mei Tanaka', email: 'mei.tanaka@tokyo-u.ac.jp', lecturerId: 'D00113' },
	{ name: 'Carlos Mendes', email: 'c.mendes@lisboa.pt', lecturerId: 'D00114' },
];

const randomMahasiswa = [
	'Ava Martinez',
	'Nina Petrova',
	'John Kim',
	'Fatima El-Rami',
	'Giovanni Rossi',
	'Luna Svensson',
	'Chen Wei',
	'Daniel Okoro',
	'Hannah Schmidt',
	'Mateo Garcia',
	'Mia Nguyen',
	'Oliver Popescu',
	'Zara Ali',
	'Theo Laurent',
	// ... lanjutkan sampai 60 nama, bisa dibuat otomatis juga
];

const seedUsers = async () => {
	try {
		// Hash password once
		const hashedPassword = await bcrypt.hash(PASSWORD, 10);

		// Admin check
		const adminExists = await User.findOne({ role: 'admin' });
		if (!adminExists) {
			await User.create({
				name: 'Admin User',
				email: 'admin@example.com',
				password: hashedPassword,
				role: 'admin',
			});
			console.log(colors.green('✅ Admin user created'));
		} else {
			console.log(colors.yellow('⚠️ Admin user already exists'));
		}

		// Dosen
		const dosenCount = await User.countDocuments({ role: 'dosen' });
		if (dosenCount < 5) {
			const dosenBulk = randomDosen.map(d => ({
				...d,
				password: hashedPassword,
				role: 'dosen',
			}));
			await User.insertMany(dosenBulk);
			console.log(colors.green(`✅ ${dosenBulk.length} dosen users created`));
		} else {
			console.log(colors.yellow('⚠️ Dosen users already exist'));
		}

		// Mahasiswa
		const mhsCount = await User.countDocuments({ role: 'mahasiswa' });
		if (mhsCount < 60) {
			const mahasiswaBulk = [];
			for (let i = 0; i < 60; i++) {
				const name = randomMahasiswa[i % randomMahasiswa.length] + ` ${i + 1}`;
				mahasiswaBulk.push({
					name,
					email: `mhs${i + 1}@student.edu`,
					password: hashedPassword,
					role: 'mahasiswa',
					studentId: `S2023${(i + 1).toString().padStart(3, '0')}`,
				});
			}
			await User.insertMany(mahasiswaBulk);
			console.log(colors.green(`✅ ${mahasiswaBulk.length} mahasiswa users created`));
		} else {
			console.log(colors.yellow('⚠️ Mahasiswa users already exist'));
		}

		console.log(colors.cyan('🎉 Dummy user generation completed!'));
		process.exit();
	} catch (error) {
		console.error(colors.red(`❌ Error: ${error.message}`));
		process.exit(1);
	}
};

seedUsers();
