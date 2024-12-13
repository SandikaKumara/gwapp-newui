

export const validateTicketForm = async (formData, id) => {
    const errors = []

    if (!formData.get('title')) errors.push("Title is required.")
    if (formData.get('title').length > 300) errors.push("Title should not be more than 300 characters.")
    if (!formData.get('content')) errors.push("Content is required.")
    if (formData.get('title').length > 2000) errors.push("Content should not be more than 2000 characters.")

    // check the file size

    return errors
}