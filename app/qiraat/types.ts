export interface Resource {
  title: string;
  description: string;
  link: string;
}

export interface YouTubeVideo {
  title: string;
  description: string;
  videoId: string;
}

export interface Scholar {
  name: string;
  description: string;
  image: string;
  transmission: string[];
  resources: Resource[];
  youtubeVideos: YouTubeVideo[];
  facts: string[];
}
