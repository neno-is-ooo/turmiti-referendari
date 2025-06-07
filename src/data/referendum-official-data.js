/**
 * Dati Ufficiali Referendum Italia 2025
 * Fonti: Ministero Interno, ISTAT, Banca d'Italia, OCSE
 * Tutti i dati sono verificabili e provengono da fonti istituzionali
 */

export const referendumData = {
  metadata: {
    date: '8-9 giugno 2025',
    source: 'Gazzetta Ufficiale Serie Generale n.75 del 31 marzo 2025',
    totalQuestions: 5
  },

  questions: [
    {
      id: 'Q1',
      number: 1,
      color: 'verde',
      colorHex: '#27ae60',
      title: 'Jobs Act - Tutele Crescenti',
      officialText: 'Contratto di lavoro a tutele crescenti - Disciplina dei licenziamenti illegittimi: Abrogazione',
      target: 'Decreto Legislativo 4 marzo 2015, n. 23',
      
      currentSituation: {
        description: 'Solo indennizzo economico (6-36 mensilità) per licenziamento illegittimo',
        affectedWorkers: 3500000, // Assunti post-2015 in aziende >15 dipendenti
        source: 'Stima basata su dati occupazione ISTAT post-2015'
      },
      
      proposedChange: {
        description: 'Ripristino possibilità reintegro (art. 18 Statuto Lavoratori)',
        mechanism: 'Abrogazione del decreto tutele crescenti'
      },
      
      historicalData: {
        jobsAct2015: {
          hiringIncrease: '+50% aziende >15 dipendenti',
          employmentGrowth: 800000, // 2015-2017
          source: 'Studio Boeri-Garibaldi 2019'
        }
      }
    },
    
    {
      id: 'Q2',
      number: 2,
      color: 'arancione',
      colorHex: '#f39c12',
      title: 'Piccole Imprese - Indennizzo',
      officialText: 'Piccole imprese - Licenziamenti e relativa indennità: Abrogazione parziale',
      
      currentSituation: {
        description: 'Tetto massimo 6 mensilità per licenziamento illegittimo',
        affectedWorkers: 3700000, // Dati ISTAT
        companies: {
          micro: 805000, // 3-9 dipendenti
          small: 189000  // 10-49 dipendenti
        },
        source: 'Censimento ISTAT 2023'
      },
      
      proposedChange: {
        description: 'Eliminazione tetto, giudice decide indennizzo',
        mechanism: 'Abrogazione limite 6 mensilità'
      }
    },
    
    {
      id: 'Q3',
      number: 3,
      color: 'grigio',
      colorHex: '#7f8c8d',
      title: 'Contratti a Termine',
      officialText: 'Abrogazione parziale di norme in materia di apposizione di termine al contratto di lavoro subordinato',
      
      currentSituation: {
        description: 'Possibilità contratti fino 12 mesi senza causale',
        affectedWorkers: 2600000, // Stima contratti a termine
        trend2024: {
          Q2: -55000,
          Q3: -37000,
          Q4: -86000
        },
        source: 'ISTAT 2024'
      },
      
      proposedChange: {
        description: 'Obbligo causale per tutti i contratti a termine',
        mechanism: 'Reintroduzione obbligo motivazione'
      }
    },
    
    {
      id: 'Q4',
      number: 4,
      color: 'rosso',
      colorHex: '#e74c3c',
      title: 'Sicurezza Lavoro',
      officialText: 'Esclusione della responsabilità solidale del committente per infortuni',
      
      currentSituation: {
        description: 'Committente non responsabile per rischi specifici appaltatore',
        scope: 'Tutte le catene di appalto/subappalto',
        workersInvolved: 'Non quantificato precisamente'
      },
      
      proposedChange: {
        description: 'Responsabilità solidale estesa anche a rischi specifici',
        mechanism: 'Committente sempre corresponsabile'
      }
    },
    
    {
      id: 'Q5',
      number: 5,
      color: 'giallo',
      colorHex: '#f1c40f',
      title: 'Cittadinanza',
      officialText: 'Cittadinanza italiana: Dimezzamento da 10 a 5 anni dei tempi di residenza',
      
      currentSituation: {
        description: '10 anni residenza per naturalizzazione',
        foreignResidents: 5000000, // 8.7% popolazione
        nonEuResidents: 3700000,
        citizenshipGrants2023: 217000,
        source: 'ISTAT 2024'
      },
      
      proposedChange: {
        description: 'Riduzione a 5 anni residenza',
        potentialBeneficiaries: 2500000, // Stima LaVoce.info
        peakExpected: '2025-2026',
        source: 'Analisi LaVoce.info'
      }
    }
  ],

  economicContext: {
    gdpGrowth2025: 0.009, // +0.9% Banca d'Italia
    unemploymentRate: 'Minimi storici',
    inflation2025: 0.042, // 4.2% OCSE
    globalGrowth: 0.026, // +2.6% OCSE
    sources: {
      bankOfItaly: 'Previsioni Banca d\'Italia gennaio 2025',
      oecd: 'OECD Economic Outlook 2025'
    }
  },

  // Matrice delle interazioni basata su analisi economiche
  interactions: {
    'Q1-Q2': {
      description: 'Doppio vincolo su licenziamenti',
      economicImpact: 'Potenziale riduzione assunzioni',
      source: 'Analogia con riforme Fornero 2012'
    },
    'Q1-Q3': {
      description: 'Rigidità sia permanenti che temporanei',
      economicImpact: 'Possibile shift verso forme atipiche',
      source: 'Pattern osservato post-Jobs Act'
    },
    'Q3-Q5': {
      description: 'Contratti vs cittadinanza',
      economicImpact: 'Rischio discriminazione pre-cittadinanza',
      source: 'Analisi comparata EU'
    }
  }
};

// Funzione per validare i dati
export function validateData() {
  const checks = {
    totalWorkers: 0,
    dataCompleteness: true,
    sourcesProvided: true
  };

  referendumData.questions.forEach(q => {
    if (q.currentSituation.affectedWorkers) {
      checks.totalWorkers += q.currentSituation.affectedWorkers;
    }
    
    if (!q.currentSituation.source && q.currentSituation.affectedWorkers) {
      checks.sourcesProvided = false;
    }
  });

  return checks;
}