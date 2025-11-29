export default (err, req, res, next) => {
   
    if (req.headersSent) {
        return next(err);
    }

    console.error(err); // For debugging (optional)

    const status = err.status || 500;

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
        status
       
    });
};
