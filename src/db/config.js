const config = {
    PORT : process.env.PORT || 3000,
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_USER : process.env.DB_USER || 'root',
    DB_PASS : process.env.DB_PASS || '123456',
    DB_PORT : process.env.DB_PORT || 3307,
    DB_NAME : process.env.DB_NAME || 'kinesiologia_db'
};

module.exports = config;