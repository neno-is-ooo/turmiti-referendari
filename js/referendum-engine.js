// Referendum 2025 - Complex Systems Analysis Engine

class ReferendumAnalysisEngine {
    constructor() {
        // Question definitions with full complexity
        this.questions = {
            Q1: {
                id: 'jobs_act',
                name: 'Jobs Act - Reintegro',
                color: '#27ae60',
                weight: 0.25,
                affected_population: 3500000,
                economic_multiplier: 1.8,
                social_multiplier: 2.1,
                implementation_lag: 6, // months
                resistance_factor: 0.7
            },
            Q2: {
                id: 'piccole_imprese',
                name: 'PMI - Indennizzo',
                color: '#f39c12',
                weight: 0.20,
                affected_population: 3700000,
                economic_multiplier: 1.3,
                social_multiplier: 1.5,
                implementation_lag: 3,
                resistance_factor: 0.4
            },
            Q3: {
                id: 'contratti_termine',
                name: 'Contratti - Causale',
                color: '#7f8c8d',
                weight: 0.20,
                affected_population: 2600000,
                economic_multiplier: 1.5,
                social_multiplier: 1.8,
                implementation_lag: 9,
                resistance_factor: 0.6
            },
            Q4: {
                id: 'sicurezza_lavoro',
                name: 'Sicurezza - Solidale',
                color: '#e74c3c',
                weight: 0.15,
                affected_population: 15000000,
                economic_multiplier: 1.2,
                social_multiplier: 1.1,
                implementation_lag: 12,
                resistance_factor: 0.3
            },
            Q5: {
                id: 'cittadinanza',
                name: 'Cittadinanza - 5 anni',
                color: '#f1c40f',
                weight: 0.20,
                affected_population: 1200000,
                economic_multiplier: 0.8,
                social_multiplier: 2.5,
                implementation_lag: 3,
                resistance_factor: 0.8
            }
        };

        // Interaction matrix (synergies and conflicts)
        this.interactions = {
            'Q1-Q2': { synergy: 0.8, conflict: 0.1, type: 'reinforcing' },
            'Q1-Q3': { synergy: 0.7, conflict: 0.2, type: 'reinforcing' },
            'Q1-Q4': { synergy: 0.4, conflict: 0.1, type: 'neutral' },
            'Q1-Q5': { synergy: 0.1, conflict: 0.6, type: 'conflicting' },
            'Q2-Q3': { synergy: 0.5, conflict: 0.2, type: 'moderate' },
            'Q2-Q4': { synergy: 0.6, conflict: 0.1, type: 'moderate' },
            'Q2-Q5': { synergy: 0.2, conflict: 0.5, type: 'conflicting' },
            'Q3-Q4': { synergy: 0.5, conflict: 0.1, type: 'moderate' },
            'Q3-Q5': { synergy: 0.1, conflict: 0.8, type: 'highly_conflicting' },
            'Q4-Q5': { synergy: 0.3, conflict: 0.2, type: 'neutral' }
        };

        // System state variables
        this.systemState = {
            gdp_baseline: 2107.7, // billions EUR
            employment_rate: 0.617,
            investment_confidence: 0.7,
            social_cohesion: 0.6,
            political_stability: 0.65,
            institutional_capacity: 0.55
        };

        // Scenario archetypes with complex characteristics
        this.archetypes = {
            '00000': { 
                name: 'Status Quo Inerziale',
                stability: 0.9,
                transformation: 0.1,
                risk: 0.3,
                opportunity: 0.2
            },
            '11111': {
                name: 'Shock Sistemico Totale',
                stability: 0.1,
                transformation: 0.9,
                risk: 0.9,
                opportunity: 0.5
            },
            '11110': {
                name: 'Fortezza del Lavoro',
                stability: 0.3,
                transformation: 0.7,
                risk: 0.8,
                opportunity: 0.3
            },
            '00001': {
                name: 'Apertura Minimalista',
                stability: 0.8,
                transformation: 0.2,
                risk: 0.2,
                opportunity: 0.4
            },
            '10101': {
                name: 'Riforma Strategica',
                stability: 0.6,
                transformation: 0.5,
                risk: 0.4,
                opportunity: 0.7
            },
            '01011': {
                name: 'Capitalismo Inclusivo',
                stability: 0.7,
                transformation: 0.4,
                risk: 0.3,
                opportunity: 0.8
            }
        };

        // Time decay functions for effects
        this.timeDecay = {
            immediate: (t) => Math.exp(-t/6),
            medium: (t) => Math.exp(-t/24),
            long: (t) => Math.exp(-t/60)
        };

        // Monte Carlo simulation parameters
        this.mcParams = {
            runs: 1000,
            variance: 0.2,
            external_shocks: 0.1
        };
    }

