export interface IAuthor {
  id: string;
  username: string;
  description: string;
  avatar: string;
  pubKey?: string;
  displayName?: string;
  internetIdentifier: string;
};
export interface IPost {
  id: string;
	author: IAuthor;
	parentAuthor?: IAuthor; //whom this post is replying to
	publishDate: Date | string;
	stats?: IPostStats;
	contentElements: IPostData[];
};
export interface IPostStats {
	replies?: number;
	reposts?: number;
  upvotes?: number; //likes
  downvotes?: number;
  views?: number;
};
export interface IPostData {
  module: string; //e.g. @scom/scom-markdown, @scom/scom-image, @scom/scom-video
  category?: "widget" | "quotedPost";
  data: any;
};
