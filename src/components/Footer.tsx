export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-16 py-8 border-t border-border bg-background/50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} A KF Production
        </p>
      </div>
    </footer>
  )
}