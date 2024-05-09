const connection = require('../Config/Connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(name, email, password, phone) {
    try {
        // cek apakah email ini sudah terdaftar /belum?
        const [existingEmailUser] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (existingEmailUser.length > 0) throw new Error('Email already exists');

        // kita hash passwordnya agar tidak dapat dibaca artinya pastikan yang kita tulis passwordnya hafal
        // jamal = 1234567890
        const hashedPassword = await bcrypt.hash(password, 10);

        // kalau tidak ada maka kita boleh buat email tersebut
        const [newUser] = await connection.query(
            'INSERT INTO user (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, phone]
        );

        return {
            success: true,
            message: 'User has been created',
            data: {
                id: newUser.insertId,
                name,
                email,
                password,
                phone
            }
        }
    }
    catch (error) {
        throw new Error(error);
    }
}

async function loginUser(email, password) {
    try {
        const [user] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (user.length === 0) throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) throw new Error('Invalid password');

        // Generate Token
        const createToken = jwt.sign({ email: user[0].email, password: user[0].password }, 'bazmaSecretKey');
        return {
            success: true,
            message: 'Login successful',
            createToken
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
}

async function getMe(token) {
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'bazmaSecretKey');
        const userData = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            phone: decoded.phone
        }
        return {
            success: true,
            message: 'User data retrieved successfully', 
            data: userData
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
}


// Login
module.exports = {
    registerUser,
    loginUser,
    getMe
};

