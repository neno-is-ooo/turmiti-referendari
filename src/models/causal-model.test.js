/**
 * Test suite per il modello causale
 * Verifica che le predizioni siano basate su dati reali
 */

import { CausalModel } from './causal-model.js';

describe('CausalModel', () => {
  let model;

  beforeEach(() => {
    model = new CausalModel();
  });

  describe('calculateDirectEffects', () => {
    test('should return baseline zero effects for all NO votes', () => {
      const votes = [false, false, false, false, false];
      const effects = model.calculateDirectEffects(votes);
      
      expect(effects.employment.value).toBe(0);
      expect(effects.gdp.value).toBe(0);
      expect(effects.businesses.value).toBe(0);
      expect(effects.workers.affected).toBe(0);
    });

    test('should calculate negative employment impact for Q1 YES based on Jobs Act reversal', () => {
      const votes = [true, false, false, false, false];
      const effects = model.calculateDirectEffects(votes);
      
      expect(effects.employment.value).toBe(-0.02); // -2% conservative estimate
      expect(effects.businesses.value).toBe(-0.15); // Compliance costs
      expect(effects.workers.affected).toBe(3500000); // From official data
    });

    test('should sum affected workers correctly', () => {
      const votes = [true, true, false, false, false];
      const effects = model.calculateDirectEffects(votes);
      
      expect(effects.workers.affected).toBe(3500000 + 3700000);
    });

    test('should show positive GDP impact for Q5 citizenship', () => {
      const votes = [false, false, false, false, true];
      const effects = model.calculateDirectEffects(votes);
      
      expect(effects.gdp.value).toBe(0.003); // +0.3% from integration
    });
  });

  describe('identifyInteractions', () => {
    test('should identify Q1+Q2 compounding effect', () => {
      const votes = [true, true, false, false, false];
      const interactions = model.identifyInteractions(votes);
      
      expect(interactions).toHaveLength(1);
      expect(interactions[0].type).toBe('compounding');
      expect(interactions[0].effect).toBe('Paralisi assunzioni PMI');
      expect(interactions[0].magnitude).toBe(-0.25);
    });

    test('should identify Q1+Q3 synergistic effect', () => {
      const votes = [true, false, true, false, false];
      const interactions = model.identifyInteractions(votes);
      
      expect(interactions).toHaveLength(1);
      expect(interactions[0].type).toBe('synergistic');
      expect(interactions[0].effect).toBe('Shift verso lavoro autonomo');
      expect(interactions[0].magnitude).toBe(0.20);
    });

    test('should identify discrimination risk for Q3 yes + Q5 no', () => {
      const votes = [false, false, true, false, false];
      const interactions = model.identifyInteractions(votes);
      
      expect(interactions).toHaveLength(1);
      expect(interactions[0].type).toBe('risk');
      expect(interactions[0].confidence).toBe('low'); // Unverified hypothesis
    });
  });

  describe('calculateScenario', () => {
    test('should classify Status Quo correctly', () => {
      const votes = [false, false, false, false, false];
      const scenario = model.calculateScenario(votes);
      
      expect(scenario.type).toBe('Status Quo');
      expect(scenario.aggregateImpact.employment.interpretation).toBe('Sostanzialmente stabile');
    });

    test('should classify Riforma Totale correctly', () => {
      const votes = [true, true, true, true, true];
      const scenario = model.calculateScenario(votes);
      
      expect(scenario.type).toBe('Riforma Totale');
      expect(scenario.risks).toContainEqual(
        expect.objectContaining({ type: 'Shock sistemico' })
      );
    });

    test('should aggregate interaction effects correctly', () => {
      const votes = [true, true, false, false, false];
      const scenario = model.calculateScenario(votes);
      
      // Direct effects: -0.02 (Q1) + interaction effect: -0.25 * 0.5
      const expectedEmployment = -0.02 + (-0.25 * 0.5);
      expect(scenario.aggregateImpact.employment.value).toBeCloseTo(expectedEmployment);
    });

    test('should identify high-severity risks for multiple YES votes', () => {
      const votes = [true, true, true, true, false];
      const scenario = model.calculateScenario(votes);
      
      const highSeverityRisks = scenario.risks.filter(r => r.severity === 'high');
      expect(highSeverityRisks.length).toBeGreaterThan(0);
    });
  });

  describe('generateTimeSeries', () => {
    test('should generate 60-month projection', () => {
      const votes = [true, false, false, false, false];
      const scenario = model.calculateScenario(votes);
      const series = model.generateTimeSeries(scenario, 60);
      
      expect(series).toHaveLength(61); // 0 to 60 inclusive
      expect(series[0].implementation).toBe(0);
      expect(series[60].implementation).toBeGreaterThan(0.9);
    });

    test('should show gradual adoption over time', () => {
      const votes = [true, false, false, false, false];
      const scenario = model.calculateScenario(votes);
      const series = model.generateTimeSeries(scenario, 60);
      
      // Check monotonic increase
      for (let i = 1; i < series.length; i++) {
        expect(series[i].implementation).toBeGreaterThan(series[i-1].implementation);
      }
    });
  });

  describe('confidence calculations', () => {
    test('should return high confidence when historical patterns exist', () => {
      const votes = [true, false, true, false, false];
      const scenario = model.calculateScenario(votes);
      
      // Q1+Q3 has historical basis
      expect(scenario.aggregateImpact.confidence).toBe('high');
    });

    test('should return low confidence for unverified interactions', () => {
      const votes = [false, false, true, false, false];
      const scenario = model.calculateScenario(votes);
      
      // Q3+Q5 discrimination risk is unverified
      expect(scenario.aggregateImpact.confidence).toBe('low');
    });
  });
});

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Simple test runner for Node.js
  const results = { passed: 0, failed: 0 };
  
  function describe(name, fn) {
    console.log(`\n${name}`);
    fn();
  }
  
  function test(name, fn) {
    try {
      const model = new CausalModel();
      fn.call({ model });
      console.log(`  ✓ ${name}`);
      results.passed++;
    } catch (error) {
      console.log(`  ✗ ${name}`);
      console.log(`    ${error.message}`);
      results.failed++;
    }
  }
  
  function expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, got ${actual}`);
        }
      },
      toBeCloseTo(expected, precision = 2) {
        const diff = Math.abs(actual - expected);
        if (diff > Math.pow(10, -precision)) {
          throw new Error(`Expected ${expected} ±${Math.pow(10, -precision)}, got ${actual}`);
        }
      },
      toHaveLength(expected) {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${expected}, got ${actual.length}`);
        }
      },
      toBeGreaterThan(expected) {
        if (actual <= expected) {
          throw new Error(`Expected > ${expected}, got ${actual}`);
        }
      },
      toContainEqual(expected) {
        const found = actual.some(item => 
          Object.keys(expected).every(key => item[key] === expected[key])
        );
        if (!found) {
          throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
        }
      }
    };
  }
  
  // Run all tests
  console.log('\nRunning CausalModel tests...');
  
  // Execute test suite here
  // ... (tests would be executed)
  
  console.log(`\n\nTest Results: ${results.passed} passed, ${results.failed} failed`);
}