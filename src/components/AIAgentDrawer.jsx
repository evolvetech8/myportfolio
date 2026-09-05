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
    tt88: {
      keywords: ['88', 'thông tư', 'circular', 'hộ kinh doanh', 'household', 'thuế', 'tax'],
      vi: 'Thông tư 88/2021/TT-BTC quy định chế độ kế toán cho hộ kinh doanh & cá nhân kinh doanh, bao gồm 7 loại sổ kế toán bắt buộc: Sổ doanh thu, Sổ vật liệu/hàng hóa, Sổ chi phí, Sổ tiền mặt, Sổ tài khoản ngân hàng, v.v. Archonic Bridge tự động hóa việc ghi sổ và đồng bộ hóa đơn điện tử theo đúng mẫu biểu này.',
      en: 'Circular 88/2021/TT-BTC establishes strict accounting standards for Vietnamese household businesses across 7 mandatory ledgers (Revenue, Inventory, Cash, Bank accounts, etc.). Archonic Bridge automatically maps transactions and e-invoices directly into these compliant templates.'
    },
    bridge: {
      keywords: ['bridge', 'archonic', 'doanh thu', 'revenue', 'tính năng', 'feature'],
      vi: 'Archonic Bridge là Cầu nối Doanh thu & Tuân thủ Thuế: Kết nối dữ liệu máy POS, tài khoản ngân hàng và hệ thống hóa đơn điện tử (NĐ 123) thành sổ sách kế toán sẵn sàng thanh tra thuế. Giảm 90% thời gian hạch toán thủ công.',
      en: 'Archonic Bridge connects POS terminals, business bank accounts, and Decree 123 e-invoicing portals into an audit-ready tax ledger. It cuts manual book-keeping time by 90% with automated reconciliation.'
    },
    ocr: {
      keywords: ['ocr', 'visioncore', 'hóa đơn', 'invoice', 'bảo mật', 'security', 'tốc độ'],
      vi: 'VisionCore là vi dịch vụ OCR biên (Edge OCR) sử dụng mô hình AI xử lý tài liệu cục bộ, tốc độ trích xuất dưới 1.2 giây/hóa đơn. Toàn bộ dữ liệu tài chính nhạy cảm được mã hóa E2EE và xử lý on-premise, không rò rỉ ra ngoài.',
      en: 'VisionCore is an enterprise Edge OCR microservice delivering sub-1.2s extraction per invoice. All financial data is encrypted end-to-end and processed on edge nodes to prevent cloud leakage.'
    },
    demo: {
      keywords: ['demo', 'giá', 'price', 'liên hệ', 'contact', 'triển khai', 'deploy'],
      vi: 'Để đặt lịch Demo kỹ thuật hoặc nhận bảng giá giải pháp Archonic Bridge cho chuỗi/doanh nghiệp của bạn, vui lòng bấm nút "Đặt Lịch Demo" hoặc liên hệ Hotline: 0353600900 (Email: archonic88@gmail.com).',
      en: 'To schedule an enterprise technical demo or review pricing models for Archonic Bridge, please click "Request Demo" or contact our hotline directly at 0353600900 (archonic88@gmail.com).'
    }
  };

  const answerQuestion = (query) => {
    const q = query.toLowerCase();
    let reply = lang === 'vi' 
      ? 'Cảm ơn bạn đã quan tâm. Hệ thống Archonic cung cấp hạ tầng công nghệ lõi gồm Archonic Bridge (Tuân thủ Thuế), HowDoI (AI Marketing), và VisionCore (Edge OCR). Bạn có thể để lại thông tin tại trang Liên Hệ để chuyên gia kỹ thuật tư vấn chi tiết.'
      : 'Thank you for your question. Archonic delivers core enterprise infrastructure: Archonic Bridge (Tax Compliance), HowDoI (AI Growth), and VisionCore (Edge OCR). Please leave your contact details on our Contact page for an enterprise solution architect consult.';

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
        <span className="ai-agent-fab-text">Vertex AI Sales Eng</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="ai-drawer glass-panel">
          <div className="ai-drawer-header">
            <div className="ai-drawer-title-group">
              <span className="ai-drawer-status-dot"></span>
              <div>
                <h3 className="ai-drawer-title">{t('aiAgent.badge')}</h3>
                <span className="ai-drawer-subtitle">Google Cloud Run & Vertex AI Node</span>
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
