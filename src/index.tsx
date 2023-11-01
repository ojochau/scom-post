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
  VStack
} from '@ijstech/components';
import {
  getDuration,
  getEmbedElement,
  IPost,
  IPostData,
  IPostStat,
  IAuthor
} from './global';
import { getIconStyleClass, hoverStyle } from './index.css';
import assets from './assets';
const Theme = Styles.Theme.ThemeVars;

export { IPost, IPostData, IPostStat, IAuthor }
interface ScomPostElement extends ControlElement {
  data?: IPost;
  type?: PostType;
  isActive?: boolean;
  onReplyClicked?: callbackType;
  onProfileClicked?: callbackType;
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

type PostType = 'full' | 'standard' | 'short';
type callbackType = (target: Control, data: IPost) => void;

@customElements('i-scom-post')
export class ScomPost extends Module {
  private pnlInfo: GridLayout;
  private imgAvatar: Image;
  private lblOwner: Label;
  private lblUsername: Label;
  private lblDate: Label;
  private imgVerified: Image;

  private pnlWrapper: Panel;
  private pnlMore: GridLayout;
  private pnlReply: VStack;
  private pnlReplies: VStack;
  private gridPost: GridLayout;
  private btnViewMore: HStack;
  private pnlDetail: Panel;
  private pnlOverlay: Panel;
  private groupAnalysis: HStack;
  private pnlActiveBd: Panel;
  private pnlContent: Panel;
  private pnlReplyPath: Panel;
  private lbReplyTo: Label;

  private _data: IPostConfig;
  private _replies: IPost[];
  public onReplyClicked: callbackType;
  public onProfileClicked: callbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onShowMore = this.onShowMore.bind(this);
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

  get isFullType() {
    return this.type === 'full';
  }

  clear() {
    this.imgAvatar.url = "";
    this.lblOwner.caption = "";
    this.lblUsername.caption = "";
    this.lblDate.caption = "";
    this.pnlOverlay.visible = false;
    this.btnViewMore.visible = false;
    this.pnlContent.clearInnerHTML();
    this.pnlContent.minHeight = '12rem';
    if (this.pnlMore) {
      this.pnlMore.remove();
      this.pnlMore = undefined;
    }
    this._replies = [];
    this.pnlActiveBd.visible = false;
    this.imgVerified.visible = false;
    this.pnlReplyPath.visible = false;
  }

