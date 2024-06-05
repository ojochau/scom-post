import { FormatUtils, moment } from "@ijstech/components";
import { getIPFSGatewayUrl } from "../store/index";

const getImageIpfsUrl = (url: string) => {
  const ipfsBaseUrl = getIPFSGatewayUrl();
  if (isIpfsCid(url))
    return ipfsBaseUrl + url;
  return url;
}

const isIpfsCid = (value: string): boolean => {
  const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
  return regex.test(value);
}

const formatNumber = (value: number | string, decimal?: number) => {
  const numberValue = Number(value);
  if (numberValue >= 10000) {
    return FormatUtils.formatNumber(value, { shortScale: true, decimalFigures: decimal ?? 0 })
  }
  return FormatUtils.formatNumber(value, { decimalFigures: decimal ?? 0 })
}

const getDuration = (date: Date|string) => {
  const startDate = moment(date);
  const endDate = moment(new Date());
  let duration = moment.duration(endDate.diff(startDate));
  let days = duration.asDays();
  if (startDate.year() !== endDate.year()) return startDate.format('MMM DD, YYYY');
  if (days >= 1) return startDate.format('MMM DD');
  let hours = duration.asHours();
  if (hours >= 1) return `${formatNumber(hours, 0)}h`;
  let minutes = duration.asMinutes();
  if (minutes >= 1) return `${formatNumber(minutes, 0)}m`;
  let seconds = duration.asSeconds();
  return `${formatNumber(seconds, 0)}s`;
}

export {
  getImageIpfsUrl,
  formatNumber,
  getDuration
}