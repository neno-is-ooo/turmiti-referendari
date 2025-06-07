// Causal Network Engine for Referendum Analysis
// This engine maps the propagation of effects through causal chains

class CausalNetworkEngine {
    constructor() {
        // First-order effects: Direct consequences of each question
        this.firstOrderEffects = {
            Q1: { // Jobs Act - Reintegro
                immediate: [
                    {
                        id: 'Q1_E1',
                        effect: 'Aumento costi licenziamento',
                        magnitude: 0.8,
                        latency: 0, // months
                        targets: ['imprese', 'lavoratori'],
                        type: 'economic'
                    },
                    {
                        id: 'Q1_E2',
                        effect: 'Riduzione assunzioni tempo indeterminato',
                        magnitude: -0.6,
                        latency: 3,
                        targets: ['occupazione'],
                        type: 'economic'
                    },
                    {
                        id: 'Q1_E3',
                        effect: 'Maggiore sicurezza lavoratori insider',
                        magnitude: 0.7,
                        latency: 1,
                        targets: ['lavoratori_stabili'],
                        type: 'social'
                    }
                ]
            },
            Q2: { // PMI - Indennizzo
                immediate: [
                    {
                        id: 'Q2_E1',
                        effect: 'Aumento rischio finanziario PMI',
                        magnitude: 0.5,
                        latency: 0,
                        targets: ['piccole_imprese'],
                        type: 'economic'
                    },
                    {
                        id: 'Q2_E2',
                        effect: 'Maggiore tutela lavoratori PMI',
                        magnitude: 0.6,
                        latency: 1,
                        targets: ['lavoratori_pmi'],
                        type: 'social'
                    }
                ]
            },
            Q3: { // Contratti termine - Causale
                immediate: [
                    {
                        id: 'Q3_E1',
                        effect: 'Complessità amministrativa contratti',
                        magnitude: 0.7,
                        latency: 0,
                        targets: ['imprese', 'hr_departments'],
                        type: 'administrative'
                    },
                    {
                        id: 'Q3_E2',
                        effect: 'Riduzione contratti a termine',
                        magnitude: -0.5,
                        latency: 6,
                        targets: ['mercato_lavoro'],
                        type: 'economic'
                    }
                ]
            },
            Q4: { // Sicurezza - Responsabilità
                immediate: [
                    {
                        id: 'Q4_E1',
                        effect: 'Aumento investimenti sicurezza',
                        magnitude: 0.6,
                        latency: 3,
                        targets: ['imprese_committenti'],
                        type: 'economic'
                    },
                    {
                        id: 'Q4_E2',
                        effect: 'Riduzione subappalti',
                        magnitude: -0.4,
                        latency: 6,
                        targets: ['catena_fornitura'],
                        type: 'economic'
                    }
                ]
            },
            Q5: { // Cittadinanza
                immediate: [
                    {
                        id: 'Q5_E1',
                        effect: 'Aumento richieste cittadinanza',
                        magnitude: 0.9,
                        latency: 0,
                        targets: ['immigrati_regolari'],
                        type: 'social'
                    },
                    {
                        id: 'Q5_E2',
                        effect: 'Maggiore integrazione sociale',
                        magnitude: 0.5,
                        latency: 12,
                        targets: ['coesione_sociale'],
                        type: 'social'
                    }
                ]
            }
        };

        // Second-order interactions: How combinations create new effects
        this.secondOrderInteractions = {
            'Q1+Q2': [
                {
                    id: 'I_Q1Q2_1',
                    condition: 'both_yes',
                    effect: 'Paralisi assunzioni totale',
                    magnitude: -0.8,
                    mechanism: 'Q1_E2 amplifies Q2_E1',
                    threshold: 0.7
                }
            ],
            'Q1+Q3': [
                {
                    id: 'I_Q1Q3_1',
                    condition: 'both_yes',
                    effect: 'Shift massiccio verso partite IVA',
                    magnitude: 0.9,
                    mechanism: 'Q1_E2 + Q3_E2 create escape route',
                    threshold: 0.6
                }
            ],
            'Q3+Q5': [
                {
                    id: 'I_Q3Q5_1',
                    condition: 'Q3_yes_Q5_no',
                    effect: 'Discriminazione pre-cittadinanza',
                    magnitude: -0.7,
                    mechanism: 'Q3_E1 creates loophole for Q5 discrimination',
                    threshold: 0.5
                }
            ],
            'Q1+Q4': [
                {
                    id: 'I_Q1Q4_1',
                    condition: 'both_yes',
                    effect: 'Internalizzazione forzata',
                    magnitude: 0.6,
                    mechanism: 'Q4_E2 + Q1_E1 force direct employment',
                    threshold: 0.6
                }
            ],
            'Q2+Q4': [
                {
                    id: 'I_Q2Q4_1',
                    condition: 'both_yes',
                    effect: 'Crisi liquidità PMI subappaltatrici',
                    magnitude: -0.8,
                    mechanism: 'Q2_E1 + Q4_E1 compound financial risk',
                    threshold: 0.7
                }
            ]
        };

        // Third-order emergent phenomena
        this.emergentPhenomena = {
            'labor_fortress': {
                trigger: ['Q1_yes', 'Q2_yes', 'Q3_yes'],
                effects: [
                    {
                        id: 'EM_LF_1',
                        phenomenon: 'Economia duale estrema',
                        description: 'Separazione totale insider/outsider',
                        probability: 0.8,
                        impact: {
                            economic: -0.7,
                            social: -0.9,
                            political: -0.6
                        }
                    }
                ]
            },
            'inclusive_flexibility': {
                trigger: ['Q1_no', 'Q2_yes', 'Q5_yes'],
                effects: [
                    {
                        id: 'EM_IF_1',
                        phenomenon: 'Hub innovazione mediterraneo',
                        description: 'Attrazione talenti + flessibilità',
                        probability: 0.6,
                        impact: {
                            economic: 0.8,
                            social: 0.7,
                            political: 0.5
                        }
                    }
                ]
            },
            'regulatory_chaos': {
                trigger: ['Q1_yes', 'Q3_yes', 'Q4_yes'],
                effects: [
                    {
                        id: 'EM_RC_1',
                        phenomenon: 'Paralisi normativa',
                        description: 'Impossibilità implementazione simultanea',
                        probability: 0.9,
                        impact: {
                            economic: -0.6,
                            social: -0.4,
                            political: -0.8
                        }
                    }
                ]
            }
        };

        // Causal chains: How effects propagate
        this.causalChains = {
            'assunzioni_collapse': {
                chain: ['Q1_E2', 'Q3_E2', 'labor_shortage', 'wage_inflation', 'competitiveness_loss'],
                amplification: 1.5,
                damping: 0.1,
                timeConstant: 12 // months
            },
            'pmi_extinction': {
                chain: ['Q2_E1', 'Q4_E1', 'pmi_bankruptcy', 'market_concentration', 'oligopoly'],
                amplification: 1.3,
                damping: 0.2,
                timeConstant: 24
            },
            'integration_boost': {
                chain: ['Q5_E1', 'Q5_E2', 'entrepreneurship_immigrant', 'innovation', 'gdp_growth'],
                amplification: 1.2,
                damping: 0.3,
                timeConstant: 36
            }
        };

        // Feedback loops
        this.feedbackLoops = {
            'negative_employment': {
                nodes: ['Q1_E2', 'unemployment', 'social_tension', 'political_pressure', 'Q1_reversal'],
                gain: -0.8,
                delay: 18,
                type: 'balancing'
            },
            'positive_exodus': {
                nodes: ['Q1_E3', 'youth_unemployment', 'brain_drain', 'innovation_loss', 'more_rigidity'],
                gain: 1.2,
                delay: 24,
                type: 'reinforcing'
            }
        };

        // System states for different permutations
        this.systemStates = new Map();
    }

