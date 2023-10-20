function calculateTotalRating(reviews) {
    // Initialize variables to store the sum of ratings and the total number of ratings
    let totalRating = 0;
    let totalRatingsCount = 0;

    // Iterate through the array of orders
    for (const review of reviews) {
        if (review.rating !== undefined && !isNaN(review.rating)) {
            // Check if the 'rating' property exists and is a valid number
            totalRating += review.rating;
            totalRatingsCount++;
        }
    }

    // Calculate the average rating (totalRating / totalRatingsCount)
    const averageRating = totalRatingsCount > 0 ? totalRating / totalRatingsCount : 0;

    // Scale the average rating to a 5-star rating system (0 to 5)
    const scaledRating = (averageRating / 5) * 5;

    return scaledRating;
};

export default calculateTotalRating;