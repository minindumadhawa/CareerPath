const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

const studentController = {
    register: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                phone,
                dateOfBirth,
                education,
                skills,
                experience
            } = req.body;

            if (!firstName || !lastName || !email || !password || !phone || !dateOfBirth || !education) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            const existingStudent = await Student.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Student with this email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newStudent = new Student({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                dateOfBirth,
                education,
                skills: skills || [],
                experience: experience || []
            });

            await newStudent.save();

            const studentData = newStudent.toObject();
            delete studentData.password;

            res.status(201).json({
                success: true,
                message: 'Student registered successfully',
                data: studentData
            });

        } catch (error) {
            console.error('Student registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during student registration'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            const student = await Student.findOne({ email });
            if (!student) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, student.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const studentData = student.toObject();
            delete studentData.password;

            res.status(200).json({
                success: true,
                message: 'Student logged in successfully',
                data: studentData
            });

        } catch (error) {
            console.error('Student login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during student login'
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            const { studentId } = req.params;

            const student = await Student.findById(studentId).select('-password');
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.status(200).json({
                success: true,
                data: student
            });

        } catch (error) {
            console.error('Get student profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { studentId } = req.params;
            const updates = req.body;

            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 12);
            }

            const updatedStudent = await Student.findByIdAndUpdate(
                studentId,
                updates,
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedStudent) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Student profile updated successfully',
                data: updatedStudent
            });

        } catch (error) {
            console.error('Update student profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    getAllStudents: async (req, res) => {
        try {
            const students = await Student.find().select('-password');
            
            res.status(200).json({
                success: true,
                count: students.length,
                data: students
            });

        } catch (error) {
            console.error('Get all students error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};

module.exports = studentController;
