export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-text-main)" }}>
          Contáctanos
        </h1>
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          ¿Tienes preguntas? Estamos aquí para ayudarte
        </p>
      </div>

      <div
        className="p-8 rounded-xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Mensaje
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Enviar Mensaje
          </button>
        </form>
      </div>

      {/* Información de contacto */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-xl border text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
            Email
          </h3>
          <p style={{ color: "var(--color-text-muted)" }}>contacto@gestion-club.com</p>
        </div>
        <div
          className="p-6 rounded-xl border text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
            Teléfono
          </h3>
          <p style={{ color: "var(--color-text-muted)" }}>+54 11 1234-5678</p>
        </div>
      </div>
    </div>
  );
}

