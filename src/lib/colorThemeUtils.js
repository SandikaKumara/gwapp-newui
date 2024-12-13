export const refreshColorTheme = (updateColorTheme) => {
    // Fetch theme data from localStorage or other sources
    const savedTheme = localStorage.getItem("colorTheme");

    if (savedTheme) {
        // If a saved theme exists, parse and update it
        const { bgColor, textColor, textHoverColor, borderColor, categoryTextColor } = JSON.stringify(savedTheme)
        updateColorTheme(bgColor, textColor, textHoverColor, borderColor, categoryTextColor);

    } else {
        // Set default theme if no saved theme exists
        updateColorTheme("#0f0301", "#f5ebe9", "#b5290f", "#4a1107", "#ed8d7b")
    }
}


export const saveColorTheme = (theme) => {
    localStorage.setItem("colorTheme", JSON.stringify(theme))
}