    // Convert vote array to binary string
    votesToBinary(votes) {
        return votes.map(v => v ? '1' : '0').join('');
    }

    // Calculate Hamming distance between two scenarios
    hammingDistance(bin1, bin2) {
        let distance = 0;
        for (let i = 0; i < bin1.length; i++) {
            if (bin1[i] !== bin2[i]) distance++;
        }
        return distance;
    }

    // Find nearest archetype for a given vote pattern
    findNearestArchetype(binary) {
        let minDistance = Infinity;
        let nearest = null;
        
        for (const [pattern, archetype] of Object.entries(this.archetypes)) {
            const distance = this.hammingDistance(binary, pattern);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { pattern, archetype, distance };
            }
        }
        
        return nearest;
    }

    // Calculate first-order effects
    calculateFirstOrderEffects(votes) {
        const effects = {
            economic: 0,
            social: 0,
            political: 0,
            institutional: 0
        };

        votes.forEach((vote, i) => {
            const q = this.questions[`Q${i+1}`];
            if (vote) {
                effects.economic += q.economic_multiplier * q.weight;
                effects.social += q.social_multiplier * q.weight;
                effects.political += q.weight * (1 - q.resistance_factor);
                effects.institutional += q.weight * 0.5;
            }
        });

        return effects;
    }

    // Calculate second-order interaction effects
    calculateSecondOrderEffects(votes) {
        const effects = {
            synergies: 0,
            conflicts: 0,
            cascades: []
        };

        // Check all pairwise interactions
        for (let i = 0; i < 5; i++) {
            for (let j = i + 1; j < 5; j++) {
                if (votes[i] && votes[j]) {
                    const key = `Q${i+1}-Q${j+1}`;
                    const interaction = this.interactions[key];
                    
                    effects.synergies += interaction.synergy;
                    effects.conflicts += interaction.conflict;
                    
                    // Detect cascade conditions
                    if (interaction.type === 'reinforcing' && interaction.synergy > 0.7) {
                        effects.cascades.push({
                            source: `Q${i+1}`,
                            target: `Q${j+1}`,
                            strength: interaction.synergy
                        });
                    }
                }
            }
        }

        return effects;
    }

    // Calculate third-order emergent effects
    calculateThirdOrderEffects(votes, firstOrder, secondOrder) {
        const binary = this.votesToBinary(votes);
        const yesCount = votes.filter(v => v).length;
        
        const effects = {
            systemicRisk: 0,
            transformationPotential: 0,
            emergentBehaviors: [],
            tippingPoints: []
        };

        // Systemic risk calculation
        if (yesCount >= 4) {
            effects.systemicRisk = Math.pow(yesCount / 5, 2) * (1 + secondOrder.conflicts);
        } else {
            effects.systemicRisk = yesCount / 5 * 0.3;
        }

        // Transformation potential
        effects.transformationPotential = (firstOrder.economic + firstOrder.social) / 2 * 
                                         (1 + secondOrder.synergies - secondOrder.conflicts);

        // Detect emergent behaviors
        if (votes[0] && votes[1] && votes[2]) {
            effects.emergentBehaviors.push({
                type: 'labor_market_rigidity',
                probability: 0.8,
                impact: 'Massive shift to gig economy'
            });
        }

        if (votes[4] && !votes[0] && !votes[1]) {
            effects.emergentBehaviors.push({
                type: 'immigration_arbitrage',
                probability: 0.7,
                impact: 'Preferential hiring of pre-citizenship immigrants'
            });
        }

        if (yesCount === 3 && votes[3]) {
            effects.emergentBehaviors.push({
                type: 'compliance_industrial_complex',
                probability: 0.6,
                impact: 'New sector emergence for regulatory compliance'
            });
        }

        // Identify tipping points
        if (effects.systemicRisk > 0.7) {
            effects.tippingPoints.push({
                trigger: 'High systemic risk',
                threshold: effects.systemicRisk,
                consequence: 'Potential economic recession'
            });
        }

        if (secondOrder.conflicts > 1.5) {
            effects.tippingPoints.push({
                trigger: 'Internal contradictions',
                threshold: secondOrder.conflicts,
                consequence: 'Implementation paralysis'
            });
        }

        return effects;
    }

    // Run Monte Carlo simulation for uncertainty analysis
    runMonteCarloSimulation(votes, iterations = 100) {
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            // Add random perturbations
            const perturbedState = { ...this.systemState };
            for (const key in perturbedState) {
                perturbedState[key] *= (1 + (Math.random() - 0.5) * this.mcParams.variance);
            }

            // Calculate effects with perturbation
            const first = this.calculateFirstOrderEffects(votes);
            const second = this.calculateSecondOrderEffects(votes);
            const third = this.calculateThirdOrderEffects(votes, first, second);

            results.push({
                economic: first.economic * perturbedState.gdp_baseline / 2107.7,
                social: first.social * perturbedState.social_cohesion / 0.6,
                risk: third.systemicRisk * (2 - perturbedState.political_stability)
            });
        }

        // Calculate statistics
        const stats = {
            mean: {},
            std: {},
            percentiles: {}
        };

        ['economic', 'social', 'risk'].forEach(metric => {
            const values = results.map(r => r[metric]);
            stats.mean[metric] = values.reduce((a, b) => a + b) / values.length;
            stats.std[metric] = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - stats.mean[metric], 2)) / values.length);
            stats.percentiles[metric] = {
                p5: values.sort((a, b) => a - b)[Math.floor(iterations * 0.05)],
                p50: values.sort((a, b) => a - b)[Math.floor(iterations * 0.50)],
                p95: values.sort((a, b) => a - b)[Math.floor(iterations * 0.95)]
            };
        });

        return stats;
    }

    // Generate time series projection
    projectTimeline(votes, months = 60) {
        const first = this.calculateFirstOrderEffects(votes);
        const second = this.calculateSecondOrderEffects(votes);
        const third = this.calculateThirdOrderEffects(votes, first, second);
        
        const timeline = [];
        
        for (let t = 0; t <= months; t++) {
            const immediateEffect = first.economic * this.timeDecay.immediate(t);
            const mediumEffect = (second.synergies - second.conflicts) * this.timeDecay.medium(t);
            const longEffect = third.transformationPotential * this.timeDecay.long(t);
            
            timeline.push({
                month: t,
                gdp_impact: immediateEffect + mediumEffect + longEffect,
                employment_impact: (first.social - second.conflicts) * Math.exp(-t/18),
                stability_index: 1 - third.systemicRisk * (1 - Math.exp(-t/36)),
                implementation_progress: 1 - Math.exp(-t/12)
            });
        }
        
        return timeline;
    }

    // Calculate comprehensive scenario analysis
    analyzeScenario(votes) {
        const binary = this.votesToBinary(votes);
        const archetype = this.findNearestArchetype(binary);
        
        const first = this.calculateFirstOrderEffects(votes);
        const second = this.calculateSecondOrderEffects(votes);
        const third = this.calculateThirdOrderEffects(votes, first, second);
        
        const monteCarlo = this.runMonteCarloSimulation(votes);
        const timeline = this.projectTimeline(votes);
        
        // Calculate affected population
        let affectedPopulation = 0;
        votes.forEach((vote, i) => {
            if (vote) {
                affectedPopulation += this.questions[`Q${i+1}`].affected_population;
            }
        });
        
        return {
            binary,
            archetype,
            affectedPopulation,
            firstOrderEffects: first,
            secondOrderEffects: second,
            thirdOrderEffects: third,
            uncertainty: monteCarlo,
            timeline,
            recommendations: this.generateRecommendations(votes, third)
        };
    }

    // Generate context-aware recommendations
    generateRecommendations(votes, thirdOrder) {
        const recommendations = {
            businesses: [],
            workers: [],
            policymakers: [],
            investors: []
        };

        const yesCount = votes.filter(v => v).length;
        
        // Business recommendations
        if (votes[0] || votes[1]) {
            recommendations.businesses.push({
                priority: 'HIGH',
                action: 'Review and update employment contracts',
                timeline: '3 months',
                cost: 'Medium'
            });
        }
        
        if (thirdOrder.systemicRisk > 0.6) {
            recommendations.businesses.push({
                priority: 'CRITICAL',
                action: 'Prepare contingency plans for multiple scenarios',
                timeline: 'Immediate',
                cost: 'High'
            });
        }

        // Worker recommendations
        if (votes[2]) {
            recommendations.workers.push({
                priority: 'HIGH',
                action: 'Document all employment conditions',
                timeline: '1 month',
                impact: 'Protection against arbitrary contracts'
            });
        }

        // Policymaker recommendations
        if (yesCount >= 3) {
            recommendations.policymakers.push({
                priority: 'CRITICAL',
                action: 'Establish inter-ministerial task force',
                timeline: 'Within 1 week of results',
                complexity: 'Very High'
            });
        }

        // Investor recommendations
        if (thirdOrder.systemicRisk > 0.7) {
            recommendations.investors.push({
                priority: 'HIGH',
                action: 'Hedge against market volatility',
                timeline: 'Before referendum date',
                instruments: ['Put options', 'Safe haven assets']
            });
        }

        return recommendations;
    }

    // Network analysis of question relationships
    calculateNetworkCentrality() {
        const centrality = {};
        
        Object.keys(this.questions).forEach(q => {
            centrality[q] = 0;
        });

        // Calculate degree centrality based on interactions
        Object.keys(this.interactions).forEach(pair => {
            const [q1, q2] = pair.split('-');
            const interaction = this.interactions[pair];
            centrality[q1] += interaction.synergy + interaction.conflict;
            centrality[q2] += interaction.synergy + interaction.conflict;
        });

        return centrality;
    }

    // Detect critical paths through the decision space
    findCriticalPaths() {
        const paths = [];
        
        // Path 1: Maximum worker protection
        paths.push({
            name: 'Maximum Worker Protection',
            sequence: [true, true, true, true, false],
            rationale: 'All labor protections without immigration',
            risk: 'Very High',
            reward: 'Strong labor rights'
        });

        // Path 2: Balanced reform
        paths.push({
            name: 'Strategic Balance',
            sequence: [true, false, true, false, true],
            rationale: 'Key reforms with manageable implementation',
            risk: 'Medium',
            reward: 'Sustainable change'
        });

        // Path 3: Business-friendly with inclusion
        paths.push({
            name: 'Inclusive Flexibility',
            sequence: [false, true, false, true, true],
            rationale: 'Maintain flexibility while improving safety and inclusion',
            risk: 'Low-Medium',
            reward: 'Economic dynamism'
        });

        return paths;
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReferendumAnalysisEngine;
}