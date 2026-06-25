import React, { useState } from 'react';
import { useClientStore, type Client } from '../store/clients';
import { useSettingsStore } from '../store/settings';
import { SignatureUpload } from '../components/SignatureUpload';
import { FileText, Edit, Trash2, Plus, X } from 'lucide-react';
import { generateCancellationForm } from '../utils/pdfGenerator';

export const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const settings = useSettingsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: '',
    icNo: '',
    telNumber: '',
    address: '',
    email: '',
    bankName: '',
    bankNumber: '',
    signature: '',
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      icNo: '',
      telNumber: '',
      address: '',
      email: '',
      bankName: '',
      bankNumber: '',
      signature: '',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setFormData({
      name: client.name,
      icNo: client.icNo,
      telNumber: client.telNumber,
      address: client.address,
      email: client.email,
      bankName: client.bankName,
      bankNumber: client.bankNumber,
      signature: client.signature,
    });
    setEditingId(client.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editingId) {
      updateClient(editingId, formData);
    } else {
      addClient({ ...formData, id: crypto.randomUUID() });
    }
    closeModal();
  };

  const generatePDF = (client: Client) => {
    generateCancellationForm(client, settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Manager</h1>
          <p className="mt-2 text-sm text-gray-600">Manage client details and generate cancellation forms.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-tsla-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tsla-red"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {clients.length === 0 ? (
            <li className="px-4 py-12 text-center text-gray-500">No clients added yet. Click "Add Client" to start.</li>
          ) : (
            clients.map((client) => (
              <li key={client.id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-medium text-tsla-red truncate">{client.name}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {client.icNo}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:space-x-6 flex-wrap gap-y-2">
                    <p>{client.email}</p>
                    <p>{client.telNumber}</p>
                    <p>{client.bankName} - {client.bankNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <button
                    onClick={() => generatePDF(client)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tsla-red"
                  >
                    <FileText className="h-4 w-4 mr-1 text-gray-400" />
                    Generate Form
                  </button>
                  <button onClick={() => openEditModal(client)} className="text-gray-400 hover:text-gray-900">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => deleteClient(client.id)} className="text-red-400 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {editingId ? 'Edit Client' : 'Add New Client'}
                  </h3>
                  <div className="mt-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">IC No.</label>
                        <input
                          type="text"
                          name="icNo"
                          value={formData.icNo}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Tel Number</label>
                        <input
                          type="text"
                          name="telNumber"
                          value={formData.telNumber}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          name="address"
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Bank Number</label>
                        <input
                          type="text"
                          name="bankNumber"
                          value={formData.bankNumber}
                          onChange={handleChange}
                          className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      <div className="col-span-6">
                        <SignatureUpload
                          label="Client Signature"
                          initialDataUrl={formData.signature}
                          onSave={(dataUrl) => setFormData({ ...formData, signature: dataUrl })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tsla-red text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tsla-red sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Client
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tsla-red sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
