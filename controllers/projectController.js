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

    // Handle main image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      projectData.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    // Handle gallery images
    if (req.files?.gallery) {
      projectData.gallery = await Promise.all(
        req.files.gallery.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return {
            url: result.secure_url,
            public_id: result.public_id
          };
        })
      );
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
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    // Handle gallery images
    if (req.files?.gallery) {
      updateData.gallery = await Promise.all(
        req.files.gallery.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return {
            url: result.secure_url,
            public_id: result.public_id
          };
        })
      );
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