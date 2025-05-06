const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/db');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// Routes
app.post('/api/signup', (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Save user data
        const userId = db.saveUser({
            name,
            email,
            password: password, // In a real app, you should hash the password
            signupDate: new Date().toISOString()
        });

        res.json({ 
            success: true, 
            userId,
            message: 'User registered successfully' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.get('/api/user/:id', (req, res) => {
    try {
        const user = db.getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Don't send password in response
        const { password, ...userData } = user;
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 