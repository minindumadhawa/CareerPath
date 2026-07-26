const mongoose = require('mongoose');
const Enrollment = require('./models/careerAdvicemodel/Enrollment');
require('dotenv').config();
//XqdDbYuoR6knQ9c8
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:<db_password>@cluster0.ixembwy.mongodb.net/';

async function testEnroll() {
    try {
        await mongoose.connect(MONGO_URI);

        // Attempt inserting two different records for the same student
        const enroll1 = new Enrollment({
            studentName: 'Kasun',
            studentEmail: 'kasun@gmail.com',
            programId: new mongoose.Types.ObjectId(),
            programType: 'Leadership'
        });

        await enroll1.save();
        console.log('Enrollment 1 Saved');

        const enroll2 = new Enrollment({
            studentName: 'Kasun',
            studentEmail: 'kasun@gmail.com',
            programId: new mongoose.Types.ObjectId(), // Different programId
            programType: 'TechnicalResource'
        });

        await enroll2.save();
        console.log('Enrollment 2 Saved');

    } catch (err) {
        console.error('Error inserting:', err);
    } finally {
        mongoose.connection.close();
    }
}

testEnroll();
