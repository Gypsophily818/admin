import defaultSettings from "@/settings";
// import i18n from '@/lang'

const title = defaultSettings.title || "Enliten";

export default function getPageTitle(key) {
  // const hasKey = i18n.te(`route.${key}`)
  const hasKey = `${key}`;
  if (hasKey) {
    const pageName = `${key}`;
    return `${pageName} - ${title}`;
  }
  return `${title}`;
}
