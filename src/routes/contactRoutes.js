const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.getAllContacts);
router.post('/', contactController.createContact);
router.delete('/:id', contactController.deleteContact);
router.post('/:id/respond', contactController.respondToContact);
router.get('/track/:code', contactController.getByTrackingCode);

module.exports = router;