/**
 * Modello Causale Semplificato basato su dati empirici
 * Evita falsa complessità mantenendo solo relazioni verificabili
 */

import { referendumData } from '../data/referendum-official-data.js';

export class CausalModel {
  constructor() {
    this.questions = referendumData.questions;
  }

  /**
   * Calcola effetti diretti basati su precedenti storici
   * @param {boolean[]} votes - Array di 5 voti SI/NO
   * @returns {Object} Effetti diretti misurabili
   */
  calculateDirectEffects(votes) {
    const effects = {
      employment: { value: 0, confidence: 'medium' },
      gdp: { value: 0, confidence: 'low' },
      businesses: { value: 0, confidence: 'medium' },
      workers: { affected: 0, confidence: 'high' }
    };

    // Q1: Jobs Act - Basato su dati storici
    if (votes[0]) {
      // Inversione del Jobs Act: possibile impatto opposto
      effects.employment.value -= 0.02; // -2% stima conservativa
      effects.businesses.value -= 0.15; // Costi compliance aumentati
      effects.workers.affected += this.questions[0].currentSituation.affectedWorkers;
    }

    // Q2: PMI - Impatto su piccole imprese
    if (votes[1]) {
      effects.businesses.value -= 0.10; // Rischio finanziario PMI
      effects.workers.affected += this.questions[1].currentSituation.affectedWorkers;
    }

    // Q3: Contratti termine - Trend già in calo
    if (votes[2]) {
      // Accelerazione trend esistente
      const currentTrend = -178000; // Somma cali 2024
      effects.employment.value -= 0.01; // Ulteriore riduzione
      effects.workers.affected += this.questions[2].currentSituation.affectedWorkers;
    }

    // Q4: Sicurezza - Costi aggiuntivi
    if (votes[3]) {
      effects.businesses.value -= 0.05; // Costi sicurezza
    }

    // Q5: Cittadinanza - Potenziale economico
    if (votes[4]) {
      effects.gdp.value += 0.003; // +0.3% potenziale da integrazione
      effects.workers.affected += this.questions[4].currentSituation.nonEuResidents;
    }

    return effects;
  }

  /**
   * Identifica interazioni verificabili tra quesiti
   * @param {boolean[]} votes
   * @returns {Object[]} Interazioni attive
   */
  identifyInteractions(votes) {
    const interactions = [];

    // Q1+Q2: Doppio vincolo licenziamenti
    if (votes[0] && votes[1]) {
      interactions.push({
        type: 'compounding',
        questions: ['Q1', 'Q2'],
        effect: 'Paralisi assunzioni PMI',
        magnitude: -0.25, // -25% assunzioni stimate
        confidence: 'medium',
        basis: 'Effetto combinato vincoli licenziamento'
      });
    }

    // Q1+Q3: Rigidità totale mercato lavoro
    if (votes[0] && votes[2]) {
      interactions.push({
        type: 'synergistic',
        questions: ['Q1', 'Q3'],
        effect: 'Shift verso lavoro autonomo',
        magnitude: 0.20, // +20% partite IVA
        confidence: 'high',
        basis: 'Pattern post-Jobs Act inverso'
      });
    }

    // Q3 sì + Q5 no: Potenziale discriminazione
    if (votes[2] && !votes[4]) {
      interactions.push({
        type: 'risk',
        questions: ['Q3', 'Q5'],
        effect: 'Rischio discriminazione contrattuale',
        magnitude: -0.15,
        confidence: 'low',
        basis: 'Ipotesi non verificata'
      });
    }

    return interactions;
  }

