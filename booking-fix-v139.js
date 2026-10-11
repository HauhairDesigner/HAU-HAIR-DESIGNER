/* H.A.U BOOKING FIX V139
   Exact 1-step time picker for PC + Mobile.
   Native wheel/touch scrolling is intentionally disabled so one gesture = exactly one hour/minute.
*/
(function(){
  'use strict';
  function init(){
    const input=document.getElementById('bookingTime');
    const picker=document.getElementById('hauTimePicker');
    const hw=document.getElementById('hauHourWheel');
    const mw=document.getElementById('hauMinuteWheel');
    const preview=document.getElementById('hauTimePreview');
    const note=document.getElementById('hauTimeNote');
    const dateInput=document.getElementById('bookingDate');
    if(!input||!picker||!hw||!mw) return;
    if(window.__hauTimePickerV139) return;
    window.__hauTimePickerV139=true;

    const pad=n=>String(n).padStart(2,'0');
    let hour=0, minute=0;
    let gestureLock={hour:false,minute:false};

    function vnNow(){
      const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(new Date());
      const get=k=>Number(parts.find(p=>p.type===k)?.value||0);
      return {year:get('year'),month:get('month'),day:get('day'),hour:get('hour'),minute:get('minute')};
    }
    function todayISO(){const n=vnNow();return `${n.year}-${pad(n.month)}-${pad(n.day)}`;}
    function selectedDate(){return dateInput?.value||'';}
    function nowMinutes(){const n=vnNow();return n.hour*60+n.minute;}
    function valid(h,m){
      const d=selectedDate();
      if(!d) return true;
      if(d<todayISO()) return false;
      if(d===todayISO() && h*60+m<=nowMinutes()) return false;
      return true;
    }
    function validHour(h){
      const d=selectedDate();
      return !(d===todayISO() && h*60+59<=nowMinutes());
    }
    function validMinute(m){
      const d=selectedDate();
      return !(d===todayISO() && hour*60+m<=nowMinutes());
    }

    function makeItem(value,type){
      const el=document.createElement('div');
      el.className='hau-wheel-item';
      el.dataset.value=String(value);
      el.dataset.type=type;
      el.setAttribute('role','option');
      el.textContent=pad(value);
      return el;
    }
    function buildWheel(wheel,count,type){
      wheel.innerHTML='';
      const top=document.createElement('div');
      top.className='hau-wheel-spacer';
      wheel.appendChild(top);
      for(let i=0;i<count;i++) wheel.appendChild(makeItem(i,type));
      const bottom=document.createElement('div');
      bottom.className='hau-wheel-spacer';
      wheel.appendChild(bottom);
    }

    function paint(){
      hw.querySelectorAll('.hau-wheel-item').forEach(el=>{
        const v=Number(el.dataset.value);
        el.classList.toggle('active',v===hour);
        el.classList.toggle('disabled',!validHour(v));
        el.setAttribute('aria-selected',v===hour?'true':'false');
      });
      mw.querySelectorAll('.hau-wheel-item').forEach(el=>{
        const v=Number(el.dataset.value);
        el.classList.toggle('active',v===minute);
        el.classList.toggle('disabled',!validMinute(v));
        el.setAttribute('aria-selected',v===minute?'true':'false');
      });
      if(preview) preview.textContent=pad(hour)+' : '+pad(minute);
      if(note){
        if(!selectedDate()) note.textContent='Vui lòng chọn ngày trước. Bạn có thể cuộn từng giờ và từng phút.';
        else if(!valid(hour,minute)) note.textContent='⚠️ Thời gian đã qua. Vui lòng chọn thời gian muộn hơn.';
        else note.textContent='Cuộn từng bước chính xác 1 giờ hoặc 1 phút để chọn.';
      }
    }

    function scrollToValue(wheel,value){
      const el=[...wheel.querySelectorAll('.hau-wheel-item')].find(x=>Number(x.dataset.value)===Number(value));
      if(!el) return;
      const top=el.offsetTop-(wheel.clientHeight-el.offsetHeight)/2;
      wheel.scrollTop=Math.max(0,top);
    }
    function sync(){
      scrollToValue(hw,hour);
      scrollToValue(mw,minute);
      paint();
    }
    function firstValidMinute(){
      for(let m=0;m<60;m++) if(validMinute(m)) return m;
      return 59;
    }
    function clampSelection(){
      if(!valid(hour,minute)){
        for(let h=0;h<24;h++){
          for(let m=0;m<60;m++){
            if(valid(h,m)){hour=h;minute=m;return;}
          }
        }
      }
    }
    function setValue(type,next){
      if(type==='hour'){
        let v=Math.max(0,Math.min(23,next));
        if(!validHour(v)){
          const dir=v>=hour?1:-1;
          while(v>=0&&v<=23&&!validHour(v)) v+=dir;
          if(v<0||v>23) return;
        }
        hour=v;
        if(!valid(hour,minute)) minute=firstValidMinute();
      }else{
        let v=Math.max(0,Math.min(59,next));
        if(!validMinute(v)){
          const dir=v>=minute?1:-1;
          while(v>=0&&v<=59&&!validMinute(v)) v+=dir;
          if(v<0||v>59) return;
        }
        minute=v;
        if(!valid(hour,minute)) clampSelection();
      }
      sync();
    }

    function bindWheel(wheel,type,count){
      /* PC + Mobile: click/tap trực tiếp vào đúng số để chọn ngay.
         Không chặn click bằng pointerdown/capture để trình duyệt PC phát sinh click bình thường. */
      wheel.addEventListener('click',function(e){
        const item=e.target.closest('.hau-wheel-item');
        if(!item || !wheel.contains(item)) return;
        const v=Number(item.dataset.value);
        if(Number.isNaN(v) || item.classList.contains('disabled')) return;
        setValue(type,v);
      },false);

      /* PC mouse wheel / trackpad: mỗi bước thay đổi đúng 1 giờ hoặc 1 phút. */
      let wheelAccum=0;
      let wheelReset=null;
      wheel.addEventListener('wheel',function(e){
        e.preventDefault();
        const raw=e.deltaY;
        if(!raw) return;
        wheelAccum += raw;
        const threshold = e.deltaMode===1 ? 1 : 60;
        if(Math.abs(wheelAccum) >= threshold){
          const dir=wheelAccum>0 ? 1 : -1;
          wheelAccum=0;
          setValue(type,(type==='hour'?hour:minute)+dir);
        }
        clearTimeout(wheelReset);
        wheelReset=setTimeout(()=>{wheelAccum=0;},160);
      },{passive:false});

      /* Mobile swipe + PC mouse-drag: mỗi gesture hoàn tất = đúng 1 bước. */
      let downY=null, downX=null, dragging=false, pointerId=null;
      wheel.addEventListener('pointerdown',function(e){
        if(e.pointerType==='mouse' && e.button!==0) return;
        downY=e.clientY;
        downX=e.clientX;
        dragging=false;
        pointerId=e.pointerId;
      },{passive:true});

      wheel.addEventListener('pointermove',function(e){
        if(downY===null || e.pointerId!==pointerId) return;
        const dy=e.clientY-downY;
        if(Math.abs(dy)>10){
          dragging=true;
          try{wheel.setPointerCapture(pointerId);}catch(_){ }
          e.preventDefault();
        }
      },{passive:false});

      wheel.addEventListener('pointerup',function(e){
        if(downY===null || e.pointerId!==pointerId) return;
        const dy=e.clientY-downY;
        const wasDrag=dragging;
        downY=null;
        downX=null;
        dragging=false;
        pointerId=null;
        if(wasDrag && Math.abs(dy)>10){
          setValue(type,(type==='hour'?hour:minute)+(dy<0?1:-1));
          e.preventDefault();
        }
      },{passive:false});

      wheel.addEventListener('pointercancel',function(){
        downY=null;downX=null;dragging=false;pointerId=null;
      },{passive:true});

      wheel.addEventListener('keydown',function(e){
        if(e.key==='ArrowDown'){e.preventDefault();setValue(type,(type==='hour'?hour:minute)+1);}
        else if(e.key==='ArrowUp'){e.preventDefault();setValue(type,(type==='hour'?hour:minute)-1);}
        else if(e.key==='PageDown'){e.preventDefault();setValue(type,(type==='hour'?hour:minute)+5);}
        else if(e.key==='PageUp'){e.preventDefault();setValue(type,(type==='hour'?hour:minute)-5);}
        else if(e.key==='Enter'){
          const item=document.activeElement?.closest('.hau-wheel-item');
          if(item) setValue(type,Number(item.dataset.value));
        }
      });
    }

    function build(){
      buildWheel(hw,24,'hour');
      buildWheel(mw,60,'minute');
      bindWheel(hw,'hour',24);
      bindWheel(mw,'minute',60);
      hw.tabIndex=0; mw.tabIndex=0;
    }

    function initialTime(){
      const val=input.value||'';
      if(/^\d{2}:\d{2}$/.test(val)){
        [hour,minute]=val.split(':').map(Number);
        clampSelection();
        return;
      }
      const n=vnNow();
      hour=n.hour; minute=n.minute+1;
      if(minute>59){hour++;minute=0;}
      if(hour>23){hour=23;minute=59;}
      clampSelection();
    }
    function openPicker(e){
      if(e){e.preventDefault();e.stopImmediatePropagation();}
      initialTime();
      build();
      picker.classList.add('show');
      picker.setAttribute('aria-hidden','false');
      document.body.classList.add('hau-time-open');
      requestAnimationFrame(()=>{sync();paint();});
    }
    function closePicker(){
      picker.classList.remove('show');
      picker.setAttribute('aria-hidden','true');
      document.body.classList.remove('hau-time-open');
    }
    function done(){
      clampSelection();
      sync();
      if(!valid(hour,minute)) return;
      input.value=pad(hour)+':'+pad(minute);
      input.dispatchEvent(new Event('change',{bubbles:true}));
      closePicker();
    }

    input.addEventListener('click',openPicker,true);
    input.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openPicker(e);}
    });
    const close=document.getElementById('hauTimeClose');
    const cancel=document.getElementById('hauTimeCancel');
    const doneBtn=document.getElementById('hauTimeDone');
    if(close) close.onclick=closePicker;
    if(cancel) cancel.onclick=closePicker;
    if(doneBtn) doneBtn.onclick=done;
    picker.addEventListener('click',e=>{if(e.target===picker)closePicker();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&picker.classList.contains('show'))closePicker();});
    if(dateInput) dateInput.addEventListener('change',()=>{if(picker.classList.contains('show')){clampSelection();sync();}});

    const noteField=document.getElementById('customerNote')?.closest('.booking-field');
    if(noteField) noteField.classList.add('hau-note-full-row');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
