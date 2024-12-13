'use server'
import path from 'path';
import { promises as fs } from 'fs';
// import formidable from 'formidable';

export async function fileUpload(file, newFileName, dir = '') {

    try {
        if (file === "null" || !file) {
            return { type: 'warning', message: 'No file uploaded.' }
        }

        const uploadDir = path.join(process.cwd(), 'uploads')

        // Create a writable stream to save the uploaded file
        const filePath = path.join(uploadDir, newFileName);
        // Check if the file already exists
        if (fs.existsSync(filePath)) {
            console.log(`File already exists at ${filePath}, it will be replaced.`);
            // Optionally, delete the existing file before overwriting
            fs.unlinkSync(filePath);
        }

        const stream = fs.createWriteStream(filePath);

        // Convert file stream to a readable stream and pipe it to the file system
        const reader = file.stream().getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            stream.write(Buffer.from(value));
        }

        stream.end();

        return { type: 'success', message: 'Successfully uploaded' }
    } catch (err) {
        return { type: 'error', message: `An error occurred while uploading : ${err}` }
    }
}



export const uploadFileNew = async (file, newFileName, dir = '') => {
    if (file === "null" || !file) {
        return { type: 'warning', message: 'No file uploaded.' };
    }

    try {
        const uploadDir = path.join(process.cwd(), 'uploads', dir);

        const buffer = Buffer.from(await file.arrayBuffer());

        // Check if the directory exists and create it if it doesn't
        try {
            await fs.access(uploadDir);
        } catch (error) {
            // Directory doesn't exist, create it
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Write the file to the directory
        await fs.writeFile(path.resolve(uploadDir, newFileName), buffer);

        return { type: 'success', message: 'Successfully uploaded' };
    } catch (err) {
        return { type: 'error', message: `An error occurred while uploading: ${err.message}` };
    }
};


export const getFile = async (fileName, dir = "") => {
    if (fileName && fileName !== null) {
        const filePath = path.join(process.cwd(), 'uploads', dir, fileName)

        try {
            const image = await fs.readFile(filePath)
            const base64Image = Buffer.from(image).toString('base64');
            return { image: `data:image/png;base64,${base64Image}` };

        } catch (err) {
            return { type: 'error', message: `An error occurred while retrieving file from the server, ${err}` }
        }
    }

}