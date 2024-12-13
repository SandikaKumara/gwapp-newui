'use server'

const validateNotificationForm = async (formData, id) => {
    const errors = []
    if (!formData.get('title')) errors.push("Title is required.")
    if (!formData.get('message')) errors.push("Message is required.")

    return errors;
}

export default validateNotificationForm