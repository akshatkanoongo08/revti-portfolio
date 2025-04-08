const Project = require('../models/Project');
const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
      const projectData = {
          title: req.body.title,
          description: req.body.description,
          categories: req.body.categories,
          client: req.body.client,
          task: req.body.task,
          role: req.body.role,
          date: req.body.date,
          categoryYear: req.body.categoryYear,
          liveSite: req.body.liveSite,
          projectLink: req.body.projectLink || '/portfolio-single'
      };

      // Handle main image
      if (req.file) {
          projectData.image = {
              url: req.file.path,
              public_id: req.file.filename
          };
      }

      // Handle gallery images
      if (req.files && req.files.length > 0) {
          projectData.gallery = req.files.map(file => ({
              url: file.path,
              public_id: file.filename
          }));
      }

      const project = new Project(projectData);
      const savedProject = await project.save();

      // Update category counts
      await updateCategoryCounts();

      res.status(201).json({
          success: true,
          data: savedProject
      });
  } catch (error) {
      res.status(400).json({
          success: false,
          message: error.message
      });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (req.file) {
      const oldProject = await Project.findById(id);
      if (oldProject.image && oldProject.image.public_id) {
        await cloudinary.uploader.destroy(oldProject.image.public_id);
      }
      
      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    if (req.files && req.files.length > 0) {
      const oldProject = await Project.findById(id);
      if (oldProject.gallery && oldProject.gallery.length > 0) {
        for (const image of oldProject.gallery) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }
      
      updateData.gallery = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await updateCategoryCounts();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a project
// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image from Cloudinary if it exists
    if (project.image && project.image.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    // Delete gallery images from Cloudinary if they exist
    if (project.gallery && project.gallery.length > 0) {
      for (const image of project.gallery) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    // Use findByIdAndDelete instead of remove()
    await Project.findByIdAndDelete(id);
    await updateCategoryCounts();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update category counts
async function updateCategoryCounts() {
  try {
    const projects = await Project.find();
    const categories = await Category.find();
    
    for (const category of categories) {
      const count = projects.filter(project => 
        project.categories.some(cat => 
          cat.toLowerCase().replace(/\s+/g, '-') === category.value
        )
      ).length;
      
      await Category.findByIdAndUpdate(category._id, { count });
    }
  } catch (error) {
    console.error('Error updating category counts:', error);
  }
}
// ... rest of the controller code ...