import React, { useState, useEffect, useMemo } from 'react';
import { insforge } from './insforge';
import bcrypt from 'bcryptjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/* ─────────── helpers ─────────── */
const fmt = (n, d = 2) => (n || 0).toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtDate = (d) => new Date(d).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const genToken = () => crypto.randomUUID ? crypto.randomUUID() : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

const getErrMsg = (e) => {
  if (!e) return 'Error desconocido';
  if (typeof e === 'string') return e;
  if (e.message) return e.message;
  if (e.error) {
    if (typeof e.error === 'string') return e.error;
    if (e.error.message) return e.error.message;
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
};

function App() {
  /* ── Hash-based route ── */
  const [route, setRoute] = useState(() => window.location.hash || '#/');
  useEffect(() => { const h = () => setRoute(window.location.hash || '#/'); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);

  // Password setup/reset page
  if (route.startsWith('#/setup')) {
    const params = new URLSearchParams(route.split('?')[1] || '');
    const token = params.get('token');
    return <PasswordSetup token={token} />;
  }
  if (route.startsWith('#/reset')) {
    return <PasswordReset />;
  }

  return <Dashboard />;
}

/* ═══════════════════════════════════════════ */
/*          PASSWORD SETUP PAGE               */
/* ═══════════════════════════════════════════ */
function PasswordSetup({ token }) {
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [msg, setMsg] = useState('');

  const handleSetup = async (e) => {
    e.preventDefault();
    if (pwd.length < 6) { setMsg('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (pwd !== pwd2) { setMsg('Las contraseñas no coinciden.'); return; }
    setStatus('loading'); setMsg('');

    try {
      // Find user by setup_token
      const { data: users, error: findErr } = await insforge.database
        .from('dashboard_users')
        .select('id, correo, nombre')
        .eq('setup_token', token)
        .gt('token_expires', new Date().toISOString());

      if (findErr || !users?.length) { setStatus('error'); setMsg('El enlace ha expirado o es inválido. Solicita uno nuevo.'); return; }

      const hash = bcrypt.hashSync(pwd, 6);
      const { error: updateErr } = await insforge.database
        .from('dashboard_users')
        .update({ contrasena: hash, setup_token: null, token_expires: null })
        .eq('id', users[0].id);

      if (updateErr) { setStatus('error'); setMsg('Error al guardar: ' + getErrMsg(updateErr)); return; }
      setStatus('success');
    } catch (err) { setStatus('error'); setMsg('Error de red: ' + getErrMsg(err)); }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <img src="/logo.jpg" alt="Alien Water Logo" className="login-logo" />
        <h1 className="login-title">Alien Water</h1>
        <p className="login-subtitle">Configurar tu Contraseña</p>

        {status === 'success' ? (
          <div className="success-alert">
            ✅ ¡Contraseña creada exitosamente!<br />
            <a href="#/" style={{ color: 'var(--accent-neon)', marginTop: '12px', display: 'inline-block' }}>Ir al Panel de Control →</a>
          </div>
        ) : !token ? (
          <div className="error-alert">No se proporcionó un token válido.</div>
        ) : (
          <form onSubmit={handleSetup}>
            {msg && <div className="error-alert">{msg}</div>}
            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <input type="password" required className="form-input" placeholder="Mínimo 6 caracteres" value={pwd} onChange={e => setPwd(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input type="password" required className="form-input" placeholder="Repite la contraseña" value={pwd2} onChange={e => setPwd2(e.target.value)} />
            </div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary">{status === 'loading' ? 'Guardando...' : 'Guardar Contraseña'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*        PASSWORD RESET REQUEST              */
/* ═══════════════════════════════════════════ */
function PasswordReset() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('loading'); setMsg('');
    try {
      // Check if user exists
      const { data: users } = await insforge.database
        .from('dashboard_users')
        .select('id, correo, nombre')
        .eq('correo', email.trim().toLowerCase());

      if (!users?.length) { setStatus('error'); setMsg('No se encontró una cuenta con ese correo.'); return; }

      // Generate reset token
      const token = genToken();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

      await insforge.database
        .from('dashboard_users')
        .update({ setup_token: token, token_expires: expires })
        .eq('id', users[0].id);

      // Try to send email
      const setupUrl = `${window.location.origin}${window.location.pathname}#/setup?token=${token}`;
      try {
        await sendInviteEmail(email.trim(), users[0].nombre || 'Usuario', setupUrl, true);
      } catch { /* Email sending failed silently - link still generated */ }

      setStatus('success');
      setMsg(`Se ha enviado un enlace de recuperación a ${email}. Si no llega el correo, contacta al administrador.`);
    } catch (err) { setStatus('error'); setMsg('Error: ' + getErrMsg(err)); }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <img src="/logo.jpg" alt="Alien Water Logo" className="login-logo" />
        <h1 className="login-title">Alien Water</h1>
        <p className="login-subtitle">Recuperar Contraseña</p>

        {status === 'success' ? (
          <div className="success-alert">{msg}<br /><a href="#/" style={{ color: 'var(--accent-neon)', marginTop: '12px', display: 'inline-block' }}>← Volver al Login</a></div>
        ) : (
          <form onSubmit={handleReset}>
            {msg && <div className="error-alert">{msg}</div>}
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" required className="form-input" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary">{status === 'loading' ? 'Enviando...' : 'Enviar Enlace de Recuperación'}</button>
          </form>
        )}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a href="#/" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>← Volver al Login</a>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Email sender helper ─────────── */
async function sendInviteEmail(toEmail, toName, setupUrl, isReset = false) {
  try {
    const { error } = await insforge.emails.send({
      to: toEmail,
      subject: isReset ? 'Recuperar Contraseña - Alien Water' : 'Invitación al Panel - Alien Water',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0f1a;color:#f3f4f6;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#38bdf8;margin:0;">Alien Water 💧</h1>
            <p style="color:#9ca3af;">${isReset ? 'Recuperación de Contraseña' : 'Invitación al Panel de Reportes'}</p>
          </div>
          <p>Hola <strong>${toName}</strong>,</p>
          <p>${isReset
            ? 'Se ha solicitado un cambio de contraseña para tu cuenta en el panel de Alien Water.'
            : 'Has sido registrado como responsable de una sucursal en Alien Water. Para acceder al panel de reportes, debes crear tu contraseña.'}</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${setupUrl}" style="background:linear-gradient(135deg,#38bdf8,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">
              ${isReset ? 'Cambiar Contraseña' : 'Crear mi Contraseña'}
            </a>
          </div>
          <p style="color:#9ca3af;font-size:13px;">Este enlace expira en 24 horas. Si no solicitaste esto, ignora este correo.</p>
        </div>
      `
    });
    if (!error) return true;
  } catch (err) {
    console.error("Error sending email:", err);
  }
  return false;
}

/* ═══════════════════════════════════════════ */
/*            MAIN DASHBOARD                  */
/* ═══════════════════════════════════════════ */
function Dashboard() {
  /* ── Session ── */
  const [user, setUser] = useState(() => { const s = localStorage.getItem('dashboard_session'); return s ? JSON.parse(s) : null; });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  /* ── Login ── */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  /* ── Active Tab ── */
  const [activeTab, setActiveTab] = useState('dispensado');

  /* ── Data ── */
  const [sales, setSales] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  /* ── Filters ── */
  const [selectedSucursal, setSelectedSucursal] = useState('Todas');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedMonth, setSelectedMonth] = useState(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`; });
  const [dateDesde, setDateDesde] = useState('');
  const [dateHasta, setDateHasta] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('Todos');

  /* ── Table states ── */
  const [salesSort, setSalesSort] = useState({ field: 'created_at', asc: false });
  const [salesSearch, setSalesSearch] = useState('');
  const [salesLimit, setSalesLimit] = useState(25);

  const [rechSort, setRechSort] = useState({ field: 'fecha', asc: false });
  const [rechSearch, setRechSearch] = useState('');
  const [rechLimit, setRechLimit] = useState(25);

  const [sucSort, setSucSort] = useState({ field: 'codigo', asc: true });
  const [sucSearch, setSucSearch] = useState('');

  /* ── Chart toggles ── */
  const [chartMetric, setChartMetric] = useState('bolivares');
  const [rechChartMetric, setRechChartMetric] = useState('bolivares');

  /* ── Sucursal Modal ── */
  const [showSucModal, setShowSucModal] = useState(false);
  const [editingSuc, setEditingSuc] = useState(null);
  const [sucForm, setSucForm] = useState({ codigo: '', nombre_negocio: '', direccion: '', responsable_nombre: '', responsable_apellido: '', telefono: '', email: '', ciudad: '', tipo_maquina: 'moneda' });
  const [sucSaving, setSucSaving] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  /* ── Profile state ── */
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    ciudad: '',
    direccion: '',
    telefono: '',
    pm_telefono: '',
    pm_cedula: '',
    pm_banco: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileMsgType, setProfileMsgType] = useState('success');

  const BANCOS_VENEZUELA = useMemo(() => [
    { code: '0102', name: 'Banco de Venezuela S.A.' },
    { code: '0134', name: 'Banesco Banco Universal S.A.C.A.' },
    { code: '0105', name: 'Banco Mercantil C.A.' },
    { code: '0108', name: 'Banco Provincial S.A. (BBVA)' },
    { code: '0191', name: 'Banco Nacional de Crédito BNC' },
    { code: '0114', name: 'Bancaribe C.A.' },
    { code: '0115', name: 'Banco Exterior C.A.' },
    { code: '0163', name: 'Banco del Tesoro C.A.' },
    { code: '0175', name: 'Banco Bicentenario del Pueblo C.A.' },
    { code: '0174', name: 'Banplus Banco Universal C.A.' },
    { code: '0171', name: 'Banco Activo C.A.' },
    { code: '0138', name: 'Banco Plaza C.A.' },
    { code: '0128', name: 'Banco Caroní C.A.' },
    { code: '0156', name: '100% Banco C.A.' },
    { code: '0157', name: 'Delsur Banco Universal C.A.' },
    { code: '0177', name: 'Banfanb Banco Universal' },
    { code: '0169', name: 'Mi Banco C.A.' },
    { code: '0104', name: 'Banco Venezolano de Crédito S.A.' },
    { code: '0137', name: 'Sofitasa Banco Universal C.A.' }
  ], []);

  const fetchProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const { data, error } = await insforge.database
        .from('dashboard_users')
        .select('*')
        .eq('id', user.user_id)
        .limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        const uInfo = data[0];
        setProfileForm({
          nombre: uInfo.nombre || '',
          apellido: uInfo.apellido || '',
          correo: uInfo.correo || '',
          ciudad: uInfo.ciudad || '',
          direccion: uInfo.direccion || '',
          telefono: uInfo.telefono || '',
          pm_telefono: uInfo.pm_telefono || '',
          pm_cedula: uInfo.pm_cedula || '',
          pm_banco: uInfo.pm_banco || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'perfil' && user) {
      fetchProfile();
    }
  }, [activeTab, user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    
    // Validations
    if (!profileForm.nombre.trim()) { setProfileMsg('❌ El nombre es obligatorio.'); setProfileMsgType('error'); return; }
    if (!profileForm.apellido.trim()) { setProfileMsg('❌ El apellido es obligatorio.'); setProfileMsgType('error'); return; }
    if (!profileForm.correo.trim()) { setProfileMsg('❌ El email es obligatorio.'); setProfileMsgType('error'); return; }
    if (!profileForm.ciudad.trim()) { setProfileMsg('❌ La ciudad es obligatoria.'); setProfileMsgType('error'); return; }
    if (!profileForm.direccion.trim()) { setProfileMsg('❌ La dirección es obligatoria.'); setProfileMsgType('error'); return; }
    if (!profileForm.telefono.trim()) { setProfileMsg('❌ El teléfono es obligatorio.'); setProfileMsgType('error'); return; }

    // Pago móvil validations
    if (!profileForm.pm_telefono.trim()) { setProfileMsg('❌ El teléfono de Pago Móvil es obligatorio.'); setProfileMsgType('error'); return; }
    if (!/^\d{11}$/.test(profileForm.pm_telefono.trim())) { setProfileMsg('❌ El teléfono de Pago Móvil debe ser de 11 dígitos numéricos sin espacios ni caracteres especiales.'); setProfileMsgType('error'); return; }
    if (!profileForm.pm_cedula.trim()) { setProfileMsg('❌ La cédula es obligatoria.'); setProfileMsgType('error'); return; }
    if (!/^\d+$/.test(profileForm.pm_cedula.trim())) { setProfileMsg('❌ La cédula debe ser puramente numérica.'); setProfileMsgType('error'); return; }
    if (!profileForm.pm_banco) { setProfileMsg('❌ Debe seleccionar un banco.'); setProfileMsgType('error'); return; }

    setLoadingProfile(true);
    try {
      const { error } = await insforge.database
        .from('dashboard_users')
        .update({
          nombre: profileForm.nombre.trim(),
          apellido: profileForm.apellido.trim(),
          correo: profileForm.correo.trim().toLowerCase(),
          ciudad: profileForm.ciudad.trim(),
          direccion: profileForm.direccion.trim(),
          telefono: profileForm.telefono.trim(),
          pm_telefono: profileForm.pm_telefono.trim(),
          pm_cedula: profileForm.pm_cedula.trim(),
          pm_banco: profileForm.pm_banco
        })
        .eq('id', user.user_id);

      if (error) throw error;

      // Update session data in local state and localStorage
      const updatedUser = {
        ...user,
        user_nombre: profileForm.nombre.trim(),
        user_apellido: profileForm.apellido.trim(),
        user_correo: profileForm.correo.trim().toLowerCase()
      };
      setUser(updatedUser);
      localStorage.setItem('dashboard_session', JSON.stringify(updatedUser));

      setProfileMsg('✅ Perfil y datos de Pago Móvil actualizados correctamente.');
      setProfileMsgType('success');
    } catch (err) {
      setProfileMsg('❌ Error al actualizar el perfil: ' + getErrMsg(err));
      setProfileMsgType('error');
    } finally {
      setLoadingProfile(false);
    }
  };

  /* ── Effects ── */
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { setSalesLimit(25); setRechLimit(25); }, [selectedSucursal, selectedPeriod, selectedMonth, dateDesde, dateHasta, selectedMethod]);

  useEffect(() => {
    if (!user) return;
    if (user.user_rol === 'sucursal' && user.user_sucursal) setSelectedSucursal(user.user_sucursal);
    else setSelectedSucursal('Todas');
    fetchData();
  }, [user]);

  /* ── Data Fetching ── */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [salesRes, rechRes, credRes, usersRes, sucRes] = await Promise.all([
        insforge.database.from('reporte_ventas').select('*').order('created_at', { ascending: false }),
        insforge.database.from('historial').select('*').eq('accion', 'RECARGA').order('fecha', { ascending: false }),
        insforge.database.from('creditos').select('qr_code, saldo, phone, assigned_at, sucursal').not('phone', 'is', null).order('saldo', { ascending: false }),
        insforge.database.from('users').select('phone, first_name, last_name'),
        insforge.database.from('sucursales').select('*').order('codigo', { ascending: true }),
      ]);
      setSales(salesRes.data || []);
      setRecharges(rechRes.data || []);
      setCreditos(credRes.data || []);
      setUsersData(usersRes.data || []);
      setSucursales(sucRes.error ? [] : (sucRes.data || []));
    } catch (err) { console.error('Fetch error:', getErrMsg(err)); }
    finally { setLoadingData(false); }
  };

  /* ── Auth ── */
  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError(''); setLoadingLogin(true);
    try {
      const { data, error } = await insforge.database.rpc('verificar_login', { p_correo: email.trim(), p_contrasena: password });
      if (error) { setLoginError('Error de servidor en autenticación.'); }
      else if (data?.length > 0 && data[0].success) { const u = data[0]; setUser(u); localStorage.setItem('dashboard_session', JSON.stringify(u)); }
      else { setLoginError('Correo o contraseña incorrectos.'); }
    } catch { setLoginError('Error de red.'); }
    finally { setLoadingLogin(false); }
  };
  const handleLogout = () => {
    localStorage.removeItem('dashboard_session');
    setUser(null);
    setEmail('');
    setPassword('');
    window.location.hash = '#/';
  };

  /* ── User lookup map ── */
  const userMap = useMemo(() => {
    const m = {};
    usersData.forEach(u => { m[u.phone] = u; });
    return m;
  }, [usersData]);

  const getUserName = (phone) => {
    const u = userMap[phone];
    return u ? (u.first_name || '') + (u.last_name ? ' ' + u.last_name : '') : phone || '—';
  };

  /* ── Date filter ── */
  const filterByDate = (dateVal) => {
    const d = new Date(dateVal);
    const today = new Date();
    if (selectedPeriod === 'hoy') return d.toDateString() === today.toDateString();
    if (selectedPeriod === 'semana') { const w = new Date(); w.setDate(today.getDate() - 7); return d >= w && d <= today; }
    if (selectedPeriod === 'mes') return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    if (selectedPeriod === 'mes_selector' && selectedMonth) { const [y, m] = selectedMonth.split('-'); return d.getFullYear() === +y && d.getMonth() + 1 === +m; }
    if (selectedPeriod === 'personalizado') {
      const s = dateDesde ? new Date(dateDesde) : null; const e = dateHasta ? new Date(dateHasta) : null;
      if (s) s.setHours(0, 0, 0, 0); if (e) e.setHours(23, 59, 59, 999);
      if (s && d < s) return false; if (e && d > e) return false;
    }
    return true;
  };

  const filterBySucursal = (item) => {
    if (!user) return false;
    if (user.user_rol === 'sucursal' && user.user_sucursal) return item.sucursal === user.user_sucursal;
    return selectedSucursal === 'Todas' || item.sucursal === selectedSucursal;
  };

  /* ── Filtered Data ── */
  const filteredSales = useMemo(() => sales.filter(s => {
    if (!filterBySucursal(s)) return false;
    if (selectedMethod !== 'Todos' && s.metodo !== selectedMethod) return false;
    return filterByDate(s.created_at);
  }), [sales, selectedSucursal, selectedPeriod, selectedMonth, dateDesde, dateHasta, selectedMethod, user]);

  const filteredRecharges = useMemo(() => recharges.filter(r => {
    if (!filterBySucursal(r)) return false;
    return filterByDate(r.fecha);
  }), [recharges, selectedSucursal, selectedPeriod, selectedMonth, dateDesde, dateHasta, user]);

  /* ── Filtered Creditos ── */
  const filteredCreditos = useMemo(() => {
    if (!user) return [];
    return creditos.filter(c => {
      if (user.user_rol === 'sucursal' && user.user_sucursal) return c.sucursal === user.user_sucursal;
      return selectedSucursal === 'Todas' || c.sucursal === selectedSucursal;
    });
  }, [creditos, selectedSucursal, user]);

  /* ── Enriched recharge rows ── */
  const enrichedRecharges = useMemo(() => {
    return filteredRecharges.map(r => {
      const cred = creditos.find(c => c.qr_code === r.qr_code);
      const phone = cred?.phone || '';
      return { ...r, phone, nombre: getUserName(phone), saldoActual: cred?.saldo || 0, referencia: r.empleado || '' };
    });
  }, [filteredRecharges, creditos, userMap]);

  /* ── KPIs ── */
  const totalBs = filteredSales.reduce((a, c) => a + (c.monto_bs || 0), 0);
  const totalLts = filteredSales.reduce((a, c) => a + (c.litros || 0), 0);
  const totalServicios = filteredSales.length;
  const totalSaldoRecargas = filteredCreditos.reduce((a, c) => a + (c.saldo || 0), 0);
  const totalRechBs = filteredRecharges.reduce((a, c) => a + (c.cantidad || 0), 0);
  const totalRechCount = filteredRecharges.length;

  /* ── Top Rechargers ── */
  const topRechargers = useMemo(() => {
    const m = {};
    enrichedRecharges.forEach(r => {
      if (!m[r.qr_code]) m[r.qr_code] = { qr_code: r.qr_code, phone: r.phone, nombre: r.nombre, totalBs: 0, count: 0, saldoActual: r.saldoActual };
      m[r.qr_code].totalBs += r.cantidad || 0;
      m[r.qr_code].count += 1;
    });
    return Object.values(m).sort((a, b) => b.totalBs - a.totalBs);
  }, [enrichedRecharges]);

  /* ── Sort & Search helpers ── */
  const sortData = (data, sort) => [...data].sort((a, b) => {
    let va = a[sort.field], vb = b[sort.field];
    if (['litros', 'monto_bs', 'cantidad', 'saldo', 'saldoActual', 'id', 'totalBs', 'count'].includes(sort.field)) { va = parseFloat(va) || 0; vb = parseFloat(vb) || 0; }
    else if (['created_at', 'fecha', 'assigned_at'].includes(sort.field)) { va = new Date(va); vb = new Date(vb); }
    else { va = (va || '').toString().toLowerCase(); vb = (vb || '').toString().toLowerCase(); }
    if (va < vb) return sort.asc ? -1 : 1;
    if (va > vb) return sort.asc ? 1 : -1;
    return 0;
  });

  const searchFilter = (item, query, fields) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return fields.some(f => (item[f] || '').toString().toLowerCase().includes(q));
  };

  const toggleSort = (setter, field) => setter(prev => prev.field === field ? { ...prev, asc: !prev.asc } : { field, asc: false });
  const SortIcon = ({ sort, field }) => sort.field === field ? (sort.asc ? ' ▲' : ' ▼') : '';

  /* ── Chart Data ── */
  const salesBarData = useMemo(() => {
    const daily = {};
    filteredSales.forEach(s => {
      const ds = new Date(s.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      if (!daily[ds]) daily[ds] = { bs: 0, lts: 0 };
      daily[ds].bs += s.monto_bs || 0;
      daily[ds].lts += s.litros || 0;
    });
    const sorted = Object.keys(daily).sort((a, b) => { const [dA, mA] = a.split('/'); const [dB, mB] = b.split('/'); return new Date(2026, mA - 1, dA) - new Date(2026, mB - 1, dB); }).slice(-15);
    const active = sorted.map(d => chartMetric === 'bolivares' ? daily[d].bs : daily[d].lts);
    const label = chartMetric === 'bolivares' ? 'Total Bolívares (Bs)' : 'Total Litros (Lts)';
    let maxI = -1, minI = -1;
    if (active.length > 1) { let mx = -Infinity, mn = Infinity; active.forEach((v, i) => { if (v > mx) { mx = v; maxI = i; } if (v < mn) { mn = v; minI = i; } }); }
    return { labels: sorted, datasets: [{ label, data: active, borderWidth: 1, borderRadius: 4, backgroundColor: active.map((_, i) => i === maxI ? (theme === 'dark' ? '#2563eb' : '#1d4ed8') : i === minI ? '#ef4444' : (theme === 'dark' ? 'rgba(156,163,175,0.4)' : 'rgba(156,163,175,0.6)')), borderColor: active.map((_, i) => i === maxI ? (theme === 'dark' ? '#38bdf8' : '#1d4ed8') : i === minI ? '#ef4444' : (theme === 'dark' ? '#4b5563' : '#9ca3af')) }] };
  }, [filteredSales, chartMetric, theme]);

  const rechBarData = useMemo(() => {
    const daily = {};
    filteredRecharges.forEach(r => {
      const ds = new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      if (!daily[ds]) daily[ds] = { bs: 0, count: 0 };
      daily[ds].bs += r.cantidad || 0;
      daily[ds].count += 1;
    });
    const sorted = Object.keys(daily).sort((a, b) => { const [dA, mA] = a.split('/'); const [dB, mB] = b.split('/'); return new Date(2026, mA - 1, dA) - new Date(2026, mB - 1, dB); }).slice(-15);
    const active = sorted.map(d => rechChartMetric === 'bolivares' ? daily[d].bs : daily[d].count);
    const label = rechChartMetric === 'bolivares' ? 'Recargas (Bs)' : 'Cantidad de Recargas';
    let maxI = -1, minI = -1;
    if (active.length > 1) { let mx = -Infinity, mn = Infinity; active.forEach((v, i) => { if (v > mx) { mx = v; maxI = i; } if (v < mn) { mn = v; minI = i; } }); }
    return { labels: sorted, datasets: [{ label, data: active, borderWidth: 1, borderRadius: 4, backgroundColor: active.map((_, i) => i === maxI ? '#8b5cf6' : i === minI ? '#ef4444' : (theme === 'dark' ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.4)')), borderColor: active.map((_, i) => i === maxI ? '#a78bfa' : i === minI ? '#ef4444' : (theme === 'dark' ? '#6d28d9' : '#7c3aed')) }] };
  }, [filteredRecharges, rechChartMetric, theme]);

  const pieData = useMemo(() => {
    const qr = filteredSales.filter(s => s.metodo === 'QR').reduce((a, c) => a + (c.monto_bs || 0), 0);
    const ef = filteredSales.filter(s => s.metodo === 'EFECTIVO').reduce((a, c) => a + (c.monto_bs || 0), 0);
    return { labels: ['Código QR', 'Efectivo'], datasets: [{ data: [qr, ef], backgroundColor: [theme === 'dark' ? 'rgba(14,165,233,0.75)' : 'rgba(2,132,199,0.85)', theme === 'dark' ? 'rgba(156,163,175,0.5)' : 'rgba(107,114,128,0.7)'], borderColor: [theme === 'dark' ? '#38bdf8' : '#0284c7', theme === 'dark' ? '#9ca3af' : '#6b7280'], borderWidth: 1 }] };
  }, [filteredSales, theme]);

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: theme === 'dark' ? '#f3f4f6' : '#1f2937', font: { family: 'Inter' } } } }, scales: { x: { grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: theme === 'dark' ? '#9ca3af' : '#6b7280' } }, y: { grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: theme === 'dark' ? '#9ca3af' : '#6b7280' } } } };
  const pieOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: theme === 'dark' ? '#f3f4f6' : '#1f2937', font: { family: 'Inter' } } } } };

  /* ── Sucursales CRUD ── */
  const openSucModal = (suc = null) => {
    setSucMsg(''); setInviteLink('');
    if (suc) {
      setEditingSuc(suc);
      setSucForm({
        codigo: suc.codigo,
        nombre_negocio: suc.nombre_negocio || '',
        direccion: suc.direccion || '',
        responsable_nombre: suc.responsable_nombre || '',
        responsable_apellido: suc.responsable_apellido || '',
        telefono: suc.telefono || '',
        email: suc.email || '',
        ciudad: suc.ciudad || '',
        tipo_maquina: suc.tipo_maquina || 'moneda'
      });
    } else {
      setEditingSuc(null);
      // Auto-calculate next numeric code starting from 100
      const numericCodes = sucursales
        .map(s => parseInt(s.codigo, 10))
        .filter(n => !isNaN(n));
      const nextCode = numericCodes.length > 0 ? Math.max(...numericCodes) + 1 : 100;
      const finalCode = Math.max(100, nextCode);
      setSucForm({
        codigo: String(finalCode),
        nombre_negocio: '',
        direccion: '',
        responsable_nombre: '',
        responsable_apellido: '',
        telefono: '',
        email: '',
        ciudad: 'Maracaibo',
        tipo_maquina: 'moneda'
      });
    }
    setShowSucModal(true);
  };

  const saveSucursal = async () => {
    setSucMsg(''); setInviteLink('');
    
    // Mandatory validations
    if (!sucForm.ciudad?.trim()) { setSucMsg('❌ La ciudad es obligatoria.'); return; }
    if (!sucForm.direccion?.trim()) { setSucMsg('❌ La dirección es obligatoria.'); return; }
    if (!sucForm.responsable_nombre?.trim()) { setSucMsg('❌ El nombre del responsable es obligatorio.'); return; }
    if (!sucForm.responsable_apellido?.trim()) { setSucMsg('❌ El apellido del responsable es obligatorio.'); return; }
    if (!sucForm.telefono?.trim()) { setSucMsg('❌ El teléfono es obligatorio.'); return; }
    if (!sucForm.email?.trim()) { setSucMsg('❌ El email es obligatorio.'); return; }

    setSucSaving(true);
    try {
      if (editingSuc) {
        // Update sucursal
        const { error } = await insforge.database.from('sucursales').update({ ...sucForm, updated_at: new Date().toISOString() }).eq('id', editingSuc.id);
        if (error) throw error;
        setSucMsg('✅ Sucursal actualizada correctamente.');
      } else {
        // Create sucursal
        const { error: sucErr } = await insforge.database.from('sucursales').insert([sucForm]);
        if (sucErr) throw sucErr;

        // Create dashboard user for the responsible person
        if (sucForm.email) {
          const token = genToken();
          const expires = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(); // 72h for initial setup
          const tempHash = bcrypt.hashSync(token.substring(0, 8), 6); // temp password

          const { error: userErr } = await insforge.database.from('dashboard_users').insert([{
            correo: sucForm.email.trim().toLowerCase(),
            contrasena: tempHash,
            nombre: sucForm.responsable_nombre.trim(),
            apellido: sucForm.responsable_apellido.trim(),
            sucursal: sucForm.codigo,
            rol: 'sucursal',
            setup_token: token,
            token_expires: expires,
          }]);

          const setupUrl = `${window.location.origin}${window.location.pathname}#/setup?token=${token}`;
          setInviteLink(setupUrl);

          if (userErr) {
            setSucMsg('⚠️ Sucursal creada pero hubo un error al crear el usuario: ' + userErr.message);
          } else {
            // Try to send email
            const emailSent = await sendInviteEmail(sucForm.email, `${sucForm.responsable_nombre} ${sucForm.responsable_apellido}`, setupUrl);
            setSucMsg(emailSent
              ? '✅ Sucursal creada y correo de invitación enviado a ' + sucForm.email
              : '✅ Sucursal creada. El correo no pudo enviarse, comparte el enlace manualmente:'
            );
          }
        } else {
          setSucMsg('✅ Sucursal creada (sin email de invitación).');
        }
      }
      fetchData();
    } catch (e) { setSucMsg('❌ Error: ' + getErrMsg(e)); }
    finally { setSucSaving(false); }
  };

  /* ── Sucursal options ── */
  const sucursalOptions = useMemo(() => {
    const codes = new Set();
    sales.forEach(s => s.sucursal && codes.add(s.sucursal));
    recharges.forEach(r => r.sucursal && codes.add(r.sucursal));
    sucursales.forEach(s => codes.add(s.codigo));
    return [...codes].sort();
  }, [sales, recharges, sucursales]);

  /* ═══════════ RENDER ═══════════ */

  // Login
  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card glass-card">
          <img src="/logo.jpg" alt="Alien Water Logo" className="login-logo" />
          <h1 className="login-title">Alien Water</h1>
          <p className="login-subtitle">Panel de Control de Sucursales</p>
          {loginError && <div className="error-alert">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" required className="form-input" placeholder="ejemplo@alienwater.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" required className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loadingLogin} className="btn-primary">{loadingLogin ? 'Iniciando Sesión...' : 'Ingresar al Panel'}</button>
          </form>
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a href="#/reset" style={{ color: 'var(--accent-neon)', fontSize: '14px' }}>¿Olvidaste tu contraseña?</a>
          </div>
        </div>
      </div>
    );
  }

  // Sorted table data
  const sortedSales = sortData(filteredSales.filter(s => searchFilter(s, salesSearch, ['id', 'metodo', 'sucursal'])), salesSort);
  const sortedRecharges = sortData(enrichedRecharges.filter(r => searchFilter(r, rechSearch, ['nombre', 'phone', 'qr_code', 'referencia'])), rechSort);
  const filteredSucs = sucursales.filter(s => searchFilter(s, sucSearch, ['codigo', 'nombre_negocio', 'responsable_nombre', 'responsable_apellido', 'ciudad', 'telefono', 'email']));
  const sortedSucs = sortData(filteredSucs, sucSort);

  return (
    <div className="dashboard-wrapper">
      {/* Nav */}
      <nav className="nav-bar">
        <div className="nav-logo-area">
          <img src="/logo.jpg" alt="Alien Water Logo" className="nav-logo" />
          <span className="nav-brand">Alien Water</span>
        </div>
        <div className="nav-actions">
          <div className="user-badge"><span className="user-dot"></span><span className="user-name">{user.user_nombre} {user.user_apellido}</span></div>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="theme-toggle-btn" title="Cambiar Tema">
            {theme === 'dark' ? <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              : <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
          </button>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="dashboard-content">
        {/* Tab Navigation */}
        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'dispensado' ? 'active' : ''}`} onClick={() => setActiveTab('dispensado')}>💧 Dispensado</button>
          <button className={`tab-btn ${activeTab === 'recargas' ? 'active' : ''}`} onClick={() => setActiveTab('recargas')}>💰 Recargas</button>
          {user.user_rol === 'admin' && <button className={`tab-btn ${activeTab === 'sucursales' ? 'active' : ''}`} onClick={() => setActiveTab('sucursales')}>🏢 Sucursales</button>}
          <button className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>👤 Mi Perfil</button>
          <button onClick={fetchData} className="tab-refresh-btn" title="Actualizar Datos">🔄</button>
        </div>

        {/* Filters (dispensado & recargas) */}
        {activeTab !== 'sucursales' && activeTab !== 'perfil' && (
          <section className="filters-bar glass-card">
            <div className="filter-group">
              <label className="form-label">Sucursal</label>
              <select className="filter-select" value={selectedSucursal} disabled={user.user_rol === 'sucursal'} onChange={e => setSelectedSucursal(e.target.value)}>
                <option value="Todas">Todas</option>
                {sucursalOptions.map(c => <option key={c} value={c}>Sucursal {c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="form-label">Período</label>
              <select className="filter-select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                <option value="hoy">Hoy</option><option value="semana">7 Días</option><option value="mes">Este Mes</option><option value="mes_selector">Mes</option><option value="personalizado">Personalizado</option>
              </select>
            </div>
            {selectedPeriod === 'mes_selector' && <div className="filter-group"><label className="form-label">Mes</label><input type="month" className="filter-input" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} /></div>}
            {selectedPeriod === 'personalizado' && <div className="filter-group"><label className="form-label">Rango</label><div className="date-range-inputs"><input type="date" className="filter-input" value={dateDesde} onChange={e => setDateDesde(e.target.value)} /><span>a</span><input type="date" className="filter-input" value={dateHasta} onChange={e => setDateHasta(e.target.value)} /></div></div>}
            {activeTab === 'dispensado' && <div className="filter-group"><label className="form-label">Método</label><select className="filter-select" value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}><option value="Todos">Todos</option><option value="EFECTIVO">Efectivo</option><option value="QR">QR</option></select></div>}
          </section>
        )}

        {/* ═══════════ DISPENSADO ═══════════ */}
        {activeTab === 'dispensado' && (
          <>
            <section className="kpi-grid kpi-3">
              <div className="kpi-card glass-card"><h3 className="kpi-title">Total Ingresos</h3><div className="kpi-value-container"><span className="kpi-value">{fmt(totalBs)}</span><span className="kpi-unit">Bs</span></div></div>
              <div className="kpi-card glass-card"><h3 className="kpi-title">Agua Dispensada</h3><div className="kpi-value-container"><span className="kpi-value">{fmt(totalLts, 1)}</span><span className="kpi-unit">Litros</span></div></div>
              <div className="kpi-card glass-card"><h3 className="kpi-title">Ventas Totales</h3><div className="kpi-value-container"><span className="kpi-value">{totalServicios}</span><span className="kpi-unit">Servicios</span></div></div>
            </section>

            <div className="charts-grid">
              <div className="chart-card glass-card">
                <div className="chart-header">
                  <h3 className="chart-title" style={{ margin: 0 }}>{chartMetric === 'bolivares' ? 'Ingresos Diarios (Bs)' : 'Agua Dispensada Diaria (Lts)'}</h3>
                  <div className="metric-toggle-group">
                    <button onClick={() => setChartMetric('bolivares')} className={`metric-toggle-btn-item ${chartMetric === 'bolivares' ? 'active' : ''}`}>Bs</button>
                    <button onClick={() => setChartMetric('litros')} className={`metric-toggle-btn-item ${chartMetric === 'litros' ? 'active' : ''}`}>Lts</button>
                  </div>
                </div>
                <div className="chart-container-wrapper">{loadingData ? <div className="chart-placeholder">Cargando...</div> : filteredSales.length === 0 ? <div className="chart-placeholder muted">Sin datos para el período.</div> : <Bar options={chartOpts} data={salesBarData} />}</div>
              </div>
              <div className="chart-card glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="chart-header"><h3 className="chart-title">Distribución por Método</h3></div>
                <div className="chart-container-wrapper" style={{ flexGrow: 1, position: 'relative', height: '240px' }}>{loadingData ? <div className="chart-placeholder">Cargando...</div> : filteredSales.length === 0 ? <div className="chart-placeholder muted">Sin datos.</div> : <Pie options={pieOpts} data={pieData} />}</div>
              </div>
            </div>

            <section className="table-card glass-card">
              <div className="table-header-row">
                <h3 className="table-title">Detalle de Dispensado</h3>
                <input className="table-search" placeholder="🔍 Buscar..." value={salesSearch} onChange={e => setSalesSearch(e.target.value)} />
                <span className="table-count">{Math.min(salesLimit, sortedSales.length)} / {sortedSales.length}</span>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead><tr>
                    <th onClick={() => toggleSort(setSalesSort, 'id')}>ID<SortIcon sort={salesSort} field="id" /></th>
                    <th onClick={() => toggleSort(setSalesSort, 'created_at')}>Fecha<SortIcon sort={salesSort} field="created_at" /></th>
                    <th onClick={() => toggleSort(setSalesSort, 'litros')}>Litros<SortIcon sort={salesSort} field="litros" /></th>
                    <th onClick={() => toggleSort(setSalesSort, 'monto_bs')}>Monto<SortIcon sort={salesSort} field="monto_bs" /></th>
                    <th>Método</th><th>Sucursal</th>
                  </tr></thead>
                  <tbody>{sortedSales.slice(0, salesLimit).map(s => (
                    <tr key={s.id}><td>#{s.id}</td><td>{fmtDate(s.created_at)}</td><td>{s.litros} Lts</td><td style={{ fontWeight: 600 }}>{s.monto_bs} Bs</td>
                      <td><span className={`method-tag ${s.metodo === 'EFECTIVO' ? 'efectivo' : 'qr'}`}>{s.metodo === 'EFECTIVO' ? 'Efectivo' : 'QR'}</span></td><td>{s.sucursal || '100'}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              {sortedSales.length > salesLimit && <div className="table-load-more">
                <button onClick={() => setSalesLimit(p => p + 25)} className="btn-load-more">+25 más</button>
                <button onClick={() => setSalesLimit(p => p + 50)} className="btn-load-more">+50 más</button>
              </div>}
            </section>
          </>
        )}

        {/* ═══════════ RECARGAS ═══════════ */}
        {activeTab === 'recargas' && (
          <>
            <section className="kpi-grid kpi-3">
              <div className="kpi-card glass-card kpi-card-recharge"><h3 className="kpi-title">Saldo en Recargas</h3><div className="kpi-value-container"><span className="kpi-value">{fmt(totalSaldoRecargas)}</span><span className="kpi-unit">Bs</span></div><div className="kpi-sub">{filteredCreditos.length} usuarios activos</div></div>
              <div className="kpi-card glass-card kpi-card-recharge"><h3 className="kpi-title">Total Recargado</h3><div className="kpi-value-container"><span className="kpi-value">{fmt(totalRechBs)}</span><span className="kpi-unit">Bs</span></div><div className="kpi-sub">en el período</div></div>
              <div className="kpi-card glass-card kpi-card-recharge"><h3 className="kpi-title">Recargas Exitosas</h3><div className="kpi-value-container"><span className="kpi-value">{totalRechCount}</span><span className="kpi-unit">pagos</span></div><div className="kpi-sub">verificados</div></div>
            </section>

            <div className="charts-grid">
              <div className="chart-card glass-card">
                <div className="chart-header">
                  <h3 className="chart-title" style={{ margin: 0 }}>{rechChartMetric === 'bolivares' ? 'Recargas Diarias (Bs)' : 'Recargas Diarias (#)'}</h3>
                  <div className="metric-toggle-group">
                    <button onClick={() => setRechChartMetric('bolivares')} className={`metric-toggle-btn-item ${rechChartMetric === 'bolivares' ? 'active' : ''}`}>Bs</button>
                    <button onClick={() => setRechChartMetric('count')} className={`metric-toggle-btn-item ${rechChartMetric === 'count' ? 'active' : ''}`}>#</button>
                  </div>
                </div>
                <div className="chart-container-wrapper">{loadingData ? <div className="chart-placeholder">Cargando...</div> : filteredRecharges.length === 0 ? <div className="chart-placeholder muted">Sin datos para el período.</div> : <Bar options={chartOpts} data={rechBarData} />}</div>
              </div>
              <div className="chart-card glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="chart-header"><h3 className="chart-title">🏆 Top Recargadores</h3></div>
                <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '340px' }}>
                  {topRechargers.length === 0 ? <div className="chart-placeholder muted">Sin datos</div> : (
                    <table className="dashboard-table compact">
                      <thead><tr><th>#</th><th>Nombre</th><th>Monto</th><th>Saldo</th><th>Veces</th></tr></thead>
                      <tbody>{topRechargers.slice(0, 10).map((u, i) => (
                        <tr key={u.qr_code}>
                          <td style={{ fontWeight: 700, color: i < 3 ? '#f59e0b' : 'inherit' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                          <td><div className="cell-name">{u.nombre}</div><div className="cell-sub">{u.phone}</div></td>
                          <td style={{ fontWeight: 600 }}>{fmt(u.totalBs, 0)} Bs</td>
                          <td><span className="method-tag recarga">{u.saldoActual} Bs</span></td>
                          <td style={{ textAlign: 'center' }}>{u.count}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <section className="table-card glass-card">
              <div className="table-header-row">
                <h3 className="table-title">Detalle de Recargas</h3>
                <input className="table-search" placeholder="🔍 Buscar por nombre, teléfono, QR, referencia..." value={rechSearch} onChange={e => setRechSearch(e.target.value)} />
                <span className="table-count">{Math.min(rechLimit, sortedRecharges.length)} / {sortedRecharges.length}</span>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead><tr>
                    <th onClick={() => toggleSort(setRechSort, 'nombre')}>Nombre<SortIcon sort={rechSort} field="nombre" /></th>
                    <th onClick={() => toggleSort(setRechSort, 'phone')}>Teléfono<SortIcon sort={rechSort} field="phone" /></th>
                    <th onClick={() => toggleSort(setRechSort, 'qr_code')}>Código QR<SortIcon sort={rechSort} field="qr_code" /></th>
                    <th onClick={() => toggleSort(setRechSort, 'fecha')}>Fecha<SortIcon sort={rechSort} field="fecha" /></th>
                    <th onClick={() => toggleSort(setRechSort, 'cantidad')}>Monto<SortIcon sort={rechSort} field="cantidad" /></th>
                    <th onClick={() => toggleSort(setRechSort, 'saldoActual')}>Saldo<SortIcon sort={rechSort} field="saldoActual" /></th>
                    <th>Referencia (PM)</th>
                  </tr></thead>
                  <tbody>{sortedRecharges.slice(0, rechLimit).map(r => (
                    <tr key={r.id}>
                      <td className="cell-name-col">{r.nombre}</td>
                      <td style={{ fontSize: '13px' }}>{r.phone}</td>
                      <td><span className="method-tag recarga">{r.qr_code}</span></td>
                      <td>{fmtDate(r.fecha)}</td>
                      <td style={{ fontWeight: 600 }}>{fmt(r.cantidad, 0)} Bs</td>
                      <td>{fmt(r.saldoActual, 0)} Bs</td>
                      <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>{r.referencia}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {sortedRecharges.length > rechLimit && <div className="table-load-more">
                <button onClick={() => setRechLimit(p => p + 25)} className="btn-load-more">+25 más</button>
                <button onClick={() => setRechLimit(p => p + 50)} className="btn-load-more">+50 más</button>
              </div>}
            </section>
          </>
        )}

        {/* ═══════════ MI PERFIL ═══════════ */}
        {activeTab === 'perfil' && (
          <section className="profile-section">
            <div className="section-header-row">
              <h2 className="section-title">Mi Perfil</h2>
            </div>
            
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
              <button 
                type="button"
                onClick={() => setActiveTab('dispensado')}
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  fontSize: '18px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  zIndex: 10
                }}
                title="Cerrar"
              >
                ✕
              </button>
              <h3 className="table-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>⚙️ Configuración de Cuenta</h3>
              
              {loadingProfile && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--accent-neon)' }}>🔄 Cargando datos del perfil...</div>}
              
              {!loadingProfile && (
                <form onSubmit={saveProfile}>
                  {profileMsg && (
                    <div className={profileMsgType === 'error' ? 'error-alert' : 'success-alert'} style={{ marginBottom: '20px' }}>
                      {profileMsg}
                    </div>
                  )}

                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-neon)', marginBottom: '14px' }}>Datos Personales</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nombre *</label>
                      <input type="text" required className="form-input" value={profileForm.nombre} onChange={e => setProfileForm(p => ({ ...p, nombre: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Apellido *</label>
                      <input type="text" required className="form-input" value={profileForm.apellido} onChange={e => setProfileForm(p => ({ ...p, apellido: e.target.value }))} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Correo Electrónico *</label>
                      <input type="email" required className="form-input" value={profileForm.correo} onChange={e => setProfileForm(p => ({ ...p, correo: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Teléfono de Contacto *</label>
                      <input type="text" required className="form-input" placeholder="Ej: 04141234567" value={profileForm.telefono} onChange={e => setProfileForm(p => ({ ...p, telefono: e.target.value }))} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ciudad *</label>
                      <input type="text" required className="form-input" placeholder="Ej: Maracaibo" value={profileForm.ciudad} onChange={e => setProfileForm(p => ({ ...p, ciudad: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dirección *</label>
                      <input type="text" required className="form-input" placeholder="Ej: Av. Bella Vista" value={profileForm.direccion} onChange={e => setProfileForm(p => ({ ...p, direccion: e.target.value }))} />
                    </div>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-neon)', marginTop: '24px', marginBottom: '14px' }}>Datos de Pago Móvil (Financiero)</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Teléfono Pago Móvil *</label>
                      <input type="text" required className="form-input" placeholder="Ej: 04126616502 (11 dígitos continuos)" value={profileForm.pm_telefono} onChange={e => setProfileForm(p => ({ ...p, pm_telefono: e.target.value.replace(/\D/g, '').slice(0, 11) }))} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sin letras ni caracteres especiales.</span>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cédula de Identidad *</label>
                      <input type="text" required className="form-input" placeholder="Ej: 12345678" value={profileForm.pm_cedula} onChange={e => setProfileForm(p => ({ ...p, pm_cedula: e.target.value.replace(/\D/g, '') }))} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Solo números.</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Banco de Destino *</label>
                    <select required className="form-input" value={profileForm.pm_banco} onChange={e => setProfileForm(p => ({ ...p, pm_banco: e.target.value }))}>
                      <option value="">-- Selecciona un banco --</option>
                      {BANCOS_VENEZUELA.map(b => (
                        <option key={b.code} value={`${b.code} - ${b.name}`}>{b.name} ({b.code})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={loadingProfile} className="btn-primary btn-sm">
                      {loadingProfile ? 'Guardando...' : 'Actualizar Datos'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {/* ═══════════ SUCURSALES ═══════════ */}
        {activeTab === 'sucursales' && user.user_rol === 'admin' && (
          <>
            <div className="section-header-row">
              <h2 className="section-title">Gestión de Sucursales</h2>
              <button onClick={() => openSucModal()} className="btn-primary btn-sm">+ Nueva Sucursal</button>
            </div>

            <section className="table-card glass-card">
              <div className="table-header-row">
                <h3 className="table-title">Listado de Sucursales</h3>
                <input className="table-search" placeholder="🔍 Buscar..." value={sucSearch} onChange={e => setSucSearch(e.target.value)} />
              </div>
              {sucursales.length === 0 ? (
                <div className="empty-state">
                  <p>⚠️ La tabla de sucursales aún no existe en la base de datos.</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ejecuta el archivo <code>create_sucursales.sql</code> en tu SQL Editor de InsForge.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead><tr>
                      <th onClick={() => toggleSort(setSucSort, 'codigo')}>Código<SortIcon sort={sucSort} field="codigo" /></th>
                      <th onClick={() => toggleSort(setSucSort, 'nombre_negocio')}>Negocio<SortIcon sort={sucSort} field="nombre_negocio" /></th>
                      <th onClick={() => toggleSort(setSucSort, 'ciudad')}>Ciudad<SortIcon sort={sucSort} field="ciudad" /></th>
                      <th>Responsable</th><th>Email</th><th>Teléfono</th>
                      <th onClick={() => toggleSort(setSucSort, 'tipo_maquina')}>Máquina<SortIcon sort={sucSort} field="tipo_maquina" /></th>
                      <th>Acciones</th>
                    </tr></thead>
                    <tbody>{sortedSucs.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 700 }}>{s.codigo}</td>
                        <td>{s.nombre_negocio || '—'}</td>
                        <td>{s.ciudad || '—'}</td>
                        <td>{s.responsable_nombre ? `${s.responsable_nombre} ${s.responsable_apellido || ''}` : '—'}</td>
                        <td style={{ fontSize: '13px' }}>{s.email || '—'}</td>
                        <td>{s.telefono || '—'}</td>
                        <td><span className={`method-tag ${s.tipo_maquina === 'moneda_qr' ? 'qr' : 'efectivo'}`}>{s.tipo_maquina === 'moneda_qr' ? 'Moneda + QR' : 'Moneda'}</span></td>
                        <td><button onClick={() => openSucModal(s)} className="btn-edit">✏️ Editar</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Sucursal Modal */}
            {showSucModal && (
              <div className="modal-overlay">
                <div className="modal-card glass-card">
                  <h3 className="modal-title">{editingSuc ? '✏️ Editar Sucursal' : '➕ Nueva Sucursal'}</h3>

                  {sucMsg && (
                    <div className={sucMsg.startsWith('❌') ? 'error-alert' : 'success-alert'} style={{ marginBottom: '16px' }}>
                      {sucMsg}
                      {inviteLink && (
                        <div style={{ marginTop: '10px', wordBreak: 'break-all' }}>
                          <strong>Enlace de configuración:</strong><br />
                          <code style={{ fontSize: '12px', color: 'var(--accent-neon)', userSelect: 'all', cursor: 'pointer' }}>{inviteLink}</code>
                          <button onClick={() => { navigator.clipboard.writeText(inviteLink); }} className="btn-edit" style={{ marginLeft: '8px' }}>📋 Copiar</button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="modal-form">
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">Código *</label><input className="form-input" value={sucForm.codigo} disabled={true} placeholder="Auto-generado" /></div>
                      <div className="form-group"><label className="form-label">Nombre del Negocio</label><input className="form-input" value={sucForm.nombre_negocio} placeholder="Nombre del local" onChange={e => setSucForm(p => ({ ...p, nombre_negocio: e.target.value }))} /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">Ciudad *</label><input className="form-input" value={sucForm.ciudad} placeholder="Maracaibo" onChange={e => setSucForm(p => ({ ...p, ciudad: e.target.value }))} /></div>
                      <div className="form-group"><label className="form-label">Tipo de Máquina</label><select className="form-input" value={sucForm.tipo_maquina} onChange={e => setSucForm(p => ({ ...p, tipo_maquina: e.target.value }))}><option value="moneda">Moneda</option><option value="moneda_qr">Moneda + QR</option></select></div>
                    </div>
                    <div className="form-group"><label className="form-label">Dirección *</label><input className="form-input" value={sucForm.direccion} placeholder="Av. Principal..." onChange={e => setSucForm(p => ({ ...p, direccion: e.target.value }))} /></div>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">Nombre Responsable *</label><input className="form-input" value={sucForm.responsable_nombre} placeholder="Nombre" onChange={e => setSucForm(p => ({ ...p, responsable_nombre: e.target.value }))} /></div>
                      <div className="form-group"><label className="form-label">Apellido Responsable *</label><input className="form-input" value={sucForm.responsable_apellido} placeholder="Apellido" onChange={e => setSucForm(p => ({ ...p, responsable_apellido: e.target.value }))} /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">Teléfono *</label><input className="form-input" value={sucForm.telefono} placeholder="04XX-XXXXXXX" onChange={e => setSucForm(p => ({ ...p, telefono: e.target.value }))} /></div>
                      <div className="form-group">
                        <label className="form-label">Email del Responsable * {!editingSuc && <span style={{ color: 'var(--accent-neon)', fontSize: '12px' }}>(invitación al panel)</span>}</label>
                        <input type="email" className="form-input" value={sucForm.email} placeholder="responsable@correo.com" onChange={e => setSucForm(p => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button onClick={() => setShowSucModal(false)} disabled={sucSaving} className="btn-logout">Cancelar</button>
                    <button onClick={saveSucursal} disabled={sucSaving || !sucForm.codigo} className="btn-primary btn-sm">
                      {sucSaving ? 'Guardando...' : (editingSuc ? 'Guardar Cambios' : 'Crear y Enviar Invitación')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
