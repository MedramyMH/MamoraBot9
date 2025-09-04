// Machine Learning Engine
// Implements self-teaching algorithms that evolve through continuous exposure to live and historical trading data
// Increases accuracy and decision quality over time

class MLEngine {
  constructor() {
    this.learningData = [];
    this.patterns = new Map();
    this.weights = {
      technicalIndicators: 0.3,
      marketSentiment: 0.25,
      volumeAnalysis: 0.2,
      priceAction: 0.15,
      timeOfDay: 0.1
    };
    
    this.performance = {
      accuracy: 0.5, // Start at 50%
      totalPredictions: 0,
      correctPredictions: 0,
      learningRate: 0.01,
      adaptationCycles: 0
    };

    this.neuralNetwork = this.initializeNetwork();
    this.isLearning = false;
  }

  // Initialize simple neural network structure
  initializeNetwork() {
    return {
      inputLayer: 10, // Number of input features
      hiddenLayers: [8, 6], // Hidden layer sizes
      outputLayer: 3, // Buy, Sell, Wait
      weights: this.generateRandomWeights(),
      biases: this.generateRandomBiases(),
      activationHistory: []
    };
  }

  // Generate random weights for network initialization
  generateRandomWeights() {
    const weights = {};
    weights.input_hidden1 = this.createMatrix(10, 8);
    weights.hidden1_hidden2 = this.createMatrix(8, 6);
    weights.hidden2_output = this.createMatrix(6, 3);
    return weights;
  }

  // Generate random biases
  generateRandomBiases() {
    return {
      hidden1: new Array(8).fill(0).map(() => (Math.random() - 0.5) * 0.1),
      hidden2: new Array(6).fill(0).map(() => (Math.random() - 0.5) * 0.1),
      output: new Array(3).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    };
  }

  // Create matrix with random values
  createMatrix(rows, cols) {
    return new Array(rows).fill(0).map(() => 
      new Array(cols).fill(0).map(() => (Math.random() - 0.5) * 0.2)
    );
  }

  // Start continuous learning process
  startLearning() {
    if (this.isLearning) return;
    
    this.isLearning = true;
    this.learningInterval = setInterval(() => {
      this.performLearningCycle();
    }, 5000); // Learn every 5 seconds
  }

  // Stop learning process
  stopLearning() {
    if (this.learningInterval) {
      clearInterval(this.learningInterval);
      this.isLearning = false;
    }
  }

  // Perform a learning cycle
  performLearningCycle() {
    try {
      // Analyze recent performance
      this.analyzeRecentPerformance();
      
      // Update pattern recognition
      this.updatePatternRecognition();
      
      // Adjust weights based on feedback
      this.adjustWeights();
      
      // Evolve neural network
      this.evolveNetwork();
      
      this.performance.adaptationCycles++;
      
      console.log(`ML Learning Cycle ${this.performance.adaptationCycles} completed. Accuracy: ${(this.performance.accuracy * 100).toFixed(1)}%`);
    } catch (error) {
      console.error('Learning cycle error:', error);
    }
  }

  // Process market data and make prediction
  predict(marketData, historicalData = []) {
    const features = this.extractFeatures(marketData, historicalData);
    const prediction = this.forwardPass(features);
    
    // Store prediction for later learning
    this.storePrediction(features, prediction, marketData);
    
    return {
      action: this.interpretPrediction(prediction),
      confidence: Math.max(...prediction),
      probabilities: {
        buy: prediction[0],
        sell: prediction[1],
        wait: prediction[2]
      },
      reasoning: this.generateReasoning(features, prediction),
      marketConditions: this.assessMarketConditions(features)
    };
  }

  // Extract features from market data
  extractFeatures(marketData, historicalData) {
    const features = new Array(10).fill(0);
    
    if (!marketData || Object.keys(marketData).length === 0) {
      return features;
    }

    const symbols = Object.keys(marketData);
    const avgChange = symbols.reduce((sum, symbol) => {
      return sum + (marketData[symbol].change24h || 0);
    }, 0) / symbols.length;

    const avgVolume = symbols.reduce((sum, symbol) => {
      return sum + (marketData[symbol].volume || 0);
    }, 0) / symbols.length;

    // Feature extraction
    features[0] = Math.tanh(avgChange * 10); // Price momentum
    features[1] = Math.tanh(avgVolume / 1000000); // Volume indicator
    features[2] = this.calculateVolatilityFeature(marketData);
    features[3] = this.calculateTrendStrength(marketData);
    features[4] = this.calculateMarketSentiment(marketData);
    features[5] = this.getTimeOfDayFeature();
    features[6] = this.calculateSupportResistance(marketData);
    features[7] = this.calculateMomentumDivergence(marketData, historicalData);
    features[8] = this.calculateCorrelationStrength(marketData);
    features[9] = this.calculateMarketStress(marketData);

    return features;
  }

