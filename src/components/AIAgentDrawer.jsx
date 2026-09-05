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
      keywords: ['88', 'thông tư', 'circular', 'hộ kinh doanh', 'household', 'thuế', 'tax', 'sổ'],
      vi: 'Thông tư 88/2021/TT-BTC quy định 7 loại sổ kế toán bắt buộc: Sổ doanh thu (S1-HKD), Hàng hóa (S2-HKD), Chi phí (S3-HKD), Tiền mặt (S4-HKD), Tiền gửi (S5-HKD), Thuế (S6-HKD) và Tiền lương (S7-HKD). Nền tảng A-Sổ tự động hóa 100% việc lập, ghi chép và kết xuất 7 loại sổ này theo đúng biểu mẫu pháp lý.',
      en: 'Circular 88/2021/TT-BTC requires 7 mandatory accounting books: Revenue (S1), Inventory (S2), Expenses (S3), Cash (S4), Bank (S5), Tax (S6), and Payroll (S7). The A-Sổ platform automates 100% of these 7 books to certified regulatory standards.'
    },
    aso: {
      keywords: ['a-sổ', 'aso', 'tính năng', 'feature', 'giải pháp', 'archonic'],
      vi: 'A-Sổ là nền tảng quản trị sổ thuế và tuân thủ doanh thu thế hệ mới của Archonic. A-Sổ kết nối dữ liệu máy POS bán lẻ, tài khoản ngân hàng và hệ thống hóa đơn điện tử thành bộ sổ sách kế toán thuế sẵn sàng thanh tra, giúp hộ kinh doanh và SME tiết kiệm 95% thời gian kế toán.',
      en: 'A-Sổ is Archonic\'s next-generation tax ledger and revenue compliance platform. It seamlessly connects POS machines, business bank accounts, and e-invoice portals into an audit-ready tax ledger, saving 95% of manual accounting time.'
    },
    nd123: {
      keywords: ['123', 'nghị định', 'hóa đơn', 'invoice', 'đối chiếu', 'e-invoice'],
      vi: 'A-Sổ đồng bộ trực tiếp với hệ thống hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP. Hệ thống tự động kiểm tra tính hợp lệ của hóa đơn đầu vào/đầu ra, đối chiếu mã cơ quan thuế và khớp với sổ kế toán ngay lập tức.',
      en: 'A-Sổ synchronizes directly with Decree 123 e-invoicing portals. It automatically verifies input and output e-invoice authenticity, matches tax authority codes, and reconciles entries with your ledgers in real time.'
    },
    demo: {
      keywords: ['demo', 'giá', 'price', 'liên hệ', 'contact', 'triển khai', 'deploy', 'bắt đầu'],
      vi: 'Để đăng ký trải nghiệm A-Sổ hoặc nhận bảng giá giải pháp triển khai cho chuỗi/doanh nghiệp của bạn, vui lòng bấm nút "Trải Nghiệm A-Sổ" hoặc liên hệ Hotline: 0353600900 (Email: archonic88@gmail.com).',
      en: 'To experience A-Sổ or review pricing models for your business/retail chain, please click "Experience A-Sổ" or contact our hotline directly at 0353600900 (archonic88@gmail.com).'
    }
  };

  const answerQuestion = (query) => {
    const q = query.toLowerCase();
    let reply = lang === 'vi' 
      ? 'Cảm ơn bạn đã quan tâm. Nền tảng A-Sổ của Archonic chuyên tự động hóa toàn diện 7 loại sổ kế toán Thông tư 88 và đối chiếu hóa đơn điện tử Nghị định 123. Bạn có thể để lại thông tin tại trang Liên Hệ để chuyên gia kỹ thuật tư vấn triển khai chi tiết.'
      : 'Thank you for your interest. Archonic\'s A-Sổ platform automates the 7 mandatory Circular 88 ledgers and Decree 123 e-invoice reconciliation. Please leave your details on our Contact page to connect with an A-Sổ solutions specialist.';

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
