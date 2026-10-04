import { useMemo, useState } from 'react'
import { LayoutDashboard, CheckSquare, CalendarDays, Settings, Search, Plus, MoreHorizontal, ChevronDown, Clock3, Circle, CheckCircle2, ArrowUpRight, X, Sparkles, Menu, Trash2 } from 'lucide-react'

const initialTasks = [
  { id: 1, title: 'Finalize the Q3 product roadmap', project: 'Product launch', date: 'Today', priority: 'High', done: false, color: 'violet' },
  { id: 2, title: 'Review onboarding flow feedback', project: 'Website refresh', date: 'Today', priority: 'Medium', done: false, color: 'orange' },
  { id: 3, title: 'Send notes from the design sync', project: 'Team operations', date: 'Oct 7', priority: 'Low', done: true, color: 'blue' },
  { id: 4, title: 'Prepare campaign creative brief', project: 'Marketing', date: 'Oct 8', priority: 'Medium', done: false, color: 'green' },
  { id: 5, title: 'Update pricing page copy', project: 'Website refresh', date: 'Oct 9', priority: 'Low', done: false, color: 'orange' },
]
const nav = [{ label: 'Overview', icon: LayoutDashboard }, { label: 'My tasks', icon: CheckSquare }, { label: 'Calendar', icon: CalendarDays }]

function App() {
  const [tasks, setTasks] = useState(() => { try { return JSON.parse(localStorage.getItem('taskflow-tasks')) || initialTasks } catch { return initialTasks } })
  const [filter, setFilter] = useState('All tasks')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newProject, setNewProject] = useState('Product launch')
  const save = (next) => { setTasks(next); localStorage.setItem('taskflow-tasks', JSON.stringify(next)) }
  const toggle = id => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = id => save(tasks.filter(t => t.id !== id))
  const add = e => { e.preventDefault(); if (!newTitle.trim()) return; save([{ id: Date.now(), title: newTitle.trim(), project: newProject, date: 'Today', priority: 'Medium', done: false, color: 'violet' }, ...tasks]); setNewTitle(''); setModal(false) }
  const visible = useMemo(() => tasks.filter(t => (filter === 'All tasks' || (filter === 'Completed' ? t.done : !t.done)) && `${t.title} ${t.project}`.toLowerCase().includes(query.toLowerCase())), [tasks, filter, query])
  const completed = tasks.filter(t => t.done).length
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><CheckSquare size={18}/></div><span>taskflow</span><button className="mobile-close icon-button" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">S</div><div><strong>Studio North</strong><small>Free workspace</small></div><ChevronDown size={15} className="muted"/></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.map(({label, icon: Icon}) => <button className={`nav-item ${label === 'My tasks' ? 'selected' : ''}`} key={label}><Icon size={18}/><span>{label}</span>{label === 'My tasks' && <span className="nav-count">{tasks.filter(t=>!t.done).length}</span>}</button>)}</nav>
      <div className="side-label projects-label">YOUR PROJECTS <button className="tiny-plus" onClick={() => setModal(true)}><Plus size={15}/></button></div>
      <div className="project-link"><span className="project-dot violet"/>Product launch</div><div className="project-link"><span className="project-dot orange"/>Website refresh</div><div className="project-link"><span className="project-dot green"/>Marketing</div><div className="project-link"><span className="project-dot blue"/>Team operations</div>
      <div className="sidebar-bottom"><button className="nav-item"><Settings size={18}/><span>Settings</span></button><div className="profile"><div className="profile-avatar">JD</div><div><strong>Jamie Dawson</strong><small>jamie@studionorth.co</small></div><MoreHorizontal size={18} className="muted"/></div></div>
    </aside>
    {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)}/>}
    <main className="main"><header className="topbar"><button className="icon-button menu-button" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>My tasks</strong></div><div className="top-actions"><button className="help-button">Help center</button><div className="top-avatar">JD</div></div></header>
      <div className="content"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> MONDAY, OCTOBER 5, 2026</div><h1>Good morning, Jamie <span>✦</span></h1><p>Here’s what’s happening with your work today.</p></div><button className="primary-button" onClick={() => setModal(true)}><Plus size={17}/> New task</button></div>
      <section className="summary-grid"><div className="summary-card focus-card"><div className="summary-top"><span>YOUR FOCUS</span><Sparkles size={17}/></div><h2>{tasks.filter(t=>!t.done).length} tasks <span>to go</span></h2><div className="progress-track"><div style={{width: `${tasks.length ? completed/tasks.length*100 : 0}%`}}/></div><div className="progress-meta"><span>{completed} completed</span><span>{tasks.length ? Math.round(completed/tasks.length*100) : 0}%</span></div></div><div className="summary-card"><div className="summary-top"><span>UP NEXT</span><Clock3 size={17}/></div><h2 className="up-next">{tasks.find(t=>!t.done)?.date || 'All clear'}</h2><p className="summary-caption">{tasks.find(t=>!t.done)?.title || 'No tasks due soon'}</p></div><div className="summary-card week-card"><div className="summary-top"><span>THIS WEEK</span><ArrowUpRight size={17}/></div><h2>{completed}<span> / {tasks.length}</span></h2><p className="summary-caption">tasks completed so far</p></div></section>
      <section className="task-section"><div className="task-heading"><div><h2>My tasks</h2><p>Keep your day moving, one thing at a time.</p></div><button className="view-button">This week <ChevronDown size={15}/></button></div><div className="toolbar"><div className="tabs">{['All tasks','To do','Completed'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}<span>{x==='All tasks'?tasks.length:x==='To do'?tasks.filter(t=>!t.done).length:completed}</span></button>)}</div><label className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks"/></label></div>
      <div className="task-list">{visible.length ? visible.map(t=><article className={`task-row ${t.done?'is-done':''}`} key={t.id}><button className="check-button" onClick={()=>toggle(t.id)} aria-label={t.done?'Mark incomplete':'Mark complete'}>{t.done?<CheckCircle2 size={20}/>:<Circle size={20}/>}</button><div className="task-main"><div className="task-title">{t.title}</div><div className="task-project"><span className={`project-dot ${t.color}`}/>{t.project}</div></div><span className={`priority ${t.priority.toLowerCase()}`}><i/>{t.priority}</span><span className={`task-date ${t.date==='Today'?'due-today':''}`}>{t.date}</span><button className="row-action" onClick={()=>remove(t.id)} aria-label="Delete task"><Trash2 size={16}/></button></article>) : <div className="empty-state"><div className="empty-icon"><CheckCircle2 size={22}/></div><strong>No tasks found</strong><span>Try another search or add a new task.</span><button onClick={()=>setModal(true)}>Create a task</button></div>}</div>
      <button className="add-task-inline" onClick={() => setModal(true)}><Plus size={16}/> Add a task</button><div className="list-footer">Showing {visible.length} of {tasks.length} tasks <span>Last synced just now</span></div></section>
      <footer className="footer-note">A little progress each day adds up <span>✳</span></footer></div>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><form className="modal" onSubmit={add}><div className="modal-head"><div><div className="modal-kicker">NEW TASK</div><h2>Make it happen.</h2></div><button type="button" className="icon-button" onClick={()=>setModal(false)}><X size={19}/></button></div><label className="field-label">Task name<input autoFocus value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="What needs to get done?"/></label><label className="field-label">Project<select value={newProject} onChange={e=>setNewProject(e.target.value)}><option>Product launch</option><option>Website refresh</option><option>Marketing</option><option>Team operations</option></select></label><div className="modal-actions"><button type="button" className="cancel-button" onClick={()=>setModal(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Add task</button></div></form></div>}
  </div>
}
export default App
