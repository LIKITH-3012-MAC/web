import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from './LiveProjectButton';

interface ProjectData {
  number: string;
  category: string;
  name: string;
  url: string;
  github: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
}

const projects: ProjectData[] = [
  {
    number: '01',
    category: 'Flagship App',
    name: 'Prometheus AI V2.0',
    url: 'https://prometheuslikiths-ai.online',
    github: 'https://github.com/LIKITH-3012-MAC/my_chatbot.git',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    number: '02',
    category: 'Live Project',
    name: 'Resolvit-AI',
    url: 'https://resolvit-ai.online',
    github: 'https://github.com/LIKITH-3012-MAC/SYNAPTIX_2026_404-FOUND_TEAM.git',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    number: '03',
    category: 'Offline LLM',
    name: 'BenchAI',
    url: 'https://github.com/LIKITH-3012-MAC',
    github: 'https://github.com/LIKITH-3012-MAC',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
  {
    number: '04',
    category: 'Custom SaaS',
    name: 'Forms Project',
    url: 'https://forms-project-f3sb.vercel.app/',
    github: 'https://github.com/LIKITH-3012-MAC',
    col1Image1: '/resolvit.png',
    col1Image2: '/ai-concierge.png',
    col2Image: '/A_breathtaking_ultrawide_cinematic_landscape_photo_delpmaspu.png',
  },
  {
    number: '05',
    category: 'IoT & AI',
    name: 'Aqua Sentinel',
    url: 'https://aquq-sentinel-phsv.vercel.app/',
    github: 'https://github.com/LIKITH-3012-MAC',
    col1Image1: '/ai-concierge.png',
    col1Image2: '/resolvit.png',
    col2Image: '/A_breathtaking_ultrawide_cinematic_landscape_photo_delpmaspu.png',
  },
];

const totalCards = projects.length;

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={containerRef} className="h-[85vh] sticky top-24 md:top-32" style={{ top: `${index * 28}px` }}>
      <motion.div
        style={{ scale }}
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 h-full flex flex-col origin-top"
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
            <span
              className="hero-heading font-black leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-1 pt-2 sm:pt-4">
              <span className="text-[#D7E2EA] font-light uppercase tracking-widest text-xs sm:text-sm opacity-60">
                {project.category}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span
                  className="text-[#D7E2EA] font-medium uppercase"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {project.name}
                </span>
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D7E2EA] opacity-40 hover:opacity-100 transition-opacity underline font-light"
                  >
                    View Code
                  </a>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D7E2EA] opacity-40 hover:opacity-100 transition-opacity underline font-light sm:hidden"
                  >
                    Live Project
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <LiveProjectButton href={project.url} />
          </div>
        </div>

        {/* Bottom row - Image grid */}
        <div className="flex gap-3 sm:gap-4 md:gap-6 flex-1 min-h-0">
          {/* Left column - 40% width, 2 stacked images */}
          <div className="w-[40%] flex flex-col gap-3 sm:gap-4 md:gap-6">
            <img
              src={project.col1Image1}
              alt={`${project.name} preview 1`}
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.col1Image2}
              alt={`${project.name} preview 2`}
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          {/* Right column - 60% width, 1 tall image */}
          <div className="w-[60%]">
            <img
              src={project.col2Image}
              alt={`${project.name} main`}
              className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Project
      </h2>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.number} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
