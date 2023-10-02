import { Module, customModule, Container } from '@ijstech/components';
import ScomPost from '@scom/scom-post';

@customModule
export default class Module1 extends Module {
    private _data: any = {};
    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this._data = {
            "username": "OpenSwap",
            "description": "We are thrilled to announce that the OpenSwap Bridge has officially launched its pilot phase! This means that you can now transfer your $OSWAP tokens between the BNB Smart Chain and Avalanche.",
            "dataUri": "bafybeicijtusosl6v3xdmvva2ggsuazfqk54qpv7z4yfib5asmbeeps3uq",
            "owner": "0xaA530FC26ee1Be26a27ca2CC001e74b972563a22",
            "avatar": "https://placehold.co/50",
            "publishDate": 1695876446.837,
            "analytics": {
              reply: 7,
              repost: 4,
              voted: 2300,
              bookmark: 950000,
              view: 10000000
            }
        }

        const widgetData = {
            "sections": [
              {
                "id": "6876b0ab-a29c-4ed8-905e-51cd515fa26c",
                "row": 0,
                "name": "First section",
                "elements": [
                  {
                    "id": "ed212703-9bb6-4bc4-9cc3-4d98136dcb06",
                    "column": 1,
                    "columnSpan": 12,
                    "properties": {
                      "content": "<span style=\"font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\">A week ago, the top Senate Democrat announced a more casual dress code in the chamber. But on Wednesday, the Senate formalized a longstanding — but previously unofficial — requirement that members show up to the chamber in business attire.</span>"
                    },
                    "module": {},
                    "tag": {
                      "pt": '10px',
                      "pb": '10px'
                    },
                    "elements": [
                      {
                        "id": "c30c832b-8d9f-4ecc-963d-0a45085c3332",
                        "column": 1,
                        "columnSpan": 12,
                        "properties": {
                          "content": "<span style=\"color: #585858\" class=\"p5\">We are thrilled to announce that the OpenSwap Bridge has officially launched its pilot phase! This means that you can now transfer your $OSWAP tokens between the </span>[<span style=\"color: #585858\" class=\"p5\">BNB Smart Chain</span>](https://www.bnbchain.org/en/smartChain)<span style=\"color: #585858\" class=\"p5\"> and </span>[<span style=\"color: #585858\" class=\"p5\">Avalanche</span>](https://www.avax.network/)<span style=\"color: #585858\" class=\"p5\">.</span>"
                        },
                        "module": {
                          "name": "Text box",
                          "path": "scom-markdown-editor",
                          "category": "widgets",
                          "imgUrl": "https://ipfs.scom.dev/ipfs/bafybeicn7huboxcg5aiietevo2dwdmigsnpfokg7erxhaysbqdezz4p2qq/composables/textbox.png"
                        },
                        "tag": {
                          "width": "100%",
                          "height": 170,
                          "pt": '0px',
                          "pb": '0px'
                        }
                      },
                      {
                        "id": "ad666a03-715e-4611-8605-33652ce51ba3",
                        "column": 1,
                        "columnSpan": 12,
                        "properties": {
                          "title": "",
                          "description": "",
                          "linkUrl": "",
                          "isExternal": false,
                          "backgroundImageUrl": "https://miro.medium.com/v2/resize:fit:720/format:webp/1*bvMYR5ACNydZ4P1PP3kYaw.png",
                          "userName": "",
                          "avatar": ""
                        },
                        "module": {
                          "name": "Blog",
                          "path": "scom-blog",
                          "category": "widgets",
                          "disableClicked": true,
                          "imgUrl": "https://ipfs.scom.dev/ipfs/bafybeicn7huboxcg5aiietevo2dwdmigsnpfokg7erxhaysbqdezz4p2qq/composables/blog.png"
                        },
                        "tag": {
                          "titleFontColor": "#565656",
                          "descriptionFontColor": "#565656",
                          "linkTextColor": "#FE8B10",
                          "dateColor": "#565656",
                          "userNameColor": "#565656",
                          "backgroundColor": "#fff",
                          "pt": '0px',
                          "pb": '0px'
                        }
                      }
                    ],
                    "config": {
                      "backgroundColor": "#e09e9eff",
                      "margin": {
                          "x": "auto",
                          "y": "0"
                      },
                      "sectionWidth": 1000,
                      "textColor": "#000000de",
                      "customBackdrop": false,
                      "backdropColor": "",
                      "padding": {
                          "bottom": 0,
                          "left": 0,
                          "right": 0,
                          "top": 0
                      },
                      "fullWidth": false,
                      "customBackgroundColor": false,
                      "customTextColor": false,
                      "customTextSize": false,
                      "textSize": "md",
                      "border": false,
                      "borderColor": ""
                    }
                  }
                ],
                config: {
                  "backgroundColor": "#e09e9eff",
                  "padding": {
                    "bottom": 0,
                    "left": 0,
                    "right": 0,
                    "top": 0
                }
                }
              }
            ]
        }
    }

    init() {
        super.init();
    }

    render() {
        return <i-vstack margin={{left: 'auto', right: 'auto'}} maxWidth={960}>
            <i-scom-post
                data={this._data}
            />
        </i-vstack>
    }
}