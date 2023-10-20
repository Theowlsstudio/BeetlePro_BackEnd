const withMethodGuard = (allowedMethod) => {
    return (req, res, next) => {
        try {

            console.log(req.body)

            let requestMethod = req.method;

            if (requestMethod === allowedMethod) {
                next();
                return;
            } else {
                return res.status(405).json({ error: 'Method Not Allowed', status: false });
            }

        } catch (error) {
            return res.status(error?.statusCode ?? 500).json({ msg: error?.message ?? "Interanal Server Error", status: false })
        }
    }
}

export default withMethodGuard;