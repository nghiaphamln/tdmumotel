class OwnerController {
    static managementRoom(req, res) {
        try {
            res.render('owner/managementRoom', { title: 'Quản lý phòng trọ', page_name: 'managementRoom', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }
}
module.exports = OwnerController;