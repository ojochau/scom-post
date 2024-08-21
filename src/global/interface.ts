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
  isPublicPost?: boolean;
  isLocked?: boolean;
  isSubscription?: boolean;
};
export interface IPostStats {
	replies?: number;
	reposts?: number;
  upvotes?: number; //likes
  downvotes?: number;
  views?: number;
	satszapped?: number;
  status?: string;
};
export interface IPostActions {
	liked?: boolean;
	replied?: boolean;
	reposted?: boolean;
	zapped?: boolean;
  bookmarked?: boolean;
}
export interface IPostData {
  module: string; //e.g. @scom/scom-markdown, @scom/scom-image, @scom/scom-video
  category?: "widget" | "quotedPost";
  data: any;
};
enum ProtectedMembershipPolicyType {
	TokenExclusive = 'TokenExclusive',
	Whitelist = 'Whitelist'
}
enum TokenType {
	ERC20 = 'ERC20',
	ERC721	= 'ERC721',
	ERC1155	= 'ERC1155'
}
export enum PaymentModel {
	OneTimePurchase = 'OneTimePurchase',
	Subscription = 'Subscription'
}
interface IProtectedMembershipPolicy {
	policyType: ProtectedMembershipPolicyType;
	paymentModel?: PaymentModel;
	chainId?: number;
	tokenAddress?: string;
	tokenType?: TokenType;
	tokenId?: number;
	tokenAmount?: string;
	currency?: string;
	durationInDays?: number;
	memberIds?: string[];
}
export interface ICommunity {
  communityUri?: string;
	creatorId?: string;
	communityId?: string;
	privateRelay?: string;
	parentCommunityUri?: string;
	isExclusive?: boolean;
	isWhitelist?: boolean;
	policies?: IProtectedMembershipPolicy[];
}
export interface ILinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  og_tags?: string[][];
  fc_tags?: string[][]; // farcaster frame
  sc_tags?: string[][];
}
export interface IShopifyFrame {
  title: string;
  description?: string;
  image: string;
  price: string;
  currency?: string;
  url: string;
}
type FrameButtonActionType = 'post' | 'post_redirect' | 'link' | 'mint' | 'tx';
export interface IFrameButton {
  action: FrameButtonActionType;
  caption: string;
  target?: string;
  post_url?: string;
}
export interface IFarcasterFrame {
  image: string;
  post_url?: string;
  buttons?: IFrameButton[];
  input_text?: string;
  aspect_ratio?: string;
  state?: string;
  url: string;
}