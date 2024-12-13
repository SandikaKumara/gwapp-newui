export const validateProfileForm = async (formData, id) => {
    const errors = []

    const firstName = formData.get('firstName');
    const imagePath = formData.get('imagePath')
    const file = formData.get("profileImage");

    if (!firstName) {
        errors.push('First Name is required.')
    }

    if (file.name) {
        const fileName = file.name
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
        const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            errors.push('Invalid file type found, allowed file extensions are JPG, JPEG, PNG and WEBP.')
        }

        const fileSize = file.size;
        if (fileSize > 2097152) {
            errors.push(`Image is too big, the allowed maximum size is 2MB while the current file size is ${fileSize / 1024 / 1024}MB`)
        }

    }

    return errors
}