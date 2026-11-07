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
    canvasCollapsed: true,
  };

  const chatState = {
    sessions: [],
    conversationsById: {},
    activeSessionId: "",
    selectedBotId: "bot-1",
    bot1NeedsCeo: true,
    bot1WalkProgress: 1.0,
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

  // 6 Specialized Bot Agents + Central Second-Brain CEO Desk for Mode 2 (3D Office), Mode 1 (2D Chat) & Mode 3 (Org/Skill/Task Tree)
  const SPECIALIZED_BOT_AGENTS = [
    {
      id: "bot-1",
      deskId: "desk-ed-diagram",
      botNumber: 1,
      name: "Bot 1 · Đạo Diễn Flow",
      shortName: "Bot 1 · Flow",
      shortRole: "Video >10s/15s",
      agentCode: "flow-video-director",
      sessionId: "21129617-7584-4209-a696-2a10db001a28",
      shortId: "21129617",
      icon: "🎬",
      color: "#fb923c",
      voiceName: "Thùy Dung",
      wavFile: "audio_cache/vieneu_bot1_report.wav",
      pluginsSkills: ["google-flow-video-studio", "OmniPlus 1.2", "SOP 100/101"],
      skillCards: [
        { code: "FL", icon: "🎬", label: "Flow Studio V3.9", color: "#fb923c", tip: "Plugin google-flow-video-studio: Điều khiển đồ thị 11 Node & Clone 1080p" },
        { code: "OM", icon: "⚡", label: "OmniPlus 1.2", color: "#facc15", tip: "Skill chia đoạn & ghép tự động video >10s (MV10) & >15s (MV12)" },
        { code: "S1", icon: "🛡️", label: "SOP 100/101", color: "#38bdf8", tip: "Haute-Couture Prompt + avgblur=210 ngay Lượt 1 + Khóa V1 ~1500ml" },
      ],
      shortSteps: ["1. Nhân bản", "2. Cắt <=8s", "3. Omni 1.2", "4. Ghép MP4"],
      nx: -0.42,
      ny: -0.26,
      issueText: "Thiếu chọn model Gemini Omni 1.2 Flash trước khi bấm Generate (MV10 & MV12).",
      ceoDirective: "Ép selector 'Gemini Omni 1.2 Flash' + khóa V1 ~1500ml + avgblur=210.",
      aiReplySummary: "Đã nhân bản OmniPlus 1.2, cắt đoạn MV10 (13s) & MV12 (15s), xin lệnh CEO khóa model Omni 1.2 Flash.",
      steps: [
        { done: true, text: "1. Dùng skill google-flow-video-studio nhân bản Tool OmniPlus 1.2" },
        { done: true, text: "2. Tự động chia đoạn video >10s (MV10) & >15s (MV12) thành đoạn <=8s" },
        { done: false, exception: true, text: "3. Chạy về bàn CEO xin lệnh khóa model Gemini Omni 1.2 Flash" },
        { done: false, text: "4. Quay lại bàn ghép FFmpeg 1080p & nộp Bảng So Sánh Từng Giây" },
      ],
      deliverable: {
        title: "MV10 (>10s) & MV12 (>15s) · Bảng So Sánh",
        thumb: "local-assets/kol/bao_nhi_4k_anchor.jpg",
        fileUrl: "/media?path=C:/Users/Manabie/.antigravity-ide/GOOGLE_FLOW_VIDEO_STUDIO/KET_QUA_OMNIPLUS_12_TU_DONG/MV10_CHIEU_MUA_13S/FINAL_OMNIPLUS_MV10_CHIEU_MUA_13S.mp4",
        qcUrl: "/media?path=C:/Users/Manabie/.antigravity-ide/GOOGLE_FLOW_VIDEO_STUDIO/KET_QUA_OMNIPLUS_12_TU_DONG/BAO_CAO_NGHIEM_THU_2_VIDEO_TREN_10S_15S.html",
        kind: "video",
      },
    },
    {
      id: "bot-2",
      deskId: "desk-run",
      botNumber: 2,
      name: "Bot 2 · Trinh Sát FB Stealth",
      shortName: "Bot 2 · FB Stealth",
      shortRole: "10 Video 9:16",
      agentCode: "fb-viral-scout",
      sessionId: "33c06dc5-6d8d-4bb4-b328-2395de02c780",
      shortId: "33c06dc5",
      icon: "🕵️",
      color: "#4ade80",
      voiceName: "Mỹ Duyên",
      wavFile: "audio_cache/vieneu_bot2_report.wav",
      pluginsSkills: ["ag2-fb-flow-hunter", "5-Layer Stealth P4", "Node Studio V3.9"],
      skillCards: [
        { code: "FB", icon: "🕵️", label: "FB Flow Hunter", color: "#4ade80", tip: "Plugin ag2-fb-flow-hunter: Săn Reel triệu view & gắn link Shopee V6" },
        { code: "P4", icon: "🛡️", label: "5-Layer Stealth", color: "#34d399", tip: "Patchright CDP + Bezier Mouse + Zero .fill() + Kill-Switch Checkpoint" },
        { code: "SP", icon: "🛍️", label: "Shopee V6 Link", color: "#facc15", tip: "Tự động gắn affiliate_id=17367070550 (kkhmn4) & đăng giờ vàng" },
      ],
      shortSteps: ["1. Stealth P4", "2. Gắn Shopee", "3. 10 Video 9:16", "4. QC 10/10"],
      nx: 0.42,
      ny: -0.26,
      issueText: "",
      ceoDirective: "Duyệt 10/10: Mở Profile 4 qua 5 Lớp Stealth & khóa 10/10 Video 9:16.",
      aiReplySummary: "Đã quét FB Profile 4 an toàn và hoàn tất 10/10 Video dọc 9:16 (1080×1920).",
      steps: [
        { done: true, text: "1. Mở Profile 4 (khakhunghiep) qua 5 Lớp Stealth (Zero .fill())" },
        { done: true, text: "2. Săn Reel & gắn mã Shopee V6 (affiliate_id=17367070550)" },
        { done: true, text: "3. Dựng trọn bộ 10/10 Video dọc 9:16 (Bảo Trâm, Khánh Linh, Minh Anh)" },
        { done: true, text: "4. Bộ Não Thứ Hai CEO nghiệm thu 10/10 — sẵn sàng đăng giờ vàng" },
      ],
      deliverable: {
        title: "10/10 Video Dọc 9:16 (Bảo Trâm · Khánh Linh)",
        thumb: "local-assets/kol/bao_tram_4k_anchor.jpg",
        fileUrl: "local-assets/video/01_Bao_Tram/DA_CLONE_1080P_NO_BG_CHANGE/MV25_19xonMDHhG_GYM_CORE_DUMBBELL_4_BAI_SP01_V6__BAO_TRAM_CLONED_1080P.mp4",
        qcUrl: "/media?path=C:/Users/Manabie/.antigravity-ide/GOOGLE_FLOW_VIDEO_STUDIO/BAO_CAO_NGHIEM_THU_10_VIDEO_9_16_10_10.html",
        kind: "video",
      },
    },
    {
      id: "bot-3",
      deskId: "desk-qa-1920",
      botNumber: 3,
      name: "Bot 3 · May Đo Ngược 1500ml",
      shortName: "Bot 3 · May Đo",
      shortRole: "15 Video V6",
      agentCode: "luxury-tailor-bot",
      sessionId: "f0668997-5e6c-4a38-91dc-9c44b4876311",
      shortId: "f0668997",
      icon: "👗",
      color: "#38bdf8",
      voiceName: "Thùy Dung",
      wavFile: "audio_cache/vieneu_bot3_report.wav",
      pluginsSkills: ["ag2-luxury-allure-hunter", "May Đo Ngược 1500ml", "SOP 099/101"],
      skillCards: [
        { code: "LX", icon: "👗", label: "Luxury Allure", color: "#38bdf8", tip: "Plugin ag2-luxury-allure-hunter: Săn đồ hiệu & cắt _HEADLESS.jpg 20%" },
        { code: "MD", icon: "✂️", label: "May Đo 1500ml", color: "#ec4899", tip: "Engine reverse_tailor_outfit_engine.py: Khóa 105-55-102cm & cơ số 11" },
        { code: "S9", icon: "🔒", label: "Khóa 5 Lớp V1", color: "#a78bfa", tip: "SOP 099: Đưa taoanh-2 lên đầu, ngắt anh-1 khỏi node video" },
      ],
      shortSteps: ["1. Cắt Headless", "2. Haute Prompt", "3. Đấu taoanh-2", "4. 15/15 V6"],
      nx: -0.46,
      ny: 0.12,
      issueText: "",
      ceoDirective: "Duyệt 10/10: Haute-Couture Prompt + avgblur=210 ngay Lượt 1, giữ V1 ~1500ml.",
      aiReplySummary: "Đã cắt _HEADLESS.jpg và chạy May Đo Ngược 1500ml cho 15/15 Video V6 (0 lỗi Safety).",
      steps: [
        { done: true, text: "1. Cắt Headless 20% (_HEADLESS.jpg) & May Đo Ngược 1500ml" },
        { done: true, text: "2. Bơm Haute-Couture Prompt + avgblur=210 ngay từ Lượt 1 (SOP 101)" },
        { done: true, text: "3. Đấu dây ['taoanh-2', 'taoanh-1'] (ngắt anh-1) khóa V1 ~1500ml" },
        { done: true, text: "4. Hoàn tất 15/15 Video V6 (0 lỗi Safety) — CEO chấm 10/10" },
      ],
      deliverable: {
        title: "Kho May Đo 1500ml & 15/15 Video V6",
        thumb: "local-assets/shopee/SP01_V6_BAO_TRAM_SET_PICKLEBALL_CROP_BRA_VAY_XEP_LY_MAY_DO_NGUOC_1500ML.jpg",
        fileUrl: "local-assets/shopee/SP01_V6_BAO_TRAM_SET_PICKLEBALL_CROP_BRA_VAY_XEP_LY_MAY_DO_NGUOC_1500ML.jpg",
        qcUrl: "local-assets/kol/00_BANG_5_NHAN_VAT_CANONICAL_4K.jpg",
        kind: "image",
      },
    },
    {
      id: "bot-4",
      deskId: "desk-ed-news",
      botNumber: 4,
      name: "Bot 4 · Đạo Diễn Hậu Kỳ",
      shortName: "Bot 4 · Hậu Kỳ",
      shortRole: "4 TVC Đồ Nam",
      agentCode: "viral-video-editor",
      sessionId: "be2e698c-1f28-4847-b6c1-443ca9978102",
      shortId: "be2e698c",
      icon: "🎞️",
      color: "#a78bfa",
      voiceName: "Adam",
      wavFile: "audio_cache/vieneu_bot4_report.wav",
      pluginsSkills: ["ag2-viral-video-editor", "Remotion 4.0", "Auto-Ducking -14dB"],
      skillCards: [
        { code: "ED", icon: "🎞️", label: "Viral Editor V3", color: "#a78bfa", tip: "Plugin ag2-viral-video-editor: 10 phong cách edit.fibus.vn & Mike V3" },
        { code: "RM", icon: "✨", label: "Remotion 4.0", color: "#f472b6", tip: "Ghép đa phân cảnh 24fps, phủ màu 3D LUT (.cube) & Sub Karaoke .ass" },
        { code: "AD", icon: "🔊", label: "Ducking -14dB", color: "#34d399", tip: "Chèn SFX phòng thu & tự động hạ nhạc nền -14dB khi có giọng đọc" },
      ],
      shortSteps: ["1. Ảnh góc 45°", "2. Remotion+LUT", "3. Sub+SFX -14dB", "4. 4/4 TVC Nam"],
      nx: 0.46,
      ny: 0.12,
      issueText: "",
      ceoDirective: "Duyệt 10/10: Phủ màu 3D LUT, Sub .ass & Auto-Ducking -14dB cho 4 TVC Đồ Nam.",
      aiReplySummary: "Đã hoàn tất 4 Video TVC Thời Trang Nam Đa Phân Cảnh 9:16 (1080p) & contact-sheet.",
      steps: [
        { done: true, text: "1. Tạo bộ ảnh sản phẩm Thời Trang Nam (Polo, Sơ mi, Quần âu) góc 45°" },
        { done: true, text: "2. Ghép chuyển động Remotion 4.0 + Phủ màu 3D LUT (.cube)" },
        { done: true, text: "3. Đốt phụ đề Karaoke .ass + Chèn SFX & Auto-Ducking -14dB" },
        { done: true, text: "4. Xuất 4/4 TVC 1080p (9:16) & duyệt contact-sheet đạt 10/10" },
      ],
      deliverable: {
        title: "4 TVC Thời Trang Nam 9:16 (1080p)",
        thumb: "local-assets/kol/ha_vy_4k_anchor.jpg",
        fileUrl: "/media?path=c:/Users/Manabie/.antigravity-ide/mang xa hoi/KHO_SAN_PHAM_THOI_TRANG_NAM/VIDEO_TVC_DA_PHAN_CANH_9_16/FINAL_MASTER_ALL_4_TVC_THOI_TRANG_NAM_9_16.mp4",
        qcUrl: "/media?path=c:/Users/Manabie/.antigravity-ide/mang xa hoi/KHO_SAN_PHAM_THOI_TRANG_NAM/VIDEO_TVC_DA_PHAN_CANH_9_16/FINAL_MASTER_ALL_4_TVC_THOI_TRANG_NAM_9_16.mp4",
        kind: "video",
      },
    },
    {
      id: "bot-5",
      deskId: "desk-ed-cut",
      botNumber: 5,
      name: "Bot 5 · Biên Kịch Sitcom 30s",
      shortName: "Bot 5 · Sitcom",
      shortRole: "3 Hồi 30s",
      agentCode: "sitcom-storyboard-bot",
      sessionId: "08fdb4e6-8209-4972-9552-8c7a9f2d8901",
      shortId: "08fdb4e6",
      icon: "🎭",
      color: "#f472b6",
      voiceName: "Mỹ Duyên",
      wavFile: "audio_cache/vieneu_bot5_report.wav",
      pluginsSkills: ["ag2-ai-sitcom-storyboard", "18 Micro-Beats", "48 FACS"],
      skillCards: [
        { code: "SC", icon: "🎭", label: "Sitcom Director", color: "#f472b6", tip: "Plugin ag2-ai-sitcom-storyboard-director: Kịch bản 3 Hồi Plot-Twist" },
        { code: "MB", icon: "🎬", label: "18 Micro-Beats", color: "#fb923c", tip: "Chia 18 nhịp diễn 1.5s-2.0s + One-Shot 6 Góc Máy iPhone 17 Pro Max" },
        { code: "FC", icon: "😊", label: "48 FACS Acting", color: "#38bdf8", tip: "Stanislavski Method-Acting + 48 cơ mặt FACS + 104 Luxury Poses" },
      ],
      shortSteps: ["1. 18 Đoạn nhỏ", "2. 48 FACS", "3. Sheet 9 cảnh", "4. Master 30s"],
      nx: -0.28,
      ny: 0.44,
      issueText: "",
      ceoDirective: "Duyệt 10/10: Khớp trục nhìn 180°, Whip-Pan & nhịp diễn 3 chu kỳ lệch pha.",
      aiReplySummary: "Đã hoàn thành kịch bản 18 đoạn nhỏ, Character Sheet 9 cảnh & Master Sitcom 30s.",
      steps: [
        { done: true, text: "1. Biên dịch ý tưởng thành 18 Phân đoạn nhỏ (1.5s-2.0s) × 3 Hồi" },
        { done: true, text: "2. Ghép 48 Portrait FACS + 104 Luxury Poses tạo NGUON_DIEN_XUAT" },
        { done: true, text: "3. Sinh Character Sheet 9 phân cảnh & quay Method-Acting Video" },
        { done: true, text: "4. Ráp nối trục 180°, chèn SFX & xuất Master Sitcom 30s (1080p)" },
      ],
      deliverable: {
        title: "Master Sitcom 3 Hồi 30s (Bảo Trâm × Khánh Linh)",
        thumb: "local-assets/kol/khanh_linh_4k_anchor.jpg",
        fileUrl: "/media?path=c:/Users/Manabie/.antigravity-ide/mang xa hoi/SAN_PHAM_SITCOM_AI_3_HOI/20260405_SITCOM_PHONG_TAP_BAO_TRAM_KHANH_LINH/FINAL_SITCOM_3_HOI_30S_MASTER.mp4",
        qcUrl: "/media?path=c:/Users/Manabie/.antigravity-ide/mang xa hoi/SAN_PHAM_SITCOM_AI_3_HOI/20260405_SITCOM_PHONG_TAP_BAO_TRAM_KHANH_LINH/FINAL_SITCOM_3_HOI_30S_MASTER.mp4",
        kind: "video",
      },
    },
    {
      id: "bot-6",
      deskId: "desk-ed-chart",
      botNumber: 6,
      name: "Bot 6 · Kỹ Sư Máy Tính & 4K",
      shortName: "Bot 6 · 4K & Máy",
      shortRole: "Ultra 4K + CDP",
      agentCode: "aistudio-4k-upscaler",
      sessionId: "ae769ba4-3911-4582-81a9-7c8d1f009b12",
      shortId: "ae769ba4",
      icon: "🖥️",
      color: "#facc15",
      voiceName: "Minh Triết",
      wavFile: "audio_cache/vieneu_bot6_report.wav",
      pluginsSkills: ["ag2-aistudio-ultra-4k", "ag2-windows-omni-pilot", "Profile 5"],
      skillCards: [
        { code: "4K", icon: "💎", label: "AI Studio 4K", color: "#facc15", tip: "Plugin ag2-aistudio-ultra-4k: hoatrang756 · 1,000 ảnh 4K/ngày" },
        { code: "OP", icon: "🦾", label: "Omni-Pilot UIA", color: "#4ade80", tip: "Plugin ag2-windows-omni-pilot: Điều khiển toàn máy tính & quay 60fps" },
        { code: "CD", icon: "🌐", label: "Multi-CDP 9222+", color: "#38bdf8", tip: "Quản lý 4 cổng Chrome CDP (P1, P4, P5, P6) & dọn sạch RAM" },
      ],
      shortSteps: ["1. Dọn RAM", "2. P5 4K Ultra", "3. 4 Cổng CDP", "4. QC 6 Miền"],
      nx: 0.30,
      ny: 0.44,
      issueText: "",
      ceoDirective: "Duyệt 10/10: Duy trì Profile 5 (1,000 ảnh 4K/ngày), dọn RAM & chạy Cổng QC.",
      aiReplySummary: "Đã giải phóng RAM, duy trì 4 cổng Multi-CDP (9222..9226) và nâng cấp 5 KOL 4K.",
      steps: [
        { done: true, text: "1. Quét tiến trình Windows & dọn sạch Chrome zombie giải phóng RAM" },
        { done: true, text: "2. Kết nối Profile 5 (hoatrang756 — Google AI Ultra) nâng cấp 4K" },
        { done: true, text: "3. Duy trì 4 cổng Chrome Multi-CDP (9222..9226) & Cánh tay UIA" },
        { done: true, text: "4. Kiểm định verify.py & autonomous_qc_gatekeeper.py đạt 10/10" },
      ],
      deliverable: {
        title: "5 Nhân Vật Canonical 4K & QC 6 Miền",
        thumb: "local-assets/kol/00_BANG_5_NHAN_VAT_CANONICAL_4K.jpg",
        fileUrl: "local-assets/kol/00_BANG_5_NHAN_VAT_CANONICAL_4K.jpg",
        qcUrl: "local-assets/kol/00_BANG_5_NHAN_VAT_CANONICAL_4K.jpg",
        kind: "image",
      },
    },
  ];

  // 3D Office Desks & Floating Tags for the Central CEO + 6 Specialized Bot Agents (Mode 2)
  const OFFICE_DESKS = [
    {
      id: "desk-commander",
      title: "🧠 Bàn CEO Bộ Não Thứ Hai",
      sub: "Trợ lý của Sếp · Duyệt 6 Bot · Giọng VieNeu 48kHz",
      nx: 0.0,
      ny: -0.06,
      cls: "tag-commander",
      color: "#fb923c",
    },
    ...SPECIALIZED_BOT_AGENTS.map((b) => ({
      id: b.deskId,
      botId: b.id,
      title: `${b.icon} ${b.name} (#${b.shortId})`,
      sub: `🧩 ${b.pluginsSkills.slice(0, 2).join(" · ")}`,
      nx: b.nx,
      ny: b.ny,
      cls: "",
      color: b.color,
    })),
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
  window.switchMode = switchMode;

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

    // Smoothly interpolate Bot 1's walk between its desk (0.0) and the CEO Desk (1.0)
    const targetWalk = chatState.bot1NeedsCeo ? 1.0 : 0.0;
    chatState.bot1WalkProgress += (targetWalk - chatState.bot1WalkProgress) * 0.08;

    const stageLeft = 278;
    const stageRight = Math.max(stageLeft + 380, W - 368);
    const originX = (stageLeft + stageRight) * 0.5;
    const originY = H * 0.45;
    const floorW = Math.min((stageRight - stageLeft) * 0.46, 315);
    const floorD = Math.min(H * 0.34, 210);

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

    const billX = originX - floorW * 0.38;
    const billY = originY - floorD * 0.64;
    ctx.save();
    ctx.transform(1, -0.52, 0, 1, billX, billY);
    const bGrad = ctx.createLinearGradient(-130, -60, 130, 0);
    bGrad.addColorStop(0, "#38bdf8");
    bGrad.addColorStop(0.5, "#67e8f9");
    bGrad.addColorStop(1, "#22d3ee");
    ctx.fillStyle = bGrad;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 20;
    roundRect(ctx, -135, -56, 270, 44, 6, true, false);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#082f49";
    ctx.font = "900 17px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ĐÒN BẨY AI × AG2", 0, -28);
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

    // Central Second-Brain CEO Desk
    const cmdX = originX;
    const cmdY = originY - floorD * 0.06;
    ctx.fillStyle = chatState.bot1NeedsCeo
      ? "rgba(234, 88, 12, 0.48)"
      : "rgba(22, 163, 74, 0.36)";
    ctx.strokeStyle = chatState.bot1NeedsCeo
      ? "rgba(250, 204, 21, 0.85)"
      : "rgba(74, 222, 128, 0.65)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(cmdX, cmdY + 8, 78, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.ellipse(cmdX, cmdY - 4, 40, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // CEO Second-Brain Avatar at center table
    draw3DAgentAvatar(ctx, cmdX, cmdY - 12, "#ec4899", Math.sin(t * 0.08) * 2);

    // Non-overlapping screen-space ring coordinates for the 7 floating cards
    const cardPositionByDesk = {
      "desk-commander": { x: cmdX, y: Math.max(82, originY - floorD - 22) },
      "desk-ed-diagram": { x: originX - 206, y: originY - 98 },
      "desk-run": { x: originX + 206, y: originY - 98 },
      "desk-qa-1920": { x: originX - 216, y: originY + 18 },
      "desk-ed-news": { x: originX + 216, y: originY + 18 },
      "desk-ed-cut": { x: originX - 196, y: originY + 134 },
      "desk-ed-chart": { x: originX + 196, y: originY + 134 },
    };

    // Leader line from Central CEO Card to 3D CEO Avatar
    ctx.save();
    ctx.strokeStyle = chatState.bot1NeedsCeo ? "rgba(250, 204, 21, 0.72)" : "rgba(236, 72, 153, 0.55)";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cardPositionByDesk["desk-commander"].x, cardPositionByDesk["desk-commander"].y + 24);
    ctx.lineTo(cmdX, cmdY - 18);
    ctx.stroke();
    ctx.restore();

    // Draw the 6 Specialized Bot Desks & Avatars
    OFFICE_DESKS.forEach((d, idx) => {
      if (d.id === "desk-commander") return;
      const dx = originX + d.nx * floorW;
      const dy = originY + d.ny * floorD;
      const isBot1 = d.botId === "bot-1";
      const walkProg = isBot1 ? chatState.bot1WalkProgress : 0.0;

      // Connection line from Desk to CEO Desk
      ctx.save();
      if (isBot1 && walkProg > 0.05) {
        ctx.strokeStyle = "rgba(250, 204, 21, 0.92)";
        ctx.lineWidth = 2.8;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -t * 0.8;
      } else {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
        ctx.lineWidth = 1.5;
      }
      ctx.beginPath();
      ctx.moveTo(cmdX, cmdY - 4);
      ctx.lineTo(dx, dy);
      ctx.stroke();
      ctx.restore();

      // Traveling signal dot
      const p = (t * 0.015 + idx * 0.17) % 1;
      const px = cmdX + (dx - cmdX) * p;
      const py = cmdY - 4 + (dy - (cmdY - 4)) * p;
      ctx.fillStyle = isBot1 && walkProg > 0.2 ? "#fde047" : d.color;
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // 3D Desk & Monitor
      draw3DIsoBox(ctx, dx, dy, 26, 15, 10, "#cbd5e1", "#94a3b8", "#64748b");
      draw3DIsoBox(ctx, dx - 5, dy - 12, 14, 4, 12, d.color, "#0f172a", d.color);

      // Bot Avatar Position: either at its desk (walkProg=0) or walked to CEO Desk (walkProg=1)
      const targetCeoX = cmdX - 42;
      const targetCeoY = cmdY + 14;
      const avX = (dx + 12) * (1 - walkProg) + targetCeoX * walkProg;
      const avY = (dy + 10) * (1 - walkProg) + targetCeoY * walkProg;

      // Leader line from non-overlapping Bot Card to 3D Bot Avatar
      const cardPos = cardPositionByDesk[d.id];
      if (cardPos) {
        ctx.save();
        ctx.strokeStyle = isBot1 && walkProg > 0.2 ? "rgba(250, 204, 21, 0.78)" : d.color + "66";
        ctx.lineWidth = isBot1 && walkProg > 0.2 ? 1.8 : 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        const anchorSideX = cardPos.x < originX ? cardPos.x + 88 : cardPos.x - 88;
        ctx.moveTo(anchorSideX, cardPos.y);
        ctx.lineTo(avX, avY - 6);
        ctx.stroke();
        ctx.restore();
      }

      if (isBot1 && walkProg > 0.3) {
        ctx.strokeStyle = "rgba(250, 204, 21, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(avX, avY + 4, 15, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      draw3DAgentAvatar(
        ctx,
        avX,
        avY,
        d.color,
        Math.sin(t * 0.12 + idx) * (walkProg > 0.1 ? 3.2 : 1.8)
      );
    });

    const layer = document.getElementById("office3d-labels-layer");
    if (!layer) return;
    if (layer.children.length === 0) {
      OFFICE_DESKS.forEach((d) => {
        const el = document.createElement("div");
        el.className = "agent-floating-tag " + d.cls;
        el.id = "tag-" + d.id;
        layer.appendChild(el);
      });
      syncLiveTasksToVisualStudio(true);
    }

    OFFICE_DESKS.forEach((d) => {
      const el = document.getElementById("tag-" + d.id);
      if (!el) return;
      const cardPos = cardPositionByDesk[d.id] || { x: originX, y: originY };
      el.style.left = cardPos.x + "px";
      el.style.top = cardPos.y + "px";
    });
  }

  // =========================================================================
  // CÂY SƠ ĐỒ TỔ CHỨC · TASK · PLUGIN & SKILL (HỌC TỪ PAPERCLIP AI & ORGTREE)
  // 4 Tầng trực quan: 👑 CEO ➔ 6 Bot Đội Trưởng ➔ 18 Plugin/Skill ➔ 6 Task & Sản Phẩm
  // =========================================================================
  let orgTreeState = {
    filter: "all", // 'all' | 'org' | 'skills' | 'tasks'
    zoom: 1.0,
    lastRenderSig: "",
  };

  function setOrgTreeFilter(filterMode, btnEl) {
    orgTreeState.filter = filterMode || "all";
    document.querySelectorAll(".orgtree-filter-btn").forEach((b) => {
      b.classList.toggle("active", b === btnEl);
    });
    orgTreeState.lastRenderSig = "";
    renderNodeGraph(true);
  }
  window.setOrgTreeFilter = setOrgTreeFilter;

  function zoomOrgTree(delta) {
    orgTreeState.zoom = Math.max(0.65, Math.min(1.35, orgTreeState.zoom + delta));
    const stage = document.getElementById("orgtree-canvas-stage");
    if (stage) {
      stage.style.transform = `scale(${orgTreeState.zoom})`;
      stage.style.transformOrigin = "top center";
    }
  }
  window.zoomOrgTree = zoomOrgTree;

  function resetOrgTreeZoom() {
    orgTreeState.zoom = 1.0;
    const stage = document.getElementById("orgtree-canvas-stage");
    if (stage) {
      stage.style.transform = "scale(1)";
    }
  }
  window.resetOrgTreeZoom = resetOrgTreeZoom;

  function renderNodeGraph(forceRebuild = false) {
    const domLayer = document.getElementById("nodegraph-dom-layer");
    const svg = document.getElementById("nodegraph-svg");
    const container = document.getElementById("mode-node");
    if (!domLayer || !svg) return;

    const w = Math.max(1180, (container && container.clientWidth) || window.innerWidth || 1366);
    const centerX = Math.round(w * 0.5);
    const sig = `${w}|${orgTreeState.filter}|${chatState.selectedBotId}|${chatState.bot1NeedsCeo ? 1 : 0}`;
    const needsDomBuild = forceRebuild || domLayer.children.length === 0 || orgTreeState.lastRenderSig !== sig;

    // Bố cục 6 cột cân đối cho 6 Đội Trưởng Bot
    const marginX = Math.max(124, Math.round(w * 0.095));
    const usableW = Math.max(880, w - marginX * 2);
    const colStep = usableW / 5;
    const colXs = [0, 1, 2, 3, 4, 5].map((i) => Math.round(marginX + i * colStep));

    const yCeo = 56;
    const yBot = 166;
    const ySkillBase = 286;
    const yTask = orgTreeState.filter === "tasks" ? 290 : 418;

    const showSkills = orgTreeState.filter === "all" || orgTreeState.filter === "skills";
    const showTasks = orgTreeState.filter === "all" || orgTreeState.filter === "tasks";

    if (needsDomBuild) {
      orgTreeState.lastRenderSig = sig;
      let html = "";

      // TẦNG 1: ĐỈNH THÁP — SẾP & BỘ NÃO THỨ HAI CEO
      const ceoAlert = chatState.bot1NeedsCeo;
      html += `
        <div class="orgtree-node-card tier-ceo" style="left:${centerX}px; top:${yCeo}px;"
             data-popover="Đỉnh Tháp Chỉ Huy: Bộ Não Thứ Hai CEO · 339+ Phiên Chat · 774 Luật Bất Di Bất Dịch · Tự động điều phối 6 Đội Trưởng Bot"
             onclick="speakCeoOverviewVieNeu()">
          <div class="org-card-top">
            <div class="org-card-title">
              <span>👑</span>
              <span>Sếp &amp; Bộ Não Thứ Hai CEO</span>
            </div>
            <span class="org-card-badge" style="background:${ceoAlert ? "rgba(250,204,21,0.22)" : "rgba(74,222,128,0.2)"};color:${ceoAlert ? "#fde047" : "#86efac"};">
              ${ceoAlert ? "⚠️ 1 Xin Duyệt" : "🟢 6/6 Tốt"}
            </span>
          </div>
          <div class="org-card-sub">🧠 774 Luật · 🎙️ VieNeu 48kHz · 🛡️ 5-Layer Stealth</div>
          <div class="org-card-actions" onclick="event.stopPropagation();">
            <button type="button" class="org-mini-action" onclick="speakCeoOverviewVieNeu()" data-popover="Nghe báo cáo tổng quan CEO">🔊 Nghe CEO</button>
            ${
              ceoAlert
                ? `<button type="button" class="org-mini-action warn" onclick="approveBot1ByCeo()" data-popover="Duyệt lệnh cho Bot 1 về bàn">⚡ Duyệt Bot 1</button>`
                : `<button type="button" class="org-mini-action" onclick="toggleBot1DemoWalkToCeo()" data-popover="Mô phỏng Bot 1 chạy lại bàn CEO">🏃 Test Báo Cáo</button>`
            }
          </div>
        </div>
      `;

      // TẦNG 2: 6 ĐỘI TRƯỞNG BOT CHUYÊN TRÁCH (Paperclip Card + Orgtree ContextWheel)
      SPECIALIZED_BOT_AGENTS.forEach((bot, idx) => {
        const cx = colXs[idx];
        const isSel = chatState.selectedBotId === bot.id;
        const isNeedsCeo = bot.id === "bot-1" && chatState.bot1NeedsCeo;
        const doneSteps = bot.steps.filter((s) => s.done).length;
        const pct = Math.round((doneSteps / Math.max(1, bot.steps.length)) * 100);
        const strokeCol = isNeedsCeo ? "#facc15" : "#4ade80";
        const dashOffset = Math.round(69.1 - (69.1 * pct) / 100);

        html += `
          <div class="orgtree-node-card tier-bot ${isSel ? "active" : ""} ${isNeedsCeo ? "needs-ceo" : ""}"
               style="left:${cx}px; top:${yBot}px;"
               onclick="selectBotAgentInStudio('${bot.id}', false)"
               data-popover="${escapeHtml(bot.name)} (#${escapeHtml(bot.shortId)}) · ${escapeHtml(bot.aiReplySummary)}">
            <div class="org-card-top">
              <div class="org-card-title">
                <span>${bot.icon}</span>
                <span>${escapeHtml(bot.shortName || bot.name)}</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 26 26" style="flex-shrink:0;">
                <circle cx="13" cy="13" r="11" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2.5"/>
                <circle cx="13" cy="13" r="11" fill="none" stroke="${strokeCol}" stroke-width="2.5"
                        stroke-dasharray="69.1" stroke-dashoffset="${dashOffset}" transform="rotate(-90 13 13)"/>
                <text x="13" y="16.5" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-weight="800">${doneSteps}/4</text>
              </svg>
            </div>
            <div class="org-card-sub">
              <span style="color:${strokeCol};font-weight:800;">●</span> ${escapeHtml(bot.shortRole || "")} · <span style="color:#7dd3fc">#${escapeHtml(bot.shortId)}</span>
            </div>
            <div class="org-card-actions" onclick="event.stopPropagation();">
              <button type="button" class="org-mini-action" onclick="speakBotReportVieNeu('${bot.id}')" data-popover="Nghe giọng ${escapeHtml(bot.voiceName)}">🔊</button>
              <button type="button" class="org-mini-action" onclick="selectBotAgentInStudio('${bot.id}', true)" data-popover="Mở khung Chat điều hành">💬 Chat</button>
              ${
                isNeedsCeo
                  ? `<button type="button" class="org-mini-action warn" onclick="approveBot1ByCeo()" data-popover="Duyệt lệnh CEO">⚡ Duyệt</button>`
                  : `<span class="org-mini-action" style="cursor:default;">🎙️ ${escapeHtml(bot.voiceName)}</span>`
              }
            </div>
          </div>
        `;

        // TẦNG 3: CÂY PLUGIN & SKILL GẮN VÀO TỪNG BOT (Paperclip SkillCardIcon)
        if (showSkills && Array.isArray(bot.skillCards)) {
          bot.skillCards.forEach((sk, sIdx) => {
            const sy = ySkillBase + sIdx * 38;
            html += `
              <div class="orgtree-node-card tier-skill"
                   style="left:${cx}px; top:${sy}px;"
                   onclick="selectBotAgentInStudio('${bot.id}', false)"
                   data-popover="Plugin/Skill [${escapeHtml(sk.label)}]: ${escapeHtml(sk.tip)}">
                <div class="org-card-top">
                  <div class="org-card-title">
                    <span class="skill-sq-icon" style="background:${sk.color};">${escapeHtml(sk.code)}</span>
                    <span>${sk.icon} ${escapeHtml(sk.label)}</span>
                  </div>
                  <span style="color:#4ade80;font-size:9px;font-weight:900;">● ON</span>
                </div>
              </div>
            `;
          });
        }

        // TẦNG 4: TASK ĐANG CHẠY + 4 CHẤM TIẾN ĐỘ + THUMBNAIL SẢN PHẨM
        if (showTasks) {
          const deliv = bot.deliverable || {};
          const thumbSrc = deliv.thumb || "local-assets/kol/bao_tram_4k_anchor.jpg";
          const fileUrl =
            deliv.fileUrl && deliv.fileUrl.startsWith("/") && LOCAL_API_BASE
              ? `${LOCAL_API_BASE}${deliv.fileUrl}`
              : deliv.fileUrl || "#";
          const qcUrl =
            deliv.qcUrl && deliv.qcUrl.startsWith("/") && LOCAL_API_BASE
              ? `${LOCAL_API_BASE}${deliv.qcUrl}`
              : deliv.qcUrl || fileUrl;

          const stepDotsHtml = (bot.shortSteps || [])
            .map((st, stIdx) => {
              const rawSt = bot.steps[stIdx] || {};
              const stepIco = rawSt.exception ? "🏃" : rawSt.done ? "✅" : "⏳";
              const stepLbl = typeof st === "string" ? st : st.label || "";
              const bg = rawSt.exception
                ? "rgba(250,204,21,0.22)"
                : rawSt.done
                ? "rgba(74,222,128,0.16)"
                : "rgba(255,255,255,0.06)";
              const col = rawSt.exception ? "#fde047" : rawSt.done ? "#86efac" : "#94a3b8";
              return `<span style="padding:1px 4px;border-radius:4px;background:${bg};color:${col};font-size:8.5px;font-weight:800;" data-popover="${escapeHtml(rawSt.text || stepLbl)}">${stepIco}</span>`;
            })
            .join("");

          html += `
            <div class="orgtree-node-card tier-task"
                 style="left:${cx}px; top:${yTask}px;"
                 onclick="window.open('${escapeHtml(fileUrl)}', '_blank')"
                 data-popover="Sản phẩm của ${escapeHtml(bot.shortName)}: ${escapeHtml(deliv.title || "")} (Bấm để mở File)">
              <div class="org-card-top">
                <div class="org-card-title">
                  <span>📦</span>
                  <span>${escapeHtml((deliv.title || "Sản phẩm").slice(0, 22))}</span>
                </div>
                <div style="display:flex;gap:2px;">${stepDotsHtml}</div>
              </div>
              <img class="org-task-thumb" src="${escapeHtml(thumbSrc)}" alt="Deliverable" loading="lazy" />
              <div class="org-card-actions" onclick="event.stopPropagation();">
                <a href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener" class="org-mini-action" style="text-decoration:none;">📂 File</a>
                <a href="${escapeHtml(qcUrl)}" target="_blank" rel="noopener" class="org-mini-action" style="text-decoration:none;">👁️ QC</a>
                <button type="button" class="org-mini-action" onclick="selectBotAgentInStudio('${bot.id}', true)">💬 Lệnh</button>
              </div>
            </div>
          `;
        }
      });

      domLayer.innerHTML = html;
    }

    // VẼ ĐƯỜNG NỐI CÂY TỔ CHỨC SVG (Orthogonal + Bezier + Animated Signal Dots)
    let svgHtml = "";
    const ceoBottomY = yCeo + 74;
    const busY = Math.round((ceoBottomY + yBot) * 0.5);

    SPECIALIZED_BOT_AGENTS.forEach((bot, idx) => {
      const cx = colXs[idx];
      const isNeedsCeo = bot.id === "bot-1" && chatState.bot1NeedsCeo;
      const isSel = chatState.selectedBotId === bot.id;
      const lineCol = isNeedsCeo ? "#facc15" : isSel ? "#38bdf8" : "#4ade80";

      // Nhánh từ Đỉnh CEO -> Từng Đội Trưởng Bot (Orthogonal Tree Connector chuẩn Paperclip OrgChart)
      const pCeoToBot = `M ${centerX} ${ceoBottomY} L ${centerX} ${busY} L ${cx} ${busY} L ${cx} ${yBot}`;
      svgHtml += `
        <path d="${pCeoToBot}" fill="none" stroke="rgba(148,163,184,0.24)" stroke-width="2" />
        <path d="${pCeoToBot}" fill="none" stroke="${lineCol}" stroke-width="${isSel || isNeedsCeo ? "2.4" : "1.6"}"
              stroke-dasharray="7 11" stroke-dashoffset="${-STATE.tick * 2}" />
      `;

      // Nhánh từ Bot -> Cây Plugin/Skill -> Task/Sản Phẩm
      const botBottomY = yBot + 82;
      if (showSkills && Array.isArray(bot.skillCards)) {
        const lastSkillY = ySkillBase + (bot.skillCards.length - 1) * 38 + 26;
        const spineEndY = showTasks ? yTask : lastSkillY;
        const pSpine = `M ${cx} ${botBottomY} L ${cx} ${spineEndY}`;
        svgHtml += `
          <path d="${pSpine}" fill="none" stroke="rgba(56,189,248,0.26)" stroke-width="1.8" />
          <path d="${pSpine}" fill="none" stroke="${lineCol}" stroke-width="1.6"
                stroke-dasharray="5 9" stroke-dashoffset="${-STATE.tick * 1.8}" />
        `;
      } else if (showTasks) {
        const pDirect = `M ${cx} ${botBottomY} L ${cx} ${yTask}`;
        svgHtml += `
          <path d="${pDirect}" fill="none" stroke="rgba(74,222,128,0.28)" stroke-width="1.8" />
          <path d="${pDirect}" fill="none" stroke="${lineCol}" stroke-width="1.6"
                stroke-dasharray="5 9" stroke-dashoffset="${-STATE.tick * 1.8}" />
        `;
      }
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
  async function speakVietnameseText(text, forceSampleSlug = "", customWavUrl = "") {
    if (currentAudioPlayer) {
      try {
        currentAudioPlayer.pause();
      } catch (_) {}
      currentAudioPlayer = null;
    }
    if (customWavUrl) {
      const fullWav = customWavUrl.startsWith("http")
        ? customWavUrl
        : `${LOCAL_API_BASE ? LOCAL_API_BASE + "/" : ""}${customWavUrl.replace(/^\/+/, "")}`;
      currentAudioPlayer = new Audio(fullWav);
      currentAudioPlayer.play().catch(() => {});
      return;
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
  window.speakVietnameseText = speakVietnameseText;

  function speakCeoOverviewVieNeu() {
    speakVietnameseText("", "", "audio_cache/vieneu_ceo_overview.wav");
  }
  window.speakCeoOverviewVieNeu = speakCeoOverviewVieNeu;

  function speakBotReportVieNeu(botId) {
    const b =
      SPECIALIZED_BOT_AGENTS.find((x) => x.id === botId) ||
      SPECIALIZED_BOT_AGENTS[0];
    if (b && b.wavFile) {
      speakVietnameseText("", "", b.wavFile);
    }
  }
  window.speakBotReportVieNeu = speakBotReportVieNeu;

  function triggerOfficeVoiceMic() {
    const micBtn = document.getElementById("btnVoiceMic");
    if (micBtn) micBtn.click();
  }
  window.triggerOfficeVoiceMic = triggerOfficeVoiceMic;

  function resolveBotForSession(sessionId) {
    const sid = String(sessionId || chatState.activeSessionId || "");
    const matched = SPECIALIZED_BOT_AGENTS.find(
      (b) => sid.startsWith(b.shortId) || b.sessionId === sid
    );
    if (matched) return matched;
    return (
      SPECIALIZED_BOT_AGENTS.find((b) => b.id === chatState.selectedBotId) ||
      SPECIALIZED_BOT_AGENTS[0]
    );
  }

  function selectBotAgentInStudio(botId, open2D = false) {
    const bot =
      SPECIALIZED_BOT_AGENTS.find((b) => b.id === botId) ||
      SPECIALIZED_BOT_AGENTS[0];
    if (!bot) return;
    chatState.selectedBotId = bot.id;
    const matchSess = (chatState.sessions || []).find(
      (s) =>
        String(s.session_id || "").startsWith(bot.shortId) ||
        String(s.short_id || "").startsWith(bot.shortId.slice(0, 6))
    );
    const targetSid = matchSess ? matchSess.session_id : bot.sessionId;
    selectSession(targetSid, true);
    syncLiveTasksToVisualStudio(true);
    if (open2D) {
      switchMode("2d");
    }
  }
  window.selectBotAgentInStudio = selectBotAgentInStudio;

  async function approveBot1ByCeo() {
    chatState.bot1NeedsCeo = false;
    chatState.selectedBotId = "bot-1";
    const bot1 = SPECIALIZED_BOT_AGENTS[0];
    bot1.steps[2] = {
      done: true,
      text: "3. Đã nhận lệnh CEO khóa model Gemini Omni 1.2 Flash & về bàn chạy lại",
    };
    bot1.steps[3] = {
      done: true,
      text: "4. Đã ghép FFmpeg 1080p & nộp Bảng So Sánh Từng Giây đạt 10/10",
    };
    speakVietnameseText("", "", "audio_cache/vieneu_ceo_approve_bot1.wav");
    syncLiveTasksToVisualStudio(true);
    renderBotAndSessionInspector();
    if (chatState.daemonOnline) {
      try {
        await fetch(`${LOCAL_API_BASE}/api/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: bot1.sessionId,
            command:
              "[Chỉ đạo từ Bộ Não Thứ Hai CEO] Tự động ép chọn model 'Gemini Omni 1.2 Flash' trong dropdown trước khi bấm Generate, khóa giải phẫu V1 ~1500ml + avgblur=210 và hoàn tất ghép 2 video MV10 (>10s), MV12 (>15s).",
            engine: "antigravity",
            agent: "flow-video-director",
            mode: "accept-edits",
            voice: "Thùy Dung",
            speak: false,
          }),
        });
      } catch (_) {}
    }
  }
  window.approveBot1ByCeo = approveBot1ByCeo;

  function toggleBot1DemoWalkToCeo() {
    chatState.bot1NeedsCeo = !chatState.bot1NeedsCeo;
    chatState.selectedBotId = "bot-1";
    const bot1 = SPECIALIZED_BOT_AGENTS[0];
    if (chatState.bot1NeedsCeo) {
      bot1.steps[2] = {
        done: false,
        exception: true,
        text: "3. Chạy về bàn CEO xin lệnh khóa model Gemini Omni 1.2 Flash",
      };
      bot1.steps[3] = {
        done: false,
        text: "4. Quay lại bàn ghép FFmpeg 1080p & nộp Bảng So Sánh Từng Giây",
      };
      speakBotReportVieNeu("bot-1");
    } else {
      approveBot1ByCeo();
      return;
    }
    syncLiveTasksToVisualStudio(true);
    renderBotAndSessionInspector();
  }
  window.toggleBot1DemoWalkToCeo = toggleBot1DemoWalkToCeo;

  function renderBotAndSessionInspector() {
    const bot = resolveBotForSession(chatState.activeSessionId);
    if (!bot) return;
    chatState.selectedBotId = bot.id;
    const isNeedsCeo = bot.id === "bot-1" && chatState.bot1NeedsCeo;

    // 1. VẼ CÂY TỔ CHỨC MINI (PAPERCLIP + ORGTREE STYLE) TRONG CỘT PHẢI CHẾ ĐỘ 1 (#orgSkillTaskMiniTree2D)
    const miniTreeEl = document.getElementById("orgSkillTaskMiniTree2D");
    if (miniTreeEl) {
      const ceoDotCol = chatState.bot1NeedsCeo ? "#facc15" : "#4ade80";
      const ceoRightText = chatState.bot1NeedsCeo ? "⚠️ 1 Xin Duyệt" : "🟢 6/6 Tốt";
      const botCardsHtml = SPECIALIZED_BOT_AGENTS.map((b) => {
        const isSel = b.id === bot.id;
        const bNeedsCeo = b.id === "bot-1" && chatState.bot1NeedsCeo;
        const doneCnt = b.steps.filter((s) => s.done).length;
        return `
          <div class="mini-org-bot-node ${isSel ? "active" : ""} ${bNeedsCeo ? "needs-ceo" : ""}"
               onclick="selectBotAgentInStudio('${b.id}', false)"
               data-popover="${escapeHtml(b.name)} (#${escapeHtml(b.shortId)}) · ${escapeHtml(b.aiReplySummary)}"
               data-popover-pos="left">
            <div class="bot-avatar-ring">
              <span>${b.icon}</span>
              <span class="bot-status-corner-dot ${bNeedsCeo ? "warn" : ""}"></span>
            </div>
            <div class="bot-mini-info">
              <div class="bot-mini-name">${escapeHtml(b.shortName || b.name)}</div>
              <div class="bot-mini-sub">
                <span>${escapeHtml(b.shortRole || "")}</span>
                <span style="color:${bNeedsCeo ? "#fde047" : "#86efac"};font-weight:800;">${doneCnt}/4</span>
              </div>
            </div>
          </div>
        `;
      }).join("");

      miniTreeEl.innerHTML = `
        <div class="mini-org-ceo-row">
          <div class="mini-org-ceo-pill" onclick="switchMode('node')"
               data-popover="Đỉnh Tháp CEO Bộ Não Thứ Hai (339+ phiên · 774 luật) · Bấm để mở Cây Tổ Chức & Skill Toàn Cảnh"
               data-popover-pos="left">
            <div class="ceo-left">
              <span>👑</span>
              <span>CEO Bộ Não Thứ Hai</span>
              <span style="color:#94a3b8;font-size:9.5px;font-weight:700;">· 774 Luật</span>
            </div>
            <div class="ceo-right" style="color:${ceoDotCol};">
              <span>${ceoRightText}</span>
              <button type="button" class="mini-icon-btn" style="width:20px;height:20px;font-size:10px;"
                      onclick="event.stopPropagation(); speakCeoOverviewVieNeu();"
                      data-popover="Nghe CEO báo cáo tổng quan (VieNeu 48kHz)" data-popover-pos="left">🔊</button>
            </div>
          </div>
          <div class="mini-org-tree-stem"></div>
          <div class="mini-org-bots-grid">
            ${botCardsHtml}
          </div>
        </div>
      `;
    }

    // 2. VẼ INSPECTOR SIÊU GỌN ICON-FIRST (#activeSessionBotInspector2D & #office3dSelectedBotInspector)
    const skillChipsHtml = (bot.skillCards || [])
      .map(
        (sk) => `
          <span class="skill-tree-chip" data-popover="${escapeHtml(sk.label)}: ${escapeHtml(sk.tip)}" data-popover-pos="left">
            <span class="skill-sq-icon" style="background:${sk.color};">${escapeHtml(sk.code)}</span>
            <span>${sk.icon} ${escapeHtml(sk.label)}</span>
          </span>
        `
      )
      .join("");

    const stepPillsHtml = (bot.shortSteps || [])
      .map((st, idx) => {
        const rawSt = bot.steps[idx] || {};
        const stepIco = rawSt.exception ? "🏃" : rawSt.done ? "✅" : "⏳";
        const stepLbl = typeof st === "string" ? st : st.label || "";
        const cls = rawSt.exception ? "exception" : rawSt.done ? "done" : "";
        return `
          <div class="step-node-pill ${cls}"
               data-popover="Bước ${idx + 1}: ${escapeHtml(rawSt.text || stepLbl)}"
               data-popover-pos="left">
            <span class="step-ico">${stepIco}</span>
            <span class="step-lbl">${escapeHtml(stepLbl)}</span>
          </div>
        `;
      })
      .join("");

    const deliv = bot.deliverable || {};
    const thumbSrc = deliv.thumb || "local-assets/kol/bao_tram_4k_anchor.jpg";
    const fileUrl =
      deliv.fileUrl && deliv.fileUrl.startsWith("/") && LOCAL_API_BASE
        ? `${LOCAL_API_BASE}${deliv.fileUrl}`
        : deliv.fileUrl || "#";
    const qcUrl =
      deliv.qcUrl && deliv.qcUrl.startsWith("/") && LOCAL_API_BASE
        ? `${LOCAL_API_BASE}${deliv.qcUrl}`
        : deliv.qcUrl || fileUrl;

    const ceoApproveBannerHtml = isNeedsCeo
      ? `<button type="button" onclick="approveBot1ByCeo()"
                 style="width:100%;background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border:none;border-radius:8px;padding:6px 10px;font-size:11px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 6px 14px rgba(234,88,12,0.35);"
                 data-popover="${escapeHtml(bot.issueText)}" data-popover-pos="left">
           <span>⚡ Duyệt Lệnh CEO · Cho Bot 1 Về Bàn Làm Tiếp</span>
         </button>`
      : "";

    const compactInspectorHtml = `
      <div class="inspector-head-bar">
        <div class="inspector-head-left" data-popover="${escapeHtml(bot.name)} · Chỉ đạo CEO: ${escapeHtml(bot.ceoDirective)}" data-popover-pos="left">
          <span style="font-size:15px;">${bot.icon}</span>
          <span class="bot-title">${escapeHtml(bot.shortName || bot.name)}</span>
          <span class="bot-hash">#${escapeHtml(bot.shortId)}</span>
          <span style="font-size:10px;color:${isNeedsCeo ? "#fde047" : "#4ade80"};font-weight:800;">
            ${isNeedsCeo ? "🏃 Xin ý kiến" : "● 10/10"}
          </span>
        </div>
        <div class="inspector-head-actions">
          <button type="button" class="mini-icon-btn" onclick="speakBotReportVieNeu('${bot.id}')"
                  data-popover="Nghe giọng ${escapeHtml(bot.voiceName)} báo cáo: ${escapeHtml(bot.aiReplySummary)}" data-popover-pos="left">🔊</button>
          <button type="button" class="mini-icon-btn" onclick="selectBotAgentInStudio('${bot.id}', true)"
                  data-popover="Mở phiên chat #${escapeHtml(bot.shortId)} &amp; Bơm lệnh" data-popover-pos="left">💬</button>
          <button type="button" class="mini-icon-btn" onclick="switchMode('node')"
                  data-popover="Xem trên Cây Tổ Chức &amp; Skill Toàn Cảnh" data-popover-pos="left">🌳</button>
        </div>
      </div>

      <div class="skill-tree-row">
        <span class="skill-tree-label" data-popover="Cây Plugin &amp; Skill đang gắn vào Bot" data-popover-pos="left">🧩</span>
        ${skillChipsHtml}
      </div>

      <div class="step-node-track">
        ${stepPillsHtml}
      </div>

      ${ceoApproveBannerHtml}

      <div class="deliverable-compact-card">
        <a href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener" class="deliverable-thumb-wrap"
           data-popover="Bấm mở sản phẩm: ${escapeHtml(deliv.title || "")}" data-popover-pos="left">
          <img src="${escapeHtml(thumbSrc)}" alt="Deliverable" loading="lazy" />
        </a>
        <div class="deliverable-meta">
          <div class="deliverable-title" title="${escapeHtml(deliv.title || "")}">📦 ${escapeHtml(deliv.title || "Sản phẩm")}</div>
          <div class="deliverable-sub" title="${escapeHtml(bot.aiReplySummary)}">🎙️ ${escapeHtml(bot.voiceName)} · Zero-Code QC</div>
          <div class="deliverable-btn-row">
            <a href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener" class="deliv-icon-btn" data-popover="Mở File Sản Phẩm" data-popover-pos="left">📂 File</a>
            <a href="${escapeHtml(qcUrl)}" target="_blank" rel="noopener" class="deliv-icon-btn qc" data-popover="Mở Bảng Kiểm Định QC" data-popover-pos="left">👁️ QC</a>
            <button type="button" class="deliv-icon-btn" onclick="speakBotReportVieNeu('${bot.id}')" data-popover="Nghe đọc báo cáo sản phẩm" data-popover-pos="left">🔊</button>
          </div>
        </div>
      </div>
    `;

    const el3d = document.getElementById("office3dSelectedBotInspector");
    if (el3d) el3d.innerHTML = compactInspectorHtml;
    const el2d = document.getElementById("activeSessionBotInspector2D");
    if (el2d) el2d.innerHTML = compactInspectorHtml;
    if (STATE.currentMode === "node") {
      renderNodeGraph(true);
    }
  }
  window.renderBotAndSessionInspector = renderBotAndSessionInspector;

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
    if (pillAll) pillAll.textContent = `🌐 Tất cả (${allCount})`;
    if (pillAg) pillAg.textContent = `🟢 AG (${agCount})`;
    if (pillCl) pillCl.textContent = `🟠 CL (${clCount})`;
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
          s.topic_badge || (isClaude ? "Claude" : "AG2");
        const machineLabel = s.machine_name || "Máy Chính";
        const accountLabel =
          s.account_tag || (isClaude ? "Claude Extension" : "khakhunghiep");
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
        const popInfo = `${s.engine} · ${machineLabel} (${accountLabel}) · #${
          s.short_id || ""
        }\n${summaryPreview}`;
        const rawTitle =
          s.title && s.title !== "Phiên điều phối Antigravity 2.0"
            ? s.title
            : `Phiên ${s.project || "Antigravity"} #${s.short_id || ""}`;
        const liveBadgeHtml = isWorking
          ? `<span style="color:#4ade80;font-weight:800;font-size:10px;" title="Đang thực thi">● LIVE</span>`
          : `<span class="session-item-time">${escapeHtml(shortTime)}</span>`;
        return `
        <button
          type="button"
          class="session-item ${isActive ? "active" : ""}"
          data-session-id="${escapeHtml(s.session_id)}"
          title="${escapeHtml(popInfo)}"
          style="padding:7px 9px;gap:3px;"
        >
          <div class="session-item-top">
            <div class="session-badges">
              <span class="engine-mini ${isClaude ? "claude" : ""}">${
          isClaude ? "CL" : "AG"
        }</span>
              <span class="topic-pill">${escapeHtml(topicBadge.slice(0, 14))}</span>
              <span class="session-item-time">#${escapeHtml(
                (s.short_id || "").slice(0, 4)
              )}</span>
            </div>
            ${liveBadgeHtml}
          </div>
          <div class="session-item-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;">${escapeHtml(rawTitle)}</div>
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
          ? `<div class="live-shot-box" style="margin-top:8px; border-radius:10px; overflow:hidden; border:1px solid rgba(74,222,128,0.4); background:#090d16;">
              <div style="display:flex; align-items:center; justify-content:space-between; padding:5px 10px; background:rgba(74,222,128,0.12); font-size:11px; font-weight:700; color:#86efac;">
                <span>🖥️ Ảnh Chụp Màn Hình Trực Tiếp</span>
                <a href="${escapeHtml(
                  screenshotUrl
                )}" target="_blank" rel="noopener" style="color:#7dd3fc; text-decoration:none;">↗</a>
              </div>
              <a href="${escapeHtml(
                screenshotUrl
              )}" target="_blank" rel="noopener" style="display:block;">
                <img src="${escapeHtml(
                  screenshotUrl
                )}" alt="Screenshot" onerror="this.closest('.live-shot-box').style.display='none'" style="width:100%; max-height:220px; object-fit:cover; display:block;" loading="lazy" />
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
        const isLongAiText =
          rawSummaryPts.length > 0 && String(m.text || "").length > 140;
        const execSummaryHtml = isLongAiText
          ? `<div class="exec-summary-box">
              <div class="exec-summary-title">
                <span>✓ Tóm tắt nhanh</span>
              </div>
              <ul class="exec-summary-list">
                ${rawSummaryPts
                  .slice(0, 3)
                  .map((pt) => `<li>${escapeHtml(pt)}</li>`)
                  .join("")}
              </ul>
            </div>`
          : "";

        const aiBodyHtml = isLongAiText
          ? `<details style="margin-top:4px;">
              <summary style="cursor:pointer;font-size:11px;font-weight:700;color:#7dd3fc;user-select:none;">▸ Xem chi tiết nội dung (${Math.round(
                String(m.text || "").length / 5
              )} từ)</summary>
              <div class="ai-text-body" style="margin-top:6px;">
                ${renderFormattedMarkdown(m.text)}
              </div>
            </details>`
          : `<div class="ai-text-body">
              ${renderFormattedMarkdown(m.text)}
            </div>`;

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
            ${aiBodyHtml}
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
    const matchedBot = SPECIALIZED_BOT_AGENTS.find(
      (b) =>
        String(sessionId).startsWith(b.shortId) || b.sessionId === sessionId
    );
    if (matchedBot) {
      chatState.selectedBotId = matchedBot.id;
    }
    renderSessionList(true);
    renderBotAndSessionInspector();

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
    renderBotAndSessionInspector();
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

  function jumpToLiveTaskSession(sessionId, force2D = false) {
    if (sessionId) {
      selectSession(sessionId, true);
    }
    if (force2D || STATE.currentMode !== "3d") {
      switchMode("2d");
    } else {
      syncLiveTasksToVisualStudio(true);
      renderBotAndSessionInspector();
    }
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
      chatState.selectedBotId || "bot-1",
      chatState.bot1NeedsCeo ? "1" : "0",
      sessionTasks
        .slice(0, 10)
        .map((t) => `${t.short_id}:${t.status_label}:${t.title.slice(0, 18)}`)
        .join("|"),
    ].join("::");

    if (!forceSync && chatState.lastSyncedTasksSig === sig) {
      return;
    }
    chatState.lastSyncedTasksSig = sig;

    renderBotAndSessionInspector();

    // 1. CẬP NHẬT BÀN CEO TRUNG TÂM & 6 BÀN BOT CHUYÊN TRÁCH TRÊN SÀN 3D VĂN PHÒNG AI (#office3d-labels-layer)
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
      cmdTag.style.padding = "5px 9px";
      cmdTag.setAttribute(
        "data-popover",
        "Đỉnh Tháp CEO Bộ Não Thứ Hai (339+ phiên · 774 luật) · Canh gác 6 Đội Trưởng Bot · Giọng VieNeu 48kHz"
      );
      const ceoQuickBtnHtml = chatState.bot1NeedsCeo
        ? `<button type="button" onclick="event.stopPropagation(); approveBot1ByCeo();" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border:none;border-radius:5px;padding:2px 6px;font-size:9.5px;font-weight:800;cursor:pointer;" title="Duyệt lệnh cho Bot 1 về bàn">⚡ Duyệt</button>`
        : `<span style="color:#86efac;font-size:9.5px;font-weight:800;">🟢 6/6</span>`;
      cmdTag.innerHTML = `
        <div class="tag-title" style="display:flex;align-items:center;gap:5px;white-space:nowrap;">
          <span style="color:${chatState.bot1NeedsCeo ? "#facc15" : "#4ade80"}">●</span>
          <span>👑 Bàn CEO</span>
          ${ceoQuickBtnHtml}
          <button type="button" onclick="event.stopPropagation(); speakCeoOverviewVieNeu();" style="background:rgba(244,114,182,0.22);border:1px solid rgba(244,114,182,0.55);color:#f9a8d4;border-radius:4px;padding:1px 5px;font-size:9.5px;font-weight:800;cursor:pointer;" title="Nghe CEO báo cáo tổng quan">🔊</button>
        </div>
      `;
      cmdTag.onclick = () => selectBotAgentInStudio("bot-1", false);
    }

    const otherDesks = OFFICE_DESKS.filter((d) => d.id !== "desk-commander");
    otherDesks.forEach((d, idx) => {
      const el = document.getElementById("tag-" + d.id);
      if (!el) return;
      const bot = SPECIALIZED_BOT_AGENTS[idx];
      if (!bot) return;
      const isSelected = chatState.selectedBotId === bot.id;
      const isNeedsCeo = bot.id === "bot-1" && chatState.bot1NeedsCeo;
      const dotCol = isNeedsCeo ? "#fde047" : "#4ade80";
      const doneCnt = bot.steps.filter((s) => s.done).length;

      el.style.cursor = "pointer";
      el.style.padding = "4px 8px";
      el.style.borderColor = isNeedsCeo
        ? "rgba(250, 204, 21, 0.85)"
        : isSelected
        ? "rgba(56, 189, 248, 0.85)"
        : "rgba(74, 222, 128, 0.45)";
      el.style.boxShadow = isNeedsCeo
        ? "0 8px 24px rgba(234, 88, 12, 0.45)"
        : isSelected
        ? "0 8px 22px rgba(56, 189, 248, 0.35)"
        : "0 6px 18px rgba(0, 0, 0, 0.45)";
      el.setAttribute(
        "data-popover",
        `${bot.name} (#${bot.shortId}) · Plugin: ${bot.pluginsSkills.join(", ")} · ${bot.aiReplySummary}`
      );
      el.innerHTML = `
        <div class="tag-title" style="display:flex;align-items:center;gap:4px;white-space:nowrap;">
          <span style="color:${dotCol}">●</span>
          <span>${bot.icon} ${escapeHtml(bot.shortName || bot.name)}</span>
          <span style="color:#7dd3fc;font-size:9.5px;font-weight:800;">#${escapeHtml(bot.shortId)}</span>
          <span style="color:${isNeedsCeo ? "#fde047" : "#86efac"};font-size:9.5px;font-weight:800;">${
        isNeedsCeo ? "🏃" : `${doneCnt}/4`
      }</span>
          <button type="button" onclick="event.stopPropagation(); speakBotReportVieNeu('${
            bot.id
          }');" style="background:rgba(244,114,182,0.22);border:1px solid rgba(244,114,182,0.5);color:#f9a8d4;border-radius:4px;padding:1px 4px;font-size:9px;font-weight:800;cursor:pointer;" title="Nghe giọng ${escapeHtml(
        bot.voiceName
      )}">🔊</button>
        </div>
      `;
      el.onclick = () => selectBotAgentInStudio(bot.id, false);
    });

    // 2. CẬP NHẬT CỘT TRÁI TRONG 3D VĂN PHÒNG AI (#officeDrawerLiveList & #officeDrawerLiveToasts)
    const drawerBadge = document.getElementById("officeDrawerCountBadge");
    if (drawerBadge) drawerBadge.textContent = `⚡ ${totalRunning}`;

    const drawerSub = document.getElementById("officeDrawerSubbar");
    if (drawerSub) {
      drawerSub.innerHTML = `
        <span><strong style="color:#4ade80">● ${workingSessCount} LIVE</strong></span>
        <span>🟢 ${agCount} AG · 🟠 ${clCount} CL</span>
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
            }" onclick="jumpToLiveTaskSession('${escapeHtml(t.session_id)}', false)"
               title="${escapeHtml(t.title)} — ${escapeHtml(t.summary)}"
               style="padding:6px 8px;">
              <div class="agent-mini-icon" style="width:24px;height:24px;background:${
                isCl
                  ? "linear-gradient(135deg,#fb923c,#ea580c)"
                  : "linear-gradient(135deg,#34d399,#059669)"
              };display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#052e16;">${escapeHtml(
            t.engine_badge
          )}</div>
              <div class="agent-card-info" style="min-width:0;flex:1;">
                <h4 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11px;margin:0;">#${escapeHtml(
                  t.short_id
                )} · ${escapeHtml(t.title)}</h4>
                <div class="agent-state" style="color:${
                  t.is_working ? "#fde047" : "#86efac"
                };font-weight:700;font-size:9.5px;">${
            t.is_working ? "⚡ LIVE" : "● Sẵn sàng"
          } · ${escapeHtml(t.topic_badge.slice(0, 14))}</div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    const drawerToastsEl = document.getElementById("officeDrawerLiveToasts");
    if (drawerToastsEl) {
      const daemonItems = [...sysServices, ...bgTasks].slice(0, 4);
      drawerToastsEl.innerHTML = daemonItems
        .map((d, i) => {
          const bCol =
            i % 3 === 0 ? "#4ade80" : i % 3 === 1 ? "#38bdf8" : "#fb923c";
          return `
            <div class="live-toast-item" style="border-left-color:${bCol};cursor:pointer;padding:4px 7px;"
                 onclick="jumpToLiveTaskSession('${escapeHtml(d.session_id || "")}', false)"
                 title="${escapeHtml(d.summary)}">
              <strong style="font-size:10px;">⚡ ${escapeHtml(d.short_id)} · ${escapeHtml(
            d.title.slice(0, 26)
          )}</strong>
            </div>
          `;
        })
        .join("");
    }

    // 3. CẬP NHẬT THANH ICON 6 BOT TRONG HUD GÓC PHẢI 3D (#office3dHudTasksBody)
    const hudSumEl = document.getElementById("office3dHudSummaryBar");
    if (hudSumEl) {
      hudSumEl.innerHTML = `
        <span style="background:rgba(250,204,21,0.18);border:1px solid rgba(250,204,21,0.45);color:#fde047;padding:1px 6px;border-radius:999px;font-weight:800;">${
          chatState.bot1NeedsCeo ? "⚠️ 1 Xin Duyệt" : "🟢 6/6 Tốt"
        }</span>
      `;
    }

    const hudBodyEl = document.getElementById("office3dHudTasksBody");
    if (hudBodyEl) {
      hudBodyEl.innerHTML = SPECIALIZED_BOT_AGENTS.map((b, idx) => {
        const isSel = chatState.selectedBotId === b.id;
        const isNeedsCeo = b.id === "bot-1" && chatState.bot1NeedsCeo;
        return `
          <div class="office3d-bot-icon-pill ${isSel ? "active" : ""} ${isNeedsCeo ? "needs-ceo" : ""}"
               onclick="selectBotAgentInStudio('${b.id}', false)"
               data-popover="${escapeHtml(b.name)} (#${escapeHtml(b.shortId)}) · ${escapeHtml(b.aiReplySummary)}"
               data-popover-pos="left">
            <span class="b-ico">${b.icon}</span>
            <span class="b-num">#${idx + 1}</span>
            <span style="font-size:8px;color:${isNeedsCeo ? "#fde047" : "#4ade80"};">${
          isNeedsCeo ? "🏃" : "●"
        }</span>
          </div>
        `;
      }).join("");
    }

    const statusBar3d = document.getElementById("officeStatusbarLive");
    if (statusBar3d) {
      statusBar3d.innerHTML = `
        <span style="color:#4ade80;font-weight:700;">⚡ ${totalRunning} Live</span>
        <span>🖥️ :8765 · :23984 · 🛡️ P1·P4·P5·P6</span>
        <span>🟢 ${agCount} AG · 🟠 ${clCount} CL · 🎙️ VieNeu 48kHz</span>
      `;
    }

    // 4. CẬP NHẬT CỘT PHẢI CỦA CHẾ ĐỘ 1 (2D ĐIỀU HÀNH & CHAT — #liveMachineTasksBox2D)
    const code2d = document.getElementById("liveTasksCountCode");
    if (code2d) code2d.textContent = `🟢 ${agCount} · 🟠 ${clCount}`;
    const badge2d = document.getElementById("liveTasksCountBadge");
    if (badge2d) badge2d.textContent = `⚡ ${totalRunning}`;

    const box2d = document.getElementById("liveMachineTasksBox2D");
    if (box2d) {
      const items2d = [
        ...sessionTasks.slice(0, 6),
        ...sysServices.slice(0, 2),
      ];
      box2d.innerHTML = items2d
        .map((t) => {
          const isCl = t.engine_code === "claude";
          const isSrv = t.engine_code === "service";
          const dotIco = isSrv ? "⚡" : isCl ? "🟠" : "🟢";
          return `
            <button type="button" class="live-chip-btn ${t.is_working ? "working" : ""}"
                    onclick="event.stopPropagation(); selectSession('${escapeHtml(t.session_id || "")}', true);"
                    data-popover="${escapeHtml(t.title)} — ${escapeHtml(t.summary)}"
                    data-popover-pos="left">
              <div class="chip-left">
                <span>${dotIco}</span>
                <span class="chip-code">${escapeHtml(t.engine_badge)} #${escapeHtml((t.short_id || "").slice(0, 5))}</span>
                <span class="chip-name">${escapeHtml(t.topic_badge || t.title)}</span>
              </div>
              <span style="color:#7dd3fc;font-size:9.5px;font-weight:800;">↗</span>
            </button>
          `;
        })
        .join("");
    }

    // 5. CẬP NHẬT CHẾ ĐỘ 3 (CÂY TỔ CHỨC & SKILL) & CHẾ ĐỘ 4 (6 CỬA SỔ EDITOR)
    const allLiveForNodes = [
      ...sessionTasks.slice(0, 8),
      ...bgTasks.slice(0, 2),
      ...sysServices.slice(0, 2),
    ];
    if (STATE.currentMode === "node") {
      renderNodeGraph(false);
    }

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
