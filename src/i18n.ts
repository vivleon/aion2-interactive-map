// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { parse } from "yaml";
import { getBackendLoadPath } from "./hooks/useDataMode"; 
// ---- Language config --------------------------------------

export type LanguageCode = "en" | "zh-CN" | "zh-TW" | "ko";

export const SUPPORTED_LANGUAGES: LanguageCode[] = [
  "en",
  "zh-CN",
  "zh-TW",
  "ko",
];

// ---- i18n initialization -----------------------------------

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: "zh-CN", // 기본 언어를 강제로 설정하고 싶으면 주석 해제
    fallbackLng: "zh-CN", // 번역 실패 시 보여줄 언어
    supportedLngs: SUPPORTED_LANGUAGES,

    ns: ["common", "maps", "types", "regions"],
    defaultNS: "common",

    detection: {
      // order of detection
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      // caches to store detected language
      caches: ["localStorage"],
    },

    backend: {
      loadPath: getBackendLoadPath(),
      parse: (data: string) => parse(data),
    },

    interpolation: {
      escapeValue: false,
    },

    // [중요] 하얀 화면(무한 로딩) 방지를 위해 Suspense 기능 끄기
    react: {
      useSuspense: false,
    },
  });

export default i18n;
