export interface RenderResultData {
  receipt: string;
  address: string;
  timestamp: string;
}

export interface DownloadReportData extends RenderResultData {
  symbol: string;
}
