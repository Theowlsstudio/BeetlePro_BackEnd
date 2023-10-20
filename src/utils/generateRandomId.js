function generateUniqueID(length) {
    const characters = 'A1B0CD1EF2G7H3IJ4KL5M8N6OP7QR8ST9U5V1WX2YZ';
    let uniqueID = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueID += characters.charAt(randomIndex);
    }
    return uniqueID;
}
const generateRandomId = () => { return generateUniqueID(Math.floor(Math.random() * 4) + 8); };

export default generateRandomId;