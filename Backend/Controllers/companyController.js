const Company = require('../models/Company');
const bcrypt = require('bcryptjs');

const companyController = {
    register: async (req, res) => {
        try {
            const {
                companyName,
                industry,
                companySize,
                website,
                email,
                password,
                phone,
                address,
                description,
                foundedYear,
                contactPerson,
                socialLinks
            } = req.body;

            if (!companyName || !industry || !companySize || !email || !password || !phone || !address || !contactPerson) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            const existingCompany = await Company.findOne({ email });
            if (existingCompany) {
                return res.status(400).json({
                    success: false,
                    message: 'Company with this email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newCompany = new Company({
                companyName,
                industry,
                companySize,
                website,
                email,
                password: hashedPassword,
                phone,
                address,
                description,
                foundedYear,
                contactPerson,
                socialLinks: socialLinks || {}
            });

            await newCompany.save();

            const companyData = newCompany.toObject();
            delete companyData.password;

            res.status(201).json({
                success: true,
                message: 'Company registered successfully',
                data: companyData
            });

        } catch (error) {
            console.error('Company registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during company registration'
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

            const company = await Company.findOne({ email });
            if (!company) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, company.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const companyData = company.toObject();
            delete companyData.password;

            res.status(200).json({
                success: true,
                message: 'Company logged in successfully',
                data: companyData
            });

        } catch (error) {
            console.error('Company login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during company login'
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            const { companyId } = req.params;

            const company = await Company.findById(companyId).select('-password');
            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            res.status(200).json({
                success: true,
                data: company
            });

        } catch (error) {
            console.error('Get company profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { companyId } = req.params;
            const updates = req.body;

            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 12);
            }

            const updatedCompany = await Company.findByIdAndUpdate(
                companyId,
                updates,
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedCompany) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Company profile updated successfully',
                data: updatedCompany
            });

        } catch (error) {
            console.error('Update company profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.find().select('-password');
            
            res.status(200).json({
                success: true,
                count: companies.length,
                data: companies
            });

        } catch (error) {
            console.error('Get all companies error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    getCompaniesByIndustry: async (req, res) => {
        try {
            const { industry } = req.params;

            const companies = await Company.find({ industry }).select('-password');
            
            res.status(200).json({
                success: true,
                count: companies.length,
                data: companies
            });

        } catch (error) {
            console.error('Get companies by industry error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};

module.exports = companyController;
