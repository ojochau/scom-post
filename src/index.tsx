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
    IconName
} from '@ijstech/components';
import {
    getDuration,
    getEmbedElement,
    IPost,
    IPostData,
    IPostStats,
    IAuthor
} from './global';
import {getIconStyleClass, hoverStyle} from './index.css';
import assets from './assets';
import {ScomPostBubbleMenu} from './components/bubbleMenu';

const Theme = Styles.Theme.ThemeVars;

export {IPost, IPostData, IPostStats, IAuthor}

interface ScomPostElement extends ControlElement {
    data?: IPost;
    type?: PostType;
    isActive?: boolean;
    onReplyClicked?: callbackType;
    onProfileClicked?: callbackType;
    onQuotedPostClicked?: (target: ScomPost, event?: MouseEvent) => void;
    disableGutters?: boolean;
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

type PostType = 'full' | 'standard' | 'short' | 'quoted';
type callbackType = (target: Control, data: IPost, event?: Event) => void;

@customElements('i-scom-post')
export class ScomPost extends Module {
    private pnlInfo: Panel;
    private imgAvatar: Image;
    private lblOwner: Label;
    private lblUsername: Label;
    private lblDate: Label;
    private imgVerified: Image;
    private pnlQuoted: Panel;

    private pnlWrapper: Panel;
    private pnlMore: GridLayout;
    private pnlReply: VStack;
    private pnlReplies: VStack;
    private gridPost: GridLayout;
    private pnlPost: Panel;
    private btnViewMore: HStack;
    private pnlDetail: Panel;
    private pnlOverlay: Panel;
    private groupAnalysis: HStack;
    private pnlActiveBd: Panel;
    private pnlContent: Panel;
    private pnlReplyPath: Panel;
    private lbReplyTo: Label;
    private pnlSubscribe: Panel;
    private bubbleMenu: ScomPostBubbleMenu;
    private disableGutters: boolean;

    private _data: IPostConfig;
    private _replies: IPost[];
    public onReplyClicked: callbackType;
    public onProfileClicked: callbackType;
    public onQuotedPostClicked: (target: ScomPost, event?: MouseEvent) => void;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.onShowMore = this.onShowMore.bind(this);
        this.showBubbleMenu = this.showBubbleMenu.bind(this);
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
        this._data = {...data};
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

    clear() {
        this.pnlOverlay.visible = false;
        this.btnViewMore.visible = false;
        this.pnlContent.clearInnerHTML();
        this.pnlContent.minHeight = '5rem';
        if (this.pnlMore) {
            this.pnlMore.remove();
            this.pnlMore = undefined;
        }
        this._replies = [];
        this.pnlActiveBd.visible = false;
        this.pnlReplyPath.visible = false;
        this.pnlInfo.clearInnerHTML();
    }

    private async renderUI() {
        this.clear();
        const {stats, parentAuthor, contentElements} = this._data?.data || {};
        this.renderPostType();

        if (parentAuthor) {
            this.pnlReplyPath.visible = true;
            this.lbReplyTo.caption = parentAuthor.displayName || '';
        }
        this.pnlActiveBd.visible = this.isActive;
        this.gridPost.border.radius = this.isActive ? '0.25rem' : '0.5rem';
        this.gridPost.cursor = this.isActive ? 'default' : 'pointer';

        if (!this.isQuotedPost) this.renderAnalytics(stats);
        this.groupAnalysis.visible = !this.isQuotedPost;
        this.pnlSubscribe.visible = !this.isQuotedPost;

        // let _height = 0;
        if (contentElements?.length) {
            for (let item of contentElements) {
                if (item.category === 'quotedPost') {
                    this.addQuotedPost(item?.data?.properties);
                } else {
                    getEmbedElement(item, this.pnlContent, (elm: any) => {
                        // _height += Number(elm.height || 0);
                        // if (_height > MAX_HEIGHT && !this.btnViewMore.visible) {
                        //   this.pnlOverlay.visible = true;
                        //   this.btnViewMore.visible = true;
                        // }
                        this.pnlContent.minHeight = 'auto';
                    });
                }
            }
        }
    }

