class NotFoundError extends Error { }
class AuthenticationError extends Error { }

function handleError(error) {
    let errorMessage;
    let statusCode;

    if (error instanceof Error) {
        if (error instanceof NotFoundError) {
            errorMessage = "Resource not found.";
            statusCode = 404;
        } else if (error instanceof AuthenticationError) {
            errorMessage = "Authentication failed.";
            statusCode = 401;
        } else {
            errorMessage = "An unexpected error occurred.";
            statusCode = 500;
        }
    } else {
        errorMessage = "An unknown error occurred.";
        statusCode = 500;
    }

    return {
        statusCode,
        body: JSON.stringify({ error: errorMessage }),
    };
};

export default handleError;