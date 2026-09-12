import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer,validate} from './server.js';
const valid={fullName:'Test User',email:'user@example.com',requester:'self',scope:'all',confirmationName:'Test User',date:'2026-09-12',confirmed:true};
test('validates identity, scope, confirmation, and dates',()=>{
 assert.equal(validate(valid),undefined);
 for(const patch of [{confirmed:false},{email:'bad'},{requester:'representative'},{scope:'specific'},{date:'2026-02-31'},{fullName:' '},{locationInfo:'x'.repeat(4001)}]) assert.ok(validate({...valid,...patch}));
 assert.equal(validate({...valid,requester:'representative',subjectName:'Person',subjectEmail:'person@example.com',relationship:'Agent',scope:'specific',details:'Exercise history'}),undefined);
});
async function fixture(t,overrides={}) {
 const sent=[];
 const server=createServer({env:{PUBLIC_ORIGIN:'https://rehab.example',RESEND_API_KEY:'test',MAIL_FROM:'RehabAI <privacy@example.com>',NOTIFICATION_EMAIL:'codyli9219@gmail.com',...overrides.env},send:async(url,options)=>{sent.push(JSON.parse(options.body));return overrides.response || new Response(JSON.stringify({id:'test-id'}),{status:200});}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const url=`http://127.0.0.1:${server.address().port}`;
 const post=(data=valid,origin='https://rehab.example')=>fetch(url+'/api/erasure',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 return {post,sent,url};
}
test('sends one plain-text notification to configured recipient',async t=>{
 const {post,sent}=await fixture(t);assert.equal((await post()).status,200);assert.equal(sent.length,1);assert.deepEqual(sent[0].to,['codyli9219@gmail.com']);assert.equal(sent[0].reply_to,'user@example.com');assert.match(sent[0].text,/Full name: Test User/);
});
test('rejects invalid data and cross-origin submissions without email',async t=>{
 const {post,sent}=await fixture(t);assert.equal((await post({...valid,confirmed:false})).status,400);assert.equal((await post(valid,'https://other.example')).status,403);assert.equal((await post({...valid,website:'bot'})).status,400);assert.equal(sent.length,0);
});
test('reports provider failure instead of success',async t=>{
 const {post}=await fixture(t,{response:new Response('{}',{status:500})});assert.equal((await post()).status,502);
});
test('missing credentials return actionable failure',async t=>{
 const {post,sent}=await fixture(t,{env:{RESEND_API_KEY:''}});assert.equal((await post()).status,503);assert.equal(sent.length,0);
});
test('serves pages, protects private files, and rate limits',async t=>{
 const {post,url}=await fixture(t);
 for(const path of ['/','/privacy.html','/erasure.html']) assert.equal((await fetch(url+path)).status,200);
 for(const path of ['/.env','/server.js','/package.json']) assert.equal((await fetch(url+path)).status,404);
 for(let i=0;i<10;i++) await post({...valid,confirmed:false});
 assert.equal((await post()).status,429);
});