    private addQuotedPost(post: IPost) {
        const postEl = (
            <i-scom-post
                type="quoted"
                data={post}
                display="block"
                border={{radius: '0.5rem', width: '1px', style: 'solid', color: Theme.colors.secondary.dark}}
            ></i-scom-post>
        )
        postEl.onClick = this.onQuotedPostClicked;
        postEl.onQuotedPostClicked = this.onQuotedPostClicked;
        this.pnlQuoted.append(postEl);
        this.pnlQuoted.visible = true;
    }

    private renderInfo(oneLine?: boolean) {
        const {publishDate, author} = this.postData;
        this.imgAvatar.url = author?.avatar ?? '';
        this.imgAvatar.objectFit = 'cover';
        const imgWidth = this.isQuotedPost ? '1.75rem' : '2.75rem';
        this.imgAvatar.width = this.imgAvatar.height = imgWidth;
        const userEl = (
            <i-hstack verticalAlignment='center' gap="0.25rem">
                <i-label
                    id="lblOwner"
                    caption={author?.displayName || ''}
                    textOverflow="ellipsis"
                    maxWidth={this.isQuotedPost ? '9.375rem' : '6.25rem'}
                    font={{size: this.isQuotedPost ? '1rem' : '0.875rem', weight: 500}}
                    lineHeight={'0.875rem'}
                ></i-label>
                <i-icon
                    id="imgVerified"
                    width={'0.875rem'} height={'0.875rem'}
                    name="certificate"
                    fill={Theme.text.secondary}
                    display="inline-flex"
                ></i-icon>
            </i-hstack>
        );
        const dateEl = (
            <i-hstack gap={'0.25rem'} stack={{shrink: '0'}}>
                <i-panel border={{left: {width: '1px', style: 'solid', color: Theme.text.secondary}}}></i-panel>
                <i-label
                    id="lblDate"
                    font={{size: '0.875rem', color: Theme.text.secondary}}
                    caption={`${getDuration(publishDate)}`}
                    lineHeight={'0.875rem'}
                />
            </i-hstack>
        );
        const usernameEl = (
            <i-label
                id="lblUsername"
                caption={`${author?.internetIdentifier || ''}`}
                maxWidth={this.isQuotedPost ? '13.75rem' : '100%'}
                textOverflow="ellipsis"
                font={{size: this.isQuotedPost ? '1rem' : '0.875rem', color: Theme.text.secondary}}
                lineHeight={'0.875rem'}
            ></i-label>
        );
        if (oneLine) {
            this.pnlInfo.append(
                <i-hstack
                    height="100%"
                    gap="0.25rem"
                    verticalAlignment="center"
                >
                    {userEl}
                    {usernameEl}
                    {dateEl}
                </i-hstack>
            )
        } else {
            this.pnlInfo.append(
                <i-vstack gap="0.5rem">
                    <i-hstack gap="0.25rem" verticalAlignment="center">
                        {userEl}
                        {dateEl}
                    </i-hstack>
                    {usernameEl}
                </i-vstack>
            )
        }
    }

