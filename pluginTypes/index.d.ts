/// <amd-module name="@scom/scom-post/index.css.ts" />
declare module "@scom/scom-post/index.css.ts" {
    export const spinnerStyle: string;
    export const labelStyle: string;
    export const multiLineTextStyle: string;
    export const customStyles: string;
    export const analyticStyle: string;
}
/// <amd-module name="@scom/scom-post/global/interface.ts" />
declare module "@scom/scom-post/global/interface.ts" {
    export interface IPostAnalytics {
        reply: string | number;
        repost: string | number;
        voted: string | number;
        bookmark: string | number;
        view: string | number;
    }
    export interface IPostData {
        username: string;
        owner?: string;
        description?: string;
        dataUri?: string;
        publishDate?: number;
        avatar?: string;
        replies?: IReply[];
        analytics?: IPostAnalytics;
    }
    export interface IReply {
        cid: string;
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
    const getDuration: (date: number) => string;
    export { getImageIpfsUrl, formatNumber, getDuration };
}
/// <amd-module name="@scom/scom-post/global/index.ts" />
declare module "@scom/scom-post/global/index.ts" {
    export * from "@scom/scom-post/global/utils.ts";
    export * from "@scom/scom-post/global/interface.ts";
}
/// <amd-module name="@scom/scom-post" />
declare module "@scom/scom-post" {
    import { ControlElement, Module, Container, Markdown } from '@ijstech/components';
    import { IPostData } from "@scom/scom-post/global/interface.ts";
    type onReplyClickedCallback = (data: IPostData) => void;
    interface ScomPostElement extends ControlElement {
        data: IPostData;
        isAnalyticsShown?: boolean;
        isBorderShown?: boolean;
        theme?: Markdown["theme"];
    }
    interface IPostConfig {
        data: IPostData;
        isBorderShown?: boolean;
        isAnalyticsShown?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-post']: ScomPostElement;
            }
        }
    }
    export default class ScomPost extends Module {
        private imgAvatar;
        private lblOwner;
        private lblUsername;
        private pnlLoader;
        private lblDate;
        private pageViewer;
        private pnlAvatar;
        private gridPost;
        private btnViewMore;
        private pnlStatusDetail;
        private pnlOverlay;
        private groupAnalysis;
        private _data;
        onReplyClicked: onReplyClickedCallback;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomPostElement, parent?: Container): Promise<ScomPost>;
        get isAnalyticsShown(): boolean;
        set isAnalyticsShown(value: boolean);
        get isBorderShown(): boolean;
        set isBorderShown(value: boolean);
        set theme(value: Markdown["theme"]);
        setData(data: IPostConfig): Promise<void>;
        getData(): IPostConfig;
        clear(): void;
        private renderUI;
        private renderAnalytics;
        private onViewMore;
        init(): Promise<void>;
        render(): any;
    }
}
