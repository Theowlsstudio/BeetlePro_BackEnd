import cache from "memory-cache";
function cacheMiddleware(duration) {
    return (req, res, next) => {
        const key = `__express__${req.originalUrl || req.url}`;
        const cachedData = cache.get(key);

        if (cachedData) {
            // If data is found in cache, send it as the response
            res.send(cachedData);
        } else {
            // If data is not found in cache, continue with the route handler
            res.originalSend = res.send;
            res.send = (body) => {
                cache.put(key, body, duration * 1000); // Cache the response for the specified duration in seconds
                res.originalSend(body);
            };
            next();
        }
    };
};

export default cacheMiddleware;