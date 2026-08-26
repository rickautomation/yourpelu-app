"use client";

interface AddClientFormProps {
  newClientName: string;
  setNewClientName: (val: string) => void;
  newClientLastname: string;
  setNewClientLastname: (val: string) => void;
  setSelectedClient: (client: any) => void;
  setShowAdd: (val: boolean) => void;
  setShowClientPopup: (val: boolean) => void;
  addClient: (client: { name: string; lastname: string }) => Promise<any>;
}

export default function AddClientForm({
  newClientName,
  setNewClientName,
  newClientLastname,
  setNewClientLastname,
  setSelectedClient,
  setShowAdd,
  setShowClientPopup,
  addClient,
}: AddClientFormProps) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const newClient = { name: newClientName, lastname: newClientLastname };
        const created = await addClient(newClient);

        if (created) {
          setSelectedClient(created);
        }

        // Cerramos el form y limpiamos inputs
        setShowAdd(false);
        setNewClientName("");
        setNewClientLastname("");
        setShowClientPopup(false);
      }}
      className="flex flex-col gap-3"
    >
      <h2 className="text-center text-lg font-semibold">Nuevo Cliente</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={newClientName}
        onChange={(e) => setNewClientName(e.target.value)}
        className="px-2 py-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={newClientLastname}
        onChange={(e) => setNewClientLastname(e.target.value)}
        className="px-2 py-2 rounded bg-gray-700 text-white"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setShowAdd(false)}
          className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
