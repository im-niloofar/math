document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const fa = (n) => Number(n).toLocaleString('fa-IR');
  const menuToggle = $('menuToggle'), mainNav = $('mainNav');
  menuToggle?.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

  // Exponent lab
  const powerBase = $('powerBase'), powerExp = $('powerExp');
  let powerChart;
  function updatePower() {
    const b = Number(powerBase.value), n = Number(powerExp.value), result = Math.pow(b,n);
    $('powerBaseOut').textContent = fa(b); $('powerExpOut').textContent = fa(n);
    $('powerResult').textContent = `${b}^${n} = ${fa(result)}`;
    if (powerChart) {
      powerChart.data.labels = Array.from({length: 9}, (_,i) => i);
      powerChart.data.datasets[0].data = Array.from({length: 9}, (_,i) => Math.pow(b,i));
      powerChart.data.datasets[0].label = `پایه ${b}`;
      powerChart.update();
    }
  }
  powerBase.addEventListener('input', updatePower); powerExp.addEventListener('input', updatePower);
  if (window.Chart) {
    powerChart = new Chart($('powerChart'), {type:'line',data:{labels:[0,1,2,3,4,5,6,7,8],datasets:[{label:'پایه ۲',data:[1,2,4,8,16,32,64,128,256],borderColor:'#397ee8',backgroundColor:'rgba(57,126,232,.10)',fill:true,tension:.3,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{title:{display:true,text:'توان'}},y:{beginAtZero:true}}}});
    updatePower();
  }

  // Radical distance lab
  let distanceChart;
  function updateDistance() {
    const x1=Number($('x1').value)||0, y1=Number($('y1').value)||0, x2=Number($('x2').value)||0, y2=Number($('y2').value)||0;
    const dx=x2-x1, dy=y2-y1, d=Math.hypot(dx,dy);
    $('distanceResult').textContent=d.toFixed(2);
    $('distanceEquation').textContent=`√((${fa(x2)} − ${fa(x1)})² + (${fa(y2)} − ${fa(y1)})²) = ${fa(d.toFixed(2))}`;
    if(distanceChart){distanceChart.data.datasets[0].data=[{x:x1,y:y1},{x:x2,y:y2}];distanceChart.data.datasets[1].data=[{x:x1,y:y1},{x:x2,y:y2}];distanceChart.update();}
  }
  ['x1','y1','x2','y2'].forEach(id=>$(id).addEventListener('input',updateDistance));
  if(window.Chart){
    distanceChart=new Chart($('distanceChart'),{type:'scatter',data:{datasets:[{label:'نقاط',data:[{x:0,y:0},{x:3,y:4}],backgroundColor:'#8c68d8',pointRadius:6},{type:'line',label:'فاصله',data:[{x:0,y:0},{x:3,y:4}],borderColor:'#b5a0e8',borderWidth:2,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{type:'linear',position:'bottom',title:{display:true,text:'X'}},y:{title:{display:true,text:'Y'}}}}});
    updateDistance();
  }

  // Logarithm lab
  const logBase=$('logBase'), logNumber=$('logNumber');
  function updateLog(){
    const b=Number(logBase.value), x=Number(logNumber.value), y=Math.log(x)/Math.log(b);
    $('logBaseOut').textContent=fa(b);$('logNumberOut').textContent=fa(x);
    $('logResult').textContent=y.toFixed(3);
    $('logExplain').textContent=`چون ${b} به توان ${y.toFixed(3)} تقریباً برابر ${x} است، پس log_${b}(${x}) ≈ ${y.toFixed(3)}`;
  }
  logBase.addEventListener('input',updateLog);logNumber.addEventListener('input',updateLog);updateLog();

  // Small quizzes
  document.querySelectorAll('[data-quiz]').forEach(box=>{
    const buttons=box.querySelectorAll('.quiz-options button'), feedback=box.querySelector('.quiz-feedback');
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      if(box.dataset.answered) return;
      box.dataset.answered='true';
      const correct=btn.dataset.correct==='true';
      btn.classList.add(correct?'correct':'wrong');
      buttons.forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct');});
      feedback.textContent=correct?'آفرین! پاسخ درست است.':'این پاسخ درست نیست. گزینه سبزرنگ پاسخ صحیح است.';
      feedback.style.color=correct?'#18734d':'#b3433b';
    }));
  });

  // Final quiz
  const questions=[
    {q:'مقدار ۳ به توان ۲ چقدر است؟',a:['۶','۹','۱۲'],correct:1,why:'۳ × ۳ = ۹؛ توان دوم یعنی ضرب عدد در خودش.'},
    {q:'تعداد حالت‌های ممکن با ۴ بیت چندتاست؟',a:['۸','۱۶','۳۲'],correct:1,why:'هر بیت دو حالت دارد؛ پس ۲⁴ = ۱۶.'},
    {q:'ریشه دوم ۸۱ کدام است؟',a:['۷','۸','۹'],correct:2,why:'۹ × ۹ = ۸۱؛ بنابراین √۸۱ = ۹.'},
    {q:'فاصله نقطه (۰،۰) تا (۳،۴) چقدر است؟',a:['۵','۶','۷'],correct:0,why:'با قضیه فیثاغورس: √(۳² + ۴²) = √۲۵ = ۵.'},
    {q:'مقدار log₂(۱۶) چند است؟',a:['۳','۴','۸'],correct:1,why:'۲ به توان ۴ برابر ۱۶ است؛ پس لگاریتم برابر ۴ می‌شود.'},
    {q:'جست‌وجوی دودویی در هر مرحله چه تغییری در محدوده جست‌وجو ایجاد می‌کند؟',a:['دو برابر می‌کند','نصف می‌کند','ثابت نگه می‌دارد'],correct:1,why:'در هر مرحله نیمی از محدوده حذف می‌شود؛ به همین دلیل پیچیدگی آن لگاریتمی است.'}
  ];
  let current=0,score=0,answered=false;
  function renderQuestion(){
    answered=false;const q=questions[current];
    $('questionCounter').textContent=`سؤال ${fa(current+1)} از ${fa(questions.length)}`;
    $('progressBar').style.width=`${(current/questions.length)*100}%`;
    $('finalQuestion').textContent=q.q;$('finalFeedback').textContent='';$('nextQuestion').disabled=true;
    $('nextQuestion').textContent=current===questions.length-1?'مشاهده نتیجه':'سؤال بعدی ←';
    $('finalOptions').innerHTML=q.a.map((v,i)=>`<button data-answer="${i}">${v}</button>`).join('');
    $('finalOptions').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      if(answered)return;answered=true;const idx=Number(btn.dataset.answer),ok=idx===q.correct;if(ok)score++;
      $('finalOptions').querySelectorAll('button').forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct');else if(i===idx)b.classList.add('wrong');});
      $('finalFeedback').textContent=(ok?'آفرین، درست پاسخ دادی. ':'پاسخ درست این بود: ')+q.why;
      $('finalFeedback').style.color=ok?'#18734d':'#b3433b';$('nextQuestion').disabled=false;
    }));
  }
  $('nextQuestion').addEventListener('click',()=>{
    if(!answered)return;
    if(current<questions.length-1){current++;renderQuestion();}
    else{
      $('finalQuiz').classList.add('hidden');$('scoreCard').classList.remove('hidden');
      $('scoreNumber').textContent=`${fa(score)} از ${fa(questions.length)}`;
      $('scoreMessage').textContent=score>=5?'تسلط خیلی خوبی داری؛ آفرین!':score>=3?'خوب پیش رفتی؛ مرور مثال‌ها می‌تواند نتیجه‌ات را بهتر کند.':'یک بار دیگر مطالب و آزمایشگاه‌ها را مرور کن و دوباره امتحان بده.';
      $('progressBar').style.width='100%';
    }
  });
  $('restartQuiz').addEventListener('click',()=>{current=0;score=0;$('scoreCard').classList.add('hidden');$('finalQuiz').classList.remove('hidden');renderQuestion();});
  renderQuestion();
});
