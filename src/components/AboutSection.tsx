import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

const decorativeImages = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    alt: 'Moon icon',
    className: 'w-[120px] sm:w-[160px] md:w-[210px] absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    fadeProps: { delay: 0.1, x: -80, y: 0, duration: 0.9 },
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    alt: '3D object',
    className: 'w-[100px] sm:w-[140px] md:w-[180px] absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    fadeProps: { delay: 0.25, x: -80, y: 0, duration: 0.9 },
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    alt: 'Lego icon',
    className: 'w-[120px] sm:w-[160px] md:w-[210px] absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    fadeProps: { delay: 0.15, x: 80, y: 0, duration: 0.9 },
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    alt: '3D group',
    className: 'w-[130px] sm:w-[170px] md:w-[220px] absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    fadeProps: { delay: 0.3, x: 80, y: 0, duration: 0.9 },
  },
];

const aboutText =
  "I am a multidimensional engineer and builder from Andhra Pradesh, India. I don't just write code; I design systems. From offline LLM architectures to civic intelligence platforms, my focus is always on creating elegant solutions to complex data problems.";

const secondaryAboutText =
  "My approach blends deep technical rigor in Python, Java SE, and AI models with a refined aesthetic sense, ensuring that every product I build is not only highly performant but also visually and experientially world-class.";

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen relative flex items-center justify-center px-5 sm:px-8 md:px-10 py-20">
      {/* Decorative 3D images */}
      {decorativeImages.map((img, i) => (
        <FadeIn key={i} delay={img.fadeProps.delay} x={img.fadeProps.x} y={img.fadeProps.y} duration={img.fadeProps.duration} className={img.className}>
          <img src={img.src} alt={img.alt} className="w-full h-auto" />
        </FadeIn>
      ))}

      {/* Main content */}
      <div className="flex flex-col items-center text-center z-10">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center max-w-4xl"
              style={{ fontSize: 'clamp(2.2rem, 8vw, 120px)' }}
            >
              The Architecture of Identity
            </h2>
          </FadeIn>

          <AnimatedText
            text={aboutText}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[650px]"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}
          />

          <FadeIn delay={0.2} y={30}>
            <p
              className="text-[#D7E2EA]/60 font-light text-center leading-relaxed max-w-[650px] mt-4"
              style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}
            >
              {secondaryAboutText}
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 sm:mt-20 md:mt-24">
          <FadeIn delay={0.3} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
