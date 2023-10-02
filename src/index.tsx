import {
  ControlElement,
  customElements,
  customModule,
  Module,
  Styles,
  Image,
  Label,
  VStack,
  Container,
  FormatUtils,
  Markdown,
  Panel,
  GridLayout,
  HStack,
  Control,
  IconName
} from '@ijstech/components';
import { analyticStyle, customStyles } from './index.css';
import { IPostAnalytics, IPostData } from './global/interface';
import { formatNumber, getDuration } from './global/index';
import ScomPageViewer from '@scom/scom-page-viewer';
import { spinnerStyle, labelStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

type onReplyClickedCallback = (data: IPostData) => void;

interface ScomPostElement extends ControlElement {
  data: IPostData;
  isAnalyticsShown?: boolean;
  isBorderShown?: boolean;
  theme?: Markdown["theme"];
}

const MAX_HEIGHT = 352;

interface IPostConfig {
  data: IPostData;
  isBorderShown?: boolean;
  isAnalyticsShown?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-post']: ScomPostElement;
    }
  }
}

@customModule
@customElements('i-scom-post')
export default class ScomPost extends Module {
  private imgAvatar: Image;
  private lblOwner: Label;
  private lblUsername: Label;
  private pnlLoader: VStack;
  private lblDate: Label;
  private pageViewer: ScomPageViewer;
  private pnlAvatar: Panel;
  private gridPost: GridLayout;
  private btnViewMore: HStack;
  private pnlStatusDetail: Panel;
  private pnlOverlay: Panel;
  private groupAnalysis: HStack;

  private _data: IPostConfig;

  public onReplyClicked: onReplyClickedCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomPostElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get isAnalyticsShown() {
    return this._data.isAnalyticsShown ?? true;
  }
  set isAnalyticsShown(value: boolean) {
    this._data.isAnalyticsShown = value ?? true;
  }

  get isBorderShown() {
    return this._data.isBorderShown ?? false;
  }
  set isBorderShown(value: boolean) {
    this._data.isBorderShown = value ?? false;
  }

  set theme(value: Markdown["theme"]) {
    if (this.pageViewer) this.pageViewer.theme = value;
  }

  async setData(data: IPostConfig) {
    this._data = {...data};
    await this.renderUI();
  }

  getData() {
    return this._data;
  }

  clear() {
    this.imgAvatar.url = "";
    this.lblOwner.caption = "";
    this.lblUsername.caption = "";
    this.lblDate.caption = "";
    this.pageViewer.setData({} as any);
    this.pnlAvatar.classList.remove('has-border');
    this.groupAnalysis.visible = false;
    this.pnlOverlay.visible = false;
    this.btnViewMore.visible = false;
  }

  private async renderUI() {
    this.clear();
    const { analytics, owner, publishDate, dataUri, username, avatar } = this._data.data || {};
    this.lblOwner.caption = FormatUtils.truncateWalletAddress(owner);
    this.lblUsername.caption = `@${username}`;
    this.lblUsername.link.href = '';
    this.lblDate.caption = `. ${getDuration(publishDate)}`;
    this.imgAvatar.url = avatar ?? '';
    if (dataUri) {
      this.pnlLoader.visible = true;
      await this.pageViewer.setData({ cid: dataUri + "/scconfig.json" } as any);
      this.pageViewer.style.setProperty('--custom-background-color', 'transparent');
      this.pnlLoader.visible = false;
    }
    if (this.isBorderShown) {
      this.pnlAvatar.classList.add('has-border');
      // this.gridPost.padding = {top: '0px', left: '0px', right: '0px'};
    } else {
      // this.gridPost.padding = {top: '0.75rem', left: '1rem', right: '1rem'};
      this.pnlAvatar.classList.remove('has-border');
    }
    const maxHeight = this.maxHeight ? Number(this.maxHeight) : MAX_HEIGHT;
    if (this.pnlStatusDetail.scrollHeight > maxHeight) {
      this.pnlOverlay.visible = true;
      this.btnViewMore.visible = true;
    }
    this.groupAnalysis.visible = this.isAnalyticsShown;
    if (this.isAnalyticsShown) this.renderAnalytics(analytics);
  }

