import { request } from '@/config'
const { Post, Get } = request

// 查询退款记录
export function commercialTenantWithdrawalList(data) {
  return Post('/refund/all', data)
}

// 管理员通过退款 传入refundId
export function commercialTenantWithdrawalAuditPass(data) {
  return Post('/refund/audit/pass', data)
}

// 管理员拒绝退款 传入refundId
export function commercialTenantWithdrawalAuditReject(data) {
  return Post('/refund/audit/reject', data)
}

// 导出退款数据
export function exportCommercialTenantWithdrawal(data) {
  return Post('/refund/all/export', data, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
