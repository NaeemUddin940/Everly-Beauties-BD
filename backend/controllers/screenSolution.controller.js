import fs from "fs";
import path from "path";
import ScreenSolution from "../models/screenSolution.model.js";

export const createScreenSolution = async (req, res) => {
  try {
    const { name, slug, description, isActive } = req.body;

    // ❌ Required fields
    if (!name || !slug || !description) {
      if (image) {
        fs.unlinkSync(
          path.join("uploads/screenSolutionImage/", image.filename)
        );
      }
      return res.status(400).json({
        success: false,
        message: "Screen Solution name, slug and description are required.",
      });
    }

    let image = null;
    if (req.file) {
      image = `/uploads/screenSolutionImage/${req.file.filename}`;
    }

    // ❌ Duplicate check
    const existingBrand = await ScreenSolution.findOne({
      $or: [{ name }, { slug }],
    });
    if (existingBrand) {
      if (image) {
        fs.unlinkSync(
          path.join("uploads/screenSolutionImage/", image.filename)
        );
      }

      return res.status(400).json({
        success: false,
        message:
          existingBrand.name === name
            ? `The Screen Solution name "${name}" already exists.`
            : `The slug "${slug}" already exists.`,
      });
    }

    // ✅ Create brand
    const newScreenSolution = await ScreenSolution.create({
      name,
      slug,
      description,
      image,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Screen Solution created successfully",
      newScreenSolution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllScreenSolutions = async (_, res) => {
  try {
    const allScreenSolution = await ScreenSolution.find().sort({
      createdAt: -1,
    });
    const activeScreenSolution = allScreenSolution.filter(
      (solution) => solution.isActive
    ).length;

    res.status(200).json({
      success: true,
      totalScreenSolutions: allScreenSolution.length,
      activeScreenSolution,
      allScreenSolution,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateScreenSolution = async (req, res) => {
  try {
    const { name, slug, description, isActive } = req.body;

    let image = null;
    const screenSolution = await ScreenSolution.findById(req.params.id);
    if (!screenSolution) {
      return res.status(404).json({
        success: false,
        message: "Screen Solution not found.",
      });
    }
    // Handle image upload
    if (req.file) {
      if (screenSolution.image) {
        const oldImagePath = path.join(process.cwd(), screenSolution.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      image = `/uploads/screenSolutionImage/${req.file.filename}`;
    } else {
      image = screenSolution.image;
    }

    // Update other fields
    // if (name) screenSolution.name = name;
    // if (slug) screenSolution.slug = slug;
    // if (description) screenSolution.description = description;
    // if (isActive !== undefined) screenSolution.isActive = isActive;

    // await screenSolution.save();

    const updateScreenSolution = await ScreenSolution.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        image,
        description,
        isActive,
      }
    );

    res.status(200).json({
      success: true,
      message: "Screen Solution updated successfully",
      updateScreenSolution,
    });
  } catch (error) {
    // Remove uploaded image on error
    if (req.file) {
      const uploadedPath = path.join(
        process.cwd(),
        `/uploads/screenSolutionImage/${req.file.filename}`
      );
      if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteScreenSolution = async (req, res) => {
  try {
    const screenSolution = await ScreenSolution.findById({
      _id: req.params.id,
    });
    if (!screenSolution) {
      return res.status(403).json({
        success: false,
        message: "Screen Solution Not Found.",
      });
    }
    if (screenSolution.image) {
      // mainCategories.image: "/uploads/mainCategoriesImage/abc123.jpg"
      const filePath = path.join(process.cwd(), screenSolution.image); // full path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    await ScreenSolution.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Screen Solution deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Delete Brand!",
    });
  }
};

export const getSingleScreenSolution = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }
    const singleSolution = await ScreenSolution.findById(req.params.id);
    res.status(201).json({
      success: true,
      singleSolution,
      message: "Successfull to Get Single Solution",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get Single Solution!",
    });
  }
};
