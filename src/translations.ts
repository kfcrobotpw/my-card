export type Language = 'ko' | 'en';

export interface TranslationStrings {
  cardType: string;
  pilotBadge: string;
  roleLabel: string;
  affiliationLabel: string;
  teamLabel: string;
  barcodeCode: string;
  backFace: string;
  frontFace: string;
  bioHeader: string;
  bioSubheader: string;
  linksHeader: string;
  linksSubheader: string;
  channelsLabel: string;
  youtubeTitle: string;
  youtubeSubtitle: string;
  portfolioTitle: string;
  qrActive: string;
  viewQr: string;
  youtubeQrPass: string;
  portfolioQrPass: string;
  qrCodeSuffix: string;
  enlargeQr: string;
  scanPrompt: string;
  noUrl: string;
  ready: string;
  active: string;
  scanWithCamera: string;
  copy: string;
  copied: string;
  openInNewTab: string;
  close: string;
  adminHint: string;
  adminAuthActive: string;
  adminLoggedBanner: string;
  editButton: string;
  logoutButton: string;
  langChanged: string;
  noLinks: string;
}

export const translations: Record<Language, TranslationStrings> = {
  ko: {
    cardType: "로봇 파일럿 (ROBOT PILOT)",
    pilotBadge: "PILOT #01",
    roleLabel: "역할",
    affiliationLabel: "AFFILIATION",
    teamLabel: "TEAM DIVISION",
    barcodeCode: "SEC-CODE: KFC-WRO-2026",
    backFace: "뒷면",
    frontFace: "앞면",
    bioHeader: "한 줄 소개",
    bioSubheader: "BIO STATEMENT",
    linksHeader: "활동 링크",
    linksSubheader: "(클릭 시 QR 코드 표시)",
    channelsLabel: "AUTHENTICATED CHANNELS",
    youtubeTitle: "YouTube 영상",
    youtubeSubtitle: "로봇 주행 및 시연 클립",
    portfolioTitle: "포트폴리오",
    qrActive: "QR 표시 중",
    viewQr: "QR 보기",
    youtubeQrPass: "YOUTUBE QR PASS",
    portfolioQrPass: "PORTFOLIO QR PASS",
    qrCodeSuffix: "QR 코드",
    enlargeQr: "확대 보기",
    scanPrompt: "스캔 시 즉시 연결",
    noUrl: "등록된 URL 없음",
    ready: "SYS: READY",
    active: "ADMIN: ACTIVE",
    scanWithCamera: "스마트폰 기본 카메라로 스캔하여 접속",
    copy: "복사",
    copied: "복사됨",
    openInNewTab: "새 탭에서 바로 열기",
    close: "닫기",
    adminHint: "단축키 [Ctrl + Shift + A] 또는 클릭 시 관리자 로그인",
    adminAuthActive: "관리자 인증됨 (/admin)",
    adminLoggedBanner: "관리자 계정으로 로그인되어 있습니다. (수정 가능)",
    editButton: "수정하기",
    logoutButton: "[ESC] 로그아웃",
    langChanged: "한국어로 변경되었습니다.",
    noLinks: "등록된 활동 링크가 없습니다.",
  },
  en: {
    cardType: "ROBOT PILOT (WRO 2026)",
    pilotBadge: "PILOT #01",
    roleLabel: "ROLE",
    affiliationLabel: "AFFILIATION",
    teamLabel: "TEAM DIVISION",
    barcodeCode: "SEC-CODE: KFC-WRO-2026",
    backFace: "BACK",
    frontFace: "FRONT",
    bioHeader: "Bio Statement",
    bioSubheader: "ABOUT THE PILOT",
    linksHeader: "Activity Links",
    linksSubheader: "(Click for QR Pass)",
    channelsLabel: "AUTHENTICATED CHANNELS",
    youtubeTitle: "YouTube Channel",
    youtubeSubtitle: "Robot driving & demo clips",
    portfolioTitle: "Portfolio",
    qrActive: "QR Active",
    viewQr: "View QR",
    youtubeQrPass: "YOUTUBE QR PASS",
    portfolioQrPass: "PORTFOLIO QR PASS",
    qrCodeSuffix: "QR Code",
    enlargeQr: "Enlarge QR",
    scanPrompt: "Scan to open instantly",
    noUrl: "No URL Registered",
    ready: "SYS: READY",
    active: "ADMIN: ACTIVE",
    scanWithCamera: "Scan with your smartphone camera to visit",
    copy: "Copy",
    copied: "Copied",
    openInNewTab: "Open in New Tab",
    close: "Close",
    adminHint: "Press [Ctrl + Shift + A] or click to access Admin Login",
    adminAuthActive: "Admin Authenticated (/admin)",
    adminLoggedBanner: "Logged in as Administrator (Editable)",
    editButton: "Edit Profile",
    logoutButton: "[ESC] Log out",
    langChanged: "Language changed to English.",
    noLinks: "No activity links registered.",
  },
};
