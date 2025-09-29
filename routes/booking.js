var express = require('express');
var router = express.Router();
var Booking = require('../controllers/booking.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee']),Booking.getAll);
router.get('/byref/:refnumber',Auth(['employee']),Booking.getByRefNumber);
router.get('/byId/bookingId',Auth(['employee']),Booking.getById);
router.post('/range',Auth(['employee']),Booking.getOnRange);
router.get('/slip/:id', Auth(['employee']), async (req, res) => {
    try {
        const booking = await require('../models/booking.model').Booking.findById(req.params.id);
        if (!booking || !booking.slip) {
            return res.status(404).send({ message: 'Slip not found' });
        }
        // ส่งไฟล์ slip กลับไป
        res.sendFile(booking.slip, { root: '.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
// เพิ่ม route สำหรับเพิ่ม, แก้ไข, ลบ booking
router.post('/', Auth(['employee']), Booking.create); // เพิ่ม booking
router.patch('/:bookingId', Auth(['employee']), Booking.update); // แก้ไข booking
router.delete('/:bookingId', Auth(['employee']), Booking.delete); // ลบ booking

module.exports = router;