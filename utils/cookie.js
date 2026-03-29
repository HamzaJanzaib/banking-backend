const setAccessTokenCookie = (res, token) => {
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
};

const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

const setTokenCookies = (res, accessToken, refreshToken) => {
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
};

const clearTokenCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

module.exports = { setAccessTokenCookie, setRefreshTokenCookie, setTokenCookies, clearTokenCookies };
