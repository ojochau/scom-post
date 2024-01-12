import {
  Control,
  ControlElement,
  customElements,
  HStack,
  Module,
  Styles
} from '@ijstech/components';
import { tooltipStyle } from './index.css';
import assets from '../assets';
const Theme = Styles.Theme.ThemeVars;

interface ScomPostBubbleMenuElement extends ControlElement {
  items?: IItem[];
}

interface IItem {
  icon: any;
  tooltipText?: string;
  onClick?: (target: Control, event: Event) => void;
}

const defaultItems = [
  {
    icon: { name: 'edit'},
    onClick: () => {
    }
  },
  {
    icon: { name: 'comment'},
    onClick: () => {
    }
  },
  {
    icon: { image: {url: assets.fullPath('img/twitter.svg')}, display: 'inline-flex', width: '1.563rem', height: '1.563rem' },
    tooltipText: 'Post on "X"',
    onClick: () => {
      const query = new URLSearchParams();
      query.set('text', window.getSelection()?.toString() || '');
      // query.set('url', '');
      const url = `https://twitter.com/intent/tweet?${query.toString()}`;
      window.open(url);
    }
  }
]

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-post--bubble-menu']: ScomPostBubbleMenuElement;
    }
  }
}

@customElements('i-scom-post--bubble-menu')
export class ScomPostBubbleMenu extends Module {
  private pnlItems: HStack;

  private _items: IItem[];

  get items() {
    return this._items;
  }
  set items(value) {
    this._items = value;
  }

  setData(items: IItem[]) {
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
      padding: {left: '0.2rem', right: '0.2rem', top: '0.2rem', bottom: '0.2rem'},
      fill: Theme.text.primary
    };
    for (let item of items) {
      const btn = <i-button
        icon={{...iconProps, ...item.icon}}
        background={{color: 'transparent'}}
        height={'auto'}
        boxShadow="none"
        tooltip={{ content: item.tooltipText || '' }}
      />
      btn.onClick = () => {
        if (item.onClick) item.onClick(btn, null);
      }
      this.pnlItems.append(btn);
    }
  }

  init(): void {
    super.init();
    const items = this.getAttribute('items', true) || defaultItems;
    this.setData(items);
  }

  render(): void {
    return (
      <i-panel
        background={{ color: Theme.background.modal }}
        border={{ radius: '3px' }}
        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
        width={'100%'}
        height={'100%'}
        class={tooltipStyle}
      >
        <i-hstack
          id="pnlItems"
          verticalAlignment="center"
          gap={'0.375rem'}
          maxWidth={'100%'}
        ></i-hstack>
        <i-panel
          height={10}
          width={10}
          position="absolute"
          left="50%"
          bottom={'-0.9rem'}
          zIndex={-1}
          margin={{ left: -5 }}
          class="caret"
        ></i-panel>
      </i-panel>
    );
  }
}