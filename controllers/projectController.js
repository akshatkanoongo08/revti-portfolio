const Project = require('../models/Project');
const Category = require('../models/Category');
const path = require('path');
const cloudinary = require('cloudinary').v2;

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('categories');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('categories');
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
        let categoryValues = req.body.categories;
        if (typeof categoryValues === 'string') {
          try {
            categoryValues = JSON.parse(categoryValues);
          } catch (e) {
            categoryValues = categoryValues.split(',').map(cat => cat.trim());
          }
        }
        if (!Array.isArray(categoryValues)) {
          categoryValues = [categoryValues];
        }

        if (categoryValues.length === 0) {
          console.error('400 error: No categories provided');
          return res.status(400).json({ message: 'At least one category is required' });
        }

        // Map to ObjectIds
        const mongoose = require('mongoose');
        categories = await Promise.all(categoryValues.map(async (catValue) => {
          let category = null;
          // Try to find by value first
          category = await Category.findOne({ value: catValue.trim() });
          // If not found, try by _id (ObjectId)
          if (!category && mongoose.Types.ObjectId.isValid(catValue.trim())) {
            category = await Category.findById(catValue.trim());
          }
          if (!category) throw new Error(`Category "${catValue}" not found`);
          return category._id;
        }));
      } catch (err) {
        console.error('400 error: Invalid categories:', err.message);
        return res.status(400).json({ message: `Invalid categories: ${err.message}` });
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
      projectLink: req.body.projectLink || '/portfolio-single',
      pdfUrl: req.body.pdfUrl || ''
    };

    // Handle optional PDF upload
    const pdfFile = req.files?.pdf?.[0];
    if (pdfFile) {
      projectData.pdf = {
        url: typeof pdfFile.path === 'string' ? pdfFile.path : (pdfFile.path?.toString ? pdfFile.path.toString() : ''),
        public_id: pdfFile.filename
      };
    }

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
    } else {
      projectData.gallery = [];
    }
    console.log('projectData.gallery:', projectData.gallery);

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
          categories = await Promise.all(categories.map(async (catValue) => {
            const category = await Category.findOne({ value: catValue.trim() });
            if (!category) {
              throw new Error(`Category "${catValue}" not found`);
            }
            return category._id;
          }));
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
      role: role || [],
      pdfUrl: req.body.pdfUrl || ''
    };

    // Handle optional PDF upload
    const pdfFile = req.files?.pdf?.[0];
    if (pdfFile) {
      updateData.pdf = {
        url: typeof pdfFile.path === 'string' ? pdfFile.path : (pdfFile.path?.toString ? pdfFile.path.toString() : ''),
        public_id: pdfFile.filename
      };
    }

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