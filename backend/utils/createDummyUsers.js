import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const PASSWORD = '11111111';

const seedUsers = async () => {
	try {
		// Admin check
		const adminExists = await User.findOne({ role: 'admin' });
		if (!adminExists) {
			await User.create({
				name: 'Admin User',
				email: 'admin@example.com',
				password: PASSWORD,
				role: 'admin',
			});
			console.log(colors.green('✅ Admin user created'));
		} else {
			console.log(colors.yellow('⚠️ Admin user already exists'));
		}

		// Dosen
		const dosenCount = await User.countDocuments({ role: 'dosen' });
		if (dosenCount < 5) {
			const dosenBulk = [];
			for (let i = 1; i <= 5; i++) {
				dosenBulk.push({
					name: `Dosen ${i}`,
					email: `dosen${i}@example.com`,
					password: PASSWORD,
					role: 'dosen',
				});
			}
			await User.insertMany(dosenBulk);
			console.log(colors.green(`✅ ${dosenBulk.length} dosen users created`));
		} else {
			console.log(colors.yellow('⚠️ Dosen users already exist'));
		}

		// Mahasiswa
		const mhsCount = await User.countDocuments({ role: 'mahasiswa' });
		if (mhsCount < 60) {
			const mahasiswaBulk = [];
			for (let i = 1; i <= 60; i++) {
				mahasiswaBulk.push({
					name: `Mahasiswa ${i}`,
					email: `mahasiswa${i}@example.com`,
					password: PASSWORD,
					role: 'mahasiswa',
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
