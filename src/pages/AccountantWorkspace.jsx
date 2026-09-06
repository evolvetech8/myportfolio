import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  CalendarIcon, 
  UploadCloudIcon, 
  LayersIcon, 
  FilterIcon, 
  EyeIcon, 
  DownloadCloudIcon, 
  BuildingIcon, 
  AlertTriangleIcon,
  ShieldIcon,
  CheckCircleIcon,
  FileTextIcon,
  SearchIcon,
  PlusIcon,
  SparklesIcon,
  LockIcon,
  CheckIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  CloseIcon,
  QrCodeIcon
} from '../components/Icons';
import ClientReadOnlyPortal from '../components/ClientReadOnlyPortal';
import DataMigrationModal from '../components/DataMigrationModal';
import AuditTrailModal from '../components/AuditTrailModal';
import CpaAuthModal from '../components/CpaAuthModal';
import CpaBillingModal from '../components/CpaBillingModal';

export default function AccountantWorkspace() {
  const navigate = useNavigate();

  // Active Tab: 'portfolio' | 'calendar' | 'import'
  const [activeTab, setActiveTab] = useState('portfolio');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [regimeFilter, setRegimeFilter] = useState('all'); // 'all' | 'group1' | 'group2' | 'group3'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'current' | 'review' | 'deadline'
  const [industryFilter, setIndustryFilter] = useState('all'); // 'all' | 'fnb' | 'retail' | 'service'

  // Multi-select state for Bulk Operations
  const [selectedClientIds, setSelectedClientIds] = useState(new Set());

  // Modal States
  const [previewPortalClient, setPreviewPortalClient] = useState(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showCsvImportModal, setShowCsvImportModal] = useState(false);
  const [selectedImportClient, setSelectedImportClient] = useState(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);

  // RBAC & Plan State
  const [currentRole, setCurrentRole] = useState('firm_owner'); // 'firm_owner' | 'senior_accountant' | 'junior_accountant'
  const [currentPlan, setCurrentPlan] = useState('starter');

  // Persona Target View State (Resolves User Persona Alignment)
  // 'huong': Chị Nguyễn Thị Hương (Kế toán dịch vụ tự do, 38 tuổi, Bình Thạnh HCMC, 22 hộ, Gói Khởi Nghiệp 490k)
  // 'tuan': Anh Trần Văn Tuấn (Chủ đại lý thuế An Bình, 42 tuổi, Cầu Giấy HN, 5 nhân sự, 90 hộ, Gói Pro Studio 1.490k)
  const [personaMode, setPersonaMode] = useState('huong');
  const [staffFilter, setStaffFilter] = useState('all'); // 'all' | 'trang' | 'duc' | 'linh'

  // Partial-Failure Bulk Runner State
  const [bulkExecutionModal, setBulkExecutionModal] = useState({
    isOpen: false,
    title: '',
    type: 'lock',
    isRunning: false,
    progress: 0,
    results: []
  });

  // Toast State
  const [activeToast, setActiveToast] = useState(null);

  // New Client Form State
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    mst: '',
    owner: '',
    phone: '',
    industry: 'F&B (Ăn uống, Giải khát)',
    address: 'Hà Nội',
    taxRegime: 'group2', // 'group1' | 'group2' | 'group3'
    taxRate: '4.5%',
    connectionMethod: 'vietqr',
    revenueTarget: 800000000
  });

  // CSV Fallback Parser State
  const [csvUploadData, setCsvUploadData] = useState(null);
  const [csvParsing, setCsvParsing] = useState(false);

  // Accountant Mock Portfolio: Representing clients of Huong and Tuan
  const [clients, setClients] = useState([
    {
      id: 'hkd-lan',
      name: 'Quán Phở Lan (Cô Phạm Thị Lan)',
      mst: '0108877662-001',
      owner: 'Cô Phạm Thị Lan (52 tuổi)',
      industry: 'F&B (Ăn uống, Giải khát)',
      address: '18 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
      taxRegime: 'group2',
      taxRate: '4.5%',
      revenue: 1500000000,
      totalBankInflow: 1750000000,
      excludedFlow: 250000000, // Tiền con gái gửi về từ nước ngoài không tính thuế
      estimatedTax: 67500000,
      status: 'current',
      statusNote: 'Đã bóc tách 250M tiền con gửi không tính thuế • Bắt buộc HĐĐT-MTT (NĐ 70)',
      connection: 'VietQR VCB (Real-time)',
      nd70Warning: true,
      lastSync: 'Hôm nay 08:30',
      assignedStaff: 'trang',
      assignedStaffName: 'Kế toán Trang',
      phone: '0903456789'
    },
    {
      id: 'hkd-01',
      name: 'Tiệm Cà Phê & Bánh Mộc',
      mst: '0109848191',
      owner: 'Nguyễn Văn An',
      industry: 'F&B (Ăn uống, Giải khát)',
      address: '28 Phố Huế, Q. Hoàn Kiếm, Hà Nội',
      taxRegime: 'group2',
      taxRate: '4.5%',
      revenue: 920000000,
      totalBankInflow: 1058000000,
      excludedFlow: 138000000,
      estimatedTax: 41400000,
      status: 'review', // 'current' | 'review' | 'deadline'
      statusNote: '2 giao dịch nội bộ lớn (> 10M) cần xác nhận',
      connection: 'VietQR MBBank (Real-time)',
      nd70Warning: true,
      lastSync: 'Hôm nay 09:45',
      assignedStaff: 'duc',
      assignedStaffName: 'Kế toán Đức',
      phone: '0988123456'
    },
    {
      id: 'hkd-02',
      name: 'Nhà Hàng Cơm Niêu Phố Cổ',
      mst: '0108742910',
      owner: 'Trần Thị Thu Trang',
      industry: 'F&B (Ăn uống, Giải khát)',
      address: '14 Đinh Tiên Hoàng, Hà Nội',
      taxRegime: 'group3',
      taxRate: 'Kê khai chi phí',
      revenue: 1450000000,
      totalBankInflow: 1620000000,
      excludedFlow: 170000000,
      estimatedTax: 58000000,
      status: 'current',
      statusNote: 'Sổ sách hiện hành, HĐĐT-MTT khớp 100%',
      connection: 'VietQR Vietcombank (Real-time)',
      nd70Warning: true,
      lastSync: 'Hôm nay 10:12'
    },
    {
      id: 'hkd-03',
      name: 'Cửa Hàng Thời Trang Linh Chi',
      mst: '0107293812',
      owner: 'Vũ Linh Chi',
      industry: 'Bán lẻ hàng hóa',
      address: '105 Chùa Bộc, Đống Đa, Hà Nội',
      taxRegime: 'group2',
      taxRate: '1.5%',
      revenue: 680000000,
      totalBankInflow: 740000000,
      excludedFlow: 60000000,
      estimatedTax: 10200000,
      status: 'current',
      statusNote: 'Sổ S2a-HKD đã cập nhật',
      connection: 'VietQR Techcombank (Real-time)',
      nd70Warning: false,
      lastSync: 'Hôm qua 18:30'
    },
    {
      id: 'hkd-04',
      name: 'Tạp Hóa Bách Hóa Xanh An Bình',
      mst: '0106192841',
      owner: 'Lê Hoàng Nam',
      industry: 'Bán lẻ hàng hóa',
      address: 'Số 42 Cầu Giấy, Hà Nội',
      taxRegime: 'group1',
      taxRate: 'Miễn thuế (< 500M)',
      revenue: 340000000,
      totalBankInflow: 380000000,
      excludedFlow: 40000000,
      estimatedTax: 0,
      status: 'current',
      statusNote: 'Sổ S1a-HKD hiện hành (Dưới ngưỡng)',
      connection: 'File Sao Kê CSV (VCB)',
      nd70Warning: false,
      lastSync: '04/09/2026'
    },
    {
      id: 'hkd-05',
      name: 'Gara Sửa Chữa Ô Tô Minh Phát',
      mst: '0105829103',
      owner: 'Nguyễn Minh Phát',
      industry: 'Dịch vụ, Sửa chữa',
      address: 'Km 10 Giải Phóng, Hoàng Mai, Hà Nội',
      taxRegime: 'group3',
      taxRate: 'Kê khai chi phí',
      revenue: 1850000000,
      totalBankInflow: 2100000000,
      excludedFlow: 250000000,
      estimatedTax: 74000000,
      status: 'deadline',
      statusNote: 'Hạn nộp tờ khai quý còn 7 ngày (Thiếu HĐ phụ tùng)',
      connection: 'VietQR BIDV (Real-time)',
      nd70Warning: false,
      lastSync: 'Hôm nay 08:20'
    },
    {
      id: 'hkd-06',
      name: 'Quán Lẩu Nướng BBQ 99',
      mst: '0109928174',
      owner: 'Phạm Đức Thành',
      industry: 'F&B (Ăn uống, Giải khát)',
      address: '88 Tô Hiệu, Cầu Giấy, Hà Nội',
      taxRegime: 'group2',
      taxRate: '4.5%',
      revenue: 990000000,
      totalBankInflow: 1120000000,
      excludedFlow: 130000000,
      estimatedTax: 44550000,
      status: 'review',
      statusNote: 'Sắp vượt ngưỡng 1 tỷ NĐ 70 (Đạt 99% mốc)',
      connection: 'VietQR VPBank (Real-time)',
      nd70Warning: true,
      lastSync: 'Hôm nay 10:05'
    },
    {
      id: 'hkd-07',
      name: 'Hiệu Thuốc Tây Thảo Mộc',
      mst: '0104928104',
      owner: 'Dược sĩ Đỗ Hải Yến',
      industry: 'Bán lẻ hàng hóa',
      address: '220 Bạch Mai, Hai Bà Trưng, Hà Nội',
      taxRegime: 'group2',
      taxRate: '1.5%',
      revenue: 520000000,
      totalBankInflow: 560000000,
      excludedFlow: 40000000,
      estimatedTax: 7800000,
      status: 'current',
      statusNote: 'Sổ S2a-HKD hoàn tất',
      connection: 'File Sao Kê CSV (MB)',
      nd70Warning: false,
      lastSync: '03/09/2026'
    },
    {
      id: 'hkd-08',
      name: 'Xưởng Gia Công Cơ Khí Đại Nghĩa',
      mst: '0103829105',
      owner: 'Trịnh Đại Nghĩa',
      industry: 'Sản xuất, Gia công',
      address: 'Cụm CN Lai Xá, Hoài Đức, Hà Nội',
      taxRegime: 'group3',
      taxRate: 'Kê khai chi phí',
      revenue: 3150000000,
      totalBankInflow: 3400000000,
      excludedFlow: 250000000,
      estimatedTax: 126000000,
      status: 'deadline',
      statusNote: 'Bắt buộc Bộ 4 Sổ (> 3 tỷ/năm) • Cần chốt vật tư',
      connection: 'VietQR MBBank (Real-time)',
      nd70Warning: false,
      lastSync: '05/09/2026'
    },
    {
      id: 'hkd-09',
      name: 'Spa & Chăm Sóc Sắc Đẹp Lan Vy',
      mst: '0107729106',
      owner: 'Bùi Lan Vy',
      industry: 'Dịch vụ, Sửa chữa',
      address: '76 Nguyễn Chí Thanh, Hà Nội',
      taxRegime: 'group2',
      taxRate: '7.0%',
      revenue: 490000000,
      totalBankInflow: 530000000,
      excludedFlow: 40000000,
      estimatedTax: 34300000,
      status: 'current',
      statusNote: 'Sổ S2a dịch vụ 7% hiện hành',
      connection: 'VietQR ACB (Real-time)',
      nd70Warning: false,
      lastSync: 'Hôm nay 07:15'
    },
    {
      id: 'hkd-10',
      name: 'Chuỗi Trà Sữa Boba King #03',
      mst: '0108928107',
      owner: 'Vũ Quốc Toàn',
      industry: 'F&B (Ăn uống, Giải khát)',
      address: '15 Đại Cồ Việt, Hà Nội',
      taxRegime: 'group2',
      taxRate: '4.5%',
      revenue: 890000000,
      totalBankInflow: 980000000,
      excludedFlow: 90000000,
      estimatedTax: 40050000,
      status: 'review',
      statusNote: 'Cần cài đặt HĐĐT-MTT chuẩn bị chạm 1 tỷ NĐ 70',
      connection: 'VietQR MBBank (Real-time)',
      nd70Warning: true,
      lastSync: 'Hôm nay 09:10'
    }
  ]);

  // Toast Helper
  const showToast = (title, sub) => {
    setActiveToast({ title, sub });
    setTimeout(() => setActiveToast(null), 4500);
  };

  // Portfolio KPIs
  const portfolioStats = useMemo(() => {
    const total = clients.length;
    const current = clients.filter((c) => c.status === 'current').length;
    const review = clients.filter((c) => c.status === 'review').length;
    const deadline = clients.filter((c) => c.status === 'deadline').length;
    const nd70Count = clients.filter((c) => c.nd70Warning).length;
    const totalRev = clients.reduce((sum, c) => sum + c.revenue, 0);
    const totalTax = clients.reduce((sum, c) => sum + c.estimatedTax, 0);
    return { total, current, review, deadline, nd70Count, totalRev, totalTax };
  }, [clients]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchQuery = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mst.includes(searchQuery) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegime = regimeFilter === 'all' || c.taxRegime === regimeFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchIndustry = 
        industryFilter === 'all' ||
        (industryFilter === 'fnb' && c.industry.includes('F&B')) ||
        (industryFilter === 'retail' && c.industry.includes('Bán lẻ')) ||
        (industryFilter === 'service' && (c.industry.includes('Dịch vụ') || c.industry.includes('Sản xuất')));

      const matchStaff = staffFilter === 'all' || c.assignedStaff === staffFilter;

      return matchQuery && matchRegime && matchStatus && matchIndustry && matchStaff;
    });
  }, [clients, searchQuery, regimeFilter, statusFilter, industryFilter, staffFilter]);

  // Toggle single client selection
  const toggleSelectClient = (id) => {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle select all filtered clients
  const toggleSelectAll = () => {
    if (selectedClientIds.size === filteredClients.length && filteredClients.length > 0) {
      setSelectedClientIds(new Set());
    } else {
      setSelectedClientIds(new Set(filteredClients.map((c) => c.id)));
    }
  };

  // Atomic Partial-Failure Bulk Operations Runner (Resolves Blocker 8)
  const runBulkOperation = (type, title) => {
    const selectedList = clients.filter((c) => selectedClientIds.has(c.id));
    if (selectedList.length === 0) return;

    // Enforce RBAC permission for period lock:
    if (type === 'lock' && currentRole === 'junior_accountant') {
      showToast(
        'Từ chối truy cập: Quyền hạn không đủ',
        'Tác vụ khóa sổ kỳ kế toán yêu cầu quyền Kế toán trưởng (Firm Owner) hoặc Kế toán chính (Senior).'
      );
      return;
    }

    setBulkExecutionModal({
      isOpen: true,
      title,
      type,
      isRunning: true,
      progress: 25,
      results: []
    });

    setTimeout(() => {
      let failureCount = 0;
      const results = selectedList.map((c, idx) => {
        // In demo, simulate 1 item failure if more than 2 items selected and client has review status or is last item
        if (failureCount === 0 && selectedList.length > 2 && (c.status === 'review' || idx === selectedList.length - 1)) {
          failureCount++;
          return {
            id: c.id,
            name: c.name,
            mst: c.mst,
            status: 'failed',
            error: type === 'lock' 
              ? 'Tồn tại giao dịch loại trừ lớn chưa đính kèm chứng từ (RULE-EX-01). Cần xác nhận trước khi khóa sổ.' 
              : type === 'sync' 
                ? 'Chứng thư số CQT của hộ kinh doanh chưa được liên kết hoặc hết hạn.' 
                : 'Thiếu thông tin người đại diện theo pháp luật trong hồ sơ đăng ký.'
          };
        }
        return {
          id: c.id,
          name: c.name,
          mst: c.mst,
          status: 'success',
          msg: type === 'lock' 
            ? 'Đã khóa sổ Quý 1/2026 thành công' 
            : type === 'sync' 
              ? 'Khớp 100% hóa đơn máy tính tiền CQT' 
              : 'Đã đóng gói Mẫu S1a/S2a Excel chuẩn Bộ Tài Chính'
        };
      });

      if (type === 'lock') {
        const successIds = new Set(results.filter((r) => r.status === 'success').map((r) => r.id));
        setClients((prev) => prev.map((c) => successIds.has(c.id) ? { ...c, status: 'current', statusNote: 'Đã khóa sổ Quý 1/2026' } : c));
      }

      setBulkExecutionModal({
        isOpen: true,
        title,
        type,
        isRunning: false,
        progress: 100,
        results
      });
    }, 850);
  };

  const handleRetryFailedBulk = () => {
    setBulkExecutionModal((prev) => ({
      ...prev,
      isRunning: true,
      progress: 50
    }));

    setTimeout(() => {
      setBulkExecutionModal((prev) => ({
        ...prev,
        isRunning: false,
        progress: 100,
        results: prev.results.map((r) => ({
          ...r,
          status: 'success',
          msg: 'Đã xử lý & đối soát thành công trong lần thử lại',
          error: undefined
        }))
      }));
      showToast('Đã thử lại thành công!', 'Tất cả các hộ kinh doanh bị lỗi đã được xử lý hoàn tất.');
    }, 750);
  };

  // Bulk Action 1: Export XML / Excel (Prioritizes official MOF TT152 Excel, labels XML as CQT beta)
  const handleBulkExport = () => {
    runBulkOperation('export', `Xuất Bộ Sổ Thông Tư 152 Cho ${selectedClientIds.size} Hộ Kinh Doanh`);
  };

  // Bulk Action 2: Lock Accounting Period
  const handleBulkLockPeriod = () => {
    runBulkOperation('lock', `Khóa Sổ Kế Toán Quý 1/2026 Cho ${selectedClientIds.size} Hộ Kinh Doanh`);
  };

  // Bulk Action 3: Sync Decree 70/123 Invoices
  const handleBulkSyncInvoices = () => {
    runBulkOperation('sync', `Đồng Bộ Hóa Đơn Cổng Thuế Cho ${selectedClientIds.size} Hộ Kinh Doanh`);
  };

  // Drilldown to Client Ledger (RESTful URL - Resolves Blocker 4)
  const handleOpenClientLedger = (client) => {
    navigate(`/cpa/clients/${client.id}/ledger?regime=${client.taxRegime}&name=${encodeURIComponent(client.name)}`);
  };

  // MISA / Excel Data Migration Handler (Resolves Blocker 6)
  const handleMigrationSuccess = (newRecords) => {
    const formatted = newRecords.map((r, i) => ({
      id: `migrated-${Date.now()}-${i}`,
      name: r.name,
      mst: r.mst,
      owner: 'Chủ hộ (Di cư từ MISA)',
      industry: r.industry === 'fnb' ? 'F&B (Ăn uống, Giải khát)' : r.industry === 'retail' ? 'Bán lẻ hàng hóa' : 'Dịch vụ',
      address: 'Hà Nội',
      taxRegime: r.regime,
      taxRate: r.regime === 'group1' ? 'Miễn thuế (< 500M)' : r.regime === 'group2' ? '1.5% - 4.5%' : 'Kê khai chi phí',
      revenue: r.rev,
      totalBankInflow: Math.round(r.rev * 1.1),
      excludedFlow: Math.round(r.rev * 0.1),
      estimatedTax: Math.round(r.rev * 0.015),
      status: 'current',
      statusNote: 'Di cư thành công từ MISA - Sổ sách hợp lệ',
      connection: 'MISA Import File',
      nd70Warning: r.rev >= 1000000000,
      lastSync: 'Vừa xong'
    }));
    setClients((prev) => [...formatted, ...prev]);
    showToast(
      `Đã nạp thành công ${newRecords.length} hộ kinh doanh từ MISA vào danh mục!`,
      'Dữ liệu mã số thuế, doanh thu và chế độ sổ sách TT152 đã được ánh xạ tự động.'
    );
  };

  // Create New Client Submit
  const handleCreateClientSubmit = (e) => {
    e.preventDefault();
    if (!newClientForm.name || !newClientForm.mst) return;

    const newId = `hkd-${Date.now().toString().slice(-4)}`;
    const newEntry = {
      id: newId,
      name: newClientForm.name,
      mst: newClientForm.mst,
      owner: newClientForm.owner || 'Chủ hộ kinh doanh',
      industry: newClientForm.industry,
      address: newClientForm.address,
      taxRegime: newClientForm.taxRegime,
      taxRate: newClientForm.taxRate,
      revenue: 0,
      totalBankInflow: 0,
      excludedFlow: 0,
      estimatedTax: 0,
      status: 'current',
      statusNote: `Đã khởi tạo sổ ${newClientForm.taxRegime === 'group1' ? 'S1a' : newClientForm.taxRegime === 'group2' ? 'S2a' : 'Bộ 4 Sổ'} (TT 152)`,
      connection: newClientForm.connectionMethod === 'vietqr' ? 'VietQR Real-time' : 'File Sao Kê CSV',
      nd70Warning: newClientForm.industry.includes('F&B') && newClientForm.revenueTarget >= 1000000000,
      lastSync: 'Vừa xong'
    };

    setClients((prev) => [newEntry, ...prev]);
    setShowNewClientModal(false);
    showToast(
      `Tiếp nhận thành công khách hàng: ${newClientForm.name}`,
      `Đã phân loại phương pháp thuế ${newClientForm.taxRegime === 'group1' ? 'Nhóm 1' : newClientForm.taxRegime === 'group2' ? 'Nhóm 2' : 'Nhóm 3'} chuẩn Thông tư 152.`
    );
  };

  // Sample CSV Bank Statement Import Handler
  const handleLoadSampleCsv = () => {
    setCsvParsing(true);
    setTimeout(() => {
      const sampleTxs = [
        { date: '05/09/2026', no: 'MB-99411', desc: 'Chuyen khoan ban le cafe ban 12', amount: 450000, isTax: true, rule: 'RULE-REV-01' },
        { date: '05/09/2026', no: 'MB-99412', desc: 'Khach tra tien banh ngot sinh nhat', amount: 650000, isTax: true, rule: 'RULE-REV-01' },
        { date: '04/09/2026', no: 'MB-99413', desc: 'Chuyen khoan noi bo nop tien quy tien mat', amount: 20000000, isTax: false, rule: 'RULE-EX-01 (Miễn thuế Điều 4)' },
        { date: '04/09/2026', no: 'MB-99414', desc: 'Thanh toan do uong mang ve Grab', amount: 320000, isTax: true, rule: 'RULE-REV-01' },
        { date: '03/09/2026', no: 'MB-99415', desc: 'Hoan tien khach huy don ban 3', amount: 150000, isTax: false, rule: 'RULE-EX-01' },
        { date: '03/09/2026', no: 'MB-99416', desc: 'Khach quet ma VietQR cafe sua da', amount: 180000, isTax: true, rule: 'RULE-REV-01' }
      ];

      setCsvUploadData({
        bank: 'MBBank (Ngân Hàng Quân Đội)',
        accountNo: '0353600900',
        totalRows: 6,
        taxableCount: 4,
        excludedCount: 2,
        totalAmount: 21750000,
        taxableAmount: 1600000,
        excludedAmount: 20150000,
        transactions: sampleTxs
      });
      setCsvParsing(false);
    }, 800);
  };

  // Commit CSV to Client Ledger
  const handleCommitCsvToClient = () => {
    if (!selectedImportClient || !csvUploadData) return;

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === selectedImportClient.id) {
          const newRev = c.revenue + csvUploadData.taxableAmount;
          return {
            ...c,
            revenue: newRev,
            totalBankInflow: c.totalBankInflow + csvUploadData.totalAmount,
            excludedFlow: c.excludedFlow + csvUploadData.excludedAmount,
            estimatedTax: Math.round(newRev * (parseFloat(c.taxRate) / 100 || 0.015)),
            lastSync: 'Vừa nhập file sao kê',
            status: 'current',
            statusNote: `Đã nạp ${csvUploadData.totalRows} giao dịch từ sao kê ${csvUploadData.bank}`
          };
        }
        return c;
      })
    );

    setShowCsvImportModal(false);
    setCsvUploadData(null);
    showToast(
      `Đã nạp thành công sao kê vào sổ khách hàng: ${selectedImportClient.name}`,
      `Tự động phân loại ${csvUploadData.taxableCount} giao dịch doanh thu & ${csvUploadData.excludedCount} giao dịch nội bộ miễn thuế.`
    );
  };

  // Format currency helper
  const fmt = (num) => new Intl.NumberFormat('vi-VN').format(num) + 'đ';

  return (
    <div className="accountant-workspace-page">
      
      {/* Real-time Toast Notification */}
      {activeToast && (
        <div className="trial-realtime-toast">
          <span className="toast-beacon"></span>
          <div className="toast-text">
            <strong className="toast-title">{activeToast.title}</strong>
            <span className="toast-sub">{activeToast.sub}</span>
          </div>
        </div>
      )}

      {/* 3 CORE PERSONAS EXPERIENCE SWITCHER (Resolves User Persona Alignment) */}
      <div className="persona-selector-bar glass-panel" style={{
        margin: '0 0 16px',
        padding: '12px 18px',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(0, 245, 212, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UsersIcon size={16} color="#00f5d4" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Trải Nghiệm Theo Chân Dung Khách Hàng (Persona View):
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Persona 1: Chị Hương (High-Volume Wedge, 30-40k bookkeepers) */}
          <button
            type="button"
            onClick={() => {
              setPersonaMode('huong');
              setCurrentPlan('starter');
              setCurrentRole('firm_owner');
              setStaffFilter('all');
              showToast('Đã chuyển sang góc nhìn Chị Hương!', 'Kế toán tự do (22 hộ) • Giao diện tinh gọn, tự động hóa VietQR, không làm thêm cuối tuần.');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: personaMode === 'huong' ? '#00f5d4' : 'rgba(255, 255, 255, 0.05)',
              color: personaMode === 'huong' ? '#05101a' : '#cbd5e1',
              border: personaMode === 'huong' ? '1px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Chị Hương (Kế toán tự do • 22 hộ)</span>
            <span style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '10px',
              background: personaMode === 'huong' ? 'rgba(5, 16, 26, 0.2)' : 'rgba(0, 245, 212, 0.15)',
              color: personaMode === 'huong' ? '#05101a' : '#00f5d4'
            }}>
              490k/tháng
            </span>
          </button>

          {/* Persona 2: Anh Tuấn (High-Revenue Studio, 3-5k firms) */}
          <button
            type="button"
            onClick={() => {
              setPersonaMode('tuan');
              setCurrentPlan('pro_studio');
              setCurrentRole('firm_owner');
              showToast('Đã chuyển sang góc nhìn Anh Tuấn!', 'Chủ đại lý thuế An Bình (90 hộ, 5 nhân sự) • Dashboard tập trung, kiểm soát Junior QC, tiết kiệm 40% phí MISA.');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: personaMode === 'tuan' ? '#00f5d4' : 'rgba(255, 255, 255, 0.05)',
              color: personaMode === 'tuan' ? '#05101a' : '#cbd5e1',
              border: personaMode === 'tuan' ? '1px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Anh Tuấn (Chủ đại lý thuế • 90 hộ)</span>
            <span style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '10px',
              background: personaMode === 'tuan' ? 'rgba(5, 16, 26, 0.2)' : 'rgba(56, 189, 248, 0.15)',
              color: personaMode === 'tuan' ? '#05101a' : '#38bdf8'
            }}>
              1.490k/tháng
            </span>
          </button>

          {/* Persona 3: Cô Lan (End-Client Retention Lever) */}
          <button
            type="button"
            onClick={() => {
              const lanClient = clients.find(c => c.id === 'hkd-lan') || clients[0];
              setPreviewPortalClient(lanClient);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <EyeIcon size={13} color="#fbbf24" />
            <span>Cô Lan (Chủ Hộ Phở Lan • 1.5 tỷ/năm)</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Dynamically tailored to Huong vs Tuan */}
      <div className="cpa-header-bar glass-panel">
        <div className="cpa-header-left">
          <div className="cpa-firm-icon">
            <BuildingIcon size={24} color={personaMode === 'huong' ? '#00f5d4' : '#FFA100'} />
          </div>
          <div>
            <div className="cpa-title-row">
              <h1 className="cpa-firm-title">
                {personaMode === 'huong' 
                  ? 'Góc Làm Việc Kế Toán Tự Do • Chị Nguyễn Thị Hương' 
                  : 'Văn Phòng Dịch Vụ Kế Toán & Đại Lý Thuế An Bình • Anh Trần Văn Tuấn'}
              </h1>
              <span className="cpa-pro-chip" style={{
                background: personaMode === 'huong' ? 'rgba(0, 245, 212, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                color: personaMode === 'huong' ? '#00f5d4' : '#38bdf8'
              }}>
                {personaMode === 'huong' ? 'GÓI KHỞI NGHIỆP • 490.000Đ/THÁNG' : 'GÓI PRO STUDIO • 1.490.000Đ/THÁNG'}
              </span>
            </div>
            <p className="cpa-firm-sub">
              {personaMode === 'huong' ? (
                <span>
                  Quản lý <strong>22 Hộ Kinh Doanh</strong> (Bình Thạnh, TP.HCM) • Tự động hóa thu chi VietQR • <strong>Không bao giờ làm bù cuối tuần</strong>.
                </span>
              ) : (
                <span>
                  Bảng điều khiển tập trung <strong>90 Hộ Kinh Doanh</strong> (Cầu Giấy, Hà Nội) • Giám sát 3 Kế toán viên trẻ (Đức, Trang, Linh) • <strong>Tiết kiệm 40% chi phí MISA</strong>.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="cpa-header-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <button 
            type="button" 
            className="cpa-btn-action"
            onClick={() => setShowMigrationModal(true)}
            style={{
              background: 'rgba(0, 245, 212, 0.12)',
              border: '1px solid rgba(0, 245, 212, 0.35)',
              color: '#00f5d4',
              fontWeight: 700
            }}
          >
            <UploadCloudIcon size={14} color="currentColor" />
            <span>{personaMode === 'huong' ? 'Nhập Nhanh MISA / Excel' : 'Di Cư MISA / Excel (30 Phút)'}</span>
          </button>

          {personaMode === 'tuan' && (
            <button 
              type="button" 
              className="cpa-btn-action"
              onClick={() => setShowAuditModal(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1'
              }}
            >
              <ShieldIcon size={14} color="currentColor" />
              <span>Nhật Ký Kiểm Toán (Audit Trail)</span>
            </button>
          )}

          <button 
            type="button" 
            className="cpa-btn-action"
            onClick={() => setShowBillingModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1'
            }}
          >
            <SparklesIcon size={14} color="#00f5d4" />
            <span>{personaMode === 'huong' ? 'Gói Khởi Nghiệp (490k)' : 'Gói Pro Studio (1.490k)'}</span>
          </button>

          {personaMode === 'tuan' && (
            <button 
              type="button" 
              className="cpa-btn-action"
              onClick={() => setShowAuthModal(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1'
              }}
            >
              <LockIcon size={14} color="#38bdf8" />
              <span>
                Quyền: {currentRole === 'firm_owner' ? 'Chủ Đại Lý (Owner)' : currentRole === 'senior_accountant' ? 'Kế Toán Chính (Senior)' : 'Trợ Lý (Junior)'}
              </span>
            </button>
          )}

          <button 
            type="button" 
            className="cpa-btn-action cpa-btn-csv"
            onClick={() => {
              setSelectedImportClient(clients[0]);
              setShowCsvImportModal(true);
            }}
          >
            <UploadCloudIcon size={14} color="currentColor" />
            <span>Nhập File Sao Kê CSV</span>
          </button>

          <button 
            type="button" 
            className="cpa-btn-action cpa-btn-add"
            onClick={() => setShowNewClientModal(true)}
          >
            <PlusIcon size={14} color="currentColor" />
            <span>+ Tiếp Nhận HKD Mới</span>
          </button>
        </div>
      </div>

      {/* Persona-Specific Focus Widget (Tailored for Huong vs Tuan) */}
      {personaMode === 'huong' ? (
        <div className="huong-focus-banner" style={{
          margin: '0 0 20px',
          padding: '16px 20px',
          background: 'rgba(0, 245, 212, 0.04)',
          border: '1px solid rgba(0, 245, 212, 0.3)',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarIcon size={24} color="#00f5d4" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                Hạn Nộp Tờ Khai Quý 1/2026: Còn 54 Ngày (Đã hoàn tất 18/22 hộ)
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
                Tự động đối soát VietQR hàng ngày giúp chị Hương không bị dồn việc cuối tuần và tự tin báo cáo cho chủ hộ.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '16px' }}>
            <ShieldIcon size={24} color="#fbbf24" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>
                Trợ Lý Phân Nhóm Thông Tư 152
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
                Dưới 500M -&gt; Mẫu S1a (Miễn thuế) • Trên 500M -&gt; Mẫu S2a (Thuế % doanh thu). Không lo nhầm lẫn khi khách tăng doanh thu.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="tuan-focus-banner" style={{
          margin: '0 0 20px',
          padding: '16px 20px',
          background: 'rgba(56, 189, 248, 0.04)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UsersIcon size={20} color="#38bdf8" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                Kiểm Soát Chất Lượng Kế Toán Viên Trẻ (Junior QC - 3 Nhân Sự Phụ Trách 90 Hộ):
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#00f5d4', fontWeight: 700 }}>
              Tiết kiệm 40% chi phí bản quyền so với MISA (Chỉ 1.490.000đ/tháng)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Tất Cả 90 Hộ Kinh Doanh', count: 90 },
              { id: 'trang', label: 'Kế toán Trang (28 hộ)', count: 28 },
              { id: 'duc', label: 'Kế toán Đức (32 hộ)', count: 32 },
              { id: 'linh', label: 'Kế toán Linh (30 hộ)', count: 30 }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStaffFilter(s.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: staffFilter === s.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.04)',
                  color: staffFilter === s.id ? '#05101a' : '#cbd5e1',
                  border: staffFilter === s.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                  fontWeight: staffFilter === s.id ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scope Disclaimer & Strategic Positioning Banner (Resolves Blockers 10-12) */}
      <div className="cpa-scope-banner glass-panel" style={{
        margin: '0 0 20px',
        padding: '12px 20px',
        background: 'rgba(0, 245, 212, 0.03)',
        border: '1px solid rgba(0, 245, 212, 0.2)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldIcon size={20} color="#00f5d4" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
              Định Vị Chuyên Biệt: Hộ Kê Khai Đơn Giản (Nhóm 1 &amp; Nhóm 2 - TT 152/2025) và Cổng Đối Soát HĐĐT Máy Tính Tiền (NĐ 70/2025)
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Tập trung giải quyết 85% - 90% thị trường tính thuế theo tỷ lệ % doanh thu (Mẫu S1a &amp; S2a-HKD). Đối với Hộ Nhóm 3 (Chi phí &amp; Kho), A-Sổ hỗ trợ ghi nhận doanh thu VietQR và kết nối xuất dữ liệu sang đối tác ERP/kế toán.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            background: 'rgba(0, 245, 212, 0.12)',
            color: '#00f5d4',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(0, 245, 212, 0.3)'
          }}>
            Chuẩn TT152 / NĐ70
          </span>
        </div>
      </div>

      {/* Portfolio Status Matrix Bar (Traffic Lights) */}
      <div className="cpa-stats-grid">
        <div className="cpa-stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Tổng Hộ Kinh Doanh</span>
            <UsersIcon size={16} color="#38bdf8" />
          </div>
          <div className="stat-number">{portfolioStats.total}</div>
          <span className="stat-sub">Đang vận hành trên hệ thống</span>
        </div>

        <div className="cpa-stat-card glass-panel stat-green">
          <div className="stat-card-header">
            <span className="stat-label">Sổ Sách Hiện Hành (Đèn Xanh)</span>
            <span className="status-dot dot-green"></span>
          </div>
          <div className="stat-number text-green">{portfolioStats.current}</div>
          <span className="stat-sub">Khớp 100% CQT &amp; Ngân hàng</span>
        </div>

        <div className="cpa-stat-card glass-panel stat-yellow">
          <div className="stat-card-header">
            <span className="stat-label">Cần Rà Soát (Đèn Vàng)</span>
            <span className="status-dot dot-yellow"></span>
          </div>
          <div className="stat-number text-yellow">{portfolioStats.review}</div>
          <span className="stat-sub">Chênh lệch dòng tiền / Giao dịch &gt; 10M</span>
        </div>

        <div className="cpa-stat-card glass-panel stat-red">
          <div className="stat-card-header">
            <span className="stat-label">Sắp Quá Hạn Kê Khai (Đèn Đỏ)</span>
            <span className="status-dot dot-red"></span>
          </div>
          <div className="stat-number text-red">{portfolioStats.deadline}</div>
          <span className="stat-sub">Hạn nộp quý trong 7-15 ngày</span>
        </div>

        <div className="cpa-stat-card glass-panel stat-cyan">
          <div className="stat-card-header">
            <span className="stat-label">Cảnh Báo 1 Tỷ (Nghị Định 70)</span>
            <ShieldIcon size={16} color="#00f5d4" />
          </div>
          <div className="stat-number text-cyan">{portfolioStats.nd70Count} HKD</div>
          <span className="stat-sub">Bắt buộc chuyển đổi HĐĐT-MTT</span>
        </div>
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="cpa-main-tabs glass-panel">
        <div className="cpa-tab-buttons">
          <button 
            type="button" 
            className={`cpa-tab-nav-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <LayersIcon size={15} color="currentColor" />
            <span>Danh Mục Hộ Kinh Doanh ({clients.length})</span>
          </button>
          <button 
            type="button" 
            className={`cpa-tab-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarIcon size={15} color="currentColor" />
            <span>Lịch Tuân Thủ &amp; Hạn Kê Khai Thuế</span>
          </button>
          <button 
            type="button" 
            className={`cpa-tab-nav-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => {
              setSelectedImportClient(clients[0]);
              setShowCsvImportModal(true);
            }}
          >
            <UploadCloudIcon size={15} color="currentColor" />
            <span>Nhập File Sao Kê Ngân Hàng Hàng Loạt</span>
          </button>
        </div>

        {/* Global Summary Badge */}
        <div className="cpa-global-summary">
          <span>Tổng Doanh Thu Danh Mục 2026: <strong>{fmt(portfolioStats.totalRev)}</strong></span>
          <span className="summary-divider">•</span>
          <span>Thuế Dự Kiến Phải Nộp: <strong>{fmt(portfolioStats.totalTax)}</strong></span>
        </div>
      </div>

      {/* TAB 1: CLIENT PORTFOLIO MATRIX */}
      {activeTab === 'portfolio' && (
        <div className="cpa-table-container glass-panel">
          
          {/* Controls Bar: Search & Filters */}
          <div className="cpa-table-controls">
            <div className="cpa-search-box">
              <SearchIcon size={15} color="#888" />
              <input 
                type="text" 
                placeholder="Tìm theo tên HKD, mã số thuế hoặc tên chủ quán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="cpa-filters-group">
              {/* Regime Filter */}
              <div className="cpa-filter-item">
                <span className="filter-label">Nhóm TT152:</span>
                <select value={regimeFilter} onChange={(e) => setRegimeFilter(e.target.value)}>
                  <option value="all">Tất cả phương pháp</option>
                  <option value="group1">Nhóm 1 (&lt; 500M - S1a)</option>
                  <option value="group2">Nhóm 2 (Thuế % - S2a)</option>
                  <option value="group3">Nhóm 3 (Thu nhập - Bộ 4 Sổ)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="cpa-filter-item">
                <span className="filter-label">Trạng thái:</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="current">Đèn xanh (Hiện hành)</option>
                  <option value="review">Đèn vàng (Cần rà soát)</option>
                  <option value="deadline">Đèn đỏ (Sắp đến hạn)</option>
                </select>
              </div>

              {/* Industry Filter */}
              <div className="cpa-filter-item">
                <span className="filter-label">Ngành nghề:</span>
                <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                  <option value="all">Tất cả ngành nghề</option>
                  <option value="fnb">F&amp;B Ăn uống</option>
                  <option value="retail">Bán lẻ hàng hóa</option>
                  <option value="service">Dịch vụ &amp; Sản xuất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sticky Bulk Action Bar */}
          {selectedClientIds.size > 0 && (
            <div className="cpa-bulk-action-bar">
              <div className="bulk-selection-count">
                <CheckCircleIcon size={16} color="#00f5d4" />
                <span>Đã chọn <strong>{selectedClientIds.size}</strong> hộ kinh doanh</span>
              </div>

              <div className="bulk-buttons-row">
                <button type="button" className="bulk-btn bulk-btn-export" onClick={handleBulkExport}>
                  <DownloadCloudIcon size={14} color="currentColor" />
                  <span>Xuất Hàng Loạt XML / Excel (TT 152)</span>
                </button>
                <button type="button" className="bulk-btn bulk-btn-lock" onClick={handleBulkLockPeriod}>
                  <LockIcon size={14} color="currentColor" />
                  <span>Khóa Sổ Kỳ Tháng 02/2026</span>
                </button>
                <button type="button" className="bulk-btn bulk-btn-sync" onClick={handleBulkSyncInvoices}>
                  <RefreshCwIcon size={14} color="currentColor" />
                  <span>Đồng Bộ HĐĐT Cổng Thuế (NĐ 70 &amp; 123)</span>
                </button>
                <button type="button" className="bulk-btn-clear" onClick={() => setSelectedClientIds(new Set())}>
                  Bỏ chọn
                </button>
              </div>
            </div>
          )}

          {/* Client Table Matrix */}
          <div className="cpa-matrix-table-wrap">
            <table className="cpa-matrix-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedClientIds.size === filteredClients.length && filteredClients.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Hộ Kinh Doanh &amp; MST</th>
                  <th>Ngành Nghề</th>
                  <th>Nhóm Thuế TT152</th>
                  <th>Doanh Thu 2026 &amp; Ngưỡng 1 Tỷ (NĐ 70)</th>
                  <th>Trạng Thái Sổ Sách</th>
                  <th>Kênh Nạp Dữ Liệu</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác Kế Toán</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const isSelected = selectedClientIds.has(client.id);
                  const nd70Percent = Math.min(100, Math.round((client.revenue / 1000000000) * 100));

                  return (
                    <tr key={client.id} className={isSelected ? 'row-selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectClient(client.id)}
                        />
                      </td>

                      {/* Name & MST */}
                      <td className="client-name-cell">
                        <div className="client-display-name">{client.name}</div>
                        <div className="client-mst-line">
                          <span>MST: <strong>{client.mst}</strong></span>
                          <span>•</span>
                          <span>{client.owner}</span>
                        </div>
                      </td>

                      {/* Industry */}
                      <td>
                        <span className="industry-badge">{client.industry}</span>
                      </td>

                      {/* TT152 Regime */}
                      <td>
                        <span className={`tt152-group-chip chip-${client.taxRegime}`}>
                          {client.taxRegime === 'group1' && 'Nhóm 1 (S1a-HKD)'}
                          {client.taxRegime === 'group2' && 'Nhóm 2 (S2a-HKD)'}
                          {client.taxRegime === 'group3' && 'Nhóm 3 (Bộ 4 Sổ S2b-S2e)'}
                        </span>
                        <div className="tax-rate-sub">Tỷ lệ: {client.taxRate}</div>
                      </td>

                      {/* Revenue & ND70 Progress */}
                      <td className="revenue-progress-cell">
                        <div className="rev-number">{fmt(client.revenue)}</div>
                        <div className="nd70-mini-bar-wrap">
                          <div className="nd70-mini-bar-outer">
                            <div 
                              className={`nd70-mini-bar-inner ${client.revenue >= 1000000000 ? 'bar-danger' : client.revenue >= 850000000 ? 'bar-warning' : 'bar-normal'}`}
                              style={{ width: `${nd70Percent}%` }}
                            ></div>
                          </div>
                          <span className="nd70-mini-label">
                            {client.revenue >= 1000000000 
                              ? 'Vượt ngưỡng 1 tỷ (HĐĐT-MTT)' 
                              : `${nd70Percent}% mốc 1 tỷ`}
                          </span>
                        </div>
                      </td>

                      {/* Health Status (Traffic Light) */}
                      <td>
                        <div className="status-cell-wrap">
                          <span className={`status-indicator indicator-${client.status}`}>
                            {client.status === 'current' && 'Hiện hành'}
                            {client.status === 'review' && 'Cần rà soát'}
                            {client.status === 'deadline' && 'Sắp quá hạn'}
                          </span>
                          <span className="status-detail-hint">{client.statusNote}</span>
                        </div>
                      </td>

                      {/* Ingestion Connection */}
                      <td>
                        <span className="connection-pill">
                          {client.connection.includes('VietQR') ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <QrCodeIcon size={12} color="#00f5d4" />
                              <span>{client.connection}</span>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <FileTextIcon size={12} color="#FFA100" />
                              <span>{client.connection}</span>
                            </span>
                          )}
                        </span>
                        <div className="sync-time-sub">Đồng bộ: {client.lastSync}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons-group">
                          <button 
                            type="button" 
                            className="btn-action-portal"
                            onClick={() => setPreviewPortalClient(client)}
                            title="Xem thử Cổng Khách Hàng (Read-Only) của chủ cơ sở này"
                          >
                            <EyeIcon size={13} color="currentColor" />
                            <span>Cổng Khách</span>
                          </button>
                          <button 
                            type="button" 
                            className="btn-action-drilldown"
                            onClick={() => handleOpenClientLedger(client)}
                            title="Mở giao diện A-Sổ để đối soát dòng tiền và chỉnh sửa hạch toán"
                          >
                            <span>Vào Làm Sổ</span>
                            <ArrowRightIcon size={12} color="currentColor" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLIANCE CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="cpa-calendar-view glass-panel">
          <div className="calendar-header-row">
            <div>
              <h3>Lịch Tuân Thủ Thuế &amp; Cảnh Báo Quy Định (Quý 1/2026)</h3>
              <p>Tự động theo dõi các mốc thời gian kê khai, hạn nộp tờ khai và ngưỡng doanh thu theo Thông tư 152 &amp; Nghị định 70.</p>
            </div>
            <div className="cal-stat-badge">
              <span>Hạn Nộp Tờ Khai Q1/2026: <strong>30/04/2026 (Còn 54 ngày)</strong></span>
            </div>
          </div>

          <div className="compliance-cards-grid">
            <div className="comp-alert-card card-nd70">
              <div className="alert-card-header">
                <AlertTriangleIcon size={20} color="#00f5d4" />
                <h4>Cảnh Báo Chạm Ngưỡng 1 Tỷ (Nghị Định 70/2025/NĐ-CP)</h4>
              </div>
              <p className="alert-card-desc">
                Phát hiện <strong>3 cơ sở kinh doanh F&amp;B</strong> có doanh thu tiệm cận hoặc vượt mức 1 tỷ đồng/năm. Kế toán cần hoàn tất đăng ký phát hành Hóa đơn điện tử máy tính tiền (HĐĐT-MTT) trước kỳ thanh tra:
              </p>
              <ul className="alert-client-list">
                <li>• <strong>Nhà Hàng Cơm Niêu Phố Cổ:</strong> 1.450.000.000đ (Đã vượt ngưỡng 145%) - Đã kết nối HĐĐT CQT.</li>
                <li>• <strong>Quán Lẩu Nướng BBQ 99:</strong> 990.000.000đ (Đạt 99% mốc) - Cần liên hệ chủ quán ký hợp đồng HĐĐT-MTT.</li>
                <li>• <strong>Tiệm Cà Phê &amp; Bánh Mộc:</strong> 920.000.000đ (Đạt 92% mốc) - Dự kiến chạm mốc trong 15 ngày tới.</li>
              </ul>
            </div>

            <div className="comp-alert-card card-filing">
              <div className="alert-card-header">
                <CalendarIcon size={20} color="#FFA100" />
                <h4>Hạn Chót Kê Khai Thuế Quý 1/2026</h4>
              </div>
              <p className="alert-card-desc">
                Thời hạn nộp Bảng kê doanh thu S2a-HKD và Tờ khai thuế 01/CNKD theo Thông tư 152:
              </p>
              <ul className="alert-client-list">
                <li>• <strong>24 Hộ Kê Khai Nhóm 2:</strong> Cần chốt doanh thu bán lẻ trước ngày 20/04/2026 để khách nộp thuế đúng hạn.</li>
                <li>• <strong>8 Hộ Nhóm 3 (Kê khai chi phí):</strong> Cần thu thập đầy đủ hóa đơn đầu vào để khấu trừ thuế TNCN.</li>
                <li>• <strong>2 Hộ Chậm Tiến Độ:</strong> Gara Ô Tô Minh Phát &amp; Xưởng Cơ Khí Đại Nghĩa đang thiếu chứng từ.</li>
              </ul>
            </div>

            <div className="comp-alert-card card-taxshield">
              <div className="alert-card-header">
                <ShieldIcon size={20} color="#38bdf8" />
                <h4>Giao Dịch Cần Xác Nhận Bóc Tách (Tax Shield)</h4>
              </div>
              <p className="alert-card-desc">
                Hệ thống tự động phát hiện <strong>6 giao dịch chuyển khoản &gt; 10.000.000đ</strong> có dấu hiệu tiền vay mượn hoặc nạp vốn nội bộ cần kế toán duyệt chứng từ để bảo vệ chủ quán không bị tính thuế oan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NEW CLIENT ONBOARDING WIZARD */}
      {showNewClientModal && (
        <div className="cpa-modal-overlay">
          <div className="cpa-modal glass-panel">
            <div className="cpa-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PlusIcon size={18} color="#FFA100" />
                <h3>Tiếp Nhận Hộ Kinh Doanh Mới (Chuẩn Thông Tư 152/2025)</h3>
              </div>
              <button type="button" onClick={() => setShowNewClientModal(false)}>
                <CloseIcon size={16} color="currentColor" />
              </button>
            </div>

            <form onSubmit={handleCreateClientSubmit} className="cpa-form">
              {/* Basic Details */}
              <div className="form-section-title">1. Thông Tin Đăng Ký Kinh Doanh</div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tên Cơ Sở Kinh Doanh / Cửa Hàng:</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Tiệm Bánh &amp; Trà Sữa Mộc Trà"
                    value={newClientForm.name}
                    onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mã Số Thuế (MST 10 số hoặc 13 số):</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: 0109848191"
                    value={newClientForm.mst}
                    onChange={(e) => setNewClientForm({ ...newClientForm, mst: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Họ Và Tên Chủ Hộ:</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Hoàng Anh Tuấn"
                    value={newClientForm.owner}
                    onChange={(e) => setNewClientForm({ ...newClientForm, owner: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ngành Nghề Kinh Doanh Chính:</label>
                  <select 
                    value={newClientForm.industry}
                    onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                  >
                    <option value="F&B (Ăn uống, Giải khát)">F&amp;B (Ăn uống, Giải khát)</option>
                    <option value="Bán lẻ hàng hóa">Bán lẻ hàng hóa, Tạp hóa, Thời trang</option>
                    <option value="Dịch vụ, Sửa chữa">Dịch vụ, Lưu trú, Spa, Sửa chữa</option>
                    <option value="Sản xuất, Gia công">Sản xuất, Gia công, Chế biến</option>
                  </select>
                </div>
              </div>

              {/* Statutory TT152 Tax Regime Classifier */}
              <div className="form-section-title" style={{ marginTop: '16px' }}>
                2. Phương Pháp Tính Thuế Theo Thông Tư 152/2025/TT-BTC
              </div>
              <div className="regime-selection-cards">
                <label className={`regime-choice-card ${newClientForm.taxRegime === 'group1' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="taxRegime" 
                    value="group1"
                    checked={newClientForm.taxRegime === 'group1'}
                    onChange={() => setNewClientForm({ ...newClientForm, taxRegime: 'group1', taxRate: '0% (Miễn thuế)' })}
                  />
                  <div className="regime-choice-content">
                    <strong>Nhóm 1 (Điều 4): Dưới ngưỡng chịu thuế (&lt; 500M)</strong>
                    <p>Áp dụng Sổ doanh thu bán hàng hóa, dịch vụ (Mẫu S1a-HKD). Không phải nộp GTGT &amp; TNCN.</p>
                  </div>
                </label>

                <label className={`regime-choice-card ${newClientForm.taxRegime === 'group2' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="taxRegime" 
                    value="group2"
                    checked={newClientForm.taxRegime === 'group2'}
                    onChange={() => setNewClientForm({ ...newClientForm, taxRegime: 'group2', taxRate: '4.5%' })}
                  />
                  <div className="regime-choice-content">
                    <strong>Nhóm 2 (Điều 5): Nộp thuế theo % trên doanh thu</strong>
                    <p>Áp dụng Sổ chi tiết doanh thu theo nhóm ngành nghề (Mẫu S2a-HKD). Kê khai theo quý.</p>
                  </div>
                </label>

                <label className={`regime-choice-card ${newClientForm.taxRegime === 'group3' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="taxRegime" 
                    value="group3"
                    checked={newClientForm.taxRegime === 'group3'}
                    onChange={() => setNewClientForm({ ...newClientForm, taxRegime: 'group3', taxRate: 'Doanh thu - Chi phí' })}
                  />
                  <div className="regime-choice-content">
                    <strong>Nhóm 3 (Điều 6): Nộp thuế TNCN trên thu nhập tính thuế</strong>
                    <p>Bắt buộc lập Bộ 4 Sổ Kế Toán Chi Tiết (S2b, S2c, S2d, S2e). Dành cho HKD &gt; 3 tỷ hoặc tự nguyện.</p>
                  </div>
                </label>
              </div>

              {/* Data Ingestion Method */}
              <div className="form-section-title" style={{ marginTop: '16px' }}>
                3. Phương Thức Nạp Dữ Liệu Ban Đầu
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Kênh Kết Nối:</label>
                  <select 
                    value={newClientForm.connectionMethod}
                    onChange={(e) => setNewClientForm({ ...newClientForm, connectionMethod: e.target.value })}
                  >
                    <option value="vietqr">Kết nối VietQR Ngân Hàng Thời Gian Thực (MB/VCB/TCB)</option>
                    <option value="csv">Nhập File Sao Kê Ngân Hàng (CSV / Excel)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mục Tiêu Doanh Thu Dự Kiến Năm (VND):</label>
                  <input 
                    type="number" 
                    value={newClientForm.revenueTarget}
                    onChange={(e) => setNewClientForm({ ...newClientForm, revenueTarget: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-cancel" onClick={() => setShowNewClientModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="nano-button">
                  Lưu &amp; Khởi Tạo Sổ Kế Toán TT152
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BANK STATEMENT CSV IMPORT FALLBACK */}
      {showCsvImportModal && (
        <div className="cpa-modal-overlay">
          <div className="cpa-modal glass-panel modal-wide">
            <div className="cpa-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UploadCloudIcon size={18} color="#00f5d4" />
                <h3>Nhập File Sao Kê Ngân Hàng (CSV / Excel Statement Fallback)</h3>
              </div>
              <button type="button" onClick={() => { setShowCsvImportModal(false); setCsvUploadData(null); }}>
                <CloseIcon size={16} color="currentColor" />
              </button>
            </div>

            <div className="csv-modal-body">
              {/* Select Client Target */}
              <div className="csv-target-select-bar">
                <span className="target-label">Hộ kinh doanh nhận dữ liệu sao kê:</span>
                <select 
                  value={selectedImportClient?.id || ''}
                  onChange={(e) => {
                    const found = clients.find((c) => c.id === e.target.value);
                    if (found) setSelectedImportClient(found);
                  }}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (MST: {c.mst}) • {c.taxRegime === 'group1' ? 'Nhóm 1' : c.taxRegime === 'group2' ? 'Nhóm 2' : 'Nhóm 3'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Dropzone */}
              {!csvUploadData && (
                <div className="csv-dropzone">
                  <UploadCloudIcon size={36} color="#FFA100" />
                  <h4>Kéo Thả File Sao Kê Ngân Hàng Vào Đây (CSV hoặc XLSX)</h4>
                  <p>Hỗ trợ mẫu sao kê chuẩn từ MBBank, Vietcombank, Techcombank, ACB, VPBank, BIDV.</p>
                  
                  <div className="csv-actions-row">
                    <button type="button" className="btn-upload-file">
                      <span>Chọn File Từ Máy Tính</span>
                    </button>
                    <span className="or-divider">hoặc</span>
                    <button 
                      type="button" 
                      className="nano-button btn-sample-csv"
                      onClick={handleLoadSampleCsv}
                      disabled={csvParsing}
                    >
                      {csvParsing ? 'Đang đọc cấu trúc sao kê...' : 'Nạp File Sao Kê Thử Nghiệm MBBank (6 Giao Dịch)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Parsed Statement Preview */}
              {csvUploadData && (
                <div className="csv-preview-container">
                  <div className="csv-stat-summary">
                    <div className="csv-summary-item">
                      <span>Ngân Hàng:</span>
                      <strong>{csvUploadData.bank}</strong>
                    </div>
                    <div className="csv-summary-item">
                      <span>Số Tài Khoản:</span>
                      <strong>{csvUploadData.accountNo}</strong>
                    </div>
                    <div className="csv-summary-item">
                      <span>Tổng Giao Dịch:</span>
                      <strong>{csvUploadData.totalRows} dòng</strong>
                    </div>
                    <div className="csv-summary-item">
                      <span>Tổng Tiền Vào:</span>
                      <strong style={{ color: '#FFA100' }}>{fmt(csvUploadData.totalAmount)}</strong>
                    </div>
                    <div className="csv-summary-item">
                      <span>Doanh Thu Chịu Thuế:</span>
                      <strong style={{ color: '#00f5d4' }}>{fmt(csvUploadData.taxableAmount)} ({csvUploadData.taxableCount} dòng)</strong>
                    </div>
                    <div className="csv-summary-item">
                      <span>Dòng Tiền Miễn Thuế:</span>
                      <strong style={{ color: '#4ade80' }}>{fmt(csvUploadData.excludedAmount)} ({csvUploadData.excludedCount} dòng)</strong>
                    </div>
                  </div>

                  <h4 style={{ margin: '14px 0 8px', fontSize: '13px', color: '#bbb' }}>
                    Xem Trước Dữ Liệu Đã Bóc Tách Tự Động Bằng Tax Shield:
                  </h4>

                  <div className="portal-table-wrap">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Ngày</th>
                          <th>Mã GD</th>
                          <th>Nội Dung Chuyển Khoản</th>
                          <th>Số Tiền</th>
                          <th>Phân Loại</th>
                          <th>Quy Tắc Kiểm Toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvUploadData.transactions.map((t, idx) => (
                          <tr key={idx}>
                            <td>{t.date}</td>
                            <td><code>{t.no}</code></td>
                            <td>{t.desc}</td>
                            <td style={{ fontWeight: 600, color: t.isTax ? '#FFA100' : '#888' }}>
                              {fmt(t.amount)}
                            </td>
                            <td>
                              <span className={`portal-book-pill ${t.isTax ? 'pill-taxable' : 'pill-excluded'}`}>
                                {t.isTax ? 'Doanh Thu Bán Lẻ' : 'Dòng Tiền Nội Bộ'}
                              </span>
                            </td>
                            <td>
                              <span className="portal-rule-tag">{t.rule}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="modal-actions-bar" style={{ marginTop: '16px' }}>
                    <button 
                      type="button" 
                      className="btn-cancel" 
                      onClick={() => setCsvUploadData(null)}
                    >
                      Hủy &amp; Chọn Lại File
                    </button>
                    <button 
                      type="button" 
                      className="nano-button"
                      onClick={handleCommitCsvToClient}
                    >
                      Xác Nhận Nạp Vào Sổ Kế Toán Của {selectedImportClient?.name}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CLIENT READ-ONLY PORTAL PREVIEW */}
      {previewPortalClient && (
        <ClientReadOnlyPortal 
          client={previewPortalClient}
          onClose={() => setPreviewPortalClient(null)}
          onOpenFullLedger={(c) => {
            setPreviewPortalClient(null);
            handleOpenClientLedger(c);
          }}
        />
      )}

      {/* MODAL 4: ATOMIC PARTIAL-FAILURE BULK EXECUTION RUNNER (Resolves Blocker 8) */}
      {bulkExecutionModal.isOpen && (
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
            maxWidth: '720px',
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
                <h3 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: 700 }}>
                  {bulkExecutionModal.title}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Hệ thống xử lý nguyên tử (Atomic Per-Client Execution) với kiểm tra trạng thái độc lập từng hồ sơ.
                </p>
              </div>
              {!bulkExecutionModal.isRunning && (
                <button
                  type="button"
                  onClick={() => setBulkExecutionModal(prev => ({ ...prev, isOpen: false }))}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <CloseIcon size={18} />
                </button>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              {/* Progress Bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>
                    {bulkExecutionModal.isRunning ? 'Đang thực thi tác vụ trên từng hộ kinh doanh...' : 'Tiến trình hoàn tất 100%'}
                  </span>
                  <span style={{ color: '#00f5d4', fontWeight: 700 }}>
                    {bulkExecutionModal.progress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${bulkExecutionModal.progress}%`,
                    height: '100%',
                    background: '#00f5d4',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Status Summary */}
              {!bulkExecutionModal.isRunning && bulkExecutionModal.results.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0, 245, 212, 0.1)',
                    border: '1px solid rgba(0, 245, 212, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px'
                  }}>
                    <CheckCircleIcon size={16} color="#00f5d4" />
                    <span>
                      Thành công: <strong>{bulkExecutionModal.results.filter(r => r.status === 'success').length}</strong> hộ
                    </span>
                  </div>
                  {bulkExecutionModal.results.some(r => r.status === 'failed') && (
                    <div style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#f87171'
                    }}>
                      <AlertTriangleIcon size={16} color="#f87171" />
                      <span>
                        Thất bại: <strong>{bulkExecutionModal.results.filter(r => r.status === 'failed').length}</strong> hộ (Có thể thử lại)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Itemized Results List */}
              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px'
              }}>
                {bulkExecutionModal.results.map((r, i) => (
                  <div key={r.id || i} style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{r.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>MST: {r.mst}</div>
                    </div>

                    <div>
                      {r.status === 'success' ? (
                        <span style={{
                          color: '#00f5d4',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: 'rgba(0, 245, 212, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          <CheckIcon size={12} />
                          <span>{r.msg}</span>
                        </span>
                      ) : (
                        <span style={{
                          color: '#f87171',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          <AlertTriangleIcon size={12} />
                          <span>{r.error}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Specific Options (Resolves Blocker 7) */}
              {bulkExecutionModal.type === 'export' && !bulkExecutionModal.isRunning && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                    Chọn định dạng xuất dữ liệu:
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => alert('Đang tải gói ZIP chứa toàn bộ Bộ Sổ Kế Toán Excel chuẩn Mẫu Bộ Tài Chính (Thông tư 152/2025/TT-BTC)...')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#00f5d4',
                        color: '#05101a',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <DownloadCloudIcon size={14} />
                      <span>Tải Excel Mẫu Chuẩn BTC (Khuyên Dùng)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Tệp XML Kê Khai Thuế theo chuẩn dự thảo Cục Thuế 2026 đã được xuất. Sẵn sàng nộp khi CQT mở cổng tiếp nhận chính thức.')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <FileTextIcon size={14} />
                      <span>Xuất Tệp XML (Dự Thảo CQT)</span>
                    </button>
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
              <div>
                {bulkExecutionModal.results.some(r => r.status === 'failed') && (
                  <button
                    type="button"
                    disabled={bulkExecutionModal.isRunning}
                    onClick={handleRetryFailedBulk}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCwIcon size={14} />
                    <span>Thử Lại Các Hộ Thất Bại (Chỉ xử lý mục lỗi)</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setBulkExecutionModal(prev => ({ ...prev, isOpen: false }));
                  setSelectedClientIds(new Set());
                }}
                style={{
                  background: '#00f5d4',
                  color: '#05101a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Hoàn Tất &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DATA MIGRATION FROM MISA & EXCEL */}
      <DataMigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onImportSuccess={handleMigrationSuccess}
      />

      {/* MODAL 6: IMMUTABLE AUDIT TRAIL MODAL */}
      <AuditTrailModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />

      {/* MODAL 7: CPA AUTH & RBAC MODAL */}
      <CpaAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentRole={currentRole}
        onRoleChange={(r) => {
          setCurrentRole(r);
          showToast(
            'Đã chuyển đổi vai trò RBAC!',
            `Chế độ hiển thị: ${r === 'firm_owner' ? 'Chủ Đại Lý (Toàn Quyền)' : r === 'senior_accountant' ? 'Kế Toán Viên Chính (Senior)' : 'Trợ Lý Kế Toán (Junior)'}`
          );
        }}
        onLoginSuccess={(u) => {
          showToast('Đăng nhập thành công!', `Đang quản trị: ${u.firmName}`);
        }}
      />

      {/* MODAL 8: CPA BILLING & PRICING TIERS MODAL */}
      <CpaBillingModal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        currentPlan={currentPlan}
        onUpgradeSuccess={(p) => {
          setCurrentPlan(p);
          showToast('Nâng cấp bản quyền thành công!', `Gói cước của đại lý thuế đã kích hoạt: ${p.toUpperCase()}`);
        }}
      />

    </div>
  );
}
