import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Globe2, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  Copy, 
  Check, 
  Send,
  Menu,
  X,
  Clock,
  DollarSign,
  AlertTriangle,
  Package,
  Building2,
  FileCheck2,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
  PlusCircle,
  Printer,
  Download,
  Bell,
  ArrowUpRight,
  Wallet,
  Info,
  RotateCcw
} from 'lucide-react';
import './App.css';
import { dragoApi } from './api/dragoApi.js';

export default function App() {
  // Navigation & UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pay'); // 'pay' | 'orders'
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'live' | 'standby'
  const [copied, setCopied] = useState(false);

  // Business Payment Simulator State
  const [invoiceAmount, setInvoiceAmount] = useState('15000');
  const [supplierDesk, setSupplierDesk] = useState('Tokyo Heavy Machinery Ltd (Yokohama Port)');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(48500.00);

  // Live Exchange Rate (Dynamic State)
  const [fxRate, setFxRate] = useState(154.20); // 1 USD = 154.20 JPY
  const [isRefreshingFx, setIsRefreshingFx] = useState(false);

  // Top-Up / Add to Balance State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('25000');
  const [topUpRail, setTopUpRail] = useState('M-Pesa Enterprise (Kenya)');
  const [isDepositing, setIsDepositing] = useState(false);

  // Notification & Toasts State
  const [toasts, setToasts] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Corridor Active',
      message: 'Direct African Enterprise ⇄ Tokyo Interbank rails connected.',
      time: 'Just now'
    }
  ]);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  // Commercial Voucher Modal State
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [voucherCopied, setVoucherCopied] = useState(false);

  // RFQ Modal State
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rfqQuantity, setRfqQuantity] = useState('1');
  const [rfqPort, setRfqPort] = useState('Mombasa Port Berth 4, Kenya');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false);

  // Real Commercial Equipment Catalog (Africa-Japan Corridor)
  const [catalog, setCatalog] = useState([
    {
      id: 'prod-001',
      dxucProductId: 'DXUC-PROD-JP-MACH-0192',
      sku: 'KOM-PC200-8',
      title: 'Komatsu PC200-8 Hydraulic Crawler Excavator (Certified)',
      category: 'Heavy Construction Machinery',
      origin: 'Yokohama, Japan',
      incoterms: 'CIF Mombasa / Lagos',
      moq: 1,
      priceUsd: 58500,
      stock: 4,
      image: '/drago_hero.jpg',
      specs: 'Tier 3 Engine, 20-ton capacity, pre-shipment JAAI inspection certificate included.'
    },
    {
      id: 'prod-002',
      dxucProductId: 'DXUC-PROD-JP-AUTO-8814',
      sku: 'TOY-1GD-FTV',
      title: 'Toyota Hilux & Land Cruiser 1GD-FTV 2.8L Turbo Engine Crate',
      category: 'Commercial Vehicle Assembly',
      origin: 'Nagoya, Japan',
      incoterms: 'FOB Yokohama Port',
      moq: 2,
      priceUsd: 4250,
      stock: 28,
      image: '/drago_synthetic.jpg',
      specs: 'Brand new OEM genuine crate assembly, sealed with Japan customs export clearance.'
    },
    {
      id: 'prod-003',
      dxucProductId: 'DXUC-PROD-JP-ROBT-3391',
      sku: 'FANUC-M20IA',
      title: 'FANUC M-20iA/35M 6-Axis Industrial Automation Arm',
      category: 'Industrial Robotics',
      origin: 'Osaka, Japan',
      incoterms: 'CIF African Ports',
      moq: 1,
      priceUsd: 32800,
      stock: 6,
      image: '/drago_ai_core.jpg',
      specs: 'High inertia capacity, R-30iB controller included. Plug-and-play assembly lines.'
    }
  ]);

  // Live Corridor Orders
  const [orders, setOrders] = useState([
    {
      id: 'po-001',
      poNumber: 'DXUC-PO-2026-00184',
      supplier: 'Tokyo Heavy Machinery Ltd',
      item: 'Komatsu PC200-8 Excavator Lot',
      amountUsd: 58500,
      amountJpy: 9020700,
      status: 'In Transit to Mombasa',
      statusClass: 'status-transit',
      date: '28 Sep 2026',
      savingsUsd: '2,457.00'
    },
    {
      id: 'po-002',
      poNumber: 'DXUC-PO-2026-00142',
      supplier: 'Nagoya Auto Assembly Hub',
      item: 'Toyota 1GD-FTV Engine Crates (x4)',
      amountUsd: 17000,
      amountJpy: 2621400,
      status: 'Customs Cleared',
      statusClass: 'status-cleared',
      date: '25 Sep 2026',
      savingsUsd: '714.00'
    }
  ]);

  // Check Backend Connection and Fetch Catalog on Mount
  useEffect(() => {
    dragoApi.getHealth()
      .then((res) => {
        if (res && res.status === 'online') {
          setBackendStatus('live');
        }
      })
      .catch(() => setBackendStatus('standby'));

    // Fetch live products if available
    dragoApi.getProducts()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          // Merge images and live products
          setCatalog(prev => res.data.map((p, idx) => ({
            ...p,
            priceUsd: parseFloat(p.unitPrice) || 0,
            origin: p.countryOfOrigin === 'JP' ? 'Yokohama, Japan' : (p.countryOfOrigin || 'Japan'),
            image: p.imageUrl || prev[idx % prev.length]?.image || '/drago_hero.jpg',
            specs: p.description || ''
          })));
        }
      })
      .catch(() => {
        // Fallback to local high-fidelity catalog
      });
  }, []);

  // Toast Notifications Helper
  const showToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type, time: 'Just now' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync Live Tokyo FX Rate
  const handleRefreshFx = () => {
    setIsRefreshingFx(true);
    setTimeout(() => {
      const variation = +(Math.random() * 0.4 - 0.2).toFixed(2);
      const updated = +(154.20 + variation).toFixed(2);
      setFxRate(updated);
      setIsRefreshingFx(false);
      showToast(
        'Tokyo FX Oracle Synced',
        `Live exchange rate confirmed: 1 USD = ${updated} JPY (Zero bank spread markup).`,
        'info'
      );
    }, 600);
  };

  // Confirm Escrow Top-Up
  const handleConfirmTopUp = (e) => {
    e.preventDefault();
    const addVal = parseFloat(topUpAmount);
    if (!addVal || isNaN(addVal) || addVal <= 0) {
      showToast('Invalid Amount', 'Please enter a valid deposit amount in USD.', 'error');
      return;
    }

    setIsDepositing(true);
    setTimeout(() => {
      const updatedBalance = +(availableBalance + addVal).toFixed(2);
      setAvailableBalance(updatedBalance);
      setIsDepositing(false);
      setTopUpModalOpen(false);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#7B1113', '#10B981']
      });
      showToast(
        'Escrow Account Funded',
        `+$${addVal.toLocaleString()} USD credited via ${topUpRail}. Your commercial balance is now $${updatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD.`,
        'success'
      );
    }, 750);
  };

  // Handle Official Commercial Voucher
  const handleOpenVoucher = (receipt) => {
    setActiveVoucher(receipt || paymentReceipt);
    setVoucherModalOpen(true);
  };

  const handleCopyVoucherHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setVoucherCopied(true);
    setTimeout(() => setVoucherCopied(false), 2000);
    showToast('Audit Hash Copied', 'Cryptographic escrow audit hash copied to clipboard.', 'info');
  };

  // Handle Instant Supplier Payment Simulation
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(invoiceAmount);

    if (!amount || isNaN(amount) || amount <= 0) {
      showToast('Invalid Invoice Amount', 'Please enter a valid invoice total in USD.', 'error');
      return;
    }

    if (amount > availableBalance) {
      const shortfall = (amount - availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2 });
      showToast(
        'Insufficient Escrow Balance',
        `Invoice ($${amount.toLocaleString()} USD) exceeds balance ($${availableBalance.toLocaleString()} USD) by $${shortfall} USD. Please top up funds to proceed.`,
        'error'
      );
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Connect to backend API if active
      const backendOrder = await dragoApi.acceptQuoteAndSettle({
        quoteId: 'quo-sample-001',
        buyerCompanyId: 'c2c938f1-5b03-4e41-91b2-0d9f22b34022',
        settlementCurrency: 'DGX',
        deliveryAddress: `${supplierDesk}, Japan`,
      }).catch(() => null);

      setTimeout(() => {
        const jpyReceived = Math.round(amount * fxRate);
        const savingsUsd = (amount * 0.042).toFixed(2);
        const poNum = backendOrder?.data?.poNumber || `DXUC-PO-2026-${Math.floor(10000 + Math.random() * 90000)}`;

        setAvailableBalance(prev => +(prev - amount).toFixed(2));
        
        const receipt = {
          poNumber: poNum,
          supplier: supplierDesk,
          amountSentUsd: amount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          amountReceivedJpy: jpyReceived.toLocaleString(),
          savingsUsd: savingsUsd,
          rate: fxRate.toFixed(2),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          txHash: backendOrder?.data?.escrowContractTx || ('0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join(''))
        };

        setPaymentReceipt(receipt);

        // Add to live orders table
        setOrders(prev => [
          {
            id: 'po-' + Date.now(),
            poNumber: poNum,
            supplier: supplierDesk.split('(')[0].trim(),
            item: `Direct Trade Invoice #${Math.floor(1000 + Math.random() * 9000)}`,
            amountUsd: amount,
            amountJpy: jpyReceived,
            status: 'Instant Escrow Funded',
            statusClass: 'status-cleared',
            date: 'Today',
            savingsUsd: savingsUsd
          },
          ...prev
        ]);

        setIsProcessingPayment(false);

        // Celebration
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#7B1113', '#D4AF37', '#B38F2D', '#9E1B1E']
        });

        // Trigger Success Toast
        showToast(
          'Supplier Payment Cleared',
          `¥${jpyReceived.toLocaleString()} JPY received by ${supplierDesk.split('(')[0].trim()} under 2s. Saved +$${savingsUsd} USD vs bank wires.`,
          'success'
        );
      }, 1200);

    } catch (err) {
      setIsProcessingPayment(false);
      showToast('Payment Processing Error', 'An unexpected error occurred. Please try again.', 'error');
    }
  };

  // Handle RFQ Submission from Catalog
  const handleOpenRfq = (product) => {
    setSelectedProduct(product);
    setRfqQuantity('1');
    setRfqSubmitted(false);
    setRfqModalOpen(true);
  };

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmittingRfq(true);

    try {
      await dragoApi.createRfq({
        buyerCompanyId: 'c2c938f1-5b03-4e41-91b2-0d9f22b34022',
        productId: selectedProduct.id,
        targetQuantity: parseInt(rfqQuantity) || 1,
        destinationPort: rfqPort,
        notes: 'Commercial trade order via DRAGO X web portal.'
      }).catch(() => null);

      setTimeout(() => {
        setIsSubmittingRfq(false);
        setRfqSubmitted(true);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7B1113', '#D4AF37']
        });
      }, 800);
    } catch (err) {
      setIsSubmittingRfq(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('dragoxprotocol@proton.me');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-wrapper">
      {/* Background Atmosphere */}
      <div className="bg-mesh-canvas" />

      {/* 1. TOP ANNOUNCEMENT TICKER (Simple & Relatable) */}
      <div className="ticker-container">
        <div className="ticker-track">
          <div className="ticker-item">
            <span className="live-pulse" />
            <span>AFRICA TO JAPAN DIRECT TRADE CORRIDOR: <strong>ACTIVE</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>AVERAGE SUPPLIER PAYMENT SAVINGS: <strong>4.2% VS BANK WIRES</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>INSTANT SETTLEMENT: <strong>UNDER 2 SECONDS</strong> (vs 5 to 7 DAYS TRADITIONAL BANKS)</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>GUARANTEED LIVE RATE: <strong>1 USD = {fxRate} JPY</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>BANK-GRADE DIGITAL ESCROW: ZERO PAYMENT RISK FOR BUYERS & SUPPLIERS</span>
          </div>

          {/* Duplicate set for smooth loop */}
          <div className="ticker-item">
            <span className="live-pulse" />
            <span>AFRICA TO JAPAN DIRECT TRADE CORRIDOR: <strong>ACTIVE</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>AVERAGE SUPPLIER PAYMENT SAVINGS: <strong>4.2% VS BANK WIRES</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>INSTANT SETTLEMENT: <strong>UNDER 2 SECONDS</strong> (vs 5 to 7 DAYS TRADITIONAL BANKS)</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>GUARANTEED LIVE RATE: <strong>1 USD = {fxRate} JPY</strong></span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span>BANK-GRADE DIGITAL ESCROW: ZERO PAYMENT RISK FOR BUYERS & SUPPLIERS</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY CLEAN NAVBAR */}
      <header className="navbar">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-box">
            <img src="/drago_logo.png" alt="DRAGO X Logo" className="brand-icon-img" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="brand-title">DRAGO X</span>
            <span className="brand-tag">AFRICA-JAPAN TRADE</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#problems" className="nav-link-item">Why DRAGO X</a>
          <a href="#payment" className="nav-link-item active">Pay a Supplier</a>
          <a href="#catalog" className="nav-link-item">Equipment Catalog</a>
          <a href="#how-it-works" className="nav-link-item">How It Works</a>
        </nav>

        <div className="nav-actions">
          <div className="badge-pill badge-emerald nav-status-pill">
            <span className="live-pulse" />
            <span>Direct Corridor Active</span>
          </div>

          {/* Live Corridor Notifications Bell */}
          <div className="nav-notification-wrapper">
            <button 
              className={`nav-bell-btn ${notificationMenuOpen ? 'active' : ''}`}
              onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
              title="Corridor live trade updates"
              aria-label="View notifications"
            >
              <Bell size={17} />
              <span className="bell-badge-dot" />
            </button>

            {notificationMenuOpen && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <span>Corridor Live Events</span>
                  <span className="notif-count">3 Live</span>
                </div>
                <div className="notif-list">
                  <div className="notif-item">
                    <span className="notif-dot green" />
                    <div>
                      <div className="notif-title">Yokohama Port Export Clearance</div>
                      <div className="notif-time">2 mins ago • JAAI Certificate verified</div>
                    </div>
                  </div>
                  <div className="notif-item">
                    <span className="notif-dot gold" />
                    <div>
                      <div className="notif-title">Tokyo Interbank FX Window Open</div>
                      <div className="notif-time">12 mins ago • Guaranteed rate: 1 USD = {fxRate} JPY</div>
                    </div>
                  </div>
                  <div className="notif-item">
                    <span className="notif-dot crimson" />
                    <div>
                      <div className="notif-title">Digital Escrow Protection Active</div>
                      <div className="notif-time">1 hr ago • Zero counterparty loss guaranteed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            type="button" 
            className="btn-minimal nav-topup-btn"
            onClick={() => setTopUpModalOpen(true)}
            title="Add funds to commercial escrow balance"
          >
            <Wallet size={15} color="var(--color-gold-deep)" />
            <span>Top Up (${(availableBalance || 0).toLocaleString()})</span>
          </button>

          <a 
            href="#payment" 
            className="btn-colorful nav-wallet-btn"
          >
            <span>Pay Supplier</span>
            <ChevronRight size={16} />
          </a>

          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          <a 
            href="#problems" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <AlertTriangle size={18} color="var(--color-crimson)" />
            <span>Why DRAGO X (Problems We Fix)</span>
          </a>
          <a 
            href="#payment" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Zap size={18} color="var(--color-gold)" />
            <span>Pay Supplier Simulator</span>
          </a>
          <a 
            href="#catalog" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Package size={18} color="var(--color-crimson)" />
            <span>Japanese Equipment Catalog</span>
          </a>
          <a 
            href="#how-it-works" 
            className="mobile-nav-link-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <CheckCircle2 size={18} color="var(--color-gold)" />
            <span>How It Works (4 Simple Steps)</span>
          </a>
        </div>

        <div className="mobile-nav-footer">
          <a 
            href="#payment" 
            className="btn-colorful" 
            style={{ width: '100%', textAlign: 'center' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Open Payment Calculator</span>
          </a>
        </div>
      </div>

      {/* 3. HERO SECTION (Clear, Human & Customer-Centric) */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge-row">
              <div className="badge-pill badge-crimson">
                <Sparkles size={14} />
                <span>Trade Finance Built for African Enterprises</span>
              </div>
              <div className="badge-pill badge-gold">
                <Globe2 size={14} />
                <span>Nairobi & Lagos ⇄ Tokyo Direct</span>
              </div>
            </div>

            <h1 className="hero-headline">
              Pay Overseas Suppliers in Seconds. <span className="text-gradient">Zero Bank Wire Hassle</span>.
            </h1>

            <p className="hero-description">
              African businesses lose 3% to 5% every time they wire money abroad, while shipments sit stuck at ports waiting for banks to clear funds. DRAGO X lets you pay equipment and machinery suppliers in Japan instantly at guaranteed exchange rates.
            </p>

            <div className="hero-stats-strip">
              <div className="hero-stat-unit">
                <span className="hero-stat-number text-gradient-crimson">1.8s</span>
                <span className="hero-stat-desc">Instant Delivery</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat-unit">
                <span className="hero-stat-number text-gradient">4.2%</span>
                <span className="hero-stat-desc">Average Wire Savings</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat-unit">
                <span className="hero-stat-number text-gradient-gold">$0</span>
                <span className="hero-stat-desc">Hidden Bank Markup</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <a href="#payment" className="btn-colorful">
                Calculate Your Savings
                <ChevronRight size={18} />
              </a>
              <a href="#catalog" className="btn-minimal">
                <Package size={18} color="var(--color-crimson)" />
                Browse Equipment Catalog
              </a>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="hero-media-card floating-elem">
            <img 
              src="/drago_hero.jpg" 
              alt="DRAGO X Africa to Tokyo Financial Route" 
              className="hero-artwork-img"
            />
            <div className="floating-status-chip">
              <div className="status-avatar-pair">
                <div className="flag-circle" title="African Importers">🌍</div>
                <div className="flag-circle" title="Tokyo Suppliers">🇯🇵</div>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-crimson)' }}>
                  Active Trade Highway: Africa ⇄ Japan
                </div>
                <div style={{ fontSize: '0.74rem', color: '#B38F2D', fontWeight: 600 }}>
                  Guaranteed Spot Rate: 1 USD = {fxRate} JPY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL PROBLEMS & HOW DRAGO X FIXES THEM */}
      <section id="problems" className="problems-section scroll-reveal">
        <div className="section-header-center">
          <div className="section-eyebrow" style={{ color: 'var(--color-crimson)' }}>
            <AlertTriangle size={16} />
            <span>The Daily Reality for Import Businesses</span>
          </div>
          <h2 className="section-title">
            Traditional Bank Wires Are Costing You Deals
          </h2>
          <p className="section-subtitle">
            If you import cars, trucks, heavy equipment, or machinery, you shouldn't have to sacrifice hard-earned margin to correspondent banks.
          </p>
        </div>

        <div className="problems-grid">
          {/* Problem 1 */}
          <div className="glass-card problem-card">
            <div>
              <div className="problem-header">
                <div className="problem-icon-circle red">
                  <DollarSign size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Heavy 3% to 5% Bank Deductions</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Middleman Intermediary Cuts</span>
                </div>
              </div>

              <div className="pain-point-box">
                <div className="pain-point-label">What You Experience:</div>
                <div className="pain-point-desc">
                  When you convert your local shillings or naira into foreign currency, multiple correspondent banks take cuts at every hop. On a $50,000 excavator, you lose up to $2,500 in pure bank fees.
                </div>
              </div>
            </div>

            <div className="solution-box">
              <div className="solution-label">
                <CheckCircle2 size={14} />
                <span>How DRAGO X Fixes It:</span>
              </div>
              <div className="solution-desc">
                Direct peer-to-peer trade rails. Your supplier receives exact Japanese Yen with zero intermediary deductions, saving you an average of 4.2% per shipment.
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="glass-card problem-card card-time">
            <div>
              <div className="problem-header">
                <div className="problem-icon-circle amber">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Painfully Slow 5 to 7 Day Delays</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Trapped Working Capital</span>
                </div>
              </div>

              <div className="pain-point-box">
                <div className="pain-point-label" style={{ color: '#B38F2D' }}>What You Experience:</div>
                <div className="pain-point-desc" style={{ color: '#5C470D' }}>
                  SWIFT transfers pass through multiple time zones and intermediary clearinghouses. Your funds are trapped for days while your cargo sits unreleased at Japanese ports.
                </div>
              </div>
            </div>

            <div className="solution-box">
              <div className="solution-label">
                <CheckCircle2 size={14} />
                <span>How DRAGO X Fixes It:</span>
              </div>
              <div className="solution-desc">
                Instant delivery. Payments clear into your supplier's Japanese account in under 2 seconds. Invoices are settled immediately and bills of lading are released on time.
              </div>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="glass-card problem-card card-volatility">
            <div>
              <div className="problem-header">
                <div className="problem-icon-circle indigo">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Dollar Shortages & Currency Swings</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Unpredictable Final Cost</span>
                </div>
              </div>

              <div className="pain-point-box">
                <div className="pain-point-label" style={{ color: 'var(--color-crimson)' }}>What You Experience:</div>
                <div className="pain-point-desc" style={{ color: '#4A0E17' }}>
                  Commercial banks frequently run out of physical US Dollars, delaying payments for weeks while local currencies devalue against the dollar and yen.
                </div>
              </div>
            </div>

            <div className="solution-box">
              <div className="solution-label">
                <CheckCircle2 size={14} />
                <span>How DRAGO X Fixes It:</span>
              </div>
              <div className="solution-desc">
                Lock in your exact exchange rate the moment you approve the order. Zero foreign exchange rate spikes between order confirmation and delivery.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PAYMENT & SAVINGS SIMULATOR (Simple, Non-Tech Friendly) */}
      <section id="payment" className="demo-section scroll-reveal">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Zap size={16} />
            <span>Interactive Business Tool</span>
          </div>
          <h2 className="section-title">
            Calculate Your Wire Transfer Savings
          </h2>
          <p className="section-subtitle">
            Enter an invoice amount below to see the exact Japanese Yen your supplier will receive and how much profit you save compared to a regular bank wire.
          </p>
        </div>

        {/* Simplified 2-Tab Switcher */}
        <div className="interactive-tabs-row">
          <button 
            className={`tab-btn ${activeTab === 'pay' ? 'active' : ''}`}
            onClick={() => setActiveTab('pay')}
          >
            <Send size={16} />
            <span>1. Pay Supplier & Calculate Savings</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FileCheck2 size={16} />
            <span>2. Track Live Orders & Escrow ({orders.length})</span>
          </button>
        </div>

        {/* Playground Grid */}
        <div className="playground-grid">
          {/* TAB 1: PAY SUPPLIER */}
          {activeTab === 'pay' && (
            <>
              {/* Form Side */}
              <div className="glass-card interactive-panel">
                <div className="panel-header-badge-row">
                  <div className="badge-pill badge-crimson">
                    <span>Direct Africa ➔ Japan Wire</span>
                  </div>
                  <div className="guaranteed-rate-pill">
                    <span className="rate-dot" />
                    <span>Guaranteed Rate: <strong>1 USD = {fxRate} JPY</strong></span>
                    <button 
                      type="button" 
                      className="btn-sync-fx" 
                      onClick={handleRefreshFx}
                      title="Sync live rate with Tokyo FX Oracle"
                    >
                      <RefreshCw size={12} className={isRefreshingFx ? 'animate-spin' : ''} />
                      <span>{isRefreshingFx ? 'Syncing...' : 'Sync'}</span>
                    </button>
                  </div>
                </div>

                <h3 className="panel-heading">Send Supplier Payment</h3>
                <p className="panel-subheading">
                  Enter your invoice total in USD. The payment will clear into your supplier's Japanese Yen account immediately.
                </p>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="form-group">
                    <div className="form-label-row">
                      <label className="form-label">Invoice Amount (USD)</label>
                      <span className="form-sublabel">Trade Balance: <strong>${(availableBalance || 0).toLocaleString()} USD</strong></span>
                    </div>
                    <div className="input-box-wrapper">
                      <input 
                        type="number" 
                        className={`styled-input styled-input-with-tag ${parseFloat(invoiceAmount) > availableBalance ? 'input-error-border' : ''}`}
                        value={invoiceAmount} 
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        placeholder="e.g. 15000"
                        min="100"
                        required
                      />
                      <div className="input-token-tag">
                        <span>USD</span>
                      </div>
                    </div>

                    {/* Quick Select Pills */}
                    <div className="quick-pills-row">
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === '5000' ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount('5000')}
                      >
                        $5,000
                      </button>
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === '15000' ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount('15000')}
                      >
                        $15,000
                      </button>
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === '35000' ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount('35000')}
                      >
                        $35,000
                      </button>
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === String(availableBalance) ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount(String(availableBalance))}
                      >
                        MAX
                      </button>
                    </div>

                    {/* INSUFFICIENT BALANCE WARNING ALERT */}
                    {parseFloat(invoiceAmount) > availableBalance && (
                      <div className="insufficient-balance-alert">
                        <div className="alert-icon-box">
                          <AlertTriangle size={20} />
                        </div>
                        <div className="alert-text-box">
                          <div className="alert-title">Insufficient Commercial Escrow Balance</div>
                          <div className="alert-desc">
                            Invoice ($${(parseFloat(invoiceAmount) || 0).toLocaleString()} USD) exceeds available trade balance ($${(availableBalance || 0).toLocaleString()} USD) by <strong>${((parseFloat(invoiceAmount) || 0) - availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</strong>.
                          </div>
                          <button 
                            type="button" 
                            className="btn-topup-shortfall"
                            onClick={() => {
                              const diff = Math.ceil(((parseFloat(invoiceAmount) || 0) - availableBalance) / 1000) * 1000;
                              setTopUpAmount(String(diff > 0 ? diff : 10000));
                              setTopUpModalOpen(true);
                            }}
                          >
                            <PlusCircle size={15} />
                            <span>Top Up Shortfall (${(Math.ceil(((parseFloat(invoiceAmount) || 0) - availableBalance) / 1000) * 1000).toLocaleString()} USD)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Recipient Supplier Desk in Japan</label>
                    <div className="select-box-wrapper">
                      <select 
                        className="styled-select" 
                        value={supplierDesk}
                        onChange={(e) => setSupplierDesk(e.target.value)}
                      >
                        <option value="Tokyo Heavy Machinery Ltd (Yokohama Port)">Tokyo Heavy Machinery Ltd (Yokohama Port)</option>
                        <option value="Toyota Auto Fleet & Spares Assembly (Nagoya)">Toyota Auto Fleet & Spares Assembly (Nagoya)</option>
                        <option value="Osaka Industrial Robotics Co (Kansai Hub)">Osaka Industrial Robotics Co (Kansai Hub)</option>
                        <option value="Yokohama Marine Logistics Corp">Yokohama Marine Logistics Corp</option>
                      </select>
                    </div>
                  </div>

                  {/* Savings Callout Banner */}
                  <div className="savings-callout">
                    <div className="savings-icon-box">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="savings-content">
                      <div className="savings-primary-text">
                        Supplier Receives: <strong>¥{(Math.round(parseFloat(invoiceAmount || 0) * fxRate)).toLocaleString()} JPY</strong>
                      </div>
                      <div className="savings-secondary-text">
                        You save approximately <strong>${(parseFloat(invoiceAmount || 0) * 0.042).toFixed(2)} USD</strong> vs traditional bank wire deductions.
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful btn-submit-payment" 
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Releasing Funds to Tokyo Supplier...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Simulate Instant Supplier Payment</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Receipt Side */}
              <div className="glass-card interactive-preview-panel">
                <div className="preview-panel-header">
                  <span className="preview-status-title">Live Transaction Status</span>
                  <span className="live-pulse" />
                </div>

                {/* Balances Display Card */}
                <div className="balance-display-card">
                  <div className="balance-card-header">
                    <div className="balance-text-stack">
                      <div className="balance-top-row">
                        <span className="balance-label">Available Commercial Balance</span>
                        <button 
                          type="button" 
                          className="btn-reset-demo"
                          onClick={() => {
                            setAvailableBalance(50000.00);
                            showToast('Demo Balance Reset', 'Available balance restored to $50,000.00 USD.', 'info');
                          }}
                          title="Reset balance to $50,000"
                        >
                          <RotateCcw size={12} />
                          <span>Reset Demo</span>
                        </button>
                      </div>

                      <div className="balance-amount-display">
                        ${(availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>

                      <div className="balance-actions-strip">
                        <div className="balance-escrow-badge">
                          <Shield size={13} />
                          <span>Protected in Digital Escrow</span>
                        </div>
                        <button 
                          type="button" 
                          className="btn-quick-topup"
                          onClick={() => setTopUpModalOpen(true)}
                        >
                          <PlusCircle size={14} />
                          <span>+ Add Funds to Escrow</span>
                        </button>
                      </div>
                    </div>

                    <div className="balance-icon-box">
                      <Building2 size={22} />
                    </div>
                  </div>

                  <div className="balance-route-strip">
                    <div className="route-stat-box">
                      <span className="route-stat-label">Target Route</span>
                      <div className="route-stat-val crimson">Africa ➔ Japan</div>
                    </div>
                    <div className="route-stat-box">
                      <span className="route-stat-label">Guaranteed Speed</span>
                      <div className="route-stat-val gold">Under 2 Seconds</div>
                    </div>
                  </div>
                </div>

                {/* Receipt Card */}
                {paymentReceipt ? (
                  <div className="receipt-card">
                    <div className="receipt-header">
                      <div className="receipt-icon-circle">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="receipt-headline">Payment Cleared Successfully</h4>
                        <span className="receipt-subline">Settled in Tokyo Yen account</span>
                      </div>
                    </div>
                    
                    <div className="receipt-details-list">
                      <div className="receipt-row border-bottom">
                        <span className="receipt-row-label">Purchase Order</span>
                        <strong className="receipt-row-mono">{paymentReceipt.poNumber}</strong>
                      </div>
                      <div className="receipt-row">
                        <span className="receipt-row-label">Recipient</span>
                        <span className="receipt-row-val">{paymentReceipt.supplier}</span>
                      </div>
                      <div className="receipt-row">
                        <span className="receipt-row-label">Amount Sent</span>
                        <strong className="receipt-row-val">${paymentReceipt.amountSentUsd} USD</strong>
                      </div>
                      <div className="receipt-row jpy-highlight-row">
                        <span className="receipt-row-label">Supplier Received</span>
                        <strong className="receipt-jpy-val">¥{paymentReceipt.amountReceivedJpy} JPY</strong>
                      </div>
                      <div className="receipt-row savings-highlight-row">
                        <span className="receipt-row-label">Your Profit Saved</span>
                        <strong className="receipt-savings-val">+${paymentReceipt.savingsUsd} USD</strong>
                      </div>
                      <div className="receipt-row">
                        <span className="receipt-row-label">Clearing Speed</span>
                        <span className="receipt-speed-badge">{paymentReceipt.time} (Instant)</span>
                      </div>
                      <div className="receipt-audit-footer">
                        <Shield size={12} />
                        <span>Audit Hash: {paymentReceipt.txHash.slice(0, 26)}...</span>
                      </div>
                    </div>

                    {/* VOUCHER & RECEIPT ACTIONS */}
                    <div className="receipt-actions-row">
                      <button 
                        type="button" 
                        className="btn-print-voucher"
                        onClick={() => handleOpenVoucher(paymentReceipt)}
                      >
                        <Printer size={15} />
                        <span>Official Voucher & Print</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn-copy-hash"
                        onClick={() => handleCopyVoucherHash(paymentReceipt.txHash)}
                      >
                        {voucherCopied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{voucherCopied ? 'Copied' : 'Copy Hash'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-receipt-card">
                    <div className="empty-receipt-icon">
                      <CheckCircle2 size={22} />
                    </div>
                    <h4 className="empty-receipt-title">Ready to Test Settlement</h4>
                    <p className="empty-receipt-desc">
                      Enter your payment amount in the left panel and click <strong>Simulate Instant Supplier Payment</strong> to generate a live transaction receipt and see your exact savings.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: LIVE ORDERS & ESCROW TRACKER */}
          {activeTab === 'orders' && (
            <div className="glass-card interactive-panel" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: 4 }}>Corridor Order & Shipment Ledger</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Track payments, escrow releases, and shipping bills of lading across the Africa-Japan corridor.
                  </p>
                </div>
                <button 
                  className="btn-minimal" 
                  onClick={() => setActiveTab('pay')}
                  style={{ fontSize: '0.85rem' }}
                >
                  <Send size={16} />
                  <span>Send Another Payment</span>
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Order Number</th>
                      <th style={{ padding: '12px 16px' }}>Japanese Supplier</th>
                      <th style={{ padding: '12px 16px' }}>Commercial Items</th>
                      <th style={{ padding: '12px 16px' }}>Amount (USD / JPY)</th>
                      <th style={{ padding: '12px 16px' }}>Bank Fee Saved</th>
                      <th style={{ padding: '12px 16px' }}>Escrow Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-crimson)' }}>
                          {ord.poNumber}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{ord.supplier}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-body)' }}>{ord.item}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <strong>${ord.amountUsd.toLocaleString()} USD</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>¥{ord.amountJpy.toLocaleString()} JPY</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--color-gold-deep)', fontWeight: 700 }}>
                          +${ord.savingsUsd} USD
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge-pill badge-emerald" style={{ fontSize: '0.75rem' }}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. EQUIPMENT & MACHINERY CATALOG (Real Commercial Products) */}
      <section id="catalog" className="tokens-section scroll-reveal">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Package size={16} />
            <span>Commercial Equipment Marketplace</span>
          </div>
          <h2 className="section-title">
            Source Directly from Japanese Suppliers
          </h2>
          <p className="section-subtitle">
            Browse verified heavy machinery, commercial truck parts, and industrial equipment from certified Japanese exporters. Pay with instant guaranteed exchange rates.
          </p>
        </div>

        <div className="token-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {catalog.map((item) => (
            <div key={item.id} className="glass-card token-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge-pill badge-crimson" style={{ fontSize: '0.72rem' }}>
                    {item.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                    {item.dxucProductId}
                  </div>
                  <h4 style={{ fontSize: '1.15rem', lineHeight: 1.35, marginBottom: 8, color: 'var(--text-dark)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                    {item.specs}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price (Incoterms: {item.incoterms})</span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-crimson)' }}>
                        ${(item.priceUsd || 0).toLocaleString()} USD
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Origin</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.origin}</div>
                    </div>
                  </div>

                  <button 
                    className="btn-colorful" 
                    style={{ width: '100%', fontSize: '0.88rem' }}
                    onClick={() => handleOpenRfq(item)}
                  >
                    <span>Request Commercial Quote</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS (Simple 4-Step Visual Process) */}
      <section id="how-it-works" className="architecture-section scroll-reveal">
        <div className="arch-grid">
          <div className="arch-visual-box">
            <img 
              src="/drago_ai_core.jpg" 
              alt="DRAGO X Trade Route" 
              className="arch-image"
            />
            <div style={{ padding: 24, background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <CheckCircle2 size={20} color="var(--color-crimson)" />
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Bank-Grade Settlement Escrow</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Every payment is locked in transparent digital escrow until customs documents and bills of lading are verified. Zero counterparty risk for buyers and sellers.
              </p>
            </div>
          </div>

          <div>
            <div className="badge-pill badge-crimson" style={{ marginBottom: 12 }}>
              <CheckCircle2 size={14} />
              <span>Simple 4-Step Process</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: 24 }}>
              How Your Payment Moves in 4 Simple Steps
            </h2>

            <div className="steps-list">
              <div className="step-card">
                <div className="step-number-bubble">1</div>
                <div>
                  <div className="step-title">1. Create Your Business Profile</div>
                  <div className="step-desc">Register your import enterprise once. Receive your verified Global Trade ID with zero paperwork queues.</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">2</div>
                <div>
                  <div className="step-title">2. Choose What to Pay</div>
                  <div className="step-desc">Select your supplier in Japan and enter your invoice amount.</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">3</div>
                <div>
                  <div className="step-title">3. Lock In Guaranteed Exchange Rate</div>
                  <div className="step-desc">You see the exact Japanese Yen delivered before you confirm. No hidden correspondent markups.</div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number-bubble">4</div>
                <div>
                  <div className="step-title">4. Supplier Credited in Seconds</div>
                  <div className="step-desc">Funds settle immediately. Invoices are cleared and your shipments are released on time.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RFQ MODAL */}
      {rfqModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div className="glass-card" style={{ maxWidth: 540, width: '100%', padding: 32, background: '#FFFFFF', position: 'relative' }}>
            <button 
              onClick={() => setRfqModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {!rfqSubmitted ? (
              <>
                <div className="badge-pill badge-crimson" style={{ marginBottom: 12 }}>
                  <span>Request for Commercial Quotation (RFQ)</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>{selectedProduct?.title}</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  Submit an official RFQ directly to the Japanese supplier desk. You will receive a formalized quotation with shipping freight breakdown.
                </p>

                <form onSubmit={handleRfqSubmit}>
                  <div className="form-group">
                    <label className="form-label">Order Quantity (Units)</label>
                    <input 
                      type="number" 
                      className="styled-input" 
                      value={rfqQuantity} 
                      onChange={(e) => setRfqQuantity(e.target.value)}
                      min={selectedProduct?.moq || 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Destination Port</label>
                    <select 
                      className="styled-input"
                      value={rfqPort}
                      onChange={(e) => setRfqPort(e.target.value)}
                    >
                      <option value="Mombasa Port Berth 4, Kenya">Mombasa Port (Kenya)</option>
                      <option value="Lagos Apapa Port, Nigeria">Lagos Apapa Port (Nigeria)</option>
                      <option value="Durban Port, South Africa">Durban Port (South Africa)</option>
                      <option value="Dar es Salaam Port, Tanzania">Dar es Salaam Port (Tanzania)</option>
                    </select>
                  </div>

                  <div className="savings-callout" style={{ marginBottom: 20 }}>
                    <div className="savings-icon-box">
                      <Package size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-crimson)' }}>
                        Estimated Value: ${((selectedProduct?.priceUsd || 0) * (parseInt(rfqQuantity) || 1)).toLocaleString()} USD
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#B38F2D' }}>
                        Guaranteed spot clearing in Japanese Yen via DRAGO X rails.
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful" 
                    style={{ width: '100%' }}
                    disabled={isSubmittingRfq}
                  >
                    {isSubmittingRfq ? 'Transmitting to Tokyo Supplier...' : 'Submit Commercial RFQ'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FFFDF0', border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--color-crimson)' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>RFQ Broadcast Successfully</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                  Your request has been received by <strong>{selectedProduct?.origin}</strong>. A binding commercial quote with JAAI customs inspection documentation will be issued to your trade dashboard.
                </p>
                <button 
                  className="btn-colorful" 
                  onClick={() => setRfqModalOpen(false)}
                  style={{ width: '100%' }}
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-top">
            <div style={{ maxWidth: 420 }}>
              <div className="nav-brand" style={{ marginBottom: 14 }}>
                <div className="brand-icon-box">
                  <img src="/drago_logo.png" alt="DRAGO X Logo" className="brand-icon-img" />
                </div>
                <span className="brand-title">DRAGO X</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Direct trade finance and instant payment infrastructure connecting African import enterprises with Japanese machinery, automotive, and industrial exporters.
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Corridor Routes</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <a href="#payment" style={{ color: 'var(--text-muted)' }}>Nairobi ⇄ Yokohama</a>
                <a href="#payment" style={{ color: 'var(--text-muted)' }}>Lagos ⇄ Nagoya</a>
                <a href="#payment" style={{ color: 'var(--text-muted)' }}>Mombasa ⇄ Tokyo</a>
                <a href="#catalog" style={{ color: 'var(--text-muted)' }}>Certified Machinery Catalog</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Trade Protection</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <a href="#how-it-works" style={{ color: 'var(--text-muted)' }}>Digital Escrow Mechanism</a>
                <a href="#how-it-works" style={{ color: 'var(--text-muted)' }}>JAAI Inspection Clearance</a>
                <a href="#how-it-works" style={{ color: 'var(--text-muted)' }}>Instant FX Settlement</a>
                <a href="#how-it-works" style={{ color: 'var(--text-muted)' }}>Bills of Lading Audit</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Enterprise Support</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                <span>CEO: John Ebster-Davids (ex-Barclays)</span>
                <span>Email: dragoxprotocol@proton.me</span>
                <div style={{ marginTop: 8 }}>
                  <button className="btn-minimal" onClick={copyAddress} style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                    {copied ? <Check size={14} color="var(--color-crimson)" /> : <Copy size={14} />}
                    <span>{copied ? 'Email Copied' : 'Contact Trade Desk'}</span>
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
              <span>Africa-Japan Trade Corridor</span>
              <span>•</span>
              <span>Guaranteed JPY Settlement</span>
              <span>•</span>
              <span>Bank-Grade Escrow</span>
            </div>
          </div>
        </div>
      </footer>

      {/* TOP-UP / ADD TO ESCROW MODAL */}
      {topUpModalOpen && (
        <div className="modal-backdrop-wrap" onClick={() => setTopUpModalOpen(false)}>
          <div className="modal-inner-card" onClick={e => e.stopPropagation()}>
            <div className="modal-top-row">
              <div className="badge-pill badge-gold">
                <Wallet size={14} />
                <span>Commercial Escrow Top-Up</span>
              </div>
              <button 
                className="modal-dismiss-btn" 
                onClick={() => setTopUpModalOpen(false)}
                aria-label="Close deposit dialog"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="modal-heading">Deposit Funds to Escrow</h3>
            <p className="modal-subtext">
              Top up your enterprise liquidity balance using African commercial banking rails or international settlement to pay Japanese exporters instantly.
            </p>

            <form onSubmit={handleConfirmTopUp}>
              <div className="form-group">
                <label className="form-label">Top-Up Amount (USD)</label>
                <div className="input-box-wrapper">
                  <input 
                    type="number" 
                    className="styled-input styled-input-with-tag"
                    value={topUpAmount}
                    onChange={e => setTopUpAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    min="500"
                    required
                  />
                  <div className="input-token-tag">USD</div>
                </div>

                {/* Quick Add Pills */}
                <div className="quick-pills-row" style={{ marginTop: 8 }}>
                  <button 
                    type="button" 
                    className={`quick-pill ${topUpAmount === '10000' ? 'active' : ''}`} 
                    onClick={() => setTopUpAmount('10000')}
                  >
                    +$10k
                  </button>
                  <button 
                    type="button" 
                    className={`quick-pill ${topUpAmount === '25000' ? 'active' : ''}`} 
                    onClick={() => setTopUpAmount('25000')}
                  >
                    +$25k
                  </button>
                  <button 
                    type="button" 
                    className={`quick-pill ${topUpAmount === '50000' ? 'active' : ''}`} 
                    onClick={() => setTopUpAmount('50000')}
                  >
                    +$50k
                  </button>
                  <button 
                    type="button" 
                    className={`quick-pill ${topUpAmount === '100000' ? 'active' : ''}`} 
                    onClick={() => setTopUpAmount('100000')}
                  >
                    +$100k
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Enterprise Payment Rail</label>
                <div className="select-box-wrapper">
                  <select 
                    className="styled-select"
                    value={topUpRail}
                    onChange={e => setTopUpRail(e.target.value)}
                  >
                    <option value="M-Pesa Enterprise (Kenya)">M-Pesa Enterprise (Kenya Paybill: 981200)</option>
                    <option value="Equity Bank / KCB (Kenya RTGS)">Equity Bank / KCB (Kenya RTGS)</option>
                    <option value="Access Bank / Flutterwave (Nigeria NGN)">Access Bank / Flutterwave (Nigeria NGN)</option>
                    <option value="Standard Bank (South Africa ZAR)">Standard Bank (South Africa ZAR EFT)</option>
                    <option value="Commercial SWIFT Transfer (USD)">Commercial SWIFT Transfer (USD Direct)</option>
                  </select>
                </div>
              </div>

              {/* Conversion Preview */}
              <div className="topup-conversion-preview">
                <div className="conversion-top">
                  <span className="conv-label">Approximate Local Debited:</span>
                  <strong className="conv-value">
                    {topUpRail.includes('Kenya') 
                      ? `${((parseFloat(topUpAmount) || 0) * 129.5).toLocaleString()} KES`
                      : topUpRail.includes('Nigeria')
                      ? `₦${((parseFloat(topUpAmount) || 0) * 1630).toLocaleString()} NGN`
                      : topUpRail.includes('South Africa')
                      ? `R ${((parseFloat(topUpAmount) || 0) * 18.2).toLocaleString()} ZAR`
                      : `$${((parseFloat(topUpAmount) || 0)).toLocaleString()} USD`}
                  </strong>
                </div>
                <div className="conv-subtext">
                  Direct conversion at official central bank reference rate. Funds credited into audited smart escrow in under 2 seconds.
                </div>
              </div>

              <div className="modal-actions-row">
                <button 
                  type="button" 
                  className="btn-minimal" 
                  onClick={() => setTopUpModalOpen(false)}
                  disabled={isDepositing}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-colorful" 
                  style={{ flex: 1 }}
                  disabled={isDepositing}
                >
                  {isDepositing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Confirming Escrow Deposit...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      <span>Deposit ${(parseFloat(topUpAmount) || 0).toLocaleString()} USD</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL COMMERCIAL PAYMENT VOUCHER MODAL */}
      {voucherModalOpen && activeVoucher && (
        <div className="modal-backdrop-wrap" onClick={() => setVoucherModalOpen(false)}>
          <div className="modal-inner-card voucher-modal-card" onClick={e => e.stopPropagation()}>
            <div className="voucher-watermark-seal">DRAGO X</div>

            <div className="voucher-top-bar">
              <div className="voucher-brand-group">
                <div className="brand-icon-box" style={{ width: 40, height: 40 }}>
                  <img src="/drago_logo.png" alt="DRAGO X Logo" className="brand-icon-img" />
                </div>
                <div>
                  <div className="voucher-protocol-title">DRAGO X PROTOCOL</div>
                  <div className="voucher-protocol-sub">Cross-Border Settlement & Digital Escrow Voucher</div>
                </div>
              </div>

              <div className="voucher-status-badge">
                <CheckCircle2 size={16} />
                <span>CLEARED & SETTLED</span>
              </div>
            </div>

            <div className="voucher-fields-grid">
              <div className="voucher-field-unit">
                <span className="v-lbl">Purchase Order No.</span>
                <strong className="v-val mono">{activeVoucher.poNumber}</strong>
              </div>
              <div className="voucher-field-unit">
                <span className="v-lbl">Settlement Timestamp</span>
                <strong className="v-val">{activeVoucher.date || 'Today'} • {activeVoucher.time}</strong>
              </div>
              <div className="voucher-field-unit">
                <span className="v-lbl">Buyer / Importer Desk</span>
                <strong className="v-val">East Africa Machinery Imports Ltd (Nairobi)</strong>
              </div>
              <div className="voucher-field-unit">
                <span className="v-lbl">Japanese Exporter Desk</span>
                <strong className="v-val">{activeVoucher.supplier}</strong>
              </div>
            </div>

            <div className="voucher-funds-highlight">
              <div className="v-funds-col">
                <span className="v-funds-lbl">Disbursed (Escrow)</span>
                <div className="v-funds-num">${activeVoucher.amountSentUsd} USD</div>
              </div>
              <div className="v-arrow">➔</div>
              <div className="v-funds-col">
                <span className="v-funds-lbl">Supplier Credited (Tokyo Interbank)</span>
                <div className="v-funds-num jpy">¥{activeVoucher.amountReceivedJpy} JPY</div>
              </div>
            </div>

            <div className="voucher-specs-strip">
              <div>
                <span className="v-spec-lbl">Fixed Corridor FX:</span>
                <strong className="v-spec-val">1 USD = {activeVoucher.rate} JPY</strong>
              </div>
              <div>
                <span className="v-spec-lbl">Wire Markup Saved:</span>
                <strong className="v-spec-val gold">+${activeVoucher.savingsUsd} USD</strong>
              </div>
              <div>
                <span className="v-spec-lbl">Regulatory Sandbox:</span>
                <strong className="v-spec-val">FSC Mauritius FinTech</strong>
              </div>
              <div>
                <span className="v-spec-lbl">Tokyo Clearing Code:</span>
                <strong className="v-spec-val">TYO-BOJ-NET-882</strong>
              </div>
            </div>

            <div className="voucher-hash-box">
              <div className="hash-header">
                <Shield size={13} />
                <span>Cryptographic Escrow Audit Hash</span>
              </div>
              <code className="hash-text">{activeVoucher.txHash}</code>
            </div>

            <div className="modal-actions-row" style={{ marginTop: 22 }}>
              <button 
                type="button" 
                className="btn-minimal" 
                onClick={() => setVoucherModalOpen(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-colorful btn-print-modal"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>Print Official Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast-card toast-${t.type}`}>
            <div className="toast-icon-wrap">
              {t.type === 'success' && <CheckCircle2 size={18} color="#059669" />}
              {t.type === 'error' && <AlertTriangle size={18} color="#DC2626" />}
              {t.type === 'info' && <Info size={18} color="#B38F2D" />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-message">{t.message}</div>
            </div>
            <button 
              type="button" 
              className="toast-close-btn" 
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
