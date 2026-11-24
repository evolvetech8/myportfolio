'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
export default function Notice() {
  const [link,setLink]=useState<{action:string,token:string}|null>(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{const found=/^#(confirm|cancel)=([a-f0-9]{64})$/.exec(location.hash);if(found)setLink({action:found[1],token:found[2]});else setMessage('Liên kết không hợp lệ.');},[]);
  return <article className="mx-auto max-w-xl space-y-5 p-8"><h1 className="text-2xl font-bold">Thông báo mở dịch vụ DepositGuard</h1>
    {link && <button className="rounded-xl bg-blue-800 p-3 text-white" disabled={busy} onClick={async()=>{setBusy(true);try{const r=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(link)});setMessage((await r.json()).message);if(r.ok||r.status===410){setLink(null);history.replaceState(null,'',location.pathname);}}catch{setMessage('Chưa thể kết nối. Hãy thử lại.');}finally{setBusy(false);}}}>{link.action==='confirm'?'Xác nhận nhận email khi mở dịch vụ':'Hủy đăng ký nhận tin'}</button>}
    <p role="status">{message}</p><Link className="text-blue-800 underline" href="/ra-soat-ho-so-vay">Về trang dịch vụ</Link></article>
}
