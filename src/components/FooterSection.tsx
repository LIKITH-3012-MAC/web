import FadeIn from './FadeIn';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/likith-naidu-anumakonda-33a347327' },
    { label: 'GitHub', url: 'https://github.com/LIKITH-3012-MAC' },
    { label: 'Google Dev', url: 'https://g.dev/likithai' },
    { label: 'X / Twitter', url: 'https://x.com/Likithdob301206' },
    { label: 'Instagram', url: 'https://instagram.com/likhith_anumakonda' },
  ];

  const localResources = [
    { label: 'SAKRA VISION (Company)', url: 'https://likith-3012-mac.github.io/SAKRA-VISION/' },
    { label: 'GitHub Hub Interface', url: '/likith-git-profile.html' },
    { label: 'YouTube Hub', url: '/likith-youtube.html' },
    { label: 'Collab Submission', url: '/collab.html' },
    { label: 'Download Resume (PDF)', url: '/LIKITH-resume.pdf', download: true },
  ];

  return (
    <footer id="contact" className="bg-[#0C0C0C] text-[#D7E2EA] border-t border-[#D7E2EA]/10 px-6 md:px-10 py-16 sm:py-20 md:py-24 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* Top footer row: Title and Direct Contact */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <FadeIn delay={0} y={20}>
            <div className="flex flex-col gap-2">
              <span className="hero-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-none">
                Get In Touch
              </span>
              <p className="text-sm uppercase tracking-widest opacity-60">
                Let&apos;s build something striking together
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1} y={20}>
            <a
              href="mailto:likith.anumakonda@gmail.com"
              className="text-lg sm:text-xl md:text-2xl font-light hover:text-white transition-colors duration-200 underline underline-offset-8 decoration-[#D7E2EA]/30 hover:decoration-white"
            >
              likith.anumakonda@gmail.com
            </a>
          </FadeIn>
        </div>

        {/* Middle footer row: Resource and Social grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 border-t border-[#D7E2EA]/10 pt-12 sm:pt-16">
          
          {/* Navigation links */}
          <FadeIn delay={0.2} y={20} className="flex flex-col gap-4">
            <h4 className="font-medium uppercase tracking-widest text-xs opacity-40">Navigate</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#about" className="hover:opacity-75 transition-opacity text-sm uppercase tracking-wider">About</a>
              <a href="#price" className="hover:opacity-75 transition-opacity text-sm uppercase tracking-wider">Services</a>
              <a href="#projects" className="hover:opacity-75 transition-opacity text-sm uppercase tracking-wider">Projects</a>
            </div>
          </FadeIn>

          {/* Social connections */}
          <FadeIn delay={0.3} y={20} className="flex flex-col gap-4">
            <h4 className="font-medium uppercase tracking-widest text-xs opacity-40">Networks</h4>
            <div className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity text-sm uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </FadeIn>

          {/* Internal Local resources */}
          <FadeIn delay={0.4} y={20} className="flex flex-col gap-4">
            <h4 className="font-medium uppercase tracking-widest text-xs opacity-40">Resources</h4>
            <div className="flex flex-col gap-2.5">
              {localResources.map((res) => (
                <a
                  key={res.label}
                  href={res.url}
                  download={res.download}
                  className="hover:opacity-75 transition-opacity text-sm uppercase tracking-wider"
                >
                  {res.label}
                </a>
              ))}
            </div>
          </FadeIn>

        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[#D7E2EA]/10 pt-8 mt-4 text-xs tracking-widest uppercase opacity-40">
          <span>&copy; {currentYear} Likith Portfolio. All rights reserved.</span>
          <span>Likith Naidu Anumakonda &bull; Founder, <a href="https://likith-3012-mac.github.io/SAKRA-VISION/" target="_blank" rel="noopener noreferrer" className="hover:underline">SAKRA VISION</a></span>
        </div>

      </div>
    </footer>
  );
}
