const config = {
    dbUri: process.env.DB_URL || "mongodb://localhost:27017/garage",
    jwtSecret: process.env.JWT_SECRET || "somesecretnooneknows!",
    refreshSecret: process.env.REFRESH_SECRET || "somesecretnooneknows!",
};

module.exports = config