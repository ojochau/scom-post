import { Control, application } from '@ijstech/components';
import { ILinkPreview, IPostData } from './interface';

export * from './utils';
export * from './interface';

export const MAX_HEIGHT = 352;

export const getEmbedElement = async (postData: IPostData, parent: Control, callback?: any) => {
  const { module, data } = postData;
  const elm = await application.createElement(module, true) as any;
  if (!elm) throw new Error('not found');
  elm.parent = parent;
  const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf: any) => conf.target === 'Builders') : null;
  if (elm.ready) await elm.ready();
  elm.maxWidth = '100%';
  elm.maxHeight = '100%';
  if (builderTarget?.setData && data.properties) {
    await builderTarget.setData(data.properties);
  }
  if (builderTarget?.setTag && data.tag) {
    await builderTarget.setTag(data.tag);
  }
  application.EventBus.dispatch('POST_CREATED_EMBED_ELEMENT', { module, elm });
  if (callback) callback(elm);
  return elm;
}

export const getLinkPreview = async (apiBaseUrl: string, url: string): Promise<ILinkPreview | undefined> => {
  try {
    if (!apiBaseUrl.endsWith('/')) apiBaseUrl += '/';
    const response = await fetch(`${apiBaseUrl}preview?url=${encodeURI(url)}`);
    const result = await response.json();
    return {
      url,
      title: result.title,
      description: result.description,
      image: result.image,
      og_tags: result.og_tags
    }
  } catch (err) {}
}

export const getDomain = (url: string) => {
  try {
    return new URL(url.toLowerCase()).hostname;
  } catch (err) {
    return url;
  }
}