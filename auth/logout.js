const logout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwtRT) return res.sendStatus(204);

    res.clearCookie("jwtRT", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    }).stats(200).json({
        code: 200,
        msg: "logout_successfully"
    });
};

module.exports = {
    logout,
};
