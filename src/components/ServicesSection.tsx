import FadeIn from './FadeIn';

const services = [
  {
    number: '01',
    name: 'Intelligent Systems',
    description:
      'Designing and deploying autonomous AI agents, multi-step RAG pipelines, and conversational interfaces tailored to complex business workflows.',
  },
  {
    number: '02',
    name: 'AI/ML Architectures',
    description:
      'Building local-first, privacy-focused generative AI systems, and optimizing model performance utilizing tools like Llama and Apple MLX.',
  },
  {
    number: '03',
    name: 'Full-Stack Engineering',
    description:
      'Architecting highly scalable backends with FastAPI and Node.js, secure API integrations, caching layers, and database clusters.',
  },
  {
    number: '04',
    name: 'Data Logic & Analytics',
    description:
      'Implementing robust client-side visitor analytics tracking, database schemas, transactional record storage, and background processing systems.',
  },
  {
    number: '05',
    name: 'Creative Engineering',
    description:
      'Designing clean, modern, and highly interactive user interfaces with physics-based micro-animations and custom dark-theme layouts.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="price"
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Services
      </h2>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={30}>
            <div
              className="flex items-start gap-6 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
              style={{
                borderBottom: i < services.length - 1 ? '1px solid rgba(12, 12, 12, 0.15)' : 'none',
                borderTop: i === 0 ? '1px solid rgba(12, 12, 12, 0.15)' : 'none',
              }}
            >
              <span
                className="font-black text-[#0C0C0C] leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col gap-2 pt-2 sm:pt-4 md:pt-6">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed text-[#0C0C0C] max-w-2xl opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