  // Neural network forward pass
  forwardPass(features) {
    // Input to hidden layer 1
    const hidden1 = this.matrixMultiply([features], this.neuralNetwork.weights.input_hidden1)[0]
      .map((val, i) => this.relu(val + this.neuralNetwork.biases.hidden1[i]));

    // Hidden layer 1 to hidden layer 2
    const hidden2 = this.matrixMultiply([hidden1], this.neuralNetwork.weights.hidden1_hidden2)[0]
      .map((val, i) => this.relu(val + this.neuralNetwork.biases.hidden2[i]));

    // Hidden layer 2 to output
    const output = this.matrixMultiply([hidden2], this.neuralNetwork.weights.hidden2_output)[0]
      .map((val, i) => val + this.neuralNetwork.biases.output[i]);

    // Apply softmax to get probabilities
    return this.softmax(output);
  }

  // Matrix multiplication helper
  matrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < b.length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  // ReLU activation function
  relu(x) {
    return Math.max(0, x);
  }

  // Softmax activation function
  softmax(arr) {
    const maxVal = Math.max(...arr);
    const exp = arr.map(x => Math.exp(x - maxVal));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(x => x / sum);
  }

  // Interpret prediction probabilities
  interpretPrediction(prediction) {
    const [buyProb, sellProb, waitProb] = prediction;
    const maxProb = Math.max(buyProb, sellProb, waitProb);
    
    if (maxProb === buyProb) return 'BUY';
    if (maxProb === sellProb) return 'SELL';
    return 'WAIT';
  }

  // Store prediction for learning
  storePrediction(features, prediction, marketData) {
    this.learningData.push({
      timestamp: Date.now(),
      features: [...features],
      prediction: [...prediction],
      marketData: JSON.parse(JSON.stringify(marketData)),
      outcome: null // Will be filled when we get the actual result
    });

    // Keep only recent data for performance
    if (this.learningData.length > 1000) {
      this.learningData = this.learningData.slice(-500);
    }
  }

  // Update prediction outcome for learning
  updatePredictionOutcome(timestamp, actualOutcome) {
    const prediction = this.learningData.find(p => 
      Math.abs(p.timestamp - timestamp) < 60000 // Within 1 minute
    );
    
    if (prediction) {
      prediction.outcome = actualOutcome;
      this.updatePerformanceMetrics(prediction);
    }
  }

  // Update performance metrics
  updatePerformanceMetrics(prediction) {
    this.performance.totalPredictions++;
    
    const predictedAction = this.interpretPrediction(prediction.prediction);
    const wasCorrect = predictedAction === prediction.outcome;
    
    if (wasCorrect) {
      this.performance.correctPredictions++;
    }
    
    this.performance.accuracy = this.performance.correctPredictions / this.performance.totalPredictions;
  }

  // Analyze recent performance for learning
  analyzeRecentPerformance() {
    const recentPredictions = this.learningData
      .filter(p => p.outcome !== null)
      .slice(-50); // Last 50 predictions

    if (recentPredictions.length < 10) return;

    const recentAccuracy = recentPredictions.filter(p => {
      const predicted = this.interpretPrediction(p.prediction);
      return predicted === p.outcome;
    }).length / recentPredictions.length;

    // Adjust learning rate based on performance
    if (recentAccuracy > 0.7) {
      this.performance.learningRate *= 0.95; // Slow down learning when doing well
    } else if (recentAccuracy < 0.4) {
      this.performance.learningRate *= 1.05; // Speed up learning when struggling
    }

    // Cap learning rate
    this.performance.learningRate = Math.max(0.001, Math.min(0.1, this.performance.learningRate));
  }

