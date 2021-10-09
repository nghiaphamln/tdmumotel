class HomeController {
    static index (req, res) {
        try {
            res.render('index', {title: 'Trang chủ'});
        } catch (exception) {
            res.status(500).send(exception);
        }
    }
    static login (req, res) {
        try {
            res.render('login', {title: 'Đăng nhập'});
        } catch (exception) {
            res.status(500).send(exception);
        }
    }
}


module.exports = HomeController;