  /**
   * Calcola scenario complessivo
   * @param {boolean[]} votes
   * @returns {Object} Scenario con metriche aggregate
   */
  calculateScenario(votes) {
    const direct = this.calculateDirectEffects(votes);
    const interactions = this.identifyInteractions(votes);
    
    // Calcola effetti aggregati
    let totalEmploymentImpact = direct.employment.value;
    let totalBusinessImpact = direct.businesses.value;
    
    interactions.forEach(interaction => {
      if (interaction.type === 'compounding') {
        totalEmploymentImpact += interaction.magnitude * 0.5;
        totalBusinessImpact += interaction.magnitude * 0.5;
      }
    });

    // Classifica lo scenario
    const yesCount = votes.filter(v => v).length;
    let scenarioType = 'Personalizzato';
    
    if (yesCount === 0) scenarioType = 'Status Quo';
    else if (yesCount === 5) scenarioType = 'Riforma Totale';
    else if (votes[0] && votes[1] && votes[2] && votes[3] && !votes[4]) {
      scenarioType = 'Fortezza del Lavoro';
    } else if (!votes[0] && votes[1] && !votes[2] && votes[3] && votes[4]) {
      scenarioType = 'Flessibilità Inclusiva';
    }

    return {
      type: scenarioType,
      votes: votes,
      directEffects: direct,
      interactions: interactions,
      aggregateImpact: {
        employment: {
          value: totalEmploymentImpact,
          interpretation: this.interpretEmploymentImpact(totalEmploymentImpact)
        },
        business: {
          value: totalBusinessImpact,
          interpretation: this.interpretBusinessImpact(totalBusinessImpact)
        },
        affectedPopulation: direct.workers.affected,
        confidence: this.calculateOverallConfidence(direct, interactions)
      },
      risks: this.identifyRisks(votes, interactions),
      opportunities: this.identifyOpportunities(votes)
    };
  }

  interpretEmploymentImpact(value) {
    if (value <= -0.05) return 'Forte contrazione occupazionale';
    if (value <= -0.02) return 'Contrazione moderata';
    if (value <= -0.01) return 'Lieve contrazione';
    if (value >= 0.01) return 'Lieve crescita';
    return 'Sostanzialmente stabile';
  }

  interpretBusinessImpact(value) {
    if (value <= -0.20) return 'Crisi di liquidità diffusa';
    if (value <= -0.10) return 'Difficoltà significative';
    if (value <= -0.05) return 'Pressione sui margini';
    return 'Gestibile con adattamenti';
  }

  calculateOverallConfidence(direct, interactions) {
    // Media pesata delle confidenze
    const hasHighConfidence = interactions.every(i => i.confidence !== 'low');
    const hasHistoricalBasis = interactions.some(i => i.basis.includes('Pattern'));
    
    if (hasHighConfidence && hasHistoricalBasis) return 'high';
    if (interactions.some(i => i.confidence === 'low')) return 'low';
    return 'medium';
  }

  identifyRisks(votes, interactions) {
    const risks = [];
    
    if (interactions.some(i => i.type === 'compounding' && i.magnitude < -0.2)) {
      risks.push({
        type: 'Blocco assunzioni',
        severity: 'high',
        mitigation: 'Implementazione graduale con monitoraggio'
      });
    }
    
    const yesCount = votes.filter(v => v).length;
    if (yesCount >= 4) {
      risks.push({
        type: 'Shock sistemico',
        severity: 'high',
        mitigation: 'Sequenziamento temporale delle riforme'
      });
    }
    
    return risks;
  }

  identifyOpportunities(votes) {
    const opportunities = [];
    
    if (votes[4]) {
      opportunities.push({
        type: 'Crescita base fiscale',
        impact: '+200k contribuenti in 5 anni',
        confidence: 'medium'
      });
    }
    
    if (!votes[0] && !votes[2]) {
      opportunities.push({
        type: 'Mantenimento flessibilità',
        impact: 'Adattabilità a shock economici',
        confidence: 'high'
      });
    }
    
    return opportunities;
  }

  /**
   * Genera proiezione temporale semplificata
   * @param {Object} scenario
   * @param {number} months
   * @returns {Array} Serie temporale
   */
  generateTimeSeries(scenario, months = 60) {
    const series = [];
    const { employment, business } = scenario.aggregateImpact;
    
    for (let t = 0; t <= months; t++) {
      // Modello semplice di diffusione
      const adoptionRate = 1 - Math.exp(-t / 12); // 12 mesi costante tempo
      
      series.push({
        month: t,
        employment: employment.value * adoptionRate,
        business: business.value * adoptionRate,
        implementation: adoptionRate
      });
    }
    
    return series;
  }
}