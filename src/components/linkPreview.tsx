import {
    ControlElement,
    customElements,
    Image,
    Label,
    Module,
    Button,
    Styles,
    Control
} from '@ijstech/components';
import { linkPreviewImageStyle } from '../index.css';
import { getDomain, ILinkPreview } from '../global';

const Theme = Styles.Theme.ThemeVars;
type openDesignerCallback =  (target: Control, data: any) => Promise<void>;

interface ScomPostLinkPreviewElement extends ControlElement {
    data?: ILinkPreview;
    onOpenDesigner?: openDesignerCallback;
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
    private btnOpen: Button;
    private _data: ILinkPreview;

    onOpenDesigner: openDesignerCallback;

    set data(value: ILinkPreview) {
        this._data = value;
        this.imgPreview.url = value.image || '';
        this.imgPreview.visible = !!value.image;
        this.lblTitle.caption = value.title || '';
        this.lblDesc.caption = value.description || '';
        this.lblDesc.visible = !!value.description;
        this.lblDomain.caption = value.url ? getDomain(value.url) : '';
        this.lblDomain.visible = !!value.url;
        const isButtonShown = value.url.startsWith('https://github.com/scom-repos');
        this.btnOpen.visible = isButtonShown;
    }

    private handleLinkPreviewClick() {
        window.open(this._data.url, '_blank');
    }

    private async openDesigner(target: Button, event: MouseEvent) {
        event.stopPropagation();
        const parent = this.parent as any;
        if (typeof this.onOpenDesigner === 'function')
            this.onOpenDesigner(target, this._data);
        else if (typeof parent?.onOpenDesigner === 'function') {
            parent.onOpenDesigner(target, this._data);
        }
    }

    render() {
        return (
            <i-panel
                width="100%"
                background={{ color: Theme.background.paper }}
                margin={{ top: '0.5rem' }}
                border={{ radius: '0.75rem' }}
                overflow="hidden"
                cursor="pointer"
                onClick={this.handleLinkPreviewClick}
            >
                <i-image
                    id="imgPreview"
                    class={linkPreviewImageStyle}
                    display="block"
                    width="100%"
                    maxHeight={250}
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
                    <i-hstack horizontalAlignment='center'>
                        <i-button
                            id="btnOpen"
                            visible={false}
                            padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
                            font={{ size: '0.875rem', color: Theme.text.primary }}
                            boxShadow='none'
                            background={{ color: Theme.colors.primary.main }}
                            caption='Open in Designer'
                            onClick={this.openDesigner}
                        ></i-button>
                    </i-hstack>
                </i-stack>
                <i-modal
                    id="mdDesigner"
                    width={'100dvw'}
                    height={'100dvh'}
                    popupPlacement='center'
                    closeIcon={null}
                >
                    <i-panel id="pnlDesigner"></i-panel>
                </i-modal>
            </i-panel>
        )
    }
}