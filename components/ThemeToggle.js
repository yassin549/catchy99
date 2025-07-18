import { useTheme } from '@/context/ThemeContext'

const ThemeToggle = () => {
  const { toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full bg-glass-light text-white hover:bg-glass-medium transition-colors'
    >
      Toggle Theme
    </button>
  )
}

export default ThemeToggle
