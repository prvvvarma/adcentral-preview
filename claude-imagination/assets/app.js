/* AdCentral - Claude Imagination edition - shared interactions */
(function(){
  // nav scroll shadow
  var nav=document.getElementById('nav');
  if(nav){addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});}
  // mobile nav
  var b=document.getElementById('burger'),m=document.getElementById('mnav');
  if(b&&m){
    b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded',false)})});
  }
  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.r').forEach(function(el){io.observe(el)});
  // hero carousel
  var card=document.getElementById('heroCard');
  if(card){
    var slides=card.querySelectorAll('.slide'),dots=document.getElementById('heroDots').children,i=0;
    function go(n){slides[i].classList.remove('active');dots[i].classList.remove('on');i=(n+slides.length)%slides.length;slides[i].classList.add('active');dots[i].classList.add('on')}
    for(var d=0;d<dots.length;d++){(function(x){dots[x].addEventListener('click',function(){go(x)})})(d)}
    setInterval(function(){go(i+1)},5000);
  }
  // count-up stats
  var statsEl=document.getElementById('stats'),done=false;
  function counts(){
    if(!statsEl||done)return;var r=statsEl.getBoundingClientRect();if(r.top>innerHeight-80)return;done=true;
    statsEl.querySelectorAll('[data-count]').forEach(function(el){
      var target=+el.getAttribute('data-count'),u=el.querySelector('.u'),us=u?u.outerHTML:'',t0=null;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1100,1),v=Math.round(target*(1-Math.pow(1-p,3)));el.innerHTML=v+us;if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    });
  }
  if(statsEl){addEventListener('scroll',counts,{passive:true});counts();}
  // FAQ accordion
  document.querySelectorAll('.faq-item .faq-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.closest('.faq-item'),open=item.classList.contains('open');
      item.closest('.faq').querySelectorAll('.faq-item').forEach(function(x){x.classList.remove('open')});
      if(!open)item.classList.add('open');
    });
  });
})();
