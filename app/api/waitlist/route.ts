import { randomBytes, createHash } from 'node:crypto';
import { z } from 'zod';
import { waitlistReady } from '@/lib/waitlist/config';

const signup = z.object({
  email: z.string().trim().email().max(254).transform(v => v.toLowerCase()),
  stage: z.enum(['learning','property','offer']), focus: z.enum(['undecided','deposit','loan']),
  source: z.enum(['sample','results','direct']), consent: z.literal(true),
}).strict();
const action = z.object({ action: z.enum(['confirm','cancel']), token: z.string().regex(/^[a-f0-9]{64}$/) }).strict();
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
async function rpc(name: string, args: Record<string,string>): Promise<boolean> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(new URL('/rest/v1/rpc/'+name,process.env.SUPABASE_URL), {
    method:'POST', headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},
    body:JSON.stringify(args), signal:AbortSignal.timeout(8000), cache:'no-store'
  });
  if (!res.ok) throw Error('storage');
  return (await res.json()) === true;
}
export async function POST(req: Request) {
  const reply = (status:number, message:string) => Response.json({message},{status,headers:{'Cache-Control':'no-store'}});
  if (!process.env.APP_ORIGIN || req.headers.get('origin') !== new URL(process.env.APP_ORIGIN).origin) return reply(403,'Yêu cầu không hợp lệ.');
  const data = await req.json().catch(()=>null);
  const operation = action.safeParse(data);
  try {
    if(operation.success) {
      const ok = await rpc('review_waitlist_action',{p_action:operation.data.action,p_hash:hash(operation.data.token)});
      return ok ? reply(200,operation.data.action==='confirm'?'Đã xác nhận email của bạn.':'Đã hủy đăng ký.') : reply(410,'Liên kết đã dùng hoặc hết hạn. Bạn có thể đăng ký lại.');
    }
    if (!waitlistReady()) return reply(503,'Danh sách chờ chưa mở.');
    const parsed = signup.safeParse(data);
    if (!parsed.success) return reply(400,'Vui lòng kiểm tra email, lựa chọn và sự đồng ý.');
    const {email,stage,focus,source} = parsed.data;
    const confirm = randomBytes(32).toString('hex'), cancel = randomBytes(32).toString('hex');
    const reserved = await rpc('reserve_review_waitlist',{p_email:email,p_stage:stage,p_focus:focus,p_source:source,p_confirm:hash(confirm),p_cancel:hash(cancel)});
    if(reserved) {
      const link = new URL('/ra-soat-ho-so-vay/thong-bao', process.env.APP_ORIGIN).href;
      try {
        const sent = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({
          from:process.env.BETA_FROM_EMAIL,to:[email],subject:'Xác nhận nhận tin khi DepositGuard mở gói 299.000đ',
          text:`Bạn đã yêu cầu nhận tin khi mở dịch vụ. Mở liên kết và bấm xác nhận trong 48 giờ:\n${link}#confirm=${confirm}\n\nHủy đăng ký bất cứ lúc nào:\n${link}#cancel=${cancel}`
        }),signal:AbortSignal.timeout(8000)});
        if(!sent.ok) throw Error('delivery');
      } catch {
        await rpc('review_waitlist_action',{p_action:'delivery_failed',p_hash:hash(confirm)});
        throw Error('delivery');
      }
    }
    return reply(200,'Nếu email chưa xác nhận, hãy kiểm tra hộp thư và thư rác. Bạn có thể gửi lại sau 2 phút.');
  } catch { return reply(503,'Chưa thể hoàn tất. Vui lòng thử lại sau.'); }
}
