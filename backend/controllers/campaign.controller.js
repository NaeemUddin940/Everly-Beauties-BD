import Campaign from "../models/campaign.model.js";

export const createCampaign = async (req, res) => {
  const { campaignName,discountType,discountAmount, permalink,startDate, endDate, thumbnailImage } = req.body;
  try {
    if (!campaignName || !permalink || !endDate || !thumbnailImage) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const campaign = new Campaign({
      campaignName,
      permalink,
      endDate,
      thumbnailImage,
    });

    await campaign.save();
    res.status(201).json({
      success: true,
      campaign,
      message: "Successfull to Create Campaign",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Creat Campain!",
    });
  }
};

export const GetAllCampaign = async (req, res) => {
  try {
    const allcampaign = await Campaign.find();
    res.status(201).json({
      success: true,
      count: allcampaign.length,
      allcampaign,
      message: "Successfull to Get All Campaign",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get All Campaign!",
    });
  }
};

export const editCampaign = async (req, res) => {
  try {
    const { campaignName, permalink, endDate, thumbnailImage } = req.body;
    const existingCampaign = await Campaign.findById(req.params.id);
    if (!existingCampaign) {
      return res.status(403).json({
        success: false,
        message: "Campaign Not Found!",
      });
    }

    const updateCampaign = await Campaign.findByIdAndUpdate(req.params.id, {
      campaignName,
      permalink,
      endDate,
      thumbnailImage,
    });
    res.status(201).json({
      success: true,
      updateCampaign,
      message: "Successfull to Edit Campaign",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Edit Campaign!",
    });
  }
};
