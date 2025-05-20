import {
    ControlElement,
    customElements,
    Module,
    Styles,
    Image,
    Label,
    Container,
    FormatUtils,
    Panel,
    GridLayout,
    HStack,
    Control,
    VStack,
    IconName,
    Button,
    Markdown,
    StackLayout
} from '@ijstech/components';
import {
    getDuration,
    getEmbedElement,
    IPost,
    IPostData,
    IPostStats,
    IAuthor,
    IPostActions,
    ILinkPreview,
    getLinkPreview,
    IShopifyFrame,
    IFarcasterFrame,
    IFrameButton,
    PaymentModel
} from './global';
import { getIconStyleClass, hoverStyle, maxHeightStyle, customLinkStyle, cardContentStyle, labelHoverStyle } from './index.css';
import assets from './assets';
import { ScomPostBubbleMenu, ScomPostFarcasterFrame, ScomPostLinkPreview, ScomPostShopifyFrame } from './components';
import translations from './translations.json';

const Theme = Styles.Theme.ThemeVars;

export { IPost, IPostData, IPostStats, IAuthor }

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
    onBookmarkClicked?: callbackType;
    onCommunityClicked?: callbackType;
    onUnlockPostClicked?: asyncCallbackType;
    onOpenDesigner?: openDesignerCallback;
    onAvatarClick?: (npub: string) => void;
    disableGutters?: boolean;
    limitHeight?: boolean;
    isReply?: boolean;
    overflowEllipse?: boolean;
    isPinned?: boolean;
    pinView?: boolean;
    apiBaseUrl?: string;
    isPublicPostLabelShown?: boolean;
    lazyLoad?: boolean;
}

