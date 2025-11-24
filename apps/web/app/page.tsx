import { Button } from "@repo/ui";
import { ArrowRight, Calendar, CheckCircle2, ChevronRight, CreditCard, Users, Shield, UserCircle } from "lucide-react";
import Link from "next/link";
import { getUser } from "@repo/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export default async function HomePage() {
  // Verificar si el usuario ya está autenticado
  const user = await getUser();
  
  if (user) {
    const role = getUserRole(user);
    // Redirigir según el rol
    if (role === 'SUPER_ADMIN' || role === 'CLUB_ADMIN' || role === 'PROFESSIONAL') {
      redirect('/admin');
    } else if (role === 'STUDENT') {
      redirect('/student');
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-main">
      {/* Navigation */}
      <nav className="border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
              G
            </div>
            <span>GestionClub</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-text-main transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="hover:text-text-main transition-colors">
              Precios
            </a>
            <a href="/demo" className="hover:text-text-main transition-colors">
              Demo
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/register">
              <Button size="sm">Empezar Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-subtle text-xs font-medium text-text-muted mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Nueva versión disponible v2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-text-main">
            Gestión de clubes y escuelas{" "}
            <span className="text-primary relative whitespace-nowrap">
              deportivas
              <svg
                className="absolute -bottom-2 left-0 w-full h-2 text-primary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Centraliza turnos, alumnos, pagos y profesores en una sola plataforma. Diseñado para
            escuelas de tenis, clubes de pádel y complejos deportivos.
          </p>

          {/* Botones de Acceso */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/auth/login?redirect=/admin">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base gap-3 shadow-lg shadow-primary/20 bg-primary hover:opacity-90"
              >
                <Shield size={20} />
                Acceso Admin
              </Button>
            </Link>
            <Link href="/auth/login?redirect=/student">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base bg-surface border-2 border-primary/20 hover:border-primary/40 gap-3"
              >
                <UserCircle size={20} />
                Alumnos / Clientes
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base gap-2"
              >
                Ver Demo Interactiva <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base"
              >
                Hablar con Ventas
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-border-subtle/50 flex flex-col items-center gap-4">
            <p className="text-sm text-text-muted">Confían en nosotros</p>
            <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos */}
              <div className="h-8 w-24 bg-text-muted/20 rounded" />
              <div className="h-8 w-24 bg-text-muted/20 rounded" />
              <div className="h-8 w-24 bg-text-muted/20 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface border-y border-border-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas para crecer</h2>
            <p className="text-text-muted text-lg">
              Deja de usar Excel y WhatsApp. Automatiza tu gestión diaria con herramientas
              profesionales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="text-blue-500" />}
              title="Gestión de Alumnos"
              description="Base de datos completa con historial, fichas médicas y seguimiento de asistencia."
            />
            <FeatureCard
              icon={<Calendar className="text-orange-500" />}
              title="Agenda Inteligente"
              description="Control visual de canchas y profesores. Repeticiones automáticas y lista de espera."
            />
            <FeatureCard
              icon={<CreditCard className="text-green-500" />}
              title="Pagos & Finanzas"
              description="Seguimiento de cuotas, ventas de mostrador y reportes de caja diarios."
            />
            <FeatureCard
              icon={<CheckCircle2 className="text-purple-500" />}
              title="Portal de Alumnos"
              description="Permite que tus alumnos reserven y paguen sus clases desde su celular."
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-bg">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Diseñado para tu modelo de negocio</h2>
              <div className="space-y-6">
                <UseCase
                  title="Escuelas de Tenis / Pádel"
                  description="Organiza grupos por niveles, gestiona profesores y canchas en simultáneo."
                />
                <UseCase
                  title="Clubes Multi-Deporte"
                  description="Administra distintas disciplinas, sedes y membresías familiares."
                />
                <UseCase
                  title="Profesores Particulares"
                  description="Simplifica tu agenda y cobros con una herramienta simple y potente."
                />
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Ver todos los casos de uso <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] bg-surface rounded-2xl border border-border-subtle shadow-2xl overflow-hidden group">
              {/* Placeholder for App Screenshot */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg" />
                  </div>
                  <p className="text-text-muted font-medium">Vista previa del Panel Admin</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-xl border border-gray-100 max-w-xs transform rotate-3 transition-transform group-hover:rotate-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Pago Recibido</p>
                    <p className="text-xs text-gray-500">Hace 2 minutos</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Juan Pérez abonó la cuota de Marzo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-surface border-t border-border-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Empieza a profesionalizar tu club hoy</h2>
          <p className="text-text-muted mb-8 max-w-xl mx-auto">
            Únete a más de 100 clubes que ya gestionan sus actividades con nosotros. Prueba gratis
            por 14 días, sin tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/auth/login?redirect=/admin">
              <Button size="lg" className="h-14 px-8 text-base gap-3 shadow-xl shadow-primary/25">
                <Shield size={20} />
                Acceso Admin
              </Button>
            </Link>
            <Link href="/auth/login?redirect=/student">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base gap-3 border-2"
              >
                <UserCircle size={20} />
                Alumnos / Clientes
              </Button>
            </Link>
          </div>
          <Link href="/auth/register">
            <Button variant="ghost" size="lg" className="h-12 px-8 text-base">
              Crear cuenta gratis
            </Button>
          </Link>
          <p className="mt-4 text-xs text-text-muted">
            ¿Necesitas ayuda?{" "}
            <Link href="/contacto" className="text-primary hover:underline">
              Contacta con nosotros
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-bg border border-border-subtle hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
      <div className="mb-4 p-3 bg-surface rounded-lg w-fit group-hover:scale-110 transition-transform border border-border-subtle">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-text-main">{title}</h3>
      <p className="text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function UseCase({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <CheckCircle2 size={14} />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-text-main">{title}</h3>
        <p className="text-text-muted">{description}</p>
      </div>
    </div>
  );
}
