export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  label?: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface HeaderData {
  navItems: NavItem[];
}

export interface HeroData {
  name: string;
  roles: string[];
  bgImage: string;
  socialLinks: SocialLink[];
}

export interface InfoGridItem {
  id: string;
  label: string;
  value: string;
}

export interface AboutData {
  sectionTitle: string;
  sectionDesc?: string;
  profileImg: string;
  title: string;
  italicText?: string;
  bioText?: string;
  infoGrid: InfoGridItem[];
}

export interface StatItem {
  id: string;
  iconName: string;
  target: number;
  label: string;
}

export interface StatsData {
  enabled?: boolean;
  items: StatItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
}

export interface SkillsData {
  sectionTitle: string;
  sectionDesc?: string;
  itemsLeft: SkillItem[];
  itemsRight: SkillItem[];
}

export interface ResumeSummary {
  name: string;
  desc: string;
  location?: string;
  phone?: string;
  email?: string;
}

export interface ResumeEduItem {
  id: string;
  degree: string;
  period: string;
  institution: string;
  description: string;
}

export interface ResumeExpItem {
  id: string;
  title: string;
  period: string;
  company: string;
  bullets: string[];
}

export interface ResumeData {
  sectionTitle: string;
  sectionDesc?: string;
  summary: ResumeSummary;
  education: ResumeEduItem[];
  experience: ResumeExpItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category:
    | "app"
    | "web"
    | "design"
    | "article"
    | "publication"
    | "illustration"
    | "video_edit"
    | "video-edit"
    | "service"
    | "competition"
    | "research"
    | "record"
    | string;
  categoryLabel: string;
  image: string;
  client?: string;
  date?: string;
  projectUrl?: string;
  description?: string;
  additionalImages?: string[];
}

export interface PortfolioData {
  sectionTitle: string;
  sectionDesc?: string;
  items: PortfolioItem[];
}

export interface CertificateItem {
  id: string;
  title: string; // Nama Certificate
  image?: string; // Foto Certificate (skala 4:3)
  description?: string; // Deskripsi Ringkas
  iconName?: string;
  fullDetails?: string;
  features?: string[];
}

export type ServiceItem = CertificateItem;

export interface CertificateData {
  sectionTitle: string;
  sectionDesc?: string;
  items: CertificateItem[];
}

export type ServicesData = CertificateData;


export interface ContactData {
  sectionTitle: string;
  sectionDesc?: string;
  address?: string;
  phone?: string;
  email?: string;
  submitButtonText?: string;
  formspreeUrl?: string;
}

export interface FooterData {
  name?: string;
  bioText?: string;
  copyrightName?: string;
  copyrightText?: string;
  socialLinks: SocialLink[];
}

export interface ThemeColors {
  accentColor: string;
  headingColor: string;
  textColor: string;
  backgroundColor: string;
  cardBgColor: string;
  cardTextColor: string;
}

export interface SiteData {
  theme: ThemeColors;
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  stats: StatsData;
  skills: SkillsData;
  resume: ResumeData;
  portfolio: PortfolioData;
  services: ServicesData;
  contact: ContactData;
  footer: FooterData;
}
