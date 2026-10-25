'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register } = useAuth();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/mi-cuenta');
    }
  }, [user, router]);

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const fillDemo = () => {
    setMode('login');
    setIdentifier('sebastian_v');
    setPassword('cliente123');
    setErrorMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      const res = login(identifier.trim(), password);
      if (!res.success) {
        setErrorMsg(res.error || 'Credenciales no validas.');
        setIsSubmitting(false);
        return;
      }
      setSuccessMsg('Acceso verificado. Redirigiendo...');
      setTimeout(() => router.push('/mi-cuenta'), 700);
    } catch {
      setErrorMsg('Error de conexion. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      const res = register(name, lastName, username, phone, regPassword);
      if (!res.success) {
        setErrorMsg(res.error || 'Ocurrio un error al crear la cuenta.');
        setIsSubmitting(false);
        return;
      }
      setSuccessMsg('Cuenta creada. Redirigiendo...');
      setTimeout(() => router.push('/mi-cuenta'), 800);
    } catch {
      setErrorMsg('Error de validacion. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lux-auth-wrapper">
      <div className="lux-orb lux-orb-1" aria-hidden="true" />
      <div className="lux-orb lux-orb-2" aria-hidden="true" />
      <div className="lux-orb lux-orb-3" aria-hidden="true" />
      <div className="lux-auth-veil" aria-hidden="true" />

      <main className="lux-auth-main">
        <div className={`lux-auth-card ${mounted ? 'is-visible' : ''}`}>
          <div className="lux-card-shine" aria-hidden="true" />

          <div className="lux-auth-brand">
            <Link href="/" className="lux-brand-link">
              <span className="lux-brand-name">Espacio Intimo</span>
              <span className="lux-brand-sub">Miraflores · Lima</span>
            </Link>
          </div>

          <div className="lux-mode-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'login'}
              onClick={() => switchMode('login')}
              className={`lux-mode-tab ${mode === 'login' ? 'active' : ''}`}>
              Iniciar sesion
            </button>
            <button type="button" role="tab" aria-selected={mode === 'register'}
              onClick={() => switchMode('register')}
              className={`lux-mode-tab ${mode === 'register' ? 'active' : ''}`}>
              Crear cuenta
            </button>
          </div>

          <div className="lux-auth-header">
            <p className="lux-auth-eyebrow">Acceso Privado</p>
            <h1 className="lux-auth-title">
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Unete al club'}
            </h1>
            <p className="lux-auth-desc">
              {mode === 'login'
                ? 'Ingresa con tu usuario y contrasena.'
                : 'Crea tu cuenta para gestionar citas y preferencias.'}
            </p>
          </div>

          {errorMsg && (
            <div className="lux-auth-feedback lux-feedback-error" role="alert">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="lux-auth-feedback lux-feedback-success" role="status">{successMsg}</div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="lux-auth-form" noValidate>
              <div className="lux-field">
                <label htmlFor="login-identifier" className="lux-field-label">Usuario</label>
                <input
                  id="login-identifier"
                  type="text"
                  required
                  placeholder="nombre de usuario"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="lux-input"
                  autoComplete="username"
                  autoCapitalize="none"
                />
              </div>
              <div className="lux-field">
                <label htmlFor="login-password" className="lux-field-label">Contrasena</label>

                <div className="lux-input-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="contrasena"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="lux-input lux-input-password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="lux-toggle-pw"
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Ver contrasena'}>
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="lux-submit-btn">
                <span className="lux-submit-text">
                  {isSubmitting ? 'Verificando...' : 'Ingresar'}
                </span>
                <span className="lux-submit-shimmer" aria-hidden="true" />
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="lux-auth-form" noValidate>
              <div className="lux-two-col">
                <div className="lux-field">
                  <label htmlFor="reg-name" className="lux-field-label">Nombre</label>
                  <input id="reg-name" type="text" required placeholder="nombre"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="lux-input" autoComplete="given-name" />
                </div>
                <div className="lux-field">
                  <label htmlFor="reg-lastname" className="lux-field-label">Apellido</label>
                  <input id="reg-lastname" type="text" required placeholder="apellido"
                    value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className="lux-input" autoComplete="family-name" />
                </div>
              </div>
              <div className="lux-field">
                <label htmlFor="reg-username" className="lux-field-label">Usuario</label>
                <div className="lux-input-prefix-wrap">
                  <span className="lux-input-prefix" aria-hidden="true">@</span>
                  <input id="reg-username" type="text" required
                    placeholder="usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="lux-input lux-input-prefixed"
                    autoComplete="username" autoCapitalize="none" maxLength={30} />
                </div>
                <span className="lux-field-hint-below">
                  Solo letras, numeros y guion bajo. Minimo 3 caracteres.
                </span>
              </div>
              <div className="lux-field">
                <label htmlFor="reg-phone" className="lux-field-label">Telefono</label>
                <input id="reg-phone" type="tel" required placeholder="numero de telefono"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="lux-input" autoComplete="tel" />
              </div>
              <div className="lux-field">
                <div className="lux-field-row">
                  <label htmlFor="reg-password" className="lux-field-label">Contrasena</label>
                  <span className="lux-field-hint">Minimo 6 caracteres</span>
                </div>
                <div className="lux-input-wrap">
                  <input id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    required placeholder="contrasena"
                    value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    className="lux-input lux-input-password" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                    className="lux-toggle-pw"
                    aria-label={showRegPassword ? 'Ocultar contrasena' : 'Ver contrasena'}>
                    {showRegPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="lux-submit-btn">
                <span className="lux-submit-text">
                  {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
                </span>
                <span className="lux-submit-shimmer" aria-hidden="true" />
              </button>
            </form>
          )}

          {mode === 'login' && (
            <div className="lux-demo-access">
              <span className="lux-demo-label">Acceso rapido de prueba</span>
              <div className="lux-demo-row">
                <button type="button" onClick={fillDemo} className="lux-demo-btn">
                  Socio · Sebastian
                </button>
              </div>
            </div>
          )}

          <div className="lux-auth-footer">
            <Link href="/" className="lux-return-link">Volver al inicio</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="lux-loading-screen">Cargando acceso seguro...</div>}>
      <LoginContent />
    </Suspense>
  );
}
