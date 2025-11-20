import fs from "fs";
import path from "path";
import ScreenSolution from "../models/screenSolution.model.js";

export const createScreenSolution = async (req, res) => {
  try {
    const { name, slug, description, isActive } = req.body;

    // File name (if uploaded)
    const uploadedFile = req.file ? req.file.filename : null;

    // ❌ Required fields
    if (!name || !slug || !description) {
      // Delete uploaded image if exists
      if (uploadedFile) {
        fs.unlinkSync(path.join("uploads/screenSolutionImage/", uploadedFile));
      }

      return res.status(400).json({
        success: false,
        message: "Name, slug and description are required.",
      });
    }

    // ❌ Duplicate check
    const existingScreenSolution = await ScreenSolution.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingScreenSolution) {
      // delete uploaded image
      if (uploadedFile) {
        fs.unlinkSync(path.join("uploads/screenSolutionImage/", uploadedFile));
      }

      return res.status(400).json({
        success: false,
        message:
          existingScreenSolution.name === name
            ? `The Screen Solution name "${name}" already exists.`
            : `The slug "${slug}" already exists.`,
      });
    }

    // Prepare image path
    const image = uploadedFile
      ? `/uploads/screenSolutionImage/${uploadedFile}`
      : null;

    // ✅ Create Screen Solution
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
    console.log(error);
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

    // Validate: At least one field must be provided
    if (!name && !slug && !description && isActive === undefined && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No update field provided.",
      });
    }

    // Find by ID
    const screenSolution = await ScreenSolution.findById(req.params.id);
    if (!screenSolution) {
      return res.status(404).json({
        success: false,
        message: "Screen Solution not found.",
      });
    }

    const uploadedFile = req.file ? req.file.filename : null;

    // ❌ Duplicate check (excluding current ID)
    if (name || slug) {
      const duplicate = await ScreenSolution.findOne({
        _id: { $ne: req.params.id },
        $or: [{ name }, { slug }],
      });

      if (duplicate) {
        // Delete uploaded new image (if any)
        if (uploadedFile) {
          fs.unlinkSync(
            path.join("uploads/screenSolutionImage/", uploadedFile)
          );
        }

        return res.status(400).json({
          success: false,
          message:
            duplicate.name === name
              ? `The name "${name}" already exists.`
              : `The slug "${slug}" already exists.`,
        });
      }
    }

    // Handle new image upload
    let newImage = screenSolution.image;

    if (uploadedFile) {
      // Delete old image if exists
      if (screenSolution.image) {
        const oldPath = path.join(
          "uploads/screenSolutionImage/",
          path.basename(screenSolution.image)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      newImage = `/uploads/screenSolutionImage/${uploadedFile}`;
    }

    // Prepare update object dynamically
    const updateData = {
      name: name || screenSolution.name,
      slug: slug || screenSolution.slug,
      description: description || screenSolution.description,
      isActive: isActive ?? screenSolution.isActive,
      image: newImage,
    };

    // Update with {new: true}
    const updated = await ScreenSolution.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Screen Solution updated successfully",
      data: updated,
    });
  } catch (error) {
    // Delete uploaded image on error
    if (req.file) {
      const newFile = path.join(
        "uploads/screenSolutionImage/",
        req.file.filename
      );
      if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
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
