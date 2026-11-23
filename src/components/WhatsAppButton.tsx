const WHATSAPP_URL = 'https://wa.me/2348120943176?text=Hello%2C%20I%20visited%20the%20Ebenezer%20Concert%20website%20and%20would%20like%20to%20make%20an%20enquiry.'

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition duration-200 hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300/50 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Chat with us on WhatsApp
      </span>
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.49 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.66a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89a11.82 11.82 0 0 0-3.43-8.42ZM12.06 21.8h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.44-9.9 9.9-9.9a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 7c0 5.46-4.44 9.9-9.89 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  )
}
