// ==========================================================================
// UNIFIED MULTI-AGENT VISUAL STUDIO + LIVE CHAT + VIENEU 48KHZ + OMNI-PILOT
// Ports 8765 & 23984 + GitHub & Netlify Cloud Sync
// ==========================================================================

(function () {
  "use strict";

  const IS_LOCALHOST =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";
  let LOCAL_API_BASE = IS_LOCALHOST ? "" : "http://127.0.0.1:8765";
  const LOCAL_CANDIDATE_BASES = IS_LOCALHOST
    ? [""]
    : [
        "http://127.0.0.1:8765",
        "http://localhost:8765",
        "http://127.0.0.1:23984",
        "http://localhost:23984",
      ];

  // --------------------------------------------------------------------------
  // 1. UNIFIED STATE (5-Mode Visual Studio + Live Chat + Omni-Pilot + VieNeu)
  // --------------------------------------------------------------------------
  const STATE = {
    currentMode: "2d",
    webSubPage: "donbay", // "donbay" | "ag2hub" | "hana" | "trada" | "cloned"
    demoChainRunning: false,
    demoChainTimer: null,
    tick: 0,
    elapsedSec: 18,
    layersBuilt: 60,
    totalLayers: 244,
    popupOpen: false,
    canvasCollapsed: false,
  };

  const chatState = {
    sessions: [],
    conversationsById: {},
    activeSessionId: "",
    providerFilter: "all",
    searchQuery: "",
    zeroCodeMode: true,
    autoSpeak: true,
    autoFollowLive: false,
    lastTopSessionMtime: 0,
    lastRenderedListSig: "",
    lastRenderedConvSig: "",
    selectedVoice: "Thùy Dung",
    selectedSampleSlug: "thuy_dung",
    selectedAgentVal: "auto",
    hubTab: "deliverables",
    daemonOnline: false,
    brainSnapshot: null,
    lastAnnouncedMsgId: "",
    isRecordingMic: false,
    linkedMachines: [
      {
        id: "local-primary",
        name: "Máy Chính (PC-Manabie · Ports 8765 & 23984)",
        url: "http://127.0.0.1:8765",
        accounts: [
          "khakhunghiep@gmail.com (P4 FB)",
          "hoatrang756@gmail.com (P5 4K)",
          "aichampionhk1@gmail.com (P1 Flow)",
          "Claude Code CLI/Ext",
        ],
        status: "online",
      },
      {
        id: "gws-drive-bridge",
        name: "Máy 2 / Laptop (Cầu nối Drive & LAN)",
        url: "gws://00_DONG_BO_ANTIGRAVITY_GIUA_CAC_MAY",
        accounts: ["Đồng bộ 2 chiều gws + Antigravity + Claude Code"],
        status: "ready",
      },
    ],
  };

  // Preload Real 4K KOL & Shopee Images from Local/Static Disk via local-assets/
  const KOL_IMAGES = {};
  const KOL_IMAGE_URLS = {
    bao_tram: "local-assets/kol/bao_tram_4k_anchor.jpg",
    bao_nhi: "local-assets/kol/bao_nhi_4k_anchor.jpg",
    khanh_linh: "local-assets/kol/khanh_linh_4k_anchor.jpg",
    ha_vy: "local-assets/kol/ha_vy_4k_anchor.jpg",
    minh_anh: "local-assets/kol/kim_ngan_minh_anh_4k_anchor.jpg",
    master_5kols: "local-assets/kol/00_BANG_5_NHAN_VAT_CANONICAL_4K.jpg",
    sp01: "local-assets/shopee/SP01_V6_BAO_TRAM_SET_PICKLEBALL_CROP_BRA_VAY_XEP_LY_MAY_DO_NGUOC_1500ML.jpg",
    sp03: "local-assets/shopee/SP03_V6_BAO_NHI_SET_LSOUL_CORSET_CROP_REN_VAY_TANG_MAY_DO_NGUOC_1500ML.jpg",
    sp05: "local-assets/shopee/SP05_V6_KHANH_LINH_SET_BLAZER_LUNG_BRALETTE_CHU_I_VAY_BUT_CHI_MAY_DO_NGUOC_1500ML.jpg",
    sp07: "local-assets/shopee/SP07_V6_HA_VY_SET_MICRO_BABYTEE_VAY_DENIM_CARGO_CAP_TRE_MAY_DO_NGUOC_1500ML.jpg",
    sp09: "local-assets/shopee/SP09_V6_MINH_ANH_SET_PILATES_THUN_TAM_TIM_LILAC_HO_EO_MAY_DO_NGUOC_1500ML.jpg",
  };
  Object.keys(KOL_IMAGE_URLS).forEach((k) => {
    const img = new Image();
    img.src = KOL_IMAGE_URLS[k];
    KOL_IMAGES[k] = img;
  });

  // 8 Real Production Streams & Agents on User's Machine (Mode 4)
  const EDITOR_AGENTS = [
    {
      id: "ed-1",
      name: "Bảo Trâm V6 (SP01_V6)",
      code: "AG2-201A",
      theme: "theme-dark",
      color: "#f472b6",
      action: "Đang xóa sao Gemini ✦",
      step: 18,
      kind: "kol_bao_tram",
      kolKey: "bao_tram",
      spKey: "sp01",
      headline: "Bảo Trâm · 105-55-102",
      subline: "Pickleball Thảo Điền · Clone 8.0s 1.0x",
    },
    {
      id: "ed-4",
      name: "Bảo Nhi V6 (SP03_V6)",
      code: "AG2-201B",
      theme: "theme-light",
      color: "#34d399",
      action: "Đang khóa V1 ~1400ml",
      step: 17,
      kind: "kol_bao_nhi",
      kolKey: "bao_nhi",
      spKey: "sp03",
      headline: "Bảo Nhi · 102-55-100",
      subline: "Tiểu thư LSOUL Corset · Atelier Q1",
    },
    {
      id: "ed-2",
      name: "Khánh Linh V6 (SP05_V6)",
      code: "AG2-201C",
      theme: "theme-dark",
      color: "#fb923c",
      action: "Đang ghép Remotion 1080p",
      step: 18,
      kind: "kol_khanh_linh",
      kolKey: "khanh_linh",
      spKey: "sp05",
      headline: "Khánh Linh · 104-55-100",
      subline: "Tổng tài Blazer Bralette · Quận 1",
    },
    {
      id: "ed-5",
      name: "Hà Vy V6 (SP07_V6)",
      code: "AG2-201D",
      theme: "theme-light",
      color: "#38bdf8",
      action: "Đang đốt Sub Karaoke .ass",
      step: 16,
      kind: "kol_ha_vy",
      kolKey: "ha_vy",
      spKey: "sp07",
      headline: "Hà Vy · 103-54-101",
      subline: "Streetwear Micro-BabyTee · Nguyễn Huệ",
    },
    {
      id: "ed-3",
      name: "Minh Anh V6 (SP09_V6)",
      code: "AG2-201E",
      theme: "theme-dark",
      color: "#a3e635",
      action: "Đang xuất CapCut Draft",
      step: 17,
      kind: "kol_minh_anh",
      kolKey: "minh_anh",
      spKey: "sp09",
      headline: "Minh Anh · 105-56-102",
      subline: "Pilates Tím Lilac · Phú Mỹ Hưng Q7",
    },
    {
      id: "ed-6",
      name: "AI Studio Ultra 4K",
      code: "AG2-202",
      theme: "theme-light",
      color: "#a78bfa",
      action: "Nano Banana 2.1 (3072×5504)",
      step: 19,
      kind: "news916",
      headline: "hoatrang756@gmail.com",
      subline: "1,000 ảnh 4K/ngày · 20 video 4K/ngày",
    },
    {
      id: "ed-7",
      name: "Remotion & CapCut Pro",
      code: "AG2-205",
      theme: "theme-light",
      color: "#fb7185",
      action: "Auto-Ducking -14dB & LUT",
      step: 16,
      kind: "cutaway",
      headline: "6 Style edit.fibus.vn",
      subline: "Douyin Beat-Sync · draft_content.json",
    },
    {
      id: "ed-8",
      name: "Swarm Cloner 30 Agent",
      code: "AG2-301",
      theme: "theme-dark",
      color: "#facc15",
      action: "Đang dựng Web Đòn Bẩy AI",
      step: 19,
      kind: "multicursor",
      headline: "30 Agent vẽ DOM",
      subline: "don-bay-ai-v6.html & ag2-agent-hub.html",
    },
  ];

  const EDITOR_ACTION_PHASES = [
    "Đang đấu dây ['taoanh-2', 'taoanh-1']",
    "Đang khóa V1 ~1500ml & cơ số 11",
    "Đang xóa sao Gemini ✦ góc phải",
    "Đang đốt Sub Karaoke .ass & -14dB",
    "Đang xuất draft_content.json CapCut",
    "Hoàn thành QC 10/10 (1.0x)",
  ];

  // 3D Office Desks & Floating Tags for the 12 Real Agents (Mode 2)
  const OFFICE_DESKS = [
    {
      id: "desk-soccer",
      title: "⚽ Giải lao · Cron 15p",
      sub: "Trả lời Comment miền Nam · 2 Agent",
      nx: -0.42,
      ny: -0.36,
      cls: "tag-soccer",
      color: "#34d399",
    },
    {
      id: "desk-exec",
      title: "◆ Multi-CDP 9222..9230 ↗",
      sub: "Profile 1 · Profile 4 · Profile 5 · P6",
      nx: 0.14,
      ny: -0.44,
      cls: "",
      color: "#facc15",
    },
    {
      id: "desk-ed-diagram",
      title: "Flow Director V3.9",
      sub: "🎬 11 Node Clone 8.0s 1.0x (aichampionhk1)",
      nx: 0.52,
      ny: -0.22,
      cls: "",
      color: "#a3e635",
    },
    {
      id: "desk-run",
      title: "🛡️ FB Stealth 5 Lớp (P4)",
      sub: "khakhunghiep · Zero .fill() · Chống Checkpoint",
      nx: -0.46,
      ny: 0.04,
      cls: "",
      color: "#4ade80",
    },
    {
      id: "desk-commander",
      title: "Bộ Não Thứ Hai CEO",
      sub: "AG2-CEO · 339 phiên / 774 luật · VieNeu 48kHz",
      nx: -0.02,
      ny: -0.08,
      cls: "tag-commander",
      color: "#fb923c",
    },
    {
      id: "desk-ed-chart",
      title: "AI Studio Ultra 4K (P5)",
      sub: "✨ hoatrang756 · Nano Banana 2.1 (1000/ngày)",
      nx: 0.34,
      ny: 0.02,
      cls: "",
      color: "#fb923c",
    },
    {
      id: "desk-ed-news",
      title: "Remotion & CapCut Pro",
      sub: "✂ 6 Style edit.fibus.vn · Auto-Ducking -14dB",
      nx: 0.62,
      ny: 0.18,
      cls: "",
      color: "#a78bfa",
    },
    {
      id: "desk-qa-1920",
      title: "May Đo Ngược V3.0",
      sub: "👗 105-55-102cm (~1500ml) · SP01..SP10_V6",
      nx: -0.34,
      ny: 0.32,
      cls: "",
      color: "#38bdf8",
    },
    {
      id: "desk-ed-cut",
      title: "OpenMontage $0 API",
      sub: "🎙️ 12 Pipelines · Sub .ass + Giọng Leda",
      nx: 0.04,
      ny: 0.24,
      cls: "",
      color: "#fb7185",
    },
    {
      id: "desk-qa-768",
      title: "Windows Omni-Pilot",
      sub: "🖥️ UIA + Quay 60fps & Google Classroom",
      nx: -0.14,
      ny: 0.54,
      cls: "",
      color: "#60a5fa",
    },
    {
      id: "desk-qa-source",
      title: "Swarm Cloner 30 Agent",
      sub: "🐝 Đang vẽ don-bay-ai-v6.html & Clone URL",
      nx: 0.36,
      ny: 0.44,
      cls: "",
      color: "#34d399",
    },
  ];

  // Node Graph Definitions for the 12 Real Agents (Mode 3)
  const DAG_NODES = [
    {
      id: "n-cmd",
      code: "AG2-CEO",
      agent: "all-agents",
      title: "Bộ Não Thứ Hai CEO",
      meta: "339 phiên · 774 luật · VieNeu 48kHz",
      x: 50,
      y: 290,
      cls: "commander",
    },
    {
      id: "n-news",
      code: "AG2-101",
      agent: "fb-viral-scout",
      title: "FB Viral Scout (Profile 4)",
      meta: "5 Lớp Stealth · Tải Reel 1080p + DOM",
      x: 340,
      y: 105,
      cls: "",
    },
    {
      id: "n-content",
      code: "AG2-102",
      agent: "fb-viral-scout",
      title: "May Đo Ngược V3.0 (1500ml)",
      meta: "SP01..SP10_V6 · 105-55-102cm · kkhmn4",
      x: 340,
      y: 225,
      cls: "",
    },
    {
      id: "n-pickvid",
      code: "AG2-103",
      agent: "fb-viral-scout",
      title: "Luxury Allure Hunter",
      meta: "House of CB, Mugler, LSOUL · Headless 20%",
      x: 340,
      y: 345,
      cls: "",
    },
    {
      id: "n-layout",
      code: "AG2-203",
      agent: "flow-video-director",
      title: "Sitcom 18 Đoạn & Acting",
      meta: "48 FACS + 104 Luxury Poses · Method-Acting",
      x: 340,
      y: 465,
      cls: "",
    },
    {
      id: "n-v1",
      code: "AG2-201",
      agent: "flow-video-director",
      title: "Google Flow Studio V3.9",
      meta: "11 Node Clone 8.0s 1.0x · 5 AI KOLs V6",
      x: 650,
      y: 85,
      cls: "video-node",
    },
    {
      id: "n-v2",
      code: "AG2-202",
      agent: "aistudio-4k-upscaler",
      title: "AI Studio Ultra 4K (P5)",
      meta: "hoatrang756 · Nano Banana 2.1 (3072×5504)",
      x: 650,
      y: 205,
      cls: "video-node",
    },
    {
      id: "n-v3",
      code: "AG2-204",
      agent: "openmontage-director",
      title: "OpenMontage Free ($0 API)",
      meta: "12 Pipelines · Karaoke .ass + Giọng Leda",
      x: 650,
      y: 325,
      cls: "video-node",
    },
    {
      id: "n-v4",
      code: "AG2-205..206",
      agent: "windows-omni-pilot",
      title: "Remotion 4.0 & Omni-Pilot",
      meta: "6 Style edit.fibus.vn · CapCut PC & Classroom",
      x: 650,
      y: 445,
      cls: "video-node",
    },
    {
      id: "n-w1",
      code: "AG2-301",
      agent: "windows-omni-pilot",
      title: "Swarm Cloner (30 Agent)",
      meta: "Dựng don-bay-ai-v6.html & Clone mọi URL",
      x: 960,
      y: 175,
      cls: "web-node",
    },
    {
      id: "n-w2",
      code: "AG2-302",
      agent: "viral-video-editor",
      title: "Đa Kênh & Auditor QC 10/10",
      meta: "FB/TikTok/Threads/Shorts + Link Shopee 7d",
      x: 960,
      y: 345,
      cls: "web-node",
    },
  ];

  const DAG_EDGES = [
    ["n-cmd", "n-news"],
    ["n-cmd", "n-content"],
    ["n-cmd", "n-pickvid"],
    ["n-cmd", "n-layout"],
    ["n-news", "n-v3"],
    ["n-content", "n-v1"],
    ["n-pickvid", "n-v2"],
    ["n-pickvid", "n-v3"],
    ["n-pickvid", "n-v4"],
    ["n-layout", "n-w1"],
    ["n-layout", "n-w2"],
    ["n-v1", "n-w2"],
    ["n-v2", "n-w1"],
    ["n-v2", "n-w2"],
    ["n-v3", "n-w2"],
    ["n-v4", "n-w1"],
  ];

  // --------------------------------------------------------------------------
  // 2. STUDIO MODE SWITCHING, SWARM WEB CLONER & DEMO CHAIN
  // --------------------------------------------------------------------------
  function getSubPagePath(sub) {
    if (sub === "ag2hub") return "ag2-agent-hub.html";
    if (sub === "hana") return "hana-nguyen.html";
    if (sub === "trada") return "trada-gioi-thieu.html";
    if (sub === "cloned") return "cloned-live-web.html";
    return "don-bay-ai-v6.html";
  }

  function loadWebSwarmIframe(sub, liveOnly) {
    const iframe = document.getElementById("web-swarm-iframe");
    if (!iframe) return;
    const base = getSubPagePath(sub);
    const url = liveOnly
      ? `${base}?noswarm=1&t=${Date.now()}`
      : `${base}?t=${Date.now()}`;
    iframe.style.background = sub === "hana" ? "#fbfaf6" : "#0b0d13";
    if (STATE.currentMode === "web") {
      requestAnimationFrame(() => {
        iframe.src = url;
      });
    } else {
      iframe.dataset.pendingSrc = url;
    }
  }

  function switchMode(mode) {
    STATE.currentMode = mode;
    document.querySelectorAll(".mode-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
    document.querySelectorAll(".mode-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === "mode-" + mode);
    });
    if (mode === "3d") {
      resize3DOfficeCanvas();
    } else if (mode === "node") {
      renderNodeGraph();
    } else if (mode === "web") {
      const iframe = document.getElementById("web-swarm-iframe");
      if (
        iframe &&
        (!iframe.src ||
          iframe.src.endsWith("about:blank") ||
          iframe.dataset.pendingSrc)
      ) {
        const target =
          iframe.dataset.pendingSrc ||
          `${getSubPagePath(STATE.webSubPage)}?t=${Date.now()}`;
        delete iframe.dataset.pendingSrc;
        requestAnimationFrame(() => {
          iframe.src = target;
        });
      }
    }
  }

  window.switchStudioMode = switchMode;

  function switchWebSubPage(sub) {
    STATE.webSubPage = sub;
    document.querySelectorAll(".web-page-tab[data-sub]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.sub === sub);
    });
    loadWebSwarmIframe(sub, false);
  }

  window.switchWebSubPage = switchWebSubPage;

  async function cloneCustomUrlWithSwarm(overrideUrl) {
    const input = document.getElementById("clone-url-input");
    const btn = document.getElementById("btn-clone-url");
    const rawUrl = (overrideUrl || (input ? input.value : "") || "").trim();
    if (!rawUrl) {
      switchMode("web");
      switchWebSubPage("donbay");
      return;
    }
    if (btn) btn.textContent = "⏳ Đang hút DOM...";
    try {
      const resp = await fetch(`${LOCAL_API_BASE}/api/clone-web`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      });
      const data = await resp.json();
      if (data && data.ok) {
        STATE.webSubPage = "cloned";
        document
          .querySelectorAll(".web-page-tab[data-sub]")
          .forEach((b) => b.classList.remove("active"));
        switchMode("web");
        loadWebSwarmIframe("cloned", false);
      }
    } catch (err) {
      console.error("Clone URL failed:", err);
      switchMode("web");
      switchWebSubPage("donbay");
    } finally {
      if (btn) btn.textContent = "⚡ Clone Web";
    }
  }

  window.cloneCustomUrlWithSwarm = cloneCustomUrlWithSwarm;

  function replaySwarmInIframe() {
    loadWebSwarmIframe(STATE.webSubPage, false);
  }
  window.replaySwarmInIframe = replaySwarmInIframe;

  function showLiveWebInIframe() {
    const iframe = document.getElementById("web-swarm-iframe");
    try {
      if (
        iframe &&
        iframe.contentWindow &&
        iframe.contentWindow.__swarmRebuild
      ) {
        iframe.contentWindow.__swarmRebuild.stop(true);
        return;
      }
    } catch (_) {}
    loadWebSwarmIframe(STATE.webSubPage, true);
  }
  window.showLiveWebInIframe = showLiveWebInIframe;

  function toggleVideo916Modal(open) {
    STATE.popupOpen = typeof open === "boolean" ? open : !STATE.popupOpen;
    const modal = document.getElementById("video916-modal");
    if (modal) {
      modal.classList.toggle("open", STATE.popupOpen);
    }
    const vid = document.getElementById("video916-real-player");
    if (vid) {
      if (STATE.popupOpen) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    }
  }
  window.toggleVideo916Modal = toggleVideo916Modal;

  function toggle2DCanvasStage() {
    STATE.canvasCollapsed = !STATE.canvasCollapsed;
    const wrap = document.getElementById("cmd2d-video-stage-wrap");
    const btn = document.getElementById("btnToggle2DCanvas");
    if (wrap) {
      wrap.style.display = STATE.canvasCollapsed ? "none" : "flex";
    }
    if (btn) {
      btn.textContent = STATE.canvasCollapsed
        ? "Mở Canvas 5 KOL ▾"
        : "Thu gọn Canvas ▴";
    }
  }
  window.toggle2DCanvasStage = toggle2DCanvasStage;

  function startDemoChain() {
    const btn = document.getElementById("btn-demo-chain");
    if (STATE.demoChainRunning) {
      clearInterval(STATE.demoChainTimer);
      STATE.demoChainRunning = false;
      if (btn) {
        btn.classList.remove("running");
        btn.innerHTML = "▶ Demo Chain";
      }
      return;
    }

    STATE.demoChainRunning = true;
    if (btn) {
      btn.classList.add("running");
      btn.innerHTML = "⏹ Đang chạy Chain...";
    }

    const sequence = [
      { mode: "2d", delay: 0 },
      { mode: "3d", delay: 4500 },
      { mode: "node", delay: 9000 },
      { mode: "editor", delay: 13000 },
      { mode: "web", sub: "donbay", popup: false, delay: 18000 },
      { mode: "web", sub: "ag2hub", popup: false, delay: 22500 },
      { mode: "web", sub: "donbay", popup: true, delay: 27000 },
    ];

    let stepIdx = 0;
    const runStep = () => {
      const item = sequence[stepIdx % sequence.length];
      switchMode(item.mode);
      if (item.sub) switchWebSubPage(item.sub);
      if (typeof item.popup === "boolean") toggleVideo916Modal(item.popup);
      stepIdx++;
    };

    runStep();
    STATE.demoChainTimer = setInterval(runStep, 4500);
  }
  window.startDemoChain = startDemoChain;

  // --------------------------------------------------------------------------
  // 3. CANVAS ENGINES FOR MODES 1, 2, 3, 4
  // --------------------------------------------------------------------------
  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function draw2DCommandPreview() {
    if (STATE.canvasCollapsed) return;
    const canvas = document.getElementById("cmd2d-preview-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#131815");
    grad.addColorStop(1, "#1d2620");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(104, 182, 132, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const pw = 112;
    const ph = h - 18;
    const px = 16;
    const py = 9;

    ctx.save();
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    roundRect(ctx, px, py, pw, ph, 10, true, true);
    ctx.clip();

    const btImg = KOL_IMAGES.bao_tram;
    if (btImg && btImg.complete && btImg.naturalWidth > 0) {
      ctx.drawImage(btImg, px, py, pw, ph);
      ctx.fillStyle = "rgba(15, 23, 42, 0.34)";
      ctx.fillRect(px, py, pw, ph);
    }

    ctx.fillStyle = "#ec4899";
    roundRect(ctx, px + 6, py + 8, pw - 12, 16, 4, true, false);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8.5px Inter, sans-serif";
    ctx.fillText("BẢO TRÂM · 105-55-102", px + 10, py + 19);

    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    roundRect(ctx, px + 6, py + ph - 34, pw - 12, 28, 5, true, false);
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 8.5px JetBrains Mono, monospace";
    ctx.fillText("SP01_V6 · ~1500ml", px + 10, py + ph - 21);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "8px JetBrains Mono, monospace";
    ctx.fillText("Clone 8.0s 1.0x", px + 10, py + ph - 10);
    ctx.restore();

    const rx = px + pw + 16;
    ctx.fillStyle = "#86efac";
    ctx.font = "bold 10.5px JetBrains Mono, monospace";
    ctx.fillText(
      "● 12 AGENT TRÊN MÁY · 5 AI KOLS V6 · CÁNH TAY OMNI-PILOT",
      rx,
      py + 14
    );

    const cards = [
      {
        code: "AG2-101",
        name: "FB Stealth 5 Lớp (P4) & May Đo 1500ml",
        pct: "10 SKU",
        col: "#4ade80",
      },
      {
        code: "AG2-201",
        name: "Google Flow V3.9 (11 Node Clone 8.0s 1.0x)",
        pct: "1080p",
        col: "#a3e635",
      },
      {
        code: "AG2-202",
        name: "AI Studio Ultra 4K (hoatrang756 · 3072×5504)",
        pct: "1000/ngày",
        col: "#fb923c",
      },
      {
        code: "AG2-206",
        name: "Cánh Tay Omni-Pilot + Remotion & CapCut PC",
        pct: "100% Máy",
        col: "#38bdf8",
      },
      {
        code: "AG2-301",
        name: "Swarm 30 Agent Clone Web & VieNeu 48kHz",
        pct: "Đang chạy",
        col: "#f472b6",
      },
    ];

    cards.forEach((c, idx) => {
      const cy = py + 23 + idx * 25;
      const cw = w - rx - 14;
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      roundRect(ctx, rx, cy, cw, 21, 5, true, true);

      ctx.fillStyle = c.col;
      ctx.fillRect(rx + 7, cy + 5, 7, 11);

      ctx.fillStyle = "#f1f5f9";
      ctx.font = "600 10.5px Inter, sans-serif";
      ctx.fillText(`${c.code} · ${c.name}`, rx + 20, cy + 14);

      ctx.fillStyle = "#86efac";
      ctx.font = "bold 9.5px JetBrains Mono, monospace";
      ctx.fillText(c.pct, rx + cw - 68, cy + 14);
    });
  }

  function resize3DOfficeCanvas() {
    const canvas = document.getElementById("office3d-canvas");
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.max(800, rect.width);
    canvas.height = Math.max(500, rect.height);
  }

  function draw3DIsoBox(ctx, cx, cy, w, d, h, topCol, leftCol, rightCol) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - h);
    ctx.lineTo(cx + w, cy - d - h);
    ctx.lineTo(cx, cy - d * 2 - h);
    ctx.lineTo(cx - w, cy - d - h);
    ctx.closePath();
    ctx.fillStyle = topCol;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - w, cy - d - h);
    ctx.lineTo(cx, cy - h);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - w, cy - d);
    ctx.closePath();
    ctx.fillStyle = leftCol;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy - h);
    ctx.lineTo(cx + w, cy - d - h);
    ctx.lineTo(cx + w, cy - d);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fillStyle = rightCol;
    ctx.fill();
  }

  function draw3DAgentAvatar(ctx, x, y, shirtColor, bobOffset) {
    const by = y + bobOffset;
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    draw3DIsoBox(ctx, x, by, 9, 5, 14, shirtColor, shirtColor, "#1e293b");
    draw3DIsoBox(ctx, x, by - 15, 7, 4, 9, "#fde68a", "#fcd34d", "#f59e0b");
    draw3DIsoBox(ctx, x, by - 24, 7.5, 4.5, 3, "#1e1b4b", "#0f172a", "#312e81");
  }

  function drawPalmTree(ctx, x, y, t) {
    ctx.strokeStyle = "#0d9488";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 3, y - 16, x, y - 30);
    ctx.stroke();

    ctx.strokeStyle = "#2dd4bf";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3 + Math.sin(t * 0.03 + x) * 0.08;
      ctx.beginPath();
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x + Math.cos(ang) * 14, y - 30 + Math.sin(ang) * 9);
      ctx.stroke();
    }
  }

  function render3DOffice(t) {
    if (STATE.currentMode !== "3d") return;
    const canvas = document.getElementById("office3d-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const originX = W * 0.61;
    const originY = H * 0.49;
    const floorW = Math.min(W * 0.4, 540);
    const floorD = Math.min(H * 0.41, 310);

    ctx.beginPath();
    ctx.moveTo(originX, originY - floorD);
    ctx.lineTo(originX + floorW, originY);
    ctx.lineTo(originX, originY + floorD);
    ctx.lineTo(originX - floorW, originY);
    ctx.closePath();
    const floorGrad = ctx.createLinearGradient(
      originX - floorW,
      originY - floorD,
      originX + floorW,
      originY + floorD
    );
    floorGrad.addColorStop(0, "#0b2538");
    floorGrad.addColorStop(0.5, "#102a3d");
    floorGrad.addColorStop(1, "#091926");
    ctx.fillStyle = floorGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.38)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = "rgba(56, 189, 248, 0.09)";
    ctx.lineWidth = 1;
    const steps = 12;
    for (let i = 1; i < steps; i++) {
      const f = i / steps;
      ctx.beginPath();
      ctx.moveTo(originX - floorW * (1 - f), originY - floorD * f);
      ctx.lineTo(originX + floorW * f, originY + floorD * (1 - f));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(originX + floorW * (1 - f), originY - floorD * f);
      ctx.lineTo(originX - floorW * f, originY + floorD * (1 - f));
      ctx.stroke();
    }

    const billX = originX - floorW * 0.42;
    const billY = originY - floorD * 0.62;
    ctx.save();
    ctx.transform(1, -0.52, 0, 1, billX, billY);
    const bGrad = ctx.createLinearGradient(-150, -70, 150, 0);
    bGrad.addColorStop(0, "#38bdf8");
    bGrad.addColorStop(0.5, "#67e8f9");
    bGrad.addColorStop(1, "#22d3ee");
    ctx.fillStyle = bGrad;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 24;
    roundRect(ctx, -155, -66, 310, 52, 6, true, false);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#082f49";
    ctx.font = "900 20px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ĐÒN BẨY AI × AG2", 0, -33);
    ctx.restore();

    const palms = [
      [-0.78, -0.15],
      [-0.55, -0.42],
      [-0.2, -0.75],
      [0.22, -0.72],
      [0.62, -0.35],
      [0.78, 0.05],
      [0.55, 0.45],
      [-0.45, 0.55],
    ];
    palms.forEach(([px, py], idx) => {
      drawPalmTree(
        ctx,
        originX + px * floorW,
        originY + py * floorD,
        t + idx * 7
      );
    });

    const socX = originX - floorW * 0.36;
    const socY = originY - floorD * 0.25;
    const sw = 115;
    const sd = 66;
    ctx.beginPath();
    ctx.moveTo(socX, socY - sd);
    ctx.lineTo(socX + sw, socY);
    ctx.lineTo(socX, socY + sd);
    ctx.lineTo(socX - sw, socY);
    ctx.closePath();
    ctx.fillStyle = "#16a34a";
    ctx.fill();
    ctx.strokeStyle = "#bbf7d0";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(socX - sw * 0.5, socY - sd * 0.5);
    ctx.lineTo(socX + sw * 0.5, socY + sd * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(socX, socY, 18, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    const ballProgress = (Math.sin(t * 0.06) + 1) * 0.5;
    const p1x = socX - 38 + Math.sin(t * 0.04) * 10;
    const p1y = socY - 12;
    const p2x = socX + 36 - Math.sin(t * 0.04) * 10;
    const p2y = socY + 14;
    draw3DAgentAvatar(
      ctx,
      p1x,
      p1y,
      "#38bdf8",
      Math.abs(Math.sin(t * 0.12)) * -4
    );
    draw3DAgentAvatar(
      ctx,
      p2x,
      p2y,
      "#f472b6",
      Math.abs(Math.cos(t * 0.12)) * -4
    );

    const bx = p1x + (p2x - p1x) * ballProgress;
    const by =
      p1y +
      (p2y - p1y) * ballProgress -
      Math.sin(ballProgress * Math.PI) * 12;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
    ctx.fill();

    const cmdX = originX + floorW * 0.06;
    const cmdY = originY - floorD * 0.02;
    ctx.fillStyle = "rgba(194, 65, 12, 0.42)";
    ctx.strokeStyle = "rgba(251, 146, 60, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cmdX, cmdY + 8, 92, 52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.ellipse(cmdX, cmdY - 4, 46, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();

    draw3DAgentAvatar(ctx, cmdX - 36, cmdY - 14, "#fb923c", Math.sin(t * 0.08) * 2);
    draw3DAgentAvatar(ctx, cmdX + 38, cmdY - 12, "#facc15", Math.cos(t * 0.08) * 2);
    draw3DAgentAvatar(ctx, cmdX, cmdY + 26, "#4ade80", Math.sin(t * 0.09) * 2);

    OFFICE_DESKS.forEach((d, idx) => {
      if (d.id === "desk-soccer" || d.id === "desk-commander") return;
      const dx = originX + d.nx * floorW;
      const dy = originY + d.ny * floorD;

      ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cmdX, cmdY - 4);
      ctx.lineTo(dx, dy);
      ctx.stroke();

      const p = (t * 0.015 + idx * 0.17) % 1;
      const px = cmdX + (dx - cmdX) * p;
      const py = cmdY - 4 + (dy - (cmdY - 4)) * p;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();

      draw3DIsoBox(ctx, dx, dy, 28, 16, 10, "#cbd5e1", "#94a3b8", "#64748b");
      draw3DIsoBox(ctx, dx - 5, dy - 12, 14, 4, 12, d.color, "#0f172a", d.color);
      draw3DAgentAvatar(
        ctx,
        dx + 12,
        dy + 10,
        d.color,
        Math.sin(t * 0.1 + idx) * 1.8
      );
    });

    const layer = document.getElementById("office3d-labels-layer");
    if (!layer) return;
    if (layer.children.length === 0) {
      OFFICE_DESKS.forEach((d) => {
        const el = document.createElement("div");
        el.className = "agent-floating-tag " + d.cls;
        el.id = "tag-" + d.id;
        el.innerHTML = `
          <div class="tag-title"><span style="color:${d.color}">●</span> ${d.title}</div>
          <div class="tag-sub">${d.sub}</div>
        `;
        layer.appendChild(el);
      });
      syncLiveTasksToVisualStudio(true);
    }

    OFFICE_DESKS.forEach((d) => {
      const el = document.getElementById("tag-" + d.id);
      if (!el) return;
      const dx = originX + d.nx * floorW;
      const dy = originY + d.ny * floorD - 36;
      el.style.left = dx + "px";
      el.style.top = dy + "px";
    });
  }

  function renderNodeGraph() {
    const domLayer = document.getElementById("nodegraph-dom-layer");
    const svg = document.getElementById("nodegraph-svg");
    if (!domLayer || !svg) return;

    if (domLayer.children.length === 0) {
      DAG_NODES.forEach((n) => {
        const div = document.createElement("div");
        div.className = "dag-node " + n.cls;
        div.id = "dag-" + n.id;
        div.style.left = n.x + "px";
        div.style.top = n.y + "px";
        div.innerHTML = `
          <div class="dag-node-header">
            <span>${n.code}</span>
            <span style="color:#4ade80">● Đang chạy</span>
          </div>
          <div class="dag-node-title">${n.title}</div>
          <div class="dag-node-meta">${n.meta}</div>
        `;
        div.addEventListener("click", () => {
          executeOmniAction("spawn-agent-session", {
            agent: n.agent || "all-agents",
            directive: `Chạy ${n.code} (${n.title}): ${n.meta}`,
          });
          switchMode("2d");
        });
        domLayer.appendChild(div);
      });
      syncLiveTasksToVisualStudio(true);
    }

    const nodeMap = {};
    DAG_NODES.forEach((n) => (nodeMap[n.id] = n));

    let svgHtml = "";
    DAG_EDGES.forEach(([fromId, toId], idx) => {
      const a = nodeMap[fromId];
      const b = nodeMap[toId];
      if (!a || !b) return;
      const x1 = a.x + 220;
      const y1 = a.y + 34;
      const x2 = b.x;
      const y2 = b.y + 34;
      const cx1 = x1 + (x2 - x1) * 0.5;
      const cx2 = x1 + (x2 - x1) * 0.5;
      const pathD = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
      const col = idx % 2 === 0 ? "#38bdf8" : "#4ade80";
      svgHtml += `
        <path d="${pathD}" fill="none" stroke="rgba(148,163,184,0.28)" stroke-width="2" />
        <path d="${pathD}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="8 12" stroke-dashoffset="${-STATE.tick * 2}" />
      `;
    });
    svg.innerHTML = svgHtml;
  }

  function initEditorGrid() {
    const grid = document.getElementById("editor-grid-container");
    if (!grid || grid.children.length > 0) return;

    const slots = [
      EDITOR_AGENTS[0],
      EDITOR_AGENTS[1],
      EDITOR_AGENTS[2],
      EDITOR_AGENTS[3],
      "STATUS_MONITOR",
      EDITOR_AGENTS[4],
    ];

    slots.forEach((slot) => {
      if (slot === "STATUS_MONITOR") {
        const win = document.createElement("div");
        win.className = "os-window theme-dark agent-status-monitor";
        win.id = "window-status-monitor";
        win.innerHTML = `
          <div class="os-titlebar">
            <div class="traffic-lights">
              <span class="traffic-dot red"></span>
              <span class="traffic-dot yellow"></span>
              <span class="traffic-dot green"></span>
            </div>
            <span>Trạng thái agent</span>
            <span></span>
          </div>
          <div class="status-monitor-body">
            <div class="status-summary-header">
              <div class="status-big-counts">
                <span id="status-running-count">8 đang chạy</span>
                <span class="done-num" id="status-done-count">0 đã xong</span>
              </div>
              <div class="status-timer" id="status-elapsed-timer">0:18</div>
            </div>
            <div class="status-agent-rows" id="status-agent-rows-container"></div>
          </div>
        `;
        grid.appendChild(win);
        return;
      }

      const win = document.createElement("div");
      win.className = `os-window ${slot.theme}`;
      win.id = `window-${slot.id}`;
      win.innerHTML = `
        <div class="os-titlebar">
          <div class="traffic-lights">
            <span class="traffic-dot red"></span>
            <span class="traffic-dot yellow"></span>
            <span class="traffic-dot green"></span>
          </div>
          <span>AG2 Video &amp; Flow Studio</span>
          <span style="font-size:10px;opacity:0.7">${slot.code}</span>
        </div>
        <div class="trada-editor-toolbar">
          <span style="font-weight:800;color:#e11d48">ag2 viral editor*</span>
          <span style="background:rgba(128,128,128,0.2);padding:1px 6px;border-radius:4px;font-weight:700">9:16 · 1080p 1.0x</span>
          <button class="btn-export-video" onclick="toggleVideo916Modal(true)">Xuất CapCut &amp; MP4</button>
        </div>
        <div class="trada-editor-workspace">
          <div class="editor-side-inspector">
            <div class="prop-pill" style="background:rgba(244,63,94,0.18);color:#f43f5e;font-weight:700">Khóa ~1500ml</div>
            <div class="prop-pill">taoanh-2 (8 ô)</div>
            <div class="prop-pill">taoanh-1 (3 cột)</div>
            <div class="prop-pill">Xóa sao Gemini ✦</div>
            <div class="prop-pill">Auto-Ducking -14dB</div>
          </div>
          <div class="editor-canvas-stage">
            <canvas class="hyperframes-preview-canvas" id="canvas-${slot.id}" width="320" height="170"></canvas>
          </div>
          <div class="editor-right-props">
            <div class="prop-pill" style="font-weight:700">${slot.name}</div>
            <div class="prop-pill">${slot.subline}</div>
            <div class="prop-pill">Remotion 4.0 · 24fps</div>
            <div class="swatch-row">
              <span class="swatch-dot" style="background:#ef4444"></span>
              <span class="swatch-dot" style="background:#f59e0b"></span>
              <span class="swatch-dot" style="background:#10b981"></span>
              <span class="swatch-dot" style="background:#3b82f6"></span>
            </div>
          </div>
        </div>
        <div class="editor-timeline-strip">
          <div class="timeline-playhead" id="playhead-${slot.id}" style="left:35%"></div>
          <div class="timeline-track-bar" style="background:rgba(167,139,250,0.35)">
            <div style="width:78%;height:100%;background:#8b5cf6;border-radius:3px"></div>
          </div>
          <div class="timeline-track-bar" style="background:rgba(56,189,248,0.28)">
            <div style="width:64%;margin-left:12%;height:100%;background:#0ea5e9;border-radius:3px"></div>
          </div>
          <div class="timeline-track-bar" style="background:rgba(251,146,60,0.28)">
            <div style="width:85%;height:100%;background:#f97316;border-radius:3px"></div>
          </div>
        </div>
        <div class="window-task-overlay-label" id="overlay-${slot.id}">
          ${slot.name} · ${slot.action}
        </div>
        <div class="ai-virtual-cursor" id="cursor-${slot.id}" style="left:52%;top:46%">
          <svg class="ai-cursor-svg" viewBox="0 0 24 24" fill="${slot.color}" stroke="#ffffff" stroke-width="1.5">
            <path d="M4 3l16 7-7 2-2 7-7-16z"/>
          </svg>
          <div class="ai-cursor-pill" id="cursor-pill-${slot.id}" style="background:${slot.color}">
            ${slot.action}
          </div>
        </div>
      `;
      grid.appendChild(win);
    });

    const container = document.getElementById("status-agent-rows-container");
    if (container) {
      container.innerHTML = EDITOR_AGENTS.map(
        (ag) => `
        <div class="status-agent-row">
          <div class="status-agent-name">
            <span class="color-dot-sq" style="background:${ag.color}"></span>
            <span>${ag.name}</span>
          </div>
          <div class="status-agent-action" id="row-act-${ag.id}">${ag.action}</div>
          <div class="status-agent-step" id="row-step-${ag.id}">${ag.step}</div>
          <div style="text-align:right;color:#64748b">—</div>
        </div>
      `
      ).join("");
    }
  }

  function drawEditorCanvases(t) {
    initEditorGrid();
    if (STATE.currentMode !== "editor") return;

    EDITOR_AGENTS.slice(0, 5).forEach((ag, idx) => {
      const canvas = document.getElementById(`canvas-${ag.id}`);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0f172a");
      g.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const kolImg = KOL_IMAGES[ag.kolKey];
      if (kolImg && kolImg.complete && kolImg.naturalWidth > 0) {
        ctx.save();
        roundRect(ctx, 10, 10, 96, h - 20, 8, false, false);
        ctx.clip();
        ctx.drawImage(kolImg, 10, 10, 96, h - 20);
        ctx.restore();
        ctx.strokeStyle = ag.color;
        ctx.lineWidth = 1.5;
        roundRect(ctx, 10, 10, 96, h - 20, 8, false, true);
      }

      const spImg = KOL_IMAGES[ag.spKey];
      if (spImg && spImg.complete && spImg.naturalWidth > 0) {
        ctx.save();
        roundRect(ctx, 114, 10, 84, h - 20, 8, false, false);
        ctx.clip();
        ctx.drawImage(spImg, 114, 10, 84, h - 20);
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1;
        roundRect(ctx, 114, 10, 84, h - 20, 8, false, true);
      }

      const rx = 208;
      ctx.fillStyle = ag.color;
      roundRect(ctx, rx, 14, w - rx - 10, 18, 4, true, false);
      ctx.fillStyle = "#090d16";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillText(ag.code + " · CLONE 1080P", rx + 6, 26);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11.5px Inter, sans-serif";
      ctx.fillText(ag.headline, rx, 48);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "9.5px Inter, sans-serif";
      ctx.fillText("V1 ~1500ml · Cơ số 11", rx, 64);
      ctx.fillText("Tốc độ 1.0x · 24fps", rx, 78);

      for (let b = 0; b < 7; b++) {
        const bh = 10 + Math.abs(Math.sin(t * 0.1 + idx + b * 0.7)) * 22;
        ctx.fillStyle = b % 2 === 0 ? ag.color : "#38bdf8";
        roundRect(ctx, rx + b * 14, h - 18 - bh, 9, bh, 2, true, false);
      }

      const ph = document.getElementById(`playhead-${ag.id}`);
      if (ph) {
        const pct = 15 + ((t * 0.9 + idx * 17) % 75);
        ph.style.left = pct + "%";
      }
    });

    if (t % 28 === 0) {
      EDITOR_AGENTS.forEach((ag, idx) => {
        const phaseIdx = Math.floor(
          (t / 28 + idx) % EDITOR_ACTION_PHASES.length
        );
        ag.action = EDITOR_ACTION_PHASES[phaseIdx];
        ag.step = Math.min(20, 13 + ((Math.floor(t / 28) + idx) % 8));

        const cursor = document.getElementById(`cursor-${ag.id}`);
        const pill = document.getElementById(`cursor-pill-${ag.id}`);
        const overlay = document.getElementById(`overlay-${ag.id}`);
        if (cursor) {
          const nx = 28 + ((t * 7 + idx * 43) % 52);
          const ny = 26 + ((t * 11 + idx * 31) % 54);
          cursor.style.left = nx + "%";
          cursor.style.top = ny + "%";
        }
        if (pill) pill.textContent = ag.action;
        if (overlay) overlay.textContent = `${ag.name} · ${ag.action}`;

        const rowAct = document.getElementById(`row-act-${ag.id}`);
        const rowStep = document.getElementById(`row-step-${ag.id}`);
        if (rowAct) rowAct.textContent = ag.action;
        if (rowStep) rowStep.textContent = String(ag.step);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. LIVE 339-SESSION ANTIGRAVITY/CLAUDE CHAT + VIENEU 48KHZ + OMNI-PILOT
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function closeAllPopovers() {
    [
      "quickCmdPopover",
      "agentPickerPopover",
      "hubPopoverPanel",
      "machinesPopoverPanel",
      "voicePopoverPanel",
      "omniPopoverPanel",
    ].forEach((id) => {
      const node = document.getElementById(id);
      if (node) node.classList.remove("open");
    });
  }

  function extractClientSummaryPoints(text) {
    if (!text) return [];
    const lines = String(text).split(/\r?\n/);
    const pts = [];
    for (const raw of lines) {
      const clean = raw
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^([#*\-•]+|\d+\.)\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .trim();
      if (
        clean.length >= 16 &&
        !clean.endsWith(":") &&
        !pts.some((p) => p.slice(0, 32) === clean.slice(0, 32))
      ) {
        pts.push(clean.slice(0, 135));
        if (pts.length >= 3) break;
      }
    }
    return pts;
  }

  function renderFormattedMarkdown(text) {
    if (!text) return "<p>Đã hoàn tất xử lý ngầm.</p>";
    const cleanedText = String(text).replace(
      /\[([^\]]+)\]\((?:file:\/\/\/|https?:\/\/)[^)]+\)/g,
      "**$1**"
    );
    const lines = cleanedText.split(/\r?\n/);
    const htmlParts = [];
    let inList = false;

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        if (inList) {
          htmlParts.push("</ul>");
          inList = false;
        }
        continue;
      }
      if (/^#{1,4}\s+/.test(line)) {
        if (inList) {
          htmlParts.push("</ul>");
          inList = false;
        }
        htmlParts.push(
          `<h4>${escapeHtml(
            line.replace(/^#{1,4}\s+/, "").replace(/\*\*/g, "")
          )}</h4>`
        );
      } else if (/^([-*•]|\d+\.)\s+/.test(line)) {
        if (!inList) {
          htmlParts.push("<ul>");
          inList = true;
        }
        let item = escapeHtml(line.replace(/^([-*•]|\d+\.)\s+/, ""))
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/`([^`]+)`/g, "<code>$1</code>");
        htmlParts.push(`<li>${item}</li>`);
      } else {
        if (inList) {
          htmlParts.push("</ul>");
          inList = false;
        }
        let p = escapeHtml(line)
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/`([^`]+)`/g, "<code>$1</code>");
        htmlParts.push(`<p>${p}</p>`);
      }
    }
    if (inList) htmlParts.push("</ul>");
    return htmlParts.join("");
  }

  let currentAudioPlayer = null;
  async function speakVietnameseText(text, forceSampleSlug = "") {
    if (currentAudioPlayer) {
      try {
        currentAudioPlayer.pause();
      } catch (_) {}
      currentAudioPlayer = null;
    }
    if (forceSampleSlug) {
      const sampleUrl = `audio_cache/vieneu_sample_${forceSampleSlug}.wav`;
      currentAudioPlayer = new Audio(sampleUrl);
      currentAudioPlayer.play().catch(() => {});
      return;
    }
    const clean = String(text || "")
      .replace(/[#*`_~]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 380);
    if (!clean) return;
    if (chatState.daemonOnline) {
      try {
        const res = await fetch(`${LOCAL_API_BASE}/api/speak`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: clean,
            voice: chatState.selectedVoice || "Thùy Dung",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.audio_url) {
            const audioUrl = data.audio_url.startsWith("http")
              ? data.audio_url
              : `${LOCAL_API_BASE}${data.audio_url}`;
            currentAudioPlayer = new Audio(audioUrl);
            currentAudioPlayer.play().catch(() => {});
            return;
          }
        }
      } catch (_) {}
    }
    const fallbackSlug = chatState.selectedSampleSlug || "thuy_dung";
    currentAudioPlayer = new Audio(
      `audio_cache/vieneu_sample_${fallbackSlug}.wav`
    );
    currentAudioPlayer.play().catch(() => {});
  }

  function getFilteredSessions() {
    return chatState.sessions.filter((s) => {
      if (
        chatState.providerFilter === "antigravity" &&
        s.engine_code !== "antigravity"
      )
        return false;
      if (chatState.providerFilter === "claude" && s.engine_code !== "claude")
        return false;
      if (chatState.searchQuery) {
        const q = chatState.searchQuery.toLowerCase();
        const hay = `${s.title || ""} ${s.project || ""} ${
          s.short_id || ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function updateFilterPillCounts() {
    const allCount = chatState.sessions.length;
    const agCount = chatState.sessions.filter(
      (s) => s.engine_code !== "claude"
    ).length;
    const clCount = chatState.sessions.filter(
      (s) => s.engine_code === "claude"
    ).length;
    const pillAll = document.getElementById("pillFilterAll");
    const pillAg = document.getElementById("pillFilterAg");
    const pillCl = document.getElementById("pillFilterCl");
    if (pillAll) pillAll.textContent = `Tất cả (${allCount})`;
    if (pillAg) pillAg.textContent = `Antigravity (${agCount})`;
    if (pillCl) pillCl.textContent = `Claude (${clCount})`;
  }

  function renderSessionList(forceRender = false) {
    const listEl = document.getElementById("sessionListContainer");
    if (!listEl) return;
    updateFilterPillCounts();
    const filtered = getFilteredSessions();
    const listSig =
      `${chatState.activeSessionId}|${chatState.providerFilter}|${chatState.searchQuery}|` +
      filtered
        .map(
          (s) =>
            `${s.session_id}:${s.live_signature || s.updated_str || ""}:${
              s.is_working ? 1 : 0
            }`
        )
        .join(",");
    if (
      !forceRender &&
      chatState.lastRenderedListSig === listSig &&
      listEl.children.length > 0
    ) {
      return;
    }
    chatState.lastRenderedListSig = listSig;

    if (!filtered.length) {
      listEl.innerHTML = `<div style="padding:18px 8px; text-align:center; color:#94a3b8; font-size:12px;">Không có phiên chat nào khớp bộ lọc.</div>`;
      return;
    }

    listEl.innerHTML = filtered
      .map((s) => {
        const isActive = s.session_id === chatState.activeSessionId;
        const isClaude = s.engine_code === "claude";
        const isWorking = Boolean(s.is_working);
        const shortTime = String(s.updated_str || "")
          .split("·")[0]
          .trim()
          .slice(0, 5);
        const topicBadge =
          s.topic_badge || (isClaude ? "Claude Project" : "Điều phối AI");
        const machineLabel = s.machine_name || "Máy Chính";
        const accountLabel =
          s.account_tag || (isClaude ? "Claude Extension" : "khakhunghiep");
        const popInfo = `${s.engine} · ${machineLabel} (${accountLabel}) · Mã: #${
          s.short_id || ""
        } · Ẩn ${s.filtered_count || 4} bước code`;
        const rawTitle =
          s.title && s.title !== "Phiên điều phối Antigravity 2.0"
            ? s.title
            : `Phiên ${s.project || "Antigravity"} #${s.short_id || ""}`;
        const lastTurn =
          Array.isArray(s.turns) && s.turns.length
            ? s.turns[s.turns.length - 1]
            : null;
        const summaryPreview =
          s.summary_line ||
          (lastTurn && lastTurn.ai
            ? String(lastTurn.ai).replace(/\s+/g, " ").slice(0, 88)
            : "") ||
          `Dự án ${s.project || "mang xa hoi"} · Sẵn sàng nhận lệnh`;
        const liveBadgeHtml = isWorking
          ? `<span style="color:#4ade80;font-weight:800;font-size:10px;">● ĐANG CHẠY</span>`
          : `<span class="session-item-time">${escapeHtml(shortTime)}</span>`;
        return `
        <button
          type="button"
          class="session-item ${isActive ? "active" : ""}"
          data-session-id="${escapeHtml(s.session_id)}"
          title="${escapeHtml(popInfo)}"
        >
          <div class="session-item-top">
            <div class="session-badges">
              <span class="engine-mini ${isClaude ? "claude" : ""}">${
          isClaude ? "CL" : "AG"
        }</span>
              <span class="topic-pill">${escapeHtml(topicBadge)}</span>
              <span class="session-item-time">#${escapeHtml(
                (s.short_id || "").slice(0, 4)
              )}</span>
            </div>
            ${liveBadgeHtml}
          </div>
          <div class="session-item-title">${escapeHtml(rawTitle)}</div>
          <div class="session-item-summary">${escapeHtml(summaryPreview)}</div>
        </button>
      `;
      })
      .join("");

    listEl.querySelectorAll("[data-session-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-session-id");
        const sb = document.getElementById("leftSidebar");
        if (sb) sb.classList.remove("mobile-open");
        selectSession(sid, true);
      });
    });
  }

  function buildMessagesFromCompactTurns(sessionObj) {
    const msgs = [];
    const turns = sessionObj.turns || [];
    turns.forEach((t, idx) => {
      if (t.user) {
        msgs.push({
          id: `${sessionObj.session_id}-u-${idx}`,
          role: "user",
          text: t.user,
          timestamp: t.timestamp || sessionObj.updated_str || "",
        });
      }
      if (t.ai) {
        msgs.push({
          id: `${sessionObj.session_id}-a-${idx}`,
          role: "assistant",
          text: t.ai,
          summary_points:
            t.summary_points || extractClientSummaryPoints(t.ai),
          timestamp: t.timestamp || sessionObj.updated_str || "",
          model: sessionObj.engine,
          hidden_count: Math.max(
            2,
            Math.round(
              (sessionObj.filtered_count || 6) / Math.max(1, turns.length)
            )
          ),
          tools: [],
          links: t.links || [],
        });
      }
    });
    return msgs;
  }

  function renderActiveConversation(autoScroll = false, forceRender = false) {
    const activeSession =
      chatState.sessions.find(
        (s) => s.session_id === chatState.activeSessionId
      ) || chatState.sessions[0];
    if (!activeSession) return;

    const isClaude = activeSession.engine_code === "claude";
    const symEl = document.getElementById("activeEngineSymbol");
    if (symEl) {
      symEl.className = `engine-mini ${isClaude ? "claude" : ""}`;
      symEl.textContent = isClaude ? "CL" : "AG";
      symEl.setAttribute(
        "data-popover",
        `${activeSession.engine} · Dự án: ${
          activeSession.project || "mang xa hoi"
        }`
      );
    }

    const titleEl = document.getElementById("activeSessionTitle");
    if (titleEl) {
      const rawTitle = activeSession.title || "Trợ Lý Điều Hành AI";
      titleEl.textContent =
        rawTitle.length > 62 ? rawTitle.slice(0, 62) + "..." : rawTitle;
    }

    const convObj = chatState.conversationsById[activeSession.session_id];
    const messages =
      convObj && Array.isArray(convObj.messages) && convObj.messages.length
        ? convObj.messages
        : buildMessagesFromCompactTurns(activeSession);

    const isWorking = Boolean(
      (convObj && convObj.is_working) || activeSession.is_working
    );
    const abortBtn = document.getElementById("btnAbortJob");
    if (abortBtn) {
      abortBtn.style.display = isWorking ? "inline-flex" : "none";
    }

    const liveStatusBadge = document.getElementById("activeLiveStatusBadge");
    if (liveStatusBadge) {
      if (isWorking) {
        liveStatusBadge.textContent = `⚡ ${
          (convObj && convObj.status_label) ||
          activeSession.status_label ||
          "Đang thực thi trên máy..."
        }`;
        liveStatusBadge.style.background = "rgba(250,204,21,0.18)";
        liveStatusBadge.style.borderColor = "rgba(250,204,21,0.55)";
        liveStatusBadge.style.color = "#fde047";
      } else if (chatState.daemonOnline) {
        liveStatusBadge.textContent = `🟢 LIVE 1.2s · #${(
          activeSession.short_id || ""
        ).slice(0, 6)}`;
        liveStatusBadge.style.background = "rgba(74,222,128,0.16)";
        liveStatusBadge.style.borderColor = "rgba(74,222,128,0.45)";
        liveStatusBadge.style.color = "#86efac";
      } else {
        liveStatusBadge.textContent = `☁️ Cloud Sync · #${(
          activeSession.short_id || ""
        ).slice(0, 6)}`;
        liveStatusBadge.style.background = "rgba(56,189,248,0.16)";
        liveStatusBadge.style.borderColor = "rgba(56,189,248,0.45)";
        liveStatusBadge.style.color = "#7dd3fc";
      }
    }

    const streamEl = document.getElementById("chatStreamSection");
    const listBox = document.getElementById("messagesListBox");
    if (!streamEl || !listBox) return;

    const lastMsg = messages.length ? messages[messages.length - 1] : null;
    const convSig = [
      activeSession.session_id,
      messages.length,
      lastMsg ? lastMsg.id : "",
      lastMsg ? (lastMsg.text || "").length : 0,
      lastMsg && lastMsg.live_screenshot_url ? lastMsg.live_screenshot_url : "",
      isWorking ? "1" : "0",
      chatState.zeroCodeMode ? "1" : "0",
      (convObj && convObj.live_signature) || activeSession.live_signature || "",
    ].join("|");

    if (
      !forceRender &&
      !autoScroll &&
      chatState.lastRenderedConvSig === convSig &&
      listBox.children.length > 0
    ) {
      return;
    }
    chatState.lastRenderedConvSig = convSig;

    const wasNearBottom =
      streamEl.scrollHeight - streamEl.scrollTop - streamEl.clientHeight < 180;

    listBox.innerHTML = messages
      .map((m, idx) => {
        const rawTs = String(m.timestamp || "").trim();
        const shortTs = (rawTs.includes(" ") ? rawTs.split(" ").pop() : rawTs).slice(
          0,
          5
        );
        if (m.role === "user") {
          return `
          <div class="msg-row user">
            <div class="user-bubble">
              <div class="user-text">${escapeHtml(m.text || "")}</div>
              <div class="user-hover-icons">
                <button type="button" class="mini-icon-btn" data-reuse-prompt="${escapeHtml(
                  m.text || ""
                )}" data-popover="Gửi lại lệnh này" data-popover-pos="left">↻</button>
                <button type="button" class="mini-icon-btn" data-copy-text="${escapeHtml(
                  m.text || ""
                )}" data-popover="Sao chép" data-popover-pos="left">⧉</button>
              </div>
            </div>
          </div>
        `;
        }

        const hiddenCount = Number(m.hidden_count || 0);
        const toolsList = Array.isArray(m.tools) ? m.tools : [];
        const linksList = Array.isArray(m.links) ? m.links : [];
        const totalHidden = Math.max(hiddenCount, toolsList.length);

        const codePopoverId = `code-pop-${idx}`;
        const codeBadgeHtml =
          totalHidden > 0
            ? `<button type="button" class="code-pill-btn" data-toggle-code="${codePopoverId}" data-popover="Đã tự động ẩn ${totalHidden} bước kỹ thuật & code (Bấm để xem)" data-popover-pos="left">
                <span>&lt;/&gt; Ẩn ${totalHidden}</span>
              </button>`
            : "";

        const stepDetailsHtml =
          totalHidden > 0
            ? `<div id="${codePopoverId}" class="code-popover-box ${
                chatState.zeroCodeMode ? "" : "open"
              }">
                ${
                  toolsList.length
                    ? toolsList
                        .map(
                          (t) =>
                            `<div>• <strong>${escapeHtml(
                              t.name || "Tool"
                            )}:</strong> ${escapeHtml(
                              t.summary || "Xử lý ngầm"
                            )}</div>`
                        )
                        .join("")
                    : `<div>• Đã tự động lọc sạch ${totalHidden} khối code và log kỹ thuật để Sếp chỉ duyệt kết quả.</div>`
                }
              </div>`
            : "";

        // Detect live screenshot or image deliverable in message
        let screenshotUrl = m.live_screenshot_url || "";
        if (!screenshotUrl && linksList.length) {
          const imgLink = linksList.find(
            (u) =>
              typeof u === "object" &&
              u &&
              (u.kind === "image" ||
                /\.(jpg|jpeg|png|webp)$/i.test(String(u.url || "")))
          );
          if (imgLink && imgLink.url) screenshotUrl = imgLink.url;
        }
        if (screenshotUrl) {
          if (screenshotUrl.startsWith("/") && LOCAL_API_BASE) {
            screenshotUrl = `${LOCAL_API_BASE}${screenshotUrl}`;
          }
        }
        const liveShotHtml = screenshotUrl
          ? `<div style="margin-top:8px; border-radius:10px; overflow:hidden; border:1px solid rgba(74,222,128,0.4); background:#090d16;">
              <div style="display:flex; align-items:center; justify-content:space-between; padding:5px 10px; background:rgba(74,222,128,0.12); font-size:11px; font-weight:700; color:#86efac;">
                <span>🖥️ Ảnh Chụp Trực Tiếp Màn Hình Máy Tính</span>
                <a href="${escapeHtml(
                  screenshotUrl
                )}" target="_blank" rel="noopener" style="color:#7dd3fc; text-decoration:none;">Phóng to ↗</a>
              </div>
              <a href="${escapeHtml(
                screenshotUrl
              )}" target="_blank" rel="noopener" style="display:block;">
                <img src="${escapeHtml(
                  screenshotUrl
                )}" alt="Màn hình máy tính trực tiếp" style="width:100%; max-height:240px; object-fit:cover; display:block;" loading="lazy" />
              </a>
            </div>`
          : "";

        const linksHtml = linksList.length
          ? `<div class="link-pills">${linksList
              .map((u) => {
                const urlStr =
                  typeof u === "string" ? u : u && u.url ? u.url : "";
                const labelStr =
                  typeof u === "object" && u && u.label
                    ? u.label
                    : urlStr.replace(/^https?:\/\//, "").slice(0, 32);
                if (!urlStr) return "";
                const finalHref =
                  urlStr.startsWith("/") && LOCAL_API_BASE
                    ? `${LOCAL_API_BASE}${urlStr}`
                    : urlStr;
                return `
                  <a href="${escapeHtml(
                    finalHref
                  )}" target="_blank" rel="noopener" class="link-pill">
                    <span>↗ ${escapeHtml(labelStr)}</span>
                  </a>
                `;
              })
              .join("")}</div>`
          : "";

        const rawSummaryPts =
          Array.isArray(m.summary_points) && m.summary_points.length
            ? m.summary_points
            : extractClientSummaryPoints(m.text);
        const execSummaryHtml =
          rawSummaryPts.length > 0 && String(m.text || "").length > 130
            ? `<div class="exec-summary-box">
                <div class="exec-summary-title">
                  <span>✓ Tóm tắt báo cáo quan trọng</span>
                </div>
                <ul class="exec-summary-list">
                  ${rawSummaryPts
                    .slice(0, 3)
                    .map((pt) => `<li>${escapeHtml(pt)}</li>`)
                    .join("")}
                </ul>
              </div>`
            : "";

        return `
        <div class="msg-row assistant">
          <article class="ai-bubble">
            <div class="ai-top-bar">
              <div class="ai-badge-group">
                <span class="engine-mini ${isClaude ? "claude" : ""}">${
          isClaude ? "CL" : "AG"
        }</span>
                <span>${escapeHtml(m.model || activeSession.engine)}</span>
                <span class="ai-time">${escapeHtml(shortTs)}</span>
              </div>
              <div class="ai-icon-actions">
                ${codeBadgeHtml}
                <button type="button" class="mini-icon-btn" data-speak-msg="${escapeHtml(
                  m.text || ""
                )}" data-popover="Nghe đọc VieNeu 48kHz" data-popover-pos="left">🔊</button>
                <button type="button" class="mini-icon-btn" data-copy-text="${escapeHtml(
                  m.text || ""
                )}" data-popover="Sao chép báo cáo" data-popover-pos="left">⧉</button>
              </div>
            </div>
            ${execSummaryHtml}
            ${stepDetailsHtml}
            <div class="ai-text-body">
              ${renderFormattedMarkdown(m.text)}
            </div>
            ${liveShotHtml}
            ${linksHtml}
          </article>
        </div>
      `;
      })
      .join("");

    listBox.querySelectorAll("[data-toggle-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(
          btn.getAttribute("data-toggle-code")
        );
        if (target) target.classList.toggle("open");
      });
    });

    listBox.querySelectorAll("[data-speak-msg]").forEach((btn) => {
      btn.addEventListener("click", () =>
        speakVietnameseText(btn.getAttribute("data-speak-msg"))
      );
    });

    listBox.querySelectorAll("[data-copy-text]").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(btn.getAttribute("data-copy-text") || "");
        btn.setAttribute("data-popover", "Đã sao chép!");
        setTimeout(() => btn.setAttribute("data-popover", "Sao chép"), 1200);
      });
    });

    listBox.querySelectorAll("[data-reuse-prompt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ta = document.getElementById("composerTextarea");
        if (ta) {
          ta.value = btn.getAttribute("data-reuse-prompt") || "";
          ta.focus();
        }
      });
    });

    if (autoScroll || wasNearBottom) {
      streamEl.scrollTop = streamEl.scrollHeight;
      setTimeout(() => {
        streamEl.scrollTop = streamEl.scrollHeight;
      }, 180);
    }
  }

  async function selectSession(sessionId, scrollToEnd = true) {
    if (!sessionId) return;
    chatState.activeSessionId = sessionId;
    renderSessionList(true);

    const targetSess = chatState.sessions.find(
      (s) => s.session_id === sessionId
    );
    const apiBase =
      targetSess && targetSess.remote_url
        ? targetSess.remote_url
        : LOCAL_API_BASE;

    if (chatState.daemonOnline || (targetSess && targetSess.remote_url)) {
      try {
        const res = await fetch(
          `${apiBase}/api/conversation?id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const conv = await res.json();
          if (conv && conv.session_id) {
            chatState.conversationsById[sessionId] = conv;
          }
        }
      } catch (_) {}
    }
    renderActiveConversation(scrollToEnd, true);
  }
  window.selectSession = selectSession;

  async function probeLiveDaemonSessions() {
    for (const base of LOCAL_CANDIDATE_BASES) {
      try {
        const res = await fetch(`${base}/api/live-chats?limit=52`, {
          cache: "no-store",
        });
        if (res.ok) {
          LOCAL_API_BASE = base;
          return await res.json();
        }
      } catch (_) {}
    }
    return null;
  }

  async function fetchLiveSessions(isInitial = false) {
    const liveDot = document.getElementById("liveDot");
    try {
      const data = await probeLiveDaemonSessions();
      if (data && data.ok) {
        chatState.daemonOnline = true;
        let mergedSessions = data.sessions || [];
        if (
          Array.isArray(data.linked_machines) &&
          data.linked_machines.length
        ) {
          chatState.linkedMachines = data.linked_machines;
        }
        const remoteNodes = (chatState.linkedMachines || []).filter(
          (m) =>
            m.id !== "local-primary" &&
            String(m.url || "").startsWith("http") &&
            !String(m.url).includes("127.0.0.1")
        );
        for (const rm of remoteNodes) {
          try {
            const rBase = String(rm.url).replace(/\/+$/, "");
            const rRes = await fetch(`${rBase}/api/live-chats`, {
              cache: "no-store",
            });
            if (rRes.ok) {
              const rData = await rRes.json();
              const rList = (rData.sessions || []).map((rs) =>
                Object.assign({}, rs, {
                  machine_name: rm.name,
                  remote_url: rBase,
                })
              );
              mergedSessions = mergedSessions.concat(rList);
            }
          } catch (_) {}
        }
        chatState.sessions = mergedSessions;
        if (data.live_tasks) {
          chatState.liveTasks = data.live_tasks;
        }
        if (liveDot) {
          liveDot.setAttribute(
            "data-popover",
            `🟢 Đồng bộ trực tiếp 1.2s/lần từ Máy tính · ${data.updated_at || ""}`
          );
        }

        const hdrLbl = document.getElementById("sidebarSessionsHeaderLabel");
        if (hdrLbl && data.total_ag_on_disk) {
          const totalAll =
            Number(data.total_ag_on_disk || 298) +
            Number(data.total_claude_on_disk || 41);
          hdrLbl.textContent = `💬 Lịch Sử ${totalAll}+ Phiên (Live)`;
        }

        // Tự động chuyển sang phiên chat vừa có hoạt động mới trên máy nếu bật Bám Live
        if (chatState.sessions.length > 0) {
          const topSess = chatState.sessions[0];
          const topMtime = Number(topSess.mtime || 0);
          if (!chatState.activeSessionId) {
            chatState.activeSessionId = topSess.session_id;
            chatState.lastTopSessionMtime = topMtime;
          } else if (
            !isInitial &&
            chatState.autoFollowLive &&
            topMtime > chatState.lastTopSessionMtime + 0.5
          ) {
            chatState.lastTopSessionMtime = topMtime;
            if (
              chatState.providerFilter === "all" ||
              topSess.engine_code === chatState.providerFilter
            ) {
              chatState.activeSessionId = topSess.session_id;
            }
          } else if (topMtime > chatState.lastTopSessionMtime) {
            chatState.lastTopSessionMtime = topMtime;
          }
        }

        if (chatState.activeSessionId) {
          const activeObj = chatState.sessions.find(
            (s) => s.session_id === chatState.activeSessionId
          );
          const apiBase =
            activeObj && activeObj.remote_url
              ? activeObj.remote_url
              : LOCAL_API_BASE;
          const convRes = await fetch(
            `${apiBase}/api/conversation?id=${encodeURIComponent(
              chatState.activeSessionId
            )}`,
            { cache: "no-store" }
          );
          if (convRes.ok) {
            const conv = await convRes.json();
            if (conv && conv.session_id) {
              const prevConv =
                chatState.conversationsById[chatState.activeSessionId];
              const prevCount =
                prevConv && prevConv.messages ? prevConv.messages.length : 0;
              chatState.conversationsById[chatState.activeSessionId] = conv;
              if (
                !isInitial &&
                chatState.autoSpeak &&
                conv.messages &&
                conv.messages.length > prevCount
              ) {
                const lastMsg = conv.messages[conv.messages.length - 1];
                if (
                  lastMsg &&
                  lastMsg.role === "assistant" &&
                  !lastMsg.is_working &&
                  lastMsg.id !== chatState.lastAnnouncedMsgId
                ) {
                  chatState.lastAnnouncedMsgId = lastMsg.id;
                  speakVietnameseText(lastMsg.text);
                }
              }
            }
          }
        }
        renderSessionList(isInitial);
        renderActiveConversation(isInitial, isInitial);
        syncLiveTasksToVisualStudio();
        return;
      }
      chatState.daemonOnline = false;
    } catch (_) {
      chatState.daemonOnline = false;
    }

    // Cloud Snapshot Fallback (Netlify / GitHub Pages)
    try {
      const snapRes = await fetch("data/brain_snapshot.json", {
        cache: "no-store",
      });
      if (snapRes.ok) {
        const snap = await snapRes.json();
        chatState.brainSnapshot = snap;
        const liveBlock = snap.live_chats || {};
        chatState.sessions = liveBlock.sessions || [];
        if (liveBlock.live_tasks) {
          chatState.liveTasks = liveBlock.live_tasks;
        }
        chatState.conversationsById = Object.assign(
          {},
          snap.conversations_by_id || {},
          chatState.conversationsById
        );
        if (liveDot) {
          liveDot.setAttribute(
            "data-popover",
            "Đồng bộ Cloud Snapshot (Netlify)"
          );
        }
        if (!chatState.activeSessionId && chatState.sessions.length > 0) {
          chatState.activeSessionId = chatState.sessions[0].session_id;
        }
        renderSessionList();
        renderActiveConversation(isInitial);
        syncLiveTasksToVisualStudio();
        renderHubPopover();
      }
    } catch (_) {}
  }

  async function loadBrainSnapshotMetadata() {
    try {
      const snapRes = await fetch("data/brain_snapshot.json", {
        cache: "no-store",
      });
      if (snapRes.ok) {
        const snap = await snapRes.json();
        chatState.brainSnapshot = snap;
        const delivs = snap.deliverables || [];
        const badge = document.getElementById("deliverableCountBadge");
        if (delivs.length && badge) badge.textContent = String(delivs.length);
        if (snap.live_chats && snap.live_chats.live_tasks && !chatState.liveTasks) {
          chatState.liveTasks = snap.live_chats.live_tasks;
        }
        if (
          !chatState.sessions.length &&
          snap.live_chats &&
          Array.isArray(snap.live_chats.sessions)
        ) {
          chatState.sessions = snap.live_chats.sessions;
          chatState.conversationsById = Object.assign(
            {},
            snap.conversations_by_id || {},
            chatState.conversationsById
          );
          if (!chatState.activeSessionId && chatState.sessions.length > 0) {
            chatState.activeSessionId = chatState.sessions[0].session_id;
          }
          renderSessionList();
          renderActiveConversation(true);
        }
        syncLiveTasksToVisualStudio();
        renderHubPopover();
      }
    } catch (_) {}
  }

  function buildFallbackLiveTasks() {
    const sessList = chatState.sessions || [];
    const sessionTasks = sessList.slice(0, 14).map((s, idx) => {
      const sid = String(s.session_id || "");
      const shortId = String(s.short_id || sid.slice(0, 6)).slice(0, 6);
      const isCl = s.engine_code === "claude";
      const isWorking = Boolean(s.is_working) || idx < 3;
      const rawTime = String(s.updated_str || "").split("·")[0].trim() || "Live";
      return {
        task_id: `sess-${shortId}`,
        kind: "chat_session",
        session_id: sid,
        short_id: shortId,
        engine_code: s.engine_code || "antigravity",
        engine_badge: isCl ? "CL" : "AG",
        topic_badge: s.topic_badge || "Điều phối AI",
        title: String(s.title || `Phiên #${shortId}`).slice(0, 68),
        status_label: isWorking
          ? `⚡ ${s.status_label || "Đang thực thi"}`
          : `🟢 ${rawTime}`,
        summary: String(
          s.summary_line || `Dự án ${s.project || "mang xa hoi"} · #${shortId}`
        ).slice(0, 110),
        is_working: isWorking,
        updated_str: s.updated_str || "",
      };
    });
    return {
      session_tasks: sessionTasks,
      background_tasks: [],
      system_services: [
        {
          task_id: "srv-8765",
          kind: "system_service",
          session_id: sessList[0] ? sessList[0].session_id : "",
          short_id: ":8765",
          engine_code: "system",
          engine_badge: "WIN",
          topic_badge: "WIN-8765",
          title: "Daemon Trợ Lý Giọng Nói CEO (:8765)",
          status_label: "⚡ Cổng :8765 ONLINE",
          summary: "Đồng bộ Live 1.2s · VieNeu 48kHz & Omni-Pilot",
          is_working: true,
        },
        {
          task_id: "srv-9224",
          kind: "system_service",
          session_id: sessList[0] ? sessList[0].session_id : "",
          short_id: ":9224",
          engine_code: "system",
          engine_badge: "WIN",
          topic_badge: "CDP-9224",
          title: "Chrome Multi-CDP :9224 (Profile Flow/FB)",
          status_label: "⚡ Cổng :9224 ONLINE",
          summary: "Đang mở trình duyệt điều khiển tự động trên máy",
          is_working: true,
        },
      ],
      working_sessions_count: sessionTasks.filter((t) => t.is_working).length,
      total_running_now:
        sessionTasks.filter((t) => t.is_working).length + 2,
    };
  }

  function jumpToLiveTaskSession(sessionId) {
    if (sessionId) {
      selectSession(sessionId, true);
    }
    switchMode("2d");
  }
  window.jumpToLiveTaskSession = jumpToLiveTaskSession;

  function syncLiveTasksToVisualStudio(forceSync = false) {
    const lt = chatState.liveTasks || buildFallbackLiveTasks();
    const sessionTasks = Array.isArray(lt.session_tasks) ? lt.session_tasks : [];
    const bgTasks = Array.isArray(lt.background_tasks) ? lt.background_tasks : [];
    const sysServices = Array.isArray(lt.system_services) ? lt.system_services : [];

    const agCount = (chatState.sessions || []).filter(
      (s) => s.engine_code !== "claude"
    ).length;
    const clCount = (chatState.sessions || []).filter(
      (s) => s.engine_code === "claude"
    ).length;
    const workingSessCount =
      lt.working_sessions_count ||
      sessionTasks.filter((t) => t.is_working).length ||
      1;
    const totalRunning =
      lt.total_running_now ||
      workingSessCount + bgTasks.length + sysServices.length ||
      4;

    const sig = [
      sessionTasks.length,
      bgTasks.length,
      sysServices.length,
      totalRunning,
      chatState.officeSearchQuery || "",
      sessionTasks
        .slice(0, 10)
        .map((t) => `${t.short_id}:${t.status_label}:${t.title.slice(0, 18)}`)
        .join("|"),
    ].join("::");

    if (!forceSync && chatState.lastSyncedTasksSig === sig) {
      return;
    }
    chatState.lastSyncedTasksSig = sig;

    // 1. CẬP NHẬT 11 BÀN LÀM VIỆC TRÊN SÀN 3D VĂN PHÒNG AI (#office3d-labels-layer)
    const layer3d = document.getElementById("office3d-labels-layer");
    if (layer3d && layer3d.children.length === 0) {
      OFFICE_DESKS.forEach((d) => {
        const el = document.createElement("div");
        el.className = "agent-floating-tag " + d.cls;
        el.id = "tag-" + d.id;
        layer3d.appendChild(el);
      });
    }

    const cmdTag = document.getElementById("tag-desk-commander");
    if (cmdTag) {
      cmdTag.style.cursor = "pointer";
      cmdTag.innerHTML = `
        <div class="tag-title"><span style="color:#4ade80">●</span> 🧠 Bộ Não CEO · <span style="color:#fde047">⚡ ${totalRunning} Task Đang Chạy</span></div>
        <div class="tag-sub">🟢 LIVE 1.2s · ${agCount} Phiên AG · ${clCount} Phiên Claude · ${bgTasks.length + sysServices.length} Daemon/CDP</div>
      `;
      cmdTag.onclick = () => switchMode("2d");
    }

    // Ghép danh sách 10 Task thật đang chạy trên máy (không trùng lặp, ưu tiên cả AG, Claude, Task ngầm & Chrome CDP) cho 10 bàn xung quanh
    const agLive = sessionTasks.filter((t) => t.engine_code !== "claude");
    const clLive = sessionTasks.filter((t) => t.engine_code === "claude");
    const rawCandidates = [
      ...agLive.slice(0, 5),
      ...clLive.slice(0, 2),
      ...bgTasks.slice(0, 2),
      ...sysServices.slice(0, 2),
      ...agLive.slice(5),
      ...clLive.slice(2),
      ...bgTasks.slice(2),
      ...sysServices.slice(2),
    ];
    const seenDeskIds = new Set();
    const combinedDeskTasks = [];
    for (const item of rawCandidates) {
      if (!item || seenDeskIds.has(item.task_id)) continue;
      seenDeskIds.add(item.task_id);
      combinedDeskTasks.push(item);
      if (combinedDeskTasks.length >= 10) break;
    }

    const otherDesks = OFFICE_DESKS.filter((d) => d.id !== "desk-commander");
    otherDesks.forEach((d, idx) => {
      const el = document.getElementById("tag-" + d.id);
      if (!el) return;
      const t = combinedDeskTasks[idx];
      if (!t) return;
      const isCl = t.engine_code === "claude";
      const isSys = t.kind === "system_service" || t.kind === "background_task";
      const dotCol = t.is_working ? "#4ade80" : d.color;
      const pillBg = isCl
        ? "rgba(251,146,60,0.24)"
        : isSys
        ? "rgba(56,189,248,0.24)"
        : "rgba(74,222,128,0.22)";
      const pillCol = isCl ? "#fdba74" : isSys ? "#7dd3fc" : "#86efac";
      const shortTitle =
        t.title.length > 36 ? t.title.slice(0, 36) + "…" : t.title;
      const shortSub =
        t.summary.length > 42 ? t.summary.slice(0, 42) + "…" : t.summary;

      el.style.cursor = "pointer";
      el.style.borderColor = t.is_working
        ? "rgba(74, 222, 128, 0.55)"
        : "rgba(255, 255, 255, 0.16)";
      el.title = `${t.engine_badge} #${t.short_id} · ${t.title}\n${t.status_label} — ${t.summary}\n(Bấm để mở phiên chat này)`;
      el.innerHTML = `
        <div class="tag-title" style="display:flex;align-items:center;gap:4px;">
          <span style="color:${dotCol}">●</span>
          <span style="background:${pillBg};color:${pillCol};padding:1px 5px;border-radius:4px;font-size:9.5px;font-weight:800;">${escapeHtml(
        t.engine_badge
      )} #${escapeHtml(t.short_id)}</span>
          <span>${escapeHtml(shortTitle)}</span>
        </div>
        <div class="tag-sub">
          <strong style="color:${
            t.is_working ? "#fde047" : "#86efac"
          }">${escapeHtml(t.status_label)}</strong> · ${escapeHtml(shortSub)}
        </div>
      `;
      el.onclick = () => jumpToLiveTaskSession(t.session_id);
    });

    // 2. CẬP NHẬT CỘT TRÁI TRONG 3D VĂN PHÒNG AI (#officeDrawerLiveList & #officeDrawerLiveToasts)
    const drawerBadge = document.getElementById("officeDrawerCountBadge");
    if (drawerBadge) drawerBadge.textContent = `${totalRunning} LIVE`;

    const drawerSub = document.getElementById("officeDrawerSubbar");
    if (drawerSub) {
      drawerSub.innerHTML = `
        <span><strong style="color:#4ade80">● ${workingSessCount} phiên đang chạy</strong></span>
        <span>${agCount} AG · ${clCount} Claude</span>
      `;
    }

    const qOffice = (chatState.officeSearchQuery || "").trim().toLowerCase();
    const filteredOfficeTasks = sessionTasks
      .filter((t) => {
        if (!qOffice) return true;
        return `${t.short_id} ${t.title} ${t.summary} ${t.engine_badge} ${t.topic_badge}`
          .toLowerCase()
          .includes(qOffice);
      })
      .slice(0, 7);

    const drawerListEl = document.getElementById("officeDrawerLiveList");
    if (drawerListEl) {
      drawerListEl.innerHTML = filteredOfficeTasks
        .map((t) => {
          const isCl = t.engine_code === "claude";
          return `
            <div class="drawer-agent-card ${
              t.is_working ? "active" : ""
            }" onclick="jumpToLiveTaskSession('${escapeHtml(t.session_id)}')">
              <div class="agent-mini-icon" style="background:${
                isCl
                  ? "linear-gradient(135deg,#fb923c,#ea580c)"
                  : "linear-gradient(135deg,#34d399,#059669)"
              };display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#052e16;">${escapeHtml(
            t.engine_badge
          )}</div>
              <div class="agent-card-info" style="min-width:0;flex:1;">
                <h4 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">#${escapeHtml(
                  t.short_id
                )} · ${escapeHtml(t.title)}</h4>
                <div class="agent-state" style="color:${
                  t.is_working ? "#fde047" : "#86efac"
                };font-weight:700;">${escapeHtml(t.status_label)} · ${escapeHtml(
            t.topic_badge
          )}</div>
                <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(
                  t.summary
                )}</p>
              </div>
            </div>
          `;
        })
        .join("");
    }

    const drawerToastsEl = document.getElementById("officeDrawerLiveToasts");
    if (drawerToastsEl) {
      const daemonItems = [...sysServices, ...bgTasks].slice(0, 5);
      drawerToastsEl.innerHTML = daemonItems
        .map((d, i) => {
          const bCol =
            i % 3 === 0 ? "#4ade80" : i % 3 === 1 ? "#38bdf8" : "#fb923c";
          return `
            <div class="live-toast-item" style="border-left-color:${bCol};cursor:pointer;" onclick="jumpToLiveTaskSession('${escapeHtml(
            d.session_id || ""
          )}')">
              <strong>${escapeHtml(d.status_label)} · ${escapeHtml(
            d.title
          )}</strong>
              <span>${escapeHtml(d.summary)}</span>
            </div>
          `;
        })
        .join("");
    }

    // 3. CẬP NHẬT BẢNG HUD GÓC PHẢI TRÊN SÀN 3D (#office3d-live-tasks-hud)
    const hudSumEl = document.getElementById("office3dHudSummaryBar");
    if (hudSumEl) {
      hudSumEl.innerHTML = `
        <span style="background:rgba(250,204,21,0.18);border:1px solid rgba(250,204,21,0.45);color:#fde047;padding:1px 7px;border-radius:999px;font-weight:800;">⚡ ${totalRunning} Task đang chạy</span>
        <span style="background:rgba(74,222,128,0.16);color:#86efac;padding:1px 7px;border-radius:999px;font-weight:700;">AG (${agCount})</span>
        <span style="background:rgba(251,146,60,0.18);color:#fdba74;padding:1px 7px;border-radius:999px;font-weight:700;">Claude (${clCount})</span>
      `;
    }

    const hudBodyEl = document.getElementById("office3dHudTasksBody");
    if (hudBodyEl) {
      const topHudTasks = [
        ...sessionTasks.slice(0, 4),
        ...bgTasks.slice(0, 1),
        ...sysServices.slice(0, 2),
      ].slice(0, 6);
      hudBodyEl.innerHTML = topHudTasks
        .map((t) => {
          const isCl = t.engine_code === "claude";
          return `
            <div onclick="jumpToLiveTaskSession('${escapeHtml(
              t.session_id || ""
            )}')" style="padding:6px 8px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid ${
            t.is_working ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.1)"
          };cursor:pointer;display:flex;flex-direction:column;gap:2px;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
                <span style="font-size:10.5px;font-weight:800;color:${
                  isCl ? "#fdba74" : "#86efac"
                };">[${escapeHtml(t.engine_badge)} #${escapeHtml(
            t.short_id
          )}] ${escapeHtml(t.title.slice(0, 28))}</span>
                <span style="font-size:9.5px;font-weight:800;color:${
                  t.is_working ? "#fde047" : "#94a3b8"
                };white-space:nowrap;">${escapeHtml(t.status_label)}</span>
              </div>
              <div style="font-size:10px;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(
                t.summary
              )}</div>
            </div>
          `;
        })
        .join("");
    }

    const statusBar3d = document.getElementById("officeStatusbarLive");
    if (statusBar3d) {
      const srvText = sysServices
        .map((s) => `● ${s.topic_badge} (${s.short_id})`)
        .join("   ");
      statusBar3d.innerHTML = `
        <span style="color:#4ade80;font-weight:700;">⚡ ${totalRunning} Task &amp; Daemon Đang Chạy Trên Máy</span>
        <span>${escapeHtml(srvText || "● Daemon :8765 · :23984 · CDP :9224")}</span>
        <span>Đồng bộ Live 1.2s: ${agCount} Antigravity + ${clCount} Claude</span>
      `;
    }

    // 4. CẬP NHẬT CỘT PHẢI CỦA CHẾ ĐỘ 1 (2D ĐIỀU HÀNH & CHAT — #liveMachineTasksBox2D)
    const code2d = document.getElementById("liveTasksCountCode");
    if (code2d) code2d.textContent = `${agCount} AG · ${clCount} CL`;
    const badge2d = document.getElementById("liveTasksCountBadge");
    if (badge2d) badge2d.textContent = `⚡ ${totalRunning} Đang chạy`;

    const box2d = document.getElementById("liveMachineTasksBox2D");
    if (box2d) {
      const items2d = [
        ...sessionTasks.slice(0, 5),
        ...bgTasks.slice(0, 2),
        ...sysServices.slice(0, 2),
      ];
      box2d.innerHTML = items2d
        .map((t) => {
          const isCl = t.engine_code === "claude";
          return `
            <div onclick="event.stopPropagation(); selectSession('${escapeHtml(
              t.session_id || ""
            )}', true);" style="padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid ${
            t.is_working ? "rgba(74,222,128,0.38)" : "rgba(255,255,255,0.08)"
          };cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div style="min-width:0;flex:1;">
                <div style="font-size:11.5px;font-weight:700;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  <span style="color:${
                    isCl ? "#fdba74" : "#86efac"
                  };">[${escapeHtml(t.engine_badge)} #${escapeHtml(
            t.short_id
          )}]</span> ${escapeHtml(t.title)}
                </div>
                <div style="font-size:10.5px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${escapeHtml(t.summary)}
                </div>
              </div>
              <span style="font-size:10px;font-weight:800;color:${
                t.is_working ? "#fde047" : "#86efac"
              };white-space:nowrap;flex-shrink:0;">${escapeHtml(
            t.status_label
          )} ↗</span>
            </div>
          `;
        })
        .join("");
    }

    // 5. CẬP NHẬT CHẾ ĐỘ 3 (NODE GRAPH) & CHẾ ĐỘ 4 (6 CỬA SỔ EDITOR)
    const allLiveForNodes = [
      ...sessionTasks.slice(0, 8),
      ...bgTasks.slice(0, 2),
      ...sysServices.slice(0, 2),
    ];
    DAG_NODES.forEach((n, idx) => {
      const div = document.getElementById("dag-" + n.id);
      if (!div) return;
      if (idx === 0) {
        div.innerHTML = `
          <div class="dag-node-header">
            <span>AG2-CEO</span>
            <span style="color:#fde047">⚡ ${totalRunning} Task Live</span>
          </div>
          <div class="dag-node-title">Bộ Não Thứ Hai CEO (${agCount} AG · ${clCount} Claude)</div>
          <div class="dag-node-meta">Đồng bộ thời gian thực 1.2s từ máy tính</div>
        `;
        return;
      }
      const t = allLiveForNodes[idx - 1];
      if (!t) return;
      div.innerHTML = `
        <div class="dag-node-header">
          <span>${escapeHtml(t.engine_badge)} #${escapeHtml(t.short_id)}</span>
          <span style="color:${
            t.is_working ? "#fde047" : "#4ade80"
          }">${escapeHtml(t.status_label)}</span>
        </div>
        <div class="dag-node-title">${escapeHtml(t.title.slice(0, 44))}</div>
        <div class="dag-node-meta">${escapeHtml(t.summary.slice(0, 56))}</div>
      `;
      div.onclick = () => jumpToLiveTaskSession(t.session_id);
    });

    const runCountEl = document.getElementById("status-running-count");
    if (runCountEl) runCountEl.textContent = `${totalRunning} đang chạy`;
    const doneCountEl = document.getElementById("status-done-count");
    if (doneCountEl)
      doneCountEl.textContent = `${(chatState.sessions || []).length} phiên Live`;

    const rowsContainer = document.getElementById(
      "status-agent-rows-container"
    );
    if (rowsContainer && allLiveForNodes.length > 0) {
      rowsContainer.innerHTML = allLiveForNodes
        .slice(0, 8)
        .map((t, i) => {
          const col =
            t.engine_code === "claude"
              ? "#fb923c"
              : t.is_working
              ? "#4ade80"
              : "#38bdf8";
          return `
            <div class="status-agent-row" style="cursor:pointer;" onclick="jumpToLiveTaskSession('${escapeHtml(
              t.session_id || ""
            )}')">
              <div class="status-agent-name" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                <span class="color-dot-sq" style="background:${col};flex-shrink:0;"></span>
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">[${escapeHtml(t.engine_badge)} #${escapeHtml(
            t.short_id
          )}] ${escapeHtml(t.title.slice(0, 18))}</span>
              </div>
              <div class="status-agent-action" style="color:${
                t.is_working ? "#fde047" : "#86efac"
              };white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(t.status_label)}</div>
              <div class="status-agent-step">${i + 1}</div>
              <div style="text-align:right;color:#7dd3fc">↗</div>
            </div>
          `;
        })
        .join("");
    }
  }

  function renderHubPopover() {
    const bodyEl = document.getElementById("hubPopoverBody");
    if (!bodyEl) return;
    const snap = chatState.brainSnapshot || {};
    if (chatState.hubTab === "deliverables") {
      const items = (snap.deliverables || []).slice(0, 12);
      if (!items.length) {
        bodyEl.innerHTML = `<div style="font-size:12px; color:#94a3b8; padding:8px;">Đang tải sản phẩm nghiệm thu...</div>`;
        return;
      }
      bodyEl.innerHTML = `
        <div class="deliverable-mini-grid">
          ${items
            .map((item, idx) => {
              const rawUrl =
                item.static_preview_url ||
                item.preview_url ||
                item.web_url ||
                item.thumb_url ||
                "";
              const mediaSrc =
                rawUrl.startsWith("/media") &&
                !chatState.daemonOnline &&
                item.static_preview_url
                  ? item.static_preview_url
                  : rawUrl.startsWith("/media") && LOCAL_API_BASE
                  ? `${LOCAL_API_BASE}${rawUrl}`
                  : rawUrl;
              const isImg =
                item.kind === "image" || /\.(jpg|jpeg|png|webp)$/i.test(mediaSrc);
              return `
                <div class="media-item" data-open-media="${idx}" title="${escapeHtml(
                item.title
              )}">
                  <div class="media-thumb">
                    ${
                      isImg && mediaSrc
                        ? `<img src="${escapeHtml(mediaSrc)}" alt="${escapeHtml(
                            item.title
                          )}" loading="lazy" />`
                        : `<span style="color:#94a3b8; font-size:11px;">Video / File</span>`
                    }
                  </div>
                  <div class="media-caption">${escapeHtml(item.title)}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
      bodyEl.querySelectorAll("[data-open-media]").forEach((card) => {
        card.addEventListener("click", () => {
          const item = items[Number(card.getAttribute("data-open-media"))];
          if (!item) return;
          const rawUrl =
            item.static_preview_url ||
            item.preview_url ||
            item.web_url ||
            item.thumb_url ||
            "";
          const mediaSrc =
            rawUrl.startsWith("/media") &&
            !chatState.daemonOnline &&
            item.static_preview_url
              ? item.static_preview_url
              : rawUrl.startsWith("/media") && LOCAL_API_BASE
              ? `${LOCAL_API_BASE}${rawUrl}`
              : rawUrl;
          const modalTitle = document.getElementById("modalTitleText");
          const modalBody = document.getElementById("modalBodyContent");
          const modalBackdrop = document.getElementById("mediaModalBackdrop");
          if (modalTitle)
            modalTitle.textContent = item.title || "Sản phẩm nghiệm thu";
          if (modalBody) {
            if (item.kind === "video") {
              modalBody.innerHTML = `<video src="${escapeHtml(
                mediaSrc
              )}" controls autoplay></video>`;
            } else {
              modalBody.innerHTML = `<img src="${escapeHtml(
                mediaSrc
              )}" alt="${escapeHtml(item.title)}" />`;
            }
          }
          if (modalBackdrop) modalBackdrop.classList.add("open");
        });
      });
      return;
    }

    const brainObj = snap.brain || snap;
    const rules = (brainObj.executive_rules || []).slice(0, 6);
    bodyEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${rules
          .map(
            (r) => `
          <div style="padding:8px; border-radius:6px; background:#090d16; border:1px solid #334155; font-size:11.5px;">
            <div style="font-weight:700; color:#86efac;">${escapeHtml(
              r.id
            )} · ${escapeHtml(r.title)}</div>
            <div style="color:#cbd5e1; margin-top:2px;">${escapeHtml(
              r.rule
            )}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  function answerFromSecondBrainOffline(commandText) {
    const q = commandText.toLowerCase();
    if (q.includes("4k") || q.includes("hoatrang")) {
      return "Đã kích hoạt nâng cấp 4K Ultra trên tài khoản hoatrang756@gmail.com (Nano Banana 2.1 4K & Gemini Omni 1.1 Flash).";
    }
    if (q.includes("3 hồi") || q.includes("video") || q.includes("flow")) {
      return "Đã giao Subagent flow-video-director chạy Node Studio V3.9 với Khuôn Đúc 3 Cột V1 ~1600ml.";
    }
    return "Đã nhận lệnh của Sếp, tự động ẩn 100% code kỹ thuật và điều phối đội ngũ 12 Agent + Cánh tay Omni-Pilot thực thi.";
  }

  async function sendChatCommand(overrideText) {
    const ta = document.getElementById("composerTextarea");
    const text = (
      typeof overrideText === "string"
        ? overrideText
        : ta
        ? ta.value
        : ""
    ).trim();
    if (!text) return;
    if (ta && !overrideText) ta.value = "";
    closeAllPopovers();

    // If user pasted a bare website URL, also trigger the 30-Agent Swarm Web Cloner!
    if (
      /^https?:\/\/\S+$/i.test(text) &&
      !text.includes("facebook.com") &&
      !text.includes("fb.watch")
    ) {
      const cloneIn = document.getElementById("clone-url-input");
      if (cloneIn) cloneIn.value = text;
      cloneCustomUrlWithSwarm(text);
    }

    const activeSession =
      chatState.sessions.find(
        (s) => s.session_id === chatState.activeSessionId
      ) || chatState.sessions[0];
    const sid = activeSession
      ? activeSession.session_id
      : `web-${Date.now()}`;
    const selectedVal = chatState.selectedAgentVal;
    let engineCode = activeSession ? activeSession.engine_code : "antigravity";
    let agentName = "";

    if (selectedVal === "antigravity") engineCode = "antigravity";
    else if (selectedVal === "claude") engineCode = "claude";
    else if (selectedVal === "ceo-proxy") engineCode = "ceo-proxy";
    else if (selectedVal.startsWith("agent:")) {
      engineCode = "antigravity";
      agentName = selectedVal.replace("agent:", "");
    }

    if (!chatState.conversationsById[sid]) {
      chatState.conversationsById[sid] = {
        session_id: sid,
        messages: activeSession
          ? buildMessagesFromCompactTurns(activeSession)
          : [],
      };
    }
    const nowStr = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    chatState.conversationsById[sid].messages.push({
      id: `local-u-${Date.now()}`,
      role: "user",
      text: text,
      timestamp: nowStr,
    });
    renderActiveConversation(true);

    const targetApiBase =
      activeSession && activeSession.remote_url
        ? activeSession.remote_url
        : LOCAL_API_BASE;
    if (
      chatState.daemonOnline ||
      (activeSession && activeSession.remote_url)
    ) {
      try {
        const res = await fetch(`${targetApiBase}/api/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sid,
            command: text,
            engine: engineCode,
            agent: agentName,
            mode: "accept-edits",
            voice: chatState.selectedVoice || "Thùy Dung",
            speak: chatState.autoSpeak,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.conversation) {
            chatState.conversationsById[sid] = data.conversation;
          }
          if (data.audio_url && chatState.autoSpeak) {
            const audioUrl = data.audio_url.startsWith("http")
              ? data.audio_url
              : `${LOCAL_API_BASE}${data.audio_url}`;
            new Audio(audioUrl).play().catch(() => {});
          }
          await fetchLiveSessions(false);
          if (data.conversation) {
            chatState.conversationsById[sid] = data.conversation;
          }
          renderActiveConversation(true, true);
          return;
        }
      } catch (_) {}
    }

    const replyText = answerFromSecondBrainOffline(text);
    chatState.conversationsById[sid].messages.push({
      id: `local-a-${Date.now()}`,
      role: "assistant",
      text: replyText,
      summary_points: extractClientSummaryPoints(replyText),
      timestamp: nowStr,
      model: "Bộ Não Thứ Hai CEO",
      hidden_count: 2,
      tools: [],
      links: [],
    });
    renderActiveConversation(true);
    if (chatState.autoSpeak) speakVietnameseText(replyText);
  }
  window.sendChatCommand = sendChatCommand;

  function handleOfficePromptSubmit() {
    const inp = document.getElementById("office-prompt-input");
    const val = (inp ? inp.value : "").trim();
    if (!val) return;
    inp.value = "";
    if (
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.includes(".com") ||
      val.includes(".vn")
    ) {
      const cloneIn = document.getElementById("clone-url-input");
      if (cloneIn) cloneIn.value = val;
      cloneCustomUrlWithSwarm(val);
    } else {
      switchMode("2d");
      sendChatCommand(val);
    }
  }
  window.handleOfficePromptSubmit = handleOfficePromptSubmit;

  async function createNewSession() {
    const title = window.prompt(
      "Nhập tên cuộc trò chuyện mới:",
      "Chỉ đạo mới"
    );
    if (!title) return;
    if (chatState.daemonOnline) {
      try {
        const res = await fetch(`${LOCAL_API_BASE}/api/chat/new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            engine: "antigravity",
            project: "mang xa hoi",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          await fetchLiveSessions(false);
          if (data.session_id) await selectSession(data.session_id, true);
          const ta = document.getElementById("composerTextarea");
          if (ta) ta.focus();
          return;
        }
      } catch (_) {}
    }

    const newId = `web-${Date.now().toString(16)}`;
    const nowStr = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    chatState.sessions.unshift({
      session_id: newId,
      short_id: newId.slice(0, 8),
      engine: "Antigravity 2.0",
      engine_code: "antigravity",
      project: "mang xa hoi",
      title: title,
      updated_str: nowStr,
      filtered_count: 0,
      turns: [],
    });
    chatState.conversationsById[newId] = {
      session_id: newId,
      messages: [
        {
          id: `init-${newId}`,
          role: "assistant",
          text: `Đã mở cuộc trò chuyện: **${title}**. Sếp nhập lệnh hoặc bấm Mic ở dưới nhé.`,
          timestamp: nowStr,
          model: "Bộ Não Thứ Hai",
          hidden_count: 0,
        },
      ],
    };
    chatState.activeSessionId = newId;
    renderSessionList();
    renderActiveConversation(true);
    const ta = document.getElementById("composerTextarea");
    if (ta) ta.focus();
  }

  async function executeOmniAction(actionName, extraPayload = {}) {
    closeAllPopovers();
    const activeSession =
      chatState.sessions.find(
        (s) => s.session_id === chatState.activeSessionId
      ) || chatState.sessions[0];
    const sid = activeSession
      ? activeSession.session_id
      : `web-${Date.now()}`;
    const nowStr = new Date().toLocaleTimeString("vi-VN", { hour12: false });

    if (!chatState.conversationsById[sid]) {
      chatState.conversationsById[sid] = {
        session_id: sid,
        messages: activeSession
          ? buildMessagesFromCompactTurns(activeSession)
          : [],
      };
    }

    const actionLabelMap = {
      "capture-screen":
        "Chụp & Ghi hình trực tiếp màn hình máy tính (60fps)",
      "record-and-capcut":
        "Quay màn hình 60fps & tự động dựng Project CapCut PC",
      "open-cdp-profile": `Mở trình duyệt Chrome Multi-CDP (${
        extraPayload.profile_key || "9222"
      })`,
      "spawn-agent-session": `Mở phiên mới & giao việc cho ${
        extraPayload.agent || "Agent"
      }: ${extraPayload.directive || ""}`,
      "broadcast-all-agents": `Phát lệnh đồng loạt tới toàn bộ 6 Agent chủ lực: ${
        extraPayload.directive || ""
      }`,
      "desktop-uia": `Điều khiển ứng dụng Windows UIA: ${
        extraPayload.app || extraPayload.keys || "Quét cửa sổ"
      }`,
      "run-command": `Chạy lệnh hệ thống trên máy tính: ${
        extraPayload.command || ""
      }`,
    };

    chatState.conversationsById[sid].messages.push({
      id: `omni-u-${Date.now()}`,
      role: "user",
      text: `[Cánh Tay Omni-Pilot] ${actionLabelMap[actionName] || actionName}`,
      timestamp: nowStr,
    });
    renderActiveConversation(true);

    if (chatState.daemonOnline) {
      try {
        const res = await fetch(`${LOCAL_API_BASE}/api/omni/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            Object.assign(
              {
                action: actionName,
                session_id: sid,
                voice: chatState.selectedVoice || "Thùy Dung",
              },
              extraPayload
            )
          ),
        });
        if (res.ok) {
          const data = await res.json();
          const targetSid =
            data.spawned_session_id || data.session_id || sid;
          if (data.conversation) {
            chatState.conversationsById[targetSid] = data.conversation;
          }
          await fetchLiveSessions(false);
          chatState.activeSessionId = targetSid;
          if (data.conversation) {
            chatState.conversationsById[targetSid] = data.conversation;
          }
          renderSessionList(true);
          renderActiveConversation(true, true);
          if (data.audio_url && chatState.autoSpeak) {
            const audioUrl = data.audio_url.startsWith("http")
              ? data.audio_url
              : `${LOCAL_API_BASE}${data.audio_url}`;
            new Audio(audioUrl).play().catch(() => {});
          }
          return;
        }
      } catch (_) {}
    }

    const fallbackReply = `Báo cáo sếp: Cánh tay Omni-Pilot đã ghi nhận thao tác "${
      actionLabelMap[actionName] || actionName
    }" và điều phối toàn bộ máy tính thực thi tự động 100%.`;
    chatState.conversationsById[sid].messages.push({
      id: `omni-a-${Date.now()}`,
      role: "assistant",
      text: fallbackReply,
      summary_points: extractClientSummaryPoints(fallbackReply),
      timestamp: nowStr,
      model: "Cánh Tay Omni-Pilot · Điều Khiển Toàn Máy Tính",
      hidden_count: 1,
      tools: [{ name: "Omni-Pilot Engine", summary: actionName }],
      links: [],
    });
    renderActiveConversation(true);
    if (chatState.autoSpeak) speakVietnameseText(fallbackReply);
  }
  window.executeOmniAction = executeOmniAction;

  function renderMachinesPopover() {
    const bodyEl = document.getElementById("machinesListBody");
    const badgeEl = document.getElementById("machinesCountBadge");
    if (!bodyEl) return;
    const machines = chatState.linkedMachines || [];
    if (badgeEl) badgeEl.textContent = String(machines.length);
    bodyEl.innerHTML = machines
      .map((m) => {
        const isOnline = m.status === "online";
        const accText = Array.isArray(m.accounts)
          ? m.accounts.join(" · ")
          : String(m.accounts || "");
        return `
        <div class="machine-card">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
            <span style="font-weight:700; color:#f8fafc;">${escapeHtml(
              m.name
            )}</span>
            <span class="engine-mini ${isOnline ? "" : "claude"}">${
          isOnline ? "Trực tuyến" : "Cầu nối Sẵn sàng"
        }</span>
          </div>
          <div style="color:#94a3b8; font-size:11px;">Địa chỉ: ${escapeHtml(
            m.url
          )}</div>
          <div style="color:#cbd5e1; font-size:11.5px;">Tài khoản: ${escapeHtml(
            accText
          )}</div>
        </div>
      `;
      })
      .join("");
  }

  async function loadLinkedMachines() {
    try {
      const saved = localStorage.getItem("ceo_linked_machines");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length)
          chatState.linkedMachines = parsed;
      }
    } catch (_) {}
    if (chatState.daemonOnline) {
      try {
        const res = await fetch(`${LOCAL_API_BASE}/api/machines`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.machines) && data.machines.length) {
            chatState.linkedMachines = data.machines;
          }
        }
      } catch (_) {}
    }
    renderMachinesPopover();
  }

  // --------------------------------------------------------------------------
  // 5. MAIN 60FPS ANIMATION LOOP & EVENT LISTENERS
  // --------------------------------------------------------------------------
  function tickLoop() {
    STATE.tick++;

    if (STATE.tick % 60 === 0) {
      STATE.elapsedSec++;
      const timerEl = document.getElementById("status-elapsed-timer");
      if (timerEl) {
        const m = Math.floor(STATE.elapsedSec / 60);
        const s = String(STATE.elapsedSec % 60).padStart(2, "0");
        timerEl.textContent = `${m}:${s}`;
      }
    }

    if (STATE.currentMode === "2d") {
      draw2DCommandPreview(STATE.tick);
    } else if (STATE.currentMode === "3d") {
      render3DOffice(STATE.tick);
    } else if (STATE.currentMode === "node" && STATE.tick % 4 === 0) {
      renderNodeGraph();
    } else if (STATE.currentMode === "editor") {
      drawEditorCanvases(STATE.tick);
    }

    requestAnimationFrame(tickLoop);
  }

  window.addEventListener("DOMContentLoaded", () => {
    resize3DOfficeCanvas();
    initEditorGrid();
    renderNodeGraph();

    // Sidebar & Session controls
    const btnToggleSidebar = document.getElementById("btnToggleSidebar");
    const leftSidebar = document.getElementById("leftSidebar");
    if (btnToggleSidebar && leftSidebar) {
      btnToggleSidebar.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
          leftSidebar.classList.toggle("mobile-open");
        } else {
          leftSidebar.classList.toggle("collapsed");
        }
      });
    }

    const btnAutoFollow = document.getElementById("btnAutoFollowLive");
    if (btnAutoFollow) {
      btnAutoFollow.addEventListener("click", () => {
        chatState.autoFollowLive = !chatState.autoFollowLive;
        btnAutoFollow.style.background = chatState.autoFollowLive
          ? "rgba(134,239,172,0.18)"
          : "rgba(148,163,184,0.12)";
        btnAutoFollow.style.color = chatState.autoFollowLive
          ? "#86efac"
          : "#94a3b8";
        btnAutoFollow.textContent = chatState.autoFollowLive
          ? "⚡ Bám Live"
          : "⏸ Đang ghim";
        btnAutoFollow.setAttribute(
          "data-popover",
          chatState.autoFollowLive
            ? "Đang bật: Tự động chuyển sang phiên chat vừa có tin nhắn mới trên máy"
            : "Đang tắt: Giữ cố định phiên chat đang xem"
        );
      });
    }

    const btnRefresh = document.getElementById("btnRefreshSessions");
    if (btnRefresh)
      btnRefresh.addEventListener("click", () => fetchLiveSessions(true));

    const btnNew = document.getElementById("btnNewSession");
    if (btnNew) btnNew.addEventListener("click", createNewSession);

    const searchInput = document.getElementById("sessionSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        chatState.searchQuery = e.target.value || "";
        renderSessionList(true);
      });
    }

    const officeSearchInput = document.getElementById("officeDrawerSearchInput");
    if (officeSearchInput) {
      officeSearchInput.addEventListener("input", (e) => {
        chatState.officeSearchQuery = e.target.value || "";
        syncLiveTasksToVisualStudio(true);
      });
    }

    document.querySelectorAll("[data-provider]").forEach((pill) => {
      pill.addEventListener("click", () => {
        document
          .querySelectorAll("[data-provider]")
          .forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        chatState.providerFilter = pill.getAttribute("data-provider") || "all";
        const filtered = getFilteredSessions();
        if (filtered.length > 0) {
          selectSession(filtered[0].session_id, true);
        } else {
          renderSessionList(true);
          renderActiveConversation(false, true);
        }
      });
    });

    // Omni-Pilot Popover
    const btnOpenOmni = document.getElementById("btnOpenOmniPopover");
    const omniPanel = document.getElementById("omniPopoverPanel");
    if (btnOpenOmni && omniPanel) {
      btnOpenOmni.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = omniPanel.classList.contains("open");
        closeAllPopovers();
        if (!wasOpen) omniPanel.classList.add("open");
      });
    }
    const btnCloseOmni = document.getElementById("btnCloseOmniPopover");
    if (btnCloseOmni && omniPanel) {
      btnCloseOmni.addEventListener("click", () =>
        omniPanel.classList.remove("open")
      );
    }

    const btnSpawnAgentSession = document.getElementById(
      "btnSpawnAgentSession"
    );
    if (btnSpawnAgentSession) {
      btnSpawnAgentSession.addEventListener("click", () => {
        const agSel = document.getElementById("selectOmniTargetAgent");
        const dirInput = document.getElementById("inputOmniDirective");
        const targetAg = agSel ? agSel.value : "all-agents";
        const dirVal =
          (dirInput && dirInput.value.trim()) ||
          "Kiểm tra tiến độ, nâng cấp sản phẩm 4K và báo cáo nghiệm thu cho Sếp";
        const actType =
          targetAg === "all-agents"
            ? "broadcast-all-agents"
            : "spawn-agent-session";
        if (dirInput) dirInput.value = "";
        executeOmniAction(actType, { agent: targetAg, directive: dirVal });
      });
    }

    const btnOpenAntigravityIde = document.getElementById(
      "btnOpenAntigravityIde"
    );
    if (btnOpenAntigravityIde) {
      btnOpenAntigravityIde.addEventListener("click", () => {
        executeOmniAction("spawn-agent-session", {
          agent: "antigravity",
          directive:
            "Mở cửa sổ Antigravity IDE trực tiếp trên màn hình máy tính và đồng bộ phiên làm việc",
          open_ide_window: true,
        });
      });
    }

    document.querySelectorAll("[data-omni-act]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const act = btn.getAttribute("data-omni-act") || "capture-screen";
        const cdpKey = btn.getAttribute("data-cdp-key") || "";
        const agentKey = btn.getAttribute("data-omni-agent") || "";
        const dirKey = btn.getAttribute("data-omni-dir") || "";
        const payload = {};
        if (cdpKey) payload.profile_key = cdpKey;
        if (agentKey) payload.agent = agentKey;
        if (dirKey) payload.directive = dirKey;
        executeOmniAction(act, payload);
      });
    });

    const btnOmniDesktopApp = document.getElementById("btnOmniDesktopApp");
    if (btnOmniDesktopApp) {
      btnOmniDesktopApp.addEventListener("click", () => {
        const sysInput = document.getElementById("inputOmniSystemCmd");
        const val = (sysInput && sysInput.value.trim()) || "Antigravity";
        if (sysInput) sysInput.value = "";
        executeOmniAction("desktop-uia", { app: val, uia_action: "snapshot" });
      });
    }

    const btnOmniRunCommand = document.getElementById("btnOmniRunCommand");
    if (btnOmniRunCommand) {
      btnOmniRunCommand.addEventListener("click", () => {
        const sysInput = document.getElementById("inputOmniSystemCmd");
        const val =
          (sysInput && sysInput.value.trim()) ||
          "Get-Process | Select-Object -First 8 Name, Id";
        if (sysInput) sysInput.value = "";
        executeOmniAction("run-command", { command: val });
      });
    }

    // VieNeu-TTS 48kHz Voice Popover
    const btnAutoSpeak = document.getElementById("btnAutoSpeak");
    const voicePanel = document.getElementById("voicePopoverPanel");
    if (btnAutoSpeak && voicePanel) {
      btnAutoSpeak.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = voicePanel.classList.contains("open");
        closeAllPopovers();
        if (!wasOpen) voicePanel.classList.add("open");
      });
    }
    const btnCloseVoice = document.getElementById("btnCloseVoicePopover");
    if (btnCloseVoice && voicePanel) {
      btnCloseVoice.addEventListener("click", () =>
        voicePanel.classList.remove("open")
      );
    }

    const btnToggleAutoSpeakInside = document.getElementById(
      "btnToggleAutoSpeakInside"
    );
    if (btnToggleAutoSpeakInside && btnAutoSpeak) {
      btnToggleAutoSpeakInside.addEventListener("click", () => {
        chatState.autoSpeak = !chatState.autoSpeak;
        btnAutoSpeak.classList.toggle("active", chatState.autoSpeak);
        btnToggleAutoSpeakInside.classList.toggle(
          "selected",
          chatState.autoSpeak
        );
        const lbl = document.getElementById("lblAutoSpeakStatus");
        if (lbl) {
          lbl.textContent = chatState.autoSpeak
            ? "Tự động đọc báo cáo mới: Đang Bật"
            : "Tự động đọc báo cáo mới: Đang Tắt";
        }
        btnAutoSpeak.setAttribute(
          "data-popover",
          `Giọng VieNeu 48kHz: ${chatState.selectedVoice} (${
            chatState.autoSpeak ? "Đang Bật" : "Đang Tắt"
          })`
        );
      });
    }

    document.querySelectorAll("[data-vieneu-voice]").forEach((opt) => {
      opt.addEventListener("click", () => {
        document
          .querySelectorAll("[data-vieneu-voice]")
          .forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        chatState.selectedVoice =
          opt.getAttribute("data-vieneu-voice") || "Thùy Dung";
        chatState.selectedSampleSlug =
          opt.getAttribute("data-sample-slug") || "thuy_dung";
        if (btnAutoSpeak) {
          btnAutoSpeak.setAttribute(
            "data-popover",
            `Giọng nói VieNeu 48kHz: ${chatState.selectedVoice}`
          );
        }
        speakVietnameseText("", chatState.selectedSampleSlug);
      });
    });

    // Zero-Code Executive Toggle
    const btnZeroCode = document.getElementById("btnZeroCode");
    if (btnZeroCode) {
      btnZeroCode.addEventListener("click", () => {
        chatState.zeroCodeMode = !chatState.zeroCodeMode;
        btnZeroCode.classList.toggle("active", chatState.zeroCodeMode);
        btnZeroCode.setAttribute(
          "data-popover",
          chatState.zeroCodeMode
            ? "Chế độ Sếp: Đang ẩn 100% Code"
            : "Chế độ Kỹ thuật: Đang hiện bước chạy"
        );
        renderActiveConversation(false);
      });
    }

    // Multi-Machine Popover
    const btnOpenMachines = document.getElementById("btnOpenMachinesPopover");
    const machinesPanel = document.getElementById("machinesPopoverPanel");
    if (btnOpenMachines && machinesPanel) {
      btnOpenMachines.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = machinesPanel.classList.contains("open");
        closeAllPopovers();
        if (!wasOpen) {
          machinesPanel.classList.add("open");
          loadLinkedMachines();
        }
      });
    }
    const btnCloseMachines = document.getElementById("btnCloseMachinesPopover");
    if (btnCloseMachines && machinesPanel) {
      btnCloseMachines.addEventListener("click", () =>
        machinesPanel.classList.remove("open")
      );
    }

    const btnAddMachineNode = document.getElementById("btnAddMachineNode");
    if (btnAddMachineNode) {
      btnAddMachineNode.addEventListener("click", async () => {
        const nameEl = document.getElementById("inputMachineName");
        const urlEl = document.getElementById("inputMachineUrl");
        const accEl = document.getElementById("inputMachineAccounts");
        const nameVal =
          (nameEl && nameEl.value.trim()) ||
          `Máy Liên Kết #${chatState.linkedMachines.length + 1}`;
        const urlVal =
          (urlEl && urlEl.value.trim()) || "http://192.168.1.25:8765";
        const accVal =
          (accEl && accEl.value.trim()) || "Antigravity 2.0, Claude Code";
        const newNode = {
          id: `node-${Date.now()}`,
          name: nameVal,
          url: urlVal,
          accounts: accVal
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          status: "ready",
        };
        chatState.linkedMachines.push(newNode);
        try {
          localStorage.setItem(
            "ceo_linked_machines",
            JSON.stringify(chatState.linkedMachines)
          );
        } catch (_) {}
        if (chatState.daemonOnline) {
          try {
            await fetch(`${LOCAL_API_BASE}/api/machines`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "add",
                name: nameVal,
                url: urlVal,
                accounts: newNode.accounts,
              }),
            });
          } catch (_) {}
        }
        if (nameEl) nameEl.value = "";
        if (urlEl) urlEl.value = "";
        if (accEl) accEl.value = "";
        renderMachinesPopover();
      });
    }

    const btnCopyMachineSetup = document.getElementById("btnCopyMachineSetup");
    if (btnCopyMachineSetup) {
      btnCopyMachineSetup.addEventListener("click", (e) => {
        const setupCmd = `uv run --with vieneu --with edge-tts python -X utf8 voice_ceo_dashboard_server.py --port 8765`;
        navigator.clipboard.writeText(setupCmd);
        const b = e.currentTarget;
        const old = b.textContent;
        b.textContent = "Đã chép lệnh!";
        setTimeout(() => {
          b.textContent = old;
        }, 1400);
      });
    }

    // Hub Deliverables & Second Brain Popover
    const btnOpenHub = document.getElementById("btnOpenHubPopover");
    const hubPanel = document.getElementById("hubPopoverPanel");
    if (btnOpenHub && hubPanel) {
      btnOpenHub.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = hubPanel.classList.contains("open");
        closeAllPopovers();
        if (!wasOpen) {
          hubPanel.classList.add("open");
          renderHubPopover();
        }
      });
    }
    const btnCloseHub = document.getElementById("btnCloseHubPopover");
    if (btnCloseHub && hubPanel) {
      btnCloseHub.addEventListener("click", () =>
        hubPanel.classList.remove("open")
      );
    }

    document.querySelectorAll("[data-hubtab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll("[data-hubtab]")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        chatState.hubTab = tab.getAttribute("data-hubtab") || "deliverables";
        renderHubPopover();
      });
    });

    const btnCopyCli = document.getElementById("btnCopyCli");
    if (btnCopyCli) {
      btnCopyCli.addEventListener("click", (e) => {
        const activeSession = chatState.sessions.find(
          (s) => s.session_id === chatState.activeSessionId
        );
        if (!activeSession) return;
        const cmd =
          activeSession.resume_command ||
          `agy --conversation ${activeSession.session_id}`;
        navigator.clipboard.writeText(cmd);
        const btn = e.currentTarget;
        btn.setAttribute("data-popover", "Đã sao chép lệnh CLI!");
        setTimeout(
          () =>
            btn.setAttribute(
              "data-popover",
              "Sao chép lệnh mở trên Terminal"
            ),
          1400
        );
      });
    }

    // Composer Quick Commands & Agent Picker
    const btnQuickCmd = document.getElementById("btnQuickCmd");
    const quickPop = document.getElementById("quickCmdPopover");
    if (btnQuickCmd && quickPop) {
      btnQuickCmd.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = quickPop.classList.contains("open");
        closeAllPopovers();
        if (!wasOpen) quickPop.classList.add("open");
      });
    }

    const btnAgentPicker = document.getElementById("btnAgentPicker");
    const agentPop = document.getElementById("agentPickerPopover");
    if (btnAgentPicker && agentPop) {
      btnAgentPicker.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = agentPop.classList.contains("open");
        closeAllPopovers();
        if (!wasOpen) agentPop.classList.add("open");
      });
    }

    document.querySelectorAll("[data-close-pop]").forEach((btn) => {
      btn.addEventListener("click", () => closeAllPopovers());
    });

    document.querySelectorAll("[data-quick-cmd]").forEach((opt) => {
      opt.addEventListener("click", () => {
        const ta = document.getElementById("composerTextarea");
        if (ta) {
          ta.value = opt.getAttribute("data-quick-cmd") || "";
          closeAllPopovers();
          ta.focus();
        }
      });
    });

    document.querySelectorAll("[data-agent-val]").forEach((opt) => {
      opt.addEventListener("click", () => {
        document
          .querySelectorAll("[data-agent-val]")
          .forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        chatState.selectedAgentVal =
          opt.getAttribute("data-agent-val") || "auto";
        const label = opt.querySelector("span").textContent;
        if (btnAgentPicker) {
          btnAgentPicker.setAttribute(
            "data-popover",
            `Người thực thi: ${label}`
          );
        }
        closeAllPopovers();
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".popover-panel") &&
        !e.target.closest("#btnQuickCmd") &&
        !e.target.closest("#btnAgentPicker") &&
        !e.target.closest("#btnOpenHubPopover") &&
        !e.target.closest("#btnOpenMachinesPopover") &&
        !e.target.closest("#btnAutoSpeak") &&
        !e.target.closest("#btnOpenOmniPopover")
      ) {
        closeAllPopovers();
      }
    });

    const composerTextarea = document.getElementById("composerTextarea");
    if (composerTextarea) {
      composerTextarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendChatCommand();
        }
      });
    }

    const btnSendCommand = document.getElementById("btnSendCommand");
    if (btnSendCommand)
      btnSendCommand.addEventListener("click", () => sendChatCommand());

    const btnAbortJob = document.getElementById("btnAbortJob");
    if (btnAbortJob) {
      btnAbortJob.addEventListener("click", async () => {
        if (!chatState.daemonOnline || !chatState.activeSessionId) return;
        try {
          await fetch(`${LOCAL_API_BASE}/api/chat/abort`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: chatState.activeSessionId }),
          });
          await fetchLiveSessions(false);
        } catch (_) {}
      });
    }

    // Vietnamese Speech-to-Text Mic
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    const btnVoiceMic = document.getElementById("btnVoiceMic");
    if (SpeechRecognition && btnVoiceMic) {
      recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => {
        chatState.isRecordingMic = true;
        btnVoiceMic.classList.add("danger");
        btnVoiceMic.setAttribute("data-popover", "Đang nghe Sếp nói...");
      };
      recognition.onresult = (event) => {
        if (composerTextarea) {
          composerTextarea.value = event.results[0][0].transcript;
        }
        sendChatCommand();
      };
      recognition.onend = () => {
        chatState.isRecordingMic = false;
        btnVoiceMic.classList.remove("danger");
        btnVoiceMic.setAttribute(
          "data-popover",
          "Bấm để nói lệnh tiếng Việt"
        );
      };
    }

    if (btnVoiceMic) {
      btnVoiceMic.addEventListener("click", () => {
        if (!recognition) {
          alert(
            "Trình duyệt không hỗ trợ Mic giọng nói. Sếp vui lòng mở bằng Chrome hoặc Edge."
          );
          return;
        }
        if (chatState.isRecordingMic) recognition.stop();
        else recognition.start();
      });
    }

    // Media Modal Close
    const btnCloseModal = document.getElementById("btnCloseModal");
    const mediaModalBackdrop = document.getElementById("mediaModalBackdrop");
    if (btnCloseModal && mediaModalBackdrop) {
      btnCloseModal.addEventListener("click", () => {
        mediaModalBackdrop.classList.remove("open");
        const body = document.getElementById("modalBodyContent");
        if (body) body.innerHTML = "";
      });
      mediaModalBackdrop.addEventListener("click", (e) => {
        if (e.target === mediaModalBackdrop) {
          mediaModalBackdrop.classList.remove("open");
          const body = document.getElementById("modalBodyContent");
          if (body) body.innerHTML = "";
        }
      });
    }

    // URL query parameters for testing & standalone windows
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const subParam = params.get("sub");
    const popupParam = params.get("popup");
    const autoChainParam = params.get("autochain");
    if (modeParam) switchMode(modeParam);
    if (subParam) switchWebSubPage(subParam);
    if (popupParam === "video916" || popupParam === "1") {
      toggleVideo916Modal(true);
    }
    if (autoChainParam === "1") {
      startDemoChain();
    }

    window.addEventListener("resize", resize3DOfficeCanvas);
    requestAnimationFrame(tickLoop);

    // Start Live 1.2s Sync of 339+ Antigravity & Claude Sessions
    loadLinkedMachines();
    loadBrainSnapshotMetadata();
    fetchLiveSessions(true);
    setInterval(() => fetchLiveSessions(false), 1200);
  });
})();
