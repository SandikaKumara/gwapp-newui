import bcryptjs from "bcryptjs";

export async function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#!$%*";
    const charactersLength = characters.length;

    // Use Array.from to create an array of random characters
    const randomString = Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * charactersLength))
    ).join('');

    return randomString;
}

export async function hashPassword(password) {
    try {
        // Generate a salt
        const saltRounds = 10; // You can adjust the cost factor as needed
        const salt = await bcryptjs.genSalt(saltRounds);

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Hashing failed');
    }
};


export async function verifyPassword(password, hashedPassword) {
    try {
        return await bcryptjs.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error verifying password");
    }
}