  private renderAnalytics(analytics: IPostAnalytics) {
    const listData = [
      {
        value: analytics?.reply || 0,
        name: 'Reply',
        icon: 'comment',
        onClick: () => {
          if (this.onReplyClicked) this.onReplyClicked({...this._data.data})
        },
      },
      {
        value: analytics?.repost || 0,
        name: 'Repost',
        icon: 'retweet',
        class: 'green-icon',
      },
      {
        name: 'Vote',
        onRender: () => {
          let voteQty = Number(analytics?.voted || 0);
          const lb = (
            <i-label
              caption={formatNumber(voteQty, 0)}
              font={{ color: Theme.text.secondary, size: '0.813rem' }}
            ></i-label>
          );
          return (
            <i-hstack
              verticalAlignment="center"
              tooltip={{ content: 'Upvote/downvote', placement: 'bottomLeft' }}
              class="analytic"
            >
              <i-icon
                name={'arrow-up'}
                width={34}
                height={34}
                fill={Theme.text.secondary}
                border={{ radius: '50%' }}
                class="hovered-icon"
                padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onClick={() => {
                  lb.caption = formatNumber(++voteQty, 0);
                }}
              ></i-icon>
              {lb}
              <i-icon
                name={'arrow-down'}
                width={34}
                height={34}
                fill={Theme.text.secondary}
                border={{ radius: '50%' }}
                class="hovered-icon"
                padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onClick={() => {
                  lb.caption = formatNumber(--voteQty, 0);
                }}
              ></i-icon>
            </i-hstack>
          );
        },
        class: 'red-icon',
      },
      {
        value: analytics?.bookmark || 0,
        name: 'Bookmark',
        icon: 'bookmark',
      }
    ]
    this.groupAnalysis.clearInnerHTML();
    for (let item of listData) {
      let itemEl: Control;
      if (item.onRender) {
        itemEl = item.onRender();
      } else {
        itemEl = (
          <i-hstack
            verticalAlignment="center"
            tooltip={{content: item.name || '', placement: 'bottomLeft'}}
            class="analytic"
          >
            <i-icon
              name={item.icon as IconName} width={34} height={34} fill={Theme.text.secondary}
              border={{radius: '50%'}}
              padding={{top: 8, bottom: 8, left: 8, right: 8}}
            ></i-icon>
            <i-label
              caption={formatNumber(item.value, 0)}
              font={{color: Theme.text.secondary, size: '0.813rem'}}
            ></i-label>
          </i-hstack>
        )
      }
      this.groupAnalysis.appendChild(itemEl);
      if (item.class) itemEl.classList.add(item.class);
      itemEl.onClick = () => {
        if (item.onClick) item.onClick();
      }
    }
    this.groupAnalysis.appendChild(
      <i-hstack class="analytic">
          <i-icon
            name={'share-square'} width={34} height={34} fill={Theme.text.secondary}
            border={{radius: '50%'}}
            padding={{top: 8, bottom: 8, left: 8, right: 8}}
          ></i-icon>
      </i-hstack>
    )
  }

  private onViewMore() {
    this.pnlStatusDetail.style.maxHeight = '';
    this.pnlStatusDetail.style.overflow = '';
    this.pnlOverlay.visible = false;
    this.btnViewMore.visible = false;
  }

  async init() {
    super.init();
    this.onReplyClicked = this.getAttribute('onReplyClicked', true) || this.onReplyClicked;
    const data = this.getAttribute('data', true);
    const isBorderShown = this.getAttribute('isBorderShown', true, false);
    const isAnalyticsShown = this.getAttribute('isAnalyticsShown', true, true);
    await this.setData({data, isBorderShown, isAnalyticsShown});
    const theme = this.getAttribute('theme', true);
    if (theme) this.theme = theme;
  }

  render() {
    return (
      <i-vstack width="100%" class={customStyles}>
        <i-grid-layout
          id="gridPost"
          templateColumns={['40px', 'auto']}
          gap={{column: '12px'}}
          class="post-body"
        >
          <i-panel id="pnlAvatar">
            <i-image
              id="imgAvatar"
              width={36} height={36}
              display="block"
              background={{color: Theme.background.gradient}}
              border={{radius: '50%'}}
              overflow={'hidden'}
              stack={{shrink: '0'}}
              class={'avatar'}
            ></i-image>
          </i-panel>
          <i-vstack width={'100%'} gap="12px">
            <i-hstack verticalAlignment="center" horizontalAlignment="space-between" gap="0.5rem" width="100%">
              <i-hstack stack={{basis: '50%'}} gap={'0.5rem'} verticalAlignment="center" wrap="wrap">
                <i-label id="lblOwner" class={labelStyle} font={{ size: '1rem', weight: 700 }}></i-label>
                <i-label id="lblUsername" class={labelStyle} font={{size: '1rem', color: Theme.text.secondary}}></i-label>
                <i-label id="lblDate" font={{ size: '1rem', color: Theme.text.secondary }} />
              </i-hstack>
              <i-hstack stack={{basis: '50%'}} verticalAlignment="center" horizontalAlignment="end" gap="0.5rem">
                <i-button
                  id="btnSubscribe"
                  minHeight={32}
                  padding={{ left: '1rem', right: '1rem' }}
                  background={{ color: Theme.colors.secondary.main }}
                  font={{ color: Theme.colors.primary.contrastText, weight: 700, size: '0.875rem' }}
                  border={{ radius: '30px' }}
                  caption="Subscribe"
                ></i-button>
                <i-icon
                  name="ellipsis-h"
                  width={34}
                  height={34}
                  fill={Theme.text.secondary}
                  padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  border={{ radius: '50%' }}
                  class="hovered-icon"
                ></i-icon>
              </i-hstack>
            </i-hstack>
            <i-panel
              id="pnlStatusDetail"
              maxHeight={MAX_HEIGHT}
              overflow={'hidden'}
            >
              <i-vstack
                id="pnlLoader"
                width="100%"
                height="100%"
                minHeight={300}
                horizontalAlignment="center"
                verticalAlignment="center"
                padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
                visible={false}
              >
                <i-panel class={spinnerStyle}></i-panel>
              </i-vstack>
              <i-scom-page-viewer id="pageViewer" />
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
              padding={{top: '1.5rem'}}
              gap='0.5rem'
              visible={false}
              onClick={this.onViewMore}
            >
              <i-label caption={'Read more'} font={{size: '1rem', color: Theme.colors.primary.main}}></i-label>
              <i-icon name={"angle-down"} width={16} height={16} fill={Theme.colors.primary.main}></i-icon>
            </i-hstack>
            <i-hstack
              id="groupAnalysis"
              horizontalAlignment="space-between"
              padding={{top: '1rem', bottom: '1rem'}}
              width={'100%'}
              class={analyticStyle}
            />
          </i-vstack>
        </i-grid-layout>
      </i-vstack>
    );
  }
}
