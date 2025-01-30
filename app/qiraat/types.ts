export interface Resource {
  title: string;
  url: string;
}

export interface YouTubeVideo {
  title: string;
  url: string;
}

export interface Scholar {
  name: string;
  image: string;
  slug: string;
  description: string;
  earlyLife: string;
  didYouKnow: string[];
  transmission: {
    name: string;
    details: string;
  }[];
  resources: Resource[];
  youtubeVideos: YouTubeVideo[];
}