    // Calculate the full causal network for a given permutation
    calculateCausalNetwork(votes) {
        const network = {
            nodes: [],
            edges: [],
            clusters: [],
            metrics: {}
        };

        // Step 1: Add first-order effects based on votes
        votes.forEach((vote, index) => {
            const question = `Q${index + 1}`;
            if (vote) {
                const effects = this.firstOrderEffects[question].immediate;
                effects.forEach(effect => {
                    network.nodes.push({
                        id: effect.id,
                        type: 'first_order',
                        question: question,
                        label: effect.effect,
                        magnitude: effect.magnitude,
                        latency: effect.latency,
                        category: effect.type
                    });
                });
            }
        });

        // Step 2: Check for second-order interactions
        const activeInteractions = this.checkSecondOrderInteractions(votes);
        activeInteractions.forEach(interaction => {
            network.nodes.push({
                id: interaction.id,
                type: 'second_order',
                label: interaction.effect,
                magnitude: interaction.magnitude,
                mechanism: interaction.mechanism
            });

            // Add edges showing the interaction
            const sources = this.getInteractionSources(interaction);
            sources.forEach(source => {
                network.edges.push({
                    source: source,
                    target: interaction.id,
                    type: 'amplification',
                    weight: Math.abs(interaction.magnitude)
                });
            });
        });

        // Step 3: Check for emergent phenomena
        const emergentEffects = this.checkEmergentPhenomena(votes);
        emergentEffects.forEach(phenomenon => {
            network.nodes.push({
                id: phenomenon.id,
                type: 'emergent',
                label: phenomenon.phenomenon,
                description: phenomenon.description,
                probability: phenomenon.probability,
                impact: phenomenon.impact
            });

            // Connect to triggering conditions
            phenomenon.triggers.forEach(trigger => {
                network.edges.push({
                    source: trigger,
                    target: phenomenon.id,
                    type: 'emergence',
                    weight: phenomenon.probability
                });
            });
        });

        // Step 4: Trace causal chains
        const activeChains = this.traceActiveCausalChains(network.nodes);
        activeChains.forEach(chain => {
            for (let i = 0; i < chain.nodes.length - 1; i++) {
                network.edges.push({
                    source: chain.nodes[i],
                    target: chain.nodes[i + 1],
                    type: 'causal_chain',
                    weight: chain.strength,
                    delay: chain.delays[i]
                });
            }
        });

        // Step 5: Identify feedback loops
        const loops = this.identifyFeedbackLoops(network);
        loops.forEach(loop => {
            network.clusters.push({
                type: 'feedback_loop',
                nodes: loop.nodes,
                gain: loop.gain,
                stability: loop.gain < 1 ? 'stable' : 'unstable'
            });
        });

        // Calculate network metrics
        network.metrics = this.calculateNetworkMetrics(network);

        return network;
    }

