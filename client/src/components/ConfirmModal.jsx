export default function ConfirmModal({ title = 'Confirmar', message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded border">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Confirmar</button>
        </div>
      </div>
    </div>
  )
}
