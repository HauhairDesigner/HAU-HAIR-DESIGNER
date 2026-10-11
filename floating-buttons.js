/* H.A.U HAIR DESIGNER — Floating buttons V97 */
(function(){
  'use strict';
  function init(){
    if(document.getElementById('hauFloatWrap')) return;
    var style=document.createElement('style');
    style.id='hau-floating-v72-style';
    style.textContent=`
      #hauFloatWrap{position:fixed;right:18px;bottom:18px;z-index:99990;display:flex;flex-direction:column;align-items:flex-end;gap:12px;pointer-events:none}
      #hauFloatWrap .hau-float-item{position:relative;pointer-events:auto}
      #hauFloatWrap .hau-float-btn{position:relative;display:flex;align-items:center;justify-content:center;text-decoration:none;box-sizing:border-box;font-family:inherit;-webkit-tap-highlight-color:transparent}
      #hauFloatWrap .hau-float-close{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;border:2px solid #fff;background:#e53935;color:#fff;display:flex;align-items:center;justify-content:center;font:800 14px/1 Arial,sans-serif;padding:0;cursor:pointer;z-index:10;box-shadow:0 2px 7px rgba(0,0,0,.25)}
      #hauFloatWrap .hau-float-booking{min-width:154px;height:48px;padding:0 18px;border-radius:28px;background:#8f6a3f;color:#fff;border:1px solid rgba(255,255,255,.35);cursor:pointer;font-size:15px;font-weight:800;letter-spacing:.35px;box-shadow:0 5px 18px rgba(0,0,0,.2);animation:hauBooking72 2.8s ease-in-out infinite, hauFloatingBookingColorV97 1s steps(1,end) infinite}
      #hauFloatWrap .hau-scissor{font-size:20px;margin-right:7px}
      #hauFloatWrap .hau-float-circle{width:54px;height:54px;border-radius:50%;border:0;cursor:pointer;overflow:visible;box-shadow:0 5px 18px rgba(0,0,0,.2)}
      #hauFloatWrap .hau-float-circle:before,#hauFloatWrap .hau-float-circle:after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--ring);opacity:0;pointer-events:none;animation:hauRing72 2.4s ease-out infinite}
      #hauFloatWrap .hau-float-circle:after{animation-delay:1.2s}
      #hauFloatWrap .hau-float-zalo{background:#25d366;--ring:#25d366}
      #hauFloatWrap .hau-float-facebook{background:#1877f2;--ring:#1877f2}
      #hauFloatWrap .hau-zalo-logo{width:36px;height:36px;display:block;object-fit:contain;background:#fff;border-radius:8px;padding:3px;box-sizing:border-box;position:relative;z-index:1}
      #hauFloatWrap .hau-facebook-logo{width:31px;height:31px;display:block;position:relative;z-index:1}
      #hauFloatWrap .hau-hidden{display:none!important}
      #hauFloatWrap.hau-mobile-hidden{display:none!important}
      @keyframes hauRing72{0%{transform:scale(.92);opacity:.6}70%{transform:scale(1.55);opacity:.12}100%{transform:scale(1.78);opacity:0}}
      @keyframes hauBooking72{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
      @keyframes hauFloatingBookingColorV97{0%,49.999%{background-color:#8f6a3f}50%,100%{background-color:#2f78a8}}
      @media(max-width:767px){
        #hauFloatWrap{right:6px;bottom:10px;gap:7px}
        #hauFloatWrap .hau-float-circle{width:44px;height:44px}
        #hauFloatWrap .hau-float-close{width:17px;height:17px;top:-5px;right:-4px;font-size:12px;border-width:1.2px}
        #hauFloatWrap #hauFloatBookingItem{width:112px}
        #hauFloatWrap .hau-float-booking{width:112px;min-width:112px;height:34px;padding:0 7px;font-size:9px;letter-spacing:0;border-radius:17px;gap:2px;white-space:nowrap}
        #hauFloatWrap .hau-scissor{font-size:14px;margin-right:2px}
        #hauFloatWrap #hauFloatBookingItem .hau-float-close{width:22px;height:22px;top:-17px;right:-4px;font-size:15px;border:2px solid #fff}
        #hauFloatWrap .hau-zalo-logo{width:30px;height:30px;padding:2px;border-radius:7px}
        #hauFloatWrap .hau-facebook-logo{width:26px;height:26px}
      }
      @media(prefers-reduced-motion:reduce){#hauFloatWrap .hau-float-booking,#hauFloatWrap .hau-float-circle:before,#hauFloatWrap .hau-float-circle:after{animation:none}}
    `;
    (document.head||document.documentElement).appendChild(style);
    var w=document.createElement('div');
    w.id='hauFloatWrap';
    w.setAttribute('aria-label','Liên hệ nhanh');
    w.innerHTML=`
      <div class="hau-float-item" id="hauFloatBookingItem">
        <button class="hau-float-btn hau-float-booking" type="button"><span class="hau-scissor">✂</span>ĐẶT LỊCH NGAY</button>
        <button class="hau-float-close" type="button" aria-label="Tắt">×</button>
      </div>
      <div class="hau-float-item" id="hauFloatZaloItem">
        <a class="hau-float-btn hau-float-circle hau-float-zalo" href="https://zalo.me/84333093033" target="_blank" rel="noopener noreferrer" aria-label="Zalo">
          <img class="hau-zalo-logo" src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg?v=20261008" alt="Zalo">
        </a>
        <button class="hau-float-close" type="button" aria-label="Tắt">×</button>
      </div>
      <div class="hau-float-item" id="hauFloatFacebookItem">
        <a class="hau-float-btn hau-float-circle hau-float-facebook" href="https://www.facebook.com/hau.xavan.5/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg class="hau-facebook-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M13.65 21v-8h2.7l.4-3.12h-3.1V7.89c0-.9.25-1.51 1.55-1.51h1.66V3.59c-.29-.04-1.28-.12-2.43-.12-2.41 0-4.06 1.47-4.06 4.18v2.23H7.64V13h2.73v8h3.28Z"/></svg>
        </a>
        <button class="hau-float-close" type="button" aria-label="Tắt">×</button>
      </div>`;
    document.body.appendChild(w);
    var closes=w.querySelectorAll('.hau-float-close');
    for(var i=0;i<closes.length;i++) closes[i].addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var item=this.parentElement;if(item)item.classList.add('hau-hidden');});
    var booking=w.querySelector('.hau-float-booking');
    if(booking) booking.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      if(typeof window.openBooking==='function') window.openBooking(e);
      if(window.matchMedia && window.matchMedia('(max-width:767px)').matches) w.classList.add('hau-mobile-hidden');
    });
    window.HAUFloatingButtons={getBookingButton:function(){return booking||null},hide:function(){if(w.classList)w.classList.add('hau-mobile-hidden')},show:function(){if(w.classList)w.classList.remove('hau-mobile-hidden')},reset:function(){w.classList.remove('hau-mobile-hidden');var a=w.querySelectorAll('.hau-hidden');for(var j=0;j<a.length;j++)a[j].classList.remove('hau-hidden')}};
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
