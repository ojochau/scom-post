export interface IAuthor {
  id: string;
  username: string;
  description: string;
  avatar: string;
  npub?: string;
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
  repost?: IAuthor;
  community?: ICommunity;
  actions?: IPostActions;
};
export interface IPostStats {
	replies?: number;
	reposts?: number;
  upvotes?: number; //likes
  downvotes?: number;
  views?: number;
	satszapped?: number;
};
export interface IPostActions {
	liked?: boolean;
	replied?: boolean;
	reposted?: boolean;
	zapped?: boolean;
}
export interface IPostData {
  module: string; //e.g. @scom/scom-markdown, @scom/scom-image, @scom/scom-video
  category?: "widget" | "quotedPost";
  data: any;
};
export interface ICommunity {
  communityUri?: string;
	creatorId?: string;
	communityId?: string;
}
export interface ILinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  og_tags?: string[][];
}
export interface IShopifyFrame {
  title: string;
  description?: string;
  image: string;
  price: string;
  currency?: string;
  url: string;
}