    // Check which second-order interactions are active
    checkSecondOrderInteractions(votes) {
        const active = [];
        
        Object.entries(this.secondOrderInteractions).forEach(([key, interactions]) => {
            const [q1, q2] = key.split('+');
            const q1Index = parseInt(q1.substring(1)) - 1;
            const q2Index = parseInt(q2.substring(1)) - 1;
            
            interactions.forEach(interaction => {
                let isActive = false;
                
                switch(interaction.condition) {
                    case 'both_yes':
                        isActive = votes[q1Index] && votes[q2Index];
                        break;
                    case 'both_no':
                        isActive = !votes[q1Index] && !votes[q2Index];
                        break;
                    case `${q1}_yes_${q2}_no`:
                        isActive = votes[q1Index] && !votes[q2Index];
                        break;
                    case `${q1}_no_${q2}_yes`:
                        isActive = !votes[q1Index] && votes[q2Index];
                        break;
                }
                
                if (isActive) {
                    active.push(interaction);
                }
            });
        });
        
        return active;
    }

    // Check for emergent phenomena based on vote configuration
    checkEmergentPhenomena(votes) {
        const emergent = [];
        
        Object.entries(this.emergentPhenomena).forEach(([key, phenomenon]) => {
            const triggered = phenomenon.trigger.every(condition => {
                const [question, expected] = condition.split('_');
                const qIndex = parseInt(question.substring(1)) - 1;
                return expected === 'yes' ? votes[qIndex] : !votes[qIndex];
            });
            
            if (triggered) {
                phenomenon.effects.forEach(effect => {
                    emergent.push({
                        ...effect,
                        triggers: phenomenon.trigger
                    });
                });
            }
        });
        
        return emergent;
    }

    // Trace active causal chains through the network
    traceActiveCausalChains(nodes) {
        const chains = [];
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        
        Object.entries(this.causalChains).forEach(([key, chain]) => {
            const activeNodes = chain.chain.filter(nodeId => 
                nodeMap.has(nodeId) || this.isDerivedNode(nodeId, nodeMap)
            );
            
            if (activeNodes.length >= 2) {
                const strength = Math.pow(chain.amplification, activeNodes.length - 1) * 
                                (1 - chain.damping * activeNodes.length);
                
                chains.push({
                    id: key,
                    nodes: activeNodes,
                    strength: strength,
                    delays: this.calculateChainDelays(activeNodes.length, chain.timeConstant)
                });
            }
        });
        
        return chains;
    }

    // Calculate delays for causal chain propagation
    calculateChainDelays(length, timeConstant) {
        const delays = [];
        for (let i = 0; i < length - 1; i++) {
            delays.push(timeConstant * Math.exp(-i * 0.3));
        }
        return delays;
    }

    // Identify feedback loops in the network
    identifyFeedbackLoops(network) {
        const loops = [];
        const visited = new Set();
        
        // Simple cycle detection for feedback loops
        network.nodes.forEach(node => {
            if (!visited.has(node.id)) {
                const path = [];
                const cycle = this.findCycle(node.id, network, visited, path);
                if (cycle) {
                    loops.push(this.analyzeFeedbackLoop(cycle, network));
                }
            }
        });
        
        return loops;
    }

