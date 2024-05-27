/// <amd-module name="@scom/scom-post/global/interface.ts" />
declare module "@scom/scom-post/global/interface.ts" {
    export interface IAuthor {
        id: string;
        username: string;
        description: string;
        avatar: string;
        npub?: string;
        displayName?: string;
        internetIdentifier: string;
    }
    export interface IPost {
        id: string;
        author: IAuthor;
        parentAuthor?: IAuthor;
        publishDate: Date | string;
        stats?: IPostStats;
        contentElements: IPostData[];
        repost?: IAuthor;
        community?: ICommunity;
        actions?: IPostActions;
    }
    export interface IPostStats {
        replies?: number;
        reposts?: number;
        upvotes?: number;
        downvotes?: number;
        views?: number;
        satszapped?: number;
    }
    export interface IPostActions {
        liked?: boolean;
        replied?: boolean;
        reposted?: boolean;
        zapped?: boolean;
    }
    export interface IPostData {
        module: string;
        category?: "widget" | "quotedPost";
        data: any;
    }
    export interface ICommunity {
        communityUri?: string;
        creatorId?: string;
        communityId?: string;
    }
}
/// <amd-module name="@scom/scom-post/store/index.ts" />
declare module "@scom/scom-post/store/index.ts" {
    export const state: {
        ipfsGatewayUrl: string;
    };
    export const setDataFromJson: (options: any) => void;
    export const setIPFSGatewayUrl: (url: string) => void;
    export const getIPFSGatewayUrl: () => string;
}
/// <amd-module name="@scom/scom-post/global/utils.ts" />
declare module "@scom/scom-post/global/utils.ts" {
    const getImageIpfsUrl: (url: string) => string;
    const formatNumber: (value: number | string, decimal?: number) => string;
    const getDuration: (date: Date | string) => string;
    export { getImageIpfsUrl, formatNumber, getDuration };
}
/// <amd-module name="@scom/scom-post/global/index.ts" />
declare module "@scom/scom-post/global/index.ts" {
    import { Control } from '@ijstech/components';
    import { IPostData } from "@scom/scom-post/global/interface.ts";
    export * from "@scom/scom-post/global/utils.ts";
    export * from "@scom/scom-post/global/interface.ts";
    export const MAX_HEIGHT = 352;
    export const getEmbedElement: (postData: IPostData, parent: Control, callback?: any) => Promise<any>;
}
/// <amd-module name="@scom/scom-post/index.css.ts" />
declare module "@scom/scom-post/index.css.ts" {
    export const getIconStyleClass: (color: string) => string;
    export const hoverStyle: string;
    export const ellipsisStyle: string;
    export const maxHeightStyle: string;
    export const customLinkStyle: string;
    export const cardContentStyle: string;
}
/// <amd-module name="@scom/scom-post/assets.ts" />
declare module "@scom/scom-post/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-post/components/index.css.ts" />
declare module "@scom/scom-post/components/index.css.ts" {
    export const tooltipStyle: string;
}
/// <amd-module name="@scom/scom-post/components/bubbleMenu.tsx" />
declare module "@scom/scom-post/components/bubbleMenu.tsx" {
    import { Control, ControlElement, Module } from '@ijstech/components';
    interface ScomPostBubbleMenuElement extends ControlElement {
        items?: IItem[];
    }
    interface IItem {
        icon: any;
        tooltipText?: string;
        onClick?: (target: Control, event: Event) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-post--bubble-menu']: ScomPostBubbleMenuElement;
            }
        }
    }
    export class ScomPostBubbleMenu extends Module {
        private pnlItems;
        private _items;
        get items(): IItem[];
        set items(value: IItem[]);
        setData(items: IItem[]): void;
        getData(): IItem[];
        renderUI(): void;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-post" />
declare module "@scom/scom-post" {
    import { ControlElement, Module, Container, Control, VStack } from '@ijstech/components';
    import { IPost, IPostData, IPostStats, IAuthor } from "@scom/scom-post/global/index.ts";
    export { IPost, IPostData, IPostStats, IAuthor };
    interface ScomPostElement extends ControlElement {
        data?: IPost;
        type?: PostType;
        isActive?: boolean;
        onReplyClicked?: callbackType;
        onZapClicked?: callbackType;
        onLikeClicked?: (target: ScomPost, event?: MouseEvent) => void;
        onRepostClicked?: (target: ScomPost, event?: MouseEvent) => void;
        onProfileClicked?: callbackType;
        onQuotedPostClicked?: (target: ScomPost, event?: MouseEvent) => void;
        disableGutters?: boolean;
        limitHeight?: boolean;
        isReply?: boolean;
        overflowEllipse?: boolean;
        isPinned?: boolean;
        pinView?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-post']: ScomPostElement;
            }
        }
    }
    interface IPostConfig {
        data?: IPost;
        type?: PostType;
        isActive?: boolean;
    }
    type PostType = 'full' | 'standard' | 'short' | 'quoted' | 'card';
    type callbackType = (target: Control, data: IPost, event?: Event, contentElement?: Control) => void;
    type likeCallbackType = (target: Control, data: IPost, event?: Event, contentElement?: Control) => Promise<boolean>;
    export class ScomPost extends Module {
        private pnlInfo;
        private imgAvatar;
        private lblOwner;
        private lblUsername;
        private lblDate;
        private imgVerified;
        private pnlQuoted;
        private btnShowMore;
        private showMoreWrapper;
        private btnShowMoreInWrapper;
        private pnlWrapper;
        private pnlMore;
        private pnlReply;
        private pnlReplies;
        private pnlGridPost;
        private pnlPinned;
        private pnlRepost;
        private pnlCommunity;
        private gridPost;
        private pnlPost;
        private btnViewMore;
        private pnlDetail;
        private pnlOverlay;
        private groupAnalysis;
        private pnlActiveBd;
        private pnlContent;
        private pnlReplyPath;
        private lbReplyTo;
        private pnlSubscribe;
        private bubbleMenu;
        private pnlCardContentBlock;
        private markdownViewer;
        private disableGutters;
        private limitHeight;
        private isReply;
        private overflowEllipse;
        private expanded;
        private _isPinned;
        private pinView;
        private _data;
        private _replies;
        onReplyClicked: callbackType;
        onZapClicked: callbackType;
        onLikeClicked: likeCallbackType;
        onRepostClicked: callbackType;
        onProfileClicked: callbackType;
        onQuotedPostClicked: (target: ScomPost, event?: MouseEvent) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomPostElement, parent?: Container): Promise<ScomPost>;
        get isActive(): boolean;
        set isActive(value: boolean);
        get type(): PostType;
        set type(value: PostType);
        get postData(): IPost;
        set postData(value: IPost);
        setData(data: IPostConfig): Promise<void>;
        getData(): IPostConfig;
        get replies(): IPost[];
        get isQuotedPost(): boolean;
        get isPinned(): boolean;
        set isPinned(value: boolean);
        clear(): void;
        private isMarkdown;
        private constructPostCard;
        private renderCardContent;
        private renderUI;
        private appendLabel;
        private addQuotedPost;
        private renderInfo;
        private renderPostType;
        private renderAnalytics;
        addReply(parentPostId: string, post: IPost): ScomPost;
        appendReplyPanel(): VStack;
        private renderReplies;
        private renderReply;
        appendShowMorePanel(): void;
        private onShowMore;
        private onProfileShown;
        private onViewMore;
        private onGoProfile;
        private onGoCommunity;
        init(): Promise<void>;
        private showBubbleMenu;
        private handleShowMoreClick;
        onHide(): void;
        render(): any;
    }
}
