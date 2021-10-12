class HomeController {
    static index (req, res) {
        try {
            res.render('index', {title: 'Trang chủ', page_name: 'index', user: req.user});
        } catch (exception) {
            res.status(500).send(exception);
        }
    }

    static login (req, res) {
        try {
            res.render('login', {title: 'Đăng nhập', page_name: 'login', messages: req.flash('loginMessage')});
        } catch (exception) {
            res.status(500).send(exception);
        }
    }

    static about (req, res) {
        try {
            res.render('about', {title: 'Giới thiệu', page_name: 'about', user: req.user});
        } catch {
            res.status(500).send(exception);
        }
    }

    static register (req, res) {
        try {
            res.render('register', {title: 'Đăng ký', page_name: 'register', messages: req.flash('signupMessage')});
        } catch {
            res.status(500).send(exception);
        }
    }
}


module.exports = HomeController;
