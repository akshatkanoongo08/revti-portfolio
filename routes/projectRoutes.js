const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { singleUpload, multipleUpload } = require('../middleware/uploadMiddleware');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes with image upload
router.post('/', protect, singleUpload, createProject);
router.put('/:id', protect, singleUpload, updateProject);
router.delete('/:id', protect, deleteProject);

// Route for updating gallery images
router.put('/:id/gallery', protect, multipleUpload, updateProject);

module.exports = router;