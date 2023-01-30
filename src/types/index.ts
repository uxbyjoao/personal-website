export interface IMetaHead {
  title: string;
  description: string;
  ogImageUrl: string;
}

export interface IHeroProps {
  name: string;
  about: string;
}

export interface IExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  skills: string[];
}

export interface IExperiences {
  title: string;
  details: IExperience[];
}

export interface IEducation {
  institution: string;
  location: string;
  endDate: string;
  description: string[];
}

export interface IEducations {
  title: string;
  details: IEducation[];
}

export interface ISocialMedia {
  name: string;
  icon: string;
  url: string;
}
