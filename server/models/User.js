import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ==============================
    // BASIC INFORMATION
    // ==============================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // ==============================
    // ROLE
    // ==============================

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    // ==============================
    // ACCOUNT VERIFICATION
    // ==============================

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // PROFILE
    // ==============================

    profile: {
      phone: {
        type: String,
        trim: true,
      },

      profileImage: {
        type: String,
        default: "",
      },

      bio: {
        type: String,
        maxlength: 500,
        default: "",
      },

      location: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },
    },

    // ==============================
    // LAST LOGIN
    // ==============================

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// PASSWORD HASHING
// ==========================================

userSchema.pre("save", async function () {
  // Password change nahi hua
  // to dobara hash nahi karna
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// PASSWORD COMPARE METHOD
// ==========================================

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
