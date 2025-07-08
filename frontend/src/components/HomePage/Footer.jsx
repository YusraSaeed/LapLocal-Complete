const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* === MAIN FOOTER CONTENT === */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* === Logo and Description === */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Laplocal Logo"
                className="w-12 h-10"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Bringing you verified sellers, premium deals, and a better way to buy — all in one local platform.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447c0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.807.875 1.297 2.026 1.297 3.323 0 1.297-.49 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297zm7.83-9.404c-.49 0-.875-.385-.875-.875 0-.49.385-.875.875-.875.49 0 .875.385.875.875 0 .49-.385.875-.875.875zm-4.262 1.519c-1.519 0-2.747 1.228-2.747 2.747 0 1.519 1.228 2.747 2.747 2.747 1.519 0 2.747-1.228 2.747-2.747 0-1.519-1.228-2.747-2.747-2.747z" />
                </svg>
              </a>
            </div>
          </div>

          {/* === Laplocal Links === */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Laplocal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">About us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>

          {/* === Resources Links === */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Technical Support</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Test Spam</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Knowledge base</a></li>
            </ul>
          </div>

          {/* === Contact Info === */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <img src="/location-10.png" alt="Location" className="w-4 h-4" />
                <span className="text-sm text-gray-600">Gul Haji Plaza, Peshawar</span>
              </li>
              <li className="flex items-center space-x-2">
                <img src="/call-02.png" alt="Phone" className="w-4 h-4" />
                <span className="text-sm text-gray-600">614-602-4877</span>
              </li>
              <li className="flex items-center space-x-2">
                <img src="/mail-02.png" alt="Email" className="w-4 h-4" />
                <span className="text-sm text-gray-600">info@laplocal.io</span>
              </li>
            </ul>
          </div>
        </div>

        {/* === Bottom Section with Border === */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600">©2025 Laplocal - All Rights Reserved</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Use</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Service agreement</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer;
