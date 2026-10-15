import {offerAt,countdownParts,validateOffer} from './offer.js';

const $=id=>document.getElementById(id),dialog=$('bookingDialog'),form=$('bookingForm');
const money=amount=>amount.toLocaleString('en-US');
const dateLabel=value=>new Intl.DateTimeFormat('th-TH',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Bangkok',hour12:false}).format(new Date(value))+' น. กรุงเทพฯ';
const limit=10*1024*1024,allowed=new Set(['image/jpeg','image/png','image/webp','application/pdf']);
let config=null,lastPhase=null,slipUrl=null,opener=null;
function error(message){$('formError').textContent=message;$('formError').hidden=!message;}
function clearSlip(){if(slipUrl)URL.revokeObjectURL(slipUrl);slipUrl=null;$('slipPreview').hidden=true;$('slipPreview').removeAttribute('src');}
function invalidate(){if(!$('messengerHandoff').hidden){$('messengerHandoff').hidden=true;$('bookingMessage').value='';$('copyStatus').textContent='';}}
function syncOffer(){
 if(!config)return null;
 const current=offerAt(config),parts=countdownParts(current.remainingMs),changed=lastPhase!==null&&lastPhase!==current.phase;
 if(lastPhase!==current.phase){
  document.querySelectorAll('[data-offer-price]').forEach(el=>el.textContent=money(current.price)+(el.hasAttribute('data-currency')?' บาท':''));
  document.querySelectorAll('[data-payment-amount]').forEach(el=>el.textContent=money(current.price)+'.00 บาท');
  document.querySelectorAll('[data-early-only]').forEach(el=>el.hidden=!current.active);
  document.querySelectorAll('[data-regular-only]').forEach(el=>el.hidden=current.active);
  document.querySelectorAll('[data-early-payment]').forEach(el=>el.hidden=!current.active);
  document.querySelectorAll('[data-regular-payment]').forEach(el=>el.hidden=current.active);
  document.querySelectorAll('[data-offer-tag]').forEach(el=>el.textContent=current.active?'EARLY BIRD · ประหยัด 1,000 บาท':'ACADEMY PASS · ราคาปกติ');
  document.querySelectorAll('[data-book]').forEach(button=>{button.disabled=false;button.querySelector('[data-book-label]').textContent=button.hasAttribute('data-book-compact')?'สมัครเรียน':'สมัครเรียน '+money(current.price)+' บาท';});
  $('bookingTitle').textContent=current.active?'สมัครเรียนราคา Early Bird':'สมัครเรียน NPAi Academy';
  document.querySelectorAll('[data-countdown]').forEach(el=>{el.classList.toggle('expired',!current.active);el.querySelector('[data-countdown-title]').textContent=current.active?'ราคา 990 บาท เหลือเวลาอีก':current.phase==='expired'?'สิ้นสุดราคา Early Bird แล้ว':'โปรโมชั่นยังไม่เริ่ม';el.querySelector('[data-offer-end]').textContent=(current.phase==='upcoming'?'เริ่ม ':'สิ้นสุด ')+dateLabel(current.phase==='upcoming'?current.startsAt:current.endsAt)+(current.active?' · จากนั้น 1,990 บาท':' · ราคาปกติ 1,990 บาท');});
  if(changed){invalidate();if(dialog.open){$('bookingPriceChange').hidden=false;$('bookingPriceChange').textContent='ราคา Early Bird สิ้นสุดแล้ว ยอดสมัครปัจจุบัน 1,990 บาท หากชำระ 990 บาทก่อนหมดเวลา ให้ติดต่อผู้สอนพร้อมสลิปเพื่อตรวจเวลาชำระ';}}
  lastPhase=current.phase;
 }
 document.querySelectorAll('[data-countdown]').forEach(el=>{el.querySelector('[data-hours]').textContent=parts.hours;el.querySelector('[data-minutes]').textContent=parts.minutes;el.querySelector('[data-seconds]').textContent=parts.seconds;el.querySelector('[role=timer]').setAttribute('aria-label','เหลือ '+parts.hours+' ชั่วโมง '+parts.minutes+' นาที '+parts.seconds+' วินาที');});
 document.querySelectorAll('[data-mobile-offer]').forEach(el=>el.textContent=current.active?'Early Bird · '+parts.hours+':'+parts.minutes+':'+parts.seconds:'ราคาปกติ · สมัครครั้งเดียว');
 return current;
}
document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>{if(!syncOffer())return;opener=button;$('bookingPriceChange').hidden=true;dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}));
$('closeBooking').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');form.reset();clearSlip();invalidate();error('');$('bookingPriceChange').hidden=true;$('slipState').textContent='เลือกภาพหรือ PDF ไม่เกิน 10 MB';if(opener)opener.focus();});
form.addEventListener('input',invalidate);
$('paymentSlip').addEventListener('change',()=>{invalidate();clearSlip();error('');const file=$('paymentSlip').files[0];if(!file){$('slipState').textContent='เลือกภาพหรือ PDF ไม่เกิน 10 MB';return;}if(!allowed.has(file.type)||file.size>limit){$('paymentSlip').value='';$('slipState').textContent='เลือกภาพหรือ PDF ไม่เกิน 10 MB';error('กรุณาเลือกไฟล์ JPG, PNG, WebP หรือ PDF ขนาดไม่เกิน 10 MB');return;}$('slipState').textContent=`เลือกแล้ว: ${file.name} (${(file.size/1024).toFixed(0)} KB) · ยังไม่ได้ส่ง`;if(file.type.startsWith('image/')){slipUrl=URL.createObjectURL(file);$('slipPreview').src=slipUrl;$('slipPreview').hidden=false;}});
async function copy(){syncOffer();const value=$('bookingMessage').value;if(!value)return false;let success=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);success=true;}}catch{}if(!success){$('bookingMessage').focus();$('bookingMessage').select();try{success=document.execCommand('copy');}catch{}}$('copyStatus').textContent=success?'คัดลอกแล้ว · เปิด Messenger วางข้อความ และแนบสลิป':'คัดลอกอัตโนมัติไม่ได้ · เลือกข้อความด้านบนแล้วคัดลอกเอง';return success;}
form.addEventListener('submit',async event=>{
 event.preventDefault();error('');const offer=syncOffer();if(!offer){error('ยังตรวจราคาปัจจุบันไม่ได้ กรุณารีเฟรชหน้าเว็บ');return;}if(!form.reportValidity())return;
 const name=$('studentName').value.trim(),email=$('studentEmail').value.trim(),phone=$('studentPhone').value.trim(),file=$('paymentSlip').files[0];
 if(!name){error('กรุณากรอกชื่อ–นามสกุล');$('studentName').focus();return;}
 const digits=phone.replace(/[^0-9]/g,'');if(digits.length<9||digits.length>15||!/^[+0-9 ()-]+$/.test(phone)){error('กรุณาตรวจเบอร์โทรให้ถูกต้อง');$('studentPhone').focus();return;}
 if(!file||!allowed.has(file.type)||file.size>limit){error('กรุณาเลือกสลิป JPG, PNG, WebP หรือ PDF ไม่เกิน 10 MB');return;}
 $('bookingMessage').value=`สมัคร NPAi Academy — ${offer.active?'Early Bird':'ราคาปกติ'} ${money(offer.price)} บาท\nสมัครครั้งเดียว เข้าถึงทุกคอร์สใน Academy เมื่อเปิดสอน\nเปิดเรียนแล้ว: 2D CAD และ BIM 4D / Web Viewer\n\nชื่อ–นามสกุล: ${name}\nอีเมล: ${email}\nเบอร์โทร: ${phone}\nยอดชำระที่แจ้ง: ${money(offer.price)} บาท ผ่าน PromptPay\nสลิป: ${file.name} (จะแนบในแชต)\n\nสิ้นสุดราคา Early Bird: ${dateLabel(offer.endsAt)}\nรบกวนตรวจยอดและเวลาชำระจากสลิป\nโบนัส: 200 เครดิต NPAiRENDER ตามการตรวจและเปิดสิทธิ์\nคอร์ส Coming Soon จะทยอยเปิดภายหลัง\nยินยอมใช้ข้อมูลเพื่อยืนยันการสมัครและจัดการบัญชี/สิทธิ์ NPAiRENDER\nรบกวนตรวจสลิปและเปิดสิทธิ์ Academy ให้ด้วยครับ/ค่ะ`;
 $('messengerHandoff').hidden=false;await copy();$('messengerHandoff').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
});
$('copyBooking').addEventListener('click',copy);
try{const response=await fetch(new URL('./offer.json',import.meta.url),{cache:'no-store'});if(!response.ok)throw Error('Offer unavailable');config=await response.json();validateOffer(config);syncOffer();setInterval(syncOffer,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncOffer();});}catch{config=null;document.querySelectorAll('[data-countdown]').forEach(el=>{el.classList.add('expired');el.querySelector('[data-countdown-title]').textContent='ยังตรวจราคาโปรโมชั่นไม่ได้';el.querySelector('[data-offer-end]').textContent='กรุณารีเฟรชหน้าเว็บ หรือติดต่อผู้สอนเพื่อตรวจราคา';});}
