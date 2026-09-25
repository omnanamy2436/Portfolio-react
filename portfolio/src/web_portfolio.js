import React, { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  ['home', 'หน้าแรก'],
  ['featured-projects', 'ผลงานเด่น'],
  ['skills', 'ทักษะ & ความสามารถ'],
  ['about-education', 'ประวัติ & การศึกษา'],
  ['contact-section', 'ติดต่อ'],
];

export default function WebPortfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [projectFilter, setProjectFilter] = useState('all');
  const [copyStatus, setCopyStatus] = useState('คัดลอก');
  const [formFeedback, setFormFeedback] = useState('');
  const rootRef = useRef(null);
  const copyTimer = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const header = root.querySelector('header');
    let frame = 0;
    const updateSection = () => {
      frame = 0;
      const offset = header.getBoundingClientRect().height + 24;
      let current = 'home';
      NAV_ITEMS.forEach(([id]) => {
        if (root.querySelector('#' + id).getBoundingClientRect().top <= offset) current = id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = 'contact-section';
      setActiveSection(current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateSection); };
    const resize = () => {
      root.style.setProperty('--portfolio-header-height', header.getBoundingClientRect().height + 'px');
      onScroll();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(header);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    const id = window.location.hash.slice(1);
    if (NAV_ITEMS.some(([sectionId]) => sectionId === id)) root.querySelector('#' + id).scrollIntoView();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(copyTimer.current);
    };
  }, []);

  function navigate(event, id) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = rootRef.current.querySelector('#' + id);
    if (!target) return;
    window.history.pushState(null, '', '#' + id);
    setActiveSection(id);
    target.focus({ preventScroll: true });
    // Scroll only the page vertically; do not scroll the horizontal navigation.
    const headerHeight = rootRef.current.querySelector('header').getBoundingClientRect().height;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(0, top), left: window.scrollX, behavior: 'instant' });
  }

  async function copyEmail() {
    window.clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText('methanee.k@student.edu');
      setCopyStatus('คัดลอกแล้ว!');
    } catch {
      setCopyStatus('คัดลอกไม่ได้ กรุณาคัดลอกอีเมลด้วยตนเอง');
    }
    copyTimer.current = window.setTimeout(() => setCopyStatus('คัดลอก'), 2500);
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    // No backend is connected; open the user's email app with a prepared draft.
    const form = event.currentTarget;
    const inputs = form.querySelectorAll('input');
    const subject = 'Portfolio contact: ' + form.querySelector('select').selectedOptions[0].text;
    const message = inputs[0].value + '\nReply to: ' + inputs[1].value + '\n\n' + form.querySelector('textarea').value;
    window.location.href = 'mailto:methanee.k@student.edu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
    setFormFeedback('กรุณาส่งข้อความต่อในแอปอีเมลของคุณ หากแอปไม่เปิด สามารถคัดลอกอีเมลเพื่อติดต่อได้');
  }

  return (
    <div ref={rootRef} className="portfolio-page bg-background font-body-md text-body-md text-on-surface antialiased">
      <style>{PORTFOLIO_CSS}</style>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="portfolio-header-row max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm"><a className="flex flex-col text-left" href="#home" onClick={(event) => navigate(event, "home")}><span className="font-headline-sm text-headline-sm text-on-surface">Methanee (Mind) K.</span><span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline-block">Tech &amp; Design Student</span></a></div><nav aria-label="เมนูหลัก" className="portfolio-nav">
{NAV_ITEMS.map(([id, label]) => (
  <a key={id} href={'#' + id} onClick={(event) => navigate(event, id)} aria-current={activeSection === id ? 'location' : undefined}
    className={activeSection === id ? 'bg-primary-container text-on-primary-container rounded-lg px-3 py-1.5 whitespace-nowrap' : 'text-on-surface-variant hover:text-on-surface rounded-lg px-3 py-1.5 whitespace-nowrap'}>{label}</a>
))}
</nav><div className="flex items-center gap-space-md"><a className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-space-sm rounded-lg transition-colors shadow-sm" href="#">ดาวน์โหลด Resume</a><div className="flex items-center"><img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC53UvEHBcX8VmypJY8OO9z6ZC7i-lGwFGsRbsJgE1Jjdla6OJnZ0c2g2YWlgr8ZVjeG7I8nIWCW5FcvCjEokjSCkzH8n3-1mZ303HvY3Mwb5gkon6Hfdfds0jfvRNOXaVejV-_8DO-hQsUUGRR3CD8KhY1LDwJW7W3T-3imwqkyohUySU3K9hgRwQPiqebiEUTpwBNtw7W-XFxHEtXYgAGnwb-mZaiIvwbN-UcyF788h5r3FDp7tNaTQ"/></div></div></div></header><main className="w-full bg-background portfolio-main"><div className="flex flex-col w-full">

<div className="relative w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
<div className="absolute -top-16 left-1/4 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
<div className="absolute top-40 right-10 w-80 h-80 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
</div>

<section className="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin pt-space-xl pb-space-xl" id="home" tabIndex={-1}>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">

<div className="lg:col-span-7 flex flex-col items-start space-y-space-md">

<div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-4 py-1.5 rounded-full shadow-sm">
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">
            เปิดรับโอกาสฝึกงาน · พร้อมเริ่มงานสหกิจศึกษา 2025
          </span>
</div>

<div className="space-y-space-xs">
<h1 className="font-headline-lg md:font-display text-headline-lg md:text-display text-on-surface tracking-tight">
            สวัสดีครับ! ผมชื่อ <span className="text-primary font-extrabold">มายด์</span><br/>
            (Methanee K.)
          </h1>
<p className="font-headline-sm text-headline-sm text-primary-container font-semibold pt-1">
            นักศึกษาชั้นปีที่ 3 วิทยาการคอมพิวเตอร์ &amp; ดิจิทัลดีไซน์
          </p>
<p className="font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">
            Passionate Frontend Developer &amp; UI/UX Designer
          </p>
</div>

<p className="font-body-lg text-body-lg text-secondary max-w-xl leading-relaxed">
          มุ่งมั่นสร้างสรรค์ดิจิทัลโปรดักต์ที่ผสานระหว่างการเขียนโค้ดโครงสร้างที่สะอาด เรียบร้อย และงานดีไซน์ที่เน้นผู้ใช้งานเป็นศูนย์กลาง พร้อมเรียนรู้เทคโนโลยีใหม่เพื่อส่งมอบคุณค่าที่แท้จริง
        </p>

<div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
<a className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]" href="#featured-projects" onClick={(event) => navigate(event, "featured-projects")}>
<span>ดูผลงานของฉัน</span>
<span className="material-symbols-outlined text-label-md">arrow_forward</span>
</a>
<a className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-5 py-3.5 rounded-xl shadow-sm transition-colors" href="#resume-download">
<span className="material-symbols-outlined text-primary text-label-md">download</span>
<span>Resume / CV (PDF)</span>
</a>
<a className="inline-flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md px-4 py-3.5 rounded-xl transition-colors" href="#contact-section" onClick={(event) => navigate(event, "contact-section")}>
<span className="material-symbols-outlined text-label-md">chat_bubble</span>
<span>ติดต่อพูดคุย</span>
</a>
</div>

