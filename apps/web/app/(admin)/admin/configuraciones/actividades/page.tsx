export default function ConfiguracionActividadesPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </a>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
              Actividades
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              Tipos de clases y servicios que ofreces
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            + Nueva Actividad
          </button>
        </div>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <table className="w-full">
          <thead style={{ backgroundColor: "var(--color-bg)" }}>
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Nombre
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Duración
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Precio
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Estado
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Clase de Tenis Individual", duration: "60 min", price: "$1,500", status: "Activa" },
              { name: "Clase de Pádel Grupal", duration: "90 min", price: "$800", status: "Activa" },
              { name: "Alquiler de Cancha", duration: "60 min", price: "$500", status: "Activa" },
            ].map((actividad, idx) => (
              <tr key={idx} className="border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                <td className="px-6 py-4 font-medium" style={{ color: "var(--color-text-main)" }}>
                  {actividad.name}
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {actividad.duration}
                </td>
                <td className="px-6 py-4 font-bold" style={{ color: "var(--color-text-main)" }}>
                  {actividad.price}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "var(--color-success)", color: "white" }}
                  >
                    {actividad.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




