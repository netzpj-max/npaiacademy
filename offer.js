export const OFFER_DURATION_MS=10*60*60*1000;
export function validateOffer(value){
 const start=Date.parse(value?.startsAt),end=Date.parse(value?.endsAt);
 if(!Number.isFinite(start)||!Number.isFinite(end)||end-start!==OFFER_DURATION_MS||value.earlyPrice!==990||value.regularPrice!==1990)throw Error('Invalid Academy offer');
 return {...value,start,end};
}
export function offerAt(config,now=Date.now()){
 const offer=validateOffer(config),phase=now<offer.start?'upcoming':now<offer.end?'active':'expired';
 return {phase,active:phase==='active',price:phase==='active'?offer.earlyPrice:offer.regularPrice,remainingMs:phase==='active'?Math.max(0,offer.end-now):0,endsAt:offer.endsAt,startsAt:offer.startsAt};
}
export function countdownParts(ms){const seconds=Math.max(0,Math.ceil(ms/1000));return {hours:String(Math.floor(seconds/3600)).padStart(2,'0'),minutes:String(Math.floor(seconds%3600/60)).padStart(2,'0'),seconds:String(seconds%60).padStart(2,'0')};}
