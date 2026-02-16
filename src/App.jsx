import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, Circle, ExternalLink, Download, ChevronDown, ChevronUp } from 'lucide-react';

const AsBuiltFormSelector = () => {
  const [selectedWork, setSelectedWork] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form definitions with local file paths
  // PDFs should be placed in the public/forms/ folder
  const forms = {
    '360S014EA': {
      name: 'As-built Low Voltage Connection Record',
      fileName: '360S014EA.pdf'
    },
    '360S014EB': {
      name: 'As-built Electrical Distribution Record',
      fileName: '360S014EB.pdf'
    },
    '360S014EC': {
      name: 'As-built Pole Record (PDF or Excel)',
      fileName: '360S014EC.pdf',
      alternateFileName: '360S014EC.xlsx'
    },
    '360S014ED': {
      name: 'As-built LV Box Record',
      fileName: '360S014ED.pdf'
    },
    '360S014EE': {
      name: 'As-built Electrical Equipment Record',
      fileName: '360S014EE.pdf'
    },
    '360S014EF': {
      name: 'As-built Zone Substation Equipment Record',
      fileName: '360S014EF.pdf'
    },
    '360S014EG': {
      name: 'As-built Transformer Record',
      fileName: '360S014EG.pdf'
    },
    '360S014EH': {
      name: 'As-built Equipment Record Cards',
      fileName: '360S014EH.pdf'
    },
    '360S014EI': {
      name: 'As-built Underground Network Distribution Panel Layout Record',
      fileName: '360S014EI.pdf'
    },
    '360S014EJ': {
      name: 'As-built Earth Installation and Test Record',
      fileName: '360S014EJ.pdf'
    },
    '360S014EK': {
      name: 'As-built Streetlight Alteration/Installation Record',
      fileName: '360S014EK.pdf'
    },
    '360S014EL': {
      name: 'As-built Cable Test Report',
      fileName: '360S014EL.pdf'
    },
    '360S014EM': {
      name: 'As-built Requirements Checklist - Zone Substation',
      fileName: '360S014EM.pdf'
    },
    '360S014EO': {
      name: 'As-built Transformer ICP Change Form',
      fileName: '360S014EO.pdf'
    },
    '360S014EP': {
      name: 'As-built Protection Relay Record',
      fileName: '360S014EP.pdf'
    },
    '360S014EQ': {
      name: 'Commissioning Conductor Tension Method & Results/Run Form',
      fileName: '360S014EQ.pdf'
    },
    '360S014ER': {
      name: 'As-built Line Fault Indicator Record LM2SAT',
      fileName: '360S014ER.pdf'
    },
    '360S014ES': {
      name: 'As-built Line Fault Indicator Record PM3SAT',
      fileName: '360S014ES.pdf'
    },
    '360S014ET': {
      name: 'As-built Line Fault Indicator Record PM6SAT',
      fileName: '360S014ET.pdf'
    },
    '360S014EU': {
      name: 'As-built Line Fault Indicator Record PM9SAT',
      fileName: '360S014EU.pdf'
    },
    '360S014EV': {
      name: 'As-built Network Communications Equipment Record',
      fileName: '360S014EV.pdf'
    },
    '360S014EW': {
      name: 'As-built Remote Terminal Unit Equipment Record',
      fileName: '360S014EW.pdf'
    },
    '360F019CA': {
      name: 'Drawing Approval Form',
      fileName: '360F019CA.pdf'
    },
    'MFG_CERT': {
      name: 'Manufacturer Test Certificates',
      fileName: null // No file - varies by manufacturer
    }
  };

  // Commissioning & Test Certificates (220F028 series)
  const commissioningCerts = {
    '220F028A': {
      name: 'Pre-Commissioning HV Inspection Certificate – Minor Works',
      fileName: '220F028A.pdf'
    },
    '220F028B': {
      name: 'Distribution Transformer Commissioning Certificate',
      fileName: '220F028B.pdf'
    },
    '220F028C': {
      name: 'LV Service Boxes, Cabinets and Subterranean Vaults Commissioning Certificate',
      fileName: '220F028C.pdf'
    },
    '220F028D': {
      name: 'LV Link Boxes and Link Cabinets Test Certificate',
      fileName: '220F028D.pdf'
    },
    '220F028E': {
      name: 'LV Customer Connection and Polarity Checks Test Certificate',
      fileName: '220F028E.pdf'
    },
    '220F028F': {
      name: 'Overhead LV Distribution Circuit Test Certificate',
      fileName: '220F028F.pdf'
    },
    '220F028G': {
      name: 'Underground LV Distribution Circuit Test Certificate',
      fileName: '220F028G.pdf'
    }
  };

  // Work type to forms mapping based on the matrix
  const workTypeMapping = {
    'LV Service Connection - OH and UG': {
      forms: ['360S014EA'],
      notes: 'New or Altered Connections',
      commissioningCerts: ['220F028E']
    },
    'LV Distribution Network': {
      forms: ['360S014EB', '360S014EC', '360S014EL'],
      notes: 'For UG Distribution Network (360S014EL)',
      commissioningCerts: ['220F028F', '220F028G', '220F028C']
    },
    'HV Distribution Network': {
      forms: ['360S014EB', '360S014EC', '360S014EE', '360S014EL'],
      notes: 'For UG Distribution Network (360S014EL)',
      commissioningCerts: ['220F028A', '220F028F', '220F028G']
    },
    'Poles': {
      forms: ['360S014EC', '360S014EE'],
      notes: 'Either As-Built Pole Record Form or Network Asset Design Register can be used',
      commissioningCerts: []
    },
    'Crossarms': {
      forms: ['360S014EC'],
      commissioningCerts: []
    },
    'Equipment (installation/changes)': {
      forms: ['360S014EE', '360S014EH', '360S014EJ', 'MFG_CERT'],
      notes: 'EE: Any equipment not specified elsewhere; EH: For Critical Spares; EJ: Where an Earth Test has been taken',
      commissioningCerts: ['220F028A']
    },
    'Zone Substations': {
      forms: ['360S014EF', '360S014EE', '360S014EH', '360F019CA'],
      notes: 'For any Engineering as-built drawings (360F019CA)',
      commissioningCerts: ['220F028A']
    },
    'Transformers - Overhead': {
      forms: ['360S014EC', '360S014EG', '360S014EH', '360S014EE', '360S014EJ', 'MFG_CERT'],
      notes: 'Equip Record Card or Form (EG or EH)',
      commissioningCerts: ['220F028A', '220F028B']
    },
    'Transformers - Ground mount': {
      forms: ['360S014EG', '360S014EH', '360S014EE', '360S014EJ', 'MFG_CERT'],
      notes: 'Equip Record Card or Form (EG or EH)',
      commissioningCerts: ['220F028A', '220F028B']
    },
    'LV Service Box': {
      forms: ['360S014ED'],
      notes: 'For boxes containing service fuses only',
      commissioningCerts: ['220F028C']
    },
    'LV Distribution Box': {
      forms: ['360S014EC', '360S014ED', '360S014EJ'],
      notes: 'For vertical disconnects (Pillar) use ED; For horizontal disconnects (Link) use ED',
      commissioningCerts: ['220F028C', '220F028D']
    },
    'Earth Test / Alterations': {
      forms: ['360S014EJ'],
      commissioningCerts: []
    },
    'Streetlights': {
      forms: ['360S014EK'],
      commissioningCerts: []
    },
    'Subdivisions - Underground': {
      forms: ['360S014EC', '360S014EB', '360S014EG', '360S014EH', '360S014EE', '360S014EJ', '360S014EL', 'MFG_CERT'],
      notes: 'A plan detailing all cable details is allowed',
      commissioningCerts: ['220F028E', '220F028G', '220F028C', '220F028B']
    },
    'HV Extensions - Overhead': {
      forms: ['360S014EB', '360S014EC', '360S014EE', '360S014EG', '360S014EH', '360S014EJ', 'MFG_CERT'],
      notes: 'Equip Record Card or Form',
      commissioningCerts: ['220F028A', '220F028F']
    },
    'HV Extensions - Underground': {
      forms: ['360S014EB', '360S014EE', '360S014EG', '360S014EH', '360S014EJ', '220F028EL', 'MFG_CERT'],
      notes: 'Equip Record Card or Form',
      commissioningCerts: ['220F028A', '220F028G']
    },
    'LV Feed Area Change': {
      forms: ['360S014EO'],
      commissioningCerts: []
    },
    'HV Switchgear': {
      forms: ['360S014EF', '360S014EH', '360S014EE', 'MFG_CERT'],
      notes: 'A separate form for each piece of equipment. EH: For Critical Spares',
      commissioningCerts: ['220F028A']
    },
    'Protection Relay (new and replacement)': {
      forms: ['360S014EP'],
      commissioningCerts: ['220F028A']
    },
    'Communications Sites': {
      forms: ['360S014EV', '360F019CA'],
      notes: 'For any Engineering as-built drawings. Repeater Stations and Base Comms',
      commissioningCerts: []
    },
    'Communications RTU Sites': {
      forms: ['360S014EW'],
      notes: 'RTU Sites and LFI Sites',
      commissioningCerts: []
    },
    'Line Fault Indicators': {
      forms: ['360S014ER', '360S014ES', '360S014ET', '360S014EU'],
      notes: 'Use forms 360S014ER - 360S014EU based on indicator type',
      commissioningCerts: []
    },
    'Load Control Relays': {
      forms: ['360S014EC'],
      commissioningCerts: []
    }
  };

  const workTypes = Object.keys(workTypeMapping).sort();

  const filteredWorkTypes = workTypes.filter(work =>
    work.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRequiredForms = () => {
    if (!selectedWork) return { forms: [], commissioningCerts: [] };
    const mapping = workTypeMapping[selectedWork];
    
    const forms = mapping.forms.map(formId => {
      const formData = forms[formId];
      const basePath = import.meta.env.BASE_URL;
      const formUrl = formData.fileName ? `${basePath}forms/${formData.fileName}` : null;
      const alternateUrl = formData.alternateFileName ? `${basePath}forms/${formData.alternateFileName}` : null;
      
      return {
        id: formId,
        name: formData.name,
        url: formUrl,
        alternateUrl: alternateUrl,
        hasLink: !!formUrl
      };
    });
    
    const certs = (mapping.commissioningCerts || []).map(certId => {
      const certData = commissioningCerts[certId];
      const basePath = import.meta.env.BASE_URL;
      const certUrl = certData.fileName ? `${basePath}forms/${certData.fileName}` : null;
      
      return {
        id: certId,
        name: certData.name,
        url: certUrl,
        hasLink: !!certUrl
      };
    });
    
    return { forms, commissioningCerts: certs };
  };

  const handleFormClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const { forms: requiredForms, commissioningCerts: requiredCerts } = getRequiredForms();
  const [showCommissioning, setShowCommissioning] = useState(false);

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
                  onClick={() => form.hasLink && handleFormClick(form.url)}
                  className={`p-4 border-2 rounded-lg ${
                    form.hasLink 
                      ? 'border-indigo-200 bg-indigo-50 cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 active:bg-indigo-200 transition-all'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-indigo-900">
                          {form.id}
                        </p>
                        {form.hasLink && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                            <Download size={12} />
                            <span>Download</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {form.name}
                      </p>
                      {form.alternateUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFormClick(form.alternateUrl);
                          }}
                          className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          Download Excel version
                        </button>
                      )}
                      {!form.hasLink && form.id === 'MFG_CERT' && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Contact manufacturer for specific certificates
                        </p>
                      )}
                    </div>
                    {form.hasLink && (
                      <ExternalLink className="flex-shrink-0 text-indigo-600" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Reminder:</strong> Depending on the work undertaken, one or multiple as-built forms may be required. Pre-commissioning and commissioning test forms should be uploaded separately from the workpack.
              </p>
            </div>

            {/* Commissioning & Test Certificates Section */}
            {requiredCerts.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCommissioning(!showCommissioning)}
                  className="w-full flex items-center justify-between p-4 bg-green-50 border-2 border-green-300 rounded-lg hover:bg-green-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-green-700" size={20} />
                    <span className="font-semibold text-green-900">
                      Commissioning & Test Certificates ({requiredCerts.length})
                    </span>
                  </div>
                  {showCommissioning ? (
                    <ChevronUp className="text-green-700" size={20} />
                  ) : (
                    <ChevronDown className="text-green-700" size={20} />
                  )}
                </button>

                {showCommissioning && (
                  <div className="mt-3 space-y-3 animate-fadeIn">
                    {requiredCerts.map((cert, index) => (
                      <div
                        key={cert.id}
                        onClick={() => cert.hasLink && handleFormClick(cert.url)}
                        className={`p-4 border-2 rounded-lg ${
                          cert.hasLink 
                            ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 hover:border-green-300 active:bg-green-200 transition-all'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-green-900">
                                {cert.id}
                              </p>
                              {cert.hasLink && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                  <Download size={12} />
                                  <span>Download</span>
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {cert.name}
                            </p>
                          </div>
                          {cert.hasLink && (
                            <ExternalLink className="flex-shrink-0 text-green-600" size={20} />
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-800">
                        <strong>Note:</strong> These commissioning and test certificates verify that installed equipment is safe and ready for service. Complete and submit these separately from as-built documentation forms.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
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

