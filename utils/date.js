module.exports = {
    // For blog posts
    formatDate: (date) => `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`,
    
    // For comments
    formatDateAndTime: (date) => `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()} &ndash; ${new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
}