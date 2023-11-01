/// <amd-module name="@scom/scom-post/global/interface.ts" />
declare module "@scom/scom-post/global/interface.ts" {
    export interface IAuthor {
        id: string;
        username: string;
        description: string;
        avatar: string;
        pubKey?: string;
    }
    export interface IPost {
        id: string;
        author: IAuthor;
        replyTo?: IPost;
        quotedPosts?: IPost[];
        publishDate: Date | string;
        stat?: IPostStat;
        data: IPostData[];
    }
    export interface IPostStat {
        reply?: number;
        repost?: number;
        upvote?: number;
        downvote?: number;
        view?: number;
    }
    export interface IPostData {
        module: string;
        data: any;
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
    export const getIconStyleClass: (img: string, color: string) => string;
    export const hoverStyle: string;
}
/// <amd-module name="@scom/scom-post/assets.ts" />
declare module "@scom/scom-post/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-post" />
declare module "@scom/scom-post" {
    import { ControlElement, Module, Container, Control, VStack } from '@ijstech/components';
    import { IPost, IPostData, IPostStat, IAuthor } from "@scom/scom-post/global/index.ts";
    export { IPost, IPostData, IPostStat, IAuthor };
    interface ScomPostElement extends ControlElement {
        data?: IPost;
        type?: PostType;
        isActive?: boolean;
        onReplyClicked?: callbackType;
        onProfileClicked?: callbackType;
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
    type PostType = 'full' | 'standard' | 'short';
    type callbackType = (target: Control, data: IPost) => void;
    export class ScomPost extends Module {
        private pnlInfo;
        private imgAvatar;
        private lblOwner;
        private lblUsername;
        private lblDate;
        private imgVerified;
        private pnlWrapper;
        private pnlMore;
        private pnlReply;
        private pnlReplies;
        private gridPost;
        private btnViewMore;
        private pnlDetail;
        private pnlOverlay;
        private groupAnalysis;
        private pnlActiveBd;
        private pnlContent;
        private pnlReplyPath;
        private lbReplyTo;
        private _data;
        private _replies;
        onReplyClicked: callbackType;
        onProfileClicked: callbackType;
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
        get isFullType(): boolean;
        clear(): void;
        private renderUI;
        private renderPostType;
        private renderQuotedPosts;
        private renderAnalytics;
        addReply(parentPostId: string, post: IPost): ScomPost;
        appendReplyPanel(): VStack;
        private renderReplies;
        private renderReply;
        appendShowMorePanel(): void;
        private onShowMore;
        private onProfileShown;
        private onViewMore;
        init(): Promise<void>;
        render(): any;
    }
}
