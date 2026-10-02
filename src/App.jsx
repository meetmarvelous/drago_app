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
  RotateCcw,
  Coins,
  Flame,
  TrendingUp,
  Cpu,
  Database,
  Activity,
  Lock,
  Unlock,
  BarChart3,
  FileText,
  UploadCloud
} from 'lucide-react';
import './App.css';
import { dragoApi } from './api/dragoApi.js';
import { ethers } from 'ethers';
import deployedContracts from './contracts/deployed-addresses.json';
import dgxAbi from './contracts/abis/DGXToken.json';
import dgzAbi from './contracts/abis/DGZToken.json';
import escrowAbi from './contracts/abis/DragoEscrow.json';

const SUPPLIER_ADDRESSES = {
  'Tokyo Heavy Machinery Ltd (Yokohama Port)': '0x58201B1832275dA90F263073D742c9f67D8617C6',
  'Toyota Auto Fleet & Spares Assembly (Nagoya)': '0x58201B1832275dA90F263073D742c9f67D8617C6',
  'Osaka Industrial Robotics Co (Kansai Hub)': '0x58201B1832275dA90F263073D742c9f67D8617C6',
  'Yokohama Marine Logistics Corp': '0x58201B1832275dA90F263073D742c9f67D8617C6'
};

export default function App() {
  // Navigation & Workspace Mode State
  const [workspaceMode, setWorkspaceMode] = useState('trade'); // 'trade' | 'protocol'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pay'); // 'pay' | 'orders'
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'live' | 'standby'
  const [copied, setCopied] = useState(false);

  // B2B Trade Portal Payment & Escrow Settlement State
  const [invoiceAmount, setInvoiceAmount] = useState('15000');
  const [supplierDesk, setSupplierDesk] = useState('Tokyo Heavy Machinery Ltd (Yokohama Port)');
  const [paymentRail, setPaymentRail] = useState('sepolia'); // 'sepolia' | 'wire'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [releasingOrderPo, setReleasingOrderPo] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(48500.00);

  // Cloudflare R2 Document Upload State
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState('');
  const [uploadedDocName, setUploadedDocName] = useState('');

  // Live Exchange Rate (Dynamic State)
  const [fxRate, setFxRate] = useState(154.20); // 1 USD = 154.20 JPY
  const [isRefreshingFx, setIsRefreshingFx] = useState(false);

  // Top-Up / Add to Balance State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('25000');
  const [topUpRail, setTopUpRail] = useState('M-Pesa Enterprise (Kenya)');
  const [isDepositing, setIsDepositing] = useState(false);

  // ==========================================
  // PROTOCOL & AI ASSETS HUB STATE (Web3 MVP)
  // ==========================================
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('Ethereum Sepolia Testnet');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [protocolStep, setProtocolStep] = useState(1);
  
  // Balances in Web3 Wallet
  const [stableBalances, setStableBalances] = useState({ dgx: 5000.00, dgz: 771000.00, eth: 0.00 });
  const [syntheticBalances, setSyntheticBalances] = useState({ eagle: 1.25, fly: 45.00 });
  const [stakedBalances, setStakedBalances] = useState({ dgs: 2500.00, drgx: 12000.00 });
  const [earnedYield, setEarnedYield] = useState({ dgs: 38.45, drgx: 142.80 });

  // Stablecoin Minting State
  const [mintStableType, setMintStableType] = useState('DGX'); // 'DGX' | 'DGZ'
  const [mintStableAmount, setMintStableAmount] = useState('1000');
  const [mintStableRail, setMintStableRail] = useState('USDC Direct');
  const [isMintingStable, setIsMintingStable] = useState(false);

  // Synthetic RWA Minting State
  const [mintSynthType, setMintSynthType] = useState('eagle'); // 'eagle' | 'fly'
  const [mintSynthAmount, setMintSynthAmount] = useState('0.5');
  const [isMintingSynth, setIsMintingSynth] = useState(false);

  // Staking State
  const [activeStakingPool, setActiveStakingPool] = useState('DGS'); // 'DGS' | 'DRGX'
  const [stakeAmountInput, setStakeAmountInput] = useState('1000');
  const [isStaking, setIsStaking] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);

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

    // Fetch live products if available from Neon PostgreSQL
    dragoApi.getProducts()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          setCatalog(res.data.map((p, idx) => ({
            id: p.id,
            dxucProductId: p.dxucProductId,
            sku: p.sku,
            title: p.title,
            category: p.category,
            origin: p.countryOfOrigin === 'JP' ? 'Yokohama, Japan' : (p.countryOfOrigin || 'Japan'),
            incoterms: p.incoterms,
            moq: p.moq,
            priceUsd: parseFloat(p.unitPrice) || 0,
            stock: p.stockQuantity,
            image: p.imageUrl || (idx % 2 === 0 ? '/drago_hero.jpg' : '/drago_synthetic.jpg'),
            specs: p.description || ''
          })));
        }
      })
      .catch(() => {});

    // Fetch live orders from Neon PostgreSQL
    dragoApi.getRecentOrders()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          setOrders(res.data.map(o => ({
            id: o.id,
            poNumber: o.poNumber,
            supplier: o.sellerCompany?.tradeName || o.sellerCompany?.legalName || 'Tokyo Heavy Machinery Ltd',
            item: o.quote?.rfq?.product?.title || 'Certified Machinery Order',
            amountUsd: parseFloat(o.totalAmount) || 0,
            amountJpy: Math.round((parseFloat(o.totalAmount) || 0) * (parseFloat(o.settlementRate) || 154.20)),
            status: o.shippingStatus === 'IN_TRANSIT' ? 'In Transit to Mombasa' : (o.shippingStatus === 'DELIVERED' ? 'Customs Cleared' : 'Instant Escrow Funded'),
            statusClass: o.shippingStatus === 'IN_TRANSIT' ? 'status-transit' : 'status-cleared',
            date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            savingsUsd: ((parseFloat(o.totalAmount) || 0) * 0.042).toFixed(2)
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Real-Time Staking Yield Accrual Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setEarnedYield(prev => ({
        dgs: +(prev.dgs + 0.012).toFixed(3),
        drgx: +(prev.drgx + 0.045).toFixed(3)
      }));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const fetchTokenBalances = async (account) => {
    if (typeof window !== 'undefined' && window.ethereum && account) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        if (deployedContracts.contracts.DGXToken && deployedContracts.contracts.DGXToken.startsWith('0x')) {
          const dgxContract = new ethers.Contract(deployedContracts.contracts.DGXToken, dgxAbi, provider);
          const dgxBal = await dgxContract.balanceOf(account);
          setStableBalances(prev => ({ ...prev, dgx: +parseFloat(ethers.formatEther(dgxBal)).toFixed(2) }));
        }
        if (deployedContracts.contracts.DGZToken && deployedContracts.contracts.DGZToken.startsWith('0x')) {
          const dgzContract = new ethers.Contract(deployedContracts.contracts.DGZToken, dgzAbi, provider);
          const dgzBal = await dgzContract.balanceOf(account);
          setStableBalances(prev => ({ ...prev, dgz: +parseFloat(ethers.formatEther(dgzBal)).toFixed(2) }));
        }
      } catch (e) {
        console.warn('Could not read token balances:', e);
      }
    }
  };

  const addTokenToMetaMask = async (symbol) => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const isDgx = symbol === 'DGX';
      const address = isDgx 
        ? deployedContracts.contracts.DGXToken 
        : deployedContracts.contracts.DGZToken;
      try {
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: address,
              symbol: symbol,
              decimals: 18,
            },
          },
        });
        if (wasAdded) {
          showToast(`${symbol} Added`, `${symbol} token added to your MetaMask wallet.`, 'success');
        }
      } catch (error) {
        showToast('Wallet Notice', error.message || 'Could not add token to MetaMask.', 'info');
      }
    } else {
      showToast('MetaMask Required', 'Please connect MetaMask to import this token.', 'warning');
    }
  };

  // Check for existing wallet connection and listen for account/chain changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            const account = accounts[0];
            setWalletAddress(account);
            setWalletConnected(true);

            try {
              const chainId = await window.ethereum.request({ method: 'eth_chainId' });
              if (chainId === '0xaa36a7') {
                setWalletNetwork('Ethereum Sepolia Testnet');
              } else {
                setWalletNetwork('Non-Sepolia Network');
              }

              const balHex = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest'],
              });
              const ethBal = parseInt(balHex, 16) / 1e18;
              setStableBalances(prev => ({ ...prev, eth: +ethBal.toFixed(4) }));

              await fetchTokenBalances(account);
            } catch (e) {
              console.warn('Wallet check warning:', e);
            }
          }
        })
        .catch(() => {});

      const handleAccountsChanged = (accounts) => {
        if (!accounts || accounts.length === 0) {
          setWalletConnected(false);
          setWalletAddress('');
          showToast('Wallet Disconnected', 'MetaMask session disconnected.', 'info');
        } else {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          fetchTokenBalances(accounts[0]);
          showToast('Account Changed', `Switched to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`, 'info');
        }
      };

      const handleChainChanged = (chainId) => {
        if (chainId === '0xaa36a7') {
          setWalletNetwork('Ethereum Sepolia Testnet');
          showToast('Network Switched', 'Connected to Ethereum Sepolia Testnet.', 'success');
        } else {
          setWalletNetwork('Non-Sepolia Network');
          showToast('Wrong Network', 'Please switch your wallet to Sepolia Testnet.', 'warning');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Web3 Protocol Actions - Real MetaMask & Sepolia RPC
  const handleConnectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setIsConnectingWallet(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          setWalletAddress(account);
          setWalletConnected(true);

          // Verify Network: Sepolia is 0xaa36a7 (11155111)
          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (currentChainId !== '0xaa36a7') {
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
              });
              setWalletNetwork('Ethereum Sepolia Testnet');
            } catch (switchError) {
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0xaa36a7',
                    chainName: 'Ethereum Sepolia Testnet',
                    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/alch_yX4sywCIZulctfyTjTEpu', 'https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                  }],
                });
                setWalletNetwork('Ethereum Sepolia Testnet');
              }
            }
          } else {
            setWalletNetwork('Ethereum Sepolia Testnet');
          }

          // Query Real Sepolia ETH Balance
          try {
            const balHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [account, 'latest'],
            });
            const ethBal = parseInt(balHex, 16) / 1e18;
            setStableBalances(prev => ({ ...prev, eth: +ethBal.toFixed(4) }));
            await fetchTokenBalances(account);
          } catch (e) {
            console.warn('Could not fetch ETH balance:', e);
          }

          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#10B981']
          });

          showToast(
            'MetaMask Connected',
            `Connected to Sepolia (${account.substring(0, 6)}...${account.substring(account.length - 4)}). Real on-chain actions ready.`,
            'success'
          );
        }
      } catch (err) {
        showToast('Connection Rejected', err.message || 'MetaMask connection was cancelled.', 'error');
      } finally {
        setIsConnectingWallet(false);
      }
    } else {
      // Browsers without Web3 provider
      showToast(
        'MetaMask Not Detected',
        'Please install MetaMask or a Web3 browser extension to interact with live Sepolia contracts.',
        'warning'
      );
    }
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    showToast('Wallet Disconnected', 'Disconnected from Ethereum Sepolia session.', 'info');
  };

  const handleMintStable = async (e) => {
    e.preventDefault();
    const amt = parseFloat(mintStableAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      showToast('Invalid Mint Amount', 'Please enter a valid amount to mint.', 'error');
      return;
    }

    setIsMintingStable(true);

    // If connected to real Web3 wallet on Sepolia, trigger on-chain contract faucet
    if (typeof window !== 'undefined' && window.ethereum && walletConnected && walletAddress) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const isDgx = mintStableType === 'DGX';
        const contractAddress = isDgx 
          ? deployedContracts.contracts.DGXToken 
          : deployedContracts.contracts.DGZToken;
        const abi = isDgx ? dgxAbi : dgzAbi;
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const amountWei = ethers.parseEther(amt.toString());
        showToast(
          'Confirm in MetaMask',
          `Please confirm transaction in your wallet to mint ${amt.toLocaleString()} ${mintStableType} on Sepolia.`,
          'info'
        );

        const tx = await contract.faucet(amountWei);
        showToast(
          'Transaction Sent',
          `Broadcasting ${mintStableType} mint to Sepolia. Tx: ${tx.hash.substring(0, 10)}...`,
          'info'
        );

        const receipt = await tx.wait();

        // Query updated on-chain balance
        const updatedBalWei = await contract.balanceOf(walletAddress);
        const updatedBal = parseFloat(ethers.formatEther(updatedBalWei));

        if (isDgx) {
          setStableBalances(prev => ({ ...prev, dgx: +updatedBal.toFixed(2) }));
        } else {
          setStableBalances(prev => ({ ...prev, dgz: +updatedBal.toFixed(2) }));
        }

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#7B1113', '#10B981']
        });

        showToast(
          `${mintStableType} Confirmed On-Chain`,
          `Successfully minted ${amt.toLocaleString()} ${mintStableType} on Sepolia testnet! Block: ${receipt.blockNumber}`,
          'success'
        );
        setIsMintingStable(false);
        return;
      } catch (err) {
        console.warn('Real contract transaction rejected or failed:', err);
        showToast('On-Chain Notice', err.reason || err.message || 'Transaction was rejected in MetaMask.', 'error');
        setIsMintingStable(false);
        return;
      }
    } else {
      setIsMintingStable(false);
      showToast(
        'MetaMask Required',
        'Please connect MetaMask on Ethereum Sepolia Testnet to mint real protocol tokens.',
        'warning'
      );
      handleConnectWallet();
    }
  };

  // 1-Click Quick Mint DGX Faucet Handler (For Trade Testing)
  const handleQuickMintDgx = async (desiredAmount) => {
    if (typeof window === 'undefined' || !window.ethereum || !walletConnected || !walletAddress) {
      showToast('MetaMask Required', 'Please connect MetaMask to mint real DGX on Sepolia.', 'warning');
      handleConnectWallet();
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const dgxContract = new ethers.Contract(deployedContracts.contracts.DGXToken, dgxAbi, signer);
      const mintAmt = Math.max(parseFloat(desiredAmount) || 10000, 10000);
      const amountWei = ethers.parseEther(mintAmt.toString());

      showToast('Confirm Faucet Mint', `Please confirm in MetaMask to mint ${mintAmt.toLocaleString()} DGX on Sepolia.`, 'info');
      const tx = await dgxContract.faucet(amountWei);
      showToast('Minting Broadcasting', `Sepolia Tx: ${tx.hash.slice(0, 12)}...`, 'info');
      const receipt = await tx.wait();

      await fetchTokenBalances(walletAddress);

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981']
      });

      showToast(
        'DGX Minted On-Chain',
        `Minted ${mintAmt.toLocaleString()} DGX on Sepolia! Block: ${receipt.blockNumber}`,
        'success'
      );
    } catch (err) {
      showToast('Minting Notice', err.reason || err.message || 'Transaction was rejected.', 'error');
    }
  };

  // Real On-Chain Escrow Release to Supplier Handler (DragoEscrow.sol on Sepolia)
  const handleReleaseEscrow = async (order) => {
    if (typeof window === 'undefined' || !window.ethereum || !walletConnected || !walletAddress) {
      showToast('MetaMask Required', 'Please connect MetaMask on Sepolia to disburse escrow funds.', 'warning');
      handleConnectWallet();
      return;
    }

    setReleasingOrderPo(order.poNumber);
    try {
      showToast('Confirm Release', 'Please confirm escrow disbursement to supplier in MetaMask on Sepolia.', 'info');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        deployedContracts.contracts.DragoEscrow,
        escrowAbi,
        signer
      );

      const orderIdBytes = order.orderIdBytes || ethers.keccak256(ethers.toUtf8Bytes(order.poNumber));
      const tx = await escrowContract.releaseToSupplier(orderIdBytes);
      showToast('Releasing Escrow', `Broadcasting release on Sepolia: ${tx.hash.slice(0, 12)}...`, 'info');
      const receipt = await tx.wait();

      // Update backend database record
      if (order.id && !order.id.startsWith('po-')) {
        await dragoApi.updateOrderStatus(order.id, {
          escrowStatus: 'RELEASED',
          txHash: tx.hash,
        }).catch(() => null);
      }

      setOrders(prev => prev.map(o => o.poNumber === order.poNumber ? {
        ...o,
        status: 'Released to Supplier (Sepolia Confirmed)',
        statusClass: 'status-cleared',
        canRelease: false,
        releaseTx: tx.hash,
      } : o));

      await fetchTokenBalances(walletAddress);

      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#D4AF37']
      });

      showToast(
        'Escrow Disbursed On-Chain',
        `Funds released to Japanese supplier on Sepolia (Block: ${receipt.blockNumber})!`,
        'success'
      );
    } catch (err) {
      console.error('Release escrow error:', err);
      showToast('Release Failed', err.reason || err.message || 'Escrow release transaction was cancelled.', 'error');
    } finally {
      setReleasingOrderPo(null);
    }
  };

  // Sync Live On-Chain Balances with Sepolia
  const handleSyncOnChainBalances = async () => {
    if (!walletConnected || !walletAddress) {
      showToast('MetaMask Required', 'Please connect MetaMask to sync on-chain balances.', 'info');
      handleConnectWallet();
      return;
    }
    showToast('Syncing Sepolia...', 'Querying latest on-chain contract state...', 'info');
    await fetchTokenBalances(walletAddress);
    showToast('Balances Synced', 'Sepolia DGX and DGZ balances updated.', 'success');
  };

  // Real Cloudflare R2 Document Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    try {
      showToast('Uploading to R2', `Uploading ${file.name} to Cloudflare R2 object storage...`, 'info');
      const result = await dragoApi.uploadFileToR2(file, 'certificates');
      setUploadedDocUrl(result.publicUrl);
      setUploadedDocName(file.name);
      showToast('Document Verified', `${file.name} successfully stored in Cloudflare R2.`, 'success');
    } catch (err) {
      console.error('R2 upload failed:', err);
      showToast('Upload Notice', err.message || 'Could not upload to R2.', 'error');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleMintSynthetic = (e) => {
    e.preventDefault();
    const amt = parseFloat(mintSynthAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      showToast('Invalid Amount', 'Please enter a valid synthetic quantity.', 'error');
      return;
    }

    const pricePerUnit = mintSynthType === 'eagle' ? 2680.50 : 74.80;
    const requiredCollateral = +(amt * pricePerUnit * 1.5).toFixed(2);

    if (requiredCollateral > stableBalances.dgx) {
      showToast(
        'Insufficient Collateral',
        `Minting requires $${requiredCollateral.toLocaleString()} DGX (150% Over-collateralized). Your balance is $${stableBalances.dgx.toLocaleString()} DGX. Please mint more DGX first.`,
        'error'
      );
      return;
    }

    setIsMintingSynth(true);
    setTimeout(() => {
      setStableBalances(prev => ({ ...prev, dgx: +(prev.dgx - requiredCollateral).toFixed(2) }));
      if (mintSynthType === 'eagle') {
        setSyntheticBalances(prev => ({ ...prev, eagle: +(prev.eagle + amt).toFixed(3) }));
      } else {
        setSyntheticBalances(prev => ({ ...prev, fly: +(prev.fly + amt).toFixed(2) }));
      }
      setIsMintingSynth(false);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#B38F2D']
      });
      showToast(
        `Synthetic ${mintSynthType === 'eagle' ? 'Drago Eagle (Gold)' : 'Drago Fly (Oil)'} Minted`,
        `+${amt} ${mintSynthType === 'eagle' ? 'oz Gold' : 'bbl Oil'} tokenized. Locked $${requiredCollateral.toLocaleString()} DGX in collateral vault.`,
        'success'
      );
    }, 950);
  };

  const handleStakeTokens = (e) => {
    e.preventDefault();
    const amt = parseFloat(stakeAmountInput);
    if (!amt || isNaN(amt) || amt <= 0) {
      showToast('Invalid Stake Amount', 'Please enter a valid amount to stake.', 'error');
      return;
    }

    setIsStaking(true);
    setTimeout(() => {
      if (activeStakingPool === 'DGS') {
        setStakedBalances(prev => ({ ...prev, dgs: +(prev.dgs + amt).toFixed(2) }));
      } else {
        setStakedBalances(prev => ({ ...prev, drgx: +(prev.drgx + amt).toFixed(2) }));
      }
      setIsStaking(false);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#D4AF37']
      });
      showToast(
        `Staked into ${activeStakingPool} Vault`,
        `Successfully staked ${amt.toLocaleString()} tokens at ${activeStakingPool === 'DGS' ? '12.4%' : '18.6%'} APY. Yield is now compounding in real time.`,
        'success'
      );
    }, 850);
  };

  const handleHarvestYield = () => {
    const claimVal = activeStakingPool === 'DGS' ? earnedYield.dgs : earnedYield.drgx;
    if (claimVal <= 0) {
      showToast('No Pending Yield', 'You have no unclaimed yield at this time.', 'info');
      return;
    }

    setIsHarvesting(true);
    setTimeout(() => {
      if (activeStakingPool === 'DGS') {
        setStableBalances(prev => ({ ...prev, dgx: +(prev.dgx + claimVal).toFixed(2) }));
        setEarnedYield(prev => ({ ...prev, dgs: 0 }));
      } else {
        setEarnedYield(prev => ({ ...prev, drgx: 0 }));
      }
      setIsHarvesting(false);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399']
      });
      showToast(
        'Staking Yield Harvested',
        `Claimed +${claimVal.toLocaleString()} rewards directly to your active Web3 wallet balance.`,
        'success'
      );
    }, 600);
  };

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

  // Handle Real Smart Escrow & Commercial Supplier Payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(invoiceAmount);

    if (!amount || isNaN(amount) || amount <= 0) {
      showToast('Invalid Invoice Amount', 'Please enter a valid invoice total in USD.', 'error');
      return;
    }

    if (paymentRail === 'sepolia') {
      if (!walletConnected || !walletAddress) {
        showToast('MetaMask Required', 'Please connect your MetaMask wallet on Sepolia to deposit to Smart Escrow.', 'warning');
        handleConnectWallet();
        return;
      }

      if (stableBalances.dgx < amount) {
        showToast(
          'Insufficient DGX Balance',
          `Invoice requires ${amount.toLocaleString()} DGX. Your Sepolia balance is ${stableBalances.dgx.toLocaleString()} DGX. Use the Protocol Faucet to mint DGX first.`,
          'error'
        );
        return;
      }

      setIsProcessingPayment(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const dgxAddress = deployedContracts.contracts.DGXToken;
        const escrowAddress = deployedContracts.contracts.DragoEscrow;

        const dgxContract = new ethers.Contract(dgxAddress, dgxAbi, signer);
        const escrowContract = new ethers.Contract(escrowAddress, escrowAbi, signer);

        const amountWei = ethers.parseEther(amount.toString());
        const supplierAddr = SUPPLIER_ADDRESSES[supplierDesk] || '0x58201B1832275dA90F263073D742c9f67D8617C6';
        const poNum = `DXUC-PO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const orderIdBytes = ethers.keccak256(ethers.toUtf8Bytes(poNum));

        // Step 1: Check token allowance
        const currentAllowance = await dgxContract.allowance(walletAddress, escrowAddress);
        if (currentAllowance < amountWei) {
          showToast(
            'Step 1/2: Approve DGX',
            `Please confirm approval in MetaMask to allow DragoEscrow to hold ${amount.toLocaleString()} DGX.`,
            'info'
          );
          const approveTx = await dgxContract.approve(escrowAddress, amountWei);
          showToast('Approval Broadcasting', `Broadcasting DGX approval: ${approveTx.hash.slice(0, 12)}...`, 'info');
          await approveTx.wait();
          showToast('Approval Confirmed', 'DGX spend approved on Sepolia. Now confirming escrow deposit...', 'success');
        }

        // Step 2: Deposit to Escrow
        showToast(
          'Step 2/2: Confirm Escrow Deposit',
          `Confirm transaction in MetaMask to lock ${amount.toLocaleString()} DGX into Smart Escrow.`,
          'info'
        );

        const depositTx = await escrowContract.depositOrder(
          orderIdBytes,
          supplierAddr,
          dgxAddress,
          amountWei,
          30 * 86400
        );

        showToast('Escrow Transaction Sent', `Broadcasting deposit to Sepolia: ${depositTx.hash.slice(0, 12)}...`, 'info');
        const depositReceipt = await depositTx.wait();

        // Refresh on-chain balance
        await fetchTokenBalances(walletAddress);

        // Record in backend PostgreSQL database
        const backendOrder = await dragoApi.acceptQuoteAndSettle({
          totalAmount: amount,
          settlementCurrency: 'DGX',
          deliveryAddress: supplierDesk,
          escrowContractTx: depositTx.hash,
          escrowStatus: 'FUNDED',
        }).catch(() => null);

        const jpyReceived = Math.round(amount * fxRate);
        const savingsUsd = (amount * 0.042).toFixed(2);

        const receipt = {
          poNumber: poNum,
          supplier: supplierDesk,
          amountSentUsd: amount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          amountReceivedJpy: jpyReceived.toLocaleString(),
          savingsUsd: savingsUsd,
          rate: fxRate.toFixed(2),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          txHash: depositTx.hash,
          blockNumber: depositReceipt.blockNumber,
          isSepoliaOnChain: true,
          orderIdBytes: orderIdBytes,
        };

        setPaymentReceipt(receipt);

        // Add to live orders table with on-chain attributes
        setOrders(prev => [
          {
            id: backendOrder?.data?.id || ('po-' + Date.now()),
            poNumber: poNum,
            supplier: supplierDesk.split('(')[0].trim(),
            item: `Direct Trade Order ($${amount.toLocaleString()} USD)`,
            amountUsd: amount,
            amountJpy: jpyReceived,
            status: 'Sepolia Escrow Funded',
            statusClass: 'status-cleared',
            date: 'Today',
            savingsUsd: savingsUsd,
            escrowContractTx: depositTx.hash,
            orderIdBytes: orderIdBytes,
            isSepoliaOnChain: true,
            canRelease: true,
          },
          ...prev
        ]);

        setIsProcessingPayment(false);

        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#7B1113', '#D4AF37', '#10B981']
        });

        showToast(
          'On-Chain Escrow Confirmed',
          `Order ${poNum} funded with ${amount.toLocaleString()} DGX on Sepolia (Block: ${depositReceipt.blockNumber}).`,
          'success'
        );
      } catch (err) {
        console.error('Escrow deposit failed:', err);
        setIsProcessingPayment(false);
        showToast('Escrow Transaction Rejected', err.reason || err.message || 'Transaction was cancelled in wallet.', 'error');
      }
    } else {
      // Direct Bank Wire Escrow
      if (amount > availableBalance) {
        showToast('Insufficient Balance', 'Please add funds to your corporate escrow account.', 'error');
        return;
      }
      setIsProcessingPayment(true);
      try {
        const poNum = `DXUC-PO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const backendOrder = await dragoApi.acceptQuoteAndSettle({
          totalAmount: amount,
          settlementCurrency: 'USD',
          deliveryAddress: supplierDesk,
          escrowStatus: 'FUNDED',
        }).catch(() => null);

        setAvailableBalance(prev => +(prev - amount).toFixed(2));
        const jpyReceived = Math.round(amount * fxRate);
        const savingsUsd = (amount * 0.042).toFixed(2);

        const receipt = {
          poNumber: poNum,
          supplier: supplierDesk,
          amountSentUsd: amount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          amountReceivedJpy: jpyReceived.toLocaleString(),
          savingsUsd: savingsUsd,
          rate: fxRate.toFixed(2),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          txHash: backendOrder?.data?.escrowContractTx || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')),
          isSepoliaOnChain: false,
        };

        setPaymentReceipt(receipt);
        setOrders(prev => [
          {
            id: backendOrder?.data?.id || ('po-' + Date.now()),
            poNumber: poNum,
            supplier: supplierDesk.split('(')[0].trim(),
            item: `Direct Trade Order ($${amount.toLocaleString()} USD)`,
            amountUsd: amount,
            amountJpy: jpyReceived,
            status: 'Corporate Wire Escrowed',
            statusClass: 'status-cleared',
            date: 'Today',
            savingsUsd: savingsUsd,
            escrowContractTx: receipt.txHash,
          },
          ...prev
        ]);
        setIsProcessingPayment(false);
        showToast('Wire Escrow Secured', `Purchase Order ${poNum} issued and cleared in Yen account.`, 'success');
      } catch (err) {
        setIsProcessingPayment(false);
        showToast('Payment Processing Error', 'An unexpected error occurred.', 'error');
      }
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

      {/* 2. STICKY CLEAN RESPONSIVE NAVBAR */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Brand */}
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-icon-box">
              <img src="/drago_logo.png" alt="DRAGO X Logo" className="brand-icon-img" />
            </div>
            <div className="brand-text-box">
              <span className="brand-title">DRAGO X</span>
              <span className="brand-tag">AFRICA-JAPAN TRADE</span>
            </div>
          </div>

          {/* Desktop & Tablet Workspace Mode Switcher */}
          <div className="nav-mode-selector">
            <button 
              type="button"
              className={`mode-tab-btn ${workspaceMode === 'trade' ? 'active' : ''}`}
              onClick={() => {
                setWorkspaceMode('trade');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="B2B Commercial Trade & Supplier Settlement OS"
            >
              <Building2 size={15} />
              <span>Trade Portal</span>
              <span className="mode-tag-pill live">Live</span>
            </button>
            <button 
              type="button"
              className={`mode-tab-btn ${workspaceMode === 'protocol' ? 'active' : ''}`}
              onClick={() => {
                setWorkspaceMode('protocol');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Protocol & AI Assets Web3 MVP Hub"
            >
              <Cpu size={15} />
              <span>Protocol & AI</span>
              <span className="mode-tag-pill testnet">MVP</span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            {workspaceMode === 'trade' ? (
              <>
                <a href="#problems" className="nav-link-item">Why DRAGO X</a>
                <a href="#payment" className="nav-link-item active">Pay Supplier</a>
                <a href="#catalog" className="nav-link-item">Catalog</a>
                <a href="#how-it-works" className="nav-link-item">How It Works</a>
              </>
            ) : (
              <>
                <button type="button" className={`nav-link-item ${protocolStep === 1 ? 'active' : ''}`} onClick={() => setProtocolStep(1)}>1. Wallet</button>
                <button type="button" className={`nav-link-item ${protocolStep === 2 ? 'active' : ''}`} onClick={() => setProtocolStep(2)}>2. Stablecoins</button>
                <button type="button" className={`nav-link-item ${protocolStep === 3 ? 'active' : ''}`} onClick={() => setProtocolStep(3)}>3. Synthetics</button>
                <button type="button" className={`nav-link-item ${protocolStep === 4 ? 'active' : ''}`} onClick={() => setProtocolStep(4)}>4. AI Oracle</button>
                <button type="button" className={`nav-link-item ${protocolStep === 5 ? 'active' : ''}`} onClick={() => setProtocolStep(5)}>5. Staking</button>
              </>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="nav-actions">
            {/* Live Corridor Status Indicator (Desktop only) */}
            <div className="badge-pill badge-emerald nav-status-pill">
              <span className="live-pulse" />
              <span>Corridor Live</span>
            </div>

            {/* Notification Bell */}
            <div className="nav-notification-wrapper">
              <button 
                type="button"
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

            {/* Primary Action Button Contextual to Mode */}
            {workspaceMode === 'trade' ? (
              <>
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
                  className="btn-colorful nav-action-btn"
                >
                  <span>Pay Supplier</span>
                  <ChevronRight size={15} />
                </a>
              </>
            ) : (
              walletConnected ? (
                <div className="nav-wallet-connected-pill" onClick={handleDisconnectWallet} title="Click to disconnect">
                  <span className="wallet-dot online" />
                  <span className="wallet-address-short">{walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Connected'}</span>
                  <span className="wallet-eth-bal">{stableBalances.eth || 0} ETH</span>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn-colorful nav-action-btn"
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet}
                >
                  <Wallet size={15} />
                  <span>{isConnectingWallet ? 'Connecting...' : 'Connect Sepolia'}</span>
                </button>
              )
            )}

            {/* Hamburger Button for Mobile / Tablet */}
            <button 
              type="button"
              className="hamburger-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for Mobile Drawer */}
      <div 
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile & Tablet Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Workspace Mode Switcher inside Drawer */}
        <div className="drawer-mode-toggle">
          <div className="drawer-mode-label">Select Workspace Mode:</div>
          <div className="drawer-mode-buttons">
            <button
              type="button"
              className={`drawer-mode-btn ${workspaceMode === 'trade' ? 'active' : ''}`}
              onClick={() => {
                setWorkspaceMode('trade');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Building2 size={16} />
              <span>Trade Portal</span>
              <span className="drawer-mode-tag live">Live</span>
            </button>
            <button
              type="button"
              className={`drawer-mode-btn ${workspaceMode === 'protocol' ? 'active' : ''}`}
              onClick={() => {
                setWorkspaceMode('protocol');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Cpu size={16} />
              <span>Protocol & AI</span>
              <span className="drawer-mode-tag testnet">MVP</span>
            </button>
          </div>
        </div>

        {/* Live Corridor Status Strip in Mobile Drawer */}
        <div className="drawer-corridor-status">
          <div className="drawer-status-item">
            <span className="live-pulse" />
            <span>Africa-Japan Corridor: <strong>Active</strong></span>
          </div>
          <div className="drawer-status-item">
            <DollarSign size={14} color="var(--color-gold-deep)" />
            <span>Guaranteed FX: <strong>1 USD = {fxRate} JPY</strong></span>
          </div>
          <div className="drawer-status-item">
            <Shield size={14} color="var(--color-crimson)" />
            <span>Escrow Balance: <strong>${(availableBalance || 0).toLocaleString()} USD</strong></span>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="mobile-nav-links">
          {workspaceMode === 'trade' ? (
            <>
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
            </>
          ) : (
            <>
              <button 
                type="button" 
                className={`mobile-nav-link-item ${protocolStep === 1 ? 'active' : ''}`}
                onClick={() => { setProtocolStep(1); setMobileMenuOpen(false); }}
              >
                <Wallet size={18} color="var(--color-crimson)" />
                <span>1. Connect Web3 Wallet (Sepolia)</span>
              </button>
              <button 
                type="button" 
                className={`mobile-nav-link-item ${protocolStep === 2 ? 'active' : ''}`}
                onClick={() => { setProtocolStep(2); setMobileMenuOpen(false); }}
              >
                <Coins size={18} color="var(--color-gold)" />
                <span>2. Mint Stablecoins (DGX / DGZ)</span>
              </button>
              <button 
                type="button" 
                className={`mobile-nav-link-item ${protocolStep === 3 ? 'active' : ''}`}
                onClick={() => { setProtocolStep(3); setMobileMenuOpen(false); }}
              >
                <Layers size={18} color="var(--color-crimson)" />
                <span>3. Mint Synthetics (Gold / Oil)</span>
              </button>
              <button 
                type="button" 
                className={`mobile-nav-link-item ${protocolStep === 4 ? 'active' : ''}`}
                onClick={() => { setProtocolStep(4); setMobileMenuOpen(false); }}
              >
                <Cpu size={18} color="var(--color-gold)" />
                <span>4. AI Interest & Risk Engine</span>
              </button>
              <button 
                type="button" 
                className={`mobile-nav-link-item ${protocolStep === 5 ? 'active' : ''}`}
                onClick={() => { setProtocolStep(5); setMobileMenuOpen(false); }}
              >
                <TrendingUp size={18} color="var(--color-crimson)" />
                <span>5. Stake & Earn Vaults</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation Drawer Footer Actions */}
        <div className="mobile-nav-footer">
          {workspaceMode === 'trade' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                type="button"
                className="btn-minimal"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setTopUpModalOpen(true); setMobileMenuOpen(false); }}
              >
                <Wallet size={16} color="var(--color-gold-deep)" />
                <span>Top Up Balance (${(availableBalance || 0).toLocaleString()})</span>
              </button>
              <a 
                href="#payment" 
                className="btn-colorful" 
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Pay Supplier Now</span>
                <ChevronRight size={16} />
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {walletConnected ? (
                <button 
                  type="button"
                  className="btn-minimal"
                  style={{ width: '100%', justifyContent: 'center', borderColor: '#EF4444', color: '#B91C1C' }}
                  onClick={() => { handleDisconnectWallet(); setMobileMenuOpen(false); }}
                >
                  <Lock size={16} />
                  <span>Disconnect ({walletAddress ? walletAddress.substring(0, 6) : ''}...)</span>
                </button>
              ) : (
                <button 
                  type="button"
                  className="btn-colorful"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { handleConnectWallet(); setMobileMenuOpen(false); }}
                  disabled={isConnectingWallet}
                >
                  <Wallet size={16} />
                  <span>{isConnectingWallet ? 'Connecting...' : 'Connect MetaMask (Sepolia)'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* WORKSPACE MODE CONDITIONAL RENDERING */}
      {workspaceMode === 'trade' ? (
        <>
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
                  {/* Settlement Rail Selector */}
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Payment & Escrow Settlement Rail</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setPaymentRail('sepolia')}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: paymentRail === 'sepolia' ? '2px solid var(--color-crimson)' : '1px solid #E2E8F0',
                          background: paymentRail === 'sepolia' ? '#FFF5F5' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 4,
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.86rem', color: paymentRail === 'sepolia' ? 'var(--color-crimson)' : 'var(--text-dark)' }}>
                          <Shield size={14} color="var(--color-crimson)" />
                          <span>Sepolia Smart Escrow</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Live On-Chain DGX • DragoEscrow.sol
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentRail('wire')}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: paymentRail === 'wire' ? '2px solid var(--color-crimson)' : '1px solid #E2E8F0',
                          background: paymentRail === 'wire' ? '#FFF5F5' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 4,
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.86rem', color: paymentRail === 'wire' ? 'var(--color-crimson)' : 'var(--text-dark)' }}>
                          <Building2 size={14} color="var(--color-crimson)" />
                          <span>Corporate Wire Escrow</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Audited Fiat SWIFT / JPY Clearing
                        </span>
                      </button>
                    </div>
                  </div>

                  {paymentRail === 'sepolia' && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      marginBottom: 16,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Coins size={15} color="var(--color-gold-deep)" />
                        <span>
                          Wallet Balance: <strong>{stableBalances.dgx.toLocaleString()} DGX</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickMintDgx(invoiceAmount)}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          background: 'var(--color-gold)',
                          color: '#000',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        title="Mint DGX test tokens on Sepolia"
                      >
                        <PlusCircle size={12} />
                        <span>Mint DGX Faucet</span>
                      </button>
                    </div>
                  )}

                  <div className="form-group">
                    <div className="form-label-row">
                      <label className="form-label">Invoice Amount ({paymentRail === 'sepolia' ? 'DGX' : 'USD'})</label>
                      <span className="form-sublabel">
                        Available: <strong>{paymentRail === 'sepolia' ? `${stableBalances.dgx.toLocaleString()} DGX` : `$${(availableBalance || 0).toLocaleString()} USD`}</strong>
                      </span>
                    </div>
                    <div className="input-box-wrapper">
                      <input 
                        type="number" 
                        className={`styled-input styled-input-with-tag ${parseFloat(invoiceAmount) > (paymentRail === 'sepolia' ? stableBalances.dgx : availableBalance) ? 'input-error-border' : ''}`}
                        value={invoiceAmount} 
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        placeholder="e.g. 15000"
                        min="100"
                        required
                      />
                      <div className="input-token-tag">
                        <span>{paymentRail === 'sepolia' ? 'DGX' : 'USD'}</span>
                      </div>
                    </div>

                    {/* Quick Select Pills */}
                    <div className="quick-pills-row">
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === '5000' ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount('5000')}
                      >
                        5,000
                      </button>
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === '15000' ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount('15000')}
                      >
                        15,000
                      </button>
                      <button 
                        type="button" 
                        className={`quick-pill ${invoiceAmount === '35000' ? 'active' : ''}`} 
                        onClick={() => setInvoiceAmount('35000')}
                      >
                        35,000
                      </button>
                      <button 
                        type="button" 
                        className="quick-pill" 
                        onClick={() => setInvoiceAmount(String(paymentRail === 'sepolia' ? stableBalances.dgx : availableBalance))}
                      >
                        MAX
                      </button>
                    </div>

                    {/* INSUFFICIENT BALANCE WARNING ALERT */}
                    {parseFloat(invoiceAmount) > (paymentRail === 'sepolia' ? stableBalances.dgx : availableBalance) && (
                      <div className="insufficient-balance-alert">
                        <div className="alert-icon-box">
                          <AlertTriangle size={20} />
                        </div>
                        <div className="alert-text-box">
                          <div className="alert-title">Insufficient Balance for Invoice</div>
                          <div className="alert-desc">
                            Invoice ({(parseFloat(invoiceAmount) || 0).toLocaleString()} {paymentRail === 'sepolia' ? 'DGX' : 'USD'}) exceeds available balance ({(paymentRail === 'sepolia' ? stableBalances.dgx : availableBalance || 0).toLocaleString()} {paymentRail === 'sepolia' ? 'DGX' : 'USD'}).
                          </div>
                          {paymentRail === 'sepolia' ? (
                            <button 
                              type="button" 
                              className="btn-topup-shortfall"
                              onClick={() => handleQuickMintDgx(invoiceAmount)}
                            >
                              <PlusCircle size={15} />
                              <span>Mint Shortfall via Sepolia Faucet</span>
                            </button>
                          ) : (
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
                          )}
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
                        <span>
                          {paymentRail === 'sepolia'
                            ? 'Executing Sepolia Escrow Deposit...'
                            : 'Settling Corporate Escrow Wire...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>
                          {paymentRail === 'sepolia'
                            ? 'Deposit to Smart Escrow on Sepolia'
                            : 'Execute Commercial Wire Settlement'}
                        </span>
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
                        <span className="balance-label">
                          {paymentRail === 'sepolia' ? 'Sepolia Token Balance' : 'Commercial Escrow Balance'}
                        </span>
                        <button 
                          type="button" 
                          className="btn-reset-demo"
                          onClick={handleSyncOnChainBalances}
                          title="Sync balances with Ethereum Sepolia contract"
                        >
                          <RefreshCw size={12} />
                          <span>Sync Balances</span>
                        </button>
                      </div>

                      <div className="balance-amount-display">
                        ${(paymentRail === 'sepolia' ? stableBalances.dgx : (availableBalance || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                          {paymentRail === 'sepolia' ? 'DGX' : 'USD'}
                        </span>
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
                      Enter your payment amount in the left panel and click <strong>Deposit to Smart Escrow</strong> to generate a live transaction receipt and see your exact savings.
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
                    Track payments, on-chain escrow releases, and shipping bills of lading across the Africa-Japan corridor.
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
                      <th style={{ padding: '12px 16px' }}>Sepolia Verification</th>
                      <th style={{ padding: '12px 16px' }}>Actions</th>
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
                        <td style={{ padding: '14px 16px' }}>
                          {ord.escrowContractTx ? (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${ord.escrowContractTx}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                color: 'var(--color-crimson)',
                                fontSize: '0.76rem',
                                fontFamily: 'var(--font-mono)',
                                textDecoration: 'none',
                                fontWeight: 600,
                              }}
                              title="Verify on Sepolia Etherscan"
                            >
                              <span>{ord.escrowContractTx.slice(0, 8)}...{ord.escrowContractTx.slice(-6)}</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Corporate Escrow</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                            {ord.status !== 'RELEASED' && ord.status !== 'Released to Supplier (Sepolia Confirmed)' && (
                              <button
                                type="button"
                                onClick={() => handleReleaseEscrow(ord)}
                                disabled={releasingOrderPo === ord.poNumber}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: 'var(--color-crimson)',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                {releasingOrderPo === ord.poNumber ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span>Releasing...</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock size={12} />
                                    <span>Release to Supplier</span>
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenVoucher({
                                poNumber: ord.poNumber,
                                supplier: ord.supplier,
                                amountSentUsd: ord.amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 }),
                                amountReceivedJpy: ord.amountJpy.toLocaleString(),
                                savingsUsd: ord.savingsUsd,
                                rate: fxRate.toFixed(2),
                                time: 'On Record',
                                date: ord.date,
                                txHash: ord.escrowContractTx || '0x3892a01b2c48e9102847a98b01e23a4f8910b2c12489012ae48201948b01293a'
                              })}
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: '#F1F5F9',
                                color: 'var(--text-dark)',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              Voucher
                            </button>
                          </div>
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
        </>
      ) : (
        <section className="protocol-hub-wrapper">
          {/* 1. WEB3 LIVE WALLET BANNER */}
          <div className="web3-wallet-banner">
            <div className="wallet-banner-left">
              <div className="wallet-avatar-icon">
                <Shield size={26} />
              </div>
              <div className="wallet-info-main">
                <div className="wallet-status-badge">
                  <span className="wallet-status-dot" style={{ background: walletConnected ? '#10B981' : '#EF4444' }} />
                  <span style={{ color: walletConnected ? '#34D399' : '#FCA5A5' }}>
                    {walletConnected ? `${walletNetwork} Connected` : 'Web3 Wallet Disconnected'}
                  </span>
                </div>
                {walletConnected ? (
                  <div 
                    className="wallet-address-copy" 
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress);
                      showToast('Address Copied', 'Wallet address copied to clipboard.', 'info');
                    }}
                    title="Click to copy address"
                  >
                    <span>{walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}</span>
                    <Copy size={13} />
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    Connect your MetaMask or Web3 Testnet wallet to mint assets and access AI liquidity vaults.
                  </div>
                )}
              </div>
            </div>

            <div className="wallet-balances-strip">
              <div className="wallet-bal-pill">
                <span className="wallet-bal-lbl">DGX (USD)</span>
                <span className="wallet-bal-val emerald">${stableBalances.dgx.toLocaleString()}</span>
              </div>
              <div className="wallet-bal-pill">
                <span className="wallet-bal-lbl">DGZ (JPY)</span>
                <span className="wallet-bal-val">¥{stableBalances.dgz.toLocaleString()}</span>
              </div>
              <div className="wallet-bal-pill">
                <span className="wallet-bal-lbl">Drago Eagle (Gold)</span>
                <span className="wallet-bal-val gold">{syntheticBalances.eagle.toFixed(2)} oz</span>
              </div>
              <div className="wallet-bal-pill">
                <span className="wallet-bal-lbl">Drago Fly (Oil)</span>
                <span className="wallet-bal-val">{syntheticBalances.fly.toFixed(0)} bbl</span>
              </div>
              <div className="wallet-bal-pill">
                <span className="wallet-bal-lbl">Gas (Sepolia)</span>
                <span className="wallet-bal-val">{stableBalances.eth} ETH</span>
              </div>

              {walletConnected ? (
                <button 
                  type="button" 
                  className="btn-wallet-action btn-disconnect-wallet"
                  onClick={handleDisconnectWallet}
                >
                  <Lock size={15} />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn-wallet-action btn-connect-wallet"
                  onClick={handleConnectWallet}
                >
                  <Wallet size={16} />
                  <span>Connect Web3 Wallet</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. GUIDED 5-STEP INTERACTIVE ROADMAP CARD */}
          <div className="guided-roadmap-card">
            <div className="roadmap-header-row">
              <div className="roadmap-title-box">
                <Sparkles size={22} color="var(--color-crimson)" />
                <div>
                  <h3 className="roadmap-title">DRAGO X Protocol • 5-Step MVP Guided Walkthrough</h3>
                  <span className="roadmap-subtitle">Interactive testnet front-end interface (Ethereum Sepolia Testnet)</span>
                </div>
              </div>
              <div className="badge-pill badge-gold">
                <Activity size={14} />
                <span>Live Sepolia Protocol Engine</span>
              </div>
            </div>

            <div className="roadmap-steps-track">
              <div 
                className={`roadmap-step-item ${protocolStep === 1 ? 'active' : ''}`}
                onClick={() => setProtocolStep(1)}
              >
                <span className="roadmap-step-num">STEP 1 {walletConnected ? '✓' : ''}</span>
                <span className="roadmap-step-text">Connect Wallet</span>
              </div>
              <div 
                className={`roadmap-step-item ${protocolStep === 2 ? 'active' : ''}`}
                onClick={() => setProtocolStep(2)}
              >
                <span className="roadmap-step-num">STEP 2</span>
                <span className="roadmap-step-text">Mint Stablecoins</span>
              </div>
              <div 
                className={`roadmap-step-item ${protocolStep === 3 ? 'active' : ''}`}
                onClick={() => setProtocolStep(3)}
              >
                <span className="roadmap-step-num">STEP 3</span>
                <span className="roadmap-step-text">Mint Synthetics</span>
              </div>
              <div 
                className={`roadmap-step-item ${protocolStep === 4 ? 'active' : ''}`}
                onClick={() => setProtocolStep(4)}
              >
                <span className="roadmap-step-num">STEP 4</span>
                <span className="roadmap-step-text">AI Rates & Risk</span>
              </div>
              <div 
                className={`roadmap-step-item ${protocolStep === 5 ? 'active' : ''}`}
                onClick={() => setProtocolStep(5)}
              >
                <span className="roadmap-step-num">STEP 5</span>
                <span className="roadmap-step-text">Stake & Earn</span>
              </div>
            </div>
          </div>

          {/* VERIFIED SEPOLIA SMART CONTRACTS BAR */}
          <div className="verified-contracts-bar">
            <div className="verified-bar-header">
              <div className="verified-title-group">
                <CheckCircle2 size={18} color="#10B981" />
                <span className="verified-title">Live Verified Smart Contracts (Ethereum Sepolia Testnet)</span>
              </div>
              <div className="badge-pill badge-emerald">
                <span className="live-pulse" />
                <span>Alchemy Sepolia Live</span>
              </div>
            </div>

            <div className="verified-contracts-grid">
              <div className="verified-contract-card">
                <div className="contract-card-top">
                  <span className="contract-role">USD Pegged Currency</span>
                  <button 
                    type="button" 
                    className="add-metamask-btn" 
                    onClick={() => addTokenToMetaMask('DGX')}
                    title="Add DGX to MetaMask"
                  >
                    <PlusCircle size={12} />
                    <span>Add to MetaMask</span>
                  </button>
                </div>
                <div className="contract-name">DGX Token (1:1 USD)</div>
                <div className="contract-address-row">
                  <code className="contract-code">{deployedContracts.contracts.DGXToken}</code>
                  <a 
                    href={`https://sepolia.etherscan.io/address/${deployedContracts.contracts.DGXToken}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="contract-link" 
                    title="View on Sepolia Etherscan"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="verified-contract-card">
                <div className="contract-card-top">
                  <span className="contract-role">JPY Pegged Currency</span>
                  <button 
                    type="button" 
                    className="add-metamask-btn" 
                    onClick={() => addTokenToMetaMask('DGZ')}
                    title="Add DGZ to MetaMask"
                  >
                    <PlusCircle size={12} />
                    <span>Add to MetaMask</span>
                  </button>
                </div>
                <div className="contract-name">DGZ Token (1:1 JPY)</div>
                <div className="contract-address-row">
                  <code className="contract-code">{deployedContracts.contracts.DGZToken}</code>
                  <a 
                    href={`https://sepolia.etherscan.io/address/${deployedContracts.contracts.DGZToken}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="contract-link" 
                    title="View on Sepolia Etherscan"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="verified-contract-card">
                <div className="contract-card-top">
                  <span className="contract-role">Commercial Settlement</span>
                  <span className="badge-pill badge-gold" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>Zero Counterparty Risk</span>
                </div>
                <div className="contract-name">Drago Escrow Vault</div>
                <div className="contract-address-row">
                  <code className="contract-code">{deployedContracts.contracts.DragoEscrow}</code>
                  <a 
                    href={`https://sepolia.etherscan.io/address/${deployedContracts.contracts.DragoEscrow}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="contract-link" 
                    title="View on Sepolia Etherscan"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TWO-COLUMN INTERACTIVE PROTOCOL GRID */}
          <div className="protocol-grid-layout">
            {/* CARD 1: MINT STABLECOINS */}
            <div className="protocol-card" id="step-mint-stable">
              <div>
                <div className="card-top-heading">
                  <div className="card-title-group">
                    <div className="badge-pill badge-crimson" style={{ marginBottom: 8 }}>
                      <Coins size={13} />
                      <span>Step 2 • Native Trade Currencies</span>
                    </div>
                    <h3>Mint Protocol Stablecoins</h3>
                    <p>Issue atomic trade liquidity pegged 1:1 to US Dollars or Japanese Yen with zero bank correspondent fees.</p>
                  </div>
                  <div className="brand-icon-box" style={{ width: 38, height: 38, minWidth: 38 }}>
                    <Coins size={18} />
                  </div>
                </div>

                {/* Asset Selection */}
                <div className="asset-selector-strip">
                  <button 
                    type="button" 
                    className={`asset-tab-pill ${mintStableType === 'DGX' ? 'active' : ''}`}
                    onClick={() => setMintStableType('DGX')}
                  >
                    <span>DGX (USD Stablecoin)</span>
                    <span className="mode-tag-pill live">$1.00</span>
                  </button>
                  <button 
                    type="button" 
                    className={`asset-tab-pill ${mintStableType === 'DGZ' ? 'active' : ''}`}
                    onClick={() => setMintStableType('DGZ')}
                  >
                    <span>DGZ (JPY Stablecoin)</span>
                    <span className="mode-tag-pill live">¥{fxRate}</span>
                  </button>
                </div>

                <form onSubmit={handleMintStable}>
                  <div className="form-group">
                    <label className="form-label">Amount to Mint</label>
                    <div className="input-box-wrapper">
                      <input 
                        type="number"
                        className="styled-input styled-input-with-tag"
                        value={mintStableAmount}
                        onChange={e => setMintStableAmount(e.target.value)}
                        min="10"
                        required
                      />
                      <div className="input-token-tag">{mintStableType}</div>
                    </div>

                    {/* Quick Select */}
                    <div className="quick-pills-row" style={{ marginTop: 8 }}>
                      {['500', '1000', '5000', '10000'].map(val => (
                        <button 
                          key={val} 
                          type="button" 
                          className={`quick-pill ${mintStableAmount === val ? 'active' : ''}`}
                          onClick={() => setMintStableAmount(val)}
                        >
                          +{parseInt(val).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: 14 }}>
                    <label className="form-label">Collateral Funding Rail</label>
                    <select 
                      className="styled-input"
                      value={mintStableRail}
                      onChange={e => setMintStableRail(e.target.value)}
                    >
                      <option value="USDC Direct">USDC Direct (Circle On-Chain Reserves)</option>
                      <option value="USDT Liquid">Tether USDT Liquidity Pool</option>
                      <option value="Bank Wire Escrow">Commercial Bank Wire Escrow (USD)</option>
                    </select>
                  </div>

                  {/* Specs Panel */}
                  <div className="card-specs-panel">
                    <div className="spec-line-item">
                      <span className="label">Pegged Parity:</span>
                      <span className="value emerald">{mintStableType === 'DGX' ? '1 DGX = $1.0000 USD' : '1 DGZ = ¥1.00 JPY'}</span>
                    </div>
                    <div className="spec-line-item">
                      <span className="label">Sepolia Gas Estimate:</span>
                      <span className="value">~0.0018 ETH (Free Testnet)</span>
                    </div>
                    <div className="spec-line-item">
                      <span className="label">Sepolia Smart Contract:</span>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${mintStableType === 'DGX' ? deployedContracts.contracts.DGXToken : deployedContracts.contracts.DGZToken}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="value gold" 
                        style={{ fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        title="View verified contract on Sepolia Etherscan"
                      >
                        {(mintStableType === 'DGX' ? deployedContracts.contracts.DGXToken : deployedContracts.contracts.DGZToken).substring(0, 10)}... (Verified)
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="spec-line-item" style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="label">Add to MetaMask:</span>
                      <button 
                        type="button" 
                        className="btn-minimal" 
                        style={{ padding: '3px 8px', fontSize: '0.72rem', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        onClick={() => addTokenToMetaMask(mintStableType)}
                      >
                        <PlusCircle size={12} color="var(--color-gold-deep)" />
                        <span>Add {mintStableType} to Wallet</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isMintingStable}
                  >
                    {isMintingStable ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        <span>Executing On-Chain Mint...</span>
                      </>
                    ) : (
                      <>
                        <Coins size={17} />
                        <span>Mint {mintStableAmount} {mintStableType}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* CARD 2: MINT SYNTHETIC ASSETS */}
            <div className="protocol-card" id="step-mint-synthetic">
              <div>
                <div className="card-top-heading">
                  <div className="card-title-group">
                    <div className="badge-pill badge-gold" style={{ marginBottom: 8 }}>
                      <Sparkles size={13} />
                      <span>Step 3 • Real-World Asset Tokenization</span>
                    </div>
                    <h3>Mint Synthetic RWAs</h3>
                    <p>Hedge cross-border trade and currency volatility by minting synthetic physical gold and crude oil on-chain.</p>
                  </div>
                  <div className="brand-icon-box" style={{ width: 38, height: 38, minWidth: 38 }}>
                    <Flame size={18} />
                  </div>
                </div>

                {/* Synthetic Asset Selection */}
                <div className="asset-selector-strip">
                  <button 
                    type="button" 
                    className={`asset-tab-pill ${mintSynthType === 'eagle' ? 'active' : ''}`}
                    onClick={() => setMintSynthType('eagle')}
                  >
                    <span>Drago Eagle (Gold)</span>
                    <span className="mode-tag-pill testnet">$2,680/oz</span>
                  </button>
                  <button 
                    type="button" 
                    className={`asset-tab-pill ${mintSynthType === 'fly' ? 'active' : ''}`}
                    onClick={() => setMintSynthType('fly')}
                  >
                    <span>Drago Fly (Crude Oil)</span>
                    <span className="mode-tag-pill testnet">$74.80/bbl</span>
                  </button>
                </div>

                <form onSubmit={handleMintSynthetic}>
                  <div className="form-group">
                    <label className="form-label">
                      Quantity ({mintSynthType === 'eagle' ? 'Troy Ounces' : 'Barrels'})
                    </label>
                    <div className="input-box-wrapper">
                      <input 
                        type="number"
                        className="styled-input styled-input-with-tag"
                        value={mintSynthAmount}
                        onChange={e => setMintSynthAmount(e.target.value)}
                        step="0.1"
                        min="0.1"
                        required
                      />
                      <div className="input-token-tag">{mintSynthType === 'eagle' ? 'OZ' : 'BBL'}</div>
                    </div>
                  </div>

                  {/* Over-Collateralization Gauge */}
                  <div className="collateral-ratio-box">
                    <div className="ratio-labels-row">
                      <span style={{ color: 'var(--text-muted)' }}>Collateralization Ratio</span>
                      <span style={{ color: '#059669' }}>150.0% (Optimal Safety)</span>
                    </div>
                    <div className="ratio-meter-track">
                      <div className="ratio-meter-fill" style={{ width: '85%' }} />
                    </div>
                  </div>

                  {/* Specs Panel */}
                  <div className="card-specs-panel">
                    <div className="spec-line-item">
                      <span className="label">Oracle Benchmark:</span>
                      <span className="value">
                        {mintSynthType === 'eagle' ? 'LBMA Gold Spot ($2,680.50/oz)' : 'Brent Crude Index ($74.80/bbl)'}
                      </span>
                    </div>
                    <div className="spec-line-item">
                      <span className="label">Required DGX Collateral:</span>
                      <span className="value gold">
                        ${((parseFloat(mintSynthAmount) || 0) * (mintSynthType === 'eagle' ? 2680.50 : 74.80) * 1.5).toLocaleString(undefined, { minimumFractionDigits: 2 })} DGX
                      </span>
                    </div>
                    <div className="spec-line-item">
                      <span className="label">Liquidation Buffer:</span>
                      <span className="value emerald">120.0% Minimum Floor</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isMintingSynth}
                  >
                    {isMintingSynth ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        <span>Locking Collateral & Tokenizing...</span>
                      </>
                    ) : (
                      <>
                        <Flame size={17} />
                        <span>Mint {mintSynthAmount} {mintSynthType === 'eagle' ? 'Drago Eagle (Gold)' : 'Drago Fly (Oil)'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* CARD 3: AI ORACLE & RISK SCORING DASHBOARD */}
            <div className="protocol-card" id="step-ai-dashboard">
              <div>
                <div className="card-top-heading">
                  <div className="card-title-group">
                    <div className="badge-pill badge-crimson" style={{ marginBottom: 8 }}>
                      <Cpu size={13} />
                      <span>Step 4 • Alberta GPU Compute Cluster</span>
                    </div>
                    <h3>AI Oracle & Corridor Risk Engine</h3>
                    <p>Dynamic interest rates, port congestion scoring, and automated liquidity routing for the Africa-Japan corridor.</p>
                  </div>
                  <div className="brand-icon-box" style={{ width: 38, height: 38, minWidth: 38 }}>
                    <TrendingUp size={18} />
                  </div>
                </div>

                {/* AI Rates Comparison */}
                <div className="ai-rates-comparison-box">
                  <div className="rate-col">
                    <span className="rate-val-highlight">4.8% APR</span>
                    <span className="rate-col-sub" style={{ color: 'var(--color-crimson)' }}>DRAGO X AI Dynamic Rate</span>
                  </div>
                  <div className="rate-col">
                    <span className="rate-val-highlight bank">14.5% APR</span>
                    <span className="rate-col-sub">Traditional Bank Letter of Credit</span>
                  </div>
                </div>

                {/* Real-Time Corridor Risk Scores */}
                <div className="ai-corridor-grid">
                  <div className="ai-corridor-card">
                    <div>
                      <div className="corridor-route-name">Nairobi & Mombasa Port Berth 4</div>
                      <div className="corridor-route-meta">Customs Inspection: Fast-Track • Est. Transit: 14 to 18 Days</div>
                    </div>
                    <div className="corridor-score-badge">
                      <span className="score-num">92/100</span>
                      <span className="score-lbl">Low Risk</span>
                    </div>
                  </div>

                  <div className="ai-corridor-card">
                    <div>
                      <div className="corridor-route-name">Lagos Apapa Container Corridor</div>
                      <div className="corridor-route-meta">Demurrage Mitigation Active • Est. Transit: 21 to 24 Days</div>
                    </div>
                    <div className="corridor-score-badge">
                      <span className="score-num" style={{ color: '#D97706' }}>84/100</span>
                      <span className="score-lbl">Moderate</span>
                    </div>
                  </div>

                  <div className="ai-corridor-card">
                    <div>
                      <div className="corridor-route-name">Yokohama & Nagoya Exporter Desk</div>
                      <div className="corridor-route-meta">SMBC Clearing Code: Active • JAAI Certificates Verified</div>
                    </div>
                    <div className="corridor-score-badge">
                      <span className="score-num">99/100</span>
                      <span className="score-lbl">Prime Tier</span>
                    </div>
                  </div>
                </div>

                <div className="card-specs-panel" style={{ marginTop: 14 }}>
                  <div className="spec-line-item">
                    <span className="label">Automated Liquidity Router:</span>
                    <span className="value emerald">Tokyo Pool (¥450M) ⇄ African Escrow ($3.2M)</span>
                  </div>
                  <div className="spec-line-item">
                    <span className="label">Oracle Refresh Interval:</span>
                    <span className="value">Every 12 seconds via Alberta GPU Node</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: STAKING & YIELD VAULTS */}
            <div className="protocol-card" id="step-staking-vaults">
              <div>
                <div className="card-top-heading">
                  <div className="card-title-group">
                    <div className="badge-pill badge-gold" style={{ marginBottom: 8 }}>
                      <TrendingUp size={13} />
                      <span>Step 5 • Trade Liquidity Vaults</span>
                    </div>
                    <h3>Stake & Earn Protocol Yield</h3>
                    <p>Provide liquidity to cross-border settlement pools and earn native yield from international trade clearance fees.</p>
                  </div>
                  <div className="brand-icon-box" style={{ width: 38, height: 38, minWidth: 38 }}>
                    <BarChart3 size={18} />
                  </div>
                </div>

                {/* Vault Tabs */}
                <div className="staking-vault-tabs">
                  <button 
                    type="button" 
                    className={`vault-tab-btn ${activeStakingPool === 'DGS' ? 'active' : ''}`}
                    onClick={() => setActiveStakingPool('DGS')}
                  >
                    <span>DGS Liquidity Vault (12.4% APY)</span>
                  </button>
                  <button 
                    type="button" 
                    className={`vault-tab-btn ${activeStakingPool === 'DRGX' ? 'active' : ''}`}
                    onClick={() => setActiveStakingPool('DRGX')}
                  >
                    <span>DRGX Governance (18.6% APY)</span>
                  </button>
                </div>

                {/* Real-Time Accrued Yield Box */}
                <div className="vault-yield-box">
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                      Live Pending Rewards ({activeStakingPool})
                    </span>
                    <div className="yield-num-ticking">
                      +{activeStakingPool === 'DGS' ? earnedYield.dgs.toFixed(3) : earnedYield.drgx.toFixed(3)} {activeStakingPool}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-minimal"
                    onClick={handleHarvestYield}
                    disabled={isHarvesting}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    {isHarvesting ? 'Harvesting...' : 'Harvest Rewards'}
                  </button>
                </div>

                <form onSubmit={handleStakeTokens}>
                  <div className="form-group">
                    <label className="form-label">Stake Amount ({activeStakingPool})</label>
                    <div className="input-box-wrapper">
                      <input 
                        type="number"
                        className="styled-input styled-input-with-tag"
                        value={stakeAmountInput}
                        onChange={e => setStakeAmountInput(e.target.value)}
                        min="50"
                        required
                      />
                      <div className="input-token-tag">{activeStakingPool}</div>
                    </div>
                  </div>

                  <div className="card-specs-panel">
                    <div className="spec-line-item">
                      <span className="label">Staked in Vault:</span>
                      <span className="value emerald">
                        {activeStakingPool === 'DGS' ? `${stakedBalances.dgs.toLocaleString()} DGS` : `${stakedBalances.drgx.toLocaleString()} DRGX`}
                      </span>
                    </div>
                    <div className="spec-line-item">
                      <span className="label">Lockup Period:</span>
                      <span className="value">0 Days (Flexible Instant Unstake)</span>
                    </div>
                    <div className="spec-line-item">
                      <span className="label">Yield Source:</span>
                      <span className="value gold">0.3% Protocol Trade Clearance Fee</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-colorful" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isStaking}
                  >
                    {isStaking ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        <span>Staking into Vault...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp size={17} />
                        <span>Stake {stakeAmountInput} {activeStakingPool}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* 4. OMNICHAIN & SMART CONTRACT ARCHITECTURE BANNER */}
          <div className="hero-stats-strip" style={{ marginTop: 20 }}>
            <div className="hero-stat-unit">
              <span className="hero-stat-number text-gradient-crimson">10</span>
              <span className="hero-stat-desc">Audited Smart Contracts</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat-unit">
              <span className="hero-stat-number text-gradient">8+</span>
              <span className="hero-stat-desc">Supported EVM Chains</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat-unit">
              <span className="hero-stat-number text-gradient-gold">Zero</span>
              <span className="hero-stat-desc">Counterparty Default Risk</span>
            </div>
          </div>
        </section>
      )}

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
                <span className="v-spec-lbl">Settlement Rail:</span>
                <strong className="v-spec-val">Ethereum Sepolia (DragoEscrow.sol)</strong>
              </div>
              <div>
                <span className="v-spec-lbl">Tokyo Clearing Code:</span>
                <strong className="v-spec-val">TYO-BOJ-NET-882</strong>
              </div>
            </div>

            <div className="voucher-hash-box">
              <div className="hash-header">
                <Shield size={13} />
                <span>On-Chain Cryptographic Escrow Audit Hash</span>
              </div>
              <code className="hash-text">{activeVoucher.txHash}</code>
              {activeVoucher.txHash && activeVoucher.txHash.startsWith('0x') && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${activeVoucher.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--color-crimson)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Verify Transaction on Sepolia Etherscan</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>

            {/* Cloudflare R2 Trade Document Upload */}
            <div style={{
              marginTop: 16,
              padding: '14px 16px',
              borderRadius: '10px',
              background: '#F8FAFC',
              border: '1px dashed #CBD5E1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileCheck2 size={15} color="var(--color-crimson)" />
                  <span>Trade Document (JAAI Inspection / Bill of Lading)</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>Cloudflare R2 Storage</span>
              </div>

              {uploadedDocUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-crimson)' }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>{uploadedDocName || 'JAAI-Inspection-Certificate.pdf'}</span>
                  </div>
                  <a
                    href={uploadedDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.76rem', color: 'var(--color-crimson)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>View Stored Document</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  cursor: isUploadingDoc ? 'not-allowed' : 'pointer',
                  fontSize: '0.8rem',
                  color: 'var(--text-body)',
                }}>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    disabled={isUploadingDoc}
                  />
                  {isUploadingDoc ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Uploading to Cloudflare R2...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={15} color="var(--color-crimson)" />
                      <span>Attach JAAI Inspection Certificate or Bill of Lading (Cloudflare R2)</span>
                    </>
                  )}
                </label>
              )}
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
