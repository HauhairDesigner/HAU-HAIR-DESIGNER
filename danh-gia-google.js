(function(){
  'use strict';

  var section = document.getElementById('hau-customer-reviews');
  var track = document.getElementById('hauReviewsTrack');
  var viewport = section && section.querySelector('.hau-reviews-viewport');
  if (!section || !track || !viewport) return;

  var timer = null;
  var refreshTimer = null;
  var current = 0;
  var signature = '';
  var shuffledOnce = false;
  var groupsCache = [];

  // Swipe / mouse-drag state
  var dragging = false;
  var startX = 0;
  var startY = 0;
  var lastX = 0;
  var moved = false;

  function isMobile(){ return window.matchMedia('(max-width: 768px)').matches; }

  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  function groupImages(images, count){
    if (!images.length) return [];
    var groups = [];
    var step = count;
    var groupCount = Math.max(1, Math.ceil(images.length / step));
    for (var g=0; g<groupCount; g++){
      var group=[];
      for (var i=0; i<count; i++){
        group.push(images[(g*step+i) % images.length]);
      }
      groups.push(group);
    }
    return groups;
  }

  function showEmpty(){
    track.innerHTML = '<div class="hau-review-slide"><div class="hau-review-empty">Chưa có hình đánh giá.</div></div>';
    track.style.transform='translateX(0)';
    groupsCache=[];
  }

  function render(images, preserve){
    var mobile=isMobile();
    var count=mobile?1:3;
    var groups=groupImages(images,count);
    groupsCache=groups;
    if(!groups.length){
      stop();
      showEmpty();
      return;
    }

    var max=groups.length;
    if(!preserve || current>=max) current=0;

    track.innerHTML='';
    groups.forEach(function(group){
      var slide=document.createElement('div');
      slide.className='hau-review-slide';
      group.forEach(function(src){
        var card=document.createElement('div');
        card.className='hau-review-card';
        var img=document.createElement('img');
        img.src=src + (src.indexOf('?')===-1?'?v='+Date.now():'&v='+Date.now());
        img.alt='Hình ảnh khách hàng đánh giá H.A.U HAIR DESIGNER';
        img.loading='eager';
        img.decoding='sync';
        if (groups.indexOf(group) === 0) img.fetchPriority='high';
        card.appendChild(img);
        slide.appendChild(card);
      });
      track.appendChild(slide);
    });

    track.style.transition='none';
    track.style.transform='translateX(-'+(current*100)+'%)';
    requestAnimationFrame(function(){ track.style.transition='transform .72s cubic-bezier(.22,.61,.36,1)'; });
    restart(groups.length);
  }

  function stop(){
    if(timer){clearInterval(timer);timer=null;}
  }

  function goTo(next, animate){
    if(!groupsCache.length) return;
    current=(next + groupsCache.length) % groupsCache.length;
    if(animate === false) track.style.transition='none';
    else track.style.transition='transform .72s cubic-bezier(.22,.61,.36,1)';
    track.style.transform='translateX(-'+(current*100)+'%)';
  }

  function restart(total){
    stop();
    if(total<=1) return;
    timer=setInterval(function(){ goTo(current+1, true); },3000);
  }

  function resetAutoplay(){
    if(groupsCache.length>1) restart(groupsCache.length);
  }

  function loadImages(preserve){
    fetch('danh-gia-google.php?v='+Date.now(),{cache:'no-store'})
      .then(function(r){if(!r.ok) throw new Error('HTTP '+r.status);return r.json();})
      .then(function(images){
        if(!Array.isArray(images)) images=[];
        var sig=images.join('|')+'|'+(isMobile()?'m':'p');
        if(sig!==signature || !preserve){
          signature=sig;
          // Randomize once every page entry. If the folder changes later,
          // reshuffle so newly added/removed images are included naturally.
          var ordered=shuffle(images);
          current=0;
          shuffledOnce=true;
          render(ordered,false);
        }
      })
      .catch(function(err){
        console.error('H.A.U customer reviews:',err);
        if(!track.children.length) showEmpty();
      });
  }

  // Touch / mouse swipe: left = next, right = previous.
  viewport.addEventListener('pointerdown', function(e){
    if(e.pointerType==='mouse' && e.button!==0) return;
    dragging=true;
    moved=false;
    startX=lastX=e.clientX;
    startY=e.clientY;
    track.style.transition='none';
    if(viewport.setPointerCapture) {
      try{ viewport.setPointerCapture(e.pointerId); }catch(_){ }
    }
  });

  viewport.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var dx=e.clientX-startX;
    var dy=e.clientY-startY;
    lastX=e.clientX;
    if(Math.abs(dx)>8 && Math.abs(dx)>Math.abs(dy)){
      moved=true;
      // Keep vertical page scrolling natural; only visually drag horizontally.
      var width=viewport.clientWidth||1;
      var base=-(current*100);
      var dragPct=(dx/width)*100;
      track.style.transform='translateX('+(base+dragPct)+'%)';
    }
  });

  function endPointer(e){
    if(!dragging) return;
    dragging=false;
    var dx=e.clientX-startX;
    var dy=e.clientY-startY;
    var width=viewport.clientWidth||1;
    var threshold=Math.max(45,width*0.10);
    if(Math.abs(dx)>=threshold && Math.abs(dx)>Math.abs(dy)*1.15 && groupsCache.length>1){
      if(dx<0) goTo(current+1,true);
      else goTo(current-1,true);
      resetAutoplay();
    } else {
      goTo(current,true);
      if(moved) resetAutoplay();
    }
    if(viewport.releasePointerCapture && e.pointerId!=null){
      try{ viewport.releasePointerCapture(e.pointerId); }catch(_){ }
    }
  }

  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
  viewport.addEventListener('lostpointercapture', function(){
    if(dragging) dragging=false;
  });

  // Prevent accidental image dragging / long-press selection.
  viewport.addEventListener('dragstart', function(e){ e.preventDefault(); });

  loadImages(false);

  // Tự nhận ảnh thêm/bớt trên hosting mà không cần sửa code.
  refreshTimer=setInterval(function(){ loadImages(true); },60000);

  var lastMobile=isMobile();
  window.addEventListener('resize',function(){
    var now=isMobile();
    if(now!==lastMobile){
      lastMobile=now;
      signature='';
      loadImages(false);
    }
  });

  document.addEventListener('visibilitychange',function(){
    if(document.hidden){stop();}
    else {loadImages(true); resetAutoplay();}
  });
})();
