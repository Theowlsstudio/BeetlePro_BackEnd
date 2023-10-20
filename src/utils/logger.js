export const info = (...params) => {
    console.log(...params);
};

export const error = (...params) => {
    console.error(...params);
};

const logger = {
    info,
    error
}

export default logger;