    private renderPostType() {
        if(!this.disableGutters) {
            this.gridPost.templateColumns = ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'];
            this.gridPost.templateRows = ['auto'];
        }
        this.gridPost.background.color = Theme.background.paper;
        if (this.isQuotedPost) {
            this.renderInfo(true);
            this.gridPost.templateAreas = [
                ['avatar', 'user'],
                ['avatar', 'path'],
                ['content', 'content']
            ]
            if(!this.disableGutters) {
                this.gridPost.templateColumns = ['1.75rem', 'minmax(auto, calc(100% - 4.5rem))'];
                this.gridPost.templateRows = ['1.75rem', 'auto'];
            }
            this.gridPost.background.color = Theme.background.default;
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

    private renderAnalytics(analytics: IPostStats) {
        const dataList = [
            {
                value: analytics?.replies || 0,
                name: 'Reply',
                icon: {name: "comment-alt"},
                hoveredColor: Theme.text.secondary,
                onClick: (target: Control, event: Event) => {
                    if (this.onReplyClicked) this.onReplyClicked(target, this.postData, event)
                }
            },
            {
                value: analytics?.upvotes || 0,
                name: 'Like',
                icon: {name: "heart"},
                hoveredColor: Theme.colors.error.main
            },
            {
                value: analytics?.reposts || 0,
                name: 'Repost',
                icon: {name: "retweet"},
                hoveredColor: Theme.colors.success.main
            }
        ]
        this.groupAnalysis.clearInnerHTML();
        for (let item of dataList) {
            const value = FormatUtils.formatNumber(item.value, {shortScale: true, decimalFigures: 0});
            let itemEl = (
                <i-hstack
                    verticalAlignment="center"
                    gap='0.5rem'
                    tooltip={{content: value, placement: 'bottomLeft'}}
                    cursor='pointer'
                    class={getIconStyleClass(item.hoveredColor)}
                >
                    <i-icon
                        width={'1rem'} height={'1rem'}
                        fill={Theme.text.secondary}
                        name={item.icon.name as IconName}
                    ></i-icon>
                    <i-label
                        caption={value}
                        font={{color: Theme.colors.secondary.light, size: '1.125rem'}}
                    ></i-label>
                </i-hstack>
            )
            this.groupAnalysis.appendChild(itemEl);
            itemEl.onClick = (target: Control, event: Event) => {
                if (item.onClick) item.onClick(itemEl, event);
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
        this.pnlReply = <i-vstack id="pnlReply" visible={!this.pnlMore}>
            <i-vstack id="pnlReplies" gap={'0.5rem'}></i-vstack>
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
        const childElm = <i-scom-post></i-scom-post> as ScomPost;
        childElm.onReplyClicked = this.onReplyClicked;
        childElm.onProfileClicked = this.onProfileClicked;
        childElm.onQuotedPostClicked = this.onQuotedPostClicked;
        childElm.parent = this.pnlReplies;
        if (isPrepend)
            this.pnlReplies.prepend(childElm);
        else this.pnlReplies.append(childElm);
        childElm.setData({data: reply});
        return childElm;
    }

    appendShowMorePanel() {
        this.pnlMore = (
            <i-grid-layout
                id="pnlMore"
                templateColumns={['2.75rem', 'minmax(auto, calc(100% - 3.5rem))']}
                gap={{column: 12}}
                padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
                onClick={this.onShowMore}
            >
                <i-vstack height={'1rem'} justifyContent="space-between" alignItems="center">
                    <i-panel width={2} height={2} background={{color: Theme.colors.secondary.light}}></i-panel>
                    <i-panel width={2} height={2} background={{color: Theme.colors.secondary.light}}></i-panel>
                    <i-panel width={2} height={2} background={{color: Theme.colors.secondary.light}}></i-panel>
                </i-vstack>
                <i-label caption='Show replies' font={{color: Theme.colors.primary.main, size: '0.9rem'}}></i-label>
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
        if (this.onProfileClicked) this.onProfileClicked(target, this.postData, event);
    }

    private onViewMore() {
        this.pnlDetail.style.maxHeight = '';
        this.pnlDetail.style.overflow = '';
        this.pnlOverlay.visible = false;
        this.btnViewMore.visible = false;
    }

    private onGoProfile() {
        if (this.postData?.author?.pubKey) {
            window.open(`#/p/${this.postData.author.pubKey}`, '_self');
        }
    }

    async init() {
        super.init();
        this.onReplyClicked = this.getAttribute('onReplyClicked', true) || this.onReplyClicked;
        this.onProfileClicked = this.getAttribute('onProfileClicked', true) || this.onProfileClicked;
        this.onQuotedPostClicked = this.getAttribute('onQuotedPostClicked', true) || this.onQuotedPostClicked;
        this.disableGutters = this.getAttribute('disableGutters', true) || this.disableGutters;
        const data = this.getAttribute('data', true);
        const isActive = this.getAttribute('isActive', true, false);
        const type = this.getAttribute('type', true);
        if (data) await this.setData({data, isActive, type});
        if (!this.bubbleMenu) {
            this.bubbleMenu = await ScomPostBubbleMenu.create() as ScomPostBubbleMenu;
        }
        this.addEventListener("mouseup", this.showBubbleMenu);
        let elm;
        if (this.disableGutters)
            elm = this.pnlPost;
        else
            elm = this.gridPost;
        elm.append(<i-panel>
            <i-panel
                id="pnlActiveBd"
                visible={false}
                width={'0.25rem'} height={'100%'}
                left="0px" top="0px"
                border={{radius: '0.25rem 0 0 0.25rem'}}
                background={{color: Theme.background.gradient}}
            ></i-panel>

            <i-hstack horizontalAlignment="space-between" gap="0.5rem" width="100%" grid={{area: 'user'}}
                      position='relative'>
                <i-hstack alignItems={'center'} gap={10}>
                    <i-panel id="pnlAvatar" grid={{area: 'avatar'}}>
                        <i-image
                            id="imgAvatar"
                            width={'2.75rem'} height={'2.75rem'}
                            display="block"
                            background={{color: Theme.background.main}}
                            border={{radius: '50%'}}
                            overflow={'hidden'}
                            objectFit='cover'
                            fallbackUrl={assets.fullPath('img/default_avatar.png')}
                            onClick={() => this.onGoProfile()}
                        ></i-image>
                    </i-panel>
                    <i-panel id="pnlInfo" maxWidth={'100%'} overflow={'hidden'}></i-panel>
                </i-hstack>
                <i-hstack
                    id="pnlSubscribe" stack={{shrink: '0'}}
                    horizontalAlignment="end"
                    gap="0.5rem"
                >
                    <i-button
                        id="btnSubscribe"
                        minHeight={32}
                        padding={{left: '1rem', right: '1rem'}}
                        background={{color: Theme.colors.primary.main}}
                        font={{color: Theme.colors.primary.contrastText}}
                        border={{radius: '1.875rem'}}
                        visible={false}
                        caption='Subscribe'
                    ></i-button>
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
                grid={{area: 'path'}}
                margin={{top: '0.5rem'}}
            >
                <i-label caption='replying to' font={{size: '0.875rem', color: Theme.colors.secondary.light}}/>
                <i-label
                    id="lbReplyTo"
                    font={{size: '0.875rem', color: Theme.colors.primary.main}}
                    cursor="pointer"
                    onClick={() => this.onGoProfile()}
                />
            </i-hstack>
            <i-vstack width={'100%'} grid={{area: 'content'}} margin={{top: '1rem'}}>
                <i-panel
                    id="pnlDetail"
                    // maxHeight={MAX_HEIGHT}
                    // overflow={'hidden'}
                >
                    <i-vstack id="pnlContent" gap="0.75rem"></i-vstack>
                    <i-panel id="pnlQuoted" visible={false}></i-panel>
                    <i-panel
                        id="pnlOverlay"
                        visible={false}
                        height='5rem' width='100%'
                        position='absolute' bottom="0px"
                        background={{color: `linear-gradient(0, var(--card-bg-color) 0%, transparent 100%)`}}
                    ></i-panel>
                </i-panel>
                <i-hstack
                    id="btnViewMore"
                    verticalAlignment="center"
                    padding={{top: '1rem'}}
                    gap='0.25rem'
                    visible={false}
                    onClick={this.onViewMore}
                >
                    <i-label caption={'Read more'}
                             font={{size: '0.9rem', color: Theme.colors.primary.main}}></i-label>
                    <i-icon name={"angle-down"} width={16} height={16}
                            fill={Theme.colors.primary.main}></i-icon>
                </i-hstack>
                <i-hstack
                    id="groupAnalysis"
                    horizontalAlignment="space-between"
                    padding={{top: '1.063rem'}}
                    width={'100%'}
                />
            </i-vstack>
        </i-panel>)

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
                zIndex: 9999,
                minWidth: 0,
                width: 'max-content',
                height: '2.563rem',
                padding: {top: 0, left: 0, right: 0, bottom: 0},
                closeOnBackdropClick: false,
                linkTo: range as unknown as Control
            })
        } else {
            this.bubbleMenu.closeModal();
        }
    }

    onHide(): void {
        this.removeEventListener("mouseup", this.showBubbleMenu);
    }

    private renderWithoutGutter() {

    }

    render() {
        return (
            <i-vstack
                id="pnlWrapper"
                width="100%"
                border={{radius: 'inherit'}}>
                <i-grid-layout
                    id="gridPost"
                    templateColumns={['2.75rem', 'minmax(auto, calc(100% - 3.5rem))']}
                    templateRows={['auto']}
                    gap={{column: '0.75rem'}}
                    padding={{left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem'}}
                    position='relative'
                    border={{radius: '0.5rem'}}
                    visible
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: {left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}
                            }
                        }
                    ]}
                >

                </i-grid-layout>
                <i-panel
                    id={"pnlPost"}
                    padding={{left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem'}}
                    position='relative'
                    border={{radius: '0.5rem'}}
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: {left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}
                            }
                        }
                    ]}
                    visible={false}
                >

                </i-panel>
            </i-vstack>
        );
    }
}
