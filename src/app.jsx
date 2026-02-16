import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, Circle } from 'lucide-react';

const AsBuiltFormSelector = () => {
  const [selectedWork, setSelectedWork] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form definitions
  const forms = {
    '360S014EA': 'As-built Low Voltage Connection Record',
    '360S014EB': 'As-built Electrical Distribution Record',
    '360S014EC': 'As-built Pole Record (PDF or Excel)',
    '360S014ED': 'As-built LV Box Record',
    '360S014EE': 'As-built Electrical Equipment Record',
    '360S014EF': 'As-built Zone Substation Equipment Record',
    '360S014EG': 'As-built Transformer Record',
    '360S014EH': 'As-built Equipment Record Cards',
    '360S014EI': 'As-built Underground Network Distribution Panel Layout Record',
    '360S014EJ': 'As-built Earth Installation and Test Record',
    '360S014EK': 'As-built Streetlight Alteration/Installation Record',
    '360S014EL': 'As-built Cable Test Report',
    '360S014EM': 'As-built Requirements Checklist - Zone Substation',
    '360S014EO': 'As-built Transformer ICP Change Form',
    '360S014EP': 'As-built Protection Relay Record',
    '360S014EQ': 'Commissioning Conductor Tension Method & Results/Run Form',
    '360S014ER': 'As-built Line Fault Indicator Record LM2SAT',
    '360S014ES': 'As-built Line Fault Indicator Record PM3SAT',
    '360S014ET': 'As-built Line Fault Indicator Record PM6SAT',
    '360S014EU': 'As-built Line Fault Indicator Record PM9SAT',
    '360S014EV': 'As-built Network Communications Equipment Record',
    '360S014EW': 'As-built Remote Terminal Unit Equipment Record',
    '360F019CA': 'Drawing Approval Form',
    'MFG_CERT': 'Manufacturer Test Certificates'
  };

  // Work type to forms mapping based on the matrix
  const workTypeMapping = {
    'LV Service Connection - OH and UG': {
      forms: ['360S014EA'],
      notes: 'New or Altered Connections'
    },
    'LV Distribution Network': {
      forms: ['360S014EB', '360S014EC', '360S014EL'],
      notes: 'For UG Distribution Network (360S014EL)'
    },
    'HV Distribution Network': {
      forms: ['360S014EB', '360S014EC', '360S014EE', '360S014EL'],
      notes: 'For UG Distribution Network (360S014EL)'
    },
    'Poles': {
      forms: ['360S014EC', '360S014EE'],
      notes: 'Either As-Built Pole Record Form or Network Asset Design Register can be used'
    },
    'Crossarms': {
      forms: ['360S014EC']
    },
    'Equipment (installation/changes)': {
      forms: ['360S014EE', '360S014EH', '360S014EJ', 'MFG_CERT'],
      notes: 'EE: Any equipment not specified elsewhere; EH: For Critical Spares; EJ: Where an Earth Test has been taken'
    },
    'Zone Substations': {
      forms: ['360S014EF', '360S014EE', '360S014EH', '360F019CA'],
      notes: 'For any Engineering as-built drawings (360F019CA)'
    },
    'Transformers - Overhead': {
      forms: ['360S014EC', '360S014EG', '360S014EH', '360S014EE', '360S014EJ', 'MFG_CERT'],
      notes: 'Equip Record Card or Form (EG or EH)'
    },
    'Transformers - Ground mount': {
      forms: ['360S014EG', '360S014EH', '360S014EE', '360S014EJ', 'MFG_CERT'],
      notes: 'Equip Record Card or Form (EG or EH)'
    },
    'LV Service Box': {
      forms: ['360S014ED'],
      notes: 'For boxes containing service fuses only'
    },
    'LV Distribution Box': {
      forms: ['360S014EC', '360S014ED', '360S014EJ'],
      notes: 'For vertical disconnects (Pillar) use ED; For horizontal disconnects (Link) use ED'
    },
    'Earth Test / Alterations': {
      forms: ['360S014EJ']
    },
    'Streetlights': {
      forms: ['360S014EK']
    },
    'Subdivisions - Underground': {
      forms: ['360S014EC', '360S014EB', '360S014EG', '360S014EH', '360S014EE', '360S014EJ', '360S014EL', 'MFG_CERT'],
      notes: 'A plan detailing all cable details is allowed'
    },
    'HV Extensions - Overhead': {
      forms: ['360S014EB', '360S014EC', '360S014EE', '360S014EG', '360S014EH', '360S014EJ', 'MFG_CERT'],
      notes: 'Equip Record Card or Form'
    },
    'HV Extensions - Underground': {
      forms: ['360S014EB', '360S014EE', '360S014EG', '360S014EH', '360S014EJ', '360S014EL', 'MFG_CERT'],
      notes: 'Equip Record Card or Form'
    },
    'LV Feed Area Change': {
      forms: ['360S014EO']
    },
    'HV Switchgear': {
      forms: ['360S014EF', '360S014EH', '360S014EE', 'MFG_CERT'],
      notes: 'A separate form for each piece of equipment. EH: For Critical Spares'
    },
    'Protection Relay (new and replacement)': {
      forms: ['360S014EP']
    },
    'Communications Sites': {
      forms: ['360S014EV', '360F019CA'],
      notes: 'For any Engineering as-built drawings. Repeater Stations and Base Comms'
    },
    'Communications RTU Sites': {
      forms: ['360S014EW'],
      notes: 'RTU Sites and LFI Sites'
    },
    'Line Fault Indicators': {
      forms: ['360S014ER', '360S014ES', '360S014ET', '360S014EU'],
      notes: 'Use forms 360S014ER - 360S014EU based on indicator type'
    },
    'Load Control Relays': {
      forms: ['360S014EC']
    }
  };

  const workTypes = Object.keys(workTypeMapping).sort();

  const filteredWorkTypes = workTypes.filter(work =>
    work.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRequiredForms = () => {
    if (!selectedWork) return [];
    const mapping = workTypeMapping[selectedWork];
    return mapping.forms.map(formId => ({
      id: formId,
      name: forms[formId]
    }));
  };

  const requiredForms = getRequiredForms();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-indigo-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">
              Powerco As-Built Form Selector
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Select the type of work to see required forms (360S014 Standard)
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search work types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Work Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Type of Work
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredWorkTypes.map((work) => (
              <button
                key={work}
                onClick={() => setSelectedWork(work)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedWork === work
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedWork === work ? (
                    <CheckCircle2 className="text-indigo-600 flex-shrink-0" size={20} />
                  ) : (
                    <Circle className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                  <span className="font-medium text-gray-800">{work}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Required Forms */}
        {selectedWork && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Required Forms ({requiredForms.length})
            </h2>
            
            {workTypeMapping[selectedWork].notes && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> {workTypeMapping[selectedWork].notes}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {requiredForms.map((form, index) => (
                <div
                  key={form.id}
                  className="p-4 border-2 border-indigo-200 rounded-lg bg-indigo-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-indigo-900">
                        {form.id}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {form.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Reminder:</strong> Depending on the work undertaken, one or multiple as-built forms may be required. Pre-commissioning and commissioning test forms should be uploaded separately from the workpack.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedWork && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">
              Select a type of work above to see the required as-built forms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsBuiltFormSelector;
