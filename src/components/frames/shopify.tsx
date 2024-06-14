import {
    ControlElement,
    customElements,
    FormatUtils,
    Image,
    Label,
    Module,
    Styles
} from '@ijstech/components';
import { getDomain, IShopifyFrame } from '../../global';
import { domainLinkStyle, getImageStyle } from '../index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomPostShopifyFrameElement extends ControlElement {
    data?: IShopifyFrame
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-post--frames-shopify']: ScomPostShopifyFrameElement;
        }
    }
}

@customElements('i-scom-post--frames-shopify')
export class ScomPostShopifyFrame extends Module {
    private imgProduct: Image;
    private lblTitle: Label;
    private lblPrice: Label;
    private lblDesc: Label;
    private lblDomain: Label;

    private _data: IShopifyFrame;

    set data(value: IShopifyFrame) {
        this._data = value;
        this.imgProduct.url = this._data.image || "";
        this.lblTitle.caption = this._data.title || "";
        const currency = ['AUD', 'CAD', 'HKD', 'TWD', 'USD'].includes(this._data.currency?.toUpperCase()) ? this._data.currency.slice(0, 2) + '$' : this._data.currency;
        const price = FormatUtils.formatNumber(this._data.price, { useSeparators: true, decimalFigures: 2, hasTrailingZero: true })
        this.lblPrice.caption = currency ? `${currency}${price}` : `$${price}`;
        this.lblPrice.visible = this._data.price != null;
        this.lblDesc.caption = this._data.description || "";
        this.lblDesc.visible = this._data.description != null;
        this.lblDomain.caption = this._data.url ? getDomain(this._data.url) : '';
        this.lblDomain.link.href = this._data.url || '';
    }

    handleButtonClick() {
        window.open(this._data.url, '_blank');
    }

    render() {
        return (
            <i-stack direction="vertical" width="100%" height="100%" gap="0.25rem">
                <i-panel
                    width="100%"
                    height="100%"
                    border={{ width: 1, style: 'solid', color: Theme.divider, radius: '0.5rem' }}
                    background={{ color: Theme.action.disabledBackground }}
                    overflow="hidden"
                >
                    <i-image id="imgProduct" class={getImageStyle('1 / 1')} width="100%" height="100%" objectFit="cover"></i-image>
                    <i-stack direction="vertical" padding={{ top: "0.5rem", left: '1rem', right: '1rem' }} gap="0.5rem">
                        <i-label id="lblTitle" font={{ size: '1.5rem', color: Theme.text.primary, weight: 600 }} lineHeight="2rem"></i-label>
                        <i-label id="lblPrice" font={{ size: '1.125rem', color: Theme.colors.primary.main, weight: 600 }} lineHeight="1.5rem"></i-label>
                        <i-label id="lblDesc" font={{ size: '0.875rem', color: Theme.text.secondary, weight: 400 }} lineHeight="1.125rem" lineClamp={3} visible={false}></i-label>
                    </i-stack>
                    <i-stack
                        direction="horizontal"
                        alignItems="center"
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        gap="0.5rem"
                    >
                        <i-button
                            height="2.25rem"
                            caption="Buy Now"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                            border={{ radius: '0.5rem' }}
                            stack={{ grow: '1' }}
                            background={{ color: Theme.colors.secondary.main }}
                            font={{ size: '0.875rem', color: Theme.colors.secondary.contrastText, weight: 400 }}
                            onClick={this.handleButtonClick}
                        ></i-button>
                    </i-stack>
                </i-panel>
                <i-label
                    id="lblDomain"
                    class={`text-right ${domainLinkStyle}`}
                    width="100%"
                    font={{ size: '0.875rem', color: Theme.text.secondary, weight: 500 }}
                    lineHeight="1.25rem"
                    link={{ target: '_blank' }}
                ></i-label>
            </i-stack>
        )
    }
}