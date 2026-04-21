// Composable for global settings state (menus, logo, footer data)
// Used in the default layout; accessible from any component via useGlobalSettings()

export interface GlobalSettings {
  setting: {
    mobile: string | null
    whatsapp: string | null
    contact_email: string | null
    facebook: string | null
    instagram: string | null
    twitter: string | null
    youtube: string | null
    tiktok: string | null
  }
  configration: {
    app_logo: string | null
    footer_logo: string | null
    fav_icon: string | null
    copy_rights_text: string | null
    footer_text: string | null
  } | null
  menus: Array<{
    id: number
    name: string
    name_ar: string
    name_en: string
    type: string
    type_value: string | null
    sub_menus: Array<{ id: number; name: string; type: string; type_value: string | null }>
  }>
  menu_services: Array<{ id: number; name: string; link: string; link_en: string; link_ar: string }>
  addresses: Array<{ address: string; share_map_url: string | null }>
}

export const useGlobalSettings = () =>
  useState<GlobalSettings | null>('global_settings', () => null)
