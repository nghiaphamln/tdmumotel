class AdminController {
    static qlbaidang(req, res) {
        try {
            res.render('admin/qlbaidang', { title: 'Quản lý bài đăng', page_name: 'qlbaidang' ,user: req.user});
        } catch {
            res.status(500).send(exception);
        }
    }
    static qlthanhvien(req, res) {
        try {
            res.render('admin/qlthanhvien', { title: 'Quản lý thành viên', page_name: 'qlthanhvien', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }
}
module.exports = AdminController;