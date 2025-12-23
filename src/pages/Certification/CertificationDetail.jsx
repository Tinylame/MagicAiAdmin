import React from 'react';
import { Descriptions, Image, Tag, Space, Typography } from 'antd';

function CertificationDetail({ selectedRecord }) {
    if (!selectedRecord) return null;

    return (
        <div className="p-4">
            <Descriptions title="基本信息" bordered column={2} size="small">
                <Descriptions.Item label="认证ID">{selectedRecord.id}</Descriptions.Item>
                <Descriptions.Item label="商户ID">{selectedRecord.businessId}</Descriptions.Item>
                <Descriptions.Item label="认证申请单号">{selectedRecord.verificationNo}</Descriptions.Item>
                <Descriptions.Item label="证件类型">{selectedRecord.certificateTypeDesc}</Descriptions.Item>
                <Descriptions.Item label="企业名称"
                    span={2}>{selectedRecord.companyName}</Descriptions.Item>
                <Descriptions.Item label="统一社会信用代码"
                    span={2}>{selectedRecord.unifiedSocialCreditCode}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="注册地址信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                <Descriptions.Item label="注册省份">{selectedRecord.registerProvince}</Descriptions.Item>
                <Descriptions.Item label="注册城市">{selectedRecord.registerCity}</Descriptions.Item>
                <Descriptions.Item label="注册区域">{selectedRecord.registerDistrict}</Descriptions.Item>
                <Descriptions.Item
                    label="详细地址">{selectedRecord.registerDetailAddress}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="法人信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                <Descriptions.Item label="法人姓名">{selectedRecord.legalPersonName}</Descriptions.Item>
                <Descriptions.Item label="身份证号码">{selectedRecord.legalPersonIdCard}</Descriptions.Item>
                <Descriptions.Item label="身份证正面" span={2}>
                    {selectedRecord.legalPersonIdFrontUrl && (
                        <Image
                            width={100}
                            src={selectedRecord.legalPersonIdFrontUrl}
                            alt="身份证正面"
                            style={{ marginRight: 8, aspectRatio: '16/9', objectFit: 'cover' }}
                        />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="身份证反面" span={2}>
                    {selectedRecord.legalPersonIdBackUrl && (
                        <Image
                            width={100}
                            src={selectedRecord.legalPersonIdBackUrl}
                            alt="身份证反面"
                            style={{ marginRight: 8, aspectRatio: '16/9', objectFit: 'cover' }}
                        />
                    )}
                </Descriptions.Item>
            </Descriptions>

            <Descriptions title="证件附件" bordered column={1} size="small" style={{ marginTop: 16 }}>
                <Descriptions.Item label="证件图片">
                    {selectedRecord.certificateFileUrls && selectedRecord.certificateFileUrls.length > 0 ? (
                        <Space wrap>
                            {selectedRecord.certificateFileUrls.map((url, index) => (
                                <Image
                                    key={index}
                                    width={100}
                                    src={url}
                                    alt={`证件图片${index + 1}`}
                                    style={{ marginRight: 8, aspectRatio: '16/9', objectFit: 'cover' }}
                                />
                            ))}
                        </Space>
                    ) : (
                        <Typography.Text type="secondary">暂无证件图片</Typography.Text>
                    )}
                </Descriptions.Item>
            </Descriptions>

            <Descriptions title="审核信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                <Descriptions.Item label="审核状态">
                    <Tag
                        color={selectedRecord.status === 1 ? 'orange' : selectedRecord.status === 2 ? 'green' : 'red'}>
                        {selectedRecord.statusDesc}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                    label="审核时间">{selectedRecord.auditTime || '未审核'}</Descriptions.Item>
                <Descriptions.Item label="审核备注"
                    span={2}>{selectedRecord.auditRemark || '无'}</Descriptions.Item>
                {selectedRecord.rejectReason && (
                    <Descriptions.Item label="拒绝原因" span={2}>
                        <Typography.Text type="danger">{selectedRecord.rejectReason}</Typography.Text>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="创建时间">{selectedRecord.createdAt}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{selectedRecord.updatedAt}</Descriptions.Item>
            </Descriptions>
        </div>
    );
}

export default CertificationDetail;