import LanguageToggle from '../LanguageToggle'
import ThemeToggle from '../ThemeToggle'

const Header = () => {
  return (
    <header className='h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-full'>
      <h1 className="text-lg font-medium text-slate-800 dark:text-slate-200">{"Event Management"}</h1>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

    </header>
  )
}

export default Header