    // Find cycles in the network (simplified)
    findCycle(nodeId, network, visited, path) {
        if (path.includes(nodeId)) {
            return path.slice(path.indexOf(nodeId));
        }
        
        visited.add(nodeId);
        path.push(nodeId);
        
        const edges = network.edges.filter(e => e.source === nodeId);
        for (const edge of edges) {
            const cycle = this.findCycle(edge.target, network, visited, path);
            if (cycle) return cycle;
        }
        
        path.pop();
        return null;
    }

    // Analyze properties of a feedback loop
    analyzeFeedbackLoop(cycle, network) {
        let totalGain = 1;
        let totalDelay = 0;
        
        for (let i = 0; i < cycle.length; i++) {
            const source = cycle[i];
            const target = cycle[(i + 1) % cycle.length];
            const edge = network.edges.find(e => e.source === source && e.target === target);
            
            if (edge) {
                totalGain *= edge.weight;
                totalDelay += edge.delay || 0;
            }
        }
        
        return {
            nodes: cycle,
            gain: totalGain,
            delay: totalDelay,
            type: totalGain > 1 ? 'reinforcing' : 'balancing'
        };
    }

    // Calculate network-level metrics
    calculateNetworkMetrics(network) {
        const metrics = {
            complexity: 0,
            instability: 0,
            propagationSpeed: 0,
            systemicRisk: 0
        };
        
        // Complexity: nodes + edges + loops
        metrics.complexity = network.nodes.length + 
                           network.edges.length * 0.5 + 
                           network.clusters.length * 2;
        
        // Instability: based on feedback loops and magnitudes
        metrics.instability = network.clusters
            .filter(c => c.type === 'feedback_loop' && c.gain > 1)
            .reduce((sum, loop) => sum + loop.gain, 0);
        
        // Propagation speed: inverse of average delay
        const avgDelay = network.edges
            .filter(e => e.delay)
            .reduce((sum, e) => sum + e.delay, 0) / network.edges.length || 1;
        metrics.propagationSpeed = 1 / avgDelay;
        
        // Systemic risk: combination of all factors
        metrics.systemicRisk = Math.min(1, 
            (metrics.complexity / 100) * 0.3 +
            (metrics.instability / 10) * 0.4 +
            (metrics.propagationSpeed) * 0.3
        );
        
        return metrics;
    }

    // Helper to check if a node is derived from active nodes
    isDerivedNode(nodeId, nodeMap) {
        // Check if this node would be created by active effects
        return false; // Simplified for now
    }

    // Get source nodes for an interaction
    getInteractionSources(interaction) {
        const sources = [];
        const mechanism = interaction.mechanism;
        
        // Parse mechanism to find source effects
        const matches = mechanism.match(/Q\d_E\d/g);
        if (matches) {
            sources.push(...matches);
        }
        
        return sources;
    }

    // Generate time series of network evolution
    generateNetworkTimeSeries(votes, months = 60) {
        const timeSeries = [];
        const baseNetwork = this.calculateCausalNetwork(votes);
        
        for (let t = 0; t <= months; t++) {
            const snapshot = {
                time: t,
                activeNodes: [],
                activeEdges: [],
                metrics: {}
            };
            
            // Activate nodes based on their latency
            baseNetwork.nodes.forEach(node => {
                if (node.latency <= t) {
                    const activation = 1 - Math.exp(-(t - node.latency) / 6);
                    snapshot.activeNodes.push({
                        ...node,
                        activation: activation
                    });
                }
            });
            
            // Activate edges based on delays
            baseNetwork.edges.forEach(edge => {
                const delay = edge.delay || 0;
                if (t >= delay) {
                    const strength = edge.weight * (1 - Math.exp(-(t - delay) / 12));
                    snapshot.activeEdges.push({
                        ...edge,
                        strength: strength
                    });
                }
            });
            
            // Recalculate metrics for this timestamp
            snapshot.metrics = this.calculateSnapshotMetrics(snapshot);
            timeSeries.push(snapshot);
        }
        
        return timeSeries;
    }

    // Calculate metrics for a network snapshot
    calculateSnapshotMetrics(snapshot) {
        const metrics = {
            activeComplexity: snapshot.activeNodes.length + snapshot.activeEdges.length * 0.5,
            totalActivation: snapshot.activeNodes.reduce((sum, n) => sum + n.activation, 0),
            networkDensity: snapshot.activeEdges.length / 
                           (snapshot.activeNodes.length * (snapshot.activeNodes.length - 1) / 2 || 1)
        };
        
        return metrics;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CausalNetworkEngine;
}