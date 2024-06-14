import {
    Button,
    ControlElement,
    customElements,
    Image,
    Input,
    Label,
    Module,
    StackLayout,
    Styles
} from '@ijstech/components';
import { getDomain, IFarcasterFrame, IFrameButton } from '../../global';
import { domainLinkStyle, getImageStyle } from '../index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomPostFarcasterFrameElement extends ControlElement {
    data?: IFarcasterFrame;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-post--frames-farcaster']: ScomPostFarcasterFrameElement;
        }
    }
}

@customElements('i-scom-post--frames-farcaster')
export class ScomPostFarcasterFrame extends Module {
    private imgFrame: Image;
    private pnlControls: StackLayout;
    private inputFrame: Input;
    private pnlButtons: StackLayout;
    private lblDomain: Label;
    private imageStyle: string;
    
    private _data: IFarcasterFrame;
    
    set data(value: IFarcasterFrame) {
        this._data = value || { image: '', url: '' };
        this.updateFrame();
    }

    private updateFrame() {
        this.imgFrame.url = this._data.image || "";
        const aspectRatio = this._data.aspect_ratio?.replace(':', '/') || "1 / 1";
        if (this.imageStyle) this.imgFrame.classList.remove(this.imageStyle);
        this.imageStyle = getImageStyle(aspectRatio);
        this.imgFrame.classList.add(this.imageStyle);
        this.pnlControls.visible = !!this._data.input_text || this._data.buttons?.length > 0;
        this.inputFrame.placeholder = this._data.input_text || "";
        this.inputFrame.visible = !!this._data.input_text;
        this.lblDomain.caption = this._data.url ? getDomain(this._data.url) : '';
        this.lblDomain.link.href = this._data.url || '';
        this.renderButtons();
    }

    private renderButtons() {
        this.pnlButtons.clearInnerHTML();
        if (this._data.buttons) {
            for (let buttonData of this._data.buttons) {
                if (!buttonData) continue;
                const options: any = {
                    caption: buttonData.caption || "",
                    height: '2.25rem',
                    padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' },
                    border: { radius: '0.5rem' },
                    stack: { grow: '1' },
                    background: { color: Theme.colors.secondary.main },
                    font: { size: '0.875rem', color: Theme.colors.secondary.contrastText, weight: 400 },
                    rightIcon: { name: 'external-link-alt' }
                };
                if (buttonData.action === 'link') {
                    options.rightIcon = { width: '0.75rem', height: '0.75rem', name: 'external-link-alt' }
                }
                const button = new Button(undefined, options);
                button.onClick = () => {
                    this.handleButtonClick(buttonData);
                }
                this.pnlButtons.appendChild(button);
            }
        }
        this.pnlButtons.visible = this._data.buttons?.length > 0;
    }
    
    private handleImageClick() {
        if (this._data.url) {
            window.open(this._data.url, '_blank');
        }
    }
    
    private handleButtonClick(data: IFrameButton) {
        if (data.action === 'link') {
            window.open(data.target || "", '_blank');
        }
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
                    <i-image id="imgFrame" width="100%" height="100%" objectFit="cover" cursor="pointer" onClick={this.handleImageClick}></i-image>
                    <i-stack
                        id="pnlControls"
                        direction="vertical"
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        gap="0.5rem"
                        visible={false}
                    >
                        <i-input id="inputFrame" width="100%" visible={false}></i-input>
                        <i-stack
                            id="pnlButtons"
                            direction="horizontal"
                            alignItems="center"
                            gap="0.5rem"
                            visible={false}
                        ></i-stack>
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