<div className="pt-space-sm flex items-center gap-space-md text-on-surface-variant">
<span className="font-label-sm text-label-sm">เครื่องมือหลัก:</span>
<div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface">
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface">React / Next.js</span>
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface">TypeScript</span>
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface">Figma</span>
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface">Tailwind</span>
</div>
</div>
</div>

<div className="lg:col-span-5 flex justify-center relative">
<div className="relative w-full max-w-sm">

<div className="absolute inset-0 bg-primary-container/10 rounded-3xl transform rotate-3 scale-102"></div>

<div className="relative rounded-3xl overflow-hidden bg-surface-container-lowest shadow-xl aspect-square">
<img alt="Methanee K. Portfolio Headshot" className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC53UvEHBcX8VmypJY8OO9z6ZC7i-lGwFGsRbsJgE1Jjdla6OJnZ0c2g2YWlgr8ZVjeG7I8nIWCW5FcvCjEokjSCkzH8n3-1mZ303HvY3Mwb5gkon6Hfdfds0jfvRNOXaVejV-_8DO-hQsUUGRR3CD8KhY1LDwJW7W3T-3imwqkyohUySU3K9hgRwQPiqebiEUTpwBNtw7W-XFxHEtXYgAGnwb-mZaiIvwbN-UcyF788h5r3FDp7tNaTQ"/>
</div>

<div className="absolute -top-3 -left-4 bg-surface-container-lowest text-on-surface px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-headline-sm" style={{"fontVariationSettings":"'FILL' 1"}}>school</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm leading-tight text-on-surface">3.82</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">เกียรตินิยมอันดับ 1 (เป้าหมาย)</p>
</div>
</div>

<div className="absolute -bottom-4 -right-4 bg-surface-container-lowest text-on-surface px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-headline-sm" style={{"fontVariationSettings":"'FILL' 1"}}>emoji_events</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm leading-tight text-on-surface">1st Runner-Up</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Smart Campus Hackathon 2024</p>
</div>
</div>

<div className="absolute bottom-16 -left-6 bg-surface-container-lowest text-on-surface px-3.5 py-2 rounded-xl shadow-md hidden sm:flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span className="font-label-md text-label-md font-semibold text-on-surface">3+ โปรเจกต์ใช้งานจริง</span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full bg-surface-container-low py-space-lg my-space-md" id="highlights" tabIndex={-1}>
<div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
<div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-primary">
<span className="material-symbols-outlined text-headline-md">grade</span>
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">วิทยาศาสตร์ฯ</span>
</div>
<div className="mt-space-sm">
<div className="font-display text-display text-on-surface tracking-tight">3.82</div>
<p className="font-body-sm text-body-sm text-on-surface-variant font-medium">GPAX สะสม 5 ภาคการศึกษา</p>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-primary">
<span className="material-symbols-outlined text-headline-md">deployed_code</span>
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Total Stack</span>
</div>
<div className="mt-space-sm">
<div className="font-display text-display text-on-surface tracking-tight">8+</div>
<p className="font-body-sm text-body-sm text-on-surface-variant font-medium">โปรเจกต์ระดับมหาวิทยาลัย &amp; แข่งขัน</p>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-tertiary">
<span className="material-symbols-outlined text-headline-md">military_tech</span>
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Awards</span>
</div>
<div className="mt-space-sm">
<div className="font-display text-display text-on-surface tracking-tight">2</div>
<p className="font-body-sm text-body-sm text-on-surface-variant font-medium">รางวัลการแข่งขัน Hackathon ด้าน Tech</p>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-primary">
<span className="material-symbols-outlined text-headline-md">bolt</span>
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Growth Mindset</span>
</div>
<div className="mt-space-sm">
<div className="font-display text-display text-on-surface tracking-tight">100%</div>
<p className="font-body-sm text-body-sm text-on-surface-variant font-medium">ความมุ่งมั่น &amp; พร้อมเรียนรู้สิ่งใหม่</p>
</div>
</div>
</div>
</div>
</section>

<section className="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin py-space-xl" id="featured-projects" tabIndex={-1}>

<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
<div className="space-y-space-xs">
<div className="inline-flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold tracking-wider uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Selected Works · ผลงานที่ภาคภูมิใจ
        </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          ผลงานโปรเจกต์ที่โดดเด่น
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
          การนำทฤษฎีในห้องเรียนมาประยุกต์สู่การแก้ปัญหาชีวิตจริง ทั้งเว็บแอปพลิเคชัน โมบายล์แอป และงานออกแบบ UI/UX
        </p>
</div>

