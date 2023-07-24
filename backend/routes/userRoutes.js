import express from 'express';
import { authUser, getUserProfile, logoutUser, registerUser, updateUserProfile, verifyUser } from '../controllers/userController.js';
const router = express.Router();
import { protect } from '../middlewares/authMiddleware.js';

router.post('/', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.get('/confirm/:confirmationCode', verifyUser)

export default router;