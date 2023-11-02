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
	replyTo?: IPost;
	quotedPosts?: IPost[];
	publishDate: Date | string;
	stat?: IPostStat;
	data: IPostData[];
};
export interface IPostStat{
  reply?: number;
  repost?: number;
  upvote?: number; //like
  downvote?: number;
  view?: number;
};
export interface IPostData {
  module: string; //e.g. @scom/scom-markdown, @scom/scom-image, @scom/scom-video
  data: any;
};
