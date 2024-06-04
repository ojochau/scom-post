import {
    Control,
    ControlElement,
    customElements,
    HStack,
    Image,
    Label,
    Module,
    Panel,
    Styles
} from '@ijstech/components';
import { linkPreviewImageStyle } from '../index.css';
import { ILinkPreview } from '../global';

const Theme = Styles.Theme.ThemeVars;

interface ScomPostLinkPreviewElement extends ControlElement {
    data?: ILinkPreview;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-post--link-preview']: ScomPostLinkPreviewElement;
        }
    }
}

@customElements('i-scom-post-link-preview')
export class ScomPostLinkPreview extends Module {
    private imgPreview: Image;
    private lblTitle: Label;
    private lblDesc: Label;
    private lblDomain: Label;
    private _data: ILinkPreview;

    set data(value: ILinkPreview) {
        this._data = value;
        this.imgPreview.url = value.image || '';
        this.imgPreview.visible = !!value.image;
        this.lblTitle.caption = value.title || '';
        this.lblDesc.caption = value.description || '';
        this.lblDesc.visible = !!value.description;
        this.lblDomain.caption = value.url ? this.getDomain(value.url) : '';
        this.lblDomain.visible = !!value.url;
    }

    private getDomain(url: string) {
        try {
            return new URL(url.toLowerCase()).hostname;
        } catch (err) {
            return url;
        }
    }

    private handleLinkPreviewClick() {
        window.open(this._data.url, '_blank');
    }

    render() {
        return (
            <i-panel
                width="100%"
                background={{ color: Theme.background.paper }}
                border={{ radius: '0.75rem' }}
                overflow="hidden"
                cursor="pointer"
                onClick={this.handleLinkPreviewClick}
            >
                <i-image
                    id="imgPreview"
                    class={linkPreviewImageStyle}
                    width="100%"
                    maxHeight={300}
                    objectFit="cover"
                    overflow="hidden"
                    visible={false}
                ></i-image>
                <i-stack
                    direction="vertical"
                    padding={{ top: '0.75rem', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}
                    background={{ color: Theme.background.paper }}
                >
                    <i-label id="lblTitle" font={{ size: '1rem', color: Theme.text.primary, weight: 600 }} lineHeight="1.75rem"></i-label>
                    <i-label id="lblDesc" lineClamp={2} font={{ size: '0.875rem', color: Theme.text.secondary }} lineHeight="1.25rem"></i-label>
                    <i-label id="lblDomain" font={{ size: '0.75rem', color: Theme.text.secondary }} lineHeight="1.25rem"></i-label>
                </i-stack>
            </i-panel>
        )
    }
}