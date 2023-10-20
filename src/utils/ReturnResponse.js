function handleResponse(res, data, status) {
    return res.status(status).json({ ...data, status: status === 200 ? true : false })
};

export default handleResponse;