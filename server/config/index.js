const config = {
    dbUri: process.env.DB_URL || "mongodb://db:27017/garage",
    jwtSecret: process.env.JWT_SECRET || "somesecretnooneknows!"
};

module.exports = config