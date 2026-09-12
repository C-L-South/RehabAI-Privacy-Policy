import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validate(data) {
  if (!data || Array.isArray(data) || typeof data !== 'object') return 'Invalid request.';
  for (const [key,value] of Object.entries(data)) {
    if (key === 'confirmed') continue;
    if (typeof value !== 'string' || value.length > (['details','locationInfo'].includes(key) ? 4000 : 200)) return 'Some information is too long or invalid.';
  }
  for (const key of ['fullName','email','confirmationName','date']) if (!data[key]?.trim()) return 'Please complete all required fields.';
  if (!emailPattern.test(data.email) || /[\r\n]/.test(data.email)) return 'Please enter a valid email address.';
  if (!['self','representative'].includes(data.requester) || !['all','specific'].includes(data.scope)) return 'Please select a request type and deletion scope.';
  if (data.requester === 'representative' && (!data.subjectName?.trim() || !data.relationship?.trim() || !emailPattern.test(data.subjectEmail || ''))) return 'Please complete the representative information.';
  if (data.scope === 'specific' && !data.details?.trim()) return 'Please describe the data you want deleted.';
  if (data.confirmed !== true) return 'Please confirm that the information is accurate.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0,10) !== data.date) return 'Please enter a valid date.';
}
export function createServer({env=process.env,send=fetch}={}) {
  const attempts = new Map();
  const allowed = new Map([['/','index.html'],['/index.html','index.html'],['/privacy.html','privacy.html'],['/erasure.html','erasure.html'],['/styles.css','styles.css'],['/form.js','form.js']]);
  return http.createServer(async (req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    const json = (code,data) => {res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
    const path = new URL(req.url,'http://localhost').pathname;
    if (path !== '/api/erasure') {
      if (!['GET','HEAD'].includes(req.method)) return json(405,{error:'Method not allowed.'});
      if (!allowed.has(path)) return json(404,{error:'Not found.'});
      try {
        const file = allowed.get(path);
        const content = await readFile(new URL(file,import.meta.url));
        res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html; charset=utf-8');
        return res.end(req.method === 'HEAD' ? undefined : content);
      } catch {return json(500,{error:'Page unavailable.'});}
    }
    if (req.method !== 'POST') return json(405,{error:'Method not allowed.'});
    if (req.headers.origin !== env.PUBLIC_ORIGIN) return json(403,{error:'Please submit the form from the RehabAI website.'});
    if (!req.headers['content-type']?.startsWith('application/json')) return json(415,{error:'Expected JSON.'});
    const now = Date.now();
    for (const [key,item] of attempts) if (item.expires < now) attempts.delete(key);
    // Do not trust caller-controlled forwarding headers. Add edge rate limiting for proxied deployments.
    const key = req.socket.remoteAddress;
    const item = attempts.get(key) || {count:0,expires:now+600000};
    if (++item.count > 10) {res.setHeader('Retry-After','600');return json(429,{error:'Too many attempts. Please wait 10 minutes or email codyli9219@gmail.com.'});}
    attempts.set(key,item);
    let raw = '';
    try {
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 20000) return json(413,{error:'Request is too large.'});
      }
      const data = JSON.parse(raw);
      const error = validate(data);
      if (error) return json(400,{error});
      if (data.website) return json(400,{error:'Unable to submit this request.'});
      if (!env.RESEND_API_KEY || !env.MAIL_FROM || !emailPattern.test(env.NOTIFICATION_EMAIL || '')) return json(503,{error:'The form is temporarily unavailable. Please email your request to codyli9219@gmail.com.'});
      const labels = {fullName:'Full name',email:'Account email',accountId:'Account ID',phone:'Telephone',requester:'Requested by',subjectName:'Represented person',subjectEmail:'Their account email',relationship:'Relationship',scope:'Deletion scope',details:'Specific data',locationInfo:'Additional information',confirmationName:'Confirmed by',date:'Date'};
      const text = 'RehabAI — right to erasure request\n\n'+Object.entries(labels).filter(([key])=>data[key] && (data.requester === 'representative' || !['subjectName','subjectEmail','relationship'].includes(key)) && (data.scope === 'specific' || key !== 'details')).map(([key,label])=>`${label}: ${data[key]}`).join('\n\n')+'\n\nAccuracy and authority confirmed: Yes\nThis request requires review and identity verification; no data has been deleted.';
      const response = await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.MAIL_FROM,to:[env.NOTIFICATION_EMAIL],reply_to:data.email,subject:'RehabAI: new erasure request',text}),signal:AbortSignal.timeout(12000)});
      if (!response.ok) return json(502,{error:'Your request could not be sent. Please try again or email codyli9219@gmail.com.'});
      const result = await response.json();
      if (!result.id) return json(502,{error:'Delivery could not be confirmed. Please email codyli9219@gmail.com.'});
      return json(200,{ok:true});
    } catch (error) {
      return json(error instanceof SyntaxError ? 400 : 502,{error:error instanceof SyntaxError ? 'Invalid request data.' : 'Delivery could not be confirmed. Please try again or email codyli9219@gmail.com.'});
    }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) createServer().listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('RehabAI server started.'));
