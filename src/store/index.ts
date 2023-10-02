export const state = {
  ipfsGatewayUrl: ""
}

export const setDataFromJson = (options: any) => {
  if (options.ipfsGatewayUrl) {
    setIPFSGatewayUrl(options.ipfsGatewayUrl);
  }
}

export const setIPFSGatewayUrl = (url: string) => {
  state.ipfsGatewayUrl = url;
}

export const getIPFSGatewayUrl = () => {
  return state.ipfsGatewayUrl;
}