<div className="flex flex-wrap items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl">
<button type="button" aria-pressed={projectFilter === 'all'} className={'project-tab-btn px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ' + (projectFilter === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface')} onClick={() => setProjectFilter('all')}>ทั้งหมด (All)</button>
<button type="button" aria-pressed={projectFilter === 'webapp'} className={'project-tab-btn px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ' + (projectFilter === 'webapp' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface')} onClick={() => setProjectFilter('webapp')}>Web Application</button>
<button type="button" aria-pressed={projectFilter === 'mobile'} className={'project-tab-btn px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ' + (projectFilter === 'mobile' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface')} onClick={() => setProjectFilter('mobile')}>Mobile App</button>
<button type="button" aria-pressed={projectFilter === 'uiux'} className={'project-tab-btn px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ' + (projectFilter === 'uiux' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface')} onClick={() => setProjectFilter('uiux')}>UI/UX Design</button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">

<article className="project-card flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" data-category="webapp uiux" style={{ display: projectFilter === 'all' || 'webapp uiux'.split(' ').includes(projectFilter) ? 'flex' : 'none' }}>

<div className="relative h-52 bg-surface-container-high overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="Modern clean UI dashboard mockup of a university campus food delivery web app showing food menus, order status tracking, and cart payment interface in crisp minimalism with soft lavender and blue accents." style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhU5p133Irwl5fn5vSgzmQ6Zrn8FndatLWE-SyEhmj6i47vFa-EEOib29iX5YcsN0x2uTPnKcI5Sjlu1s-F_VkeMV5AY58OEh9UvhEnjp7FZSkzJH5gK_I1cgIF-Ps7piCRQhRSQ1ebFiivP4ocG1BE0-HNO6fEDkqG2rxta_h7tR5tjSUzuY1e2gvQfbM694lF92CMIS1UGBb52mi-5XnR6DbvUy3hs8Q93J-ujr0hiiqTBHkZN3zaw')"}}></div>
<div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-primary font-semibold shadow-sm">
            Web App
          </div>
<div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium text-on-surface flex items-center gap-1 shadow-sm">
<span className="w-2 h-2 rounded-full bg-primary"></span>
            ผู้ใช้งานจริง 1,200+ นศ./วัน
          </div>
</div>

<div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-md">
<div className="space-y-space-xs">
<div className="flex flex-wrap gap-1.5">
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">Next.js 14</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Tailwind</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Node.js</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">PostgreSQL</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold pt-1">
              UniEat - Campus Food Pre-Order Web App
            </h3>
<p className="font-body-sm text-body-sm text-secondary leading-relaxed">
              เว็บแอปพลิเคชันสั่งอาหารล่วงหน้าในโรงอาหารมหาวิทยาลัย เพื่อลดเวลารอคอยของนิสิตในช่วงพักกลางวัน พร้อมระบบแจ้งเตือนคิวแบบเรียลไทม์ผ่าน WebSocket
            </p>
</div>
<div className="space-y-space-sm pt-space-xs">
<div className="bg-surface-container-low p-2.5 rounded-xl text-on-surface">
<p className="font-label-sm text-label-sm font-semibold text-primary">บทบาทหน้าที่:</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Frontend Lead &amp; UI Designer (ทำระบบตะกร้าสินค้า, State Management และเชื่อมต่อ Payment Gateway)</p>
</div>

<div className="flex items-center justify-between pt-space-xs">
<a className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold" href="#">
<span>ดู Live Demo</span>
<span className="material-symbols-outlined text-sm">open_in_new</span>
</a>
<div className="flex items-center gap-space-xs">
<a className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg" href="#" title="GitHub Source Code">
<span className="material-symbols-outlined text-headline-sm">code</span>
</a>
<a className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg" href="#" title="Case Study">
<span className="material-symbols-outlined text-headline-sm">description</span>
</a>
</div>
</div>
</div>
</div>
</article>

<article className="project-card flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" data-category="mobile uiux" style={{ display: projectFilter === 'all' || 'mobile uiux'.split(' ').includes(projectFilter) ? 'flex' : 'none' }}>

<div className="relative h-52 bg-surface-container-high overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="Two mobile app screen mockups side by side showing student study buddy matching profiles, chat interface, and shared study notes library with clean typography and modern minimal UI styling." style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0N2Y1z8RlHLzbwKObJmjDRncBdurHHF3hG8ZXmFPLntc6bkLzMwQSpyGb_RLUWSoQXSBA_4etRyUnJkHpHSC9ovViIaAhzlukMpHkiMVTrCLV6xhu1eeI-6bRZ8j5qL6jFygvWW44QETWqKZX_nkwsimo4FZNWsHI2u3yAy6tzDUkUUZL-aFAWqx36EniLHjgaS2xI525E4-Tm0Wk5kMz7CG7OYDpVrlEhs4D-QyF4t2Lkdmbzd994g')"}}></div>
<div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-primary font-semibold shadow-sm">
            Mobile &amp; UI/UX
          </div>
<div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium text-on-surface flex items-center gap-1 shadow-sm">
<span className="w-2 h-2 rounded-full bg-primary-container"></span>
            Usability Score: 88/100
          </div>
</div>

<div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-md">
<div className="space-y-space-xs">
<div className="flex flex-wrap gap-1.5">
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">Flutter</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Firebase</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Figma</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">UX Research</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold pt-1">
              StudyBuddy - แอปพลิเคชันจับคู่กลุ่มอ่านหนังสือ
            </h3>
<p className="font-body-sm text-body-sm text-secondary leading-relaxed">
              แพลตฟอร์มช่วยให้นักศึกษาค้นหาเพื่อนร่วมชั้นเพื่อติวหนังสือ มีระบบแชร์ชีทสรุปบทเรียน นัดหมายโต๊ะห้องสมุด และฟังก์ชันสรุปข้อสอบร่วมกัน
            </p>
</div>
<div className="space-y-space-sm pt-space-xs">
<div className="bg-surface-container-low p-2.5 rounded-xl text-on-surface">
<p className="font-label-sm text-label-sm font-semibold text-primary">บทบาทหน้าที่:</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Solo UI/UX Designer &amp; Flutter Developer (จัดทำ User Persona, Journey Map, High-Fi Prototype และเขียนแอปฯ)</p>
</div>

<div className="flex items-center justify-between pt-space-xs">
<a className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold" href="#">
<span>Figma Prototype</span>
<span className="material-symbols-outlined text-sm">draw</span>
</a>
<div className="flex items-center gap-space-xs">
<a className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg" href="#" title="GitHub Repository">
<span className="material-symbols-outlined text-headline-sm">code</span>
</a>
</div>
</div>
</div>
</div>
</article>

<article className="project-card flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" data-category="webapp" style={{ display: projectFilter === 'all' || 'webapp'.split(' ').includes(projectFilter) ? 'flex' : 'none' }}>

<div className="relative h-52 bg-surface-container-high overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="A clean smart waste management recycling web app dashboard showing point rewards, eco statistics, and IoT bin telemetry charts with modern aesthetic UI and green-indigo accents." style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuD05HbNf0x6V7wQQcb7c4bVh3d4WUnx0teBt25L-eAzkOUQocUGo2PypAC2C8B_-UalySj-W7CNIPn9h664DDO9F9fV_x-HPdBdOb0vk1yrV4kL-HDTYDuk8_-eSFqlL9gmAUtK9b-l5iIhWOxO7gahBLlznh76NKErnntXLxZsf0dSr3eh5ip4ei_cAZycpDkrCulRqTKEGLICPIV-ErVaIT9dDUQovpQwHGOdOaRUDlmXYg2vka5n1A')"}}></div>
<div className="absolute top-3 right-3 bg-tertiary-fixed text-tertiary px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold shadow-sm">
            🏆 1st Runner-Up
          </div>
<div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium text-on-surface flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-xs text-tertiary">workspace_premium</span>
            Hackathon Winner
          </div>
</div>

<div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-md">
<div className="space-y-space-xs">
<div className="flex flex-wrap gap-1.5">
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">React</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">FastAPI</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">IoT Sensor</span>
<span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Tailwind</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold pt-1">
              GreenCampus - แพลตฟอร์มสะสมแต้มคัดแยกขยะ
            </h3>
<p className="font-body-sm text-body-sm text-secondary leading-relaxed">
              โครงการคว้ารางวัลรองชนะเลิศอันดับ 1 ในงาน Smart Campus Hackathon เชื่อมต่อกับถังขยะ IoT เพื่อแปลงแต้มเป็นส่วนลดร้านค้าสหกรณ์มหาวิทยาลัย
            </p>
</div>
<div className="space-y-space-sm pt-space-xs">
<div className="bg-surface-container-low p-2.5 rounded-xl text-on-surface">
<p className="font-label-sm text-label-sm font-semibold text-primary">บทบาทหน้าที่:</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Frontend Developer &amp; Pitching Team (พัฒนาหน้า Dashboard แบบเรียลไทม์ และร่วมนำเสนอหน้าคณะกรรมการ)</p>
</div>

<div className="flex items-center justify-between pt-space-xs">
<a className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold" href="#">
<span>สไลด์ Pitch Deck</span>
<span className="material-symbols-outlined text-sm">slideshow</span>
</a>
<div className="flex items-center gap-space-xs">
<a className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg" href="#" title="GitHub Repo">
<span className="material-symbols-outlined text-headline-sm">code</span>
</a>
</div>
</div>
</div>
</div>
</article>
</div>
</section>

<section className="w-full bg-surface-container-lowest py-space-xl" id="skills" tabIndex={-1}>
<div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
<div className="text-center max-w-2xl mx-auto mb-space-lg space-y-space-xs">
<div className="inline-flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold tracking-wider uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Technical &amp; Design Skills
        </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          ทักษะและความสามารถรอบด้าน
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          ความเชี่ยวชาญทั้งการเขียนโปรแกรมและการออกแบบประสบการณ์ผู้ใช้ที่พร้อมประยุกต์ใช้งานได้ทันที
        </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">

<div className="bg-surface p-space-md rounded-2xl flex flex-col justify-between shadow-sm">
<div>
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary mb-space-sm">
<span className="material-symbols-outlined text-headline-sm">terminal</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Frontend Dev</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">การสร้าง Web Interface ที่ลื่นไหลและตอบสนองทุกหน้าจอ</p>
<div className="flex flex-wrap gap-1.5">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">HTML5 / CSS3</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">JavaScript (ES6+)</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">TypeScript</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">React.js</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Next.js</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Tailwind CSS</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Vue.js</span>
</div>
</div>
<div className="mt-space-md pt-space-xs">
<div className="flex justify-between font-label-sm text-label-sm mb-1">
<span className="text-on-surface-variant">ความมั่นใจ</span>
<span className="font-semibold text-primary">90%</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width":"90%"}}></div>
</div>
</div>
</div>

<div className="bg-surface p-space-md rounded-2xl flex flex-col justify-between shadow-sm">
<div>
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary mb-space-sm">
<span className="material-symbols-outlined text-headline-sm">draw</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">UI/UX Design</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">กระบวนการคิดและออกแบบตามหลัก Design Thinking</p>
<div className="flex flex-wrap gap-1.5">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Figma</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Wireframing</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Interactive Prototyping</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Design Systems</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">User Research</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Usability Testing</span>
</div>
</div>
<div className="mt-space-md pt-space-xs">
<div className="flex justify-between font-label-sm text-label-sm mb-1">
<span className="text-on-surface-variant">ความมั่นใจ</span>
<span className="font-semibold text-primary">85%</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width":"85%"}}></div>
</div>
</div>
</div>

<div className="bg-surface p-space-md rounded-2xl flex flex-col justify-between shadow-sm">
<div>
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary mb-space-sm">
<span className="material-symbols-outlined text-headline-sm">database</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Backend &amp; Tools</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">ความรู้ด้านสถาปัตยกรรมระบบและเครื่องมือพัฒนา</p>
<div className="flex flex-wrap gap-1.5">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Node.js</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Express</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Firebase</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Supabase</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Git / GitHub</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Postman</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Docker (Basic)</span>
</div>
</div>
<div className="mt-space-md pt-space-xs">
<div className="flex justify-between font-label-sm text-label-sm mb-1">
<span className="text-on-surface-variant">ความมั่นใจ</span>
<span className="font-semibold text-primary">75%</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width":"75%"}}></div>
</div>
</div>
</div>

<div className="bg-surface p-space-md rounded-2xl flex flex-col justify-between shadow-sm">
<div>
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary mb-space-sm">
<span className="material-symbols-outlined text-headline-sm">psychology</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Soft Skills</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">ทักษะการทำงานร่วมกับผู้อื่นและการปรับตัวอย่างรวดเร็ว</p>
<div className="flex flex-wrap gap-1.5">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Teamwork</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Problem Solving</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Fast Learner</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Adaptability</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">การนำเสนอผลงาน (Pitching)</span>
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-medium shadow-xs">Agile / Scrum Mindset</span>
</div>
</div>
<div className="mt-space-md pt-space-xs">
<div className="flex justify-between font-label-sm text-label-sm mb-1">
<span className="text-on-surface-variant">ความพร้อมในการทำงาน</span>
<span className="font-semibold text-primary">100%</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width":"100%"}}></div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin py-space-xl" id="about-education" tabIndex={-1}>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">

<div className="lg:col-span-4 space-y-space-sm">
<div className="inline-flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold tracking-wider uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Background · เส้นทางการเรียนรู้
        </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          ประวัติการศึกษา<br/>และกิจกรรม
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          มุ่งเน้นทั้งผลการเรียนทางวิชาการและการมีส่วนร่วมในกิจกรรมชมรม การแข่งขัน และการส่งต่อความรู้แก่นักศึกษารุ่นน้อง
        </p>
<div className="p-space-md rounded-2xl bg-surface-container-low space-y-2 mt-space-md">
<div className="flex items-center gap-2 text-on-surface font-semibold text-label-md">
<span className="material-symbols-outlined text-primary">verified</span>
<span>สถานะปัจจุบัน</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            กำลังศึกษาระดับปริญญาตรี ชั้นปีที่ 3 ภาคเรียนที่ 2 พร้อมเริ่มฝึกงานช่วง มิ.ย. - พ.ย. 2025 เป็นต้นไป
          </p>
</div>
</div>

<div className="lg:col-span-8 flex flex-col space-y-space-md">

<div className="relative pl-8 pb-space-md">
<div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
<div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-surface-container-high"></div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
<div className="flex flex-wrap items-center justify-between gap-2 mb-1">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-semibold">2022 - ปัจจุบัน</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">กรุงเทพมหานคร</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              วิทยาศาสตรบัณฑิต (วท.บ.) วิทยาการคอมพิวเตอร์
            </h3>
<p className="font-body-md text-body-md text-primary font-medium">
              มหาวิทยาลัยธรรมศาสตร์ · คณะวิทยาศาสตร์และเทคโนโลยี
            </p>
<p className="font-label-md text-label-md text-on-surface-variant font-semibold mt-1">
              เกรดเฉลี่ยสะสม (GPAX): 3.82 (อยู่ในเกณฑ์เกียรตินิยมอันดับ 1)
            </p>
<div className="mt-space-sm pt-space-xs space-y-1.5">
<p className="font-label-sm text-label-sm text-on-surface font-semibold">กิจกรรมสำคัญในมหาวิทยาลัย:</p>
<ul className="font-body-sm text-body-sm text-on-surface-variant space-y-1 list-disc list-inside">
<li>ประธานชมรม Web &amp; Tech Innovation Club (นำจัด Workshop Figma &amp; React ให้นิสิตกว่า 120 คน)</li>
<li>ผู้ช่วยสอน (Teaching Assistant) ประจำวิชา CS101 Introduction to Programming (Python &amp; C)</li>
</ul>
</div>
</div>
</div>

<div className="relative pl-8 pb-space-md">
<div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary-container"></div>
<div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-surface-container-high"></div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
<div className="flex flex-wrap items-center justify-between gap-2 mb-1">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold">2024</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Tech Volunteer &amp; Event</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Tech Conference Volunteer &amp; Hackathon Finalist
            </h3>
<p className="font-body-md text-body-md text-secondary">
              งานสัมมนาเทคโนโลยี BKK Tech Summit &amp; Smart Campus Hackathon
            </p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              ทำหน้าที่ประสานงานและดูแลสปีกเกอร์ด้าน UI/UX ประจำห้องบรรยายหลัก รวมถึงเข้าร่วมแข่งขัน Hackathon ตลอด 48 ชั่วโมงจนคว้ารางวัลรองชนะเลิศอันดับ 1
            </p>
</div>
</div>

<div className="relative pl-8">
<div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-outline-variant"></div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
<div className="flex flex-wrap items-center justify-between gap-2 mb-1">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">2016 - 2022</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">กรุงเทพมหานคร</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              มัธยมศึกษาตอนปลาย แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์-คอมพิวเตอร์
            </h3>
<p className="font-body-md text-body-md text-secondary">
              โรงเรียนเตรียมอุดมศึกษาพัฒนาการ (GPA 3.90)
            </p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              ตัวแทนโรงเรียนเข้าแข่งขันโอลิมปิกวิชาการ สอวน. คอมพิวเตอร์ ค่าย 1
            </p>
</div>
</div>
</div>
</div>
</section>

<section className="w-full bg-surface-container-low py-space-xl" id="certifications" tabIndex={-1}>
<div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
<div className="space-y-space-xs">
<div className="inline-flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold tracking-wider uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Recognitions · การรับรองและรางวัล
          </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            เกียรติบัตรและผลงานรางวัล
          </h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          การพัฒนาตนเองอย่างต่อเนื่องผ่านคอร์สเรียนสากลและการแข่งขันภาคสนาม
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">

<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-headline-md">design_services</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Coursera · 2024</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Google UX Design Professional Certificate
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              ครอบคลุมครบ 7 รายวิชา: User Research, Wireframing, Figma Prototype, Design Systems และ Accessibility Design
            </p>
</div>
<div className="pt-space-md">
<a className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold hover:underline" href="#">
<span>ตรวจสอบใบรับรอง (Verify Credential)</span>
<span className="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-headline-md">code</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Meta · 2023</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Meta Front-End Developer Specialization
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              ความเชี่ยวชาญด้าน React, Advanced JavaScript, Version Control, Responsive Web Design และการทดสอบ UI Component
            </p>
</div>
<div className="pt-space-md">
<a className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold hover:underline" href="#">
<span>ตรวจสอบใบรับรอง (Verify Credential)</span>
<span className="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-headline-md">trophy</span>
</div>
<span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full font-semibold">Award · 2024</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              1st Runner-Up Hackathon 2024
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              รางวัลรองชนะเลิศอันดับ 1 ในงาน National University Smart Campus Hackathon แข่งขันพัฒนาโซลูชันด้าน Green Tech จากทั้งหมด 35 ทีม
            </p>
</div>
<div className="pt-space-md">
<span className="font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-xs">verified</span>
              จัดโดยสมาคมผู้ประกอบการดิจิทัล
            </span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin py-space-xl" id="contact-section" tabIndex={-1}>
<div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">

<div className="lg:col-span-6 space-y-space-md">
<div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3.5 py-1 rounded-full font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            พร้อมเริ่มงาน Internship / Co-op 2025
          </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            กำลังมองหานักศึกษาฝึกงานที่มีไฟและพร้อมเรียนรู้อยู่ใช่ไหมครับ?
          </h2>
<p className="font-body-md text-body-md text-secondary leading-relaxed">
            ผมพร้อมนำความรู้ ความกระตือรือร้น และทักษะทั้ง Frontend &amp; UI/UX มาร่วมสร้างคุณค่าให้กับทีมของคุณ หากคุณสนใจสัมภาษณ์หรือมีข้อสงสัย ทักมาพูดคุยกันได้เลยครับ!
          </p>

<div className="space-y-space-xs pt-space-xs">

<div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary">mail</span>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">อีเมลสำหรับติดต่อโดยตรง</p>
<p className="font-label-md text-label-md text-on-surface font-semibold" id="email-text">methanee.k@student.edu</p>
</div>
</div>
<button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-medium shadow-xs transition-colors flex items-center gap-1" type="button" onClick={copyEmail}>
<span className="material-symbols-outlined text-xs">content_copy</span>
<span id="copy-btn-text" role="status">{copyStatus}</span>
</button>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs pt-1">
<div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low text-on-surface">
<span className="material-symbols-outlined text-on-surface-variant">call</span>
<span className="font-body-sm text-body-sm">(+66) 081-234-5678</span>
</div>
<div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low text-on-surface">
<span className="material-symbols-outlined text-on-surface-variant">location_on</span>
<span className="font-body-sm text-body-sm">กรุงเทพฯ / Work From Home</span>
</div>
</div>
</div>
</div>

<div className="lg:col-span-6 bg-surface-container-low p-space-md md:p-space-lg rounded-2xl">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
            ส่งข้อความถึงผมด่วน (Quick Message)
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            ฝากข้อความรายละเอียดตำแหน่ง หรือชวนสัมภาษณ์ แล้วผมจะตอบกลับภายใน 24 ชม.
          </p>
<form className="space-y-space-sm" onSubmit={handleContactSubmit}>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
<div className="space-y-1">
<label className="font-label-sm text-label-sm text-on-surface font-medium">ชื่อผู้ติดต่อ / บริษัท *</label>
<input className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs font-body-sm text-body-sm" placeholder="เช่น พี่แจน (TechCorp)" required type="text"/>
</div>
<div className="space-y-1">
<label className="font-label-sm text-label-sm text-on-surface font-medium">อีเมลตอบกลับ *</label>
<input className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs font-body-sm text-body-sm" placeholder="contact@company.com" required type="email"/>
</div>
</div>
<div className="space-y-1">
<label className="font-label-sm text-label-sm text-on-surface font-medium">ตำแหน่งที่สนใจชักชวน</label>
<select className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs font-body-sm text-body-sm">
<option value="frontend">Frontend Developer Intern</option>
<option value="uiux">UI/UX Designer Intern</option>
<option value="fullstack">Fullstack / Web Dev Intern</option>
<option value="project">โปรเจกต์ฟรีแลนซ์ / โอกาสอื่นๆ</option>
</select>
</div>
<div className="space-y-1">
<label className="font-label-sm text-label-sm text-on-surface font-medium">ข้อความเพิ่มเติม</label>
<textarea className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs font-body-sm text-body-sm resize-none" placeholder="ระบุช่วงเวลาที่เริ่มฝึกงาน หรือรายละเอียดคร่าวๆ..." rows="3"></textarea>
</div>
<button className="w-full py-3 px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md flex items-center justify-center gap-2" id="submit-btn" type="submit">
<span className="material-symbols-outlined text-label-md">send</span>
<span>ส่งข้อความนัดหมาย</span>
</button>
<p className="text-center text-body-sm text-primary" role="status">{formFeedback}</p>
</form>
</div>
</div>
</div>
</section>


</div></main><footer className="w-full bg-surface-container-lowest mt-space-xl shadow-[0_-1px_8px_rgba(0,0,0,0.02)]"><div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col items-center md:items-start gap-space-xs"><div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>พร้อมรับโอกาสฝึกงานและร่วมงาน (Available for Internships 2025)</div><p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">© 2025 Methanee (Mind) K. Crafted with modern minimalist aesthetics.</p></div><div className="flex items-center gap-space-md text-on-surface-variant"><a aria-label="GitHub" className="p-2 rounded-full hover:bg-surface-container-high hover:text-on-surface transition-colors" href="https://github.com" rel="noopener noreferrer" target="_blank"><span className="material-symbols-outlined text-headline-sm">code</span></a><a aria-label="LinkedIn" className="p-2 rounded-full hover:bg-surface-container-high hover:text-on-surface transition-colors" href="https://linkedin.com" rel="noopener noreferrer" target="_blank"><span className="material-symbols-outlined text-headline-sm">hub</span></a><a aria-label="Figma" className="p-2 rounded-full hover:bg-surface-container-high hover:text-on-surface transition-colors" href="https://figma.com" rel="noopener noreferrer" target="_blank"><span className="material-symbols-outlined text-headline-sm">draw</span></a><a aria-label="Email" className="p-2 rounded-full hover:bg-surface-container-high hover:text-on-surface transition-colors" href="mailto:methanee.k@student.edu"><span className="material-symbols-outlined text-headline-sm">mail</span></a></div></div></footer>
    </div>
  );
}

