import Link from 'next/link';
import WaitlistForm from './form';
import {waitlistReady} from '@/lib/waitlist/config';
export const dynamic='force-dynamic';
export const metadata={title:'Rà soát hồ sơ vay | DepositGuard'};
export default async function Service({searchParams}:{searchParams:Promise<{source?:string}>}) {
  const {source}=await searchParams;
  return <article className="mx-auto max-w-2xl space-y-7 px-5 py-12"><h1 className="text-3xl font-bold">Rà soát phương án mua nhà</h1><p>Giá dự kiến 299.000đ mỗi lần, cho một trong hai nhu cầu. Dịch vụ chưa nhận hồ sơ hoặc thanh toán.</p>
    <section><h2 className="text-xl font-bold">Rà soát trước đặt cọc</h2><p>Xem lại tiền cần chuẩn bị, dự phòng còn lại và số tiền gia đình còn dư mỗi tháng.</p></section>
    <section><h2 className="text-xl font-bold">Rà soát đề nghị vay</h2><p>Đọc một đề nghị hoặc so hai phương án trên cùng giả định, xác định tháng thay đổi khoản trả và câu hỏi cần trao đổi với ngân hàng.</p></section>
    {waitlistReady()?<WaitlistForm source={source==='sample'||source==='results'?source:'direct'}/>:<p>Danh sách chờ chưa mở.</p>}
    <Link className="block text-blue-800 underline" href="/kiem-tra-mua-nha">Tính thử miễn phí với số của gia đình tôi</Link></article>
}