  private async renderUI() {
    this.clear();
    const { stat, publishDate, author, replyTo, data, quotedPosts = [] } = this._data?.data || {};

    this.renderPostType();

    this.lblOwner.caption = author?.id || '';
    this.lblUsername.caption = `${author?.username || ''}`;
    this.lblUsername.link.href = '';
    this.imgAvatar.url = author?.avatar ?? '';
    this.lblDate.caption = `${getDuration(publishDate)}`;
    this.imgVerified.visible = true;
    this.imgVerified.display = 'flex';

    // this.renderQuotedPosts(quotedPosts);

    if (replyTo && !this.isActive) {
      this.pnlReplyPath.visible = true;
      this.lblUsername.visible = false;
      this.lbReplyTo.caption = replyTo?.author?.username;
      this.lbReplyTo.link.href = `#/p/${replyTo?.author?.pubKey || ''}`;
    }

    this.pnlActiveBd.visible = this.isActive;
    this.gridPost.border.radius = this.isActive ? '0.25rem' : '0.5rem';
  
    this.renderAnalytics(stat);

    // let _height = 0;
    if (data?.length) {
      for (let item of data) {
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

  private renderPostType() {
    if (this.isFullType) {
      this.gridPost.templateAreas = [
        ['avatar', 'user'],
        ['avatar', 'path'],
        ['content', 'content']
      ]
      this.pnlInfo.templateAreas = [
        ['name', 'username', 'date']
      ]
    } else if (this.type === 'short') {
      this.gridPost.templateAreas = [
        ['avatar', 'user'],
        ['avatar', 'path'],
        ['avatar', 'content']
      ]
      this.pnlInfo.templateAreas = [
        ['name', 'date'],
        ['username', 'username']
      ]
    } else {
      this.gridPost.templateAreas = [
        ['avatar', 'user'],
        ['avatar', 'path'],
        ['avatar', 'content']
      ]
      this.pnlInfo.templateAreas = [
        ['name', 'username', 'date']
      ]
    }
  }

  // private renderQuotedPosts(posts: IPost[]) {
  //   if (!posts?.length) return;
  //   for (let post of posts) {
  //     const postEl = <i-scom-post margin={{bottom: '0.5rem'}} display='block'></i-scom-post> as ScomPost;
  //     postEl.onReplyClicked = this.onReplyClicked;
  //     postEl.onProfileClicked = this.onProfileClicked;
  //     this.insertAdjacentElement('afterbegin', postEl);
  //     postEl.setData({ data: post });
  //   }
  // }

  private renderAnalytics(analytics: any) {
    const dataList = [
      {
        value: analytics?.reply || 0,
        name: 'Reply',
        icon: assets.fullPath('img/reply.svg'),
        hoveredIcon: assets.fullPath('img/reply_fill.svg'),
        hoveredColor: Theme.text.secondary,
        onClick: (target: Control) => {
          if (this.onReplyClicked) this.onReplyClicked(target, this.postData)
        }
      },
      {
        value: analytics?.bookmark || 0,
        name: 'Zap',
        icon: assets.fullPath('img/zap.svg'),
        hoveredIcon: assets.fullPath('img/zap_fill.svg'),
        hoveredColor: Theme.colors.warning.main
      },
      {
        value: analytics?.upvote || 0,
        name: 'Like',
        icon: assets.fullPath('img/like.svg'),
        hoveredIcon: assets.fullPath('img/like_fill.svg'),
        hoveredColor: Theme.colors.error.main
      },
      {
        value: analytics?.repost || 0,
        name: 'Repost',
        icon: assets.fullPath('img/repost.svg'),
        hoveredIcon: assets.fullPath('img/repost_fill.svg'),
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
          class={getIconStyleClass(item.hoveredIcon, item.hoveredColor)}
        >
          <i-panel
            width={'1rem'} height={'1rem'}
            background={{image: item.icon}}
            display="inline-flex"
          ></i-panel>
          <i-label
            caption={value}
            font={{color: Theme.colors.secondary.light, size: '1.125rem'}}
          ></i-label>
        </i-hstack>
      )
      this.groupAnalysis.appendChild(itemEl);
      itemEl.onClick = () => {
        if (item.onClick) item.onClick(itemEl);
      }
    }
  }

  addReply(parentPostId: string, post: IPost) {
    if (parentPostId !== this.postData.id) return;
    post.replyTo = {...this.postData};
    if (!this.pnlReply) this.appendReplyPanel();
    this._replies.push(post);
    return this.renderReply(post, true);
  };

  appendReplyPanel(){
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
    childElm.parent = this.pnlReplies;
    if (isPrepend)
      this.pnlReplies.prepend(childElm);
    else this.pnlReplies.append(childElm);
    childElm.setData({data: reply});
    return childElm;
  }

  appendShowMorePanel(){
    this.pnlMore = (
      <i-grid-layout
        id="pnlMore"
        templateColumns={['2.75rem', 'auto']}
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

  private onProfileShown(target: Control) {
    if (this.onProfileClicked) this.onProfileClicked(target, this.postData);
  }

  private onViewMore() {
    this.pnlDetail.style.maxHeight = '';
    this.pnlDetail.style.overflow = '';
    this.pnlOverlay.visible = false;
    this.btnViewMore.visible = false;
  }

  async init() {
    super.init();
    this.onReplyClicked = this.getAttribute('onReplyClicked', true) || this.onReplyClicked;
    this.onProfileClicked = this.getAttribute('onProfileClicked', true) || this.onProfileClicked;
    const data = this.getAttribute('data', true);
    const isActive = this.getAttribute('isActive', true, false);
    const type = this.getAttribute('type', true);
    if (data) await this.setData({data, isActive, type});
  }

  render() {
    return (
      <i-vstack
        id="pnlWrapper"
        width="100%" cursor="pointer"
        border={{radius: 'inherit'}}
      >
        <i-grid-layout
          id="gridPost"
          templateColumns={['2.75rem', 'auto']}
          templateRows={['auto']}
          gap={{column: '0.75rem'}}
          padding={{left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem'}}
          position='relative'
          border={{radius: '0.5rem'}}
          background={{color: Theme.background.paper}}
        >
          <i-panel
            id="pnlActiveBd"
            visible={false}
            width={'0.25rem'} height={'100%'}
            left="0px" top="0px"
            border={{radius: '0.25rem 0 0 0.25rem'}}
            background={{color: Theme.background.gradient}}
          ></i-panel>
          <i-panel id="pnlAvatar" grid={{area: 'avatar'}}>
            <i-image
              id="imgAvatar"
              width={'2.75rem'} height={'2.75rem'}
              display="block"
              background={{color: Theme.background.gradient}}
              border={{radius: '50%'}}
              overflow={'hidden'}
              objectFit='cover'
              fallbackUrl={assets.fullPath('img/default_avatar.svg')}
            ></i-image>
          </i-panel>
          <i-hstack horizontalAlignment="space-between" gap="0.5rem" width="100%" grid={{area: 'user'}} position='relative'>
            <i-grid-layout
              id="pnlInfo"
              templateRows={['max-content']}
              templateColumns={['auto']}
              gap={{column: '0.25rem', row: '0.5rem'}}
            >
              <i-hstack verticalAlignment='center' gap="0.25rem" grid={{area: 'name'}}>
                <i-label id="lblOwner" textOverflow="ellipsis" font={{ size: '0.875rem', weight: 500 }}></i-label>
                <i-image
                  id="imgVerified"
                  url={assets.fullPath('img/verified.svg')}
                  width={'0.875rem'} height={'0.875rem'}
                  visible={false}
                ></i-image>
              </i-hstack>
              <i-hstack gap={'0.25rem'} grid={{area: 'date'}}>
                <i-panel border={{left: {width: '1px', style: 'solid', color: Theme.text.secondary}}}></i-panel>
                <i-label id="lblDate" font={{ size: '0.875rem', color: Theme.text.secondary }} />
              </i-hstack>
              <i-label id="lblUsername" textOverflow="ellipsis" font={{color: Theme.text.secondary}}></i-label>
            </i-grid-layout>
            <i-hstack
              id="pnlSubscribe" stack={{basis: '30%'}}
              horizontalAlignment="end"
              gap="0.5rem"
              position="absolute" top={'-0.25rem'} right={'0px'}
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
              <i-panel onClick={this.onProfileShown}>
                <i-icon
                  name="ellipsis-h"
                  width={'1rem'}
                  height={'1rem'}
                  fill={Theme.text.secondary}
                  class={hoverStyle}
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
            <i-label caption='replying to' font={{ size: '0.875rem', color: Theme.colors.secondary.light }} />
            <i-label id="lbReplyTo" caption='' font={{ size: '0.875rem', color: Theme.colors.primary.main }} link={{href: '#'}} />
          </i-hstack>
          <i-vstack width={'100%'} grid={{area: 'content'}} margin={{top: '1rem'}}>
            <i-panel
              id="pnlDetail"
              // maxHeight={MAX_HEIGHT}
              // overflow={'hidden'}
            >
              <i-vstack id="pnlContent" gap="0.75rem"></i-vstack>
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
              <i-label caption={'Read more'} font={{size: '0.9rem', color: Theme.colors.primary.main}}></i-label>
              <i-icon name={"angle-down"} width={16} height={16} fill={Theme.colors.primary.main}></i-icon>
            </i-hstack>

            <i-hstack
              id="groupAnalysis"
              horizontalAlignment="space-between"
              padding={{top: '1.063rem'}}
              width={'100%'}
            />
          </i-vstack>
        </i-grid-layout>
      </i-vstack>
    );
  }
}
