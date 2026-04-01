const mongoose = require('mongoose');
const Enrollment = require('./models/careerAdvicemodel/Enrollment');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:H4eQUj4fjzqgjrlX@cluster0.j4bshhl.mongodb.net/';

async function checkIndexes() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Get current indexes
        const indexes = await Enrollment.collection.indexes();
        console.log('Current Indexes:', indexes);

        // Check if studentEmail_1 exists
        const hasEmailIndex = indexes.find(i => i.name === 'studentEmail_1');
        if (hasEmailIndex) {
            console.log('Dropping studentEmail_1 index...');
            await Enrollment.collection.dropIndex('studentEmail_1');
            console.log('Dropped successfully.');
        }

        // Ensure the compound index is created
        await Enrollment.syncIndexes();
        console.log('Syncing correct indexes...');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        mongoose.connection.close();
    }
}

checkIndexes();
