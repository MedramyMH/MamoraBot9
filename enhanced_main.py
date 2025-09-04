import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import requests
import time
import threading
from dataclasses import dataclass
from typing import Dict, List, Optional
import json

# Configure Streamlit page
st.set_page_config(
    page_title="MamoraBot7 - Enhanced Trading AI",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

@dataclass
class StructuredTradingSignal:
    signal: str  # 'BUY', 'SELL', 'HOLD'
    asset: str
    timeframe: str
    contract_period: str
    entry_zone: str
    target: str
    stop_loss: str
    confidence: int
    reasoning: str
    timestamp: datetime

class EnhancedTradingEngine:
    """Enhanced trading engine with structured signal format"""
    
    def __init__(self):
        self.signals_history = []
        
    def generate_structured_signal(self, symbol: str, market_data: Dict, timeframe: str = '15m') -> StructuredTradingSignal:
        """Generate structured trading signals in the specified format"""
        
        # Calculate technical indicators
        indicators = self.calculate_indicators(market_data['hist'])
        
        # Analyze signal
        signal_analysis = self.analyze_signal_strength(indicators, market_data['current_price'])
        
        # Calculate confidence dynamically
        confidence = self.calculate_dynamic_confidence(signal_analysis, indicators)
        
        # Calculate entry/exit zones
        zones = self.calculate_entry_exit_zones(market_data['current_price'], signal_analysis, indicators)
        
        # Generate reasoning
        reasoning = self.generate_reasoning(signal_analysis, indicators)
        
        # Format asset symbol
        formatted_asset = self.format_asset_symbol(symbol)
        
        # Determine contract period
        contract_period = self.get_contract_period(timeframe, signal_analysis['strength'])
        
        return StructuredTradingSignal(
            signal=signal_analysis['type'],
            asset=formatted_asset,
            timeframe=timeframe,
            contract_period=contract_period,
            entry_zone=zones['entry'],
            target=zones['target'],
            stop_loss=zones['stop_loss'],
            confidence=confidence,
            reasoning=reasoning,
            timestamp=datetime.now()
        )
    
    def calculate_indicators(self, hist_data: pd.DataFrame) -> Dict:
        """Calculate technical indicators"""
        indicators = {}
        
        # Moving Averages
        indicators['sma_20'] = hist_data['Close'].rolling(window=20).mean().iloc[-1]
        indicators['sma_50'] = hist_data['Close'].rolling(window=50).mean().iloc[-1]
        indicators['ema_12'] = hist_data['Close'].ewm(span=12).mean().iloc[-1]
        indicators['ema_26'] = hist_data['Close'].ewm(span=26).mean().iloc[-1]
        
        # RSI
        delta = hist_data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        indicators['rsi'] = 100 - (100 / (1 + rs)).iloc[-1]
        
        # MACD
        indicators['macd'] = indicators['ema_12'] - indicators['ema_26']
        indicators['macd_signal'] = pd.Series([indicators['macd']]).ewm(span=9).mean().iloc[0]
        indicators['macd_histogram'] = indicators['macd'] - indicators['macd_signal']
        
        # Bollinger Bands
        bb_period = 20
        bb_std = 2
        sma = hist_data['Close'].rolling(window=bb_period).mean()
        std = hist_data['Close'].rolling(window=bb_period).std()
        indicators['bb_upper'] = (sma + (std * bb_std)).iloc[-1]
        indicators['bb_lower'] = (sma - (std * bb_std)).iloc[-1]
        indicators['bb_middle'] = sma.iloc[-1]
        
        # Volume analysis
        indicators['volume_avg'] = hist_data['Volume'].rolling(window=20).mean().iloc[-1]
        indicators['volume_current'] = hist_data['Volume'].iloc[-1]
        
        return indicators
    
    def analyze_signal_strength(self, indicators: Dict, current_price: float) -> Dict:
        """Analyze signal strength and type"""
        signal_strength = 0
        signal_factors = []
        
        # RSI signals
        if indicators['rsi'] < 30:
            signal_strength += 1
            signal_factors.append('RSI oversold')
        elif indicators['rsi'] > 70:
            signal_strength -= 1
            signal_factors.append('RSI overbought')
        
        # MACD signals
        if indicators['macd_histogram'] > 0:
            signal_strength += 0.5
            signal_factors.append('MACD bullish')
        else:
            signal_strength -= 0.5
            signal_factors.append('MACD bearish')
        
        # Moving Average signals
        if current_price > indicators['sma_20'] > indicators['sma_50']:
            signal_strength += 0.5
            signal_factors.append('Price above MAs')
        elif current_price < indicators['sma_20'] < indicators['sma_50']:
            signal_strength -= 0.5
            signal_factors.append('Price below MAs')
        
        # Bollinger Bands
        if current_price < indicators['bb_lower']:
            signal_strength += 0.3
            signal_factors.append('Near lower BB')
        elif current_price > indicators['bb_upper']:
            signal_strength -= 0.3
            signal_factors.append('Near upper BB')
        
        # Volume confirmation
        if indicators['volume_current'] > indicators['volume_avg'] * 1.2:
            signal_factors.append('Strong volume')
        
        # Determine signal type
        if signal_strength > 0.5:
            signal_type = 'BUY'
        elif signal_strength < -0.5:
            signal_type = 'SELL'
        else:
            signal_type = 'HOLD'
        
        return {
            'type': signal_type,
            'strength': abs(signal_strength),
            'factors': signal_factors,
            'raw_strength': signal_strength
        }
    
    def calculate_dynamic_confidence(self, signal_analysis: Dict, indicators: Dict) -> int:
        """Calculate dynamic confidence percentage"""
        base_confidence = 50
        
        # Adjust based on signal strength
        confidence_adjustment = signal_analysis['strength'] * 20
        
        # RSI extreme adjustments
        if indicators['rsi'] < 20 or indicators['rsi'] > 80:
            confidence_adjustment += 10
        
        # MACD strength
        if abs(indicators['macd_histogram']) > 0.5:
            confidence_adjustment += 5
        
        # Volume confirmation
        if indicators['volume_current'] > indicators['volume_avg'] * 1.5:
            confidence_adjustment += 10
        
        final_confidence = base_confidence + confidence_adjustment
        return min(95, max(10, int(final_confidence)))
    
    def calculate_entry_exit_zones(self, current_price: float, signal_analysis: Dict, indicators: Dict) -> Dict:
        """Calculate entry zone, target, and stop loss"""
        volatility = abs(indicators['bb_upper'] - indicators['bb_lower']) / current_price
        
        if signal_analysis['type'] == 'BUY':
            entry_low = current_price * (1 - volatility * 0.5)
            entry_high = current_price * (1 + volatility * 0.2)
            entry_zone = f"{entry_low:.2f} – {entry_high:.2f}"
            target = f"{current_price * (1 + volatility * 2):.2f}"
            stop_loss = f"{current_price * (1 - volatility * 1.5):.2f}"
        elif signal_analysis['type'] == 'SELL':
            entry_low = current_price * (1 - volatility * 0.2)
            entry_high = current_price * (1 + volatility * 0.5)
            entry_zone = f"{entry_low:.2f} – {entry_high:.2f}"
            target = f"{current_price * (1 - volatility * 2):.2f}"
            stop_loss = f"{current_price * (1 + volatility * 1.5):.2f}"
        else:
            entry_zone = f"{current_price * 0.995:.2f} – {current_price * 1.005:.2f}"
            target = f"{current_price:.2f}"
            stop_loss = f"{current_price:.2f}"
        
        return {
            'entry': entry_zone,
            'target': target,
            'stop_loss': stop_loss
        }
    
    def generate_reasoning(self, signal_analysis: Dict, indicators: Dict) -> str:
        """Generate reasoning for the signal"""
        reasons = []
        
        if signal_analysis['type'] == 'BUY':
            if indicators['rsi'] < 35:
                reasons.append('RSI indicates oversold conditions')
            if indicators['macd_histogram'] > 0:
                reasons.append('MACD showing bullish momentum')
            if 'Strong volume' in signal_analysis['factors']:
                reasons.append('Strong volume confirmation')
        elif signal_analysis['type'] == 'SELL':
            if indicators['rsi'] > 65:
                reasons.append('RSI indicates overbought conditions')
            if indicators['macd_histogram'] < 0:
                reasons.append('MACD showing bearish momentum')
            if 'Strong volume' in signal_analysis['factors']:
                reasons.append('Strong volume confirmation')
        else:
            reasons.append('Mixed signals suggest sideways movement')
        
        return '; '.join(reasons) if reasons else 'Technical analysis inconclusive'
    
    def format_asset_symbol(self, symbol: str) -> str:
        """Format symbol for display"""
        forex_pairs = {
            'EURUSD=X': 'EUR/USD',
            'GBPUSD=X': 'GBP/USD',
            'USDJPY=X': 'USD/JPY',
            'AUDUSD=X': 'AUD/USD',
            'USDCAD=X': 'USD/CAD'
        }
        
        crypto_pairs = {
            'BTC-USD': 'BTC/USDT',
            'ETH-USD': 'ETH/USDT',
            'BNB-USD': 'BNB/USDT',
            'ADA-USD': 'ADA/USDT',
            'SOL-USD': 'SOL/USDT'
        }
        
        return forex_pairs.get(symbol) or crypto_pairs.get(symbol) or symbol
    
    def get_contract_period(self, timeframe: str, strength: float) -> str:
        """Get recommended contract period"""
        periods = {
            '1m': '15 minutes' if strength > 0.7 else '5 minutes',
            '5m': '1 hour' if strength > 0.7 else '30 minutes',
            '15m': '4 hours' if strength > 0.7 else '2 hours',
            '1h': '1 day' if strength > 0.7 else '8 hours',
            '4h': '3 days' if strength > 0.7 else '1 day',
            '1d': '1 week' if strength > 0.7 else '3 days'
        }
        return periods.get(timeframe, '2 hours')

class EnhancedDataManager:
    """Enhanced data manager with forex and crypto support"""
    
    def __init__(self):
        self.cache = {}
        self.last_update = {}
        self.update_interval = 30
    
    def get_available_symbols(self):
        return {
            'stocks': ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META", "NFLX"],
            'forex': ["EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X", "USDCAD=X"],
            'crypto': ["BTC-USD", "ETH-USD", "BNB-USD", "ADA-USD", "SOL-USD"]
        }
    
    def get_market_data(self, symbol: str) -> Optional[Dict]:
        """Fetch market data for symbol"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="3mo", interval="1d")
            
            if hist.empty:
                return None
            
            current_price = hist['Close'].iloc[-1]
            volume = hist['Volume'].iloc[-1]
            change_percent = ((current_price - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2]) * 100
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'volume': volume,
                'change_percent': change_percent,
                'hist': hist,
                'timestamp': datetime.now()
            }
        except Exception as e:
            st.error(f"Error fetching data for {symbol}: {str(e)}")
            return None

def format_structured_signal(signal: StructuredTradingSignal) -> str:
    """Format signal in the structured format"""
    return f"""[Signal] {signal.signal}
[Asset] {signal.asset}
[Timeframe] {signal.timeframe}
[Contract Period] {signal.contract_period}
[Entry Zone] {signal.entry_zone}
[Target] {signal.target}
[Stop Loss] {signal.stop_loss}
[Confidence] {signal.confidence}%
[Reasoning] {signal.reasoning}"""

def main():
    st.title("🚀 MamoraBot7 - Enhanced Trading AI")
    st.markdown("### Professional Trading Signals with Structured Format")
    
    # Initialize components
    trading_engine = EnhancedTradingEngine()
    data_manager = EnhancedDataManager()
    
    # Sidebar configuration
    st.sidebar.header("⚙️ Configuration")
    
    # Symbol selection with categories
    symbols = data_manager.get_available_symbols()
    
    st.sidebar.subheader("📈 Select Assets")
    selected_stocks = st.sidebar.multiselect("Stocks", symbols['stocks'], default=symbols['stocks'][:2])
    selected_forex = st.sidebar.multiselect("Forex", symbols['forex'], default=symbols['forex'][:2])
    selected_crypto = st.sidebar.multiselect("Crypto", symbols['crypto'], default=symbols['crypto'][:2])
    
    all_selected = selected_stocks + selected_forex + selected_crypto
    
    # Timeframe selection
    timeframe = st.sidebar.selectbox("Timeframe", ['1m', '5m', '15m', '1h', '4h', '1d'], index=2)
    
    # Auto-refresh settings
    auto_refresh = st.sidebar.checkbox("Auto Refresh", value=True)
    refresh_interval = st.sidebar.slider("Refresh Interval (seconds)", 10, 300, 30)
    
    if not all_selected:
        st.warning("Please select at least one trading symbol from the sidebar.")
        return
    
    # Generate signals button
    if st.button("🎯 Generate Structured Trading Signals", type="primary"):
        st.markdown("---")
        
        for symbol in all_selected:
            with st.expander(f"📊 {symbol} - Structured Trading Signal", expanded=True):
                market_data = data_manager.get_market_data(symbol)
                
                if market_data:
                    # Generate structured signal
                    signal = trading_engine.generate_structured_signal(symbol, market_data, timeframe)
                    
                    # Display in two columns
                    col1, col2 = st.columns([2, 1])
                    
                    with col1:
                        st.markdown("#### 📋 Structured Signal Output")
                        st.code(format_structured_signal(signal), language="text")
                    
                    with col2:
                        st.markdown("#### 📊 Quick Metrics")
                        
                        # Signal badge
                        if signal.signal == 'BUY':
                            st.success(f"🟢 {signal.signal}")
                        elif signal.signal == 'SELL':
                            st.error(f"🔴 {signal.signal}")
                        else:
                            st.warning(f"🟡 {signal.signal}")
                        
                        # Confidence meter
                        st.metric("Confidence", f"{signal.confidence}%")
                        
                        # Current price
                        st.metric("Current Price", f"${market_data['current_price']:.2f}", 
                                f"{market_data['change_percent']:+.2f}%")
                        
                        # Timeframe and period
                        st.info(f"⏱️ {signal.timeframe} | {signal.contract_period}")
                else:
                    st.error(f"Unable to fetch data for {symbol}")
    
    # Auto-refresh mechanism
    if auto_refresh:
        time.sleep(1)
        st.rerun()

if __name__ == "__main__":
    main()