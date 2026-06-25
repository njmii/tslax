import React, { useState } from 'react';
import { useSettingsStore } from '../store/settings';
import { SignaturePad } from '../components/SignaturePad';

export const Settings: React.FC = () => {
  const settings = useSettingsStore();

  const [formData, setFormData] = useState({
    agentName: settings.agentName,
    agentId: settings.agentId,
    agentIc: settings.agentIc,
    witnessName: settings.witnessName,
    witnessIc: settings.witnessIc,
  });

  const [agentSig, setAgentSig] = useState(settings.agentSignature);
  const [witnessSig, setWitnessSig] = useState(settings.witnessSignature);

  const [savedMessage, setSavedMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    settings.updateSettings({
      ...formData,
      agentSignature: agentSig,
      witnessSignature: witnessSig,
    });
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure Agent and Witness details. These will be used for auto-filling PDFs.
        </p>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Agent Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Information for the primary agent handling the client.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">
                  Agent Name
                </label>
                <input
                  type="text"
                  name="agentName"
                  id="agentName"
                  value={formData.agentName}
                  onChange={handleChange}
                  className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="agentId" className="block text-sm font-medium text-gray-700">
                  Agent ID
                </label>
                <input
                  type="text"
                  name="agentId"
                  id="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="agentIc" className="block text-sm font-medium text-gray-700">
                  Agent IC No.
                </label>
                <input
                  type="text"
                  name="agentIc"
                  id="agentIc"
                  value={formData.agentIc}
                  onChange={handleChange}
                  className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>

              <div className="col-span-6">
                <SignaturePad
                  label="Agent Signature"
                  initialDataUrl={agentSig}
                  onSave={setAgentSig}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Witness Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Information for the witness.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="witnessName" className="block text-sm font-medium text-gray-700">
                  Witness Name
                </label>
                <input
                  type="text"
                  name="witnessName"
                  id="witnessName"
                  value={formData.witnessName}
                  onChange={handleChange}
                  className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="witnessIc" className="block text-sm font-medium text-gray-700">
                  Witness IC No.
                </label>
                <input
                  type="text"
                  name="witnessIc"
                  id="witnessIc"
                  value={formData.witnessIc}
                  onChange={handleChange}
                  className="mt-1 focus:ring-tsla-red focus:border-tsla-red block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>

              <div className="col-span-6">
                <SignaturePad
                  label="Witness Signature"
                  initialDataUrl={witnessSig}
                  onSave={setWitnessSig}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-4">
        {savedMessage && <span className="text-green-600 text-sm font-medium">{savedMessage}</span>}
        <button
          onClick={handleSave}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-tsla-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tsla-red"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
