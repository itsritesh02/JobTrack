import User from "../models/User.js";

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      bio,
      location,
      skills,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    if (name !== undefined) {
      user.name = name;
    }

    // ==========================================
    // PROFILE INFORMATION
    // ==========================================

    if (phone !== undefined) {
      user.profile.phone = phone;
    }

    if (bio !== undefined) {
      user.profile.bio = bio;
    }

    if (location !== undefined) {
      user.profile.location = location;
    }

    if (skills !== undefined) {
      user.profile.skills = skills;
    }

    if (profileImage !== undefined) {
      user.profile.profileImage = profileImage;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};