  // Update pattern recognition
  updatePatternRecognition() {
    const recentData = this.learningData.slice(-100);
    
    // Identify successful patterns
    const successfulPatterns = recentData.filter(p => {
      if (!p.outcome) return false;
      const predicted = this.interpretPrediction(p.prediction);
      return predicted === p.outcome;
    });

    // Update pattern weights
    successfulPatterns.forEach(pattern => {
      const patternKey = this.createPatternKey(pattern.features);
      if (!this.patterns.has(patternKey)) {
        this.patterns.set(patternKey, { count: 0, success: 0 });
      }
      
      const patternData = this.patterns.get(patternKey);
      patternData.count++;
      patternData.success++;
      
      // Increase weight for successful patterns
      const successRate = patternData.success / patternData.count;
      if (successRate > 0.7) {
        this.adjustPatternWeights(pattern.features, 1.02);
      }
    });
  }

  // Create pattern key from features
  createPatternKey(features) {
    return features.map(f => Math.round(f * 10) / 10).join(',');
  }

  // Adjust pattern weights
  adjustPatternWeights(features, multiplier) {
    // Simple weight adjustment based on feature importance
    features.forEach((feature, index) => {
      if (Math.abs(feature) > 0.5) { // Significant feature
        const weightKey = Object.keys(this.weights)[index % Object.keys(this.weights).length];
        this.weights[weightKey] *= multiplier;
      }
    });

    // Normalize weights
    const totalWeight = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    Object.keys(this.weights).forEach(key => {
      this.weights[key] /= totalWeight;
    });
  }

  // Adjust neural network weights
  adjustWeights() {
    const recentFailures = this.learningData
      .filter(p => p.outcome !== null)
      .slice(-20)
      .filter(p => {
        const predicted = this.interpretPrediction(p.prediction);
        return predicted !== p.outcome;
      });

    // Simple weight adjustment for recent failures
    recentFailures.forEach(failure => {
      this.backpropagate(failure.features, failure.outcome);
    });
  }

  // Simple backpropagation
  backpropagate(features, correctOutcome) {
    const targetOutput = [0, 0, 0];
    if (correctOutcome === 'BUY') targetOutput[0] = 1;
    else if (correctOutcome === 'SELL') targetOutput[1] = 1;
    else targetOutput[2] = 1;

    const currentOutput = this.forwardPass(features);
    const outputError = targetOutput.map((target, i) => target - currentOutput[i]);

    // Simple weight adjustment (gradient descent approximation)
    const learningRate = this.performance.learningRate;
    
    // Adjust output layer biases
    this.neuralNetwork.biases.output = this.neuralNetwork.biases.output.map((bias, i) => 
      bias + learningRate * outputError[i]
    );
  }

  // Evolve network structure
  evolveNetwork() {
    // Occasionally add small random mutations to prevent local minima
    if (Math.random() < 0.01) { // 1% chance per cycle
      this.mutateWeights();
    }
  }

  // Add small mutations to weights
  mutateWeights() {
    const mutationRate = 0.01;
    
    // Mutate a few random weights
    Object.keys(this.neuralNetwork.weights).forEach(layerKey => {
      const layer = this.neuralNetwork.weights[layerKey];
      for (let i = 0; i < layer.length; i++) {
        for (let j = 0; j < layer[i].length; j++) {
          if (Math.random() < mutationRate) {
            layer[i][j] += (Math.random() - 0.5) * 0.1;
          }
        }
      }
    });
  }

  // Feature calculation methods
  calculateVolatilityFeature(marketData) {
    const changes = Object.values(marketData).map(d => Math.abs(d.change24h || 0));
    const avgVolatility = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    return Math.tanh(avgVolatility * 20);
  }

  calculateTrendStrength(marketData) {
    const changes = Object.values(marketData).map(d => d.change24h || 0);
    const positiveCount = changes.filter(c => c > 0).length;
    const strength = (positiveCount / changes.length) - 0.5; // -0.5 to 0.5
    return strength * 2; // -1 to 1
  }

  calculateMarketSentiment(marketData) {
    const changes = Object.values(marketData).map(d => d.change24h || 0);
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    return Math.tanh(avgChange * 10);
  }

  getTimeOfDayFeature() {
    const hour = new Date().getHours();
    // Convert to sine wave for cyclical nature
    return Math.sin((hour / 24) * 2 * Math.PI);
  }

