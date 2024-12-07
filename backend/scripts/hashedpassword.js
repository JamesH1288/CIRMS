const bcrypt = require('bcrypt'); // Ensure bcrypt is installed

const generateHash = async () => {
    const password = 'cirms123'; // Replace with the password you want to hash
    const saltRounds = 10;       // Number of salt rounds

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Output the hashed password
        console.log('Hashed Password:', hashedPassword);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

generateHash();
