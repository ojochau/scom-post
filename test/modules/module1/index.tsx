import { Module, customModule, Container } from '@ijstech/components';
import { ScomPost } from '@scom/scom-post';

@customModule
export default class Module1 extends Module {
  private postElm: ScomPost;
  private _data: any = {};
  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this._data = {
      id: 'post',
      publishDate: '10/26/2023 14:40:00',
      author: {
        id: 'author_0',
        username: 'elonmusk',
        description: `Elon Musk`,
        avatar: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
        pubKey: '',
        internetIdentifier: 'elonmusk'
      },
      stat: {
        reply: 10,
        repost: 3,
        upvote: 48,
        downvote: 0,
        view: 20,
      },
      contentElements: [
        {
          module: '@scom/scom-markdown-editor',
          data: {
            properties: {
              content: `This article aims to inform readers about the latest developments and improvements in Solidity, which are based on the community's input and ongoing debates. While the information provided is not conclusive, it sheds light on the potential technological advancements.`,
            },
            tag: {
              width: '100%',
              pt: 0,
              pb: 0,
              pl: 0,
              pr: 0,
            },
          },
        },
      ],
      replyTo: {
        id: 'post_4',
        replyToId: 'post_3',
        publishDate: '10/02/2023 09:15:00',
        author: {
          id: 'author_4',
          username: 'Just_lookin_23',
          description: 'Just Lookin’',
          avatar: 'https://placehold.co/50',
          pubKey: '',
        },
        stat: {
          reply: 17,
          repost: 54,
          upvote: 886,
          downvote: 0,
          view: 11000,
        },
        data: [
          {
            module: '@scom/scom-markdown-editor',
            data: {
              properties: {
                content: 'Exactly. All it shows is that someone had $8 to give X!',
              },
              tag: {
                width: '100%',
                pt: 0,
                pb: 0,
                pl: 0,
                pr: 0,
              },
            },
          },
        ],
        replyTo: {
          id: 'post_4',
          replyToId: 'post_3',
          publishDate: '10/02/2023 09:15:00',
          author: {
            id: 'author_4',
            username: 'Just_lookin_23',
            description: 'Just Lookin’',
            avatar: 'https://placehold.co/50',
            pubKey: '',
          },
          stat: {
            reply: 17,
            repost: 54,
            upvote: 886,
            downvote: 0,
            view: 11000,
          },
          data: [
            {
              module: '@scom/scom-markdown-editor',
              data: {
                properties: {
                  content: 'Exactly. All it shows is that someone had $8 to give X!',
                },
                tag: {
                  width: '100%',
                  pt: 0,
                  pb: 0,
                  pl: 0,
                  pr: 0,
                },
              },
            },
          ],
        },
      },
    };
  }

  init() {
    super.init();
    this.postElm.appendShowMorePanel();
    this.postElm.addReply('post',  {
      id: 'post_3',
      publishDate: '10/02/2023 09:15:00',
      author: {
        "id": "author_3",
        "username": "PinballReed",
        "description": "Reed-Pinball is fun",
        "avatar": "https://placehold.co/50",
        "pubKey": "",
        internetIdentifier: "PinballReed"
      },
      stat: {
        reply: 17,
        repost: 54,
        upvote: 886,
        downvote: 0,
        view: 11000
      },
      contentElements: [{
        module: '@scom/scom-image',
        data: {
          "properties": {
            "url": "https://media2.giphy.com/media/1yMOp5EBtjDlkp5uJ9/source.gif"
          },
          "tag": {
            "width": "200px",
            "pt": 0,
            "pb": 0,
            "pl": 0,
            "pr": 0
          }
        }
      }]
    })
  }

  render() {
    return (
      <i-vstack margin={{ left: 'auto', right: 'auto' }} maxWidth={960}>
        <i-scom-post id="postElm" data={this._data} type="full" display='block' isActive={true} />
      </i-vstack>
    );
  }
}