declare global {
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

interface IPostCard {
    title?: string;
    content?: string;
    img?: string;
}

type PostType = 'full' | 'standard' | 'short' | 'quoted' | 'card';
type callbackType = (target: Control, data: IPost, event?: Event, contentElement?: Control) => void;
type asyncCallbackType = (target: Control, data: IPost, event?: Event, contentElement?: Control) => Promise<boolean>;
type openDesignerCallback =  (target: Control, data: any) => Promise<void>;

@customElements('i-scom-post')
export class ScomPost extends Module {
    private pnlInfo: Panel;
    private pnlPublicLabel: StackLayout;
    private imgAvatar: Image;
    private lblOwner: Label;
    private lblUsername: Label;
    private lblStatus: Label;
    private lblDate: Label;
    private imgVerified: Image;
    private pnlQuoted: VStack;
    private btnShowMore: Button;

    private showMoreWrapper: HStack;
    private btnShowMoreInWrapper: Button;
    private pnlWrapper: Panel;
    private pnlMore: GridLayout;
    private pnlReply: VStack;
    private pnlReplies: VStack;
    private pnlGridPost: VStack;
    private pnlPinned: StackLayout;
    private pnlRepost: StackLayout;
    private pnlCommunity: HStack;
    private gridPost: GridLayout;
    private pnlPost: Panel;
    private btnViewMore: HStack;
    private pnlDetail: Panel;
    private pnlOverlay: Panel;
    private pnlLocked: StackLayout;
    private btnUnlockPost: Button;
    private groupAnalysis: HStack;
    private pnlActiveBd: Panel;
    private pnlContent: Panel;
    private pnlReplyPath: Panel;
    private lbReplyTo: Label;
    private pnlContext: Panel;
    private bubbleMenu: ScomPostBubbleMenu;
    private pnlCardContentBlock: VStack;
    private markdownViewer: Markdown;
    private disableGutters: boolean;
    private limitHeight: boolean;
    private isReply: boolean;
    private overflowEllipse: boolean;
    private expanded = false;
    private _isPinned: boolean;
    private pinView: boolean;
    private _apiBaseUrl: string;
    private _isPublicPostLabelShown: boolean = false;

    private _data: IPostConfig;
    private _replies: IPost[];
    public onReplyClicked: callbackType;
    public onZapClicked: callbackType;
    public onLikeClicked: asyncCallbackType;
    public onRepostClicked: callbackType;
    public onProfileClicked: callbackType;
    public onQuotedPostClicked: (target: ScomPost, event?: MouseEvent) => void;
    public onBookmarkClicked: callbackType;
    public onCommunityClicked: callbackType;
    public onUnlockPostClicked: asyncCallbackType;
    public onOpenDesigner: openDesignerCallback;
    public onAvatarClick: (npub: string) => void;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.onProfileShown = this.onProfileShown.bind(this);
        this.onShowMore = this.onShowMore.bind(this);
        this.showBubbleMenu = this.showBubbleMenu.bind(this);
        this.onGoCommunity = this.onGoCommunity.bind(this);
        this.handleUnlockPost = this.handleUnlockPost.bind(this);
    }

    static async create(options?: ScomPostElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    get isActive() {
        return this._data.isActive ?? false;
    }

    set isActive(value: boolean) {
        this._data.isActive = value ?? false;
    }

    get type() {
        return this._data.type ?? 'standard';
    }

    set type(value: PostType) {
        this._data.type = value ?? 'standard';
    }

    get postData() {
        return this._data.data;
    }

    set postData(value: IPost) {
        this._data.data = value;
    }

    async setData(data: IPostConfig) {
        this._data = { ...data };
        await this.renderUI();
    }

    getData() {
        return this._data;
    }

    get replies() {
        return this._replies ?? [];
    }

    get isQuotedPost() {
        return this.type === 'quoted';
    }
    
    get isPinned() {
        return this._isPinned;
    }

    set isPinned(value: boolean) {
        this._isPinned = value || false;
        this.pnlPinned.visible = this._isPinned;
    }

    get apiBaseUrl() {
        return this._apiBaseUrl;
    }

    set apiBaseUrl(value: string) {
        this._apiBaseUrl = value;
    }

    get isPublicPostLabelShown() {
        return this._isPublicPostLabelShown;
    }

    set isPublicPostLabelShown(value: boolean) {
        this._isPublicPostLabelShown = value;
        if (this.pnlPublicLabel) this.pnlPublicLabel.visible = value;
    }

    set status(value: string) {
        if (this.lblStatus) {
            this.lblStatus.caption = value || "";
            this.lblStatus.parent.visible = value != null;
        }
    }

    clear() {
        if (this.pnlOverlay)
            this.pnlOverlay.visible = false;
        if (this.btnViewMore)
            this.btnViewMore.visible = false;
        if (this.pnlContent) {
            this.pnlContent.clearInnerHTML();
            // this.pnlContent.minHeight = '5rem';
        }
        if (this.pnlMore) {
            this.pnlMore.remove();
            this.pnlMore = undefined;
        }
        this._replies = [];
        if (this.pnlActiveBd)
            this.pnlActiveBd.visible = false;
        if (this.pnlReplyPath)
            this.pnlReplyPath.visible = false;
        if (this.pnlInfo)
            this.pnlInfo.clearInnerHTML();
    }

    private async isMarkdown() {
        const { contentElements } = this._data?.data || {};
        for (let item of contentElements) {
            if (!item.module) {
                let content: string = item?.data?.properties?.content || '';
                if (!content) continue;
                const tokens: any[] = await this.markdownViewer.getTokens(content);
                let heading1 = tokens.find(token => token.type === "heading" && token.depth === 1);
                if (heading1) {
                    return true;
                }
            }
        }
        return false;
    }

    private async constructPostCard() {
        let data: IPostCard = {}
        const { contentElements } = this._data?.data || {};
        if (contentElements?.length) {
            for (let item of contentElements) {
                if (!item.module) {
                    let content: string = item?.data?.properties?.content || '';
                    if (!content) continue;
                    const tokens: any[] = await this.markdownViewer.getTokens(content);
                    if (!data.title) {
                        let heading1Token = tokens.find(token => token.type === "heading" && token.depth === 1);
                        if (heading1Token) {
                            data.title = heading1Token.text;
                        }
                    }
                    if (!data.content) {
                        let textToken = tokens.find(token => token.type === "paragraph" || token.type === "text");
                        if (textToken) {
                            data.content = textToken.text;
                        }
                    }
                }
                if (!data.img) {
                    if (item.module === '@scom/scom-image-gallery') {
                        const images = item?.data?.properties?.images || [];
                        data.img = images[0]?.url;
                    }
                    if (item.module === '@scom/scom-video') {
                        const url = item?.data?.properties?.url;
                        let regex = /(youtu.*be.*)\/(watch\?v=|watch\?.+&v=|live\/|shorts\/|embed\/|v\/|)(.*?((?=[&#?])|$))/gm;
                        let videoId = regex.exec(url)?.[3];
                        if (videoId) {
                            data.img = `https://img.youtube.com/vi/${videoId}/0.jpg`
                        }
                    }
                }
                if (data.title && data.content && data.img) break;
            }
        }
        return data;
    }

    private renderCardContent(data: IPostCard) {
        this.pnlContent.appendChild(
            <i-stack
                class={cardContentStyle}
                width={'100%'}
                direction={this.pinView ? "vertical" : "horizontal"}
                gap='0.875rem'
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: {
                            direction: "vertical"
                        }
                    }
                ]}
            >
                <i-hstack
                    width="100%"
                    height="100%"
                    stack={{ shrink: '0' }}
                    border={this.pinView ? { radius: "0.75rem" } : {}}
                    overflow="hidden"
                    mediaQueries={this.pinView ? [] : [
                        {
                            minWidth: '768px',
                            properties: {
                                width: "7rem",
                                height: "7rem",
                                border: { radius: "0.75rem" }
                            }
                        }
                    ]}
                    visible={!!data.img}
                >
                    <i-panel
                        width="100%"
                        height={0}
                        overflow="hidden"
                        padding={{ bottom: this.pinView ? "50%" : "100%" }}
                        background={{ color: Theme.action.disabledBackground }}
                        mediaQueries={[
                            {
                                maxWidth: '767px',
                                properties: {
                                    padding: { bottom: '50%' }
                                }
                            }
                        ]}
                    >
                        <i-image
                            position="absolute"
                            display="block"
                            width="100%"
                            height="100%"
                            top="100%"
                            left={0}
                            url={data.img}
                            objectFit="cover"
                        ></i-image>
                    </i-panel>
                </i-hstack>
                <i-vstack
                    id="pnlCardContentBlock"
                    justifyContent='space-between'
                    gap={'0.5rem'}
                    stack={{ shrink: '1', grow: '1' }}
                    overflow={'hidden'}
                >
                    <i-vstack gap={'0.5rem'}>
                        <i-label caption={data.title || '$untitled'} font={{ size: '1.25rem', weight: 500 }} wordBreak="break-word" lineHeight={'1.5rem'}></i-label>
                        <i-label
                            class="entry-content"
                            caption={data.content || ''}
                            lineClamp={this.pinView ? 3 : 1}
                            font={{ size: "1rem" }}
                            lineHeight={'1.5rem'}
                            visible={!!data.content}
                        ></i-label>
                    </i-vstack>
                </i-vstack>
            </i-stack>
        );
        this.groupAnalysis.parent = this.pnlCardContentBlock;
        this.pnlCardContentBlock.appendChild(this.groupAnalysis);
    }

    private async renderUI() {
        this.clear();
        const { actions, stats, parentAuthor, contentElements, repost, community, isLocked, isSubscription, isPending } = this._data?.data || {};
        this.renderPostType();
        let isMarkdown = await this.isMarkdown();

        if (parentAuthor) {
            this.pnlReplyPath.visible = true;
            this.lbReplyTo.caption = parentAuthor.displayName || '';
        }
        this.pnlActiveBd.visible = this.isActive;
        this.pnlGridPost.border.radius = this.isActive ? '0.25rem' : '0.5rem';
        this.pnlGridPost.cursor = this.isActive ? 'default' : 'pointer';

        if (!this.isQuotedPost) this.renderAnalytics(stats, actions);
        this.groupAnalysis.visible = !this.isQuotedPost && !this.pinView;
        this.pnlContext.visible = !this.isQuotedPost && !this.pinView && !isPending;

        this.pnlLocked.visible = isLocked || false;
        this.pnlDetail.visible = !isLocked;

        if (repost) {
            let reposters = repost.displayName || repost.username || FormatUtils.truncateWalletAddress(repost.npub);
            if (stats?.reposts > 1) {
                const others = stats.reposts - 1;
                reposters += ` and ${others} ${others > 1 ? 'others' : 'other'}`;
            }
            this.pnlRepost.clearInnerHTML();
            this.pnlRepost.append(
                <i-stack direction="horizontal" width="2.75rem" justifyContent="end">
                    <i-icon width="1rem" height="1rem" name="retweet" fill={Theme.text.secondary}></i-icon>
                </i-stack>,
                <i-label
                    caption={this.i18n.get('reposted', { value: reposters })}
                    font={{ size: "0.875rem", color: Theme.text.secondary }}
                    onClick={() => this.onGoProfile(repost.npub || repost.id)}
                ></i-label>
            )
            this.pnlRepost.visible = true;
        }

        if (community) {
            this.pnlCommunity.clearInnerHTML();
            this.pnlCommunity.append(
                <i-hstack width="2.75rem" horizontalAlignment='end'>
                    <i-icon width="1rem" height="1rem" name="users" fill={Theme.text.secondary}></i-icon>
                </i-hstack>,
                <i-label
                    class={labelHoverStyle}
                    caption={community.communityId}
                    font={{ size: "0.875rem", color: Theme.text.secondary }}
                    cursor="pointer"
                    onClick={this.onGoCommunity}
                ></i-label>
            )
            this.pnlCommunity.visible = true;
        }
        if (this.btnUnlockPost) {
            const firstPolicy = community?.policies?.[0];
            const _isSubscription = isSubscription || firstPolicy?.paymentModel === PaymentModel.Subscription;
            this.btnUnlockPost.caption = community?.isWhitelist ? "$exclusive_content_for_whitelisted_users_only" : _isSubscription ? "$subscribe" : "$unlock";
            this.btnUnlockPost.enabled = !community?.isWhitelist;
        }
        
        if (this.type === 'card' && isMarkdown) {
            const templateAreas = [
                ['avatar', 'user'],
                ['avatar', 'path'],
                ['content', 'content']
            ];
            if (!this.pnlReplyPath.visible) templateAreas.splice(1, 1);
            this.gridPost.templateAreas = templateAreas;
            this.overflowEllipse = false;
            this.classList.remove(maxHeightStyle);
            let data = await this.constructPostCard();
            this.renderCardContent(data);
        } else if (contentElements?.length) {
            for (let item of contentElements) {
                if (item.category === 'quotedPost') {
                    this.addQuotedPost(item?.data?.properties);
                } else {
                    if (!item.module && isMarkdown) {
                        item.module = '@scom/scom-markdown-editor';
                    }
                    if (item.module) {
                        await getEmbedElement(item, this.pnlContent, (elm: any) => {
                        });
                    } else {
                        let content: string = item?.data?.properties?.content || '';
                        this.appendLabel(content);
                    }
                }
            }
        }
    }

    private appendLabel(text: string) {
        const elements: Control[] = [];
        const splitted = text.split(/\n/gm);
        for (let i = 0; i < splitted.length; i++) {
            const content = splitted[i];
            if (!content.trim().length) {
                elements.push(
                    new Label(undefined, {
                        caption: content,
                        minHeight: "1.3125rem"
                    })
                );
                continue;
            }
            const itemElements = this.createElements(content);
            const panel = new Panel(undefined, {
                display: 'inline',
                overflow: 'hidden'
            });
            panel.append(...itemElements);
            elements.push(panel);
        }
        const wrapper = new VStack(this.pnlContent, {width: '100%'});
        wrapper.append(...elements);
        this.pnlContent.appendChild(wrapper);
        if (this.apiBaseUrl) {
            const links = wrapper.querySelectorAll('a');
            for (let link of links) {
                let previousSibling = link.previousSibling;
                let nextSibling = link.nextSibling;
                if (previousSibling?.nodeName === '#text' && !previousSibling.textContent.trim().length) {
                    previousSibling = previousSibling.previousSibling;
                }
                if (nextSibling?.nodeName === '#text' && !nextSibling.textContent.trim().length) {
                    nextSibling = nextSibling.nextSibling;
                }
                if (
                    (previousSibling && previousSibling['tagName'] !== 'BR') ||
                    (nextSibling && nextSibling['tagName'] !== 'BR')
                ) continue;
                const regex = new RegExp(`${location.origin}/(#!/)?p/\\S+`, "g");
                let match = regex.exec(link.href);
                // tag mention
                if (match && (link.innerHTML.startsWith('@') || link.innerHTML.startsWith('<span>@'))) continue;
                this.appendLinkPreview(link.href, link);
            }
        }
    }

    private createElements(text: string) {
        const anchorRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
        const linkRegex = /https?:\/\/\S+/gi;
        // const linkRegex = /https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.?)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/#!)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?/gi;
        const elements: Control[] = [];
        let match;
        const matches: any[] = [];
        while ((match = linkRegex.exec(text)) !== null) {
            matches.push({
                type: 'link',
                index: match.index,
                length: match[0].length,
                data: {url: match[0], caption: match[0]}
            })
        }
        while ((match = anchorRegex.exec(text)) !== null) {
            matches.push({
                type: 'anchor',
                index: match.index,
                length: match[0].length,
                data: {url: match[2], caption: match[3]}
            })
        }
        matches.sort((a, b) => a.index - b.index);
        let lastIndex = 0;
        matches.forEach(match => {
            if (match.index > lastIndex) {
                const textContent = text.slice(lastIndex, match.index);
                if (textContent.trim().length > 0) {
                    elements.push(
                        new Label(undefined, {
                            caption: textContent,
                            display: 'inline',
                            overflowWrap: "anywhere",
                            lineHeight: "1.3125rem",
                            padding: {right: '4px'}
                        })
                    );
                }
            }
            if (match.type === 'anchor') {
                const link = new Label(undefined, {
                    link: { href: match.data.url, target: '_blank' },
                    display: 'inline',
                    class: customLinkStyle,
                    caption: match.data.caption,
                    overflowWrap: "anywhere",
                    lineHeight: "1.3125rem",
                    padding: {right: '4px'}
                });
                elements.push(link);
            } else if (match.type === 'link') {
                const link = new Label(undefined, {
                    link: { href: match.data.url, target: '_blank' },
                    display: 'inline',
                    class: customLinkStyle,
                    caption: match.data.caption,
                    overflowWrap: "anywhere",
                    lineHeight: "1.3125rem",
                    padding: {right: '4px'}
                });
                elements.push(link);
            }
            lastIndex = match.index + match.length;
        })

        if (lastIndex < text.length) {
            let textContent = text.slice(lastIndex);
            if (textContent.trim().length > 0) {
                elements.push(
                    new Label(undefined, {
                        caption: textContent,
                        display: 'inline',
                        verflowWrap: "anywhere",
                        lineHeight: "1.3125rem",
                        padding: {right: '4px'}
                    })
                );
            }
        }
        return elements;
    }
    
    private constructFarcasterFrame(preview: ILinkPreview): IFarcasterFrame {
        let data: IFarcasterFrame = {
            image: preview.image,
            url: preview.url
        };
        for (let tag of preview.fc_tags) {
            if (tag[0] === 'fc:frame:image') {
                data.image = tag[1];
            } else if (tag[0] === 'fc:frame:post_url') {
                data.post_url = tag[1];
            } else if (tag[0] === 'fc:frame:input:text') {
                data.input_text = tag[1];
            } else if (tag[0] === 'fc:frame:image:aspect_ratio') {
                data.aspect_ratio = tag[1];
            } else if (tag[0] === 'fc:frame:state') {
                data.state = tag[1];
            } else if (tag[0].startsWith('fc:frame:button:')) {
                if (!data.buttons) data.buttons = [];
                const arr = tag[0].replace('fc:frame:button:', '').split(':');
                const idx = Number(arr[0]) - 1;
                const property = arr[1] || 'caption';
                if (!data.buttons[idx]) data.buttons[idx] = {} as IFrameButton;
                data.buttons[idx][property] = tag[1];
            }
        }
        return data;
    }

    private constructShopifyFrame(preview: ILinkPreview): IShopifyFrame {
        let price, currency;
        for (let tag of preview.og_tags) {
            if (tag[0] === 'og:price:amount') {
                price = tag[1];
            } else if (tag[0] === 'og:price:currency') {
                currency = tag[1];
            }
        }
        return {
            title: preview.title,
            description: preview.description,
            image: preview.image,
            price: price,
            currency: currency,
            url: preview.url
        }
    }
    
    private async appendLinkPreview(url: string, linkElm: HTMLAnchorElement) {
        const preview: ILinkPreview = await getLinkPreview(this.apiBaseUrl, url);
        if (!preview || !preview.title) return;
        const isFarcasterFrame = preview.fc_tags?.some(tag => tag[0] === 'fc:frame');
        const isShopifyFrame = preview.og_tags?.some(tag => tag[0].startsWith('og:price'));
        let elm: any;
        let data: any = preview;
        if (isFarcasterFrame) {
            elm = new ScomPostFarcasterFrame();
            data = this.constructFarcasterFrame(preview);
        } else if (isShopifyFrame) {
            elm = new ScomPostShopifyFrame();
            data = this.constructShopifyFrame(preview);
        } else {
            elm = new ScomPostLinkPreview() as ScomPostLinkPreview;
            if (this.onOpenDesigner) elm.onOpenDesigner = this.onOpenDesigner;
        }
        linkElm.after(elm);
        await elm.ready();
        elm.parent = this;
        elm.data = data;
    }

    private addQuotedPost(post: IPost) {
        const postEl = (
            <i-scom-post
                type="quoted"
                data={post}
                display="block"
                border={{ radius: '0.5rem', width: '1px', style: 'solid', color: Theme.colors.secondary.dark }}
                apiBaseUrl={this.apiBaseUrl}
            // overflowEllipse={true}
            // limitHeight={true}
            ></i-scom-post>
        )
        postEl.onClick = this.onQuotedPostClicked;
        postEl.onQuotedPostClicked = this.onQuotedPostClicked;
        this.pnlQuoted.append(postEl);
        this.pnlQuoted.visible = true;
    }

    private renderInfo(oneLine?: boolean) {
        const { publishDate, author, stats } = this.postData;
        this.imgAvatar.url = author?.avatar ?? '';
        this.imgAvatar.objectFit = 'cover';
        const imgWidth = this.isQuotedPost ? '1.75rem' : '2.75rem';
        this.imgAvatar.width = this.imgAvatar.height = imgWidth;
        const userEl = (
            <i-hstack minWidth={0} verticalAlignment='center' gap="0.25rem" stack={{ shrink: '1' }}>
                <i-label
                    id="lblOwner"
                    caption={author?.displayName || author?.username || ''}
                    textOverflow="ellipsis"
                    font={{ size: this.isQuotedPost ? '1rem' : '0.875rem', weight: 500 }}
                    lineHeight={'0.875rem'}
                    overflow="hidden"
                ></i-label>
                <i-icon
                    id="imgVerified"
                    width={'0.875rem'} height={'0.875rem'}
                    name="certificate"
                    fill={Theme.text.secondary}
                    display="inline-flex"
                    stack={{ shrink: '0' }}
                ></i-icon>
            </i-hstack>
        );
        const dateEl = (
            <i-hstack gap={'0.25rem'} stack={{ shrink: '0' }}>
                <i-panel border={{ left: { width: '1px', style: 'solid', color: Theme.text.secondary } }}></i-panel>
                <i-label
                    id="lblDate"
                    font={{ size: '0.875rem', color: Theme.text.secondary }}
                    caption={`${getDuration(publishDate)}`}
                    lineHeight={'0.875rem'}
                />
            </i-hstack>
        );
        const usernameEl = (
            <i-label
                id="lblUsername"
                caption={`${author?.internetIdentifier || ''}`}
                textOverflow="ellipsis"
                font={{ size: this.isQuotedPost ? '1rem' : '0.875rem', color: Theme.text.secondary }}
                lineHeight={'0.875rem'}
                stack={{ shrink: '1' }}
                overflow="hidden"
                visible={author?.internetIdentifier != null}
            ></i-label>
        );
        let statusEl = (
            <i-hstack gap={'0.25rem'} stack={{ shrink: '0' }} visible={stats?.status != null}>
                <i-label
                    id="lblStatus"
                    caption={stats?.status || ""}
                    padding={{ top: 3, bottom: 3, left: 12, right: 12 }}
                    border={{ width: 1, style: 'solid', color: Theme.colors.primary.main, radius: 20 }}
                    font={{ size: '0.875rem', color: Theme.colors.primary.main }}
                    lineHeight={'0.875rem'}
                ></i-label>
            </i-hstack>
        )
        if (oneLine) {
            this.pnlInfo.append(
                <i-hstack
                    height="100%"
                    minWidth={0}
                    gap="0.25rem"
                    verticalAlignment="center"
                    stack={{ shrink: '1' }}
                >
                    {userEl}
                    {usernameEl}
                    {dateEl}
                    {statusEl}
                </i-hstack>
            )
        } else {
            this.pnlInfo.append(
                <i-vstack minWidth={0} gap="0.5rem" stack={{ shrink: '1' }}>
                    <i-hstack minWidth={0} gap="0.25rem" verticalAlignment="center" stack={{ shrink: '1' }}>
                        {userEl}
                        {dateEl}
                        {statusEl}
                    </i-hstack>
                    {usernameEl}
                </i-vstack>
            )
        }
    }

    private renderPostType() {
        if (!this.disableGutters) {
            this.gridPost.templateColumns = ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'];
            this.gridPost.templateRows = ['1fr'];
        }
        // this.pnlGridPost.background.color = Theme.background.paper;
        // this.pnlPost.background.color = Theme.background.paper;
        if (this.isQuotedPost) {
            this.renderInfo(true);
            this.gridPost.templateAreas = [
                ['avatar', 'user'],
                ['avatar', 'path'],
                ['content', 'content']
            ]
            if (!this.disableGutters) {
                this.gridPost.templateColumns = ['1.75rem', 'minmax(auto, calc(100% - 4.5rem))'];
                this.gridPost.templateRows = ['1.75rem', 'auto'];
            }
            this.pnlGridPost.background.color = Theme.background.default;
            this.pnlPost.background.color = Theme.background.default;
        } else if (this.type === 'short') {
            this.renderInfo();
            this.gridPost.templateAreas = [
                ['avatar', 'user'],
                ['avatar', 'path'],
                ['avatar', 'content']
            ]
        } else {
            this.renderInfo(true);
            this.gridPost.templateAreas = [
                ['avatar', 'user'],
                ['avatar', 'path'],
                ['avatar', 'content']
            ]
        }
    }

    private renderAnalytics(analytics: IPostStats, actions?: IPostActions) {
        const dataList: any[] = [
            {
                value: analytics?.replies || 0,
                name: '$reply',
                icon: { name: "comment-alt" },
                hoveredColor: Theme.text.secondary,
                highlighted: actions?.replied,
                onClick: (target: Control, event: Event) => {
                    if (this.onReplyClicked) this.onReplyClicked(target, this.postData, event);
                    return true;
                }
            },
            {
                value: analytics?.satszapped || 0,
                name: '$zap',
                icon: { name: "bolt" },
                hoveredColor: Theme.colors.warning.main,
                highlighted: actions?.zapped,
                onClick: (target: Control, event: Event) => {
                    if (this.onZapClicked) this.onZapClicked(target, this.postData, event);
                    return true;
                }
            },
            {
                value: analytics?.upvotes || 0,
                name: '$like',
                icon: { name: "heart" },
                hoveredColor: Theme.colors.error.main,
                highlighted: actions?.liked,
                onClick: async (target: Control, event: Event) => {
                    let success = true;
                    if (this.onLikeClicked) success = await this.onLikeClicked(target, this.postData, event);
                    return success;
                }
            },
            {
                value: analytics?.reposts || 0,
                name: '$repost',
                icon: { name: "retweet" },
                hoveredColor: Theme.colors.success.main,
                highlighted: actions?.reposted,
                onClick: (target: Control, event: Event) => {
                    if (this.onRepostClicked) this.onRepostClicked(target, this.postData, event);
                    return true;
                }
            },
            {
                name: '$bookmark',
                icon: { name: 'bookmark' },
                hoveredColor: Theme.colors.info.main,
                highlighted: actions?.bookmarked,
                onClick: async (target: Control, event: Event) => {
                    if (this.onBookmarkClicked) this.onBookmarkClicked(target, this.postData, event);
                    return true;
                }
            }
        ]
        this.groupAnalysis.clearInnerHTML();
        for (let item of dataList) {
            let value, lblValue;
            if (item.value != null) {
                value = FormatUtils.formatNumber(item.value, { shortScale: true, decimalFigures: 0 });
                lblValue = (
                    <i-label
                        caption={value}
                        font={{ color: Theme.colors.secondary.light, size: '0.8125rem' }}
                        tag={item.value}
                    ></i-label>
                )
            }
            let itemEl = (
                <i-hstack
                    verticalAlignment="center"
                    gap='0.5rem'
                    tooltip={value ? { content: value, placement: 'bottomLeft' } : undefined}
                    cursor='pointer'
                    class={getIconStyleClass(item.hoveredColor)}
                    padding={{ top: '0.25rem', bottom: '0.25rem' }}
                    enabled={!this.postData?.isPending}
                >
                    <i-icon
                        width={'1rem'} height={'1rem'}
                        fill={Theme.text.secondary}
                        name={item.icon.name as IconName}
                    ></i-icon>
                    {lblValue || []}
                </i-hstack>
            )
            if (item.highlighted) itemEl.classList.add('highlighted');
            this.groupAnalysis.appendChild(itemEl);
            itemEl.onClick = async (target: Control, event: Event) => {
                if (this.postData?.isPending) return;
                let success = true;
                if (item.onClick) success = await item.onClick(itemEl, event);
                if (success && (item.name === '$like' || item.name === '$repost')) {
                    const newValue = (lblValue.tag ?? 0) + 1;
                    lblValue.caption = FormatUtils.formatNumber(newValue, { shortScale: true, decimalFigures: 0 });
                    lblValue.tag = newValue;
                    itemEl.classList.add('highlighted');
                }
                if (item.name === '$bookmark') {
                    itemEl.classList.toggle('highlighted');
                }
            }
        }
    }

    addReply(parentPostId: string, post: IPost) {
        if (parentPostId !== this.postData.id) return;
        if (!this.pnlReply) this.appendReplyPanel();
        this._replies.push(post);
        return this.renderReply(post, true);
    };

    appendReplyPanel() {
        this.pnlReply = <i-vstack id="pnlReply" visible={!this.pnlMore} padding={{ top: '0.5rem' }} border={{top: { width: 1, style: 'solid', color: 'rgb(47, 51, 54)'}}}>
            <i-vstack id="pnlReplies" gap={'0.5rem'} padding={{ bottom: 50 }}></i-vstack>
        </i-vstack>
        this.pnlWrapper.appendChild(this.pnlReply);
        return this.pnlReply;
    };

    private renderReplies() {
        if (this.pnlReplies) this.pnlReplies.clearInnerHTML();
        const length = this._replies?.length;
        if (length) {
            for (let i = 0; i < length; i++) {
                const reply = this._replies[i];
                this.renderReply(reply);
            }
        }
    }

    private renderReply(reply: IPost, isPrepend?: boolean) {
        const childElm = <i-scom-post overflowEllipse={true} border={{top: { width: 1, style: 'solid', color: 'rgb(47, 51, 54)'}}} apiBaseUrl={this.apiBaseUrl}/> as ScomPost;
        childElm.onReplyClicked = this.onReplyClicked;
        childElm.onZapClicked = this.onZapClicked;
        childElm.onLikeClicked = this.onLikeClicked;
        childElm.onRepostClicked = this.onRepostClicked;
        childElm.onProfileClicked = this.onProfileClicked;
        childElm.onQuotedPostClicked = this.onQuotedPostClicked;
        childElm.onBookmarkClicked = this.onBookmarkClicked;
        childElm.onAvatarClick = this.onAvatarClick;
        childElm.parent = this.pnlReplies;
        if (isPrepend)
            this.pnlReplies.prepend(childElm);
        else this.pnlReplies.append(childElm);
        childElm.setData({ data: reply });
        return childElm;
    }

    appendShowMorePanel() {
        this.pnlMore = (
            <i-grid-layout
                id="pnlMore"
                templateColumns={['2.75rem', 'minmax(auto, calc(100% - 3.5rem))']}
                gap={{ column: 12 }}
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                onClick={this.onShowMore}
            >
                <i-vstack height={'1rem'} justifyContent="space-between" alignItems="center">
                    <i-panel width={2} height={2} background={{ color: Theme.colors.secondary.light }}></i-panel>
                    <i-panel width={2} height={2} background={{ color: Theme.colors.secondary.light }}></i-panel>
                    <i-panel width={2} height={2} background={{ color: Theme.colors.secondary.light }}></i-panel>
                </i-vstack>
                <i-label caption="$show_replies" font={{ color: Theme.colors.primary.main, size: '0.9rem' }}></i-label>
            </i-grid-layout>
        );
        if (this.pnlReply) this.pnlReply.visible = false;
        this.pnlWrapper.appendChild(this.pnlMore);
    };

    private onShowMore() {
        this.pnlMore.visible = false;
        if (!this.pnlReply) this.appendReplyPanel();
        this.pnlReply.visible = true;
        this.renderReplies();
    }
 
    private onProfileShown(target: Control, event: Event) {
        if (this.postData?.isPending) return;
        if (this.onProfileClicked) this.onProfileClicked(target, this.postData, event, this.pnlContent);
    }

    private onViewMore() {
        this.pnlDetail.style.maxHeight = '';
        this.pnlDetail.style.overflow = '';
        this.pnlOverlay.visible = false;
        this.btnViewMore.visible = false;
    }

    private viewParentAuthor() {
        const { parentAuthor } = this.postData || {};
        this.onGoProfile(parentAuthor?.id || parentAuthor?.npub);
    }

    private onGoProfile(npub?: string) {
        if (!npub) npub = this.postData?.author?.npub;
        if (npub) {
            if (this.onAvatarClick) {
                this.onAvatarClick(npub);
            } else {
                window.open(`/p/${npub}`, '_self');
            }
        }
    }

    private onGoCommunity(target: Control, event: Event) {
        if (this.onCommunityClicked) this.onCommunityClicked(target, this.postData, event);
    }

    private async handleUnlockPost(target: Control, event: Event) {
        let success = true;
        if (this.onUnlockPostClicked) {
            this.btnUnlockPost.rightIcon.spin = true;
            this.btnUnlockPost.rightIcon.visible = true;
            success = await this.onUnlockPostClicked(target, this.postData, event);
            this.btnUnlockPost.rightIcon.spin = false;
            this.btnUnlockPost.rightIcon.visible = false;
        }
        if (success) {
            if (this._data.data) this._data.data.isLocked = false;
            this.pnlLocked.visible = false;
            this.pnlDetail.visible = true;
        }
    }

    // private handleShowMoreClick() {
    //     this.pnlContent.classList.remove(ellipsisStyle);
    //     this.btnShowMore.visible = false;
    // }

    async init() {
        this.i18n.init({...translations});
        super.init();
        this.onReplyClicked = this.getAttribute('onReplyClicked', true) || this.onReplyClicked;
        this.onZapClicked = this.getAttribute('onZapClicked', true) || this.onZapClicked;
        this.onLikeClicked = this.getAttribute('onLikeClicked', true) || this.onLikeClicked;
        this.onRepostClicked = this.getAttribute('onRepostClicked', true) || this.onRepostClicked;
        this.onProfileClicked = this.getAttribute('onProfileClicked', true) || this.onProfileClicked;
        this.onQuotedPostClicked = this.getAttribute('onQuotedPostClicked', true) || this.onQuotedPostClicked;
        this.onBookmarkClicked = this.getAttribute('onBookmarkClicked', true) || this.onBookmarkClicked;
        this.onCommunityClicked = this.getAttribute('onCommunityClicked', true) || this.onCommunityClicked;
        this.onUnlockPostClicked = this.getAttribute('onUnlockPostClicked', true) || this.onUnlockPostClicked;
        this.onOpenDesigner = this.getAttribute('onOpenDesigner', true) || this.onOpenDesigner;
        this.onAvatarClick = this.getAttribute('onAvatarClick', true) || this.onAvatarClick;
        this.overflowEllipse = this.getAttribute('overflowEllipse', true) || this.overflowEllipse;
        this.disableGutters = this.getAttribute('disableGutters', true) || this.disableGutters;
        this.limitHeight = this.getAttribute('limitHeight', true) || this.limitHeight;
        this.isReply = this.getAttribute('isReply', true) || this.isReply;
        this.isPinned = this.getAttribute('isPinned', true, false);
        this.pinView = this.getAttribute('pinView', true, false);
        const apiBaseUrl = this.getAttribute('apiBaseUrl', true);
        if (apiBaseUrl && apiBaseUrl !== 'undefined') this.apiBaseUrl = apiBaseUrl;
        const isPublicPostLabelShown = this.getAttribute('isPublicPostLabelShown', true);
        if (isPublicPostLabelShown != null) this.isPublicPostLabelShown = isPublicPostLabelShown;

        const data = this.getAttribute('data', true);
        const isActive = this.getAttribute('isActive', true, false);
        const type = this.getAttribute('type', true);
        
        this.pnlGridPost.padding = this.pinView ?
            { left: 0, right: 0, top: '1rem', bottom: '1rem' } :
            { left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem' };

        if (this.disableGutters) {
            this.pnlPost.visible = true;
            this.pnlPost.append(
                <i-panel
                    id="pnlActiveBd"
                    visible={false}
                    width={'0.25rem'} height={'100%'}
                    left="0px" top="0px"
                    border={{ radius: '0.25rem 0 0 0.25rem' }}
                    // background={{ color: Theme.background.gradient }}
                ></i-panel>);
            this.pnlPost.append(
                <i-panel
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: 0, right: 0, top: 0, bottom: 0 }
                            }
                        }
                    ]}
                    padding={{ left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem' }}>
                    <i-hstack id="pnlCommunity" padding={{ bottom: "0.75rem" }} margin={{ top: "-0.5rem" }} gap="0.75rem" visible={false}></i-hstack>
                    <i-hstack horizontalAlignment="space-between" gap="0.5rem" width="100%"
                        grid={{ area: 'user' }}
                        position='relative'>
                        <i-hstack minWidth={0} alignItems={'center'} gap={10}>
                            <i-panel id="pnlAvatar" grid={{ area: 'avatar' }}>
                                <i-image
                                    id="imgAvatar"
                                    width={'2.75rem'} height={'2.75rem'}
                                    display="block"
                                    background={{ color: Theme.background.main }}
                                    border={{ radius: '50%' }}
                                    overflow={'hidden'}
                                    objectFit='cover'
                                    fallbackUrl={assets.fullPath('img/default_avatar.png')}
                                    cursor="pointer"
                                    onClick={() => this.onGoProfile()}
                                ></i-image>
                            </i-panel>
                            <i-stack direction="vertical" minWidth={0} gap="0.375rem">
                                <i-panel id="pnlInfo" maxWidth={'100%'} overflow={'hidden'}></i-panel>
                                <i-stack id="pnlPublicLabel" direction="horizontal" alignItems="center" gap="0.25rem" visible={this.isPublicPostLabelShown}>
                                    <i-icon
                                        width="0.875rem"
                                        height="0.875rem"
                                        name="globe-americas"
                                        display='inline-flex'
                                        fill={Theme.text.secondary}
                                    ></i-icon>
                                    <i-label
                                        caption="$public"
                                        font={{ size: '0.875rem', color: Theme.text.secondary }}
                                    ></i-label>
                                </i-stack>
                            </i-stack>
                        </i-hstack>
                        <i-hstack
                            id="pnlContext" stack={{ shrink: '0' }}
                            horizontalAlignment="end"
                            gap="0.5rem"
                            visible={!this.pinView}
                        >
                            <i-panel
                                onClick={this.onProfileShown}
                                cursor="pointer"
                                class={hoverStyle}
                            >
                                <i-icon
                                    name="ellipsis-h"
                                    width={'1rem'}
                                    height={'1rem'}
                                    fill={Theme.text.secondary}
                                ></i-icon>
                            </i-panel>
                        </i-hstack>
                    </i-hstack>
                    <i-hstack
                        id="pnlReplyPath"
                        verticalAlignment="center"
                        gap="0.25rem" visible={false}
                        grid={{ area: 'path' }}
                        margin={{ top: '0.5rem' }}
                    >
                        <i-label caption='$replying_to' font={{ size: '0.875rem', color: Theme.colors.secondary.light }} />
                        <i-label
                            id="lbReplyTo"
                            font={{ size: '0.875rem', color: Theme.colors.primary.main }}
                            cursor="pointer"
                            onClick={this.viewParentAuthor.bind(this)}
                        />
                    </i-hstack>
                    <i-vstack width={'100%'} grid={{ area: 'content' }} margin={{ top: '1rem' }}>
                        <i-panel id="pnlDetail">
                            <i-hstack id={"showMoreWrapper"}
                                visible={false}
                                height={50}
                                bottom={0}
                                width={'100%'}
                                zIndex={1}
                                background={{ color: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10, 10, 10) 100%)' }}
                                position={'absolute'}
                                justifyContent={'center'}
                                alignItems={'end'}>
                                <i-button id={"btnShowMore"} caption="$show_more" margin={{ bottom: 10 }} background={{ color: 'transparent' }} font={{ color: Theme.colors.primary.main, weight: 800, size: '1rem' }} boxShadow={'unset'} onClick={this.handleShowMoreClick.bind(this)} />
                            </i-hstack>
                            <i-vstack id="pnlContent" gap="0.75rem"></i-vstack>
                            {/*<i-button id={'btnShowMore'} background={{color: 'transparent'}} onClick={this.handleShowMoreClick.bind(this)} caption={"Show more..."} font={{color: Theme.colors.primary.main}} visible={false}></i-button>*/}
                            <i-vstack id="pnlQuoted" visible={false} gap={'0.5rem'} padding={{ top: '0.5rem' }}></i-vstack>
                            <i-panel
                                id="pnlOverlay"
                                visible={false}
                                height='5rem' width='100%'
                                position='absolute' bottom="0px"
                                background={{ color: `linear-gradient(0, var(--card-bg-color) 0%, transparent 100%)` }}
                            ></i-panel>
                        </i-panel>
                        <i-hstack
                            id="btnViewMore"
                            verticalAlignment="center"
                            padding={{ top: '1rem' }}
                            gap='0.25rem'
                            visible={false}
                            onClick={this.onViewMore}
                        >
                            <i-label caption="$read_more"
                                font={{ size: '0.9rem', color: Theme.colors.primary.main }}></i-label>
                            <i-icon name={"angle-down"} width={16} height={16}
                                fill={Theme.colors.primary.main}></i-icon>
                        </i-hstack>
                        <i-stack id="pnlLocked" direction="vertical" width="100%" gap="0.75rem" visible={false}>
                            <i-stack
                                direction="horizontal"
                                width="100%"
                                minHeight={150}
                                border={{ radius: '0.5rem' }}
                                background={{ color: Theme.background.paper }}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <i-icon width="1.5rem" height="1.5rem" name="lock" fill={Theme.text.primary}></i-icon>
                            </i-stack>
                            <i-button
                                id="btnUnlockPost"
                                width="100%"
                                minHeight={36}
                                padding={{ left: '1rem', right: '1rem' }}
                                font={{ color: Theme.colors.primary.contrastText, weight: 600 }}
                                border={{ radius: '0.5rem' }}
                                caption='$unlock'
                                onClick={this.handleUnlockPost}
                            ></i-button>
                        </i-stack>
                        <i-hstack
                            id="groupAnalysis"
                            horizontalAlignment="space-between"
                            padding={{ top: '0.563rem' }}
                            width={'100%'}
                            visible={!this.pinView}
                        />
                    </i-vstack>
                </i-panel>);

        } else {
            this.pnlGridPost.visible = true;
            this.pnlGridPost.insertBefore(
                <i-hstack id="pnlCommunity" padding={{ bottom: "0.75rem" }} margin={{ top: "-0.5rem" }} gap="0.75rem" visible={false}></i-hstack>,
                this.gridPost
            );
            this.gridPost.append(
                <i-panel
                    id="pnlActiveBd"
                    visible={false}
                    width={'0.25rem'} height={'100%'}
                    left="0px" top="0px"
                    border={{ radius: '0.25rem 0 0 0.25rem' }}
                    background={{ color: Theme.background.gradient }}
                ></i-panel>
            )
            this.gridPost.append(<i-panel id="pnlAvatar" grid={{ area: 'avatar' }}>
                <i-image
                    id="imgAvatar"
                    width={'2.75rem'} height={'2.75rem'}
                    display="block"
                    background={{ color: Theme.background.main }}
                    border={{ radius: '50%' }}
                    overflow={'hidden'}
                    objectFit='cover'
                    fallbackUrl={assets.fullPath('img/default_avatar.png')}
                    cursor="pointer"
                    onClick={() => this.onGoProfile()}
                ></i-image>
            </i-panel>);
            this.gridPost.append(<i-hstack horizontalAlignment="space-between" gap="0.5rem" width="100%"
                grid={{ area: 'user' }}
                position='relative'>
                <i-stack direction="vertical" minWidth={0} gap="0.375rem">
                    <i-panel id="pnlInfo" maxWidth={'100%'} overflow={'hidden'}></i-panel>
                    <i-stack id="pnlPublicLabel" direction="horizontal" alignItems="center" gap="0.25rem" visible={this.isPublicPostLabelShown}>
                        <i-icon
                            width="0.875rem"
                            height="0.875rem"
                            name="globe-americas"
                            display='inline-flex'
                            fill={Theme.text.secondary}
                        ></i-icon>
                        <i-label
                            caption="$public"
                            font={{ size: '0.875rem', color: Theme.text.secondary }}
                        ></i-label>
                    </i-stack>
                </i-stack>
                <i-hstack
                    id="pnlContext" stack={{ shrink: '0' }}
                    horizontalAlignment="end"
                    gap="0.5rem"
                    visible={!this.pinView}
                >
                    <i-panel
                        onClick={this.onProfileShown}
                        cursor="pointer"
                        class={hoverStyle}
                    >
                        <i-icon
                            name="ellipsis-h"
                            width={'1rem'}
                            height={'1rem'}
                            fill={Theme.text.secondary}
                        ></i-icon>
                    </i-panel>
                </i-hstack>
            </i-hstack>)
            this.gridPost.append(<i-hstack
                id="pnlReplyPath"
                verticalAlignment="center"
                gap="0.25rem" visible={false}
                grid={{ area: 'path' }}
                margin={{ top: '0.5rem' }}
            >
                <i-label caption="$replying_to" font={{ size: '0.875rem', color: Theme.colors.secondary.light }} />
                <i-label
                    id="lbReplyTo"
                    font={{ size: '0.875rem', color: Theme.colors.primary.main }}
                    cursor="pointer"
                    onClick={this.viewParentAuthor.bind(this)}
                />
            </i-hstack>)
            this.gridPost.append(<i-vstack width={'100%'} grid={{ area: 'content' }} margin={{ top: '1rem' }}>
                <i-panel id="pnlDetail">
                    <i-hstack id={"showMoreWrapper"}
                        visible={false}
                        height={50}
                        bottom={0}
                        width={'100%'}
                        zIndex={1}
                        background={{ color: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10, 10, 10) 100%)' }}
                        position={'absolute'}
                        justifyContent={'center'}
                        alignItems={'end'}>
                        <i-button id={"btnShowMore"} caption="$show_more" margin={{ bottom: 10 }} background={{ color: 'transparent' }} font={{ color: Theme.colors.primary.main, weight: 800, size: '1rem' }} boxShadow={'unset'} onClick={this.handleShowMoreClick.bind(this)} />
                    </i-hstack>
                    <i-vstack id="pnlContent" gap="0.75rem"></i-vstack>
                    {/*<i-button id={'btnShowMore'} background={{color: 'transparent'}} onClick={this.handleShowMoreClick.bind(this)} caption={"Show more..."} font={{color: Theme.colors.primary.main}} visible={false}></i-button>*/}
                    <i-vstack id="pnlQuoted" gap={'0.5rem'} visible={false} padding={{ top: '0.5rem' }}></i-vstack>
                    <i-panel
                        id="pnlOverlay"
                        visible={false}
                        height='5rem' width='100%'
                        position='absolute' bottom="0px"
                        background={{ color: `linear-gradient(0, var(--card-bg-color) 0%, transparent 100%)` }}
                    ></i-panel>
                </i-panel>
                <i-hstack
                    id="btnViewMore"
                    verticalAlignment="center"
                    padding={{ top: '1rem' }}
                    gap='0.25rem'
                    visible={false}
                    onClick={this.onViewMore}
                >
                    <i-label caption="$read_more"
                        font={{ size: '0.9rem', color: Theme.colors.primary.main }}></i-label>
                    <i-icon name={"angle-down"} width={16} height={16}
                        fill={Theme.colors.primary.main}></i-icon>
                </i-hstack>
                <i-stack id="pnlLocked" direction="vertical" width="100%" gap="0.75rem" visible={false}>
                    <i-stack
                        direction="horizontal"
                        width="100%"
                        minHeight={150}
                        border={{ radius: '0.5rem' }}
                        background={{ color: Theme.background.paper }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <i-icon width="1.5rem" height="1.5rem" name="lock" fill={Theme.text.primary}></i-icon>
                    </i-stack>
                    <i-button
                        id="btnUnlockPost"
                        width="100%"
                        minHeight={36}
                        padding={{ left: '1rem', right: '1rem' }}
                        font={{ color: Theme.colors.primary.contrastText, weight: 600 }}
                        border={{ radius: '0.5rem' }}
                        caption='$unlock'
                        onClick={this.handleUnlockPost}
                    ></i-button>
                </i-stack>
                <i-hstack
                    id="groupAnalysis"
                    horizontalAlignment="space-between"
                    padding={{ top: '0.563rem' }}
                    width={'100%'}
                    visible={!this.pinView}
                />
            </i-vstack>)
        }

        const lazyLoad = this.getAttribute('lazyLoad', true, false);
        if (!lazyLoad) {
            if (data) await this.setData({ data, isActive, type });
        }
        if (!this.bubbleMenu) {
            this.bubbleMenu = await ScomPostBubbleMenu.create() as ScomPostBubbleMenu;
        }

        if (this.overflowEllipse) {
            if ((this.isReply || this.limitHeight)) {
                this.classList.add(maxHeightStyle);
            }
            // if(this.isReply) {
            //     this.showMoreWrapper.height = '100%';
            // }
        }

        const resizeObserver = new ResizeObserver((entries) => {
            if ((this.isReply || this.limitHeight)
                && (
                    (this.pnlDetail.scrollHeight > this.pnlDetail.offsetHeight && this.pnlDetail.scrollHeight - this.pnlDetail.offsetHeight > 1)
                    || (this.gridPost.scrollHeight > this.gridPost.offsetHeight && this.gridPost.scrollHeight - this.gridPost.offsetHeight > 1)
                )
                && (this.pnlDetail.scrollHeight >= 400 || this.gridPost.scrollHeight >= 400)
            ) {
                if (this.type !== 'quoted' && !this.expanded)
                    this.showMoreWrapper.visible = true;
            }
        });
        resizeObserver.observe(this.pnlDetail);
        this.addEventListener("mouseup", this.showBubbleMenu);
    }

    private async showBubbleMenu(event: MouseEvent) {
        event.preventDefault();
        const selectedText = window.getSelection()?.toString() || '';

        if (selectedText?.trim()) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            this.bubbleMenu.openModal({
                showBackdrop: false,
                popupPlacement: 'top',
                position: 'fixed',
                zIndex: 999,
                minWidth: 0,
                width: 'max-content',
                height: '2.563rem',
                padding: { top: 0, left: 0, right: 0, bottom: 0 },
                closeOnBackdropClick: false,
                linkTo: range as unknown as Control
            })
        } else {
            this.bubbleMenu.closeModal();
        }
    }

    private handleShowMoreClick() {
        this.showMoreWrapper.visible = false;
        this.expanded = true;
        this.classList.remove(maxHeightStyle);
    }

    onHide(): void {
        this.removeEventListener("mouseup", this.showBubbleMenu);
    }

    render() {
        return (
            <i-vstack
                id="pnlWrapper"
                width="100%"
                border={{ radius: 'inherit', top: {width: 1, style: 'solid', color: Theme.divider} }}>
                {/*<i-hstack id={"showMoreWrapper"}*/}
                {/*          visible={false}*/}
                {/*          height={500}*/}
                {/*          width={'100%'}*/}
                {/*          zIndex={9999}*/}
                {/*          background={{color: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(102,102,102,.5) 90%, rgba(170,170,170,1) 100%)'}}*/}
                {/*          position={'absolute'}*/}
                {/*          justifyContent={'center'}*/}
                {/*          alignItems={'end'}>*/}
                {/*    <i-button id={"btnShowMore"} caption={"Show more"} margin={{bottom: 10}} background={{color: 'transparent'}} font={{color: Theme.colors.primary.main}} boxShadow={'unset'} onClick={this.handleShowMoreClick.bind(this)}/>*/}
                {/*</i-hstack>*/}
                <i-vstack
                    id="pnlGridPost"
                    width="100%"
                    padding={{ left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem' }}
                    border={{ radius: '0.5rem' }}
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }
                            }
                        }
                    ]}
                    visible={false}
                >
                    <i-stack id="pnlPinned" direction="horizontal" padding={{ bottom: "0.75rem" }} margin={{ top: "-0.5rem" }} gap="0.75rem" visible={false}>
                        <i-stack direction="horizontal" width="2.75rem" justifyContent="end">
                            <i-icon width="1rem" height="1rem" name="thumbtack" fill={Theme.text.secondary}></i-icon>
                        </i-stack>
                        <i-label caption="$pinned" font={{ size: "0.875rem", color: Theme.text.secondary }}></i-label>
                    </i-stack>
                    <i-stack id="pnlRepost" direction="horizontal" padding={{ bottom: "0.75rem" }} margin={{ top: "-0.5rem" }} gap="0.75rem" visible={false}></i-stack>
                    <i-grid-layout
                        id="gridPost"
                        // maxHeight={"calc(100vh - 50px - 94px)"}
                        // overflow={'hidden'}
                        templateColumns={['2.75rem', 'minmax(auto, calc(100% - 3.5rem))']}
                        templateRows={['1fr']}
                        gap={{ column: '0.75rem' }}
                        position='relative'
                    >
                    </i-grid-layout>
                </i-vstack>
                <i-panel
                    id={"pnlPost"}
                    position='relative'
                    border={{ radius: '0.5rem' }}
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }
                            }
                        }
                    ]}
                    visible={false}
                >
                </i-panel>
                <i-markdown id='markdownViewer' visible={false}></i-markdown>
            </i-vstack>
        );
    }
}
