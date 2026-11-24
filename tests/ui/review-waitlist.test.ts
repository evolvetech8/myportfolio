import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/waitlist/route';
const origin='https://test.invalid';
const payload={email:'Test@Example.com',stage:'property',focus:'deposit',source:'sample',consent:true};
function submit(body:unknown){return POST(new Request(origin+'/api/waitlist',{method:'POST',headers:{origin},body:JSON.stringify(body)}));}
beforeEach(()=>{
 for(const [key,value] of Object.entries({APP_ORIGIN:origin,REVIEW_WAITLIST_ENABLED:'true',SUPABASE_URL:origin,SUPABASE_SERVICE_ROLE_KEY:'test',RESEND_API_KEY:'test',BETA_FROM_EMAIL:'test@example.com'}))vi.stubEnv(key,value);
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
it('rejects missing consent and extra financial data before storage',async()=>{
 const send=vi.fn();vi.stubGlobal('fetch',send);
 expect((await submit({...payload,consent:false})).status).toBe(400);
 expect((await submit({...payload,income:5000})).status).toBe(400);expect(send).not.toHaveBeenCalled();
});
it('only emails newly reserved subscriptions and stores token hashes',async()=>{
 const send=vi.fn().mockResolvedValueOnce(Response.json(true)).mockResolvedValueOnce(Response.json({id:'mail'})).mockResolvedValueOnce(Response.json(false));
 vi.stubGlobal('fetch',send);expect((await submit(payload)).status).toBe(200);expect((await submit(payload)).status).toBe(200);
 expect(send).toHaveBeenCalledTimes(3);
 const args=JSON.parse(send.mock.calls[0][1].body),mail=JSON.parse(send.mock.calls[1][1].body);
 expect(args.p_email).toBe('test@example.com');expect(mail.text).toContain('#confirm=');expect(mail.text).not.toContain(args.p_confirm);
});
it('releases failed deliveries for retry and returns an error',async()=>{
 const send=vi.fn().mockResolvedValueOnce(Response.json(true)).mockResolvedValueOnce(new Response('',{status:500})).mockResolvedValueOnce(Response.json(true));vi.stubGlobal('fetch',send);
 expect((await submit(payload)).status).toBe(503);expect(JSON.parse(send.mock.calls[2][1].body).p_action).toBe('delivery_failed');
});
