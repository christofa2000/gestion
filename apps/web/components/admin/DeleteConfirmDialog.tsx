'use client'

/**
 * Componente: Diálogo de confirmación de eliminación
 * 
 * Componente reutilizable para confirmar eliminaciones
 */

import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => Promise<void>
  onCancel?: () => void
  itemName?: string
}

export function DeleteConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  itemName
}: DeleteConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (isDeleting) return // Prevenir múltiples llamadas
    
    setIsDeleting(true)
    try {
      await onConfirm()
      setIsOpen(false)
      // No llamar router.refresh aquí, dejar que el componente padre lo maneje
    } catch (error) {
      console.error('Error al eliminar:', error)
      setIsDeleting(false) // Restaurar estado si hay error
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel?.()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                  {title}
                </h3>
              </div>

              <p className="text-[var(--color-text-muted)] mb-6">
                {message}
                {itemName && (
                  <span className="font-semibold text-[var(--color-text-main)] block mt-2">
                    "{itemName}"
                  </span>
                )}
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-main)] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

