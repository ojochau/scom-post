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
define("@scom/scom-post/global/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentModel = void 0;
    ;
    ;
    ;
    ;
    var ProtectedMembershipPolicyType;
    (function (ProtectedMembershipPolicyType) {
        ProtectedMembershipPolicyType["TokenExclusive"] = "TokenExclusive";
        ProtectedMembershipPolicyType["Whitelist"] = "Whitelist";
    })(ProtectedMembershipPolicyType || (ProtectedMembershipPolicyType = {}));
    var TokenType;
    (function (TokenType) {
        TokenType["ERC20"] = "ERC20";
        TokenType["ERC721"] = "ERC721";
        TokenType["ERC1155"] = "ERC1155";
    })(TokenType || (TokenType = {}));
    var PaymentModel;
    (function (PaymentModel) {
        PaymentModel["OneTimePurchase"] = "OneTimePurchase";
        PaymentModel["Subscription"] = "Subscription";
    })(PaymentModel = exports.PaymentModel || (exports.PaymentModel = {}));
});
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
define("@scom/scom-post/global/utils.ts", ["require", "exports", "@ijstech/components", "@scom/scom-post/store/index.ts"], function (require, exports, components_1, index_1) {
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
            return components_1.FormatUtils.formatNumber(value, { shortScale: true, decimalFigures: decimal ?? 0 });
        }
        return components_1.FormatUtils.formatNumber(value, { decimalFigures: decimal ?? 0 });
    };
    exports.formatNumber = formatNumber;
    const getDuration = (date) => {
        const startDate = (0, components_1.moment)(date);
        const endDate = (0, components_1.moment)(new Date());
        let duration = components_1.moment.duration(endDate.diff(startDate));
        let days = duration.asDays();
        if (startDate.year() !== endDate.year())
            return startDate.format('MMM DD, YYYY');
        if (days >= 1)
            return startDate.format('MMM DD');
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
define("@scom/scom-post/global/index.ts", ["require", "exports", "@ijstech/components", "@scom/scom-post/global/utils.ts", "@scom/scom-post/global/interface.ts"], function (require, exports, components_2, utils_1, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDomain = exports.getLinkPreview = exports.getEmbedElement = exports.MAX_HEIGHT = void 0;
    __exportStar(utils_1, exports);
    __exportStar(interface_1, exports);
    exports.MAX_HEIGHT = 352;
    const getEmbedElement = async (postData, parent, callback) => {
        const { module, data } = postData;
        const elm = await components_2.application.createElement(module, true);
        if (!elm)
            throw new Error('not found');
        elm.parent = parent;
        if (elm.ready)
            await elm.ready();
        const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf) => conf.target === 'Builders' || conf.target === 'Editor') : null;
        elm.maxWidth = '100%';
        elm.maxHeight = '100%';
        if (builderTarget?.setData && data.properties) {
            await builderTarget.setData(data.properties);
        }
        const { dark, light } = data.properties || {};
        let tag = {};
        const darkTheme = getThemeValues(dark);
        const lightTheme = getThemeValues(light);
        if (darkTheme) {
            tag['dark'] = darkTheme;
        }
        if (lightTheme) {
            tag['light'] = lightTheme;
        }
        tag = { ...tag, ...data.tag };
        if (builderTarget?.setTag && Object.keys(tag).length) {
            await builderTarget.setTag(tag);
        }
        components_2.application.EventBus.dispatch('POST_CREATED_EMBED_ELEMENT', { module, elm });
        if (callback)
            callback(elm);
        return elm;
    };
    exports.getEmbedElement = getEmbedElement;
    const getThemeValues = (theme) => {
        if (!theme || typeof theme !== 'object')
            return null;
        let values = {};
        for (let prop in theme) {
            if (theme[prop])
                values[prop] = theme[prop];
        }
        return Object.keys(values).length ? values : null;
    };
    const getLinkPreview = async (apiBaseUrl, url) => {
        try {
            if (!apiBaseUrl.endsWith('/'))
                apiBaseUrl += '/';
            const response = await fetch(`${apiBaseUrl}preview?url=${encodeURI(url)}`);
            const result = await response.json();
            return {
                url,
                ...result
            };
        }
        catch (err) { }
    };
    exports.getLinkPreview = getLinkPreview;
    const getDomain = (url) => {
        try {
            return new URL(url.toLowerCase()).hostname;
        }
        catch (err) {
            return url;
        }
    };
    exports.getDomain = getDomain;
});
define("@scom/scom-post/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.labelHoverStyle = exports.linkPreviewImageStyle = exports.cardContentStyle = exports.customLinkStyle = exports.maxHeightStyle = exports.ellipsisStyle = exports.hoverStyle = exports.getIconStyleClass = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    const getIconStyleClass = (color) => {
        const styleObj = {
            $nest: {
                // 'i-label': {
                //   transition: 'color 0.3s ease-in'
                // },
                '&.highlighted': {
                    $nest: {
                        'i-icon svg': {
                            fill: `${color}!important`
                        },
                        'i-label': {
                            color: `${color}!important`
                        }
                    }
                },
                '&:hover': {
                    $nest: {
                        'i-icon svg': {
                            fill: `${color}!important`
                        },
                        'i-label': {
                            color: `${color}!important`
                        }
                    }
                }
            }
        };
        return components_3.Styles.style(styleObj);
    };
    exports.getIconStyleClass = getIconStyleClass;
    exports.hoverStyle = components_3.Styles.style({
        $nest: {
            '&:hover svg': {
                fill: `${Theme.text.primary} !important`
            }
        }
    });
    exports.ellipsisStyle = components_3.Styles.style({
        $nest: {
            'i-markdown-editor': {
                display: '-webkit-box',
                '-webkit-line-clamp': 20,
                // @ts-ignore
                '-webkit-box-orient': 'vertical'
            }
        }
    });
    exports.maxHeightStyle = components_3.Styles.style({
        $nest: {
            '#pnlDetail': {
                maxHeight: 400,
                overflow: 'hidden',
            },
        }
    });
    exports.customLinkStyle = components_3.Styles.style({
        $nest: {
            'a': {
                color: Theme.colors.primary.main,
                display: `inline !important`,
            },
            'img': {
                maxWidth: '100%'
            }
        }
    });
    exports.cardContentStyle = components_3.Styles.style({
        $nest: {
            'i-image': {
                transform: 'translateY(-100%)',
                $nest: {
                    '&>img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }
                }
            },
            '@media only screen and (max-width: 767px)': {
                $nest: {
                    '.entry-content': {
                        "-webkit-line-clamp": `3 !important`
                    }
                }
            }
        }
    });
    exports.linkPreviewImageStyle = components_3.Styles.style({
        display: 'inline-flex',
        aspectRatio: '16 / 9'
    });
    exports.labelHoverStyle = components_3.Styles.style({
        $nest: {
            '&:hover > span': {
                color: Theme.text.primary
            }
        }
    });
});
define("@scom/scom-post/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_4.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-post/components/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.domainLinkStyle = exports.getImageStyle = exports.tooltipStyle = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    exports.tooltipStyle = components_5.Styles.style({
        $nest: {
            '.caret': {
                border: '10px solid transparent',
                borderTop: `10px solid ${Theme.background.modal}`
            }
        }
    });
    const getImageStyle = (aspectRatio) => {
        return components_5.Styles.style({
            display: 'block',
            aspectRatio: aspectRatio,
            $nest: {
                '> img': {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    aspectRatio: aspectRatio
                }
            }
        });
    };
    exports.getImageStyle = getImageStyle;
    exports.domainLinkStyle = components_5.Styles.style({
        $nest: {
            'i-link a': {
                color: Theme.text.secondary,
                textDecoration: 'none'
            },
            'i-link a:hover': {
                color: Theme.colors.primary.dark,
                textDecoration: 'underline'
            }
        }
    });
});
define("@scom/scom-post/components/bubbleMenu.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post/components/index.css.ts", "@scom/scom-post/assets.ts"], function (require, exports, components_6, index_css_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostBubbleMenu = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    const defaultItems = [
        // {
        //   icon: { name: 'edit'},
        //   onClick: () => {
        //   }
        // },
        // {
        //   icon: { name: 'comment'},
        //   onClick: () => {
        //   }
        // },
        {
            icon: { image: { url: assets_1.default.fullPath('img/twitter.svg') }, display: 'inline-flex', width: '1.563rem', height: '1.563rem' },
            tooltipText: 'Post on "X"',
            onClick: () => {
                const query = new URLSearchParams();
                query.set('text', window.getSelection()?.toString() || '');
                // query.set('url', '');
                const url = `https://twitter.com/intent/tweet?${query.toString()}`;
                window.open(url);
            }
        }
    ];
    let ScomPostBubbleMenu = class ScomPostBubbleMenu extends components_6.Module {
        get items() {
            return this._items;
        }
        set items(value) {
            this._items = value;
        }
        setData(items) {
            this.items = items;
            this.renderUI();
        }
        getData() {
            return this._items;
        }
        renderUI() {
            const items = this.items || defaultItems;
            this.pnlItems.clearInnerHTML();
            const iconProps = {
                width: '1.563rem', height: '1.563rem',
                padding: { left: '0.2rem', right: '0.2rem', top: '0.2rem', bottom: '0.2rem' },
                fill: Theme.text.primary
            };
            for (let item of items) {
                const btn = this.$render("i-button", { icon: { ...iconProps, ...item.icon }, background: { color: 'transparent' }, height: 'auto', boxShadow: "none", tooltip: { content: item.tooltipText || '' } });
                btn.onClick = () => {
                    if (item.onClick)
                        item.onClick(btn, null);
                };
                this.pnlItems.append(btn);
            }
        }
        init() {
            super.init();
            const items = this.getAttribute('items', true) || defaultItems;
            this.setData(items);
        }
        render() {
            return (this.$render("i-panel", { background: { color: Theme.background.modal }, border: { radius: '3px' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, width: '100%', height: '100%', class: index_css_1.tooltipStyle },
                this.$render("i-hstack", { id: "pnlItems", verticalAlignment: "center", gap: '0.375rem', maxWidth: '100%' }),
                this.$render("i-panel", { height: 10, width: 10, position: "absolute", left: "50%", bottom: '-0.9rem', zIndex: -1, margin: { left: -5 }, class: "caret" })));
        }
    };
    ScomPostBubbleMenu = __decorate([
        (0, components_6.customElements)('i-scom-post--bubble-menu')
    ], ScomPostBubbleMenu);
    exports.ScomPostBubbleMenu = ScomPostBubbleMenu;
});
define("@scom/scom-post/components/linkPreview.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post/index.css.ts", "@scom/scom-post/global/index.ts"], function (require, exports, components_7, index_css_2, global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostLinkPreview = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    let ScomPostLinkPreview = class ScomPostLinkPreview extends components_7.Module {
        set data(value) {
            this._data = value;
            this.imgPreview.url = value.image || '';
            this.imgPreview.visible = !!value.image;
            this.lblTitle.caption = value.title || '';
            this.lblDesc.caption = value.description || '';
            this.lblDesc.visible = !!value.description;
            this.lblDomain.caption = value.url ? (0, global_1.getDomain)(value.url) : '';
            this.lblDomain.visible = !!value.url;
        }
        handleLinkPreviewClick() {
            window.open(this._data.url, '_blank');
        }
        render() {
            return (this.$render("i-panel", { width: "100%", background: { color: Theme.background.paper }, margin: { top: '0.5rem' }, border: { radius: '0.75rem' }, overflow: "hidden", cursor: "pointer", onClick: this.handleLinkPreviewClick },
                this.$render("i-image", { id: "imgPreview", class: index_css_2.linkPreviewImageStyle, display: "block", width: "100%", maxHeight: 300, objectFit: "cover", overflow: "hidden", visible: false }),
                this.$render("i-stack", { direction: "vertical", padding: { top: '0.75rem', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }, background: { color: Theme.background.paper } },
                    this.$render("i-label", { id: "lblTitle", font: { size: '1rem', color: Theme.text.primary, weight: 600 }, lineHeight: "1.75rem" }),
                    this.$render("i-label", { id: "lblDesc", lineClamp: 2, font: { size: '0.875rem', color: Theme.text.secondary }, lineHeight: "1.25rem" }),
                    this.$render("i-label", { id: "lblDomain", font: { size: '0.75rem', color: Theme.text.secondary }, lineHeight: "1.25rem" }))));
        }
    };
    ScomPostLinkPreview = __decorate([
        (0, components_7.customElements)('i-scom-post-link-preview')
    ], ScomPostLinkPreview);
    exports.ScomPostLinkPreview = ScomPostLinkPreview;
});
define("@scom/scom-post/components/frames/shopify.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post/global/index.ts", "@scom/scom-post/components/index.css.ts"], function (require, exports, components_8, global_2, index_css_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostShopifyFrame = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomPostShopifyFrame = class ScomPostShopifyFrame extends components_8.Module {
        set data(value) {
            this._data = value;
            this.imgProduct.url = this._data.image || "";
            this.lblTitle.caption = this._data.title || "";
            const currency = ['AUD', 'CAD', 'HKD', 'TWD', 'USD'].includes(this._data.currency?.toUpperCase()) ? this._data.currency.slice(0, 2) + '$' : this._data.currency;
            const price = components_8.FormatUtils.formatNumber(this._data.price, { useSeparators: true, decimalFigures: 2, hasTrailingZero: true });
            this.lblPrice.caption = currency ? `${currency}${price}` : `$${price}`;
            this.lblPrice.visible = this._data.price != null;
            this.lblDesc.caption = this._data.description || "";
            this.lblDesc.visible = this._data.description != null;
            this.lblDomain.caption = this._data.url ? (0, global_2.getDomain)(this._data.url) : '';
            this.lblDomain.link.href = this._data.url || '';
        }
        handleButtonClick() {
            window.open(this._data.url, '_blank');
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", width: "100%", height: "100%", gap: "0.25rem" },
                this.$render("i-panel", { width: "100%", height: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: '0.5rem' }, background: { color: Theme.action.disabledBackground }, overflow: "hidden" },
                    this.$render("i-image", { id: "imgProduct", class: (0, index_css_3.getImageStyle)('1 / 1'), width: "100%", height: "100%", objectFit: "cover" }),
                    this.$render("i-stack", { direction: "vertical", padding: { top: "0.5rem", left: '1rem', right: '1rem' }, gap: "0.5rem" },
                        this.$render("i-label", { id: "lblTitle", font: { size: '1.5rem', color: Theme.text.primary, weight: 600 }, lineHeight: "2rem" }),
                        this.$render("i-label", { id: "lblPrice", font: { size: '1.125rem', color: Theme.colors.primary.main, weight: 600 }, lineHeight: "1.5rem" }),
                        this.$render("i-label", { id: "lblDesc", font: { size: '0.875rem', color: Theme.text.secondary, weight: 400 }, lineHeight: "1.125rem", lineClamp: 3, visible: false })),
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, gap: "0.5rem" },
                        this.$render("i-button", { height: "2.25rem", caption: "Buy Now", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, border: { radius: '0.5rem' }, stack: { grow: '1' }, background: { color: Theme.colors.secondary.main }, font: { size: '0.875rem', color: Theme.colors.secondary.contrastText, weight: 400 }, onClick: this.handleButtonClick }))),
                this.$render("i-label", { id: "lblDomain", class: `text-right ${index_css_3.domainLinkStyle}`, width: "100%", font: { size: '0.875rem', color: Theme.text.secondary, weight: 500 }, lineHeight: "1.25rem", link: { target: '_blank' } })));
        }
    };
    ScomPostShopifyFrame = __decorate([
        (0, components_8.customElements)('i-scom-post--frames-shopify')
    ], ScomPostShopifyFrame);
    exports.ScomPostShopifyFrame = ScomPostShopifyFrame;
});
define("@scom/scom-post/components/frames/farcaster.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post/global/index.ts", "@scom/scom-post/components/index.css.ts"], function (require, exports, components_9, global_3, index_css_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostFarcasterFrame = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomPostFarcasterFrame = class ScomPostFarcasterFrame extends components_9.Module {
        set data(value) {
            this._data = value || { image: '', url: '' };
            this.updateFrame();
        }
        updateFrame() {
            this.imgFrame.url = this._data.image || "";
            const aspectRatio = this._data.aspect_ratio?.replace(':', '/') || "1 / 1";
            if (this.imageStyle)
                this.imgFrame.classList.remove(this.imageStyle);
            this.imageStyle = (0, index_css_4.getImageStyle)(aspectRatio);
            this.imgFrame.classList.add(this.imageStyle);
            this.pnlControls.visible = !!this._data.input_text || this._data.buttons?.length > 0;
            this.inputFrame.placeholder = this._data.input_text || "";
            this.inputFrame.visible = !!this._data.input_text;
            this.lblDomain.caption = this._data.url ? (0, global_3.getDomain)(this._data.url) : '';
            this.lblDomain.link.href = this._data.url || '';
            this.renderButtons();
        }
        renderButtons() {
            this.pnlButtons.clearInnerHTML();
            if (this._data.buttons) {
                for (let buttonData of this._data.buttons) {
                    if (!buttonData)
                        continue;
                    const options = {
                        caption: buttonData.caption || "",
                        height: '2.25rem',
                        padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' },
                        border: { radius: '0.5rem' },
                        stack: { grow: '1' },
                        background: { color: Theme.colors.secondary.main },
                        font: { size: '0.875rem', color: Theme.colors.secondary.contrastText, weight: 400 }
                    };
                    if (buttonData.action === 'link') {
                        options.rightIcon = { width: '0.75rem', height: '0.75rem', name: 'external-link-alt' };
                    }
                    const button = new components_9.Button(undefined, options);
                    button.onClick = () => {
                        this.handleButtonClick(buttonData);
                    };
                    this.pnlButtons.appendChild(button);
                }
            }
            this.pnlButtons.visible = this._data.buttons?.length > 0;
        }
        handleImageClick() {
            if (this._data.url) {
                window.open(this._data.url, '_blank');
            }
        }
        handleButtonClick(data) {
            if (data.action === 'link') {
                window.open(data.target || "", '_blank');
            }
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", width: "100%", height: "100%", gap: "0.25rem" },
                this.$render("i-panel", { width: "100%", height: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: '0.5rem' }, background: { color: Theme.action.disabledBackground }, overflow: "hidden" },
                    this.$render("i-image", { id: "imgFrame", width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", onClick: this.handleImageClick }),
                    this.$render("i-stack", { id: "pnlControls", direction: "vertical", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, gap: "0.5rem", visible: false },
                        this.$render("i-input", { id: "inputFrame", width: "100%", visible: false }),
                        this.$render("i-stack", { id: "pnlButtons", direction: "horizontal", alignItems: "center", gap: "0.5rem", visible: false }))),
                this.$render("i-label", { id: "lblDomain", class: `text-right ${index_css_4.domainLinkStyle}`, width: "100%", font: { size: '0.875rem', color: Theme.text.secondary, weight: 500 }, lineHeight: "1.25rem", link: { target: '_blank' } })));
        }
    };
    ScomPostFarcasterFrame = __decorate([
        (0, components_9.customElements)('i-scom-post--frames-farcaster')
    ], ScomPostFarcasterFrame);
    exports.ScomPostFarcasterFrame = ScomPostFarcasterFrame;
});
define("@scom/scom-post/components/frames/index.ts", ["require", "exports", "@scom/scom-post/components/frames/shopify.tsx", "@scom/scom-post/components/frames/farcaster.tsx"], function (require, exports, shopify_1, farcaster_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostFarcasterFrame = exports.ScomPostShopifyFrame = void 0;
    Object.defineProperty(exports, "ScomPostShopifyFrame", { enumerable: true, get: function () { return shopify_1.ScomPostShopifyFrame; } });
    Object.defineProperty(exports, "ScomPostFarcasterFrame", { enumerable: true, get: function () { return farcaster_1.ScomPostFarcasterFrame; } });
});
define("@scom/scom-post/components/index.ts", ["require", "exports", "@scom/scom-post/components/bubbleMenu.tsx", "@scom/scom-post/components/linkPreview.tsx", "@scom/scom-post/components/frames/index.ts"], function (require, exports, bubbleMenu_1, linkPreview_1, frames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostLinkPreview = exports.ScomPostBubbleMenu = void 0;
    Object.defineProperty(exports, "ScomPostBubbleMenu", { enumerable: true, get: function () { return bubbleMenu_1.ScomPostBubbleMenu; } });
    Object.defineProperty(exports, "ScomPostLinkPreview", { enumerable: true, get: function () { return linkPreview_1.ScomPostLinkPreview; } });
    __exportStar(frames_1, exports);
});
define("@scom/scom-post", ["require", "exports", "@ijstech/components", "@scom/scom-post/global/index.ts", "@scom/scom-post/index.css.ts", "@scom/scom-post/assets.ts", "@scom/scom-post/components/index.ts"], function (require, exports, components_10, global_4, index_css_5, assets_2, components_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPost = void 0;
    const Theme = components_10.Styles.Theme.ThemeVars;
    let ScomPost = class ScomPost extends components_10.Module {
        constructor(parent, options) {
            super(parent, options);
            this.expanded = false;
            this._isPublicPostLabelShown = false;
            this.onProfileShown = this.onProfileShown.bind(this);
            this.onShowMore = this.onShowMore.bind(this);
            this.showBubbleMenu = this.showBubbleMenu.bind(this);
            this.onGoCommunity = this.onGoCommunity.bind(this);
            this.handleUnlockPost = this.handleUnlockPost.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get isActive() {
            return this._data.isActive ?? false;
        }
        set isActive(value) {
            this._data.isActive = value ?? false;
        }
        get type() {
            return this._data.type ?? 'standard';
        }
        set type(value) {
            this._data.type = value ?? 'standard';
        }
        get postData() {
            return this._data.data;
        }
        set postData(value) {
            this._data.data = value;
        }
        async setData(data) {
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
        set isPinned(value) {
            this._isPinned = value || false;
            this.pnlPinned.visible = this._isPinned;
        }
        get apiBaseUrl() {
            return this._apiBaseUrl;
        }
        set apiBaseUrl(value) {
            this._apiBaseUrl = value;
        }
        get isPublicPostLabelShown() {
            return this._isPublicPostLabelShown;
        }
        set isPublicPostLabelShown(value) {
            this._isPublicPostLabelShown = value;
            if (this.pnlPublicLabel)
                this.pnlPublicLabel.visible = value;
        }
        set status(value) {
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
        async isMarkdown() {
            const { contentElements } = this._data?.data || {};
            for (let item of contentElements) {
                if (!item.module) {
                    let content = item?.data?.properties?.content || '';
                    if (!content)
                        continue;
                    const tokens = await this.markdownViewer.getTokens(content);
                    let heading1 = tokens.find(token => token.type === "heading" && token.depth === 1);
                    if (heading1) {
                        return true;
                    }
                }
            }
            return false;
        }
        async constructPostCard() {
            let data = {};
            const { contentElements } = this._data?.data || {};
            if (contentElements?.length) {
                for (let item of contentElements) {
                    if (!item.module) {
                        let content = item?.data?.properties?.content || '';
                        if (!content)
                            continue;
                        const tokens = await this.markdownViewer.getTokens(content);
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
                                data.img = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                            }
                        }
                    }
                    if (data.title && data.content && data.img)
                        break;
                }
            }
            return data;
        }
        renderCardContent(data) {
            this.pnlContent.appendChild(this.$render("i-stack", { class: index_css_5.cardContentStyle, width: '100%', direction: this.pinView ? "vertical" : "horizontal", gap: '0.875rem', mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            direction: "vertical"
                        }
                    }
                ] },
                this.$render("i-hstack", { width: "100%", height: "100%", stack: { shrink: '0' }, border: this.pinView ? { radius: "0.75rem" } : {}, overflow: "hidden", mediaQueries: this.pinView ? [] : [
                        {
                            minWidth: '768px',
                            properties: {
                                width: "7rem",
                                height: "7rem",
                                border: { radius: "0.75rem" }
                            }
                        }
                    ], visible: !!data.img },
                    this.$render("i-panel", { width: "100%", height: 0, overflow: "hidden", padding: { bottom: this.pinView ? "50%" : "100%" }, background: { color: Theme.action.disabledBackground }, mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    padding: { bottom: '50%' }
                                }
                            }
                        ] },
                        this.$render("i-image", { position: "absolute", display: "block", width: "100%", height: "100%", top: "100%", left: 0, url: data.img, objectFit: "cover" }))),
                this.$render("i-vstack", { id: "pnlCardContentBlock", justifyContent: 'space-between', gap: '0.5rem', stack: { shrink: '1', grow: '1' }, overflow: 'hidden' },
                    this.$render("i-vstack", { gap: '0.5rem' },
                        this.$render("i-label", { caption: data.title || 'Untitled', font: { size: '1.25rem', weight: 500 }, wordBreak: "break-word", lineHeight: '1.5rem' }),
                        this.$render("i-label", { class: "entry-content", caption: data.content || '', lineClamp: this.pinView ? 3 : 1, font: { size: "1rem" }, lineHeight: '1.5rem', visible: !!data.content })))));
            this.groupAnalysis.parent = this.pnlCardContentBlock;
            this.pnlCardContentBlock.appendChild(this.groupAnalysis);
        }
        async renderUI() {
            this.clear();
            const { actions, stats, parentAuthor, contentElements, repost, community, isLocked, isSubscription } = this._data?.data || {};
            this.renderPostType();
            let isMarkdown = await this.isMarkdown();
            if (parentAuthor) {
                this.pnlReplyPath.visible = true;
                this.lbReplyTo.caption = parentAuthor.displayName || '';
            }
            this.pnlActiveBd.visible = this.isActive;
            this.pnlGridPost.border.radius = this.isActive ? '0.25rem' : '0.5rem';
            this.pnlGridPost.cursor = this.isActive ? 'default' : 'pointer';
            if (!this.isQuotedPost)
                this.renderAnalytics(stats, actions);
            this.groupAnalysis.visible = !this.isQuotedPost && !this.pinView;
            this.pnlSubscribe.visible = !this.isQuotedPost && !this.pinView;
            this.pnlLocked.visible = isLocked || false;
            this.pnlDetail.visible = !isLocked;
            if (repost) {
                let reposters = repost.displayName || repost.username || components_10.FormatUtils.truncateWalletAddress(repost.npub);
                if (stats?.reposts > 1) {
                    const others = stats.reposts - 1;
                    reposters += ` and ${others} ${others > 1 ? 'others' : 'other'}`;
                }
                this.pnlRepost.clearInnerHTML();
                this.pnlRepost.append(this.$render("i-stack", { direction: "horizontal", width: "2.75rem", justifyContent: "end" },
                    this.$render("i-icon", { width: "1rem", height: "1rem", name: "retweet", fill: Theme.text.secondary })), this.$render("i-label", { caption: reposters + " reposted", font: { size: "0.875rem", color: Theme.text.secondary }, onClick: () => this.onGoProfile(repost.npub || repost.id) }));
                this.pnlRepost.visible = true;
            }
            if (community) {
                this.pnlCommunity.clearInnerHTML();
                this.pnlCommunity.append(this.$render("i-hstack", { width: "2.75rem", horizontalAlignment: 'end' },
                    this.$render("i-icon", { width: "1rem", height: "1rem", name: "users", fill: Theme.text.secondary })), this.$render("i-label", { class: index_css_5.labelHoverStyle, caption: community.communityId, font: { size: "0.875rem", color: Theme.text.secondary }, cursor: "pointer", onClick: this.onGoCommunity }));
                this.pnlCommunity.visible = true;
            }
            if (this.btnUnlockPost) {
                const firstPolicy = community?.policies?.[0];
                const _isSubscription = isSubscription || firstPolicy?.paymentModel === global_4.PaymentModel.Subscription;
                this.btnUnlockPost.caption = community?.isWhitelist ? "Exclusive content for whitelisted users only" : _isSubscription ? "Subscribe" : "Unlock";
                this.btnUnlockPost.enabled = !community?.isWhitelist;
            }
            if (this.type === 'card' && isMarkdown) {
                const templateAreas = [
                    ['avatar', 'user'],
                    ['avatar', 'path'],
                    ['content', 'content']
                ];
                if (!this.pnlReplyPath.visible)
                    templateAreas.splice(1, 1);
                this.gridPost.templateAreas = templateAreas;
                this.overflowEllipse = false;
                this.classList.remove(index_css_5.maxHeightStyle);
                let data = await this.constructPostCard();
                this.renderCardContent(data);
            }
            else if (contentElements?.length) {
                for (let item of contentElements) {
                    if (item.category === 'quotedPost') {
                        this.addQuotedPost(item?.data?.properties);
                    }
                    else {
                        if (!item.module && isMarkdown) {
                            item.module = '@scom/scom-markdown-editor';
                        }
                        if (item.module) {
                            await (0, global_4.getEmbedElement)(item, this.pnlContent, (elm) => {
                            });
                        }
                        else {
                            let content = item?.data?.properties?.content || '';
                            this.appendLabel(content);
                        }
                    }
                }
            }
        }
        appendLabel(text) {
            const hrefRegex = /https?:\/\/\S+/g;
            text = text.replace(/\n/gm, ' <br> ').replace(hrefRegex, (match) => {
                return ` <a href="${match}" target="_blank">${match}</a> `;
            });
            const label = this.$render("i-label", { width: '100%', overflowWrap: "anywhere", class: index_css_5.customLinkStyle, lineHeight: "1.3125rem", caption: text || '' });
            this.pnlContent.appendChild(label);
            if (this.apiBaseUrl) {
                const links = label.querySelectorAll('a');
                for (let link of links) {
                    const regex = new RegExp(`${location.origin}/(#!/)?p/\\S+`, "g");
                    let match = regex.exec(link.href);
                    // tag mention
                    if (match && link.innerHTML.startsWith('@'))
                        continue;
                    this.replaceLinkPreview(link.href, link.parentElement, link);
                }
            }
        }
        constructFarcasterFrame(preview) {
            let data = {
                image: preview.image,
                url: preview.url
            };
            for (let tag of preview.fc_tags) {
                if (tag[0] === 'fc:frame:image') {
                    data.image = tag[1];
                }
                else if (tag[0] === 'fc:frame:post_url') {
                    data.post_url = tag[1];
                }
                else if (tag[0] === 'fc:frame:input:text') {
                    data.input_text = tag[1];
                }
                else if (tag[0] === 'fc:frame:image:aspect_ratio') {
                    data.aspect_ratio = tag[1];
                }
                else if (tag[0] === 'fc:frame:state') {
                    data.state = tag[1];
                }
                else if (tag[0].startsWith('fc:frame:button:')) {
                    if (!data.buttons)
                        data.buttons = [];
                    const arr = tag[0].replace('fc:frame:button:', '').split(':');
                    const idx = Number(arr[0]) - 1;
                    const property = arr[1] || 'caption';
                    if (!data.buttons[idx])
                        data.buttons[idx] = {};
                    data.buttons[idx][property] = tag[1];
                }
            }
            return data;
        }
        constructShopifyFrame(preview) {
            let price, currency;
            for (let tag of preview.og_tags) {
                if (tag[0] === 'og:price:amount') {
                    price = tag[1];
                }
                else if (tag[0] === 'og:price:currency') {
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
            };
        }
        async replaceLinkPreview(url, parent, linkElm) {
            const preview = await (0, global_4.getLinkPreview)(this.apiBaseUrl, url);
            if (!preview || !preview.title)
                return;
            const isFarcasterFrame = preview.fc_tags?.some(tag => tag[0] === 'fc:frame');
            const isShopifyFrame = preview.og_tags?.some(tag => tag[0].startsWith('og:price'));
            let elm;
            let data = preview;
            if (isFarcasterFrame) {
                elm = new components_11.ScomPostFarcasterFrame();
                data = this.constructFarcasterFrame(preview);
            }
            else if (isShopifyFrame) {
                elm = new components_11.ScomPostShopifyFrame();
                data = this.constructShopifyFrame(preview);
            }
            else {
                elm = new components_11.ScomPostLinkPreview();
            }
            parent.replaceChild(elm, linkElm);
            await elm.ready();
            elm.data = data;
        }
        addQuotedPost(post) {
            const postEl = (this.$render("i-scom-post", { type: "quoted", data: post, display: "block", border: { radius: '0.5rem', width: '1px', style: 'solid', color: Theme.colors.secondary.dark }, apiBaseUrl: this.apiBaseUrl }));
            postEl.onClick = this.onQuotedPostClicked;
            postEl.onQuotedPostClicked = this.onQuotedPostClicked;
            this.pnlQuoted.append(postEl);
            this.pnlQuoted.visible = true;
        }
        renderInfo(oneLine) {
            const { publishDate, author, stats } = this.postData;
            this.imgAvatar.url = author?.avatar ?? '';
            this.imgAvatar.objectFit = 'cover';
            const imgWidth = this.isQuotedPost ? '1.75rem' : '2.75rem';
            this.imgAvatar.width = this.imgAvatar.height = imgWidth;
            const userEl = (this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.25rem" },
                this.$render("i-label", { id: "lblOwner", caption: author?.displayName || author?.username || '', textOverflow: "ellipsis", maxWidth: this.isQuotedPost ? '9.375rem' : '8.75rem', font: { size: this.isQuotedPost ? '1rem' : '0.875rem', weight: 500 }, lineHeight: '0.875rem' }),
                this.$render("i-icon", { id: "imgVerified", width: '0.875rem', height: '0.875rem', name: "certificate", fill: Theme.text.secondary, display: "inline-flex" })));
            const dateEl = (this.$render("i-hstack", { gap: '0.25rem', stack: { shrink: '0' } },
                this.$render("i-panel", { border: { left: { width: '1px', style: 'solid', color: Theme.text.secondary } } }),
                this.$render("i-label", { id: "lblDate", font: { size: '0.875rem', color: Theme.text.secondary }, caption: `${(0, global_4.getDuration)(publishDate)}`, lineHeight: '0.875rem' })));
            const usernameEl = (this.$render("i-label", { id: "lblUsername", caption: `${author?.internetIdentifier || ''}`, maxWidth: this.isQuotedPost ? '13.75rem' : '12.5rem', textOverflow: "ellipsis", font: { size: this.isQuotedPost ? '1rem' : '0.875rem', color: Theme.text.secondary }, lineHeight: '0.875rem', visible: author?.internetIdentifier != null }));
            let statusEl = (this.$render("i-hstack", { gap: '0.25rem', stack: { shrink: '0' }, visible: stats?.status != null },
                this.$render("i-label", { id: "lblStatus", caption: stats?.status || "", padding: { top: 3, bottom: 3, left: 12, right: 12 }, border: { width: 1, style: 'solid', color: Theme.colors.primary.main, radius: 20 }, font: { size: '0.875rem', color: Theme.colors.primary.main }, lineHeight: '0.875rem' })));
            if (oneLine) {
                this.pnlInfo.append(this.$render("i-hstack", { height: "100%", gap: "0.25rem", verticalAlignment: "center" },
                    userEl,
                    usernameEl,
                    dateEl,
                    statusEl));
            }
            else {
                this.pnlInfo.append(this.$render("i-vstack", { gap: "0.5rem" },
                    this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center" },
                        userEl,
                        dateEl,
                        statusEl),
                    usernameEl));
            }
        }
        renderPostType() {
            if (!this.disableGutters) {
                this.gridPost.templateColumns = ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'];
                this.gridPost.templateRows = ['auto'];
            }
            // this.pnlGridPost.background.color = Theme.background.paper;
            // this.pnlPost.background.color = Theme.background.paper;
            if (this.isQuotedPost) {
                this.renderInfo(true);
                this.gridPost.templateAreas = [
                    ['avatar', 'user'],
                    ['avatar', 'path'],
                    ['content', 'content']
                ];
                if (!this.disableGutters) {
                    this.gridPost.templateColumns = ['1.75rem', 'minmax(auto, calc(100% - 4.5rem))'];
                    this.gridPost.templateRows = ['1.75rem', 'auto'];
                }
                this.pnlGridPost.background.color = Theme.background.default;
                this.pnlPost.background.color = Theme.background.default;
            }
            else if (this.type === 'short') {
                this.renderInfo();
                this.gridPost.templateAreas = [
                    ['avatar', 'user'],
                    ['avatar', 'path'],
                    ['avatar', 'content']
                ];
            }
            else {
                this.renderInfo(true);
                this.gridPost.templateAreas = [
                    ['avatar', 'user'],
                    ['avatar', 'path'],
                    ['avatar', 'content']
                ];
            }
        }
        renderAnalytics(analytics, actions) {
            const dataList = [
                {
                    value: analytics?.replies || 0,
                    name: 'Reply',
                    icon: { name: "comment-alt" },
                    hoveredColor: Theme.text.secondary,
                    highlighted: actions?.replied,
                    onClick: (target, event) => {
                        if (this.onReplyClicked)
                            this.onReplyClicked(target, this.postData, event);
                        return true;
                    }
                },
                {
                    value: analytics?.satszapped || 0,
                    name: 'Zap',
                    icon: { name: "bolt" },
                    hoveredColor: Theme.colors.warning.main,
                    highlighted: actions?.zapped,
                    onClick: (target, event) => {
                        if (this.onZapClicked)
                            this.onZapClicked(target, this.postData, event);
                        return true;
                    }
                },
                {
                    value: analytics?.upvotes || 0,
                    name: 'Like',
                    icon: { name: "heart" },
                    hoveredColor: Theme.colors.error.main,
                    highlighted: actions?.liked,
                    onClick: async (target, event) => {
                        let success = true;
                        if (this.onLikeClicked)
                            success = await this.onLikeClicked(target, this.postData, event);
                        return success;
                    }
                },
                {
                    value: analytics?.reposts || 0,
                    name: 'Repost',
                    icon: { name: "retweet" },
                    hoveredColor: Theme.colors.success.main,
                    highlighted: actions?.reposted,
                    onClick: (target, event) => {
                        if (this.onRepostClicked)
                            this.onRepostClicked(target, this.postData, event);
                        return true;
                    }
                },
                {
                    name: 'Bookmark',
                    icon: { name: 'bookmark' },
                    hoveredColor: Theme.colors.info.main,
                    highlighted: actions?.bookmarked,
                    onClick: async (target, event) => {
                        if (this.onBookmarkClicked)
                            this.onBookmarkClicked(target, this.postData, event);
                        return true;
                    }
                }
            ];
            this.groupAnalysis.clearInnerHTML();
            for (let item of dataList) {
                let value, lblValue;
                if (item.value != null) {
                    value = components_10.FormatUtils.formatNumber(item.value, { shortScale: true, decimalFigures: 0 });
                    lblValue = (this.$render("i-label", { caption: value, font: { color: Theme.colors.secondary.light, size: '0.8125rem' }, tag: item.value }));
                }
                let itemEl = (this.$render("i-hstack", { verticalAlignment: "center", gap: '0.5rem', tooltip: value ? { content: value, placement: 'bottomLeft' } : undefined, cursor: 'pointer', class: (0, index_css_5.getIconStyleClass)(item.hoveredColor), padding: { top: '0.25rem', bottom: '0.25rem' } },
                    this.$render("i-icon", { width: '1rem', height: '1rem', fill: Theme.text.secondary, name: item.icon.name }),
                    lblValue || []));
                if (item.highlighted)
                    itemEl.classList.add('highlighted');
                this.groupAnalysis.appendChild(itemEl);
                itemEl.onClick = async (target, event) => {
                    let success = true;
                    if (item.onClick)
                        success = await item.onClick(itemEl, event);
                    if (success && (item.name === 'Like' || item.name === 'Repost')) {
                        const newValue = (lblValue.tag ?? 0) + 1;
                        lblValue.caption = components_10.FormatUtils.formatNumber(newValue, { shortScale: true, decimalFigures: 0 });
                        lblValue.tag = newValue;
                        itemEl.classList.add('highlighted');
                    }
                    if (item.name === 'Bookmark') {
                        itemEl.classList.toggle('highlighted');
                    }
                };
            }
        }
        addReply(parentPostId, post) {
            if (parentPostId !== this.postData.id)
                return;
            if (!this.pnlReply)
                this.appendReplyPanel();
            this._replies.push(post);
            return this.renderReply(post, true);
        }
        ;
        appendReplyPanel() {
            this.pnlReply = this.$render("i-vstack", { id: "pnlReply", visible: !this.pnlMore, padding: { top: '0.5rem' }, border: { top: { width: 1, style: 'solid', color: 'rgb(47, 51, 54)' } } },
                this.$render("i-vstack", { id: "pnlReplies", gap: '0.5rem', padding: { bottom: 50 } }));
            this.pnlWrapper.appendChild(this.pnlReply);
            return this.pnlReply;
        }
        ;
        renderReplies() {
            if (this.pnlReplies)
                this.pnlReplies.clearInnerHTML();
            const length = this._replies?.length;
            if (length) {
                for (let i = 0; i < length; i++) {
                    const reply = this._replies[i];
                    this.renderReply(reply);
                }
            }
        }
        renderReply(reply, isPrepend) {
            const childElm = this.$render("i-scom-post", { overflowEllipse: true, border: { top: { width: 1, style: 'solid', color: 'rgb(47, 51, 54)' } }, apiBaseUrl: this.apiBaseUrl });
            childElm.onReplyClicked = this.onReplyClicked;
            childElm.onZapClicked = this.onZapClicked;
            childElm.onLikeClicked = this.onLikeClicked;
            childElm.onRepostClicked = this.onRepostClicked;
            childElm.onProfileClicked = this.onProfileClicked;
            childElm.onQuotedPostClicked = this.onQuotedPostClicked;
            childElm.onBookmarkClicked = this.onBookmarkClicked;
            childElm.parent = this.pnlReplies;
            if (isPrepend)
                this.pnlReplies.prepend(childElm);
            else
                this.pnlReplies.append(childElm);
            childElm.setData({ data: reply });
            return childElm;
        }
        appendShowMorePanel() {
            this.pnlMore = (this.$render("i-grid-layout", { id: "pnlMore", templateColumns: ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'], gap: { column: 12 }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, onClick: this.onShowMore },
                this.$render("i-vstack", { height: '1rem', justifyContent: "space-between", alignItems: "center" },
                    this.$render("i-panel", { width: 2, height: 2, background: { color: Theme.colors.secondary.light } }),
                    this.$render("i-panel", { width: 2, height: 2, background: { color: Theme.colors.secondary.light } }),
                    this.$render("i-panel", { width: 2, height: 2, background: { color: Theme.colors.secondary.light } })),
                this.$render("i-label", { caption: 'Show replies', font: { color: Theme.colors.primary.main, size: '0.9rem' } })));
            if (this.pnlReply)
                this.pnlReply.visible = false;
            this.pnlWrapper.appendChild(this.pnlMore);
        }
        ;
        onShowMore() {
            this.pnlMore.visible = false;
            if (!this.pnlReply)
                this.appendReplyPanel();
            this.pnlReply.visible = true;
            this.renderReplies();
        }
        onProfileShown(target, event) {
            if (this.onProfileClicked)
                this.onProfileClicked(target, this.postData, event, this.pnlContent);
        }
        onViewMore() {
            this.pnlDetail.style.maxHeight = '';
            this.pnlDetail.style.overflow = '';
            this.pnlOverlay.visible = false;
            this.btnViewMore.visible = false;
        }
        onGoProfile(npub) {
            if (!npub)
                npub = this.postData?.author?.npub;
            if (npub) {
                window.open(`#!/p/${npub}`, '_self');
            }
        }
        onGoCommunity(target, event) {
            if (this.onCommunityClicked)
                this.onCommunityClicked(target, this.postData, event);
        }
        async handleUnlockPost(target, event) {
            let success = true;
            if (this.onUnlockPostClicked) {
                this.btnUnlockPost.rightIcon.spin = true;
                this.btnUnlockPost.rightIcon.visible = true;
                success = await this.onUnlockPostClicked(target, this.postData, event);
                this.btnUnlockPost.rightIcon.spin = false;
                this.btnUnlockPost.rightIcon.visible = false;
            }
            if (success) {
                if (this._data.data)
                    this._data.data.isLocked = false;
                this.pnlLocked.visible = false;
                this.pnlDetail.visible = true;
            }
        }
        // private handleShowMoreClick() {
        //     this.pnlContent.classList.remove(ellipsisStyle);
        //     this.btnShowMore.visible = false;
        // }
        async init() {
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
            this.overflowEllipse = this.getAttribute('overflowEllipse', true) || this.overflowEllipse;
            this.disableGutters = this.getAttribute('disableGutters', true) || this.disableGutters;
            this.limitHeight = this.getAttribute('limitHeight', true) || this.limitHeight;
            this.isReply = this.getAttribute('isReply', true) || this.isReply;
            this.isPinned = this.getAttribute('isPinned', true, false);
            this.pinView = this.getAttribute('pinView', true, false);
            const apiBaseUrl = this.getAttribute('apiBaseUrl', true);
            if (apiBaseUrl && apiBaseUrl !== 'undefined')
                this.apiBaseUrl = apiBaseUrl;
            const isPublicPostLabelShown = this.getAttribute('isPublicPostLabelShown', true);
            if (isPublicPostLabelShown != null)
                this.isPublicPostLabelShown = isPublicPostLabelShown;
            const data = this.getAttribute('data', true);
            const isActive = this.getAttribute('isActive', true, false);
            const type = this.getAttribute('type', true);
            this.pnlGridPost.padding = this.pinView ?
                { left: 0, right: 0, top: '1rem', bottom: '1rem' } :
                { left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem' };
            if (this.disableGutters) {
                this.pnlPost.visible = true;
                this.pnlPost.append(this.$render("i-panel", { id: "pnlActiveBd", visible: false, width: '0.25rem', height: '100%', left: "0px", top: "0px", border: { radius: '0.25rem 0 0 0.25rem' } }));
                this.pnlPost.append(this.$render("i-panel", { mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: 0, right: 0, top: 0, bottom: 0 }
                            }
                        }
                    ], padding: { left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem' } },
                    this.$render("i-hstack", { id: "pnlCommunity", padding: { bottom: "0.75rem" }, margin: { top: "-0.5rem" }, gap: "0.75rem", visible: false }),
                    this.$render("i-hstack", { horizontalAlignment: "space-between", gap: "0.5rem", width: "100%", grid: { area: 'user' }, position: 'relative' },
                        this.$render("i-hstack", { alignItems: 'center', gap: 10 },
                            this.$render("i-panel", { id: "pnlAvatar", grid: { area: 'avatar' } },
                                this.$render("i-image", { id: "imgAvatar", width: '2.75rem', height: '2.75rem', display: "block", background: { color: Theme.background.main }, border: { radius: '50%' }, overflow: 'hidden', objectFit: 'cover', fallbackUrl: assets_2.default.fullPath('img/default_avatar.png'), cursor: "pointer", onClick: () => this.onGoProfile() })),
                            this.$render("i-stack", { direction: "vertical", gap: "0.375rem" },
                                this.$render("i-panel", { id: "pnlInfo", maxWidth: '100%', overflow: 'hidden' }),
                                this.$render("i-stack", { id: "pnlPublicLabel", direction: "horizontal", alignItems: "center", gap: "0.25rem", visible: this.isPublicPostLabelShown },
                                    this.$render("i-icon", { width: "0.875rem", height: "0.875rem", name: "globe-americas", display: 'inline-flex', fill: Theme.text.secondary }),
                                    this.$render("i-label", { caption: "Public", font: { size: '0.875rem', color: Theme.text.secondary } })))),
                        this.$render("i-hstack", { id: "pnlSubscribe", stack: { shrink: '0' }, horizontalAlignment: "end", gap: "0.5rem", visible: !this.pinView },
                            this.$render("i-button", { id: "btnSubscribe", minHeight: 32, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, border: { radius: '1.875rem' }, visible: false, caption: 'Subscribe' }),
                            this.$render("i-panel", { onClick: this.onProfileShown, cursor: "pointer", class: index_css_5.hoverStyle },
                                this.$render("i-icon", { name: "ellipsis-h", width: '1rem', height: '1rem', fill: Theme.text.secondary })))),
                    this.$render("i-hstack", { id: "pnlReplyPath", verticalAlignment: "center", gap: "0.25rem", visible: false, grid: { area: 'path' }, margin: { top: '0.5rem' } },
                        this.$render("i-label", { caption: 'replying to', font: { size: '0.875rem', color: Theme.colors.secondary.light } }),
                        this.$render("i-label", { id: "lbReplyTo", font: { size: '0.875rem', color: Theme.colors.primary.main }, cursor: "pointer", onClick: () => this.onGoProfile() })),
                    this.$render("i-vstack", { width: '100%', grid: { area: 'content' }, margin: { top: '1rem' } },
                        this.$render("i-panel", { id: "pnlDetail" },
                            this.$render("i-hstack", { id: "showMoreWrapper", visible: false, height: 50, bottom: 0, width: '100%', zIndex: 1, background: { color: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10, 10, 10) 100%)' }, position: 'absolute', justifyContent: 'center', alignItems: 'end' },
                                this.$render("i-button", { id: "btnShowMore", caption: "Show more", margin: { bottom: 10 }, background: { color: 'transparent' }, font: { color: Theme.colors.primary.main, weight: 800, size: '1rem' }, boxShadow: 'unset', onClick: this.handleShowMoreClick.bind(this) })),
                            this.$render("i-vstack", { id: "pnlContent", gap: "0.75rem" }),
                            this.$render("i-vstack", { id: "pnlQuoted", visible: false, gap: '0.5rem', padding: { top: '0.5rem' } }),
                            this.$render("i-panel", { id: "pnlOverlay", visible: false, height: '5rem', width: '100%', position: 'absolute', bottom: "0px", background: { color: `linear-gradient(0, var(--card-bg-color) 0%, transparent 100%)` } })),
                        this.$render("i-hstack", { id: "btnViewMore", verticalAlignment: "center", padding: { top: '1rem' }, gap: '0.25rem', visible: false, onClick: this.onViewMore },
                            this.$render("i-label", { caption: 'Read more', font: { size: '0.9rem', color: Theme.colors.primary.main } }),
                            this.$render("i-icon", { name: "angle-down", width: 16, height: 16, fill: Theme.colors.primary.main })),
                        this.$render("i-stack", { id: "pnlLocked", direction: "vertical", width: "100%", gap: "0.75rem", visible: false },
                            this.$render("i-stack", { direction: "horizontal", width: "100%", minHeight: 150, border: { radius: '0.5rem' }, background: { color: Theme.background.paper }, alignItems: "center", justifyContent: "center" },
                                this.$render("i-icon", { width: "1.5rem", height: "1.5rem", name: "lock", fill: Theme.text.primary })),
                            this.$render("i-button", { id: "btnUnlockPost", width: "100%", minHeight: 36, padding: { left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText, weight: 600 }, border: { radius: '0.5rem' }, caption: 'Unlock', onClick: this.handleUnlockPost })),
                        this.$render("i-hstack", { id: "groupAnalysis", horizontalAlignment: "space-between", padding: { top: '0.563rem' }, width: '100%', visible: !this.pinView }))));
            }
            else {
                this.pnlGridPost.visible = true;
                this.pnlGridPost.insertBefore(this.$render("i-hstack", { id: "pnlCommunity", padding: { bottom: "0.75rem" }, margin: { top: "-0.5rem" }, gap: "0.75rem", visible: false }), this.gridPost);
                this.gridPost.append(this.$render("i-panel", { id: "pnlActiveBd", visible: false, width: '0.25rem', height: '100%', left: "0px", top: "0px", border: { radius: '0.25rem 0 0 0.25rem' }, background: { color: Theme.background.gradient } }));
                this.gridPost.append(this.$render("i-panel", { id: "pnlAvatar", grid: { area: 'avatar' } },
                    this.$render("i-image", { id: "imgAvatar", width: '2.75rem', height: '2.75rem', display: "block", background: { color: Theme.background.main }, border: { radius: '50%' }, overflow: 'hidden', objectFit: 'cover', fallbackUrl: assets_2.default.fullPath('img/default_avatar.png'), cursor: "pointer", onClick: () => this.onGoProfile() })));
                this.gridPost.append(this.$render("i-hstack", { horizontalAlignment: "space-between", gap: "0.5rem", width: "100%", grid: { area: 'user' }, position: 'relative' },
                    this.$render("i-stack", { direction: "vertical", gap: "0.375rem" },
                        this.$render("i-panel", { id: "pnlInfo", maxWidth: '100%', overflow: 'hidden' }),
                        this.$render("i-stack", { id: "pnlPublicLabel", direction: "horizontal", alignItems: "center", gap: "0.25rem", visible: this.isPublicPostLabelShown },
                            this.$render("i-icon", { width: "0.875rem", height: "0.875rem", name: "globe-americas", display: 'inline-flex', fill: Theme.text.secondary }),
                            this.$render("i-label", { caption: "Public", font: { size: '0.875rem', color: Theme.text.secondary } }))),
                    this.$render("i-hstack", { id: "pnlSubscribe", stack: { shrink: '0' }, horizontalAlignment: "end", gap: "0.5rem", visible: !this.pinView },
                        this.$render("i-button", { id: "btnSubscribe", minHeight: 32, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, border: { radius: '1.875rem' }, visible: false, caption: 'Subscribe' }),
                        this.$render("i-panel", { onClick: this.onProfileShown, cursor: "pointer", class: index_css_5.hoverStyle },
                            this.$render("i-icon", { name: "ellipsis-h", width: '1rem', height: '1rem', fill: Theme.text.secondary })))));
                this.gridPost.append(this.$render("i-hstack", { id: "pnlReplyPath", verticalAlignment: "center", gap: "0.25rem", visible: false, grid: { area: 'path' }, margin: { top: '0.5rem' } },
                    this.$render("i-label", { caption: 'replying to', font: { size: '0.875rem', color: Theme.colors.secondary.light } }),
                    this.$render("i-label", { id: "lbReplyTo", font: { size: '0.875rem', color: Theme.colors.primary.main }, cursor: "pointer", onClick: () => this.onGoProfile() })));
                this.gridPost.append(this.$render("i-vstack", { width: '100%', grid: { area: 'content' }, margin: { top: '1rem' } },
                    this.$render("i-panel", { id: "pnlDetail" },
                        this.$render("i-hstack", { id: "showMoreWrapper", visible: false, height: 50, bottom: 0, width: '100%', zIndex: 1, background: { color: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10, 10, 10) 100%)' }, position: 'absolute', justifyContent: 'center', alignItems: 'end' },
                            this.$render("i-button", { id: "btnShowMore", caption: "Show more", margin: { bottom: 10 }, background: { color: 'transparent' }, font: { color: Theme.colors.primary.main, weight: 800, size: '1rem' }, boxShadow: 'unset', onClick: this.handleShowMoreClick.bind(this) })),
                        this.$render("i-vstack", { id: "pnlContent", gap: "0.75rem" }),
                        this.$render("i-vstack", { id: "pnlQuoted", gap: '0.5rem', visible: false, padding: { top: '0.5rem' } }),
                        this.$render("i-panel", { id: "pnlOverlay", visible: false, height: '5rem', width: '100%', position: 'absolute', bottom: "0px", background: { color: `linear-gradient(0, var(--card-bg-color) 0%, transparent 100%)` } })),
                    this.$render("i-hstack", { id: "btnViewMore", verticalAlignment: "center", padding: { top: '1rem' }, gap: '0.25rem', visible: false, onClick: this.onViewMore },
                        this.$render("i-label", { caption: 'Read more', font: { size: '0.9rem', color: Theme.colors.primary.main } }),
                        this.$render("i-icon", { name: "angle-down", width: 16, height: 16, fill: Theme.colors.primary.main })),
                    this.$render("i-stack", { id: "pnlLocked", direction: "vertical", width: "100%", gap: "0.75rem", visible: false },
                        this.$render("i-stack", { direction: "horizontal", width: "100%", minHeight: 150, border: { radius: '0.5rem' }, background: { color: Theme.background.paper }, alignItems: "center", justifyContent: "center" },
                            this.$render("i-icon", { width: "1.5rem", height: "1.5rem", name: "lock", fill: Theme.text.primary })),
                        this.$render("i-button", { id: "btnUnlockPost", width: "100%", minHeight: 36, padding: { left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText, weight: 600 }, border: { radius: '0.5rem' }, caption: 'Unlock', onClick: this.handleUnlockPost })),
                    this.$render("i-hstack", { id: "groupAnalysis", horizontalAlignment: "space-between", padding: { top: '0.563rem' }, width: '100%', visible: !this.pinView })));
            }
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                if (data)
                    await this.setData({ data, isActive, type });
            }
            if (!this.bubbleMenu) {
                this.bubbleMenu = await components_11.ScomPostBubbleMenu.create();
            }
            if (this.overflowEllipse) {
                if ((this.isReply || this.limitHeight)) {
                    this.classList.add(index_css_5.maxHeightStyle);
                }
                // if(this.isReply) {
                //     this.showMoreWrapper.height = '100%';
                // }
            }
            const resizeObserver = new ResizeObserver((entries) => {
                if ((this.isReply || this.limitHeight)
                    && ((this.pnlDetail.scrollHeight > this.pnlDetail.offsetHeight && this.pnlDetail.scrollHeight - this.pnlDetail.offsetHeight > 1)
                        || (this.gridPost.scrollHeight > this.gridPost.offsetHeight && this.gridPost.scrollHeight - this.gridPost.offsetHeight > 1))
                    && (this.pnlDetail.scrollHeight >= 400 || this.gridPost.scrollHeight >= 400)) {
                    if (this.type !== 'quoted' && !this.expanded)
                        this.showMoreWrapper.visible = true;
                }
            });
            resizeObserver.observe(this.pnlDetail);
            this.addEventListener("mouseup", this.showBubbleMenu);
        }
        async showBubbleMenu(event) {
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
                    linkTo: range
                });
            }
            else {
                this.bubbleMenu.closeModal();
            }
        }
        handleShowMoreClick() {
            this.showMoreWrapper.visible = false;
            this.expanded = true;
            this.classList.remove(index_css_5.maxHeightStyle);
        }
        onHide() {
            this.removeEventListener("mouseup", this.showBubbleMenu);
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlWrapper", width: "100%", border: { radius: 'inherit', top: { width: 1, style: 'solid', color: Theme.divider } } },
                this.$render("i-vstack", { id: "pnlGridPost", width: "100%", padding: { left: '1.25rem', right: '1.25rem', top: '1rem', bottom: '1rem' }, border: { radius: '0.5rem' }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }
                            }
                        }
                    ], visible: false },
                    this.$render("i-stack", { id: "pnlPinned", direction: "horizontal", padding: { bottom: "0.75rem" }, margin: { top: "-0.5rem" }, gap: "0.75rem", visible: false },
                        this.$render("i-stack", { direction: "horizontal", width: "2.75rem", justifyContent: "end" },
                            this.$render("i-icon", { width: "1rem", height: "1rem", name: "thumbtack", fill: Theme.text.secondary })),
                        this.$render("i-label", { caption: "Pinned", font: { size: "0.875rem", color: Theme.text.secondary } })),
                    this.$render("i-stack", { id: "pnlRepost", direction: "horizontal", padding: { bottom: "0.75rem" }, margin: { top: "-0.5rem" }, gap: "0.75rem", visible: false }),
                    this.$render("i-grid-layout", { id: "gridPost", 
                        // maxHeight={"calc(100vh - 50px - 94px)"}
                        // overflow={'hidden'}
                        templateColumns: ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'], templateRows: ['auto'], gap: { column: '0.75rem' }, position: 'relative' })),
                this.$render("i-panel", { id: "pnlPost", position: 'relative', border: { radius: '0.5rem' }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }
                            }
                        }
                    ], visible: false }),
                this.$render("i-markdown", { id: 'markdownViewer', visible: false })));
        }
    };
    ScomPost = __decorate([
        (0, components_10.customElements)('i-scom-post')
    ], ScomPost);
    exports.ScomPost = ScomPost;
});
