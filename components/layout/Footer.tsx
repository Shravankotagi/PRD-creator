import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-el-bg">
      {/* Rolling Belt Section */}
      <section className="belt-section" style={{ background: '#1535C9', padding: '2.5rem 0 3rem', overflow: 'hidden', position: 'relative' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Trusted by Fortune-Grade Global Leaders
        </p>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Restored: original Enlight Lab logo overlay on the left side of the belt */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10, background: '#1535C9', padding: '0 2rem 0 1.5rem', display: 'flex', alignItems: 'center', boxShadow: '8px 0 16px 8px #1535C9' }}>
            <img src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" alt="Enlight Lab" style={{ height: '24px', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          </div>
          
          {/* Edge gradient fading mask on the right edge */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10, width: '120px', background: 'linear-gradient(to left, #1535C9 30%, transparent 100%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
            <style>{`
              @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .rolling-belt { display: flex; align-items: center; animation: scroll 30s linear infinite; width: max-content; }
            `}</style>
            <div className="rolling-belt">
              {[
                { name: 'CNN', style: { fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' } },
                { name: 'Mozilla Foundation', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'qPress', style: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' } },
                { name: 'Emblazer', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 800 } },
                { name: 'Go2ANDAMAN', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'homeloft', style: { fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400 } },
                { name: 'HUMA', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' } },
                { name: 'Pasqal', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 600 } },
                { name: 'MAERSK', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' } },
                { name: 'United Healthcare', style: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700 } },
                
                { name: 'CNN', style: { fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' } },
                { name: 'Mozilla Foundation', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'qPress', style: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' } },
                { name: 'Emblazer', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 800 } },
                { name: 'Go2ANDAMAN', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'homeloft', style: { fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400 } },
                { name: 'HUMA', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' } },
                { name: 'Pasqal', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 600 } },
                { name: 'MAERSK', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' } },
                { name: 'United Healthcare', style: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700 } },
              ].map((brand, i) => (
                <div key={i} style={{ padding: '0 3rem', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={brand.style as React.CSSProperties}>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Footer Area ── */}
      <div className="bg-el-bg py-16 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Column 1: Tell us about the project (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xl text-slate-800 tracking-tight">
              Tell us about the project
            </h4>
            <a
              href="mailto:contact@enlightlab.com"
              className="inline-block text-sm text-blue-700 hover:text-blue-800 underline font-bold transition-colors"
            >
              Write to us
            </a>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mt-3">
              CareScribe AI is a product by Enlight Lab empowering startups and growing companies with impactful AI-powered software.
            </p>
            <div className="pt-4">
              <span className="text-xs tracking-widest text-slate-400 uppercase block mb-3">
                FOLLOW US ON
              </span>
              <div className="flex gap-3">
                {/* Facebook Button */}
                <a
                  href="https://www.facebook.com/enlightlabfb/"
                  className="w-9 h-9 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                
                {/* LinkedIn Button */}
                <a
                  href="https://www.linkedin.com/company/enlightlab/"
                  className="w-9 h-9 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: PRODUCT */}
          <div>
            <h5 className="text-sm tracking-widest text-blue-700 uppercase mb-5">
              PRODUCT
            </h5>
            <ul className="space-y-3.5 text-sm text-slate-500">
              <li>
                <a href="#features" className="hover:text-blue-700 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-700 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-blue-700 transition-colors">
                  Demo
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-700 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-blue-700 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div>
            <h5 className="text-sm tracking-widest text-blue-700 uppercase mb-5">
              COMPANY
            </h5>
            <ul className="space-y-3.5 text-sm text-slate-500">
              <li>
                <a href="https://enlightlab.com/about" className="hover:text-blue-700 transition-colors">
                  About Enlight Lab
                </a>
              </li>
              <li>
                <a href="https://enlightlab.com/case-studies/" className="hover:text-blue-700 transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="https://enlightlab.com/blog/" className="hover:text-blue-700 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://enlightlab.com/contact" className="hover:text-blue-700 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div>
            <h5 className="text-sm tracking-widest text-blue-700 uppercase mb-5">
              LEGAL
            </h5>
            <ul className="space-y-3.5 text-sm text-slate-500">
              <li>
                <a href="https://enlightlab.com/privacy-policy/" className="hover:text-blue-700 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://enlightlab.com/website-service-usage-terms-conditions/" className="hover:text-blue-700 transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="max-w-7xl mx-auto border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <span>© 2026 Enlight Lab. All rights reserved.</span>
          <span>CareScribe AI — a product by Enlight Lab</span>
        </div>
      </div>
    </footer>
  );
}