export type CardViewMode = 'horizontal' | 'vertical-cr80' | 'vertical-tech';
export type Language = 'ko' | 'en';

export interface StudentLinks {
  portfolio: string;
  youtube: string;
  instagram?: string | null;
}

export interface StudentData {
  cardType: string;
  cardTypeShort: string;
  org: string;
  team: string;
  name: string;
  nameEn: string;
  avatarText: string;
  avatarUrl?: string; // Hotlinkable image URL (HTML image hotlink)
  role: string;
  roleEn?: string;
  memberId: string;
  bio: string;
  bioEn?: string;
  themeColor: string;
  links: StudentLinks;
  qrTarget: string;
}

export const DEFAULT_STUDENT_DATA: StudentData = {
  cardType: "로봇 파일럿 (ROBOT PILOT)",
  cardTypeShort: "ROBOT PILOT",
  org: "K.F.C.",
  team: "K.F.C. F=ma",
  name: "장원우",
  nameEn: "JANG WON-WOO",
  avatarText: "장원",
  avatarUrl: "",
  role: "ROBOT CREATOR",
  roleEn: "ROBOT CREATOR & PILOT",
  memberId: "ID - 260814",
  bio: "상상한 로봇을 코드로 움직입니다.",
  bioEn: "Bringing imagined robots to life through code.",
  themeColor: "#00e5c0",
  links: {
    portfolio: "https://wro-2026-portfolio.vercel.app/",
    youtube: "https://www.youtube.com/watch?v=eIwyv0qFzb4",
    instagram: null,
  },
  qrTarget: "https://wro-2026-portfolio.vercel.app/",
};

export const SESSION_AUTH_KEY = 'robot_pilot_admin_auth';
export const ADMIN_PASSWORD = 'jangww9882!';
