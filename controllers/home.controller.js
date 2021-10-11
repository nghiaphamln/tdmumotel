class HomeController {
    static index (req, res) {
        try {
            res.render('index', {title: 'Trang chủ', page_name: 'index'});
        } catch (exception) {
            res.status(500).send(exception);
        }
    }

    static login (req, res) {
        try {
            res.render('login', {title: 'Đăng nhập', page_name: 'login'});
        } catch (exception) {
            res.status(500).send(exception);
        }
    }
    
    static about (req, res) {
        try {
            res.render('about', {title: 'Giới thiệu', page_name: 'about'});
        } catch {
            res.status(500).send(exception);
        }
    }
}


module.exports = HomeController;
