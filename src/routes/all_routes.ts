import express from 'express';
import {createUser,loginUser} from '../controllers/user_controller';
const router: express.Router = express.Router();

router.post('/api/v1/create-account', createUser)
router.post('/api/v1/login', loginUser)
// router.get('/api/v1/posts', controller.getPosts)
// router.get('/api/v1/posts/:id', controller.getPost)
// router.put('/api/v1/posts/:id', controller.updatePost)
// router.delete('/api/v1/posts/:id', controller.deletePost)


export default router;