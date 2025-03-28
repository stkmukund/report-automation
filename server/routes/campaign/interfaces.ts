export interface RequestOptions {
  method:
  | "POST"
  | "GET"
  | "HEAD"
  | "PATCH"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";
  redirect: RequestRedirect;
  body: number[];
}

export interface requestOptionsTransaction {
  method:
  | "POST"
  | "GET"
  | "HEAD"
  | "PATCH"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";
  redirect: RequestRedirect;
  body: string;
}

export interface SalesTotalResponse {
  totalAmount: number;
  refundedAmount: number;
  initialSales: number;
  declined: number;
  creditCard: number;
  payPal: number;
}

export interface InitialVipResponse {
  totalResults: number;
  creditCard: number;
  payPal: number;
}

export interface RebillRevenueResponse {
  rebillApproveCount: number;
  rebillDeclineCount: number;
  rebillRevenue: number;
  rebillApprovedPerc: number;
  rebillRefundRev: number;
  chargebackCnt: number;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}
