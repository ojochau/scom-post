var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-post/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.analyticStyle = exports.customStyles = exports.multiLineTextStyle = exports.labelStyle = exports.spinnerStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    const spin = components_1.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    exports.spinnerStyle = components_1.Styles.style({
        display: "inline-block",
        width: "2.5rem",
        height: "2.5rem",
        border: "3px solid transparent",
        borderRadius: "50%",
        borderTopColor: Theme.colors.primary.main,
        borderRightColor: Theme.colors.primary.main,
        "animation": `${spin} 0.46s linear infinite`,
        "-webkit-animation": `${spin} 0.46s linear infinite`
    });
    exports.labelStyle = components_1.Styles.style({
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    });
    exports.multiLineTextStyle = components_1.Styles.style({
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    });
    exports.customStyles = components_1.Styles.style({
        cursor: 'pointer',
        $nest: {
            '.has-border:after': {
                content: "''",
                position: 'absolute',
                width: 2,
                height: 'calc(100% - 2.5rem)',
                display: 'block',
                backgroundColor: Theme.divider,
                opacity: 0.5,
                transform: 'translateX(-50%)',
                left: '18px',
                top: '2.5rem'
            },
            '.hovered-icon': {
                transition: 'background 0.3s ease-in'
            },
            '.hovered-icon:hover': {
                borderRadius: '50%',
                background: Theme.colors.primary.light,
                $nest: {
                    'svg': {
                        fill: `${Theme.colors.primary.main} !important`
                    }
                }
            },
            '.avatar img': {
                objectFit: 'cover'
            }
        }
    });
    exports.analyticStyle = components_1.Styles.style({
        $nest: {
            'i-icon': {
                transition: 'background 0.3s ease-in'
            },
            'i-label': {
                transition: 'color 0.3s ease-in'
            },
            '.analytic:hover': {
                $nest: {
                    'i-icon': {
                        background: Theme.colors.primary.light,
                        borderRadius: '50%'
                    },
                    'i-icon svg': {
                        fill: `${Theme.colors.primary.main}!important`
                    },
                    'i-label': {
                        color: `${Theme.colors.primary.main}!important`
                    }
                }
            },
            '.green-icon:hover': {
                $nest: {
                    'i-icon': {
                        background: Theme.colors.success.light,
                        borderRadius: '50%'
                    },
                    'i-icon svg': {
                        fill: `${Theme.colors.success.main}!important`
                    },
                    'i-label': {
                        color: `${Theme.colors.success.main}!important`
                    }
                }
            },
            '.red-icon:hover': {
                $nest: {
                    'i-icon': {
                        background: Theme.colors.error.light,
                        borderRadius: '50%'
                    },
                    'i-icon svg': {
                        fill: `${Theme.colors.error.main}!important`
                    },
                    'i-label': {
                        color: `${Theme.colors.error.main}!important`
                    }
                }
            }
        }
    });
});
///<amd-module name='@scom/scom-post/global/interface.ts'/> 
// import { Control, IconName } from "@ijstech/components";
define("@scom/scom-post/global/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// export interface IAnalytic {
//   name: string;
//   value?: number|string;
//   icon?: IconName;
//   class?: string;
//   onRender?: () => Control;
//   onClick?: () => void
// }
define("@scom/scom-post/store/index.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromJson = exports.state = void 0;
    ///<amd-module name='@scom/scom-post/store/index.ts'/> 
    exports.state = {
        ipfsGatewayUrl: ""
    };
    const setDataFromJson = (options) => {
        if (options.ipfsGatewayUrl) {
            (0, exports.setIPFSGatewayUrl)(options.ipfsGatewayUrl);
        }
    };
    exports.setDataFromJson = setDataFromJson;
    const setIPFSGatewayUrl = (url) => {
        exports.state.ipfsGatewayUrl = url;
    };
    exports.setIPFSGatewayUrl = setIPFSGatewayUrl;
    const getIPFSGatewayUrl = () => {
        return exports.state.ipfsGatewayUrl;
    };
    exports.getIPFSGatewayUrl = getIPFSGatewayUrl;
});
define("@scom/scom-post/global/utils.ts", ["require", "exports", "@ijstech/components", "@scom/scom-post/store/index.ts"], function (require, exports, components_2, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDuration = exports.formatNumber = exports.getImageIpfsUrl = void 0;
    const getImageIpfsUrl = (url) => {
        const ipfsBaseUrl = (0, index_1.getIPFSGatewayUrl)();
        if (isIpfsCid(url))
            return ipfsBaseUrl + url;
        return url;
    };
    exports.getImageIpfsUrl = getImageIpfsUrl;
    const isIpfsCid = (value) => {
        const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
        return regex.test(value);
    };
    const formatNumber = (value, decimal) => {
        const numberValue = Number(value);
        if (numberValue >= 10000) {
            return components_2.FormatUtils.formatNumber(value, { shortScale: true, decimalFigures: decimal !== null && decimal !== void 0 ? decimal : 0 });
        }
        return components_2.FormatUtils.formatNumber(value, { decimalFigures: decimal !== null && decimal !== void 0 ? decimal : 0 });
    };
    exports.formatNumber = formatNumber;
    const getDuration = (date) => {
        const startDate = components_2.FormatUtils.unixToFormattedDate(date);
        const endDate = (0, components_2.moment)(new Date());
        let duration = components_2.moment.duration(endDate.diff(startDate));
        let days = duration.asDays();
        if (days >= 1)
            return components_2.moment.unix(date).format('MMM DD');
        let hours = duration.asHours();
        if (hours >= 1)
            return `${formatNumber(hours, 0)}h`;
        let minutes = duration.asMinutes();
        if (minutes >= 1)
            return `${formatNumber(minutes, 0)}m`;
        let seconds = duration.asSeconds();
        return `${formatNumber(seconds, 0)}s`;
    };
    exports.getDuration = getDuration;
});
define("@scom/scom-post/global/index.ts", ["require", "exports", "@scom/scom-post/global/utils.ts", "@scom/scom-post/global/interface.ts"], function (require, exports, utils_1, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-post/global/index.ts'/> 
    __exportStar(utils_1, exports);
    __exportStar(interface_1, exports);
});
define("@scom/scom-post", ["require", "exports", "@ijstech/components", "@scom/scom-post/index.css.ts", "@scom/scom-post/global/index.ts", "@scom/scom-post/index.css.ts"], function (require, exports, components_3, index_css_1, index_2, index_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    const MAX_HEIGHT = 352;
    let ScomPost = class ScomPost extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get isAnalyticsShown() {
            var _a;
            return (_a = this._data.isAnalyticsShown) !== null && _a !== void 0 ? _a : true;
        }
        set isAnalyticsShown(value) {
            this._data.isAnalyticsShown = value !== null && value !== void 0 ? value : true;
        }
        get isBorderShown() {
            var _a;
            return (_a = this._data.isBorderShown) !== null && _a !== void 0 ? _a : false;
        }
        set isBorderShown(value) {
            this._data.isBorderShown = value !== null && value !== void 0 ? value : false;
        }
        set theme(value) {
            if (this.pageViewer)
                this.pageViewer.theme = value;
        }
        async setData(data) {
            this._data = Object.assign({}, data);
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
            this.pageViewer.setData({});
            this.pnlAvatar.classList.remove('has-border');
            this.groupAnalysis.visible = false;
            this.pnlOverlay.visible = false;
            this.btnViewMore.visible = false;
        }
        async renderUI() {
            this.clear();
            const { analytics, owner, publishDate, dataUri, username, avatar } = this._data.data || {};
            this.lblOwner.caption = components_3.FormatUtils.truncateWalletAddress(owner);
            this.lblUsername.caption = `@${username}`;
            this.lblUsername.link.href = '';
            this.lblDate.caption = `. ${(0, index_2.getDuration)(publishDate)}`;
            this.imgAvatar.url = avatar !== null && avatar !== void 0 ? avatar : '';
            if (dataUri) {
                this.pnlLoader.visible = true;
                await this.pageViewer.setData({ cid: dataUri + "/scconfig.json" });
                this.pageViewer.style.setProperty('--custom-background-color', 'transparent');
                this.pnlLoader.visible = false;
            }
            if (this.isBorderShown) {
                this.pnlAvatar.classList.add('has-border');
                // this.gridPost.padding = {top: '0px', left: '0px', right: '0px'};
            }
            else {
                // this.gridPost.padding = {top: '0.75rem', left: '1rem', right: '1rem'};
                this.pnlAvatar.classList.remove('has-border');
            }
            const maxHeight = this.maxHeight ? Number(this.maxHeight) : MAX_HEIGHT;
            if (this.pnlStatusDetail.scrollHeight > maxHeight) {
                this.pnlOverlay.visible = true;
                this.btnViewMore.visible = true;
            }
            this.groupAnalysis.visible = this.isAnalyticsShown;
            if (this.isAnalyticsShown)
                this.renderAnalytics(analytics);
        }
        renderAnalytics(analytics) {
            const listData = [
                {
                    value: (analytics === null || analytics === void 0 ? void 0 : analytics.reply) || 0,
                    name: 'Reply',
                    icon: 'comment',
                    onClick: () => {
                        if (this.onReplyClicked)
                            this.onReplyClicked(Object.assign({}, this._data.data));
                    },
                },
                {
                    value: (analytics === null || analytics === void 0 ? void 0 : analytics.repost) || 0,
                    name: 'Repost',
                    icon: 'retweet',
                    class: 'green-icon',
                },
                {
                    name: 'Vote',
                    onRender: () => {
                        let voteQty = Number((analytics === null || analytics === void 0 ? void 0 : analytics.voted) || 0);
                        const lb = (this.$render("i-label", { caption: (0, index_2.formatNumber)(voteQty, 0), font: { color: Theme.text.secondary, size: '0.813rem' } }));
                        return (this.$render("i-hstack", { verticalAlignment: "center", tooltip: { content: 'Upvote/downvote', placement: 'bottomLeft' }, class: "analytic" },
                            this.$render("i-icon", { name: 'arrow-up', width: 34, height: 34, fill: Theme.text.secondary, border: { radius: '50%' }, class: "hovered-icon", padding: { top: 8, bottom: 8, left: 8, right: 8 }, onClick: () => {
                                    lb.caption = (0, index_2.formatNumber)(++voteQty, 0);
                                } }),
                            lb,
                            this.$render("i-icon", { name: 'arrow-down', width: 34, height: 34, fill: Theme.text.secondary, border: { radius: '50%' }, class: "hovered-icon", padding: { top: 8, bottom: 8, left: 8, right: 8 }, onClick: () => {
                                    lb.caption = (0, index_2.formatNumber)(--voteQty, 0);
                                } })));
                    },
                    class: 'red-icon',
                },
                {
                    value: (analytics === null || analytics === void 0 ? void 0 : analytics.bookmark) || 0,
                    name: 'Bookmark',
                    icon: 'bookmark',
                }
            ];
            this.groupAnalysis.clearInnerHTML();
            for (let item of listData) {
                let itemEl;
                if (item.onRender) {
                    itemEl = item.onRender();
                }
                else {
                    itemEl = (this.$render("i-hstack", { verticalAlignment: "center", tooltip: { content: item.name || '', placement: 'bottomLeft' }, class: "analytic" },
                        this.$render("i-icon", { name: item.icon, width: 34, height: 34, fill: Theme.text.secondary, border: { radius: '50%' }, padding: { top: 8, bottom: 8, left: 8, right: 8 } }),
                        this.$render("i-label", { caption: (0, index_2.formatNumber)(item.value, 0), font: { color: Theme.text.secondary, size: '0.813rem' } })));
                }
                this.groupAnalysis.appendChild(itemEl);
                if (item.class)
                    itemEl.classList.add(item.class);
                itemEl.onClick = () => {
                    if (item.onClick)
                        item.onClick();
                };
            }
            this.groupAnalysis.appendChild(this.$render("i-hstack", { class: "analytic" },
                this.$render("i-icon", { name: 'share-square', width: 34, height: 34, fill: Theme.text.secondary, border: { radius: '50%' }, padding: { top: 8, bottom: 8, left: 8, right: 8 } })));
        }
        onViewMore() {
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
            await this.setData({ data, isBorderShown, isAnalyticsShown });
            const theme = this.getAttribute('theme', true);
            if (theme)
                this.theme = theme;
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", class: index_css_1.customStyles },
                this.$render("i-grid-layout", { id: "gridPost", templateColumns: ['40px', 'auto'], gap: { column: '12px' }, class: "post-body" },
                    this.$render("i-panel", { id: "pnlAvatar" },
                        this.$render("i-image", { id: "imgAvatar", width: 36, height: 36, display: "block", background: { color: Theme.background.gradient }, border: { radius: '50%' }, overflow: 'hidden', stack: { shrink: '0' }, class: 'avatar' })),
                    this.$render("i-vstack", { width: '100%', gap: "12px" },
                        this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem", width: "100%" },
                            this.$render("i-hstack", { stack: { basis: '50%' }, gap: '0.5rem', verticalAlignment: "center", wrap: "wrap" },
                                this.$render("i-label", { id: "lblOwner", class: index_css_2.labelStyle, font: { size: '1rem', weight: 700 } }),
                                this.$render("i-label", { id: "lblUsername", class: index_css_2.labelStyle, font: { size: '1rem', color: Theme.text.secondary } }),
                                this.$render("i-label", { id: "lblDate", font: { size: '1rem', color: Theme.text.secondary } })),
                            this.$render("i-hstack", { stack: { basis: '50%' }, verticalAlignment: "center", horizontalAlignment: "end", gap: "0.5rem" },
                                this.$render("i-button", { id: "btnSubscribe", minHeight: 32, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.secondary.main }, font: { color: Theme.colors.primary.contrastText, weight: 700, size: '0.875rem' }, border: { radius: '30px' }, caption: "Subscribe" }),
                                this.$render("i-icon", { name: "ellipsis-h", width: 34, height: 34, fill: Theme.text.secondary, padding: { top: 8, bottom: 8, left: 8, right: 8 }, border: { radius: '50%' }, class: "hovered-icon" }))),
                        this.$render("i-panel", { id: "pnlStatusDetail", maxHeight: MAX_HEIGHT, overflow: 'hidden' },
                            this.$render("i-vstack", { id: "pnlLoader", width: "100%", height: "100%", minHeight: 300, horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                                this.$render("i-panel", { class: index_css_2.spinnerStyle })),
                            this.$render("i-scom-page-viewer", { id: "pageViewer" }),
                            this.$render("i-panel", { id: "pnlOverlay", visible: false, height: '5rem', width: '100%', position: 'absolute', bottom: "0px", background: { color: `linear-gradient(0, var(--card-bg-color) 0%, transparent 100%)` } })),
                        this.$render("i-hstack", { id: "btnViewMore", verticalAlignment: "center", padding: { top: '1.5rem' }, gap: '0.5rem', visible: false, onClick: this.onViewMore },
                            this.$render("i-label", { caption: 'Read more', font: { size: '1rem', color: Theme.colors.primary.main } }),
                            this.$render("i-icon", { name: "angle-down", width: 16, height: 16, fill: Theme.colors.primary.main })),
                        this.$render("i-hstack", { id: "groupAnalysis", horizontalAlignment: "space-between", padding: { top: '1rem', bottom: '1rem' }, width: '100%', class: index_css_1.analyticStyle })))));
        }
    };
    ScomPost = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-post')
    ], ScomPost);
    exports.default = ScomPost;
});
