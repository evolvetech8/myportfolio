import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SparklesIcon, CloseIcon } from './Icons';

export default function AIAgentDrawer() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: t('aiAgent.welcome'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Reset welcome message on language change if only welcome is present
    if (messages.length === 1) {
      setMessages([
        {
          sender: 'ai',
          text: t('aiAgent.welcome'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const knowledgeBase = {
    tt152: {
      keywords: ['152', '88', 'thông tư', 'circular', 'hộ kinh doanh', 'household', 'thuế', 'tax', 'sổ'],
      vi: 'Thông tư 152/2025/TT-BTC (thay thế TT 88 từ 01/01/2026) phân nhóm kế toán theo phương pháp tính thuế: Nhóm 1 (< 500M) dùng S1a-HKD; Nhóm 2 (thuế % doanh thu) dùng S2a-HKD; Nhóm 3 (thuế theo thu nhập) mở bộ 4 sổ chi tiết S2b, S2c, S2d, S2e; kết hợp Nghị định 70/2025/NĐ-CP bắt buộc HĐĐT từ máy tính tiền. Nền tảng A-Sổ tự động hóa 100% việc phân loại và lập các sổ này.',
      en: 'Circular 152/2025/TT-BTC (replacing Circular 88 from Jan 1, 2026) mandates accounting books based on tax calculation method: Group 1 uses S1a-HKD; Group 2 uses S2a-HKD; Group 3 requires the 4-book bundle (S2b, S2c, S2d, S2e); alongside Decree 70/2025/ND-CP on cash register e-invoices. A-Sổ automates 100% of these statutory requirements.'
    },
    aso: {
      keywords: ['a-sổ', 'aso', 'tính năng', 'feature', 'giải pháp', 'archonic'],
      vi: 'A-Sổ là nền tảng quản trị sổ thuế và tuân thủ doanh thu thế hệ mới của Archonic. A-Sổ kết nối dữ liệu máy POS bán lẻ, tài khoản ngân hàng và hệ thống hóa đơn điện tử thành bộ sổ sách kế toán thuế sẵn sàng thanh tra, giúp hộ kinh doanh và SME tiết kiệm 95% thời gian kế toán.',
      en: 'A-Sổ is Archonic\'s next-generation tax ledger and revenue compliance platform. It seamlessly connects POS machines, business bank accounts, and e-invoice portals into an audit-ready tax ledger, saving 95% of manual accounting time.'
    },
    nd123: {
      keywords: ['123', '70', 'nghị định', 'hóa đơn', 'invoice', 'đối chiếu', 'e-invoice'],
      vi: 'A-Sổ đồng bộ trực tiếp với hệ thống hóa đơn điện tử theo Nghị định 70/2025/NĐ-CP và Nghị định 123/2020/NĐ-CP. Hệ thống tự động kiểm tra tính hợp lệ của hóa đơn đầu vào/đầu ra, đối chiếu mã cơ quan thuế và khớp với sổ kế toán ngay lập tức.',
      en: 'A-Sổ synchronizes directly with Decree 70/2025 and Decree 123 e-invoicing portals. It automatically verifies input and output e-invoice authenticity, matches tax authority codes, and reconciles entries with your ledgers in real time.'
    },
    pricing: {
      keywords: ['giá', 'bảng giá', 'chi phí', 'tiền', 'gói', 'starter', 'pro', 'advanced', 'enterprise', 'price', 'pricing', 'cost', 'khởi nghiệp'],
      vi: 'Bảng giá A-Sổ dành cho kế toán dịch vụ & đại lý thuế:\n1. Gói Khởi Nghiệp: 490.000đ/tháng (4.900.000đ/năm - tiết kiệm 980k) cho tối đa 15 hộ kinh doanh.\n2. Gói Pro Studio (Khuyên dùng): 1.490.000đ/tháng (14.900.000đ/năm - tiết kiệm 2,98 triệu) cho đại lý thuế tối đa 50 hộ, 5 tài khoản kế toán, phân quyền RBAC và audit trail.\n3. Gói Enterprise Firm: 2.990.000đ/tháng (29.900.000đ/năm - tiết kiệm 5,98 triệu) cho tối đa 200 hộ (+20k/hộ phụ trội).\nĐặc biệt: Đăng ký dùng thử 30 ngày MIỄN PHÍ trọn vẹn chu kỳ đóng sổ tháng không cần thẻ tín dụng!',
      en: 'A-Sổ CPA Studio pricing:\n1. Starter: 490,000 VND/mo (4,900,000 VND/yr - save 980k) for up to 15 clients.\n2. Pro Studio (Recommended): 1,490,000 VND/mo (14,900,000 VND/yr - save 2.98M) for up to 50 clients, 5 staff seats, RBAC & audit trail.\n3. Enterprise Firm: 2,990,000 VND/mo (29,900,000 VND/yr - save 5.98M) for up to 200 clients.\nIncludes 30-Day Free Trial covering a full monthly closing cycle!'
    },
    demo: {
      keywords: ['demo', 'dùng thử', 'trial', 'liên hệ', 'contact', 'triển khai', 'deploy', 'bắt đầu'],
      vi: 'A-Sổ có chính sách Dùng Thử 30 Ngày Miễn Phí: chỉ cần liên kết ngân hàng hoặc quét 1 mã VietQR, bạn sẽ thấy dòng tiền tự động đổ vào sổ S1a-HKD ngay lập tức. Vui lòng bấm "Trải Nghiệm A-Sổ" trên thanh menu hoặc liên hệ Hotline: 0353600900 (Email: archonic88@gmail.com).',
      en: 'A-Sổ provides a 30-Day Free Trial: connect your bank account or scan one VietQR, and watch transactions auto-populate Ledger S1a instantly. Click "Experience A-Sổ" on the top navigation or contact Hotline: 0353600900 (archonic88@gmail.com).'
    }
  };

  const answerQuestion = (query) => {
    const q = query.toLowerCase();
    let reply = lang === 'vi' 
      ? 'Cảm ơn bạn đã quan tâm. Nền tảng A-Sổ của Archonic chuyên tự động hóa toàn diện hệ thống sổ kế toán Thông tư 152/2025/TT-BTC và đối chiếu hóa đơn điện tử Nghị định 70 & 123. Bạn có thể để lại thông tin tại trang Liên Hệ để chuyên gia kỹ thuật tư vấn triển khai chi tiết.'
      : 'Thank you for your interest. Archonic\'s A-Sổ platform automates Circular 152/2025 statutory accounting books and Decree 70/123 e-invoice reconciliation. Please leave your details on our Contact page to connect with an A-Sổ solutions specialist.';

    for (const item of Object.values(knowledgeBase)) {
      if (item.keywords.some(k => q.includes(k))) {
        reply = item[lang];
        break;
      }
    }
    return reply;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = answerQuestion(text);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        className="ai-agent-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Agent"
      >
        <span className="ai-agent-fab-pulse"></span>
        <span className="ai-agent-fab-icon"><SparklesIcon size={15} color="#FF7A00" /></span>
        <span className="ai-agent-fab-text">{t('aiAgent.fabText')}</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="ai-drawer glass-panel">
          <div className="ai-drawer-header">
            <div className="ai-drawer-title-group">
              <span className="ai-drawer-status-dot"></span>
              <div>
                <h3 className="ai-drawer-title">{t('aiAgent.badge')}</h3>
                <span className="ai-drawer-subtitle">{t('aiAgent.subtitle')}</span>
              </div>
            </div>
            <button className="ai-drawer-close" onClick={() => setIsOpen(false)} aria-label="Close AI Agent">
              <CloseIcon size={14} color="var(--text-secondary)" />
            </button>
          </div>

          <div className="ai-drawer-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`ai-message ai-message-${m.sender}`}>
                <div className="ai-message-bubble">
                  <p>{m.text}</p>
                  <span className="ai-message-time">{m.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ai-message ai-message-ai">
                <div className="ai-message-bubble ai-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ai-quick-prompts">
            <button onClick={() => handleSend(t('aiAgent.prompt1'))}>
              {t('aiAgent.prompt1')}
            </button>
            <button onClick={() => handleSend(t('aiAgent.prompt2'))}>
              {t('aiAgent.prompt2')}
            </button>
            <button onClick={() => handleSend(t('aiAgent.prompt3'))}>
              {t('aiAgent.prompt3')}
            </button>
          </div>

          <form 
            className="ai-drawer-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiAgent.inputPlaceholder')}
            />
            <button type="submit" className="nano-button" style={{ padding: '8px 16px' }}>
              {t('aiAgent.send')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
