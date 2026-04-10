const express = require('express');
const { getUsers, getStats, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and require super_admin role
router.use(protect);
router.use(authorize('super_admin'));

router.get('/users', getUsers);
router.get('/stats', getStats);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
