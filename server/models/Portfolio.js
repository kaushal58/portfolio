import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    profile: {
      name: String,
      roles: [String],
      tagline: String,
      university: String,
      bio: String,
      github: String,
      linkedin: String,
      email: String,
      phone: String,
      location: String,
      profileImage: String,
      available: Boolean,
    },
    about: {
      summary: String,
      objective: String,
      strengths: [String],
      interests: [String],
      timeline: [
        new mongoose.Schema(
          {
            year: String,
            title: String,
            desc: String,
          },
          { _id: false },
        ),
      ],
    },
    skillGroups: [
      new mongoose.Schema(
        {
          label: String,
          color: String,
          icon: String,
          items: [new mongoose.Schema({ name: String, level: Number }, { _id: false })],
        },
        { _id: false },
      ),
    ],
    projects: [
      new mongoose.Schema(
        {
          title: String,
          desc: String,
          image: String,
          tech: [String],
          features: [String],
          github: String,
          demo: String,
        },
        { _id: false },
      ),
    ],
    experience: [
      new mongoose.Schema(
        {
          type: String,
          title: String,
          org: String,
          period: String,
          desc: String,
        },
        { _id: false },
      ),
    ],
    education: [
      new mongoose.Schema(
        {
          degree: String,
          college: String,
          university: String,
          cgpa: String,
          year: String,
        },
        { _id: false },
      ),
    ],
    certificates: [
      new mongoose.Schema(
        {
          title: String,
          org: String,
          year: String,
        },
        { _id: false },
      ),
    ],
    achievements: [
      new mongoose.Schema(
        {
          icon: String,
          title: String,
          desc: String,
        },
        { _id: false },
      ),
    ],
    techStack: [String],
    githubUsername: String,
  },
  { timestamps: true },
);

export default mongoose.model("Portfolio", portfolioSchema);
