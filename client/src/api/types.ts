export interface PortfolioProfile {
  name: string;
  roles: string[];
  tagline: string;
  university: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  available: boolean;
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillGroup {
  label: string;
  color: string;
  icon: string;
  items: SkillItem[];
}

export interface Project {
  title: string;
  desc: string;
  image: string;
  tech: string[];
  features: string[];
  github: string;
  demo: string;
}

export interface ExperienceItem {
  type: string;
  title: string;
  org: string;
  period: string;
  desc: string;
}

export interface EducationItem {
  degree: string;
  college: string;
  university: string;
  cgpa: string;
  year: string;
}

export interface Certificate {
  title: string;
  org: string;
  year: string;
}

export interface Achievement {
  icon: string;
  title: string;
  desc: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  about: {
    summary: string;
    objective: string;
    strengths: string[];
    interests: string[];
    timeline: TimelineItem[];
  };
  skillGroups: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certificates: Certificate[];
  achievements: Achievement[];
  techStack: string[];
  githubUsername: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
