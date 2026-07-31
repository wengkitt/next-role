import { Check, Palette } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

export const DEFAULT_THEME = 'light'

export const ENABLED_THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'cupcake', label: 'Cupcake' },
  { value: 'bumblebee', label: 'Bumblebee' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'retro', label: 'Retro' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'halloween', label: 'Halloween' },
  { value: 'garden', label: 'Garden' },
  { value: 'forest', label: 'Forest' },
  { value: 'aqua', label: 'Aqua' },
  { value: 'lofi', label: 'Lofi' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'black', label: 'Black' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'cmyk', label: 'CMYK' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'business', label: 'Business' },
  { value: 'acid', label: 'Acid' },
  { value: 'lemonade', label: 'Lemonade' },
  { value: 'night', label: 'Night' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'winter', label: 'Winter' },
  { value: 'dim', label: 'Dim' },
  { value: 'nord', label: 'Nord' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'caramellatte', label: 'Caramellatte' },
  { value: 'abyss', label: 'Abyss' },
  { value: 'silk', label: 'Silk' },
] as const

type ThemeName = (typeof ENABLED_THEMES)[number]['value']

const isThemeName = (value: string | null): value is ThemeName =>
  ENABLED_THEMES.some((theme) => theme.value === value)

export function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('nextrole-theme')
    if (isThemeName(savedTheme)) {
      document.documentElement.dataset.theme = savedTheme
    }
  }, [])

  return null
}

export function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME)
  const menuId = useId()

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('nextrole-theme')
    if (isThemeName(savedTheme)) setTheme(savedTheme)
  }, [])

  function selectTheme(nextTheme: ThemeName) {
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem('nextrole-theme', nextTheme)
  }

  return (
    <details className="dropdown dropdown-end">
      <summary
        className="btn btn-ghost btn-sm btn-square"
        aria-label="Choose color theme"
        aria-controls={menuId}
      >
        <Palette aria-hidden="true" size={18} />
      </summary>
      <ul
        id={menuId}
        className="dropdown-content menu z-50 mt-3 w-44 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
        aria-label="Choose color theme"
      >
        {ENABLED_THEMES.map((availableTheme) => (
          <li key={availableTheme.value}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="theme-picker"
                value={availableTheme.value}
                className="theme-controller sr-only"
                checked={theme === availableTheme.value}
                onChange={() => selectTheme(availableTheme.value)}
              />
              <span className="flex-1">{availableTheme.label}</span>
              {theme === availableTheme.value && (
                <Check className="text-primary" aria-hidden="true" size={16} />
              )}
            </label>
          </li>
        ))}
      </ul>
    </details>
  )
}
