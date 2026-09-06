import { useState } from 'react';
import { 
  UploadCloudIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  CloseIcon, 
  FileTextIcon, 
  ArrowRightIcon,
  CheckIcon,
  RefreshCwIcon
} from './Icons';

export default function DataMigrationModal({ isOpen, onClose, onImportSuccess }) {
  const [step, setStep] = useState(1); // 1: Select Format & Upload, 2: Column Mapping, 3: Validation & Commit
  const [sourceFormat, setSourceFormat] = useState('misa'); // 'misa' | 'excel_custom' | 'fast'
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleLoaded, setSampleLoaded] = useState(false);

  // Column mapping state for custom spreadsheets
  const [columnMapping, setColumnMapping] = useState({
    businessName: 'Col_B_TenHoKinhDoanh',
    taxCode: 'Col_C_MaSoThue',
    ownerPhone: 'Col_D_SoDienThoaiChuHo',
    industryGroup: 'Col_E_NganhNghe',
    regime: 'Col_F_PhuongPhapThue',
    annualRevenue: 'Col_G_DoanhThuLuyKe'
  });

  // Parsed / Preview records
  const [previewRecords, setPreviewRecords] = useState([]);

  // Sample MISA HKD export dataset
  const sampleMisaDataset = [
    { id: 'm1', name: 'Tiệm Trà Sữa Gong Cha Phố Huế', mst: '0109988771', phone: '0912345678', industry: 'fnb', regime: 'group2', rev: 920000000, isValid: true },
    { id: 'm2', name: 'Nhà Thuốc An Khang Cầu Giấy', mst: '0108877662', phone: '0987654321', industry: 'retail', regime: 'group2', rev: 1450000000, isValid: true },
    { id: 'm3', name: 'Xưởng Mộc Thủ Công Mỹ Nghệ', mst: '0107766553', phone: '0901234567', industry: 'services', regime: 'group1', rev: 410000000, isValid: true },
    { id: 'm4', name: 'Cửa Hàng Điện Máy Tân Bình', mst: '0106655444', phone: '0934567890', industry: 'retail', regime: 'group2', rev: 890000000, isValid: true },
    { id: 'm5', name: 'Salon Tóc & Spa Hương Thảo', mst: '0105544335', phone: '0978901234', industry: 'services', regime: 'group2', rev: 620000000, isValid: true },
    { id: 'm6', name: 'Tiệm Bánh Mì Chảo Cô Ba', mst: '0104433226', phone: '0965432109', industry: 'fnb', regime: 'group2', rev: 780000000, isValid: true },
    { id: 'm7', name: 'Kho Hàng Gia Dụng Việt Nhật', mst: '0103322117', phone: '0943210987', industry: 'retail', regime: 'group3', rev: 3200000000, isValid: true },
    { id: 'm8', name: 'Cửa Hàng Thời Trang May Đo', mst: '0102211008-001', phone: '0921098765', industry: 'retail', regime: 'group2', rev: 530000000, isValid: true },
    { id: 'm9', name: 'Đại Lý Phân Bón Miền Tây', mst: '0101100999', phone: '0910987654', industry: 'retail', regime: 'group1', rev: 460000000, isValid: true },
    { id: 'm10', name: 'Tiệm Lẩu Nướng Gió Biển', mst: '0109988220', phone: '0989012345', industry: 'fnb', regime: 'group2', rev: 1120000000, isValid: true }
  ];

  if (!isOpen) return null;

  const handleLoadSampleMisa = () => {
    setIsProcessing(true);
    setSelectedFileName('MISA_Export_DanhMuc_HoKinhDoanh_2026.xlsx');
    setTimeout(() => {
      setPreviewRecords(sampleMisaDataset);
      setSampleLoaded(true);
      setIsProcessing(false);
      setStep(2);
    }, 600);
  };

  const handleCommitMigration = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onImportSuccess) {
        onImportSuccess(previewRecords);
      }
      onClose();
    }, 1000);
  };

  const fmtCurrency = (val) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

  return (
    <div className="cpa-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="cpa-modal-card" style={{
        background: '#0e1626',
        border: '1px solid rgba(0, 245, 212, 0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        color: '#f0f4f8',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloudIcon size={20} color="#00f5d4" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Trình Di Cư Dữ Liệu Khách Hàng (MISA & Excel Import)
              </h2>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Nhập danh mục 20 - 50 hộ kinh doanh từ phần mềm cũ sang A-Sổ trong 1 cú nhấp.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: step >= 1 ? '#00f5d4' : '#64748b' }}>
            <span style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: step >= 1 ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              border: step >= 1 ? '1px solid #00f5d4' : '1px solid #64748b'
            }}>1</span>
            <span>Tải Tệp Lên</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: step >= 2 ? '#00f5d4' : '#64748b' }}>
            <span style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: step >= 2 ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              border: step >= 2 ? '1px solid #00f5d4' : '1px solid #64748b'
            }}>2</span>
            <span>Ánh Xạ Cột (Column Mapping)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: step >= 3 ? '#00f5d4' : '#64748b' }}>
            <span style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: step >= 3 ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              border: step >= 3 ? '1px solid #00f5d4' : '1px solid #64748b'
            }}>3</span>
            <span>Kiểm Tra & Nạp Danh Mục</span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', flex: 1 }}>
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Chọn nguồn dữ liệu xuất khẩu:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'misa', label: 'MISA SME / meInvoice', desc: 'Định dạng danh mục khách hàng .xlsx tiêu chuẩn của MISA' },
                    { id: 'excel_custom', label: 'Bảng Excel Tùy Biến', desc: 'Tự ánh xạ cột từ sổ sách nội bộ của đại lý thuế' },
                    { id: 'fast', label: 'FAST Accounting', desc: 'Dữ liệu xuất từ phân hệ hộ kinh doanh FAST' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSourceFormat(item.id)}
                      style={{
                        textAlign: 'left',
                        padding: '14px',
                        borderRadius: '10px',
                        background: sourceFormat === item.id ? 'rgba(0, 245, 212, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: sourceFormat === item.id ? '1px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: sourceFormat === item.id ? '#00f5d4' : '#fff' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div style={{
                border: '2px dashed rgba(0, 245, 212, 0.3)',
                borderRadius: '12px',
                padding: '36px 20px',
                textAlign: 'center',
                background: 'rgba(0, 245, 212, 0.02)',
                marginBottom: '20px'
              }}>
                <FileTextIcon size={40} color="#00f5d4" className="mx-auto" />
                <h4 style={{ margin: '12px 0 4px', fontSize: '15px', color: '#fff' }}>
                  Kéo thả tệp Excel (.xlsx, .xls) hoặc CSV vào đây
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  Hỗ trợ tệp dung lượng tối đa 20MB. Dữ liệu được bảo mật chuẩn Nghị định 13/2023.
                </p>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={handleLoadSampleMisa}
                    style={{
                      background: 'rgba(0, 245, 212, 0.15)',
                      color: '#00f5d4',
                      border: '1px solid rgba(0, 245, 212, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCwIcon size={14} />
                    <span>Nạp Tệp Mẫu MISA (10 Hộ Kinh Doanh Thực Tế)</span>
                  </button>
                </div>
              </div>

              {selectedFileName && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(0, 245, 212, 0.05)',
                  border: '1px solid rgba(0, 245, 212, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <span style={{ color: '#00f5d4', fontWeight: 600 }}>Da chon: {selectedFileName}</span>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>10 dong du lieu hop le</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{
                background: 'rgba(0, 245, 212, 0.05)',
                border: '1px solid rgba(0, 245, 212, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#00f5d4' }}>Tự Động Ánh Xạ Chuẩn MISA: </span>
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Hệ thống đã nhận diện 6/6 trường dữ liệu cốt lõi.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    background: '#00f5d4',
                    color: '#05101a',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Xác Nhận Ánh Xạ
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[
                  { field: 'businessName', label: 'Tên Hộ Kinh Doanh', defaultCol: 'Cột B: Ten_HKD', mapped: 'Tiệm Trà Sữa Gong Cha Phố Huế' },
                  { field: 'taxCode', label: 'Mã Số Thuế (MST)', defaultCol: 'Cột C: Ma_So_Thue', mapped: '0109988771' },
                  { field: 'ownerPhone', label: 'Số Điện Thoại Chủ Hộ', defaultCol: 'Cột D: Dien_Thoai', mapped: '0912345678' },
                  { field: 'industryGroup', label: 'Nhóm Ngành Nghề', defaultCol: 'Cột E: Nganh_Nghe', mapped: 'fnb (Ăn uống)' },
                  { field: 'regime', label: 'Phân Loại Thông Tư 152', defaultCol: 'Cột F: Che_Do_Thue', mapped: 'Nhóm 2 (Mẫu S2a-HKD)' },
                  { field: 'annualRevenue', label: 'Doanh Thu Lũy Kế 2026', defaultCol: 'Cột G: Doanh_Thu_YTD', mapped: '920.000.000đ' }
                ].map(item => (
                  <div key={item.field} style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
                      {item.defaultCol}
                    </div>
                    <div style={{ fontSize: '11px', color: '#00f5d4', marginTop: '2px' }}>
                      Ví dụ giá trị: {item.mapped}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>
                    Xem Trước Danh Mục Sắp Nhập (10 Hộ Kinh Doanh)
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    100% hồ sơ đã vượt qua kiểm tra định dạng MST và số điện thoại.
                  </p>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(0, 245, 212, 0.15)',
                  color: '#00f5d4',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  10 Hộ Sẵn Sàng
                </span>
              </div>

              {/* Table preview */}
              <div style={{
                maxHeight: '280px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8' }}>
                    <tr>
                      <th style={{ padding: '8px 12px' }}>Tên Hộ Kinh Doanh</th>
                      <th style={{ padding: '8px 12px' }}>Mã Số Thuế</th>
                      <th style={{ padding: '8px 12px' }}>Chế Độ TT152</th>
                      <th style={{ padding: '8px 12px' }}>Doanh Thu Lũy Kế</th>
                      <th style={{ padding: '8px 12px' }}>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRecords.map((r, i) => (
                      <tr key={r.id} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '8px 12px', color: '#fff', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#cbd5e1' }}>{r.mst}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            background: r.regime === 'group2' ? 'rgba(0, 245, 212, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                            color: r.regime === 'group2' ? '#00f5d4' : '#38bdf8'
                          }}>
                            {r.regime === 'group1' ? 'Nhóm 1 (S1a)' : r.regime === 'group2' ? 'Nhóm 2 (S2a)' : 'Nhóm 3 (S2b-e)'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', color: '#e2e8f0' }}>{fmtCurrency(r.rev)}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ color: '#00f5d4', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                            <CheckIcon size={12} /> Hợp lệ
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(5, 10, 20, 0.5)'
        }}>
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {step === 1 ? 'Hủy Bỏ' : 'Quay Lại'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {step < 3 ? (
              <button
                type="button"
                disabled={!selectedFileName}
                onClick={() => setStep(s => s + 1)}
                style={{
                  background: selectedFileName ? '#00f5d4' : 'rgba(255, 255, 255, 0.1)',
                  color: selectedFileName ? '#05101a' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: selectedFileName ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Tiếp Tục</span>
                <ArrowRightIcon size={14} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCommitMigration}
                style={{
                  background: '#00f5d4',
                  color: '#05101a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isProcessing ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircleIcon size={16} />
                <span>{isProcessing ? 'Đang Nạp Dữ Liệu...' : 'Xác Nhận Nạp 10 Hộ Vào Danh Mục'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