// Compiled from the original Tailwind theme; no runtime CDN script is needed.
const PORTFOLIO_CSS = "@import url(\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap\");@import url(\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200\");*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font-family by default.\n2. Use the user's configured `mono` font-feature-settings by default.\n3. Use the user's configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type='button']),\ninput:where([type='reset']),\ninput:where([type='submit']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden=\"until-found\"])) {\n  display: none;\n}.pointer-events-none {\n  pointer-events: none;\n}.fixed {\n  position: fixed;\n}.absolute {\n  position: absolute;\n}.relative {\n  position: relative;\n}.inset-0 {\n  inset: 0px;\n}.-bottom-4 {\n  bottom: -1rem;\n}.-left-4 {\n  left: -1rem;\n}.-left-6 {\n  left: -1.5rem;\n}.-right-4 {\n  right: -1rem;\n}.-top-16 {\n  top: -4rem;\n}.-top-3 {\n  top: -0.75rem;\n}.bottom-0 {\n  bottom: 0px;\n}.bottom-16 {\n  bottom: 4rem;\n}.bottom-3 {\n  bottom: 0.75rem;\n}.left-0 {\n  left: 0px;\n}.left-1\\.5 {\n  left: 0.375rem;\n}.left-1\\/4 {\n  left: 25%;\n}.left-3 {\n  left: 0.75rem;\n}.right-0 {\n  right: 0px;\n}.right-10 {\n  right: 2.5rem;\n}.right-3 {\n  right: 0.75rem;\n}.top-0 {\n  top: 0px;\n}.top-1 {\n  top: 0.25rem;\n}.top-3 {\n  top: 0.75rem;\n}.top-40 {\n  top: 10rem;\n}.top-5 {\n  top: 1.25rem;\n}.-z-10 {\n  z-index: -10;\n}.z-50 {\n  z-index: 50;\n}.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}.my-space-md {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}.mb-1 {\n  margin-bottom: 0.25rem;\n}.mb-space-lg {\n  margin-bottom: 1.5rem;\n}.mb-space-md {\n  margin-bottom: 1rem;\n}.mb-space-sm {\n  margin-bottom: 0.5rem;\n}.mb-space-xs {\n  margin-bottom: 0.25rem;\n}.mt-1 {\n  margin-top: 0.25rem;\n}.mt-space-md {\n  margin-top: 1rem;\n}.mt-space-sm {\n  margin-top: 0.5rem;\n}.mt-space-xl {\n  margin-top: 2.5rem;\n}.mt-space-xs {\n  margin-top: 0.25rem;\n}.block {\n  display: block;\n}.flex {\n  display: flex;\n}.inline-flex {\n  display: inline-flex;\n}.grid {\n  display: grid;\n}.hidden {\n  display: none;\n}.aspect-square {\n  aspect-ratio: 1 / 1;\n}.h-1\\.5 {\n  height: 0.375rem;\n}.h-10 {\n  height: 2.5rem;\n}.h-12 {\n  height: 3rem;\n}.h-2 {\n  height: 0.5rem;\n}.h-2\\.5 {\n  height: 0.625rem;\n}.h-3 {\n  height: 0.75rem;\n}.h-52 {\n  height: 13rem;\n}.h-8 {\n  height: 2rem;\n}.h-80 {\n  height: 20rem;\n}.h-9 {\n  height: 2.25rem;\n}.h-96 {\n  height: 24rem;\n}.h-full {\n  height: 100%;\n}.w-0\\.5 {\n  width: 0.125rem;\n}.w-1\\.5 {\n  width: 0.375rem;\n}.w-10 {\n  width: 2.5rem;\n}.w-12 {\n  width: 3rem;\n}.w-2 {\n  width: 0.5rem;\n}.w-2\\.5 {\n  width: 0.625rem;\n}.w-3 {\n  width: 0.75rem;\n}.w-8 {\n  width: 2rem;\n}.w-80 {\n  width: 20rem;\n}.w-9 {\n  width: 2.25rem;\n}.w-96 {\n  width: 24rem;\n}.w-auto {\n  width: auto;\n}.w-full {\n  width: 100%;\n}.max-w-2xl {\n  max-width: 42rem;\n}.max-w-\\[1200px\\] {\n  max-width: 1200px;\n}.max-w-sm {\n  max-width: 24rem;\n}.max-w-xl {\n  max-width: 36rem;\n}.flex-1 {\n  flex: 1 1 0%;\n}.rotate-3 {\n  --tw-rotate: 3deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}@keyframes ping {\n\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}.animate-ping {\n  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;\n}@keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n}.animate-pulse {\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}.resize-none {\n  resize: none;\n}.resize {\n  resize: both;\n}.list-inside {\n  list-style-position: inside;\n}.list-disc {\n  list-style-type: disc;\n}.grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n}.grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}.flex-col {\n  flex-direction: column;\n}.flex-wrap {\n  flex-wrap: wrap;\n}.items-start {\n  align-items: flex-start;\n}.items-center {\n  align-items: center;\n}.justify-center {\n  justify-content: center;\n}.justify-between {\n  justify-content: space-between;\n}.gap-1 {\n  gap: 0.25rem;\n}.gap-1\\.5 {\n  gap: 0.375rem;\n}.gap-2 {\n  gap: 0.5rem;\n}.gap-3 {\n  gap: 0.75rem;\n}.gap-space-lg {\n  gap: 1.5rem;\n}.gap-space-md {\n  gap: 1rem;\n}.gap-space-sm {\n  gap: 0.5rem;\n}.gap-space-xl {\n  gap: 2.5rem;\n}.gap-space-xs {\n  gap: 0.25rem;\n}.space-y-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));\n}.space-y-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}.space-y-space-md > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n}.space-y-space-sm > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}.space-y-space-xs > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}.overflow-hidden {\n  overflow: hidden;\n}.whitespace-nowrap {\n  white-space: nowrap;\n}.rounded-2xl {\n  border-radius: 1rem;\n}.rounded-3xl {\n  border-radius: 1.5rem;\n}.rounded-full {\n  border-radius: 9999px;\n}.rounded-lg {\n  border-radius: 0.5rem;\n}.rounded-md {\n  border-radius: 0.375rem;\n}.rounded-xl {\n  border-radius: 0.75rem;\n}.bg-background {\n  --tw-bg-opacity: 1;\n  background-color: rgb(247 249 251 / var(--tw-bg-opacity, 1));\n}.bg-outline-variant {\n  --tw-bg-opacity: 1;\n  background-color: rgb(199 196 215 / var(--tw-bg-opacity, 1));\n}.bg-primary {\n  --tw-bg-opacity: 1;\n  background-color: rgb(70 72 212 / var(--tw-bg-opacity, 1));\n}.bg-primary-container {\n  --tw-bg-opacity: 1;\n  background-color: rgb(96 99 238 / var(--tw-bg-opacity, 1));\n}.bg-primary-container\\/10 {\n  background-color: rgb(96 99 238 / 0.1);\n}.bg-primary-fixed {\n  --tw-bg-opacity: 1;\n  background-color: rgb(225 224 255 / var(--tw-bg-opacity, 1));\n}.bg-primary-fixed\\/30 {\n  background-color: rgb(225 224 255 / 0.3);\n}.bg-secondary {\n  --tw-bg-opacity: 1;\n  background-color: rgb(86 94 116 / var(--tw-bg-opacity, 1));\n}.bg-secondary-container {\n  --tw-bg-opacity: 1;\n  background-color: rgb(218 226 253 / var(--tw-bg-opacity, 1));\n}.bg-secondary-container\\/40 {\n  background-color: rgb(218 226 253 / 0.4);\n}.bg-surface {\n  --tw-bg-opacity: 1;\n  background-color: rgb(247 249 251 / var(--tw-bg-opacity, 1));\n}.bg-surface-container {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 238 240 / var(--tw-bg-opacity, 1));\n}.bg-surface-container-high {\n  --tw-bg-opacity: 1;\n  background-color: rgb(230 232 234 / var(--tw-bg-opacity, 1));\n}.bg-surface-container-low {\n  --tw-bg-opacity: 1;\n  background-color: rgb(242 244 246 / var(--tw-bg-opacity, 1));\n}.bg-surface-container-lowest {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n}.bg-surface-container-lowest\\/90 {\n  background-color: rgb(255 255 255 / 0.9);\n}.bg-surface-container-lowest\\/95 {\n  background-color: rgb(255 255 255 / 0.95);\n}.bg-surface\\/80 {\n  background-color: rgb(247 249 251 / 0.8);\n}.bg-tertiary-fixed {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 220 197 / var(--tw-bg-opacity, 1));\n}.bg-tertiary-fixed\\/40 {\n  background-color: rgb(255 220 197 / 0.4);\n}.bg-cover {\n  background-size: cover;\n}.bg-center {\n  background-position: center;\n}.object-contain {\n  object-fit: contain;\n}.object-cover {\n  object-fit: cover;\n}.object-center {\n  object-position: center;\n}.p-1\\.5 {\n  padding: 0.375rem;\n}.p-2 {\n  padding: 0.5rem;\n}.p-2\\.5 {\n  padding: 0.625rem;\n}.p-space-lg {\n  padding: 1.5rem;\n}.p-space-md {\n  padding: 1rem;\n}.p-space-sm {\n  padding: 0.5rem;\n}.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}.px-2\\.5 {\n  padding-left: 0.625rem;\n  padding-right: 0.625rem;\n}.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}.px-3\\.5 {\n  padding-left: 0.875rem;\n  padding-right: 0.875rem;\n}.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}.px-margin-mobile {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}.px-space-md {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}.py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n}.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}.py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n}.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}.py-3\\.5 {\n  padding-top: 0.875rem;\n  padding-bottom: 0.875rem;\n}.py-space-lg {\n  padding-top: 1.5rem;\n  padding-bottom: 1.5rem;\n}.py-space-sm {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}.py-space-xl {\n  padding-top: 2.5rem;\n  padding-bottom: 2.5rem;\n}.pb-space-md {\n  padding-bottom: 1rem;\n}.pb-space-xl {\n  padding-bottom: 2.5rem;\n}.pl-8 {\n  padding-left: 2rem;\n}.pt-1 {\n  padding-top: 0.25rem;\n}.pt-space-md {\n  padding-top: 1rem;\n}.pt-space-sm {\n  padding-top: 0.5rem;\n}.pt-space-xl {\n  padding-top: 2.5rem;\n}.pt-space-xs {\n  padding-top: 0.25rem;\n}.text-left {\n  text-align: left;\n}.text-center {\n  text-align: center;\n}.font-body-lg {\n  font-family: Inter;\n}.font-body-md {\n  font-family: Inter;\n}.font-body-sm {\n  font-family: Inter;\n}.font-display {\n  font-family: Plus Jakarta Sans;\n}.font-headline-lg {\n  font-family: Plus Jakarta Sans;\n}.font-headline-sm {\n  font-family: Plus Jakarta Sans;\n}.font-label-md {\n  font-family: Inter;\n}.font-label-sm {\n  font-family: Inter;\n}.text-\\[0\\.7rem\\] {\n  font-size: 0.7rem;\n}.text-body-lg {\n  font-size: 1.125rem;\n  line-height: 1.7;\n  letter-spacing: -0.01em;\n  font-weight: 400;\n}.text-body-md {\n  font-size: 1rem;\n  line-height: 1.6;\n  letter-spacing: 0;\n  font-weight: 400;\n}.text-body-sm {\n  font-size: 0.875rem;\n  line-height: 1.5;\n  letter-spacing: 0;\n  font-weight: 400;\n}.text-display {\n  font-size: 3.5rem;\n  line-height: 1.1;\n  letter-spacing: -0.03em;\n  font-weight: 800;\n}.text-headline-lg {\n  font-size: 2.5rem;\n  line-height: 1.2;\n  letter-spacing: -0.025em;\n  font-weight: 700;\n}.text-headline-md {\n  font-size: 1.75rem;\n  line-height: 1.3;\n  letter-spacing: -0.015em;\n  font-weight: 600;\n}.text-headline-sm {\n  font-size: 1.25rem;\n  line-height: 1.4;\n  letter-spacing: -0.01em;\n  font-weight: 600;\n}.text-label-md {\n  font-size: 0.875rem;\n  line-height: 1.25;\n  letter-spacing: 0.01em;\n  font-weight: 600;\n}.text-label-sm {\n  font-size: 0.75rem;\n  line-height: 1.2;\n  letter-spacing: 0.03em;\n  font-weight: 600;\n}.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}.font-bold {\n  font-weight: 700;\n}.font-extrabold {\n  font-weight: 800;\n}.font-medium {\n  font-weight: 500;\n}.font-semibold {\n  font-weight: 600;\n}.uppercase {\n  text-transform: uppercase;\n}.leading-relaxed {\n  line-height: 1.625;\n}.leading-tight {\n  line-height: 1.25;\n}.tracking-tight {\n  letter-spacing: -0.025em;\n}.tracking-wide {\n  letter-spacing: 0.025em;\n}.tracking-wider {\n  letter-spacing: 0.05em;\n}.text-on-primary {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}.text-on-primary-container {\n  --tw-text-opacity: 1;\n  color: rgb(255 251 255 / var(--tw-text-opacity, 1));\n}.text-on-primary-fixed {\n  --tw-text-opacity: 1;\n  color: rgb(7 0 108 / var(--tw-text-opacity, 1));\n}.text-on-secondary-container {\n  --tw-text-opacity: 1;\n  color: rgb(92 100 122 / var(--tw-text-opacity, 1));\n}.text-on-surface {\n  --tw-text-opacity: 1;\n  color: rgb(25 28 30 / var(--tw-text-opacity, 1));\n}.text-on-surface-variant {\n  --tw-text-opacity: 1;\n  color: rgb(70 69 84 / var(--tw-text-opacity, 1));\n}.text-primary {\n  --tw-text-opacity: 1;\n  color: rgb(70 72 212 / var(--tw-text-opacity, 1));\n}.text-primary-container {\n  --tw-text-opacity: 1;\n  color: rgb(96 99 238 / var(--tw-text-opacity, 1));\n}.text-secondary {\n  --tw-text-opacity: 1;\n  color: rgb(86 94 116 / var(--tw-text-opacity, 1));\n}.text-tertiary {\n  --tw-text-opacity: 1;\n  color: rgb(144 73 0 / var(--tw-text-opacity, 1));\n}.antialiased {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}.opacity-75 {\n  opacity: 0.75;\n}.shadow-\\[0_-1px_8px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.02\\)\\] {\n  --tw-shadow: 0 -1px 8px rgba(0,0,0,0.02);\n  --tw-shadow-colored: 0 -1px 8px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.shadow-\\[0_1px_8px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.04\\)\\] {\n  --tw-shadow: 0 1px 8px rgba(0,0,0,0.04);\n  --tw-shadow-colored: 0 1px 8px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.ring-2 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}.ring-4 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}.ring-primary-fixed {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(225 224 255 / var(--tw-ring-opacity, 1));\n}.ring-secondary-container {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(218 226 253 / var(--tw-ring-opacity, 1));\n}.ring-surface-variant {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(224 227 229 / var(--tw-ring-opacity, 1));\n}.blur-3xl {\n  --tw-blur: blur(64px);\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}.backdrop-blur-md {\n  --tw-backdrop-blur: blur(12px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}.backdrop-blur-xl {\n  --tw-backdrop-blur: blur(24px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}.transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}.transition-shadow {\n  transition-property: box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}.transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}.duration-300 {\n  transition-duration: 300ms;\n}.duration-500 {\n  transition-duration: 500ms;\n}.portfolio-page{--portfolio-header-height:80px;overflow-x:clip}.portfolio-header-row{min-height:80px;flex-wrap:wrap;padding-top:12px;padding-bottom:12px}.portfolio-nav{display:flex;align-items:center;gap:8px;max-width:100%;overflow-x:auto;order:3;width:100%;padding-bottom:4px}.portfolio-main{padding-top:var(--portfolio-header-height)}.portfolio-page section[id]{scroll-margin-top:calc(var(--portfolio-header-height) + 16px)}@media(min-width:1200px){.portfolio-header-row{flex-wrap:nowrap}.portfolio-nav{order:0;width:auto}}.portfolio-page a:focus-visible,.portfolio-page button:focus-visible{outline:2px solid #4648d4;outline-offset:4px}@media(prefers-reduced-motion:reduce){.portfolio-page *{animation:none!important;transition:none!important}}.placeholder\\:text-on-surface-variant\\/50::placeholder {\n  color: rgb(70 69 84 / 0.5);\n}.hover\\:scale-105:hover {\n  --tw-scale-x: 1.05;\n  --tw-scale-y: 1.05;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}.hover\\:scale-\\[1\\.02\\]:hover {\n  --tw-scale-x: 1.02;\n  --tw-scale-y: 1.02;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}.hover\\:bg-primary-container:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(96 99 238 / var(--tw-bg-opacity, 1));\n}.hover\\:bg-surface-container:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 238 240 / var(--tw-bg-opacity, 1));\n}.hover\\:bg-surface-container-high:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(230 232 234 / var(--tw-bg-opacity, 1));\n}.hover\\:text-on-surface:hover {\n  --tw-text-opacity: 1;\n  color: rgb(25 28 30 / var(--tw-text-opacity, 1));\n}.hover\\:text-primary:hover {\n  --tw-text-opacity: 1;\n  color: rgb(70 72 212 / var(--tw-text-opacity, 1));\n}.hover\\:text-primary-container:hover {\n  --tw-text-opacity: 1;\n  color: rgb(96 99 238 / var(--tw-text-opacity, 1));\n}.hover\\:underline:hover {\n  text-decoration-line: underline;\n}.hover\\:shadow-md:hover {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.hover\\:shadow-xl:hover {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}.focus\\:ring-primary:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(70 72 212 / var(--tw-ring-opacity, 1));\n}@media (min-width: 640px) {\n\n  .sm\\:inline-block {\n    display: inline-block;\n  }\n\n  .sm\\:flex {\n    display: flex;\n  }\n\n  .sm\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}@media (min-width: 768px) {\n\n  .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:items-start {\n    align-items: flex-start;\n  }\n\n  .md\\:items-end {\n    align-items: flex-end;\n  }\n\n  .md\\:p-space-lg {\n    padding: 1.5rem;\n  }\n\n  .md\\:p-space-xl {\n    padding: 2.5rem;\n  }\n\n  .md\\:px-margin {\n    padding-left: 3rem;\n    padding-right: 3rem;\n  }\n\n  .md\\:font-display {\n    font-family: Plus Jakarta Sans;\n  }\n\n  .md\\:text-display {\n    font-size: 3.5rem;\n    line-height: 1.1;\n    letter-spacing: -0.03em;\n    font-weight: 800;\n  }\n}@media (min-width: 1024px) {\n\n  .lg\\:col-span-4 {\n    grid-column: span 4 / span 4;\n  }\n\n  .lg\\:col-span-5 {\n    grid-column: span 5 / span 5;\n  }\n\n  .lg\\:col-span-6 {\n    grid-column: span 6 / span 6;\n  }\n\n  .lg\\:col-span-7 {\n    grid-column: span 7 / span 7;\n  }\n\n  .lg\\:col-span-8 {\n    grid-column: span 8 / span 8;\n  }\n\n  .lg\\:grid-cols-12 {\n    grid-template-columns: repeat(12, minmax(0, 1fr));\n  }\n\n  .lg\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .lg\\:grid-cols-4 {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n\n  .lg\\:gap-space-xl {\n    gap: 2.5rem;\n  }\n}";
