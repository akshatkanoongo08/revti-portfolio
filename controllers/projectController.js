const Project = require('../models/Project');
const Category = require('../models/Category');
const path = require('path');
const cloudinary = require('cloudinary').v2;

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
    console.log('FILES:', req.files);
    // Parse and validate categories
    let categories = [];
    
    if (req.body.categories) {
      try {
        // Try parsing as JSON first
        categories = typeof req.body.categories === 'string' 
          ? JSON.parse(req.body.categories) 
          : req.body.categories;
        
        // Ensure it's an array
        if (!Array.isArray(categories)) {
          categories = categories.split(',').map(cat => cat.trim());
        }
        
        // Validate at least one category
        if (categories.length === 0) {
          return res.status(400).json({ message: 'At least one category is required' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid categories format' });
      }
    }
    
    // Parse categories and role if they're strings
    let role = req.body.role;

    if (typeof role === 'string') {
      try {
        role = JSON.parse(role);
      } catch (e) {
        role = role.split(',').map(r => r.trim());
      }
    }

    const projectData = {
      title: req.body.title,
      description: req.body.description,
      categories: categories || [],
      client: req.body.client,
      task: req.body.task,
      role: role || [],
      date: req.body.date,
      categoryYear: req.body.categoryYear,
      liveSite: req.body.liveSite,
      projectLink: req.body.projectLink || '/portfolio-single'
    };

    // Debug: log files and body
    console.log('FILES:', req.files);
    console.log('BODY:', req.body);

    // Handle main image
    const imageFile = req.files?.image?.[0];
if (imageFile) {
  console.log('imageFile:', imageFile);
  console.log('imageFile.path:', imageFile.path, typeof imageFile.path);
  projectData.image = {
    url: typeof imageFile.path === 'string' ? imageFile.path : (imageFile.path?.toString ? imageFile.path.toString() : ''),
    public_id: imageFile.filename
  };
}

    // Handle gallery images
    const galleryFiles = req.files?.gallery || [];
    if (galleryFiles.length > 0) {
      projectData.gallery = galleryFiles.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const project = new Project(projectData);
    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      data: savedProject
    });
  } catch (error) {
    console.error('Project creation error:', error);
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

    // Parse and validate categories
    let categories = [];
    
    if (req.body.categories) {
      try {
        // Try parsing as JSON first
        categories = typeof req.body.categories === 'string' 
          ? JSON.parse(req.body.categories) 
          : req.body.categories;
        
        // Ensure it's an array
        if (!Array.isArray(categories)) {
          categories = categories.split(',').map(cat => cat.trim());
        }
        
        // Validate at least one category
        if (categories.length === 0) {
          return res.status(400).json({ message: 'At least one category is required' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid categories format' });
      }
    }
    
    // Parse categories and role if they're strings
    let role = req.body.role;

    if (typeof role === 'string') {
      try {
        role = JSON.parse(role);
      } catch (e) {
        role = role.split(',').map(r => r.trim());
      }
    }

    const updateData = {
      ...req.body,
      categories: categories || [],
      role: role || []
    };

    // Handle main image
        // Handle main image
    const imageFile = req.files?.image?.[0];
    if (imageFile) {
      projectData.image = {
        url: imageFile.path,
        public_id: imageFile.filename
      };
    }

    // Handle gallery images
    const galleryFiles = req.files?.gallery || [];
    if (galleryFiles.length > 0) {
      projectData.gallery = galleryFiles.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }    

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Project update error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Project deletion error:', error);
    res.status(500).json({ message: error.message });
  }
};