  calculateSupportResistance(marketData) {
    // Simplified support/resistance based on price clustering
    const prices = Object.values(marketData).map(d => d.price || 0);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const priceSpread = Math.max(...prices) - Math.min(...prices);
    return priceSpread > 0 ? Math.tanh(priceSpread / avgPrice) : 0;
  }

  calculateMomentumDivergence(marketData, historicalData) {
    if (!historicalData || historicalData.length < 2) return 0;
    
    // Simple momentum calculation
    const currentPrices = Object.values(marketData).map(d => d.price || 0);
    const currentAvg = currentPrices.reduce((sum, price) => sum + price, 0) / currentPrices.length;
    
    // Compare with recent historical average
    const recentHistorical = historicalData.slice(-5);
    if (recentHistorical.length === 0) return 0;
    
    const historicalAvg = recentHistorical.reduce((sum, data) => {
      const prices = Object.values(data).map(d => d.price || 0);
      return sum + (prices.reduce((s, p) => s + p, 0) / prices.length);
    }, 0) / recentHistorical.length;
    
    const momentum = historicalAvg > 0 ? (currentAvg - historicalAvg) / historicalAvg : 0;
    return Math.tanh(momentum * 10);
  }

  calculateCorrelationStrength(marketData) {
    const changes = Object.values(marketData).map(d => d.change24h || 0);
    if (changes.length < 2) return 0;
    
    // Simple correlation measure - how many assets move in same direction
    const positiveChanges = changes.filter(c => c > 0).length;
    const correlation = Math.abs((positiveChanges / changes.length) - 0.5) * 2;
    return correlation;
  }

  calculateMarketStress(marketData) {
    const volumes = Object.values(marketData).map(d => d.volume || 0);
    const changes = Object.values(marketData).map(d => Math.abs(d.change24h || 0));
    
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    
    // High volume + high volatility = market stress
    const stress = avgVolume > 500000 && avgChange > 0.05 ? 1 : 0;
    return stress;
  }

  // Generate reasoning for ML prediction
  generateReasoning(features, prediction) {
    const reasons = [];
    const [buyProb, sellProb, waitProb] = prediction;
    
    // Analyze key features
    if (Math.abs(features[0]) > 0.5) {
      reasons.push(`Strong price momentum detected (${features[0] > 0 ? 'bullish' : 'bearish'})`);
    }
    
    if (features[1] > 0.5) {
      reasons.push('High trading volume indicates strong market interest');
    }
    
    if (features[2] > 0.6) {
      reasons.push('High volatility suggests caution or opportunity');
    }
    
    if (Math.abs(features[4]) > 0.4) {
      reasons.push(`Market sentiment is ${features[4] > 0 ? 'positive' : 'negative'}`);
    }
    
    // Add confidence reasoning
    const maxProb = Math.max(buyProb, sellProb, waitProb);
    if (maxProb > 0.7) {
      reasons.push('High confidence prediction based on strong signal patterns');
    } else if (maxProb < 0.4) {
      reasons.push('Low confidence - mixed signals suggest waiting');
    }
    
    return reasons.length > 0 ? reasons.join('. ') + '.' : 'Analysis based on current market patterns and learned behaviors.';
  }

  // Assess current market conditions
  assessMarketConditions(features) {
    return {
      momentum: features[0] > 0.3 ? 'bullish' : features[0] < -0.3 ? 'bearish' : 'neutral',
      volatility: features[2] > 0.6 ? 'high' : features[2] < 0.3 ? 'low' : 'medium',
      volume: features[1] > 0.5 ? 'high' : 'normal',
      sentiment: features[4] > 0.2 ? 'positive' : features[4] < -0.2 ? 'negative' : 'neutral',
      stress: features[9] > 0.5 ? 'high' : 'low'
    };
  }

  // Get learning statistics
  getLearningStats() {
    return {
      ...this.performance,
      totalPatterns: this.patterns.size,
      recentDataPoints: this.learningData.length,
      isLearning: this.isLearning,
      weights: { ...this.weights }
    };
  }

  // Reset learning data
  resetLearning() {
    this.learningData = [];
    this.patterns.clear();
    this.performance = {
      accuracy: 0.5,
      totalPredictions: 0,
      correctPredictions: 0,
      learningRate: 0.01,
      adaptationCycles: 0
    };
    this.neuralNetwork = this.initializeNetwork();
  }
}

export default MLEngine;