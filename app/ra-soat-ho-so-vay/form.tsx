'use client';
import {useState} from 'react';
export default function WaitlistForm({source}:{source:string}) {
  const [stage,setStage]=useState(''), [focus,setFocus]=useState('undecided'), [busy,setBusy]=useState(false), [message,setMessage]=useState('');
  return <form className="grid gap-5 rounded-2xl border p-6" onSubmit={async e=>{
    e.preventDefault(); if(busy)return;
    const data=new FormData(e.currentTarget);
    setBusy(true);setMessage('');
    try {
      const response=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),stage,focus,source,consent:data.get('consent')==='on'})});
      setMessage((await response.json()).message);
    } catch {setMessage('Chưa thể kết nối. Bạn có thể thử lại.');} finally {setBusy(false);}
  }}>
    <label>Email nhận thông báo<input required name="email" type="email" autoComplete="email" maxLength={254} className="block w-full rounded border p-3"/></label>
    <label>Anh/chị đang ở bước nào?<select required value={stage} className="block w-full rounded border p-3" onChange={e=>{const v=e.target.value;setStage(v);setFocus(v==='property'?'deposit':v==='offer'?'loan':'undecided');}}>
      <option value="">Chọn giai đoạn</option><option value="learning">Đang tìm hiểu</option><option value="property">Đã chọn căn</option><option value="offer">Đã nhận đề nghị vay</option></select></label>
    <label>Gói anh/chị quan tâm<select className="block w-full rounded border p-3" value={focus} onChange={e=>setFocus(e.target.value)}><option value="undecided">Chưa quyết định</option><option value="deposit">Rà soát trước đặt cọc</option><option value="loan">Rà soát đề nghị vay</option></select></label>
    <label><input required name="consent" type="checkbox"/> Tôi đồng ý nhận email xác nhận và thông báo khi mở dịch vụ.</label>
    <button disabled={busy} className="rounded-xl bg-blue-800 p-3 text-white">{busy?'Đang xử lý…':'Báo cho tôi khi mở gói rà soát 299.000đ'}</button><p role="status">{message}</p>
  </form>;
}
