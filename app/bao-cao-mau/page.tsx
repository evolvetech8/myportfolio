import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  ArrowRight,
  Lock,
  Building2,
  Scale,
  FileWarning,
  BookOpen,
} from 'lucide-react';
import { formatVND } from '@/lib/depositguard/formatters';
import RiskBadge from '@/components/depositguard/common/RiskBadge';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';

import { waitlistReady } from '@/lib/waitlist/config';
export const dynamic='force-dynamic';
export const metadata: Metadata = {
  title: 'Hồ Sơ Chẩn Đoán Rủi Ro Tài Chính Trước Đặt Cọc (Bản Mẫu) | EvolveTech DepositGuard',
  description:
    'Xem trước cấu trúc Hồ sơ Chẩn đoán Rủi ro Tài chính Trước Đặt Cọc của EvolveTech DepositGuard: ma trận Stress-Test 4 kịch bản, bóc tách 7 khoản tiền mặt, bộ giải ngược và 5 câu hỏi đàm phán ngân hàng.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/bao-cao-mau',
  },
};

export default function BaoCaoMauPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Hồ sơ Chẩn đoán Mẫu (Synthetic Diagnostic Dossier • Mã: DG-2026-HCM-2800)</span>
          </div>
          <span className="font-mono text-xs text-slate-500">
            Engine: DepositGuard v1.1 (Integer-VND Deterministic)
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Hồ sơ Chẩn đoán Rủi ro Tài chính Trước Đặt Cọc
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Dưới đây là hồ sơ phân tích mẫu cho một gia đình trẻ tại TP.HCM đang chuẩn bị đặt cọc <strong>150.000.000 ₫</strong> cho căn hộ thương mại giá <strong>2.800.000.000 ₫</strong>. Mọi chỉ số rủi ro cốt lõi đều được mở miễn phí 100% trên bảng kết quả của bạn.
        </p>
      </header>

      {/* Dossier Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Dossier Top Stamp Bar */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <span>HỒ SƠ THẨM ĐỊNH ĐỘC LẬP #DG-2026-HCM-2800</span>
              <span>•</span>
              <span>NGÀY LẬP: 19/11/2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Căn hộ 2 Phòng ngủ (68m²) — Khu Đông TP.HCM
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Hộ gia đình 2 thu nhập • Tổng thu nhập thực nhận (Net): <strong>{formatVND(55_000_000)}/tháng</strong> • Chi phí thiết yếu: <strong>{formatVND(30_000_000)}/tháng</strong>
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-1.5 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Kết luận chẩn đoán tổng quát
            </span>
            <RiskBadge status="DEFICIT" size="md" />
            <p className="text-[11px] text-rose-300 font-medium">
              Phát hiện điểm gãy dòng tiền tại <strong>Tháng thứ 13</strong> (-2,33 tr/tháng)
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          {/* Section 1: 7 Upfront Cash Items Waterfall */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Phần 1. Bóc tách 7 khoản tiền mặt bắt buộc trước &amp; ngay khi nhận nhà
              </h3>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Cảnh báo: Cần 1,198 tỷ tiền mặt (chứ không chỉ 800 triệu vốn tự có)
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Hạng mục tiền mặt</th>
                    <th className="p-3.5">Cơ sở ước tính</th>
                    <th className="p-3.5 text-right">Số tiền (VND)</th>
                    <th className="p-3.5">Rủi ro nếu bỏ sót</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">1. Vốn tự có trả cho bên bán (30%)</td>
                    <td className="p-3.5 text-slate-600">Bao gồm 150 tr tiền cọc</td>
                    <td className="p-3.5 text-right font-mono font-bold">{formatVND(800_000_000)}</td>
                    <td className="p-3.5 text-slate-600">Mất cọc nếu không đóng đủ đúng hạn</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">2. Quỹ bảo trì chung cư (2%)</td>
                    <td className="p-3.5 text-slate-600">2% giá trước VAT</td>
                    <td className="p-3.5 text-right font-mono font-bold">{formatVND(52_000_000)}</td>
                    <td className="p-3.5 text-slate-600">Chủ đầu tư giữ chìa khóa nếu chưa đóng</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">3. Lệ phí trước bạ (0,5%) &amp; Phí cấp sổ</td>
                    <td className="p-3.5 text-slate-600">Khi làm thủ tục sang tên / sổ hồng</td>
                    <td className="p-3.5 text-right font-mono font-bold">{formatVND(16_000_000)}</td>
                    <td className="p-3.5 text-slate-600">Chậm hoàn tất hồ sơ thế chấp</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">4. Phí công chứng, thẩm định giá &amp; BH cháy nổ</td>
                    <td className="p-3.5 text-slate-600">Thu trực tiếp khi giải ngân</td>
                    <td className="p-3.5 text-right font-mono font-bold">{formatVND(12_000_000)}</td>
                    <td className="p-3.5 text-slate-600">Phát sinh ngay ngày ký giải ngân</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">5. Nội thất cơ bản &amp; Chi phí chuyển nhà</td>
                    <td className="p-3.5 text-slate-600">Bếp, rèm, điều hòa, thiết bị cơ bản</td>
                    <td className="p-3.5 text-right font-mono font-bold">{formatVND(138_000_000)}</td>
                    <td className="p-3.5 text-slate-600">Thường bị đội vốn 20–30% nếu không khóa trần</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="p-3.5 font-bold text-slate-900">6. Quỹ dự phòng khẩn cấp tối thiểu (6 tháng)</td>
                    <td className="p-3.5 text-blue-900">6 tháng chi phí sinh hoạt thiết yếu</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-blue-900">{formatVND(180_000_000)}</td>
                    <td className="p-3.5 text-blue-950 font-medium">Lá chắn chống vỡ nợ khi hết ưu đãi lãi suất</td>
                  </tr>
                  <tr className="bg-slate-900 text-white font-bold">
                    <td className="p-4" colSpan={2}>TỔNG TIỀN MẶT CẦN CÓ TRƯỚC KHI KÝ ĐẶT CỌC (Mục 1 → 6)</td>
                    <td className="p-4 text-right font-mono text-blue-400 text-base">{formatVND(1_198_000_000)}</td>
                    <td className="p-4 text-xs text-slate-300">Tương đương 42,8% giá trị căn hộ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: 4-Scenario Stress-Test Matrix */}
          <section className="space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Phần 2. Ma trận Stress-Test 4 kịch bản (Khoản vay {formatVND(2_000_000_000)} • 240 tháng • Gốc đều)
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Kịch bản kiểm định</th>
                    <th className="p-3.5 text-right">Trả Tháng 1 (7%)</th>
                    <th className="p-3.5 text-right">Trả Tháng 13 (Thả nổi)</th>
                    <th className="p-3.5 text-right">Dòng tiền Tháng 13</th>
                    <th className="p-3.5">Tháng âm đầu tiên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">1. Cơ sở (Ưu đãi 7% → Thả nổi 12%/năm)</td>
                    <td className="p-3.5 text-right font-mono">{formatVND(20_000_000)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-amber-800">{formatVND(27_333_333)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-700">-{formatVND(2_333_333)}</td>
                    <td className="p-3.5 font-bold text-rose-700">Tháng 13</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-3.5 font-semibold text-slate-900">2. Sốc lãi suất +2 điểm % (Thả nổi 14%/năm)</td>
                    <td className="p-3.5 text-right font-mono">{formatVND(20_000_000)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-800">{formatVND(30_500_000)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-700">-{formatVND(5_500_000)}</td>
                    <td className="p-3.5 font-bold text-rose-700">Tháng 13 (Bào mòn quỹ)</td>
                  </tr>
                  <tr className="bg-rose-50/50">
                    <td className="p-3.5 font-semibold text-slate-900">3. Sốc lãi suất +4 điểm % (Thả nổi 16%/năm)</td>
                    <td className="p-3.5 text-right font-mono">{formatVND(20_000_000)}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-rose-900">{formatVND(33_666_667)}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-rose-800">-{formatVND(8_666_667)}</td>
                    <td className="p-3.5 font-extrabold text-rose-900">Tháng 13 (Thủng đáy dự phòng)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">4. Sốc thu nhập (-20% thu nhập trong 6 tháng)</td>
                    <td className="p-3.5 text-right font-mono">{formatVND(20_000_000)}</td>
                    <td className="p-3.5 text-right font-mono font-bold">{formatVND(27_333_333)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-700">-{formatVND(13_333_333)}</td>
                    <td className="p-3.5 font-bold text-rose-700">Ngay khi thu nhập giảm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Reverse Affordability Solver Recommendations */}
          <section className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-800" />
              <span>Phần 3. Phương án hiệu chỉnh an toàn từ Bộ giải ngược (Reverse Affordability Solver)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 rounded-xl border border-blue-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-800">Đòn bẩy 1: Giảm dư nợ vay</span>
                <p className="font-mono text-base font-extrabold text-slate-900">
                  Tối đa {formatVND(1_639_344_311)}
                </p>
                <p className="text-xs text-slate-600">
                  Giảm khoản vay từ 2,0 tỷ xuống 1,64 tỷ giúp dòng tiền Tháng 13 ở mức lãi 12% cân bằng (&ge; 0 ₫).
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-800">Đòn bẩy 2: Bổ sung vốn tự có</span>
                <p className="font-mono text-base font-extrabold text-slate-900">
                  +{formatVND(360_655_689)}
                </p>
                <p className="text-xs text-slate-600">
                  Tăng vốn tự có (hoặc vay hỗ trợ không lãi từ người thân) để không vượt trần nợ an toàn.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-800">Đòn bẩy 3: Chọn căn hộ tầm giá</span>
                <p className="font-mono text-base font-extrabold text-slate-900">
                  ~{formatVND(2_440_000_000)}
                </p>
                <p className="text-xs text-slate-600">
                  Giữ nguyên 800 triệu vốn tự có và giữ nguyên quỹ dự phòng 180 triệu không bị xâm phạm.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: 5 Mandatory Written Questions for Bank Officer & 3 Contract Clauses */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Phần 4A. 5 Câu hỏi bắt buộc yêu cầu Tín dụng viên xác nhận bằng văn bản</span>
              </h3>
              <ol className="space-y-2.5 text-xs text-slate-700 list-decimal pl-4 leading-relaxed">
                <li>
                  <strong>Công thức lãi suất sau ưu đãi:</strong> &ldquo;Từ tháng 13, lãi suất bằng chỉ số tham chiếu nào (LSTĐ 12 tháng trả sau hay Lãi suất cơ sở nội bộ) cộng biên độ cố định bao nhiêu %/năm?&rdquo;
                </li>
                <li>
                  <strong>Kết quả thẩm định giá sơ bộ:</strong> &ldquo;Với căn hộ này, đơn vị thẩm định giá của ngân hàng định giá bao nhiêu và tỷ lệ cho vay tối đa (LTV) tính trên giá định giá hay giá hợp đồng?&rdquo;
                </li>
                <li>
                  <strong>Cơ chế sau khi hết ân hạn nợ gốc:</strong> &ldquo;Khi hết 12/24 tháng ân hạn gốc, nợ gốc được chia cho số tháng còn lại hay giữ nguyên số tháng ban đầu?&rdquo;
                </li>
                <li>
                  <strong>Biểu phí trả nợ trước hạn từng năm:</strong> &ldquo;Nếu gia đình trả bớt 100–200 triệu nợ gốc ở năm thứ 2 hoặc năm thứ 3 thì phí phạt là bao nhiêu % trên số tiền trả trước?&rdquo;
                </li>
                <li>
                  <strong>Điều kiện bảo hiểm đi kèm:</strong> &ldquo;Lãi suất ưu đãi 7%/năm có bắt buộc mua bảo hiểm nhân thọ hoặc bảo hiểm khoản vay hàng năm không? Nếu không mua thì lãi suất cộng thêm bao nhiêu %?&rdquo;
                </li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-amber-950 flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Phần 4B. 3 Điều khoản bảo vệ tiền cọc trước khi ký Hợp đồng Đặt cọc</span>
              </h3>
              <ul className="space-y-3 text-xs text-amber-950 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>1. Điều khoản bảo lưu giải ngân tín dụng:</strong> Ghi rõ trong thỏa thuận đặt cọc: <em>&ldquo;Trường hợp ngân hàng từ chối cấp tín dụng hoặc định giá tài sản thấp hơn [X tỷ đồng] không do lỗi cố ý của Bên Mua, Bên Bán hoàn trả 100% tiền đặt cọc trong vòng 07 ngày làm việc.&rdquo;</em>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>2. Xác minh bản gốc giấy tờ pháp lý:</strong> Kiểm tra bản gốc Sổ hồng/Hợp đồng mua bán, xác nhận tài sản không đang bị kê biên hoặc thế chấp quá hạn tại tổ chức tín dụng khác.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>3. Thời hạn thanh toán khớp với quy trình giải ngân:</strong> Đảm bảo thời gian từ ngày đặt cọc đến ngày công chứng tối thiểu 21–30 ngày để ngân hàng hoàn tất thẩm định hồ sơ và phát hành cam kết giải ngân.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Dossier Footer CTA */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Miễn phí 100% • Không yêu cầu số điện thoại hay đăng nhập</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold">
              Tạo ngay bảng chẩn đoán tương tự với số liệu căn nhà bạn đang xem
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/kiem-tra-mua-nha"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Tạo hồ sơ cho căn nhà của bạn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/huong-dan"
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Đọc 5 cẩm nang mua nhà</span>
            </Link>
          </div>
        </div>
      </div>

      <Link className="mx-auto my-4 block w-fit rounded-xl bg-blue-800 p-4 text-white print:hidden" href="/ra-soat-ho-so-vay?source=sample">{waitlistReady() ? 'Báo cho tôi khi mở gói rà soát 299.000đ' : 'Xem hai gói rà soát chuyên sâu'}</Link>
      <DisclaimerBanner />
    </div>
  );
}
