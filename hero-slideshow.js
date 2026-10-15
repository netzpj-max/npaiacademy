const carousel=document.querySelector('[data-hero-slideshow]');
if(carousel){
 const slides=[...carousel.querySelectorAll('[data-showcase-slide]')],dots=[...carousel.querySelectorAll('[data-showcase-dot]')],title=carousel.querySelector('[data-showcase-title]'),description=carousel.querySelector('[data-showcase-description]'),counter=carousel.querySelector('[data-showcase-counter]'),pause=carousel.querySelector('[data-showcase-pause]'),expand=carousel.querySelector('[data-showcase-expand]'),dialog=document.getElementById('heroImageDialog'),fullImage=dialog.querySelector('img'),dialogTitle=dialog.querySelector('[data-showcase-dialog-title]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,paused=motion.matches,timer=null,interacting=false,explicitPlaying=false;
 function stop(){clearInterval(timer);timer=null;}
 function start(){stop();if(!paused&&!document.hidden&&(!interacting||explicitPlaying)&&!dialog.open)timer=setInterval(()=>show((index+1)%slides.length,false),7000);}
 function pauseLabel(){pause.textContent=paused?'เล่นสไลด์':'หยุดสไลด์';pause.setAttribute('aria-pressed',String(paused));}
 function show(next,manual=true){
  index=(next+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.hidden=i!==index);
  dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));
  title.textContent=slides[index].dataset.title;description.textContent=slides[index].dataset.description;counter.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  if(manual){paused=true;explicitPlaying=false;pauseLabel();start();}
 }
 carousel.querySelector('[data-showcase-prev]').addEventListener('click',()=>show(index-1));
 carousel.querySelector('[data-showcase-next]').addEventListener('click',()=>show(index+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
 pause.addEventListener('click',()=>{paused=!paused;explicitPlaying=!paused;pauseLabel();start();});
 carousel.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowLeft'?-1:1));}});
 carousel.addEventListener('pointerenter',()=>{interacting=true;stop();});
 carousel.addEventListener('pointerleave',()=>{interacting=carousel.contains(document.activeElement);start();});
 carousel.addEventListener('focusin',()=>{interacting=true;stop();});
 carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){interacting=false;start();}});
 document.addEventListener('visibilitychange',start);
 motion.addEventListener('change',event=>{if(event.matches){paused=true;pauseLabel();start();}});
 expand.addEventListener('click',()=>{const image=slides[index].querySelector('img');fullImage.src=image.dataset.fullSrc||image.src;fullImage.alt=image.alt;dialogTitle.textContent=slides[index].dataset.title;dialog.showModal();document.body.classList.add('modal-open');stop();});
 dialog.querySelector('[data-showcase-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');expand.focus();start();});
 carousel.querySelector('[data-showcase-controls]').hidden=false;expand.hidden=false;pauseLabel();show(0,false);start();
}
