import Tag from "../models/tag.model.js";

export const createTag = async (req, res) => {
  try {
    const { name, slug, type, isActive } = req.body;

    if (!name || !slug) {
      return res.status(403).json({
        success: false,
        message: "Name And Slug is required.",
      });
    }

    const existingTag = await Tag.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingTag) {
      return res.status(403).json({
        success: false,
        message:
          existingTag.name === name
            ? `The Tag Name "${name}" is alreday exists`
            : `The Tag Slug "${slug}" is alreday exists`,
      });
    }

    if (type !== "standard" && type !== "featured") {
      return res.status(403).json({
        success: false,
        message: "Type Must be Standard or Featured",
      });
    }

    const newTag = await Tag.create({
      name,
      slug,
      isActive,
      type,
    });
    res
      .status(201)

      .json({ success: true, newTag, message: "Successfull to Create Tag" });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Create Tag!",
    });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { name, slug, type, isActive } = req.body;

    const findTag = await Tag.findById(req.params.id);
    if (!findTag) {
      return res.status(403).json({
        success: false,
        message: "Tag is not found.",
      });
    }

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, {
      name,
      slug,
      isActive,
      type,
    });
    res.status(201).json({
      success: true,
      updatedTag,
      message: "Successfull to Update Tag",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Update Tag!",
    });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const isExist = await Tag.findById(req.params.id);
    if (!isExist) {
      return res.status(403).json({
        success: false,
        message: "Tag is not Found.",
      });
    }

    await Tag.findByIdAndDelete(req.params.id);
    res
      .status(201)
      .json({ success: true, message: "Successfull to Delete Tag" });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Delete Tag!",
    });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find();
    if (allTags.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Tag is Not Found.",
      });
    }
    res.status(201).json({
      success: true,
      totalTags: allTags.length,
      activeTags: allTags.filter((tag) => tag.isActive).length,
      allTags,
      message: "Successfull to Get All Tags",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get All Tags!",
    });
  }
};

export const searchTag = async (req, res) => {
  try {
    const { name = "", slug = "" } = req.query;

    const searchTag = await Tag.find({
      name: { $regex: name, $options: "i" },
      slug: { $regex: slug, $options: "i" },
    }).lean();

    if (searchTag.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Search Result Not Found.",
      });
    }

    res.status(200).json({
      success: true,
      searchTag,
      message: "Successfully searched tag",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getSingleTag = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }
    const singleTag = await Tag.findById(req.params.id);
    res.status(201).json({
      success: true,
      singleTag,
      message: "Successfull to Get Single Tag",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get Single tag!",
    });
  }
};
