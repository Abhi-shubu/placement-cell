const Employee = require("../models/employee")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registernormalemployee = async (req, res) => {
    try {
        // Destructure request body
        const { name, email, password, empcode } = req.body;

        
        // Check if employee with the same email exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ success: false, error: 'Employee with this email already exists' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new employee instance
        const employee = new Employee({
            name,
            email,
            passwordHash,
            empcode
        });

        // Save employee to the database
        const savedEmployee = await employee.save();

        // Check if employee was saved successfully
        if (!savedEmployee) {
            return res.status(500).json({ success: false, error: 'Failed to create employee' });
        }

        // Respond with success message
        res.status(201).json({ success: true, message: 'Employee created successfully' });

    } catch (error) {
        console.error('Failed to create employee:', error);
        res.status(500).json({ success: false, error: 'An error occurred while creating the employee' });
    }
};



exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the employee by email
        const employee = await Employee.findOne({ email });
        
        // If no employee found, return error
        if (!employee) {
            return res.status(400).send('Invalid email or password!');
        }

        // Compare the input password with the hashed password
        if (employee && bcrypt.compareSync(password, employee.passwordHash)) {
            let role = 'employee'; // Assuming all users logging in are employees
            
            // Create JWT token
            const secret = process.env.secret; // Secret for JWT signing
            const token = jwt.sign(
                {
                    userId: employee.id, // Assuming employee model has an id field
                    role: role
                },
                secret,
                { expiresIn: '30d' } // Token expiration time
            );

            // Send response with user details and token
            return res.status(200).send({ userId: employee.id, email: employee.email, role: role, token: token });
        }

        // If password does not match, return error
        res.status(400).send('Invalid email or password!');
    } catch (error) {
        // If any error occurs during login process, return server error
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to log in' });
    }
};
