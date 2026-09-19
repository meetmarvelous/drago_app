import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Wallet, 
  ArrowRightLeft, 
  TrendingUp, 
  Globe2, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Layers, 
  Cpu, 
  ChevronRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Flame, 
  Activity, 
  RefreshCw, 
  ArrowUpRight, 
  CircleDollarSign, 
  ShieldAlert, 
  Send,
  Menu,
  X,
  Clock,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import './App.css';

export default function App() {
  // State management
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('mint'); // 'mint' | 'transfer' | 'oracle' | 'synthetics'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Balances
  const [dgxBalance, setDgxBalance] = useState(12500.00);
  const [dgzBalance, setDgzBalance] = useState(1850000);
  const [usdcBalance, setUsdcBalance] = useState(25000.00);

  // Mint Form State
  const [mintInput, setMintInput] = useState('5000');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  // Transfer Form State
  const [transferAmount, setTransferAmount] = useState('3200');
  const [recipientCorridor, setRecipientCorridor] = useState('Tokyo Electronics Hub');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferReceipt, setTransferReceipt] = useState(null);

  // Dynamic FX & AI Oracle State
  const [fxRate, setFxRate] = useState(154.20); // JPY per USD
  const [aiRiskScore, setAiRiskScore] = useState(94);
  const [dynamicBorrowRate, setDynamicBorrowRate] = useState(0.42);
  const [copied, setCopied] = useState(false);

  // Scroll listener for interactive scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 120;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial view
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle live FX fluctuation ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFxRate((prev) => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Wallet Connect Handler
  const handleConnectWallet = () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress('');
    } else {
      setWalletConnected(true);
      setWalletAddress('0x4D9a...B882');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.1, x: 0.9 },
        colors: ['#10B981', '#06B6D4', '#6366F1']
      });
    }
  };

  // Mint DGX Handler
  const handleMintSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(mintInput);
    if (!amount || isNaN(amount) || amount <= 0) return;

    setIsMinting(true);
    setTimeout(() => {
      setDgxBalance((prev) => +(prev + amount).toFixed(2));
      setUsdcBalance((prev) => +(prev - amount).toFixed(2));
      setIsMinting(false);
      setMintSuccess(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B']
      });
      setTimeout(() => setMintSuccess(false), 4000);
    }, 1400);
  };

  // Cross-Border Transfer Handler
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || isNaN(amount) || amount <= 0 || amount > dgxBalance) return;

    setIsTransferring(true);
    setTimeout(() => {
      setDgxBalance((prev) => +(prev - amount).toFixed(2));
      const jpyReceived = Math.round(amount * fxRate);
      setTransferReceipt({
        txHash: '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        sentDgx: amount,
        receivedJpy: jpyReceived,
        corridor: recipientCorridor,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        savings: (amount * 0.042).toFixed(2)
      });
      setIsTransferring(false);
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#6366F1', '#10B981', '#EC4899']
      });
    }, 1600);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x4D9aC3792047dD7F99c43b9e4a3F11B882');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-wrapper">
      {/* Dynamic Background Mesh */}
      <div className="bg-mesh-canvas" />

      {/* 1. TOP SCROLLING ANNOUNCEMENT TICKER (Small Words Scrolling Carousel) */}
      <div className="ticker-container">
        <div className="ticker-track">
          <div className="ticker-item">
            <span className="live-pulse" />
            <span>DRAGO X TESTNET V1.4 LIVE ON SEPOLIA</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>AFRICA–JAPAN CORRIDOR FX SAVINGS: <strong>4.2% AVERAGE</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>INSTANT ATOMIC SETTLEMENT: <strong>1.8 SECONDS</strong> (vs 5-7 DAYS TRADFI)</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>LIVE ORACLE SPOT: <strong>1 USD = {fxRate} JPY</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>40 PASSING SOLIDITY TESTS • 97% COVERAGE • 150+ WAITLIST ENTERPRISES</span>
          </div>
          {/* Duplicate set for smooth infinite loop */}
          <div className="ticker-item">
            <span className="live-pulse" />
            <span>DRAGO X TESTNET V1.4 LIVE ON SEPOLIA</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>AFRICA–JAPAN CORRIDOR FX SAVINGS: <strong>4.2% AVERAGE</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>INSTANT ATOMIC SETTLEMENT: <strong>1.8 SECONDS</strong> (vs 5-7 DAYS TRADFI)</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>LIVE ORACLE SPOT: <strong>1 USD = {fxRate} JPY</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>40 PASSING SOLIDITY TESTS • 97% COVERAGE • 150+ WAITLIST ENTERPRISES</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY GLASS NAVBAR */}
      <header className="navbar">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-box">
            <ShieldCheck size={26} strokeWidth={2.4} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="brand-title">DRAGO X</span>
            <span className="brand-tag">CORRIDOR PROTOCOL</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#problems" className="nav-link-item">Why DRAGO X</a>
          <a href="#playground" className="nav-link-item active">Try the App</a>
          <a href="#tokens" className="nav-link-item">Currencies & Synthetics</a>
          <a href="#architecture" className="nav-link-item">How It Works</a>
        </nav>

        <div className="nav-actions">
          <div className="badge-pill badge-emerald nav-status-pill">
            <span className="live-pulse" />
            <span>Sepolia Active</span>
          </div>

          <button 
            className={walletConnected ? "btn-minimal nav-wallet-btn" : "btn-colorful nav-wallet-btn"}
            onClick={handleConnectWallet}
          >
            <Wallet size={18} />
            <span>{walletConnected ? walletAddress : 'Connect Wallet'}</span>
          </button>

          {/* Hamburger 3-lines button for mobile and tablets */}
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Dropdown */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          <a 
            href="#problems" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <AlertTriangle size={18} color="#E11D48" />
            <span>Why DRAGO X (Problems We Fix)</span>
          </a>
          <a 
            href="#playground" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Zap size={18} color="var(--color-indigo)" />
            <span>Try The Simulator</span>
          </a>
          <a 
            href="#tokens" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Layers size={18} color="var(--color-cyan)" />
            <span>Currencies & Synthetics</span>
          </a>
          <a 
            href="#architecture" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Cpu size={18} color="var(--color-emerald)" />
            <span>How It Works (7-Step Flow)</span>
          </a>
        </div>

        <div className="mobile-nav-footer">
          <div className="badge-pill badge-emerald" style={{ width: 'fit-content', marginBottom: 12 }}>
            <span className="live-pulse" />
            <span>Sepolia Testnet v1.4 Connected</span>
          </div>
          <button 
            className={walletConnected ? "btn-minimal" : "btn-colorful"}
            style={{ width: '100%' }}
            onClick={() => {
              handleConnectWallet();
              setMobileMenuOpen(false);
            }}
          >
            <Wallet size={18} />
            <span>{walletConnected ? walletAddress : 'Connect Web3 Wallet'}</span>
          </button>
        </div>
      </div>

      {/* 3. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge-row">
              <div className="badge-pill badge-indigo">
                <Sparkles size={14} />
                <span>Next-Gen Trade Finance</span>
              </div>
              <div className="badge-pill badge-cyan">
                <Globe2 size={14} />
                <span>Africa – Tokyo Direct Route</span>
              </div>
            </div>

            <h1 className="hero-headline">
              Stop Losing 5% on Wire Fees. Settle Invoices in <span className="text-gradient">Seconds</span>.
            </h1>

            <p className="hero-description">
              Tired of waiting 5 to 7 days for international wire transfers while banks eat 3% to 5% of your profit? DRAGO X helps African import-export businesses pay suppliers in Japan instantly at guaranteed rates using <strong>DGX</strong>.
            </p>

            <div className="hero-stats-strip">
              <div className="hero-stat-unit">
                <span className="hero-stat-number text-gradient-emerald">1.8s</span>
                <span className="hero-stat-desc">Instant Delivery</span>
              </div>
              <div style={{ width: 1, background: '#E2E8F0' }} />
              <div className="hero-stat-unit">
                <span className="hero-stat-number text-gradient">3–5%</span>
                <span className="hero-stat-desc">Your Margin Saved</span>
              </div>
              <div style={{ width: 1, background: '#E2E8F0' }} />
              <div className="hero-stat-unit">
                <span className="hero-stat-number text-gradient-amber">0%</span>
                <span className="hero-stat-desc">Hidden Bank Fees</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <a href="#problems" className="btn-colorful">
                See How We Save You Money
                <ChevronRight size={18} />
              </a>
              <a 
                href="#playground"
                className="btn-minimal"
              >
                <Zap size={18} color="var(--color-indigo)" />
                Try Interactive Demo
              </a>
            </div>
          </div>

          {/* Interactive Hero Media Card with generated artwork & live status */}
          <div className="hero-media-card floating-elem">
            <img 
              src="/drago_hero.jpg" 
              alt="DRAGO X Africa to Tokyo Financial Highway" 
              className="hero-artwork-img"
            />
            <div className="floating-status-chip">
              <div className="status-avatar-pair">
                <div className="flag-circle" title="Africa Continental Hub">🌍</div>
                <div className="flag-circle" title="Tokyo Machinery Desks">🇯🇵</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>
                  Nairobi ➔ Tokyo Automotive Route
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                  Active DGX Route • Guaranteed 1 USD = {fxRate} JPY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INFINITE SCROLLING WORD CAROUSEL (Real-Time Trade Desks & Corridor Feeds) */}
      <section className="quotes-carousel-section">
        <div className="marquee-track">
          <div className="marquee-card">
            <span className="corridor-pill">Mombasa ➔ Yokohama</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Industrial Heavy Machinery</span>
            <span className="rate-badge-up"><ArrowUpRight size={14} /> Instant DGX ➔ JPY</span>
          </div>

          <div className="marquee-card">
            <span className="corridor-pill">Lagos ➔ Osaka</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Electronics & Robotics Imports</span>
            <span className="rate-badge-up"><ArrowUpRight size={14} /> 4.4% Margin Preserved</span>
          </div>

          <div className="marquee-card">
            <span className="corridor-pill">Johannesburg ➔ Nagoya</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Automotive Fleet Consignments</span>
            <span className="rate-badge-up"><ArrowUpRight size={14} /> Zero Multi-Hop Fees</span>
          </div>

          <div className="marquee-card">
            <span className="corridor-pill">Nairobi ➔ Tokyo</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Renewable Energy & Solar Inverters</span>
            <span className="rate-badge-up"><ArrowUpRight size={14} /> 1.8s Finality</span>
          </div>

          {/* Repeat cards for smooth continuous flow */}
          <div className="marquee-card">
            <span className="corridor-pill">Mombasa ➔ Yokohama</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Industrial Heavy Machinery</span>
            <span className="rate-badge-up"><ArrowUpRight size={14} /> Instant DGX ➔ JPY</span>
          </div>

          <div className="marquee-card">
            <span className="corridor-pill">Lagos ➔ Osaka</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Electronics & Robotics Imports</span>
            <span className="rate-badge-up"><ArrowUpRight size={14} /> 4.4% Margin Preserved</span>
          </div>
        </div>
      </section>

      {/* 4B. WE UNDERSTAND YOUR FRUSTRATION — THE PROBLEMS & OUR FIXES */}
      <section id="problems" className="problems-section scroll-reveal">
        <div className="section-header-center">
          <div className="section-eyebrow" style={{ color: '#E11D48' }}>
            <AlertTriangle size={16} />
            <span>We Know Cross-Border Trade Is Broken</span>
          </div>
          <h2 className="section-title">
            The Problems You Face Every Day — And How We Solve Them
          </h2>
          <p className="section-subtitle">
            If you run an import-export business or SME, you shouldn't have to sacrifice hard-earned profits to bank fees or lose deals waiting days for wire transfers.
          </p>
        </div>

        <div className="problems-grid">
          {/* Problem 1: FX Bleed */}
          <div className="glass-card problem-card">
            <div>
              <div className="problem-header">
                <div className="problem-icon-circle red">
                  <DollarSign size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Heavy Currency (FX) Losses</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>The Middleman Cut</span>
                </div>
              </div>

              <div className="pain-point-box">
                <div className="pain-point-label">The Problem You Face:</div>
                <div className="pain-point-desc">
                  When you convert your local money to USD and then into JPY to pay overseas suppliers, banks and brokers take <strong>3% to 5%</strong> at every step. That is pure profit stolen before your goods even ship.
                </div>
              </div>
            </div>

            <div className="solution-box">
              <div className="solution-label">
                <CheckCircle2 size={14} />
                <span>How DRAGO X Fixes It:</span>
              </div>
              <div className="solution-desc">
                We remove the greedy middlemen. You mint and send <strong>DGX</strong> directly to your supplier at guaranteed rates, keeping that <strong>3% to 5% margin in your business</strong>.
              </div>
            </div>
          </div>

          {/* Problem 2: Slow Settlement */}
          <div className="glass-card problem-card card-time">
            <div>
              <div className="problem-header">
                <div className="problem-icon-circle amber">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Painfully Slow 5–7 Day Transfers</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Frozen Working Capital</span>
                </div>
              </div>

              <div className="pain-point-box">
                <div className="pain-point-label" style={{ color: '#B45309' }}>The Problem You Face:</div>
                <div className="pain-point-desc" style={{ color: '#78350F' }}>
                  Traditional SWIFT wire transfers hop through multiple correspondent banks across time zones. Your funds get trapped for nearly a week, shipments get delayed at ports, and suppliers grow impatient.
                </div>
              </div>
            </div>

            <div className="solution-box">
              <div className="solution-label">
                <CheckCircle2 size={14} />
                <span>How DRAGO X Fixes It:</span>
              </div>
              <div className="solution-desc">
                Settlements become instant. With atomic digital rails, payments reach your Japanese supplier in <strong>under 2 seconds</strong>. No frozen capital, no waiting.
              </div>
            </div>
          </div>

          {/* Problem 3: Volatility & Shortages */}
          <div className="glass-card problem-card card-volatility">
            <div>
              <div className="problem-header">
                <div className="problem-icon-circle indigo">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Currency Swings & Dollar Scarcity</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Unpredictable Costs</span>
                </div>
              </div>

              <div className="pain-point-box">
                <div className="pain-point-label" style={{ color: '#4338CA' }}>The Problem You Face:</div>
                <div className="pain-point-desc" style={{ color: '#312E81' }}>
                  Emerging market currencies fluctuate wildly. Often, commercial banks simply run out of physical USD, making it impossible to pay overseas bills on time.
                </div>
              </div>
            </div>

            <div className="solution-box">
              <div className="solution-label">
                <CheckCircle2 size={14} />
                <span>How DRAGO X Fixes It:</span>
              </div>
              <div className="solution-desc">
                Access dependable 1:1 digital dollars (DGX) and digital yen (DGZ) on-demand 24/7. Your pricing stays steady and protected from local currency devaluation.
              </div>
            </div>
          </div>
        </div>

        {/* 2-Part Strategy Explanation Banner */}
        <div className="strategy-banner-card">
          <div className="strategy-part">
            <div className="badge-pill badge-emerald" style={{ width: 'fit-content' }}>
              <Zap size={14} />
              <span>Step 1: The Urgent Market Solution (Live Today)</span>
            </div>
            <h4 style={{ fontSize: '1.3rem', color: 'var(--text-dark)' }}>
              Solving the Africa–Japan Trade Corridor First
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Instead of building a vague platform for everyone, we are solving one urgent, real-world problem: helping African businesses buying cars, machinery, and equipment from Japan settle their invoices instantly using <strong>DGX</strong>. Tested with 40 passing tests and trusted by a growing waitlist of 150+ enterprises.
            </p>
          </div>

          <div className="strategy-part" style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: 24 }}>
            <div className="badge-pill badge-indigo" style={{ width: 'fit-content' }}>
              <Layers size={14} />
              <span>Step 2: The Global Expansion (Future Roadmap)</span>
            </div>
            <h4 style={{ fontSize: '1.3rem', color: 'var(--text-dark)' }}>
              Expanding into 10-Tokens & Commodity Hedging
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              As our trade network expands, companies will be able to hedge fuel and raw material price spikes through on-chain Gold (Drago Eagle) and Crude Oil (Drago Fly) synthetics, powered by real-time automated AI risk modeling.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE DEMO PLAYGROUND */}
      <section id="playground" className="demo-section scroll-reveal">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Zap size={16} />
            <span>Interactive Live Demo</span>
          </div>
          <h2 className="section-title">
            See How Easy It Is to Pay a Supplier
          </h2>
          <p className="section-subtitle">
            Try sending a simulated payment below. See how fast your supplier receives Japanese Yen and how much money you save compared to a regular bank wire.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="interactive-tabs-row">
          <button 
            className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            <Globe2 size={16} />
            <span>1. Send Payment to Supplier</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'mint' ? 'active' : ''}`}
            onClick={() => setActiveTab('mint')}
          >
            <ArrowRightLeft size={16} />
            <span>2. Load Digital Dollars (DGX)</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'oracle' ? 'active' : ''}`}
            onClick={() => setActiveTab('oracle')}
          >
            <Cpu size={16} />
            <span>3. Live Automated Exchange Rate</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'synthetics' ? 'active' : ''}`}
            onClick={() => setActiveTab('synthetics')}
          >
            <Layers size={16} />
            <span>4. Commodity Price Protection</span>
          </button>
        </div>

        {/* Playground Interactive Grid */}
        <div className="playground-grid">
          {/* LEFT PANEL: Interactive Form based on Tab */}
          <div className="glass-card interactive-panel">
            {activeTab === 'mint' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="badge-pill badge-emerald">
                      <CircleDollarSign size={14} />
                      <span>Zero Extra Fees</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fully Backed 1:1 with USD</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--color-indigo)' }}>
                    Status: Ready
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>Load Your DGX Trade Balance</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                  Convert your funds into DGX at a transparent 1:1 dollar rate. Use DGX whenever you need to pay suppliers without losing money on foreign exchange markups.
                </p>

                <form onSubmit={handleMintSubmit}>
                  <div className="form-group">
                    <div className="form-label-row">
                      <label className="form-label">Collateral Deposit (USDC)</label>
                      <span className="form-sublabel">Balance: ${usdcBalance.toLocaleString()} USDC</span>
                    </div>
                    <div className="input-box-wrapper">
                      <input 
                        type="number" 
                        className="styled-input" 
                        value={mintInput} 
                        onChange={(e) => setMintInput(e.target.value)}
                        placeholder="Enter amount..."
                      />
                      <div className="input-token-tag">
                        <span>USDC</span>
                      </div>
                    </div>
                    <div className="quick-pills-row">
                      <button type="button" className="quick-pill" onClick={() => setMintInput('1000')}>$1,000</button>
                      <button type="button" className="quick-pill" onClick={() => setMintInput('5000')}>$5,000</button>
                      <button type="button" className="quick-pill" onClick={() => setMintInput('15000')}>$15,000</button>
                      <button type="button" className="quick-pill" onClick={() => setMintInput(usdcBalance.toString())}>MAX</button>
                    </div>
                  </div>

                  <div className="breakdown-card">
                    <div className="breakdown-row">
                      <span className="breakdown-label">DGX You Receive</span>
                      <span className="breakdown-value text-gradient-emerald" style={{ fontSize: '1.1rem' }}>
                        +{parseFloat(mintInput || 0).toLocaleString()} DGX ($1.00 Peg)
                      </span>
                    </div>
                    <div className="breakdown-row">
                      <span className="breakdown-label">Collateral Health Factor</span>
                      <span className="breakdown-value" style={{ color: 'var(--color-emerald)' }}>2.45 (Ultra Safe)</span>
                    </div>
                    <div className="breakdown-row">
                      <span className="breakdown-label">Liquidation Buffer</span>
                      <span className="breakdown-value">120% Threshold</span>
                    </div>
                    <div className="breakdown-row">
                      <span className="breakdown-label">Gas Estimate</span>
                      <span className="breakdown-value" style={{ color: 'var(--color-indigo)' }}>~0.0008 ETH (Testnet)</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful" 
                    style={{ width: '100%', marginTop: 24 }}
                    disabled={isMinting}
                  >
                    {isMinting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Simulating EVM Contract Mint...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        <span>Mint {parseFloat(mintInput || 0).toLocaleString()} DGX Tokens</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div className="badge-pill badge-cyan">
                    <Globe2 size={14} />
                    <span>Direct Payment</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                    Settles in Under 2 Seconds
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>Pay Your Overseas Supplier</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                  Send your payment from Nairobi, Lagos, or Johannesburg. Your supplier in Japan receives exact Japanese Yen instantly with zero deductions from intermediate banks.
                </p>

                <form onSubmit={handleTransferSubmit}>
                  <div className="form-group">
                    <div className="form-label-row">
                      <label className="form-label">Invoice Amount to Pay (DGX / USD)</label>
                      <span className="form-sublabel">Your Balance: ${dgxBalance.toLocaleString()} DGX</span>
                    </div>
                    <div className="input-box-wrapper">
                      <input 
                        type="number" 
                        className="styled-input" 
                        value={transferAmount} 
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="Amount to send..."
                      />
                      <div className="input-token-tag">
                        <span>DGX (USD)</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Recipient Supplier Desk</label>
                    <select 
                      className="styled-input" 
                      style={{ paddingRight: 18 }}
                      value={recipientCorridor}
                      onChange={(e) => setRecipientCorridor(e.target.value)}
                    >
                      <option value="Tokyo Heavy Machinery Ltd">Tokyo Heavy Machinery Ltd (Yokohama Port)</option>
                      <option value="Osaka Industrial Robotics Co">Osaka Industrial Robotics Co (Kansai Hub)</option>
                      <option value="Nagoya Automotive Fleet Parts">Nagoya Automotive Fleet Parts (Chubu)</option>
                      <option value="Kyoto Precision Optics Corp">Kyoto Precision Optics Corp</option>
                    </select>
                  </div>

                  <div className="savings-callout">
                    <div className="savings-icon-box">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#065F46' }}>
                        Supplier Receives: ¥{(Math.round(parseFloat(transferAmount || 0) * fxRate)).toLocaleString()} JPY
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                        Saved <strong>~${(parseFloat(transferAmount || 0) * 0.042).toFixed(2)} USD</strong> in SWIFT intermediary bank cuts
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful" 
                    style={{ width: '100%', marginTop: 24 }}
                    disabled={isTransferring || parseFloat(transferAmount) > dgxBalance}
                  >
                    {isTransferring ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Executing Omnichain Atomic Route...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Execute Instant Settlement</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'oracle' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div className="badge-pill badge-indigo">
                    <Cpu size={14} />
                    <span>Alberta GPU Engine</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--color-emerald)' }}>
                    Model: RiskNet-v3
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>AI Dynamic Risk & Rate Engine</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                  Unlike static DeFi money markets, DRAGO X continuously balances liquidity utilization, FX volatility, and collateral risk using an off-chain Python AI engine.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div className="breakdown-card" style={{ marginTop: 0 }}>
                    <span className="breakdown-label">Algorithmic Risk Score</span>
                    <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>{aiRiskScore}/100</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)' }}>Institutional Tier A+</span>
                  </div>

                  <div className="breakdown-card" style={{ marginTop: 0 }}>
                    <span className="breakdown-label">Dynamic Borrow APR</span>
                    <span className="text-gradient-emerald" style={{ fontSize: '2rem', fontWeight: 800 }}>{dynamicBorrowRate}%</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero Base Rate Base</span>
                  </div>
                </div>

                <div className="breakdown-card">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Feed Latency</span>
                    <span className="breakdown-value">420ms (Chainlink + Custom Aggregator)</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Corridor Volume (24h)</span>
                    <span className="breakdown-value">$4,280,500 DGX</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Alberta Compute Cluster Node</span>
                    <span className="breakdown-value" style={{ color: 'var(--color-indigo)' }}>Active (A100 GPU Pool)</span>
                  </div>
                </div>

                <button 
                  className="btn-minimal" 
                  style={{ width: '100%', marginTop: 20 }}
                  onClick={() => {
                    setDynamicBorrowRate(+(0.35 + Math.random() * 0.25).toFixed(2));
                    setAiRiskScore(Math.floor(92 + Math.random() * 6));
                  }}
                >
                  <RefreshCw size={16} />
                  <span>Simulate Real-Time Risk Rebalance</span>
                </button>
              </div>
            )}

            {activeTab === 'synthetics' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div className="badge-pill badge-amber">
                    <Flame size={14} />
                    <span>Real-World Assets</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chainlink Spot Oracles</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>Trade Real-World Commodities</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                  Mint and hedge physical commodity exposures like Gold and Crude Oil entirely on-chain without brokerage or futures accounts.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="step-card">
                    <div className="step-number-bubble" style={{ background: '#FEF3C7', color: '#D97706' }}>AU</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="step-title">Drago Eagle (DGE)</span>
                        <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>$2,745.20 / oz</span>
                      </div>
                      <p className="step-desc">Synthetic spot gold token tracking XAU/USD. 15–30% yield vault APY.</p>
                    </div>
                  </div>

                  <div className="step-card">
                    <div className="step-number-bubble" style={{ background: '#EEF2FF', color: '#4F46E5' }}>OIL</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="step-title">Drago Fly (DGFLY)</span>
                        <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>$74.80 / bbl</span>
                      </div>
                      <p className="step-desc">Crude Oil (WTI/Brent) synthetic exposure with automated hedging.</p>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-colorful" 
                  style={{ width: '100%', marginTop: 24 }}
                  onClick={() => alert('Synthetic vault minting enabled on testnet! Collateral locked.')}
                >
                  <Layers size={18} />
                  <span>Access Commodity Liquidity Vaults</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Live Telemetry & Visual State Showcase */}
          <div className="glass-card interactive-preview-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Corridor Portfolio
              </span>
              <span className="live-pulse" />
            </div>

            {/* Balances Display Card */}
            <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid var(--border-light)', marginBottom: 24, boxShadow: 'var(--shadow-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available Trade Balance</span>
                  <div className="text-gradient" style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2 }}>
                    ${dgxBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                    1 DGX = $1.00 USD (Audited Peg)
                  </span>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <ShieldCheck size={26} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Collateral Reserve</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>${usdcBalance.toLocaleString()} USDC</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPY Liquidity</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>¥{dgzBalance.toLocaleString()} DGZ</div>
                </div>
              </div>
            </div>

            {/* Visual Token Asset Artwork Banner */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-light)', marginBottom: 24 }}>
              <img 
                src="/drago_synthetic.jpg" 
                alt="DRAGO X Crystal Asset Core" 
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.75) 100%)', display: 'flex', alignItems: 'flex-end', padding: 18 }}>
                <div>
                  <span style={{ fontSize: '0.72rem', background: '#10B981', color: '#FFF', fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    DUAL TOKEN SUITE
                  </span>
                  <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.96rem', marginTop: 4 }}>
                    5 Fiat Stablecoins + 5 Commodity Synthetics
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transaction Log / Live Settlement Preview */}
            {transferReceipt ? (
              <div style={{ background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: 18, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065F46', fontWeight: 700, fontSize: '0.92rem', marginBottom: 8 }}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <span>Instant Cross-Border Settlement Complete</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#047857', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>Sent: <strong>${transferReceipt.sentDgx} DGX</strong></div>
                  <div>Settled: <strong>¥{transferReceipt.receivedJpy.toLocaleString()} JPY</strong></div>
                  <div>Target: <strong>{transferReceipt.corridor}</strong></div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', opacity: 0.8 }}>Tx: {transferReceipt.txHash.slice(0, 22)}...</div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 18, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 6 }}>
                  <Activity size={16} color="var(--color-indigo)" />
                  <span>Corridor Route Ready</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Enter an amount in the transfer panel to simulate atomic multi-currency settlement directly to Japanese accounts.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. TOKEN ECOSYSTEM SHOWCASE (The 10-Token Universe) */}
      <section id="tokens" className="tokens-section scroll-reveal">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Layers size={16} />
            <span>Comprehensive Monetary Architecture</span>
          </div>
          <h2 className="section-title">
            The 10-Token Liquidity Suite
          </h2>
          <p className="section-subtitle">
            5 Stablecoins for multi-currency trade corridors and 5 Synthetic Assets for real-world commodity price hedging.
          </p>
        </div>

        <div className="token-cards-grid">
          {/* DGX */}
          <div className="glass-card token-card stable-dgx">
            <div>
              <div className="token-card-header">
                <div>
                  <div className="token-ticker-badge">DGX</div>
                  <span className="token-name-sub">Drago X • USD Stablecoin</span>
                </div>
                <div className="badge-pill badge-emerald">1:1 USD Peg</div>
              </div>
              <p className="token-card-body">
                The primary digital trade settlement currency for African SMEs. Backed by USDC & ETH reserves with issues of yield-accruing dDGX receipt tokens.
              </p>
            </div>
            <div className="token-card-footer">
              <span>Supply: Elastic</span>
              <strong style={{ color: 'var(--color-emerald)' }}>0% Base Borrow</strong>
            </div>
          </div>

          {/* DGZ */}
          <div className="glass-card token-card stable-dgz">
            <div>
              <div className="token-card-header">
                <div>
                  <div className="token-ticker-badge">DGZ</div>
                  <span className="token-name-sub">Drago Z • JPY Stablecoin</span>
                </div>
                <div className="badge-pill badge-cyan">1:1 JPY Peg</div>
              </div>
              <p className="token-card-body">
                DeFi-native Japanese Yen stablecoin designed specifically for Asian trade routes and automotive import financing in Kenya, Nigeria, and South Africa.
              </p>
            </div>
            <div className="token-card-footer">
              <span>Supply: Fiat + Crypto</span>
              <strong style={{ color: 'var(--color-cyan)' }}>Asian Corridor</strong>
            </div>
          </div>

          {/* DGF */}
          <div className="glass-card token-card stable-dgf">
            <div>
              <div className="token-card-header">
                <div>
                  <div className="token-ticker-badge">DGF</div>
                  <span className="token-name-sub">Drago Fire • Yield USD</span>
                </div>
                <div className="badge-pill badge-amber">5–8% APY</div>
              </div>
              <p className="token-card-body">
                Yield-bearing USD stablecoin. Automatically accrues protocol revenue shares from trade finance routing fees while burning excess yield to hold $1.00.
              </p>
            </div>
            <div className="token-card-footer">
              <span>Auto-Compounding</span>
              <strong style={{ color: 'var(--color-amber)' }}>Passive APY</strong>
            </div>
          </div>

          {/* Drago Eagle */}
          <div className="glass-card token-card synth-gold">
            <div>
              <div className="token-card-header">
                <div>
                  <div className="token-ticker-badge">DGE</div>
                  <span className="token-name-sub">Drago Eagle • Spot Gold</span>
                </div>
                <div className="badge-pill badge-amber">XAU/USD</div>
              </div>
              <p className="token-card-body">
                Synthetic gold asset tracking global spot prices via Chainlink feeds. Enables African enterprise treasuries to hold inflation hedges on-chain.
              </p>
            </div>
            <div className="token-card-footer">
              <span>200% Collateral</span>
              <strong style={{ color: '#D97706' }}>15–30% Yield</strong>
            </div>
          </div>

          {/* Drago Fly */}
          <div className="glass-card token-card synth-oil">
            <div>
              <div className="token-card-header">
                <div>
                  <div className="token-ticker-badge">DGFLY</div>
                  <span className="token-name-sub">Drago Fly • Crude Oil</span>
                </div>
                <div className="badge-pill badge-indigo">WTI / Brent</div>
              </div>
              <p className="token-card-body">
                Synthetic commodity token offering crude oil price exposure for freight operators, shipping lines, and logistics companies without futures accounts.
              </p>
            </div>
            <div className="token-card-footer">
              <span>Commodity Hedge</span>
              <strong style={{ color: 'var(--color-indigo)' }}>20–40% APY</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ARCHITECTURE & 7-STEP OPERATIONAL FLOW */}
      <section id="architecture" className="architecture-section scroll-reveal">
        <div className="arch-grid">
          <div className="arch-visual-box">
            <img 
              src="/drago_ai_core.jpg" 
              alt="DRAGO X AI Risk Core" 
              className="arch-image"
            />
            <div style={{ padding: 24, background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Cpu size={20} color="var(--color-emerald)" />
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>AI Oracle & Omnichain Architecture</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Combining EVM Solidity smart contracts with an off-chain Python backend designed for Alberta Compute Voucher GPU clusters for microsecond risk evaluation.
              </p>
            </div>
          </div>

          <div>
            <div className="badge-pill badge-indigo" style={{ marginBottom: 12 }}>
              <Layers size={14} />
              <span>Full Lifecycle Workflow</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: 24 }}>
              How DRAGO X Executes in 7 Continuous Steps
            </h2>

            <div className="steps-list">
              <div className="step-card">
                <div className="step-number-bubble">1</div>
                <div>
                  <div className="step-title">Connect & Verify</div>
                  <div className="step-desc">Client accesses Web3 interface on Sepolia testnet or mainnet nodes.</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">2</div>
                <div>
                  <div className="step-title">Select Asset & Corridor</div>
                  <div className="step-desc">Choose DGX stablecoin or synthetic assets (Eagle Gold / Fly Crude Oil).</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">3</div>
                <div>
                  <div className="step-title">AI Dynamic Rate Evaluation</div>
                  <div className="step-desc">Off-chain AI models calculate corridor health, risk index, and borrow parameters.</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">4</div>
                <div>
                  <div className="step-title">Atomic Smart Contract Mint & Lock</div>
                  <div className="step-desc">Solidity contracts lock overcollateralized reserves and release minted tokens.</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">5</div>
                <div>
                  <div className="step-title">Omnichain Settlement</div>
                  <div className="step-desc">Bypasses SWIFT correspondent banks to credit Japanese suppliers instantly.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-top">
            <div style={{ maxWidth: 420 }}>
              <div className="nav-brand" style={{ marginBottom: 14 }}>
                <div className="brand-icon-box">
                  <ShieldCheck size={26} strokeWidth={2.4} />
                </div>
                <span className="brand-title">DRAGO X</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                AI-powered omnichain trade finance protocol bridging real-world commerce with deep Web3 liquidity. Targeted at African SMEs and global import-export enterprises.
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Protocol Suite</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <a href="#playground" style={{ color: 'var(--text-muted)' }}>DGX (USD Stablecoin)</a>
                <a href="#playground" style={{ color: 'var(--text-muted)' }}>DGZ (JPY Stablecoin)</a>
                <a href="#tokens" style={{ color: 'var(--text-muted)' }}>Drago Eagle (Gold)</a>
                <a href="#tokens" style={{ color: 'var(--text-muted)' }}>Drago Fly (Oil)</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Documentation</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)' }}>FSC Mauritius Sandbox</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>40 Passing Solidity Tests</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Alberta Compute Voucher</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Pre-Seed Investment Deck</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Contact & Verification</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                <span>CEO: John Ebster-Davids (ex-Barclays)</span>
                <span>Email: dragoxprotocol@proton.me</span>
                <div style={{ marginTop: 8 }}>
                  <button className="btn-minimal" onClick={copyAddress} style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                    {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    <span>{copied ? 'Testnet Address Copied' : 'Copy Testnet Contract'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © 2026 DRAGO X Protocol. All rights reserved. Registered under FSC Mauritius Sandbox guidelines.
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <span>Sepolia Testnet v1.4</span>
              <span>•</span>
              <span>40 Passing Tests</span>
              <span>•</span>
              <span>97% Code Coverage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
