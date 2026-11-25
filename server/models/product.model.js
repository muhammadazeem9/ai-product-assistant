import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    features: {
      type: [String],
      default: [],
    },

    seoTitle: {
      type: String,
      trim: true,
      default: "",
    },

    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    primaryKeyword: {
      type: String,
      trim: true,
      default: "",
    },

    relatedKeywords: {
      type: [String],
      default: [],
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    faqs: {
      type: [
        {
          _id: false,
          question: {
            type: String,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },

    imageAltText: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "approved", "rejected"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
