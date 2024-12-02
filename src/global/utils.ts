import { FormatUtils, moment, application } from "@ijstech/components";
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

const getDuration = (date: Date | string) => {
  if (!date) return '';
  const startDate = moment(date);
  const endDate = moment(new Date());

  const currentLg = application.locale;
  const locale = currentLg.startsWith('zh') ? 'zh-hk' : currentLg;
  if (locale !== moment.locale()) moment.locale(locale);

  if (startDate.year() !== endDate.year()) {
      return startDate.format('MMM DD, YYYY');
  }

  const duration = moment.duration(endDate.diff(startDate));
  const days = duration.days();
  if (days >= 1) return startDate.format('MMM DD');
  const hours = duration.asHours();
  if (hours >= 1) {
    return moment.localeData()?.relativeTime(Number(formatNumber(hours, 0)), false, 'hh', false);
  }
  const minutes = duration.asMinutes();
  if (minutes >= 1) {
    return moment.localeData()?.relativeTime(Number(formatNumber(minutes, 0)), false, 'mm', false);
  }
  const seconds = duration.asSeconds();
  return moment.localeData()?.relativeTime(Number(formatNumber(seconds, 0)), false, 'ss', false);
}

export {
  getImageIpfsUrl,
  formatNumber,
  getDuration
}