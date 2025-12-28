const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { logAction } = require('../utils/audit');
const { User } = require('../models');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const validRoles = ['ADMIN', 'HO', 'BRANCH', 'SALES', 'CUSTOMER'];
    const userRole = role && validRoles.includes(role) ? role : 'SALES';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      branchId: branchId ? parseInt(branchId) : null,
      customerId: req.body.customerId ? parseInt(req.body.customerId) : null
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
        customerId: user.customerId,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // IP Restriction Check
    if (user.allowedIPs) {
       const clientIP = req.ip || req.connection.remoteAddress || '';
       const allowed = user.allowedIPs.split(',').map(ip => ip.trim());
       const match = allowed.some(ip => clientIP.includes(ip));
       
       if (!match) {
         console.warn(`Blocked login for ${email} from IP ${clientIP}`);
         return res.status(403).json({ error: 'Access denied from this IP address' });
       }
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await logAction(user.id, 'LOGIN', 'User', user.id, { ip: req.ip });

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
        customerId: user.customerId,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
